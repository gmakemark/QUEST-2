import { Fragment } from "react";

export const BLANK = "⬜";

// 빈칸 문제의 코드: ⬜ 를 학생이 채운 답으로 바꿔 실행할 코드를 만든다.
export function fillBlanks(template, answers) {
  return template
    .split(BLANK)
    .map((part, i) => part + (i < answers.length ? answers[i] ?? "" : ""))
    .join("");
}

export const countBlanks = (template) => template.split(BLANK).length - 1;

// 모범 답안 코드에서 빈칸마다 들어갈 답을 뽑아낸다. (맞춰지지 않으면 null)
export function blankAnswers(template, answerCode) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = answerCode.match(new RegExp("^" + template.split(BLANK).map(esc).join("(.*?)") + "$", "s"));
  return m ? m.slice(1) : null;
}

// 시험 화면처럼 코드는 고정해 두고, ⬜ 자리마다 한 줄짜리 입력칸을 둔다.
// 줄 앞의 공백(들여쓰기)은 그대로 보이고, 학생은 입력칸에만 쓸 수 있다.
// clearable[i] 가 true 인 칸(오답 뒤)은 클릭하면 묻지 않고 바로 비운다. 칸마다 한 번만.
export default function BlankCode({ template, answers, onChange, onRun, clearable = [], onCleared }) {
  let index = 0; // 코드 전체에서 몇 번째 빈칸인지
  const lines = template.replace(/\n+$/, "").split("\n");

  function setAnswer(i, value) {
    const next = [...answers];
    next[i] = value.replace(/[\r\n]/g, ""); // 붙여 넣기로 줄바꿈이 들어와도 한 줄로
    onChange(next);
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e1e1e]">
      <pre className="font-code py-2 text-sm leading-7">
        {lines.map((line, n) => (
          <div key={n} className="flex">
            <span className="w-10 shrink-0 select-none pr-3 text-right text-slate-400 dark:text-slate-500">{n + 1}</span>
            <span className="whitespace-pre pr-4">
              {line.split(BLANK).map((part, k) => {
                if (k === 0) return <Fragment key={k}>{part}</Fragment>;
                const i = index++;
                const value = answers[i] ?? "";
                return (
                  <Fragment key={k}>
                    <input
                      value={value}
                      onChange={(e) => setAnswer(i, e.target.value)}
                      onFocus={() => {
                        if (!clearable[i]) return;
                        setAnswer(i, "");
                        onCleared?.(i);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onRun?.();
                      }}
                      spellCheck={false}
                      autoComplete="off"
                      aria-label={`빈칸 ${i + 1}`}
                      placeholder={`빈칸 ${i + 1}`}
                      style={{ width: `${Math.max(7, value.length + 2)}ch` }}
                      className="font-code mx-0.5 rounded border border-accent-400 bg-accent-50 px-1 align-middle text-sm leading-6 text-slate-900 outline-none placeholder:text-accent-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 dark:border-accent-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-accent-900"
                    />
                    {part}
                  </Fragment>
                );
              })}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
