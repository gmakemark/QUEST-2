// 학생 모드에서 한 번에 푸는 문제 묶음(세트)
// 문제가 많아도 SET_SIZE 개씩만 보여 주고, [새로 풀기]를 누르면 새로 고른다.
// 고른 세트는 급수 탭마다 브라우저에 기억해서 새로고침해도 같은 문제가 남는다.

import { readLS, writeLS } from "./storage";

export const SET_SIZE = 10;
const LS_KEY = "cospro.sets";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const isBlank = (p) => p.title.startsWith("[빈칸]");

/**
 * pool 에서 size 개를 골라 id 목록으로 돌려준다.
 *  - 직전 세트(prevIds)와 겹치지 않는 문제를 먼저 쓴다 (남은 문제가 모자라면 전체에서)
 *  - 3급 시험처럼 [빈칸] 절반 + 나머지([구현]) 절반으로 맞춘다
 *  - 보여 주는 순서는 원래 목록 순서 (빈칸 → 구현)
 */
export function pickSet(pool, prevIds = [], size = SET_SIZE) {
  const fresh = pool.filter((p) => !prevIds.includes(p.id));
  const source = fresh.length >= size ? fresh : pool;

  const half = Math.floor(size / 2);
  const blanks = shuffle(source.filter(isBlank)).slice(0, half);
  const others = shuffle(source.filter((p) => !isBlank(p))).slice(0, size - blanks.length);
  const picked = new Set([...blanks, ...others]);
  // 한쪽이 모자라면 나머지에서 채운다
  for (const p of shuffle(source)) {
    if (picked.size >= size) break;
    picked.add(p);
  }
  return pool.filter((p) => picked.has(p)).map((p) => p.id);
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
