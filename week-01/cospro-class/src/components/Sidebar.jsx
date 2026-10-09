import { CheckCircle2, Circle, Lock, XCircle } from "lucide-react";

// 왼쪽 목차: STEP1~3, 지금 보고 있는 STEP 아래에 주제 목록
// 잠긴 STEP 은 자물쇠와 함께 누를 수 없게 보인다.
export default function Sidebar({ steps, current, isOpen, activeId, verdicts, onSelect, onNavigate }) {
  function go(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    onNavigate?.();
  }

  return (
    <nav className="h-full overflow-y-auto px-2 pb-6 pt-4">
      {steps.map((step) => {
        const open = isOpen(step.n);
        const active = step.n === current;
        return (
          <div key={step.n} className="mb-2">
            <button
              disabled={!open}
              onClick={() => onSelect(step.n)}
              title={open ? "" : "아직 미공개"}
              className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left ${
                active ? "bg-accent-100 text-accent-900 dark:bg-accent-900/60 dark:text-accent-100" : open ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "cursor-not-allowed text-slate-400 dark:text-slate-500"
              }`}
            >
              <span className="text-sm font-bold">STEP{step.n}</span>
              <span className={`flex-1 text-xs leading-5 ${active ? "text-accent-700 dark:text-accent-200" : "text-slate-500 dark:text-slate-400"}`}>{step.title}</span>
              {!open && <Lock size={14} className="mt-0.5 shrink-0" />}
            </button>

            {active && (
              <ul className="mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-2 ml-4">
                {step.topics.map((t, i) => (
                  <li key={t.id}>
                    <button
                      onClick={() => go(t.id)}
                      className={`w-full truncate rounded px-2 py-1 text-left text-sm ${
                        activeId === t.id ? "bg-accent-100 dark:bg-accent-900/50 font-medium text-accent-800 dark:text-accent-200" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {i + 1}. {t.title}
                    </button>
                    {/* 실전 문제는 문제마다 정답/오답 표시 */}
                    {t.blocks.some((b) => b.type === "problem") && (
                      <ul className="ml-3">
                        {t.blocks
                          .filter((b) => b.type === "problem")
                          .map((b, k) => {
                            const v = verdicts[b.problem.id];
                            return (
                              <li key={b.problem.id}>
                                <button
                                  onClick={() => go(`p-${b.problem.id}`)}
                                  className={`flex w-full items-center gap-1.5 truncate rounded px-2 py-0.5 text-left text-xs ${
                                    activeId === `p-${b.problem.id}` ? "font-medium text-accent-700 dark:text-accent-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  {v === "pass" ? (
                                    <CheckCircle2 size={13} className="shrink-0 text-green-600" />
                                  ) : v === "fail" ? (
                                    <XCircle size={13} className="shrink-0 text-red-500" />
                                  ) : (
                                    <Circle size={13} className="shrink-0 text-slate-300 dark:text-slate-600" />
                                  )}
                                  <span className="truncate">
                                    {String(k + 1).padStart(2, "0")}. {b.problem.title}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
