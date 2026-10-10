// 계정 로그인과 작업 저장 (배포 사이트의 서버 함수 /api/class 와 주고받는다)
//  - 로그인하면 서버에 저장된 작업을 받아 storage.js 에 넣고, 그 뒤 바뀔 때마다 1초 모아서 서버에 저장한다.
//  - 로그인 토큰만 이 브라우저에 남겨 두어, 다음에 열 때 자동으로 로그인한다.
//  - 관리자가 STEP 을 비공개로 바꾸면 수강생 계정이 지워지므로, 다음 저장·불러오기에서 로그아웃된다.

import { setRemoteStore } from "./storage";

const URL = "/api/class";
const TOKEN_KEY = "class.token";
const SAVE_DELAY = 1000;

let state = { user: null, save: "saved", notice: "" }; // user: { id, admin } | null,  save: saved | saving | error
let token = "";
let data = null;
let timer = null;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn(state));
}

export const getAccount = () => state;
export function subscribeAccount(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}
function writeToken(t) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

async function call(method, body, { keepalive = false } = {}) {
  const res = await fetch(URL, {
    method,
    cache: "no-store",
    keepalive,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || `서버 오류 (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

function signedIn(t, res) {
  token = t;
  writeToken(t);
  data = { ...res.data };
  setRemoteStore(data, scheduleSave);
  setState({ user: { id: res.id, admin: !!res.admin }, save: "saved", notice: "" });
}

function signedOut(notice = "") {
  clearTimeout(timer);
  timer = null;
  token = "";
  data = null;
  writeToken("");
  setRemoteStore(null);
  setState({ user: null, save: "saved", notice });
}

// 페이지를 열 때: 남겨 둔 토큰이 있으면 작업을 불러온다
export async function restoreLogin() {
  token = readToken();
  if (!token) return;
  try {
    signedIn(token, await call("GET"));
  } catch (err) {
    if (err.status === 401) signedOut("로그인이 끝났습니다. 다시 로그인해 주세요.");
    else signedOut("서버에 연결하지 못해 이 브라우저에만 저장합니다.");
  }
}

export async function login(id, pw, isNew) {
  token = "";
  const res = await call("POST", { action: isNew ? "signup" : "login", id, pw });
  signedIn(res.token, res);
}

export async function logout() {
  await flushSave();
  signedOut();
}

// 관리자 모드로 들어갈 때: 로그인한 계정을 관리자 계정으로 표시 (STEP 을 비공개로 바꿔도 계정과 칸이 남는다)
export async function promoteToAdmin(password) {
  if (!state.user || state.user.admin) return;
  await call("POST", { action: "promote", password });
  setState({ user: { ...state.user, admin: true } });
}

// 서버에서 다시 받아 오기 (STEP 을 비공개로 바꿔 서버의 작업이 정리된 뒤)
export async function reloadWork() {
  if (!token) return;
  clearTimeout(timer);
  timer = null;
  try {
    signedIn(token, await call("GET"));
  } catch (err) {
    if (err.status === 401) signedOut("계정이 지워졌습니다.");
  }
}

function scheduleSave() {
  setState({ save: "saving" });
  clearTimeout(timer);
  timer = setTimeout(() => flushSave(), SAVE_DELAY);
}

export async function flushSave({ keepalive = false } = {}) {
  if (!timer || !data) return;
  clearTimeout(timer);
  timer = null;
  try {
    await call("PUT", { data }, { keepalive });
    if (!timer) setState({ save: "saved" });
  } catch (err) {
    if (err.status === 401) signedOut("로그인이 끝났습니다(관리자가 수업을 정리함). 다시 가입해 주세요.");
    else {
      setState({ save: "error" });
      timer = setTimeout(() => flushSave(), 5000); // 잠시 뒤 다시 시도
    }
  }
}

// 저장 대기 중에 창을 닫아도 마지막 내용을 보낸다
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => flushSave({ keepalive: true }));
}
