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

/**
 * 학생 코드와 정답 코드를 같은 입력으로 실행해 print 출력을 비교한다.
 * 결과: { pass, student, expected, problemError }
 */
export async function grade(problem, studentCode) {
  const student = await runPython(studentCode, problem.stdin);
  const expected = await runPython(problem.answerCode || "", problem.stdin);

  if (!expected.ok) {
    return { pass: false, student, expected, problemError: "정답 코드에서 오류가 났습니다. 선생님께 알려 주세요." };
  }
  const pass = student.ok && normalizeOutput(student.stdout) === normalizeOutput(expected.stdout);
  return { pass, student, expected, problemError: null };
}
