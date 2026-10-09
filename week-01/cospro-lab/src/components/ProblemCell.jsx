import { useEffect, useState } from "react";
import { CheckCheck, Loader2, Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor";
import BlankCode, { BLANK, countBlanks, fillBlanks } from "./BlankCode";
import Markdown from "./Markdown";
import OutputPanel from "./OutputPanel";
import { runPython } from "../lib/pyRunner";
import { grade, splitCases } from "../lib/grader";
import { blankKey, codeKey, readLS, removeLS, writeLS } from "../lib/storage";

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
  const [code, setCode] = useState(() => readLS(codeKey(problem.id), problem.starterCode));
  const [answers, setAnswers] = useState(() => readAnswers(problem.id, countBlanks(problem.starterCode)));
  const runCode = isBlank ? fillBlanks(problem.starterCode, answers) : code;
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);

  useEffect(() => {
    if (isBlank) writeLS(blankKey(problem.id), JSON.stringify(answers));
    else writeLS(codeKey(problem.id), code);
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
    if (!result.problemError) onVerdict(problem.id, result.pass ? "pass" : "fail");
  }

  function handleReset() {
    if (!confirm(isBlank ? "빈칸을 모두 지울까요?" : "처음 코드로 되돌릴까요? 지금 작성한 코드는 사라집니다.")) return;
    removeLS(codeKey(problem.id));
    removeLS(blankKey(problem.id));
    setCode(problem.starterCode);
    setAnswers(Array(countBlanks(problem.starterCode)).fill(""));
    setOutput(null);
    setGradeResult(null);
  }

  return (
    <div className="space-y-4">
      <Markdown>{problem.description}</Markdown>

      {isBlank ? (
        <BlankCode template={problem.starterCode} answers={answers} onChange={setAnswers} onRun={handleRun} />
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
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <CheckCheck size={16} /> 채점하기
        </button>
        <button onClick={handleReset} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw size={14} /> {isBlank ? "빈칸 지우기" : "처음 코드로"}
        </button>
      </div>

      <OutputPanel running={running} output={output} gradeResult={gradeResult} />
    </div>
  );
}
