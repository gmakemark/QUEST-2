// 수업 화면 ↔ 정답 창(다른 모니터) 사이에 "지금 어느 STEP 의 어느 주제를 보고 있는지"를 주고받는다.
// 같은 컴퓨터, 같은 브라우저의 창끼리만 통하는 BroadcastChannel 을 쓴다.

const NAME = "cospro-class";
let channel = null;
const getChannel = () => {
  if (!channel && typeof BroadcastChannel !== "undefined") channel = new BroadcastChannel(NAME);
  return channel;
};

export function postPosition(step, anchor) {
  getChannel()?.postMessage({ step, anchor });
}

export function onPosition(fn) {
  const ch = getChannel();
  if (!ch) return () => {};
  const handler = (e) => !e.data.edits && fn(e.data);
  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}

// 관리자가 수업 칸을 고치면 정답 창에도 바로 알린다
export function postEdits(edits) {
  getChannel()?.postMessage({ edits });
}

export function onEdits(fn) {
  const ch = getChannel();
  if (!ch) return () => {};
  const handler = (e) => e.data.edits && fn(e.data.edits);
  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}

// 관리자로 로그인했다는 표시. window.open 으로 연 창에는 sessionStorage 가 복사되어 정답 창이 이것을 확인한다.
const ADMIN_KEY = "class.admin";
export function setAdminSession(on) {
  try {
    if (on) sessionStorage.setItem(ADMIN_KEY, "1");
    else sessionStorage.removeItem(ADMIN_KEY);
  } catch {}
}
export function hasAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_KEY) === "1";
  } catch {
    return false;
  }
}

export function openAnswerWindow(step) {
  const url = `${window.location.pathname}?answers&step=${step}`;
  window.open(url, "cospro-class-answers", "width=900,height=1000");
}
