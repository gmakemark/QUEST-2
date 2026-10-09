import { useEffect, useRef, useState } from "react";
import { CirclePlay, Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { runPython } from "../lib/pyRunner";
import { readCode, writeCode } from "../lib/storage";

// 수업용 코드 칸: 코드를 고쳐서 [실행] → 파이썬 에디터처럼 출력 또는 오류 메시지. (채점 없음)
//  - input() 을 만나면 실행 결과 창에 입력칸이 나타난다. 값을 넣고 Enter → 그 값까지 넣어 처음부터 다시 실행.
//    (브라우저 실행기는 중간에 멈춰 기다릴 수 없어서, 지금까지 입력한 값을 모두 넣고 다시 돌리는 방식)
//  - answer 가 있으면 [예시 답안] 버튼이 있다.
export default function CodeRunner({ id, code: initialCode, answer, label }) {
  const [code, setCode] = useState(() => readCode(id, initialCode));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    writeCode(id, initialCode, code);
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

  // 미니멀 아웃라인: 흰 배경 + 얇은 회색 테두리. 보라색은 아이콘과 마우스를 올렸을 때만.
  const btn =
    "group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-normal text-slate-400 transition-colors " +
    "hover:border-accent-300 hover:text-accent-700 disabled:opacity-50 " +
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-accent-600 dark:hover:text-accent-200";
  return (
    <div className="space-y-2" data-cell={id}>
      {label && <div className="text-xs font-semibold text-accent-600 dark:text-accent-300">{label}</div>}
      <CodeEditor value={code} onChange={setCode} onRun={() => !running && run()} minHeight={40} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => run()}
          disabled={running}
          className={btn}
          title="Ctrl+Enter"
        >
          {running ? (
            <Loader2 size={16} className="animate-spin text-accent-500" />
          ) : (
            <CirclePlay size={16} className="text-slate-400 group-hover:text-accent-500 dark:text-slate-500" />
          )}{" "}
          실행
        </button>
        {answer && (
          <button
            onClick={() => setShowAnswer((v) => !v)}
            className={btn}
          >
            {showAnswer ? <EyeOff size={16} className="text-accent-500" /> : <Eye size={16} className="text-accent-500" />}{" "}
            {showAnswer ? "예시 답안 닫기" : "예시 답안"}
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
        <div className="space-y-1.5 pt-1">
          <div className="text-xs text-slate-400 dark:text-slate-500">예시 답안 · 다른 방법도 가능</div>
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
