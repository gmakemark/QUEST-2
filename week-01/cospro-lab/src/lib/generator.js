// ─────────────────────────────────────────────────────────────
// 문제 자동 생성 (템플릿 방식 · 인터넷/API 필요 없음)
//
// 템플릿 하나 = 문제 틀 하나. grade 는 COS PRO 급수(1·2·3급), topic 은 범위. make(r) 를 부를 때마다 숫자·조건·테스트 값이 무작위로 바뀐다.
// 각 템플릿은 정답 코드(body) 와 함께
//   blank : [정답 코드에서 찾을 글자, 빈칸으로 바꾼 글자]   → "빈칸 채우기" 문제
//   bug   : [정답 코드에서 찾을 글자, 틀리게 바꾼 글자]     → "한 줄 고치기" 문제
// 를 가지고 있어서, 같은 틀로 세 가지 유형을 모두 만들 수 있다.
// ref 는 같은 계산을 하는 자바스크립트 함수로, 지문의 예시 표(return 값)를 채울 때 쓴다.
// ─────────────────────────────────────────────────────────────

import { newId } from "./storage.js";
import { TEMPLATES_3, buildStdinProblem } from "./generator3.js";

export const TOPICS = [
  { key: "if", label: "조건문" },
  { key: "loop", label: "반복문" },
  { key: "list", label: "리스트" },
  { key: "string", label: "문자열" },
  { key: "dict", label: "딕셔너리 · 정렬" },
  { key: "builtin", label: "내장함수" },
];

export const TYPES = [
  { key: "complete", label: "함수 완성", label3: "구현" },
  { key: "blank", label: "빈칸 채우기", label3: "빈칸" },
  { key: "bug", label: "한 줄 고치기" },
];

// 그 급수에서 만들 수 있는 유형 (3급은 시험 형식대로 빈칸 · 구현만)
export function typesOf(grade) {
  return TYPES.filter((t) => t.key === "complete" || TEMPLATES.some((tpl) => tpl.grade === grade && tpl.types.includes(t.key))).map((t) => ({
    key: t.key,
    label: grade === 3 && t.label3 ? t.label3 : t.label,
  }));
}

// ── 무작위 도우미 ──
const makeRandom = (rand = Math.random) => {
  const int = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const pick = (arr) => arr[int(0, arr.length - 1)];
  const list = (len, lo, hi) => Array.from({ length: len }, () => int(lo, hi));
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const distinct = (len, lo, hi) => shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, len);
  const word = (len, letters) => Array.from({ length: len }, () => pick([...letters])).join("");
  return { int, pick, list, shuffle, distinct, word };
};

// 자바스크립트 값 → 파이썬 코드에 쓰는 모양
export function pyLit(v) {
  if (Array.isArray(v)) return "[" + v.map(pyLit).join(", ") + "]";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "boolean") return v ? "True" : "False";
  return String(v);
}

const WORDS = ["apple", "banana", "computer", "python", "education", "orange", "keyboard", "umbrella", "science", "library", "monitor", "algorithm"];

// ── 2급 템플릿 ──
const TEMPLATES_2 = [
  {
    grade: 2,
    topic: "if",
    make(r) {
      const k = r.int(3, 9);
      const tests = [[k * r.int(2, 9)], [k * r.int(2, 9) + r.int(1, k - 1)], [k * r.int(10, 30)], [k * r.int(2, 30) + 1]];
      return {
        title: `${k}의 배수 판별`,
        desc: `정수 \`n\` 이 ${k}의 배수이면 \`"YES"\`, 아니면 \`"NO"\` 를 return 하려고 합니다.`,
        params: ["n"],
        paramDesc: ["`n` : 1 이상 1,000 이하인 정수"],
        init: '""',
        body: `def solution(n):\n    if n % ${k} == 0:\n        answer = "YES"\n    else:\n        answer = "NO"\n    return answer`,
        blank: [`if n % ${k} == 0:`, "if ____:"],
        bug: [`n % ${k} == 0`, `n // ${k} == 0`],
        tests,
        ref: (n) => (n % k === 0 ? "YES" : "NO"),
      };
    },
  },
  {
    grade: 2,
    topic: "if",
    make(r) {
      const a = r.int(17, 19) * 5;
      const b = r.int(13, 16) * 5;
      const tests = [[a], [a - 1], [b], [r.int(0, b - 1)]];
      return {
        title: "점수로 등급 매기기",
        desc: `점수 \`score\` 가 ${a}점 이상이면 \`"A"\`, ${b}점 이상 ${a}점 미만이면 \`"B"\`, 그 밖에는 \`"C"\` 를 return 하려고 합니다.`,
        params: ["score"],
        paramDesc: ["`score` : 0 이상 100 이하인 정수"],
        init: '""',
        body: `def solution(score):\n    if score >= ${a}:\n        answer = "A"\n    elif score >= ${b}:\n        answer = "B"\n    else:\n        answer = "C"\n    return answer`,
        blank: [`elif score >= ${b}:`, "elif ____:"],
        bug: [`if score >= ${a}:`, `if score > ${a}:`],
        tests,
        ref: (s) => (s >= a ? "A" : s >= b ? "B" : "C"),
      };
    },
  },
  {
    grade: 2,
    topic: "loop",
    make(r) {
      const k = r.int(2, 7);
      const tests = [[k * r.int(3, 15)], [r.int(10, 100)], [r.int(10, 100)]];
      return {
        title: `${k}의 배수의 합`,
        desc: `1부터 \`n\` 까지의 정수 중 ${k}의 배수를 모두 더한 값을 return 하려고 합니다.`,
        params: ["n"],
        paramDesc: ["`n` : 1 이상 100 이하인 정수"],
        init: "0",
        body: `def solution(n):\n    answer = 0\n    for i in range(1, n + 1):\n        if i % ${k} == 0:\n            answer += i\n    return answer`,
        blank: ["for i in range(1, n + 1):", "for i in range(____):"],
        bug: ["range(1, n + 1)", "range(1, n)"],
        tests,
        ref: (n) => {
          let s = 0;
          for (let i = 1; i <= n; i++) if (i % k === 0) s += i;
          return s;
        },
      };
    },
  },
  {
    grade: 2,
    topic: "loop",
    make(r) {
      const tests = [[r.int(100, 999)], [r.int(1000, 9999)], [r.int(10000, 99999)]];
      return {
        title: "자릿수의 합",
        desc: "양의 정수 `n` 의 각 자리 숫자를 모두 더한 값을 return 하려고 합니다.",
        params: ["n"],
        paramDesc: ["`n` : 1 이상 100,000 이하인 정수"],
        init: "0",
        body: "def solution(n):\n    answer = 0\n    while n > 0:\n        answer += n % 10\n        n //= 10\n    return answer",
        blank: ["answer += n % 10", "answer += ____"],
        bug: ["while n > 0:", "while n > 10:"],
        tests,
        ref: (n) => [...String(n)].reduce((s, d) => s + Number(d), 0),
      };
    },
  },
  {
    grade: 2,
    topic: "loop",
    make(r) {
      const a = r.int(2, 5);
      const b = r.pick([6, 7, 8, 9].filter((x) => x % a !== 0));
      const tests = [[r.int(20, 60)], [r.int(20, 60)], [r.int(61, 100)]];
      return {
        title: `${a} 또는 ${b}의 배수 세기`,
        desc: `1부터 \`n\` 까지의 정수 중 ${a}의 배수이거나 ${b}의 배수인 수의 개수를 return 하려고 합니다.`,
        params: ["n"],
        paramDesc: ["`n` : 1 이상 100 이하인 정수"],
        init: "0",
        body: `def solution(n):\n    answer = 0\n    for i in range(1, n + 1):\n        if i % ${a} == 0 or i % ${b} == 0:\n            answer += 1\n    return answer`,
        blank: [`i % ${a} == 0 or i % ${b} == 0`, `i % ${a} == 0 ____ i % ${b} == 0`],
        bug: [" or ", " and "],
        tests,
        ref: (n) => {
          let c = 0;
          for (let i = 1; i <= n; i++) if (i % a === 0 || i % b === 0) c++;
          return c;
        },
      };
    },
  },
  {
    grade: 2,
    topic: "loop",
    make(r) {
      const x = r.int(1, 20);
      const tests = [[x, x + r.int(3, 10)], [r.int(30, 40), r.int(10, 25)], [x, x]];
      return {
        title: "두 수 사이의 합",
        desc: "두 정수 `a`, `b` 사이에 있는 모든 정수(`a`, `b` 포함)의 합을 return 하려고 합니다. `a` 가 `b` 보다 클 수도 있습니다.",
        params: ["a", "b"],
        paramDesc: ["`a`, `b` : 1 이상 100 이하인 정수"],
        init: "0",
        body: "def solution(a, b):\n    if a > b:\n        a, b = b, a\n    answer = 0\n    for i in range(a, b + 1):\n        answer += i\n    return answer",
        blank: ["a, b = b, a", "____"],
        bug: ["if a > b:", "if a < b:"],
        tests,
        ref: (a, b) => {
          const [lo, hi] = a > b ? [b, a] : [a, b];
          let s = 0;
          for (let i = lo; i <= hi; i++) s += i;
          return s;
        },
      };
    },
  },
  {
    grade: 2,
    topic: "list",
    make(r) {
      const one = () => {
        const k = r.int(10, 40);
        const nums = r.shuffle([...r.list(r.int(4, 7), 1, 50), k + r.int(1, 9)]);
        return [nums, k];
      };
      const tests = [one(), one(), one()];
      return {
        title: "k 보다 큰 수 세기",
        desc: "정수가 담긴 리스트 `numbers` 와 정수 `k` 가 주어질 때, `numbers` 에서 `k` 보다 큰 수의 개수를 return 하려고 합니다.",
        params: ["numbers", "k"],
        paramDesc: ["`numbers` : 정수가 담긴 리스트 (길이 1 이상 100 이하)", "`k` : 정수"],
        init: "0",
        body: "def solution(numbers, k):\n    answer = 0\n    for x in numbers:\n        if x > k:\n            answer += 1\n    return answer",
        blank: ["if x > k:", "if ____:"],
        bug: ["answer += 1", "answer += x"],
        tests,
        ref: (nums, k) => nums.filter((x) => x > k).length,
      };
    },
  },
  {
    grade: 2,
    topic: "list",
    make(r) {
      const tests = [[r.list(r.int(4, 7), 1, 99)], [r.list(r.int(4, 7), 1, 99)], [r.list(r.int(4, 7), 1, 99)]];
      return {
        title: "최댓값과 최솟값의 차이",
        desc: "양의 정수가 담긴 리스트 `numbers` 에서 가장 큰 수와 가장 작은 수의 차이를 return 하려고 합니다.",
        params: ["numbers"],
        paramDesc: ["`numbers` : 양의 정수가 담긴 리스트 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(numbers):\n    max_v = numbers[0]\n    min_v = numbers[0]\n    for x in numbers:\n        if x > max_v:\n            max_v = x\n        if x < min_v:\n            min_v = x\n    answer = max_v - min_v\n    return answer",
        blank: ["answer = max_v - min_v", "answer = ____"],
        bug: ["min_v = numbers[0]", "min_v = 0"],
        tests,
        ref: (nums) => Math.max(...nums) - Math.min(...nums),
      };
    },
  },
  {
    grade: 2,
    topic: "list",
    make(r) {
      const tests = [[r.list(r.int(5, 8), 1, 30)], [r.list(r.int(5, 8), 1, 30)], [r.list(r.int(5, 8), 1, 30)]];
      return {
        title: "짝수 번째 자리의 합",
        desc: "정수가 담긴 리스트 `numbers` 에서 인덱스가 짝수(0, 2, 4, …)인 원소를 모두 더한 값을 return 하려고 합니다.",
        params: ["numbers"],
        paramDesc: ["`numbers` : 정수가 담긴 리스트 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(numbers):\n    answer = 0\n    for i in range(0, len(numbers), 2):\n        answer += numbers[i]\n    return answer",
        blank: ["range(0, len(numbers), 2)", "range(____)"],
        bug: ["range(0, len(numbers), 2)", "range(1, len(numbers), 2)"],
        tests,
        ref: (nums) => nums.reduce((s, x, i) => (i % 2 === 0 ? s + x : s), 0),
      };
    },
  },
  {
    grade: 2,
    topic: "string",
    make(r) {
      const one = () => {
        const s = r.word(r.int(6, 10), "abcde");
        return [s, r.pick([...s])];
      };
      const tests = [one(), one(), one()];
      return {
        title: "문자 개수 세기",
        desc: "문자열 `s` 와 문자 `ch` 가 주어질 때, `s` 안에 `ch` 가 몇 번 나오는지 return 하려고 합니다.",
        params: ["s", "ch"],
        paramDesc: ["`s` : 알파벳 소문자로 된 문자열 (길이 1 이상 100 이하)", "`ch` : 알파벳 소문자 한 글자"],
        init: "0",
        body: "def solution(s, ch):\n    answer = 0\n    for c in s:\n        if c == ch:\n            answer += 1\n    return answer",
        blank: ["if c == ch:", "if ____:"],
        bug: ["if c == ch:", "if c != ch:"],
        tests,
        ref: (s, ch) => [...s].filter((c) => c === ch).length,
      };
    },
  },
  {
    grade: 2,
    topic: "string",
    make(r) {
      const one = () => r.word(r.int(6, 10), "aBcDeFgHkMpQ");
      const tests = [[one()], [one()], [one()]];
      return {
        title: "대문자 개수 세기",
        desc: "알파벳으로 된 문자열 `s` 에서 대문자가 몇 개인지 return 하려고 합니다.",
        params: ["s"],
        paramDesc: ["`s` : 알파벳 대문자와 소문자로 된 문자열 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(s):\n    answer = 0\n    for c in s:\n        if c.isupper():\n            answer += 1\n    return answer",
        blank: ["if c.isupper():", "if c.____():"],
        bug: ["c.isupper()", "c.islower()"],
        tests,
        ref: (s) => [...s].filter((c) => c >= "A" && c <= "Z").length,
      };
    },
  },
  {
    grade: 2,
    topic: "string",
    make(r) {
      const tests = r.shuffle(WORDS).slice(0, 3).map((w) => [w]);
      return {
        title: "모음 빼기",
        desc: '알파벳 소문자로 된 문자열 `s` 에서 모음(`a`, `e`, `i`, `o`, `u`)을 모두 뺀 문자열을 return 하려고 합니다.',
        params: ["s"],
        paramDesc: ["`s` : 알파벳 소문자로 된 문자열 (길이 1 이상 100 이하)"],
        init: '""',
        body: 'def solution(s):\n    answer = ""\n    for c in s:\n        if c not in "aeiou":\n            answer += c\n    return answer',
        blank: ['if c not in "aeiou":', 'if c ____ "aeiou":'],
        bug: ["answer += c", "answer = c"],
        tests,
        ref: (s) => [...s].filter((c) => !"aeiou".includes(c)).join(""),
      };
    },
  },
  {
    grade: 2,
    topic: "dict",
    make(r) {
      const tests = [[r.list(r.int(8, 12), 1, 5)], [r.list(r.int(8, 12), 1, 5)], [r.list(r.int(8, 12), 1, 5)]];
      return {
        title: "가장 많이 나온 횟수",
        desc: "정수가 담긴 리스트 `numbers` 에서 가장 많이 나온 수가 몇 번 나왔는지 return 하려고 합니다.",
        params: ["numbers"],
        paramDesc: ["`numbers` : 정수가 담긴 리스트 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(numbers):\n    count = {}\n    for x in numbers:\n        if x in count:\n            count[x] += 1\n        else:\n            count[x] = 1\n    answer = max(count.values())\n    return answer",
        blank: ["answer = max(count.values())", "answer = max(____)"],
        bug: ["count[x] = 1", "count[x] = 0"],
        tests,
        ref: (nums) => {
          const c = {};
          for (const x of nums) c[x] = (c[x] || 0) + 1;
          return Math.max(...Object.values(c));
        },
      };
    },
  },
  {
    grade: 2,
    topic: "dict",
    make(r) {
      const one = () => {
        const len = r.int(5, 8);
        return [r.distinct(len, 1, 99), r.int(1, len - 1)];
      };
      const tests = [one(), one(), one()];
      return {
        title: "k 번째로 큰 수",
        desc: "서로 다른 정수가 담긴 리스트 `numbers` 와 정수 `k` 가 주어질 때, `numbers` 에서 `k` 번째로 큰 수를 return 하려고 합니다.",
        params: ["numbers", "k"],
        paramDesc: ["`numbers` : 서로 다른 정수가 담긴 리스트 (길이 2 이상 100 이하)", "`k` : 1 이상 `numbers` 의 길이 미만인 정수"],
        init: "0",
        body: "def solution(numbers, k):\n    numbers.sort(reverse=True)\n    answer = numbers[k - 1]\n    return answer",
        blank: ["numbers.sort(reverse=True)", "numbers.sort(____)"],
        bug: ["numbers[k - 1]", "numbers[k]"],
        tests,
        ref: (nums, k) => [...nums].sort((x, y) => y - x)[k - 1],
      };
    },
  },
  {
    grade: 2,
    topic: "builtin",
    make(r) {
      const one = () => r.list(r.int(5, 8), 1, 50);
      const tests = [[one()], [one()], [one()]];
      return {
        title: "평균 이상인 수 세기",
        desc: "정수가 담긴 리스트 `numbers` 에서 평균 이상인 수의 개수를 return 하려고 합니다. (내장함수 `sum`, `len` 을 써 보세요)",
        params: ["numbers"],
        paramDesc: ["`numbers` : 정수가 담긴 리스트 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(numbers):\n    avg = sum(numbers) / len(numbers)\n    answer = 0\n    for x in numbers:\n        if x >= avg:\n            answer += 1\n    return answer",
        blank: ["avg = sum(numbers) / len(numbers)", "avg = ____ / ____"],
        bug: ["answer += 1", "answer += x"],
        tests,
        ref: (nums) => {
          const avg = nums.reduce((s, x) => s + x, 0) / nums.length;
          return nums.filter((x) => x >= avg).length;
        },
      };
    },
  },
  {
    grade: 2,
    topic: "builtin",
    make(r) {
      const one = () => [r.distinct(r.pick([5, 7, 9]), 1, 99)];
      const tests = [one(), one(), one()];
      return {
        title: "가운데 값 찾기",
        desc: "서로 다른 정수가 홀수 개 담긴 리스트 `numbers` 를 크기 순으로 정렬했을 때, 가운데에 오는 수를 return 하려고 합니다. (내장함수 `sorted` 를 써 보세요)",
        params: ["numbers"],
        paramDesc: ["`numbers` : 서로 다른 정수가 홀수 개 담긴 리스트 (길이 1 이상 99 이하)"],
        init: "0",
        body: "def solution(numbers):\n    numbers = sorted(numbers)\n    answer = numbers[len(numbers) // 2]\n    return answer",
        blank: ["numbers = sorted(numbers)", "numbers = ____(numbers)"],
        bug: ["numbers[len(numbers) // 2]", "numbers[len(numbers) // 2 + 1]"],
        tests,
        ref: (nums) => [...nums].sort((a, b) => a - b)[Math.floor(nums.length / 2)],
      };
    },
  },
  {
    grade: 2,
    topic: "builtin",
    make(r) {
      const one = () => [r.shuffle(WORDS).slice(0, r.int(3, 5))];
      const tests = [one(), one(), one()];
      return {
        title: "가장 긴 단어의 길이",
        desc: "영어 단어가 담긴 리스트 `words` 에서 가장 긴 단어의 글자 수를 return 하려고 합니다. (내장함수 `max`, `len` 을 써 보세요)",
        params: ["words"],
        paramDesc: ["`words` : 알파벳 소문자 단어가 담긴 리스트 (길이 1 이상 100 이하)"],
        init: "0",
        body: "def solution(words):\n    answer = 0\n    for w in words:\n        answer = max(answer, len(w))\n    return answer",
        blank: ["answer = max(answer, len(w))", "answer = ____(answer, len(w))"],
        bug: ["answer = max(answer, len(w))", "answer = min(answer, len(w))"],
        tests,
        ref: (words) => Math.max(...words.map((w) => w.length)),
      };
    },
  },
];

// 2급은 한 틀로 세 유형 모두, 3급은 기출처럼 틀마다 정해진 유형 하나(빈칸 또는 구현)
const TEMPLATES = [
  ...TEMPLATES_2.map((t) => ({ ...t, types: ["complete", "blank", "bug"] })),
  ...TEMPLATES_3.map((t) => ({ ...t, types: [t.type] })),
];

const TYPE_SENTENCE = {
  complete: "`solution` 함수를 완성해 주세요.",
  blank: "빈칸(`____`)을 채워 `solution` 함수를 완성해 주세요.",
  bug: "그런데 코드 **한 줄**이 잘못되어 올바른 답이 나오지 않습니다. **한 줄만** 고쳐 주세요.",
};
const TITLE_PREFIX = { complete: "", blank: "빈칸 채우기 - ", bug: "한 줄 고치기 - " };

// 템플릿이 만든 재료로 문제 하나를 조립한다.
export function buildProblem(t, type, grade) {
  const prints = t.tests.map((args) => `print(solution(${args.map(pyLit).join(", ")}))`).join("\n");
  const footer = `\n\n\n# 아래는 테스트 코드입니다. 고치지 마세요.\n${prints}\n`;

  let starter;
  if (type === "blank") starter = t.body.replace(t.blank[0], t.blank[1]);
  else if (type === "bug") starter = t.body.replace(t.bug[0], t.bug[1]);
  else starter = `def solution(${t.params.join(", ")}):\n    answer = ${t.init}\n    # 여기에 코드를 작성하세요\n    return answer`;

  const examples = t.tests.slice(0, 2);
  const table = [
    `| ${[...t.params, "return"].join(" | ")} |`,
    `|${[...t.params, "return"].map(() => "---").join("|")}|`,
    ...examples.map((args) => `| ${[...args, t.ref(...args)].map(pyLit).join(" | ")} |`),
  ].join("\n");

  const description = [
    "### 문제 설명",
    "",
    `${t.desc} ${TYPE_SENTENCE[type]}`,
    "",
    "### 매개변수 설명",
    ...t.paramDesc.map((d) => `- ${d}`),
    "",
    "### 예시",
    "",
    table,
  ].join("\n");

  return {
    id: newId(),
    grade,
    title: TITLE_PREFIX[type] + t.title,
    description,
    starterCode: starter + footer,
    answerCode: t.body + footer,
    stdin: "",
    // 검사용: 정답 코드를 실행했을 때 나와야 하는 출력
    expected: t.tests.map((args) => String(t.ref(...args))).join("\n"),
  };
}

const poolOf = (grade, topics, types = ["complete", "blank", "bug"]) =>
  TEMPLATES.filter((t) => t.grade === grade && topics.includes(t.topic) && t.types.some((ty) => types.includes(ty)));

export function countTemplates(grade, topics, types) {
  return poolOf(grade, topics, types).length;
}

// 그 급수에 문제 틀이 있는 범위만
export function topicsOf(grade) {
  return TOPICS.filter((topic) => TEMPLATES.some((t) => t.grade === grade && t.topic === topic.key));
}

/**
 * grade: 1 | 2 | 3  topics: ["if", "loop", ...]  types: ["complete", "blank", "bug"]  count: 만들 문제 수
 * 같은 틀이 연달아 나오지 않도록, 고른 범위의 틀을 섞어서 차례로 돌려 쓴다.
 */
export function generateProblems({ grade = 2, topics, types, count }, rand) {
  const r = makeRandom(rand);
  const pool = poolOf(grade, topics, types);
  if (!pool.length) return [];
  let order = [];
  const result = [];
  for (let i = 0; i < count; i++) {
    if (!order.length) order = r.shuffle(pool);
    const tpl = order.pop();
    const usable = types.filter((t) => tpl.types.includes(t));
    const type = usable[i % usable.length];
    const made = tpl.make(r);
    result.push(made.inputs ? buildStdinProblem(made, type, tpl.grade, newId) : buildProblem(made, type, tpl.grade));
  }
  return result;
}
