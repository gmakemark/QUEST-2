import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { runPython } from "../lib/pyRunner";
import { codeKey, readLS, removeLS, stdinKey, writeLS } from "../lib/storage";

// 수업용 코드 칸: 코드를 고쳐서 [실행] → 파이썬 에디터처럼 출력 또는 오류 메시지를 보여 준다. (채점 없음)
//  - input() 을 쓰는 코드면 '입력값' 칸이 보인다. 한 줄에 하나씩.
//  - answer 가 있으면(실습) [예시 답안] 버튼이 있다.
export default function CodeRunner({ id, code: initialCode, stdin: initialStdin = "", answer }) {
  const [code, setCode] = useState(() => readLS(codeKey(id), initialCode));
  const [stdin, setStdin] = useState(() => readLS(stdinKey(id), initialStdin));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (code === initialCode) removeLS(codeKey(id));
    else writeLS(codeKey(id), code);
  }, [id, code, initialCode]);
  useEffect(() => {
    if (stdin === initialStdin) removeLS(stdinKey(id));
    else writeLS(stdinKey(id), stdin);
  }, [id, stdin, initialStdin]);

  const usesInput = /\binput\s*\(/.test(code) || stdin.trim() !== "";
  const changed = code !== initialCode || stdin !== initialStdin;

  async function run() {
    if (running) return;
    setRunning(true);
    setOutput(await runPython(code, stdin, { echo: true }));
    setRunning(false);
  }

  function reset() {
    if (!confirm("처음 코드로 되돌릴까요? 고친 내용은 사라집니다.")) return;
    setCode(initialCode);
    setStdin(initialStdin);
    setOutput(null);
  }

  const btn = "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50";
  return (
    <div className="space-y-2">
      <CodeEditor value={code} onChange={setCode} onRun={run} minHeight={60} />

      {usesInput && (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">입력값 (input() 이 위에서부터 한 줄씩 읽어요)</span>
          <textarea
            className="font-code h-16 w-full resize-y rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-sm outline-none focus:border-blue-500"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run();
            }}
            placeholder={"예)\n홍길동"}
          />
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={run} disabled={running} className={btn + " bg-blue-600 text-white hover:bg-blue-700"} title="Ctrl+Enter">
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} 실행
        </button>
        {answer && (
          <button
            onClick={() => setShowAnswer((v) => !v)}
            className={btn + " border border-amber-400 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-950/40"}
          >
            {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />} {showAnswer ? "예시 답안 숨기기" : "예시 답안"}
          </button>
        )}
        {changed && (
          <button onClick={reset} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <RotateCcw size={14} /> 처음 코드로
          </button>
        )}
      </div>

      {(running || output) && <Console running={running} output={output} />}

      {showAnswer && (
        <div className="space-y-2 rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-3">
          <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">예시 답안 (다른 방법으로 풀어도 괜찮아요)</div>
          <CodeEditor value={answer} readOnly minHeight={40} />
        </div>
      )}
    </div>
  );
}

// 파이썬 에디터의 실행 창처럼: 출력, 그리고 오류가 나면 Traceback 을 빨간색으로
function Console({ running, output }) {
  const needsInput = output?.error?.includes("EOFError");
  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-3 py-1 text-xs text-slate-400">실행 결과</div>
      <pre className="font-code max-h-80 overflow-auto whitespace-pre-wrap break-all p-3 text-sm">
        {running ? (
          <span className="inline-flex items-center gap-2 text-slate-400">
            <Loader2 size={14} className="animate-spin" /> 실행 중…
          </span>
        ) : (
          <>
            {output.stdout}
            {output.error && <span className="text-red-300">{output.error}</span>}
            {needsInput && <span className="text-amber-300">{"\n"}💡 input() 이 읽을 값이 모자라요. 입력값 칸에 값을 한 줄에 하나씩 넣어 주세요.</span>}
            {!output.stdout && !output.error && <span className="text-slate-500">(출력 없음)</span>}
          </>
        )}
      </pre>
    </div>
  );
}
