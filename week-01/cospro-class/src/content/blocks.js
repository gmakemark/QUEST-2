// 수업 내용을 적기 위한 도우미
//
//   md`설명`                         → 설명 글 (마크다운)
//   code(py`코드`, "입력값")          → 실행해 볼 수 있는 예제 코드
//   ex({ title, prompt, starter, answer, stdin }) → 실습 (예시 답안 버튼이 있음)
//   problem(문제)                     → 시험 형식 문제 (채점 있음, STEP3)
//
// py`…` 는 String.raw 라서 파이썬 코드의 \n 같은 글자가 그대로 남는다.
// 코드와 글은 앞뒤 빈 줄과 공통 들여쓰기를 지워서, 이 파일 안에서는 보기 좋게 들여 써도 된다.

export const py = String.raw;

export function dedent(text) {
  const lines = text.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join("\n");
}

// md 는 raw 문자열이라 마크다운의 인라인 코드 백틱은 \` 로 적는다. (여기서 \` → ` 로 바꿈)
export const md = (strings, ...values) => ({
  type: "md",
  text: dedent(String.raw(strings, ...values)).replaceAll("\\`", "`"),
});

export const code = (src, stdin = "") => ({ type: "code", code: dedent(src) + "\n", stdin });

export const ex = ({ title, prompt, starter, answer, stdin = "" }) => ({
  type: "exercise",
  title,
  prompt: typeof prompt === "string" ? dedent(prompt) : prompt.text, // md`…` 로 써도 된다
  starter: dedent(starter) + "\n",
  answer: dedent(answer) + "\n",
  stdin,
});

export const problem = (p) => ({ type: "problem", problem: p });
