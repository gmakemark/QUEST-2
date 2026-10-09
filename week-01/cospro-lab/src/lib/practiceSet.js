// 학생 모드에서 한 번에 푸는 문제 묶음(세트)
// 문제가 많아도 SET_SIZE 개씩만 보여 주고, [새로 풀기]를 누르면 새로 고른다.
// 고른 세트는 급수 탭마다 브라우저에 기억해서 새로고침해도 같은 문제가 남는다.

import { readLS, writeLS } from "./storage";

export const SET_SIZE = 10;
const LS_KEY = "cospro.sets.v2"; // v2: 기출/새 유형을 섞어 고르도록 바뀌어서 예전 세트는 버림

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const isBlankProblem = (p) => p.title.startsWith("[빈칸]") || p.starterCode.includes("⬜");

// 직전 세트에 없던 문제를 먼저, 모자라면 나머지에서 k 개
function take(list, prevIds, k) {
  const fresh = shuffle(list.filter((p) => !prevIds.includes(p.id)));
  const used = shuffle(list.filter((p) => prevIds.includes(p.id)));
  return [...fresh, ...used].slice(0, k);
}

// 한 유형 안에서 n 개를 고른다. 기출 바탕(exam)과 그 밖의 문제를 전체 비율대로 섞고,
// 그 밖의 문제가 있으면 기출 바탕 문제만으로 채우지 않는다.
function pickGroup(group, prevIds, n) {
  const exam = group.filter((p) => p.source === "exam");
  const other = group.filter((p) => p.source !== "exam");
  let nExam = Math.round((n * exam.length) / Math.max(1, group.length));
  if (other.length && nExam >= n) nExam = n - 1;
  nExam = Math.min(nExam, exam.length);
  const nOther = Math.min(n - nExam, other.length);
  const picked = [...take(exam, prevIds, nExam), ...take(other, prevIds, nOther)];
  // 한쪽이 모자라면 남은 문제에서 채운다
  return [...picked, ...take(group.filter((p) => !picked.includes(p)), prevIds, n - picked.length)];
}

/**
 * pool 에서 size 개를 골라 id 목록으로 돌려준다.
 *  - 3급 시험처럼 [빈칸] 절반 + [구현] 절반
 *  - 순서는 언제나 [빈칸] 먼저(1~5번), [구현] 나중(6~10번). 같은 유형 안에서는 원래 목록 순서
 *  - 유형마다 기출 바탕 문제와 새 유형 문제를 비율대로 섞는다 (기본 50문제면 빈칸·구현 각각 기출 2 + 새 유형 3)
 *  - 직전 세트(prevIds)와 겹치지 않는 문제를 먼저 쓴다
 */
export function pickSet(pool, prevIds = [], size = SET_SIZE) {
  const blanks = pool.filter(isBlankProblem);
  const others = pool.filter((p) => !isBlankProblem(p));
  const nBlank = Math.min(Math.floor(size / 2), blanks.length);
  const nOther = Math.min(size - nBlank, others.length);
  let picked = [...pickGroup(blanks, prevIds, nBlank), ...pickGroup(others, prevIds, nOther)];
  // [구현] 이 모자라면 [빈칸] 을 더 넣는다
  if (picked.length < size) picked = [...picked, ...take(blanks.filter((p) => !picked.includes(p)), prevIds, size - picked.length)];

  const chosen = pool.filter((p) => picked.includes(p));
  return [...chosen.filter(isBlankProblem), ...chosen.filter((p) => !isBlankProblem(p))].map((p) => p.id);
}

export function isValidSet(ids, pool, size = SET_SIZE) {
  return Array.isArray(ids) && ids.length === Math.min(size, pool.length) && ids.every((id) => pool.some((p) => p.id === id));
}

export function loadSets() {
  try {
    return JSON.parse(readLS(LS_KEY, "{}")) || {};
  } catch {
    return {};
  }
}

export function saveSets(sets) {
  writeLS(LS_KEY, JSON.stringify(sets));
}
