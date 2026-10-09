// 관리자 비밀번호 확인
//
// [배포 사이트 (Netlify)]  서버 함수가 환경 변수 ADMIN_PASSWORD 와 비교한다. 비밀번호는 어떤 파일에도 없다.
// [내 컴퓨터 (npm run dev)] 서버 함수가 없으므로 예전처럼 SHA-256 해시로 비교한다.
//    - .env.local 의 VITE_ADMIN_PASSWORD_HASH 가 있으면 그것을 쓰고
//    - 없으면 처음 관리자 모드에 들어갈 때 그 브라우저에 새로 만든다.
//
// 확인에 성공한 비밀번호는 공개/비공개를 바꿀 때 다시 서버에 보내야 해서, 새로고침 전까지 메모리에만 들고 있는다.

import { readLS, writeLS } from "./storage";
import { checkServerPassword } from "./siteStatus";

const LS_KEY = "cospro.adminHash";
const ENV_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH || "").trim().toLowerCase();

let sessionPassword = "";
export const getSessionPassword = () => sessionPassword;

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isPasswordFromEnv() {
  return !!ENV_HASH;
}

// 내 컴퓨터에서 쓰는 비밀번호가 이미 있는지 (배포 사이트에서는 늘 있음)
export function hasPassword(serverMode) {
  return serverMode || !!(ENV_HASH || readLS(LS_KEY, ""));
}

export async function checkPassword(pw, serverMode) {
  let ok;
  if (serverMode) ok = await checkServerPassword(pw);
  else {
    const target = ENV_HASH || readLS(LS_KEY, "");
    ok = !!target && (await sha256(pw)) === target;
  }
  if (ok) sessionPassword = pw;
  return ok;
}

export async function setLocalPassword(pw) {
  writeLS(LS_KEY, await sha256(pw));
  sessionPassword = pw;
}
