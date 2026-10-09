import { Fragment } from "react";
import { Lock } from "lucide-react";
import Markdown from "./Markdown";
import CodeRunner from "./CodeRunner";
import ProblemCell from "./ProblemCell";
import { CellsAfter, useUserCells } from "./UserCells";

// STEP 하나: 머리말(목표) → (사용법) → 주제마다 설명·연습·실습·문제
// 블록마다 아래에 [+ 코드] [+ 텍스트] 줄이 있어서 수강생이 자기 칸을 끼워 넣을 수 있다.
export default function StepView({ step, onVerdict }) {
  const store = useUserCells(step.n);
  const numbers = numberBlocks(step);

  function renderBlock(b, key) {
    if (b.type === "md") return <Markdown>{b.text}</Markdown>;
    if (b.type === "code") return <CodeRunner id={key} code={b.code} />;
    // 연습과 실습은 같은 카드: 흐린 테두리로 한 문제의 범위를 묶고, 문제(글·주석)와 코드만 눈에 띄게
    if (b.type === "task") {
      return (
        <Card label={`연습 ${numbers[key]}`}>
          <CodeRunner id={key} code={b.starter} answer={b.answer} />
        </Card>
      );
    }
    if (b.type === "exercise") {
      return (
        <Card label={`실습 ${numbers[key]}`}>
          <div className="font-semibold text-slate-800 dark:text-slate-100">{b.title}</div>
          <div className="font-semibold [&_.prose]:text-slate-800 dark:[&_.prose]:text-slate-100">
            <Markdown>{b.prompt}</Markdown>
          </div>
          <CodeRunner id={key} code={b.starter} answer={b.answer} />
        </Card>
      );
    }
    if (b.type === "problem") {
      return (
        <div
          id={`p-${b.problem.id}`}
          data-anchor={`p-${b.problem.id}`}
          className="scroll-mt-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm"
        >
          <div className="mb-3 text-sm font-semibold text-accent-600 dark:text-accent-300">
            [문제 {String(numbers[key]).padStart(2, "0")}] <span className="text-slate-800 dark:text-slate-100">{b.problem.title}</span>
          </div>
          <ProblemCell problem={b.problem} onVerdict={onVerdict} />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-accent-200 dark:border-accent-800 bg-gradient-to-r from-accent-100 via-accent-50 to-peach-50 dark:from-accent-950 dark:via-slate-900 dark:to-peach-950/40 p-5">
        <div className="text-sm font-semibold text-accent-600 dark:text-accent-300">STEP{step.n}</div>
        <h1 className="text-xl font-bold text-accent-900 dark:text-accent-100">{step.title}</h1>
        <ul className="mt-2 grid gap-x-6 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          {step.summary.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </header>

      {/* 한 번 읽고 나면 눈에 띄지 않도록 회색 글씨로만 */}
      {step.intro && (
        <div className="text-sm leading-[1.15rem] text-slate-400 dark:text-slate-500">
          {step.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {step.topics.map((topic, ti) => (
        <section key={topic.id} id={topic.id} data-anchor={topic.id} className="scroll-mt-20 space-y-4">
          <h2 className="border-b-2 border-accent-300 dark:border-accent-700 pb-1 text-lg font-bold text-slate-800 dark:text-slate-100">
            {ti + 1}. {topic.title}
          </h2>

          {topic.blocks.map((b, bi) => {
            const key = blockKey(topic, bi);
            return (
              <Fragment key={key}>
                {renderBlock(b, key)}
                <CellsAfter anchor={key} store={store} />
              </Fragment>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function Card({ label, children }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-4">
      <div className="text-xs text-slate-400 dark:text-slate-500">{label}</div>
      {children}
    </div>
  );
}

export const blockKey = (topic, i) => `${topic.id}-${i}`;

// 번호 붙이기 (정답 창도 같은 번호를 쓴다)
//   연습: 주제 번호-순서 (예: 3-2), 실습: STEP 안에서 1, 2, 3 …, 문제: 1, 2, 3 …
export function numberBlocks(step) {
  const numbers = {};
  let exercise = 0;
  let problem = 0;
  step.topics.forEach((topic, ti) => {
    let t = 0;
    topic.blocks.forEach((b, i) => {
      const key = blockKey(topic, i);
      if (b.type === "task") numbers[key] = `${ti + 1}-${++t}`;
      if (b.type === "exercise") numbers[key] = ++exercise;
      if (b.type === "problem") numbers[key] = ++problem;
    });
  });
  return numbers;
}

export function LockedStep({ n }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
      <Lock size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">STEP{n} 미공개</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">수업에서 공개되면 열림</p>
    </div>
  );
}
