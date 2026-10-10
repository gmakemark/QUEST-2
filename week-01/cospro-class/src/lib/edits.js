// 관리자가 [수정] 으로 고친 수업 칸 (연습·실습·실행 코드 칸)
//
// 고친 내용은 배포 사이트에서는 서버(/api/status)에, 내 컴퓨터(npm run dev)에서는 이 브라우저에 저장한다.
// 모든 화면이 STEP 공개 상태를 받아 올 때 고친 내용도 함께 받아서, 수업 내용(content/*.js) 위에 덮어 보여 준다.
//
//   edits = { "<블록 이름 s1-print-3>": { base: "<고치기 전 원래 내용>", fields: { starter, answer, ... } } }
//
// base 는 고칠 때의 원래 내용이다. 나중에 content/*.js 가 바뀌어 같은 자리에 다른 칸이 오면
// base 가 맞지 않으므로 예전에 고친 내용을 엉뚱한 칸에 덮지 않는다.

import { readLS, writeLS } from "./storage";

const LS_KEY = "cospro.edits";

// 칸 종류마다 고칠 수 있는 것
export const FIELDS = {
  task: ["starter", "answer"],
  exercise: ["title", "prompt", "starter", "answer"],
  code: ["code"],
};

export const isEditable = (b) => !!FIELDS[b.type];

export function fieldsOf(b) {
  return Object.fromEntries(FIELDS[b.type].map((f) => [f, b[f] ?? ""]));
}

export const baseOf = (b) => JSON.stringify(fieldsOf(b));

/** STEP 하나에 고친 내용을 덮은 새 STEP 을 돌려준다. (고친 칸에는 edited: true) */
export function applyEdits(step, edits = {}) {
  return {
    ...step,
    topics: step.topics.map((topic) => ({
      ...topic,
      blocks: topic.blocks.map((b, i) => {
        const e = edits[`${topic.id}-${i}`];
        if (!e || !isEditable(b) || e.base !== baseOf(b)) return b;
        return { ...b, ...e.fields, edited: true, original: b };
      }),
    })),
  };
}

export function readLocalEdits() {
  try {
    const e = JSON.parse(readLS(LS_KEY, "{}"));
    return e && typeof e === "object" ? e : {};
  } catch {
    return {};
  }
}

/** 칸 하나를 고치거나(value) 원래대로 되돌린다(value = null). 바뀐 전체 edits 를 돌려준다. */
export async function saveEdit(key, value, { server, password }) {
  if (!server) {
    const edits = readLocalEdits();
    if (value) edits[key] = value;
    else delete edits[key];
    writeLS(LS_KEY, JSON.stringify(edits));
    return edits;
  }
  const res = await fetch("/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, edit: { key, value } }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status !== 200) throw new Error(data.error || `서버 오류 (${res.status})`);
  return data.edits || {};
}
