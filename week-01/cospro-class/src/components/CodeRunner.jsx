import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2, Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { runPython } from "../lib/pyRunner";
import { codeKey, readLS, removeLS, writeLS } from "../lib/storage";

// 수업용 코드 칸: 코드를 고쳐서 [실행] → 파이썬 에디터처럼 출력 또는 오류 메시지. (채점 없음)
//  - input() 을 만나면 실행 결과 창에 입력칸이 나타난다. 값을 넣고 Enter → 그 값까지 넣어 처음부터 다시 실행.
//    (브라우저 실행기는 중간에 멈춰 기다릴 수 없어서, 지금까지 입력한 값을 모두 넣고 다시 돌리는 방식)
//  - answer 가 있으면 [예시 답안] 버튼이 있다.
export default function CodeRunner({ id, code: initialCode, answer, label }) {
  const [code, setCode] = useState(() => readLS(codeKey(id), initialCode));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (code === initialCode) removeLS(codeKey(id));
    else writeLS(codeKey(id), code);
  }, [id, code, initialCode]);

  async function run(given = []) {
    setRunning(true);
    const res = await runPython(code, given.map((v) => v + "\n").join(""), { echo: true, interactive: true });
    setInputs(given);
    setOutput(res);
    setRunning(false);
  }

  function reset() {
    if (!confirm("처음 코드로 되돌림. 고친 내용은 사라짐.")) return;
    setCode(initialCode);
    setOutput(null);
  }

  const btn = "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50";
  return (
    <div className="space-y-2" data-cell={id}>
      {label && <div className="text-xs font-semibold text-accent-600 dark:text-accent-300">{label}</div>}
      <CodeEditor value={code} onChange={setCode} onRun={() => !running && run()} minHeight={40} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => run()}
          disabled={running}
          className={btn + " border border-accent-200 bg-accent-100 text-accent-800 hover:bg-accent-200 dark:border-accent-800 dark:bg-accent-900/60 dark:text-accent-100 dark:hover:bg-accent-800"}
          title="Ctrl+Enter"
        >
          {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />} 실행
        </button>
        {answer && (
          <button
            onClick={() => setShowAnswer((v) => !v)}
            className={btn + " border border-peach-200 text-peach-700 hover:bg-peach-50 dark:border-peach-800 dark:text-peach-300 dark:hover:bg-peach-950/40"}
          >
            {showAnswer ? <EyeOff size={15} /> : <Eye size={15} />} {showAnswer ? "예시 답안 닫기" : "예시 답안"}
          </button>
        )}
        {code !== initialCode && (
          <button onClick={reset} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <RotateCcw size={14} /> 처음 코드로
          </button>
        )}
      </div>

      {(running || output) && <Console running={running} output={output} onInput={(v) => run([...inputs, v])} />}

      {showAnswer && (
        <div className="space-y-2 rounded-md border border-peach-200 dark:border-peach-800 bg-peach-50 dark:bg-peach-950/30 p-3">
          <div className="text-sm font-semibold text-peach-700 dark:text-peach-200">예시 답안 (다른 방법도 가능)</div>
          <CodeEditor value={answer} readOnly minHeight={40} />
        </div>
      )}
    </div>
  );
}

// 파이썬 에디터의 실행 창처럼: 출력, 오류(Traceback), 그리고 input() 을 만나면 입력칸
function Console({ running, output, onInput }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const waiting = !running && output?.needInput;

  useEffect(() => {
    if (waiting) {
      setValue("");
      inputRef.current?.focus();
    }
  }, [waiting, output]);

  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-[#1f1d2b] text-slate-100">
      <div className="flex items-center border-b border-slate-700 px-3 py-1 text-xs text-slate-400">
        실행 결과
        {waiting && <span className="ml-auto text-peach-300">입력 기다리는 중 · 값 입력 후 Enter</span>}
      </div>
      <pre className="font-code max-h-80 overflow-auto whitespace-pre-wrap break-all p-3 text-sm">
        {running && !output ? (
          <span className="inline-flex items-center gap-2 text-slate-400">
            <Loader2 size={14} className="animate-spin" /> 실행 중…
          </span>
        ) : (
          <>
            {output.stdout}
            {waiting && (
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onInput(value);
                }}
                aria-label="input() 에 넣을 값"
                className="font-code w-48 border-b border-peach-300 bg-transparent text-peach-200 outline-none"
              />
            )}
            {output.error && <span className="text-red-300">{output.error}</span>}
            {!output.stdout && !output.error && !waiting && <span className="text-slate-500">(출력 없음)</span>}
            {running && (
              <span className="ml-2 inline-flex items-center text-slate-400">
                <Loader2 size={13} className="animate-spin" />
              </span>
            )}
          </>
        )}
      </pre>
    </div>
  );
}
