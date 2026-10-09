import { useEffect, useState } from "react";
import { CheckCheck, Eye, EyeOff, Loader2, Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor";
import BlankCode, { BLANK, blankAnswers, countBlanks, fillBlanks } from "./BlankCode";
import Markdown from "./Markdown";
import OutputPanel from "./OutputPanel";
import { runPython } from "../lib/pyRunner";
import { grade, splitCases } from "../lib/grader";
import { blankKey, codeKey, readCode, readLS, removeLS, writeCode, writeLS } from "../lib/storage";

const readAnswers = (id, n) => {
  try {
    const a = JSON.parse(readLS(blankKey(id), "[]"));
    return Array.isArray(a) ? Array.from({ length: n }, (_, i) => String(a[i] ?? "")) : Array(n).fill("");
  } catch {
    return Array(n).fill("");
  }
};

// 학생 모드의 문항 하나: 지문 → 코드 → 버튼 → 결과
// 시작 코드에 ⬜ 가 있으면 빈칸 문제: 코드는 고정하고 빈칸 입력칸만 채운다.
export default function ProblemCell({ problem, onVerdict }) {
  const isBlank = problem.starterCode.includes(BLANK);
  const [code, setCode] = useState(() => readCode(problem.id, problem.starterCode));
  const [answers, setAnswers] = useState(() => readAnswers(problem.id, countBlanks(problem.starterCode)));
  const runCode = isBlank ? fillBlanks(problem.starterCode, answers) : code;
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);
  const [wrongOnce, setWrongOnce] = useState(false); // 한 번이라도 오답이면 [정답 보기]를 누를 수 있다
  const [showAnswer, setShowAnswer] = useState(false);
  const [clearable, setClearable] = useState([]); // 오답 뒤 클릭하면 바로 비울 빈칸

  useEffect(() => {
    if (isBlank) writeLS(blankKey(problem.id), JSON.stringify(answers));
    else writeCode(problem.id, problem.starterCode, code);
  }, [problem.id, isBlank, code, answers]);

  async function handleRun() {
    if (running) return;
    setRunning(true);
    setGradeResult(null);
    setOutput(await runPython(runCode, splitCases(problem.stdin)[0])); // 실행은 첫 번째 입력으로만
    setRunning(false);
  }

  // 정답 코드와 출력을 비교해 화면에만 정답/오답을 보여 준다. (어디에도 보내지 않음)
  async function handleGrade() {
    if (running) return;
    setRunning(true);
    const result = await grade(problem, runCode);
    setOutput(result.student);
    setGradeResult(result);
    setRunning(false);
    if (result.problemError) return;
    onVerdict(problem.id, result.pass ? "pass" : "fail");
    if (result.pass) {
      setClearable([]);
    } else {
      setWrongOnce(true);
      setClearable(answers.map(() => true));
    }
  }

  const clearedOne = (i) => setClearable((c) => c.map((v, k) => (k === i ? false : v)));

  function handleReset() {
    if (!confirm(isBlank ? "빈칸을 모두 지움. 계속?" : "처음 코드로 되돌림. 작성한 코드는 사라짐.")) return;
    removeLS(codeKey(problem.id));
    removeLS(blankKey(problem.id));
    setCode(problem.starterCode);
    setAnswers(Array(countBlanks(problem.starterCode)).fill(""));
    setOutput(null);
    setGradeResult(null);
    setClearable([]);
  }

  return (
    <div className="space-y-4">
      <Markdown exam>{problem.description}</Markdown>

      {isBlank ? (
        <BlankCode
          template={problem.starterCode}
          answers={answers}
          onChange={setAnswers}
          onRun={handleRun}
          clearable={clearable}
          onCleared={clearedOne}
        />
      ) : (
        <CodeEditor value={code} onChange={setCode} onRun={handleRun} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          title="Ctrl+Enter"
        >
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} 코드 실행
        </button>
        <button
          onClick={handleGrade}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent-200 bg-accent-100 px-3 py-1.5 text-sm font-medium text-accent-800 hover:bg-accent-200 dark:border-accent-800 dark:bg-accent-900/60 dark:text-accent-100 disabled:opacity-50"
        >
          <CheckCheck size={16} /> 채점하기
        </button>
        <button
          onClick={() => setShowAnswer((v) => !v)}
          disabled={!wrongOnce}
          title={wrongOnce ? "모범 답안을 봅니다" : "채점해서 오답이 나온 뒤에 볼 수 있습니다"}
          className="inline-flex items-center gap-1.5 rounded-md border border-peach-400 px-3 py-1.5 text-sm font-medium text-peach-700 hover:bg-peach-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent dark:border-peach-600 dark:text-peach-300 dark:hover:bg-peach-950/40 dark:disabled:border-slate-600 dark:disabled:text-slate-500"
        >
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />} {showAnswer ? "정답 숨기기" : "정답 보기"}
        </button>
        <button onClick={handleReset} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw size={14} /> {isBlank ? "빈칸 지우기" : "처음 코드로"}
        </button>
      </div>

      <OutputPanel running={running} output={output} gradeResult={gradeResult} />

      {showAnswer && <ModelAnswer problem={problem} isBlank={isBlank} />}
    </div>
  );
}

// 모범 답안: 빈칸 문제는 빈칸별 정답도 함께
function ModelAnswer({ problem, isBlank }) {
  const fills = isBlank ? blankAnswers(problem.starterCode, problem.answerCode) : null;
  return (
    <div className="space-y-2 rounded-md border border-peach-300 dark:border-peach-700 bg-peach-50 dark:bg-peach-950/40 p-3">
      <div className="text-sm font-semibold text-peach-800 dark:text-peach-200">모범 답안</div>
      {fills && (
        <ul className="flex flex-wrap gap-2 text-sm">
          {fills.map((f, i) => (
            <li key={i} className="rounded border border-peach-300 dark:border-peach-700 bg-white dark:bg-slate-900 px-2 py-0.5">
              빈칸 {i + 1} : <code className="font-code font-semibold">{f}</code>
            </li>
          ))}
        </ul>
      )}
      <CodeEditor value={problem.answerCode} readOnly />
    </div>
  );
}
