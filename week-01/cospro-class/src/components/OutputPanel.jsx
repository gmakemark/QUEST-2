import { CheckCircle2, Loader2, XCircle } from "lucide-react";

// 실행 결과(STDOUT) 콘솔 + 채점 결과
export default function OutputPanel({ running, output, gradeResult }) {
  if (!running && !output && !gradeResult) return null;

  return (
    <div className="space-y-2">
      {gradeResult && <Verdict result={gradeResult} />}

      <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-900 text-slate-100">
        <div className="border-b border-slate-700 px-3 py-1 text-xs text-slate-400">실행 결과</div>
        <pre className="font-code max-h-80 overflow-auto whitespace-pre-wrap break-all p-3 text-sm">
          {running ? (
            <span className="inline-flex items-center gap-2 text-slate-400">
              <Loader2 size={14} className="animate-spin" /> 실행 중…
            </span>
          ) : (
            <>
              {output?.stdout}
              {output?.error && <span className="text-red-300">{output.error}</span>}
              {!output?.stdout && !output?.error && <span className="text-slate-500">(출력 없음)</span>}
            </>
          )}
        </pre>
      </div>
    </div>
  );
}

function Verdict({ result }) {
  if (result.problemError) {
    return <div className="rounded-md bg-peach-50 dark:bg-peach-950/40 px-3 py-2 text-sm text-peach-800 dark:text-peach-200">{result.problemError}</div>;
  }
  if (result.pass) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-950/40 px-3 py-2 font-semibold text-green-700 dark:text-green-300">
        <CheckCircle2 size={18} /> 정답입니다!
      </div>
    );
  }
  return (
    <div className="space-y-2 rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2">
      <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
        <XCircle size={18} /> 오답입니다.
        {!result.student.ok && <span className="text-sm font-normal">(코드 실행 중 오류)</span>}
      </div>
      {result.student.ok && (
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <OutputBox label="내 출력" text={result.student.stdout} />
          <OutputBox label="기대 출력" text={result.expected.stdout} />
        </div>
      )}
    </div>
  );
}

function OutputBox({ label, text }) {
  return (
    <div>
      <div className="mb-1 text-slate-500 dark:text-slate-400">{label}</div>
      <pre className="font-code max-h-48 overflow-auto whitespace-pre-wrap break-all rounded border bg-white dark:bg-slate-900 p-2">{text || "(출력 없음)"}</pre>
    </div>
  );
}
