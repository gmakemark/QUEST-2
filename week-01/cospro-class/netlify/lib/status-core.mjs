// STEP 공개/비공개 상태를 읽고 바꾸는 서버 쪽 핵심 로직
// (Netlify 함수 netlify/functions/status.mjs 가 이것을 쓴다. 저장소(store)를 바꿔 끼울 수 있어서 따로 시험할 수 있다.)
//
//   GET  /api/status                               → { steps: { "2": false, "3": false } }
//   POST /api/status { password, check: true }      → 비밀번호 확인만  { ok: true }
//   POST /api/status { password, step: 2, open }    → STEP 하나 공개/비공개  { steps }
//        비공개로 바꿀 때는 onClose() 로 수강생 계정과 작업을 지운다  { steps, reset: { removed, kept } }
//
// STEP1 은 언제나 공개라서 저장하지 않는다.
// 관리자 비밀번호는 Netlify 환경 변수 ADMIN_PASSWORD 에만 둔다. (공개 저장소라 파일에 적지 않음)

import { timingSafeEqual } from "node:crypto";

const KEY = "steps";
export const LOCKABLE = ["2", "3"];
const DEFAULT_STEPS = { 2: false, 3: false }; // 처음 배포했을 때는 STEP1 만 공개

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function samePassword(given, expected) {
  const a = Buffer.from(String(given ?? ""));
  const b = Buffer.from(String(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function readSteps(store) {
  const saved = (await store.get(KEY, { type: "json" })) || {};
  return Object.fromEntries(LOCKABLE.map((s) => [s, typeof saved[s] === "boolean" ? saved[s] : DEFAULT_STEPS[s]]));
}

export async function handleStatus(req, { store, adminPassword, onClose, failDelayMs = 1000 }) {
  if (req.method === "GET") return json({ steps: await readSteps(store) });
  if (req.method !== "POST") return json({ error: "지원하지 않는 요청입니다." }, 405);

  if (!adminPassword) return json({ error: "서버에 관리자 비밀번호(ADMIN_PASSWORD 환경 변수)가 설정되지 않았습니다." }, 500);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (!samePassword(body.password, adminPassword)) {
    await sleep(failDelayMs); // 비밀번호를 마구 넣어 보는 것을 느리게
    return json({ error: "비밀번호가 틀렸습니다." }, 401);
  }
  if (body.check) return json({ ok: true });

  const step = String(body.step);
  if (!LOCKABLE.includes(step)) return json({ error: "step 은 2 또는 3 이어야 합니다." }, 400);
  if (typeof body.open !== "boolean") return json({ error: "open 값(true/false)이 필요합니다." }, 400);

  const steps = { ...(await readSteps(store)), [step]: body.open };
  await store.setJSON(KEY, { ...steps, changedAt: new Date().toISOString() });
  const reset = !body.open && onClose ? await onClose() : undefined;
  return json({ steps, reset });
}
