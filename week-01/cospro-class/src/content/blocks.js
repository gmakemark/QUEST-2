// 수업 내용을 적기 위한 도우미
//
//   md`설명`                                → 설명 글 (마크다운)
//   task("문제", py`답`, { given, fix, sample }) → 연습 칸 하나. 코드 칸 맨 위 주석이 문제이고, 그 아래에 직접 써 본다.
//        given : 문제와 함께 미리 넣어 두는 코드 (변수 등)
//        fix   : true 면 given 은 고칠 코드이고, 답은 고친 전체 코드
//        sample: input() 을 쓰는 답을 확인할 때 넣어 볼 입력값 (화면에는 안 보이고 정답 창·검사용)
//   code(py`코드`)                            → 실행만 해 보는 코드 (오류 보기 등)
//   ex({ title, prompt, starter, answer, sample }) → 실습 (조금 더 긴 구현 문제, 예시 답안 있음)
//   problem(문제)                            → 시험 형식 문제 (채점 있음, STEP3)
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

// 마크다운은 줄 하나만 바꾸면 띄어쓰기로 이어 붙인다. 설명을 줄 바꿔 쓴 곳은 화면에서도 줄이 바뀌도록
// 줄 끝에 공백 두 칸(강제 줄바꿈)을 붙인다. 표·목록·제목·인용·코드 블록은 건드리지 않는다.
const startsBlock = (line) => /^\s*([-*+] |\d+\. |\||#|>|```)/.test(line);
function keepLineBreaks(text) {
  const lines = text.split("\n");
  let fence = false;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim().startsWith("```")) fence = !fence;
    const a = lines[i];
    const b = lines[i + 1];
    if (fence || !a.trim() || !b.trim() || a.trim().startsWith("|") || a.trim().startsWith("```") || startsBlock(b)) continue;
    lines[i] = a + "  ";
  }
  return lines.join("\n");
}

// md 는 raw 문자열이라 마크다운의 인라인 코드 백틱은 \` 로 적는다. (여기서 \` → ` 로 바꿈)
export const md = (strings, ...values) => ({
  type: "md",
  text: keepLineBreaks(dedent(String.raw(strings, ...values)).replaceAll("\\`", "`")),
});

const comment = (q) =>
  dedent(q)
    .split("\n")
    .map((l) => "# " + l)
    .join("\n");

export const task = (q, answer, { given = "", fix = false, sample = "" } = {}) => {
  const head = comment(q) + "\n";
  const g = given ? dedent(given) + "\n" : "";
  return {
    type: "task",
    starter: head + g,
    answer: head + (fix ? "" : g) + dedent(answer) + "\n",
    sample,
  };
};

export const code = (src) => ({ type: "code", code: dedent(src) + "\n" });

export const ex = ({ title, prompt, starter = "", answer, sample = "" }) => ({
  type: "exercise",
  title,
  prompt: typeof prompt === "string" ? dedent(prompt) : prompt.text, // md`…` 로 써도 된다
  starter: starter ? dedent(starter) + "\n" : "",
  answer: dedent(answer) + "\n",
  sample,
});

export const problem = (p) => ({ type: "problem", problem: p });
