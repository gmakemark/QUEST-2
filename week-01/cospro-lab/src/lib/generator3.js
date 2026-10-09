// ─────────────────────────────────────────────────────────────
// 3급 문제 틀 (COS PRO 3급 모의시험 형식)
//
// 2급과 다른 점: solution 함수가 아니라 input() 으로 입력을 받고 print 로 출력하는 짧은 코드.
//   [빈칸] 정답 코드의 일부를 ⬜ 로 바꾼 코드를 채운다.
//   [구현] 입력 받는 줄만 주고(또는 빈 칸으로) 처음부터 작성한다.
// 입력 세트를 여러 개 만들어 '---' 로 이어 붙이므로, 예시 값만 print 하는 코드는 정답이 되지 않는다.
//
// make(r) 가 돌려주는 것
//   inputs : 입출력 예 표의 입력 칸 이름 (한 칸 = input() 한 줄)
//   tests  : 입력 세트 목록. 세트 하나 = 줄 목록. 첫 번째 세트가 입출력 예로 보인다.
//   ref    : 같은 계산을 하는 자바스크립트 함수 (줄 목록 → 출력 글자)
//   body   : 정답 코드, blank : [정답 코드에서 찾을 글자, ⬜ 로 바꾼 글자]
//   given  : [구현] 문제에 미리 적어 줄 입력 받는 줄 (없으면 빈 칸)
// ─────────────────────────────────────────────────────────────

const WORDS = ["apple", "banana", "peach", "lemon", "grape", "melon", "cherry", "orange", "kiwi", "mango", "yellow", "green", "purple", "silver"];
const nums = (line) => line.split(" ").map(Number);

export const TEMPLATES_3 = [
  {
    grade: 3,
    topic: "list",
    make(r) {
      const odd = r.int(0, 1) === 1; // true: 홀수 번째(인덱스 0, 2, …)
      const start = odd ? 0 : 1;
      const one = () => {
        const arr = r.list(r.int(5, 9), 0, 60);
        return [String(arr.length), arr.join(" ")];
      };
      return {
        title: odd ? "홀수 번째 원소의 합" : "짝수 번째 원소의 합",
        desc: `정수 n 과 n 개의 정수가 담긴 리스트 arr 을 입력받아, arr 의 원소 중 **${odd ? "홀수" : "짝수"} 번째**(${odd ? "1, 3, 5" : "2, 4, 6"} … 번째) 원소를 모두 더한 값을 출력하려고 합니다.`,
        inputs: ["n", "arr"],
        tests: [one(), one(), one()],
        ref: ([, line]) => String(nums(line).reduce((s, x, i) => (i % 2 === start ? s + x : s), 0)),
        body: `n = int(input())\narr = list(map(int, input().split()))\n\ntotal = 0\nfor i in range(${start}, n, 2):\n    total += arr[i]\n\nprint(total)`,
        blank: ["    total += arr[i]", "    ⬜"],
        given: "n = int(input())\narr = list(map(int, input().split()))\n",
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    make(r) {
      const [method, what] = r.pick([
        ["islower", "알파벳 소문자"],
        ["isupper", "알파벳 대문자"],
        ["isdigit", "숫자"],
      ]);
      const one = () => [r.word(r.int(5, 10), "abcxyzLOGIC0123")];
      return {
        title: `${what} 개수`,
        desc: `문자열 하나를 입력받아, 문자열에 들어 있는 **${what}의 개수**를 출력하려고 합니다.`,
        inputs: ["s"],
        tests: [one(), one(), one()],
        ref: ([s]) => {
          const test = { islower: /[a-z]/, isupper: /[A-Z]/, isdigit: /[0-9]/ }[method];
          return String([...s].filter((c) => test.test(c)).length);
        },
        body: `count = 0\ns = input()\n\nfor i in range(0, len(s)):\n    if s[i].${method}():\n        count += 1\n\nprint(count)`,
        blank: [`if s[i].${method}():`, "if ⬜:"],
        given: "s = input()\n",
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    make(r) {
      const sym = r.pick(["&", "-", "#", "@", "+"]);
      const one = () => r.shuffle(WORDS).slice(0, 2);
      return {
        title: `${sym} 로 연결하기`,
        desc: `문자열 두 개를 입력받아, 첫 번째 문자열과 두 번째 문자열 사이에 \`${sym}\` 를 넣어 출력하려고 합니다.`,
        inputs: ["s1", "s2"],
        tests: [one(), one(), one()],
        ref: ([a, b]) => a + sym + b,
        body: `s1 = input()\ns2 = input()\n\nprint(s1 + "${sym}" + s2)`,
        blank: [`print(s1 + "${sym}" + s2)`, "print(⬜)"],
        given: "s1 = input()\ns2 = input()\n",
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    make(r) {
      const later = r.int(0, 1) === 1;
      const one = () => r.shuffle(WORDS).slice(0, 2);
      return {
        title: "영어사전 순 비교",
        desc: `알파벳 소문자로 된 서로 다른 문자열 두 개를 입력받아, 영어사전 순으로 **${later ? "뒤에" : "앞에"} 오는** 문자열을 출력하려고 합니다.`,
        inputs: ["s1", "s2"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => ((later ? a > b : a < b) ? a : b),
        body: `s1 = input()\ns2 = input()\n\nif s1 ${later ? ">" : "<"} s2:\n    print(s1)\nelse:\n    print(s2)`,
        blank: [`if s1 ${later ? ">" : "<"} s2:`, "if ⬜:"],
        given: "s1 = input()\ns2 = input()\n",
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    make(r) {
      const one = () => [r.pick(["IoT", "Code", "Python", "AI", "COSPRO", "Data", "Hello"])];
      return {
        title: "한 글자씩 늘려 출력",
        desc: "문자열 하나를 입력받아, 앞에서부터 **한 글자씩 늘어나는 부분 문자열**을 공백으로 구분하여 순서대로 출력하려고 합니다.",
        inputs: ["s"],
        tests: r.shuffle([["IoT"], one(), one(), one()]).slice(0, 3),
        ref: ([s]) => [...s].map((_, i) => s.slice(0, i + 1)).join(" "),
        body: 's = input()\n\nfor i in range(0, len(s)):\n    for j in range(i + 1):\n        print(s[j], end="")\n    print(end=" ")',
        blank: ['for j in range(i + 1):\n        print(s[j], end="")', 'for j in range(⬜):\n        print(⬜, end="")'],
        given: "s = input()\n",
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    make(r) {
      const d = r.int(2, 9);
      const one = () => [String(r.int(1, 20)), String(r.int(3, 8))];
      return {
        title: `${d}씩 더하여 출력`,
        desc: `두 자연수 k 와 n 을 입력받아, k 에서 시작해 **${d}씩 더한 수**를 작은 것부터 n 개, 공백으로 구분하여 출력하려고 합니다.`,
        inputs: ["k", "n"],
        tests: [one(), one(), one()],
        ref: ([k, n]) => Array.from({ length: Number(n) }, (_, i) => Number(k) + d * i).join(" "),
        body: `k = int(input())\nn = int(input())\n\nfor i in range(n):\n    print(k + ${d} * i, end=" ")`,
        blank: [`print(k + ${d} * i, end=" ")`, 'print(⬜, end=" ")'],
        given: "k = int(input())\nn = int(input())\n",
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    make(r) {
      const t = r.int(1, 9);
      const one = () => {
        const others = r.list(r.int(6, 9), 10, 90);
        others.splice(r.int(0, others.length - 1), 0, t);
        return [others.join(" ")];
      };
      return {
        title: `${t} 이전 값의 개수`,
        desc: `여러 개의 숫자를 공백으로 구분해 입력받아, **${t} 보다 앞에 있는** 숫자의 개수를 출력하려고 합니다. (${t} 은 한 번만 나옵니다)`,
        inputs: ["nums"],
        tests: [one(), one(), one()],
        ref: ([line]) => String(nums(line).indexOf(t)),
        body: `nums = list(map(int, input().split()))\n\ncount = 0\nfor x in nums:\n    if x == ${t}:\n        break\n    count += 1\n\nprint(count)`,
        blank: ["        break", "        ⬜"],
        given: "nums = list(map(int, input().split()))\n",
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    make(r) {
      const small = r.int(0, 1) === 1;
      const one = () => r.distinct(2, 1, 99).map(String);
      return {
        title: small ? "더 작은 수 출력" : "더 큰 수 출력",
        desc: `서로 다른 숫자 두 개를 입력받아, 두 수 중 **더 ${small ? "작은" : "큰"} 수**를 출력하려고 합니다.`,
        inputs: ["a", "b"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => String(small ? Math.min(a, b) : Math.max(a, b)),
        body: `a = int(input())\nb = int(input())\n\nif a ${small ? "<" : ">"} b:\n    print(a)\nelse:\n    print(b)`,
        blank: [`if a ${small ? "<" : ">"} b:`, "if ⬜:"],
        given: "a = int(input())\nb = int(input())\n",
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    make(r) {
      const [x, y] = r.pick([
        ["-", "*"],
        ["_", "#"],
        ["=", "+"],
      ]);
      const one = () => [String(r.int(3, 7))];
      return {
        title: `${x} 와 ${y} 교차 출력`,
        desc: `자연수 n 을 입력받아, \`${x}\` 는 0개부터 n-1개까지 1개씩 늘리고 \`${y}\` 는 n개부터 1개까지 1개씩 줄이면서, 한 줄에 \`${x}\` 묶음과 \`${y}\` 묶음을 번갈아 이어 출력하려고 합니다.\n\n예를 들어 n 이 3이면 (${x} 0개, ${y} 3개), (${x} 1개, ${y} 2개), (${x} 2개, ${y} 1개) 를 이어서 \`${y.repeat(3)}${x}${y.repeat(2)}${x.repeat(2)}${y}\` 를 출력합니다.`,
        inputs: ["n"],
        tests: [one(), one(), one()],
        ref: ([n]) => Array.from({ length: Number(n) }, (_, i) => x.repeat(i) + y.repeat(n - i)).join(""),
        body: `n = int(input())\n\nfor i in range(n):\n    print("${x}" * i + "${y}" * (n - i), end="")\nprint()`,
        blank: [`print("${x}" * i + "${y}" * (n - i), end="")`, 'print(⬜, end="")'],
        given: "n = int(input())\n",
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    make(r) {
      const one = () => r.distinct(2, 1, 50).map(String);
      return {
        title: "차이의 절댓값",
        desc: "숫자 두 개를 입력받아, 두 수의 **차이의 절댓값**을 출력하려고 합니다.",
        inputs: ["a", "b"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => String(Math.abs(a - b)),
        body: "a = int(input())\nb = int(input())\n\nif a > b:\n    print(a - b)\nelse:\n    print(b - a)",
        blank: ["if a > b:", "if ⬜:"],
        given: "a = int(input())\nb = int(input())\n",
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    make(r) {
      const even = r.int(0, 1) === 1;
      const one = () => [String(r.int(5, 20))];
      return {
        title: even ? "짝수만 출력" : "홀수만 출력",
        desc: `자연수 n 을 입력받아, 1 부터 n 까지의 수 중 **${even ? "짝수" : "홀수"}**만 공백으로 구분하여 출력하려고 합니다.`,
        inputs: ["n"],
        tests: [one(), one(), one()],
        ref: ([n]) => Array.from({ length: Number(n) }, (_, i) => i + 1).filter((i) => i % 2 === (even ? 0 : 1)).join(" "),
        body: `n = int(input())\n\nfor i in range(1, n + 1):\n    if i % 2 == ${even ? 0 : 1}:\n        print(i, end=" ")`,
        blank: [`if i % 2 == ${even ? 0 : 1}:`, "if ⬜:"],
        given: "n = int(input())\n",
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    make(r) {
      const big = r.int(0, 1) === 1;
      const one = () => [r.list(r.int(5, 8), 1, 99).join(" ")];
      return {
        title: big ? "가장 큰 수" : "가장 작은 수",
        desc: `여러 개의 숫자를 공백으로 구분해 입력받아, 그중 **가장 ${big ? "큰" : "작은"} 수**를 출력하려고 합니다. (max, min 함수를 쓰지 않고 반복문으로 풀어 보세요)`,
        inputs: ["nums"],
        tests: [one(), one(), one()],
        ref: ([line]) => String(big ? Math.max(...nums(line)) : Math.min(...nums(line))),
        body: `nums = list(map(int, input().split()))\n\nbest = nums[0]\nfor x in nums:\n    if x ${big ? ">" : "<"} best:\n        best = x\n\nprint(best)`,
        blank: [`if x ${big ? ">" : "<"} best:`, "if ⬜:"],
        given: "nums = list(map(int, input().split()))\n",
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    make(r) {
      const one = () => [r.pick(WORDS)];
      return {
        title: "문자열 거꾸로 출력",
        desc: "문자열 하나를 입력받아, **거꾸로 뒤집은** 문자열을 출력하려고 합니다.",
        inputs: ["s"],
        tests: [one(), one(), one()],
        ref: ([s]) => [...s].reverse().join(""),
        body: 's = input()\n\nanswer = ""\nfor ch in s:\n    answer = ch + answer\n\nprint(answer)',
        blank: ["    answer = ch + answer", "    answer = ⬜"],
        given: "s = input()\n",
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    make(r) {
      const k = r.int(3, 9);
      const one = () => [String(r.int(1, 100))];
      return {
        title: `${k}의 배수 판별`,
        desc: `자연수 n 을 입력받아, n 이 ${k}의 배수이면 \`YES\`, 아니면 \`NO\` 를 출력하려고 합니다.`,
        inputs: ["n"],
        tests: [[String(k * r.int(2, 11))], one(), one(), [String(k * r.int(2, 11) + 1)]],
        ref: ([n]) => (Number(n) % k === 0 ? "YES" : "NO"),
        body: `n = int(input())\n\nif n % ${k} == 0:\n    print("YES")\nelse:\n    print("NO")`,
        blank: [`if n % ${k} == 0:`, "if ⬜:"],
        given: "n = int(input())\n",
      };
    },
  },
];

const SENTENCE_3 = {
  blank: "**빈칸(⬜)을 채워** 전체 코드를 완성해 주세요.",
  complete: "코드를 작성해 주세요.",
};

// 입력 받고 print 하는 3급 형식으로 문제 하나를 조립한다.
export function buildStdinProblem(t, type, grade, newId) {
  const starter =
    type === "blank"
      ? `# ⬜ 는 빈칸을 의미합니다.\n${t.body.replace(t.blank[0], t.blank[1])}\n`
      : `# 여기에 코드를 작성해 주세요.\n${t.given || ""}\n\n`;

  const shown = type === "blank" ? t.tests.slice(0, 1) : t.tests.slice(0, 2);
  const table = [
    `| ${[...t.inputs, "result"].join(" | ")} |`,
    `|${[...t.inputs, "result"].map(() => ":---:").join("|")}|`,
    ...shown.map((lines) => `| ${[...lines, t.ref(lines)].map((v) => `\`${v}\``).join(" | ")} |`),
  ].join("\n");

  const description = [
    "### 문제 설명",
    "",
    t.desc,
    "",
    SENTENCE_3[type],
    "",
    "### 입출력 예",
    "",
    table,
    "",
    "> 입력은 표의 왼쪽 칸부터 한 줄에 하나씩 주어집니다. 채점할 때는 다른 입력으로도 확인합니다.",
  ].join("\n");

  return {
    id: newId(),
    grade,
    title: `[${type === "blank" ? "빈칸" : "구현"}] ${t.title}`,
    description,
    starterCode: starter,
    answerCode: t.body + "\n",
    stdin: t.tests.map((lines) => lines.join("\n")).join("\n---\n"),
    // 검사용: 입력 세트마다 나와야 하는 출력
    expected: t.tests.map((lines) => t.ref(lines)),
  };
}
