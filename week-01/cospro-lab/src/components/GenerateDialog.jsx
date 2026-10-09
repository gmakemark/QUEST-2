import { useState } from "react";
import Modal from "./Modal";
import { TOPICS, TYPES, countTemplates, generateProblems } from "../lib/generator";

// 범위(단원)·유형·개수를 골라 문제를 자동으로 만든다.
export default function GenerateDialog({ onClose, onGenerate }) {
  const [topics, setTopics] = useState(TOPICS.map((t) => t.key));
  const [types, setTypes] = useState(TYPES.map((t) => t.key));
  const [count, setCount] = useState(5);

  const toggle = (list, setList, key) => setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  const ready = topics.length > 0 && types.length > 0 && count >= 1;

  function handleGenerate() {
    const n = Math.max(1, Math.min(30, Number(count) || 1));
    onGenerate(generateProblems({ topics, types, count: n }));
  }

  const chip = (on) =>
    `cursor-pointer select-none rounded-full border px-3 py-1 text-sm ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 hover:bg-slate-50"}`;

  return (
    <Modal title="문제 자동 생성" onClose={onClose}>
      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold">범위</h3>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button key={t.key} className={chip(topics.includes(t.key))} onClick={() => toggle(topics, setTopics, t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">고른 범위의 문제 틀 {countTemplates(topics)}개에서 숫자·조건을 바꿔 만듭니다.</p>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">문제 유형</h3>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t.key} className={chip(types.includes(t.key))} onClick={() => toggle(types, setTypes, t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="flex items-center gap-2 text-sm font-semibold">
            문제 수
            <input
              type="number"
              min={1}
              max={30}
              className="w-20 rounded-md border border-slate-300 px-2 py-1 font-normal outline-none focus:border-blue-500"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
            <span className="font-normal text-slate-500">개 (최대 30)</span>
          </label>
        </section>

        <p className="rounded bg-slate-100 px-3 py-2 text-xs text-slate-600">
          만든 문제는 목록 맨 뒤에 붙습니다. 마음에 들지 않으면 그 문제만 고치거나 지우면 됩니다.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            취소
          </button>
          <button
            disabled={!ready}
            onClick={handleGenerate}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            만들기
          </button>
        </div>
      </div>
    </Modal>
  );
}
