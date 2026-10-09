// 공개/비공개 상태를 읽고 바꾸는 서버 쪽 핵심 로직
// (Netlify 함수 netlify/functions/status.mjs 가 이것을 쓴다. 저장소(store)를 바꿔 끼울 수 있어서 따로 시험할 수 있다.)
//
//   GET  /api/status                         → { open }
//   POST /api/status { password, check: true } → 비밀번호 확인만  { ok: true }
//   POST /api/status { password, open }        → 상태 바꾸기      { open }
//
// 관리자 비밀번호는 Netlify 환경 변수 ADMIN_PASSWORD 에만 둔다. (공개 저장소라 파일에 적지 않음)

import { timingSafeEqual } from "node:crypto";

const KEY = "status";
const DEFAULT_OPEN = true; // 처음 배포했을 때는 공개

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

export async function readOpen(store) {
  const saved = await store.get(KEY, { type: "json" });
  return typeof saved?.open === "boolean" ? saved.open : DEFAULT_OPEN;
}

export async function handleStatus(req, { store, adminPassword, failDelayMs = 1000 }) {
  if (req.method === "GET") return json({ open: await readOpen(store) });
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
  if (typeof body.open !== "boolean") return json({ error: "open 값(true/false)이 필요합니다." }, 400);

  await store.setJSON(KEY, { open: body.open, changedAt: new Date().toISOString() });
  return json({ open: body.open });
}
