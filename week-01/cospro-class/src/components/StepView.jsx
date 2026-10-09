import { Lock } from "lucide-react";
import Markdown from "./Markdown";
import CodeRunner from "./CodeRunner";
import ProblemCell from "./ProblemCell";

// STEP 하나: 머리말(목표) → 주제마다 설명·예제·실습·문제
export default function StepView({ step, onVerdict }) {
  let exerciseNo = 0;
  let problemNo = 0;
  return (
    <div className="space-y-8">
      <header className="rounded-lg bg-blue-600 p-5 text-white">
        <div className="text-sm font-semibold text-blue-100">STEP{step.n}</div>
        <h1 className="text-xl font-bold">{step.title}</h1>
        <ul className="mt-2 grid gap-x-6 text-sm text-blue-50 sm:grid-cols-2">
          {step.summary.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </header>

      {step.topics.map((topic, ti) => (
        <section key={topic.id} id={topic.id} data-anchor={topic.id} className="scroll-mt-20 space-y-4">
          <h2 className="border-b-2 border-blue-600 pb-1 text-lg font-bold text-slate-800 dark:text-slate-100">
            {ti + 1}. {topic.title}
          </h2>

          {topic.blocks.map((b, bi) => {
            const key = `${topic.id}-${bi}`;
            if (b.type === "md") return <Markdown key={key}>{b.text}</Markdown>;
            if (b.type === "code") return <CodeRunner key={key} id={key} code={b.code} stdin={b.stdin} />;
            if (b.type === "exercise") {
              exerciseNo += 1;
              return (
                <div key={key} className="space-y-3 rounded-lg border-2 border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    실습 {exerciseNo} · {b.title}
                  </div>
                  <Markdown>{b.prompt}</Markdown>
                  <CodeRunner id={key} code={b.starter} stdin={b.stdin} answer={b.answer} />
                </div>
              );
            }
            if (b.type === "problem") {
              problemNo += 1;
              return (
                <div
                  key={key}
                  id={`p-${b.problem.id}`}
                  data-anchor={`p-${b.problem.id}`}
                  className="scroll-mt-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm"
                >
                  <div className="mb-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    [문제 {String(problemNo).padStart(2, "0")}] <span className="text-slate-800 dark:text-slate-100">{b.problem.title}</span>
                  </div>
                  <ProblemCell problem={b.problem} onVerdict={onVerdict} />
                </div>
              );
            }
            return null;
          })}
        </section>
      ))}
    </div>
  );
}

export function LockedStep({ n }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
      <Lock size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">STEP{n} 은 아직 공개되지 않았어요.</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">수업에서 선생님이 공개하면 열려요.</p>
    </div>
  );
}
