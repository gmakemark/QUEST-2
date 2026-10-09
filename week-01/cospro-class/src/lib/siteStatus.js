// STEP 공개/비공개 상태 (배포 사이트의 서버 함수 /api/status 와 주고받는다)
// 내 컴퓨터에서 npm run dev 로 볼 때는 서버 함수가 없으므로 "서버 없음 · 모든 STEP 미리보기" 로 본다.

const URL = "/api/status";

/** { server: 서버 함수가 있는지, steps: { "2": 공개?, "3": 공개? } } */
export async function fetchSiteStatus() {
  try {
    const res = await fetch(URL, { cache: "no-store" });
    // 서버 함수가 없으면 개발 서버가 HTML 을 돌려준다
    if (!res.ok || !(res.headers.get("content-type") || "").includes("application/json")) throw new Error("no server");
    const data = await res.json();
    return { server: true, steps: { 2: !!data.steps?.["2"], 3: !!data.steps?.["3"] } };
  } catch {
    return { server: false, steps: { 2: true, 3: true } };
  }
}

async function post(body) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

/** 관리자 비밀번호가 맞는지 서버에 묻는다. 틀리면 false, 서버 설정 문제면 오류를 던진다. */
export async function checkServerPassword(password) {
  const { status, data } = await post({ password, check: true });
  if (status === 200) return true;
  if (status === 401) return false;
  throw new Error(data.error || `서버 오류 (${status})`);
}

/** STEP 하나를 공개/비공개로 바꾸고, 바뀐 전체 상태를 돌려준다. */
export async function setStepOpen(step, open, password) {
  const { status, data } = await post({ password, step, open });
  if (status !== 200) throw new Error(data.error || `서버 오류 (${status})`);
  return { 2: !!data.steps["2"], 3: !!data.steps["3"] };
}
