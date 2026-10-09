// 문제 목록은 public/problems.json 이 기본이고,
// 관리자가 고친 내용은 그 브라우저의 localStorage 에 저장된다.
// 학생들에게 배포하려면 관리자 모드의 [내보내기]로 받은 파일을 public/problems.json 에 덮어쓰면 된다.

const PROBLEMS_KEY = "cospro.problems.v1";

export function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

export function writeLS(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLS(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export async function fetchDefaultProblems() {
  const res = await fetch(import.meta.env.BASE_URL + "problems.json", { cache: "no-store" });
  if (!res.ok) throw new Error("problems.json 을 불러오지 못했습니다.");
  const data = await res.json();
  return validateProblems(data);
}

export async function loadProblems() {
  const saved = readLS(PROBLEMS_KEY, null);
  if (saved) {
    try {
      return validateProblems(JSON.parse(saved));
    } catch {}
  }
  return fetchDefaultProblems();
}

export function saveProblems(problems) {
  const ok = writeLS(PROBLEMS_KEY, JSON.stringify({ problems }));
  if (!ok) alert("브라우저 저장 공간이 부족해 저장하지 못했습니다. 붙여 넣은 이미지가 너무 크면 이미지 링크를 써 주세요.");
  return ok;
}

export function clearSavedProblems() {
  removeLS(PROBLEMS_KEY);
}

export function validateProblems(data) {
  const list = Array.isArray(data) ? data : data?.problems;
  if (!Array.isArray(list)) throw new Error("문제 파일 형식이 올바르지 않습니다.");
  return list.map((p) => ({
    id: String(p.id || newId()),
    grade: [1, 2, 3].includes(Number(p.grade)) ? Number(p.grade) : 3, // 급수 (없으면 3급)
    title: String(p.title || ""),
    description: String(p.description || ""),
    starterCode: String(p.starterCode || ""),
    answerCode: String(p.answerCode || ""),
    stdin: String(p.stdin || ""),
    source: p.source === "exam" ? "exam" : "new", // exam: 기출 바탕 문제, new: 그 밖의 문제
  }));
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// 학생이 작성 중인 코드는 문항별로 저장해서 새로고침해도 남게 한다.
export const codeKey = (id) => `cospro.code.${id}`;
// 빈칸 문제는 빈칸에 쓴 답 목록(JSON)을 저장한다.
export const blankKey = (id) => `cospro.blanks.${id}`;
