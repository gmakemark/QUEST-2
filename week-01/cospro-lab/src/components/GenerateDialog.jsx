import { useState } from "react";
import Modal from "./Modal";
import { TYPES, countTemplates, generateProblems, topicsOf } from "../lib/generator";

// 급수·범위(단원)·유형·개수를 골라 문제를 자동으로 만든다.
export default function GenerateDialog({ defaultGrade = 2, onClose, onGenerate }) {
  const [grade, setGrade] = useState(defaultGrade);
  const [topics, setTopics] = useState(() => topicsOf(defaultGrade).map((t) => t.key));
  const [types, setTypes] = useState(TYPES.map((t) => t.key));
  const [count, setCount] = useState(5);

  const toggle = (list, setList, key) => setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  const available = topicsOf(grade);
  const ready = countTemplates(grade, topics) > 0 && types.length > 0 && count >= 1;

  function changeGrade(g) {
    setGrade(g);
    setTopics(topicsOf(g).map((t) => t.key));
  }

  function handleGenerate() {
    const n = Math.max(1, Math.min(30, Number(count) || 1));
    onGenerate(generateProblems({ grade, topics, types, count: n }));
  }

  const chip = (on) =>
    `cursor-pointer select-none rounded-full border px-3 py-1 text-sm ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"}`;

  return (
    <Modal title="문제 자동 생성" onClose={onClose}>
      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold">급수</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((g) => (
              <button key={g} className={chip(grade === g)} onClick={() => changeGrade(g)}>
                {g}급
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">범위</h3>
          {available.length === 0 && (
            <p className="rounded bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
              아직 {grade}급 문제 틀이 없습니다. {grade}급 예제 문제를 바탕으로 틀을 추가하면 여기서 만들 수 있습니다.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {available.map((t) => (
              <button key={t.key} className={chip(topics.includes(t.key))} onClick={() => toggle(topics, setTopics, t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">고른 범위의 문제 틀 {countTemplates(grade, topics)}개에서 숫자·조건을 바꿔 만듭니다.</p>
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
              className="w-20 rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 font-normal outline-none focus:border-blue-500"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
            <span className="font-normal text-slate-500 dark:text-slate-400">개 (최대 30)</span>
          </label>
        </section>

        <p className="rounded bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
          만든 문제는 목록 맨 뒤에 붙습니다. 마음에 들지 않으면 그 문제만 고치거나 지우면 됩니다.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
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
