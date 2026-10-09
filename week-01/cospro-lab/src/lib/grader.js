import { runPython } from "./pyRunner";

// 줄 끝 공백, 맨 끝의 빈 줄, 윈도우 줄바꿈(\r\n) 차이는 무시하고 비교한다.
export function normalizeOutput(text) {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

// 표준 입력 칸에 '---' 만 있는 줄을 넣으면 입력 세트가 여러 개로 나뉜다.
// (3급처럼 input() 을 쓰는 문제를 여러 입력으로 채점하려고)
export function splitCases(stdin) {
  return (stdin || "").replace(/\r\n/g, "\n").split(/^---[ \t]*$/m).map((c) => c.replace(/^\n/, ""));
}

/**
 * 모든 입력 세트로 실행해 출력을 이어 붙인다. 입력 세트가 하나면 runPython 과 같다.
 * 결과: { ok, stdout, error }
 */
export async function runAllCases(code, stdin) {
  const cases = splitCases(stdin);
  if (cases.length === 1) return runPython(code, cases[0]);
  let stdout = "";
  for (let i = 0; i < cases.length; i++) {
    const r = await runPython(code, cases[i]);
    stdout += `── 입력 ${i + 1} ──\n${r.stdout}${r.stdout.endsWith("\n") || !r.stdout ? "" : "\n"}`;
    if (!r.ok) return { ok: false, stdout, error: r.error };
  }
  return { ok: true, stdout, error: "" };
}

/**
 * 학생 코드와 정답 코드를 같은 입력(들)으로 실행해 print 출력을 비교한다.
 * 결과: { pass, student, expected, problemError }
 */
export async function grade(problem, studentCode) {
  const student = await runAllCases(studentCode, problem.stdin);
  const expected = await runAllCases(problem.answerCode || "", problem.stdin);

  if (!expected.ok) {
    return { pass: false, student, expected, problemError: "정답 코드에서 오류가 났습니다. 선생님께 알려 주세요." };
  }
  const pass = student.ok && normalizeOutput(student.stdout) === normalizeOutput(expected.stdout);
  return { pass, student, expected, problemError: null };
}
