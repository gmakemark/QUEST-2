// 수강생·관리자 계정과, 계정마다 저장한 작업(고친 코드, +코드/+텍스트 칸)을 다루는 서버 쪽 핵심 로직
// (Netlify 함수 netlify/functions/class.mjs 가 이것을 쓴다. 저장소(store)를 바꿔 끼울 수 있어서 따로 시험할 수 있다.)
//
//   POST /api/class { action: "signup", id, pw }   → 가입하고 바로 로그인  { token, id, admin, data }
//   POST /api/class { action: "login", id, pw }    → 로그인  { token, id, admin, data }
//   GET  /api/class           (Authorization: Bearer 토큰) → 내 작업 불러오기  { id, admin, data }
//   PUT  /api/class { data }  (Authorization: Bearer 토큰) → 내 작업 저장  { ok: true }
//   POST /api/class { action: "promote", password } (토큰) → 관리자 비밀번호가 맞으면 이 계정을 "관리자 계정"으로 표시
//
// 저장소 안의 이름
//   users/<아이디>  → { salt, hash, ver, admin, createdAt }   비밀번호는 scrypt 해시로만 저장
//   data/<아이디>   → { "class.code.s1-print": "...", "class.cells.step1": "[...]", ... }  브라우저 저장 이름 그대로
//
// 토큰은 "아이디.ver.서명" 이다. 서명 열쇠는 환경 변수 ADMIN_PASSWORD 에서 만든다.
// 계정이 지워지면(ver 가 사라지면) 예전 토큰은 더 쓸 수 없다.

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const MAX_DATA_BYTES = 1_000_000; // 한 사람이 저장할 수 있는 크기 (1MB)
const ID_RULE = /^[a-z0-9_]{3,20}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const userKey = (id) => `users/${id}`;
const dataKey = (id) => `data/${id}`;

function sameText(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && timingSafeEqual(x, y);
}

const hashPw = (pw, salt) => scryptSync(String(pw), salt, 32).toString("hex");
const sign = (secret, text) => createHmac("sha256", "cospro-class:" + secret).update(text).digest("hex");

function makeToken(secret, id, ver) {
  const body = `${id}.${ver}`;
  return `${body}.${sign(secret, body)}`;
}

// 토큰이 맞으면 { id, user } 를, 아니면 null 을 돌려준다
async function readToken(req, store, secret) {
  const m = (req.headers.get("authorization") || "").match(/^Bearer (.+)$/);
  if (!m) return null;
  const [id, ver, sig] = m[1].split(".");
  if (!id || !ver || !sig || !sameText(sig, sign(secret, `${id}.${ver}`))) return null;
  const user = await store.get(userKey(id), { type: "json" });
  if (!user || user.ver !== ver) return null;
  return { id, user };
}

export async function handleClass(req, { store, adminPassword, failDelayMs = 1000 }) {
  if (!adminPassword) return json({ error: "서버에 ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다." }, 500);
  const secret = adminPassword;
  const expired = () => json({ error: "로그인이 끝났습니다. 다시 로그인해 주세요." }, 401);

  if (req.method === "GET") {
    const me = await readToken(req, store, secret);
    if (!me) return expired();
    const data = (await store.get(dataKey(me.id), { type: "json" })) || {};
    return json({ id: me.id, admin: !!me.user.admin, data });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (req.method === "PUT") {
    const me = await readToken(req, store, secret);
    if (!me) return expired();
    const data = body?.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "data 가 필요합니다." }, 400);
    const clean = {};
    for (const [k, v] of Object.entries(data)) if (k.startsWith("class.") && typeof v === "string") clean[k] = v;
    if (JSON.stringify(clean).length > MAX_DATA_BYTES) return json({ error: "저장할 내용이 너무 큽니다(1MB 넘음)." }, 413);
    await store.setJSON(dataKey(me.id), clean);
    return json({ ok: true });
  }

  if (req.method !== "POST") return json({ error: "지원하지 않는 요청입니다." }, 405);

  if (body.action === "signup" || body.action === "login") {
    const id = String(body.id ?? "").trim().toLowerCase();
    const pw = String(body.pw ?? "");
    if (!ID_RULE.test(id)) return json({ error: "아이디는 영어 소문자·숫자·_ 로 3~20글자" }, 400);
    if (pw.length < 4 || pw.length > 100) return json({ error: "비밀번호는 4글자 이상" }, 400);

    let user = await store.get(userKey(id), { type: "json" });
    if (body.action === "signup") {
      if (user) return json({ error: "이미 있는 아이디입니다." }, 409);
      const salt = randomBytes(16).toString("hex");
      user = { salt, hash: hashPw(pw, salt), ver: randomBytes(6).toString("hex"), admin: false, createdAt: new Date().toISOString() };
      await store.setJSON(userKey(id), user);
    } else if (!user || !sameText(hashPw(pw, user.salt), user.hash)) {
      await sleep(failDelayMs); // 비밀번호를 마구 넣어 보는 것을 느리게
      return json({ error: "아이디나 비밀번호가 틀렸습니다." }, 401);
    }
    const data = (await store.get(dataKey(id), { type: "json" })) || {};
    return json({ token: makeToken(secret, id, user.ver), id, admin: !!user.admin, data });
  }

  if (body.action === "promote") {
    const me = await readToken(req, store, secret);
    if (!me) return expired();
    if (!sameText(body.password, adminPassword)) {
      await sleep(failDelayMs);
      return json({ error: "비밀번호가 틀렸습니다." }, 401);
    }
    if (!me.user.admin) await store.setJSON(userKey(me.id), { ...me.user, admin: true });
    return json({ ok: true, admin: true });
  }

  return json({ error: "알 수 없는 action 입니다." }, 400);
}

// 관리자가 STEP 을 비공개로 바꿀 때 부른다.
//  - 수강생 계정: 아이디·비밀번호와 저장한 작업을 모두 지운다.
//  - 관리자 계정(관리자 모드로 들어간 적 있는 계정): 아이디·비밀번호와 +코드/+텍스트 칸은 남기고, 고친 코드·빈칸 답은 지운다.
export async function resetClass(store) {
  const { blobs } = await store.list({ prefix: "users/" });
  let removed = 0;
  let kept = 0;
  for (const { key } of blobs) {
    const id = key.slice("users/".length);
    const user = await store.get(key, { type: "json" });
    if (!user?.admin) {
      await store.delete(key);
      await store.delete(dataKey(id));
      removed++;
      continue;
    }
    const data = (await store.get(dataKey(id), { type: "json" })) || {};
    await store.setJSON(dataKey(id), keepOwnCells(data));
    kept++;
  }
  return { removed, kept };
}

// 저장한 작업에서 +코드/+텍스트 칸(칸 목록과 +코드 칸 안의 코드)만 남긴다
export function keepOwnCells(data) {
  const out = {};
  const cellIds = new Set();
  for (const [k, v] of Object.entries(data)) {
    if (!k.startsWith("class.cells.")) continue;
    out[k] = v;
    try {
      for (const c of JSON.parse(v)) if (c?.id) cellIds.add(c.id);
    } catch {}
  }
  for (const id of cellIds) {
    for (const k of [`class.code.${id}`, `class.stdin.${id}`]) if (k in data) out[k] = data[k];
  }
  return out;
}
