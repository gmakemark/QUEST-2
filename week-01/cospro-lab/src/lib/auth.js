// 관리자 비밀번호 확인
// 비밀번호를 파일에 그대로 적지 않으려고 SHA-256 해시만 비교한다.
//  - .env.local 의 VITE_ADMIN_PASSWORD_HASH 가 있으면 그것을 쓰고
//  - 없으면 처음 관리자 모드에 들어갈 때 그 브라우저에 새로 만든다.
// 주의: 서버 없는 웹앱이라 이것은 "학생이 실수로 들어가지 않게 하는 잠금" 정도입니다.
//       브라우저 개발자 도구를 아는 사람은 우회할 수 있습니다.

import { readLS, writeLS } from "./storage";

const LS_KEY = "cospro.adminHash";
const ENV_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH || "").trim().toLowerCase();

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isPasswordFromEnv() {
  return !!ENV_HASH;
}

export function hasPassword() {
  return !!(ENV_HASH || readLS(LS_KEY, ""));
}

export async function checkPassword(pw) {
  const target = ENV_HASH || readLS(LS_KEY, "");
  return !!target && (await sha256(pw)) === target;
}

export async function setLocalPassword(pw) {
  writeLS(LS_KEY, await sha256(pw));
}
