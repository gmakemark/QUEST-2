// STEP 공개/비공개 상태를 읽고 바꾸는 서버 쪽 핵심 로직
// (Netlify 함수 netlify/functions/status.mjs 가 이것을 쓴다. 저장소(store)를 바꿔 끼울 수 있어서 따로 시험할 수 있다.)
//
//   GET  /api/status                               → { steps: { "1": true, "2": false, "3": false }, edits }
//   POST /api/status { password, check: true }      → 비밀번호 확인만  { ok: true }
//   POST /api/status { password, step: 2, open }    → STEP 하나 공개/비공개  { steps }
//        비공개로 바꿀 때는 onClose(step, 모두비공개?) 로 그 STEP 의 작업을 정리한다  { steps, reset: { removed, cleaned } }
//   POST /api/status { password, edit: { key, value } } → 관리자가 고친 수업 칸 하나 저장(value = null 이면 원래대로)  { edits }
//        edits = { "<블록 이름>": { base, fields: { 이름: 글 } } }  (모양은 src/lib/edits.js 참고)
//
// 관리자 비밀번호는 Netlify 환경 변수 ADMIN_PASSWORD 에만 둔다. (공개 저장소라 파일에 적지 않음)

import { timingSafeEqual } from "node:crypto";

const KEY = "steps";
const EDITS_KEY = "edits";
const MAX_EDITS_BYTES = 1_000_000;
const BLOCK_KEY = /^[a-z0-9-]{1,80}$/;
export const LOCKABLE = ["1", "2", "3"];
const DEFAULT_STEPS = { 1: true, 2: false, 3: false }; // 처음 배포했을 때는 STEP1 만 공개

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
  if (req.method === "GET") return json({ steps: await readSteps(store), edits: await readEdits(store) });
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
  if (body.edit) return saveEdit(store, body.edit);

  const step = String(body.step);
  if (!LOCKABLE.includes(step)) return json({ error: "step 은 1, 2, 3 중 하나여야 합니다." }, 400);
  if (typeof body.open !== "boolean") return json({ error: "open 값(true/false)이 필요합니다." }, 400);

  const steps = { ...(await readSteps(store)), [step]: body.open };
  await store.setJSON(KEY, { ...steps, changedAt: new Date().toISOString() });
  const allClosed = LOCKABLE.every((s) => !steps[s]);
  const reset = !body.open && onClose ? await onClose(step, allClosed) : undefined;
  return json({ steps, reset });
}

export async function readEdits(store) {
  return (await store.get(EDITS_KEY, { type: "json" })) || {};
}

const isText = (v) => typeof v === "string";

async function saveEdit(store, { key, value } = {}) {
  if (!BLOCK_KEY.test(String(key))) return json({ error: "칸 이름이 올바르지 않습니다." }, 400);
  if (value !== null && !(value && isText(value.base) && value.fields && typeof value.fields === "object" && Object.values(value.fields).every(isText)))
    return json({ error: "고친 내용의 형식이 올바르지 않습니다." }, 400);
  const edits = await readEdits(store);
  if (value) edits[key] = { base: value.base, fields: value.fields, changedAt: new Date().toISOString() };
  else delete edits[key];
  if (JSON.stringify(edits).length > MAX_EDITS_BYTES) return json({ error: "고친 내용이 너무 많습니다(1MB 넘음)." }, 413);
  await store.setJSON(EDITS_KEY, edits);
  return json({ edits });
}
