// 브라우저 저장(localStorage) 도우미
// 수업 중에 고쳐 본 코드와 입력값은 새로고침해도 남도록 블록마다 저장한다.
// (같은 컴퓨터의 cospro-lab 과 섞이지 않도록 이름 앞에 class. 를 붙인다)
//
// 로그인하면 작업(고친 코드, 빈칸 답, +코드/+텍스트 칸)은 브라우저 대신 계정 저장 공간(account.js)으로 간다.
// 화면 설정(테마, 목차 접기, 보던 STEP)은 로그인과 상관없이 늘 이 브라우저에 저장한다.

const WORK_PREFIXES = ["class.code.", "class.stdin.", "class.blanks.", "class.cells."];
const isWork = (key) => WORK_PREFIXES.some((p) => key.startsWith(p));

let remote = null; // 로그인했을 때: { data: {이름: 값}, onChange(이름) }

/** 로그인하면 계정의 작업을, 로그아웃하면 null 을 넣는다. */
export function setRemoteStore(data, onChange) {
  remote = data ? { data, onChange } : null;
}

export function readLS(key, fallback) {
  if (remote && isWork(key)) return key in remote.data ? remote.data[key] : fallback;
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

export function writeLS(key, value) {
  if (remote && isWork(key)) {
    if (remote.data[key] === value) return true;
    remote.data[key] = value;
    remote.onChange(key);
    return true;
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLS(key) {
  if (remote && isWork(key)) {
    if (!(key in remote.data)) return;
    delete remote.data[key];
    remote.onChange(key);
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {}
}

// 예제·실습·문제의 코드
export const codeKey = (id) => `class.code.${id}`;
// 예제·실습의 입력값
export const stdinKey = (id) => `class.stdin.${id}`;
// 빈칸 문제는 빈칸에 쓴 답 목록(JSON)을 저장한다.
export const blankKey = (id) => `class.blanks.${id}`;

// 코드 칸 저장: 고친 코드와 함께 "원래 코드"도 저장해 둔다.
// 수업 내용이 바뀌어 원래 코드가 달라지면, 예전에 저장한 코드는 버리고 새 내용을 보여 준다.
export function readCode(id, base) {
  try {
    const saved = JSON.parse(readLS(codeKey(id), "null"));
    if (saved && saved.base === base && typeof saved.code === "string") return saved.code;
  } catch {}
  return base;
}

export function writeCode(id, base, code) {
  if (code === base) removeLS(codeKey(id));
  else writeLS(codeKey(id), JSON.stringify({ base, code }));
}
