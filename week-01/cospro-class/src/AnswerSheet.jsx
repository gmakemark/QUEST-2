import { useEffect, useState } from "react";
import { KeyRound, Moon, Sun } from "lucide-react";
import { blankAnswers } from "./components/BlankCode";
import { blockKey, numberBlocks } from "./components/StepView";
import { hasAdminSession, onPosition } from "./lib/sync";
import { toggleTheme, useTheme } from "./lib/theme";
import step1 from "./content/step1";
import step2 from "./content/step2";
import step3 from "./content/step3";

const STEPS = [step1, step2, step3];

// 정답 창 (관리자가 다른 모니터에 띄워 두는 창)
// 수업 화면에서 [정답 창 열기]로 열고, 수업 화면이 보고 있는 주제를 따라 움직인다.
export default function AnswerSheet() {
  const params = new URLSearchParams(window.location.search);
  const [stepN, setStepN] = useState(() => Number(params.get("step")) || 1);
  const [follow, setFollow] = useState(true);
  const [anchor, setAnchor] = useState(null);
  const theme = useTheme();
  const allowed = hasAdminSession();

  useEffect(() => {
    document.title = "정답 창 · COS PRO 3급 대비반";
  }, []);

  useEffect(
    () =>
      onPosition(({ step, anchor }) => {
        if (!follow) return;
        setStepN(step);
        setAnchor(anchor);
      }),
    [follow]
  );

  // 수업 화면이 보고 있는 주제로 스크롤
  useEffect(() => {
    if (!follow || !anchor) return;
    const t = setTimeout(() => document.getElementById(`ans-${anchor}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => clearTimeout(t);
  }, [anchor, stepN, follow]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
          <KeyRound size={32} className="mx-auto mb-3 text-slate-400" />
          <p className="font-semibold">관리자만 볼 수 있는 창이에요.</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">수업 화면에서 관리자 모드로 들어간 뒤 [정답 창 열기]를 눌러 주세요.</p>
        </div>
      </div>
    );
  }

  const step = STEPS.find((s) => s.n === stepN) || step1;
  const numbers = numberBlocks(step);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b bg-white dark:bg-slate-900 px-4 py-2">
        <span className="font-bold text-amber-600 dark:text-amber-400">정답 창</span>
        <div className="flex gap-1">
          {STEPS.map((s) => (
            <button
              key={s.n}
              onClick={() => setStepN(s.n)}
              className={`rounded-md px-3 py-1 text-sm font-semibold ${s.n === step.n ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              STEP{s.n}
            </button>
          ))}
        </div>
        <label className="ml-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} />
          수업 화면 따라가기
        </label>
        <button onClick={toggleTheme} className="ml-auto rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="화면 밝기">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        <h1 className="text-lg font-bold">
          STEP{step.n} · {step.title}
        </h1>
        {step.topics.map((topic, ti) => {
          const items = topic.blocks.map((b, i) => [b, blockKey(topic, i)]).filter(([b]) => b.type === "exercise" || b.type === "problem");
          return (
            <section key={topic.id} id={`ans-${topic.id}`} className="scroll-mt-16 space-y-3">
              <h2 className={`border-b-2 pb-1 font-bold ${anchor === topic.id ? "border-amber-500 text-amber-700 dark:text-amber-300" : "border-blue-600"}`}>
                {ti + 1}. {topic.title}
              </h2>
              {items.length === 0 && <p className="text-sm text-slate-400">이 주제에는 실습이 없어요.</p>}
              {items.map(([b, key]) =>
                b.type === "exercise" ? (
                  <Answer key={key} label={`실습 ${numbers[key]} · ${b.title}`} code={b.answer} />
                ) : (
                  <div key={key} id={`ans-p-${b.problem.id}`} className="scroll-mt-16">
                    <Answer
                      label={`[문제 ${String(numbers[key]).padStart(2, "0")}] ${b.problem.title}`}
                      code={b.problem.answerCode}
                      fills={b.problem.starterCode.includes("⬜") ? blankAnswers(b.problem.starterCode, b.problem.answerCode) : null}
                      active={anchor === `p-${b.problem.id}`}
                    />
                  </div>
                )
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}

function Answer({ label, code, fills, active }) {
  return (
    <div className={`rounded-lg border p-3 ${active ? "border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-900`}>
      <div className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{label}</div>
      {fills && (
        <ul className="mb-2 flex flex-wrap gap-2 text-sm">
          {fills.map((f, i) => (
            <li key={i} className="rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5">
              빈칸 {i + 1} : <code className="font-code font-semibold">{f}</code>
            </li>
          ))}
        </ul>
      )}
      <pre className="font-code overflow-x-auto rounded-md bg-slate-900 p-3 text-sm text-slate-100">{code}</pre>
    </div>
  );
}
