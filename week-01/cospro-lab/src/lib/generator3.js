// ─────────────────────────────────────────────────────────────
// 3급 문제 틀 (COS PRO 3급 시험 형식)
//
// 기출 20문제를 바탕으로 한 틀 20개. 기출과 똑같은 문제가 나오지 않도록
// 숫자·단어·조건·상황을 무작위로 바꾸고, 유형은 원래 기출 그대로 둔다.
//   - 빈칸 10개 : 2024 모의시험 01~05, 최근 기출 01~05
//   - 구현 10개 : 2024 모의시험 06~10, 최근 기출 06~10
//
// 지문은 시험 화면처럼 문제 설명 / 입력 설명 / 출력 설명 / 예제(표 + # 예제 설명) 순서.
// input() 으로 입력을 받고 print 로 출력한다. 입력 세트는 예제 2개 + 숨은 입력 2개를 '---' 로 이어 붙인다.
//
// make(r) 가 돌려주는 것
//   title, desc(문제 설명), inputDesc(입력 설명 줄 목록), outputDesc(출력 설명)
//   inputs : 예제 표의 입력 칸 이름 (한 칸 = input() 한 줄)
//   tests  : 입력 세트 목록 (세트 하나 = 줄 목록). 앞의 2개가 예제로 보인다.
//   ref    : 같은 계산을 하는 자바스크립트 함수 (줄 목록 → 출력 글자)
//   explain: 예제 설명 한 줄을 만드는 함수 (줄 목록, 출력 → 글자)
//   body   : 정답 코드,  blanks : [[정답 코드에서 찾을 글자, ⬜ 로 바꾼 글자], …]  (빈칸 유형만)
// ─────────────────────────────────────────────────────────────

const nums = (line) => line.split(" ").map(Number);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const KOREAN_COUNT = ["", "한", "두", "세", "네", "다섯"];
const ORDINAL = ["", "첫", "두", "세"];
const BLANK_END = "코드가 올바르게 동작할 수 있도록 **빈칸을 채워 전체 코드를 완성해 주세요.**";
const WORDS = ["apple", "banana", "peach", "lemon", "grape", "melon", "cherry", "orange", "mango", "silver", "purple", "violet", "coffee", "school", "summer", "winter"];

export const TEMPLATES_3 = [
  // ════════════════ 빈칸 ════════════════
  {
    grade: 3,
    topic: "list",
    type: "blank",
    make(r) {
      const subjects = r.shuffle(["국어", "영어", "수학", "과학", "사회", "음악"]).slice(0, r.int(3, 4));
      const k = subjects.length;
      const d = k === 4 ? 2 : r.int(1, 2); // 4과목 평균(.25 단위)은 반올림이 애매해지지 않도록 둘째 자리
      const one = () => [r.list(k, 50, 100).join(" ")];
      const blankChoices = [
        [["    total_score += subject", "    total_score += ⬜"]],
        [[`print("%.${d}f" % average)`, 'print("⬜" % average)']],
        [["average = total_score / len(score)", "average = total_score / ⬜"]],
      ];
      return {
        title: "평균 점수 구하기",
        desc: `${subjects.join(", ")} 점수가 리스트(배열) score 에 순서대로 주어졌을 때, ${KOREAN_COUNT[k]} 과목의 평균 점수를 구하여 소수 ${ORDINAL[d]}째 자리까지 반올림하여 출력하는 코드를 작성하려 합니다.\n\n${BLANK_END}`,
        inputDesc: [`score 는 [${subjects.join(", ")}] 점수가 순서대로 들어 있는 리스트(배열)입니다.`, "  - 각 점수는 0 이상 100 이하의 정수"],
        outputDesc: `${KOREAN_COUNT[k]} 과목의 평균 점수를 계산하여 소수점 ${ORDINAL[d]} 번째 자리까지 출력해 주세요.`,
        inputs: ["score"],
        tests: [one(), one(), one(), one()],
        ref: ([line]) => (nums(line).reduce((s, x) => s + x, 0) / k).toFixed(d),
        explain: ([line], out) => {
          const sc = nums(line);
          const avg = sc.reduce((s, x) => s + x, 0) / k;
          const shown = Number.isInteger(avg * 10000) ? String(avg) : `${avg.toFixed(4)}…`;
          return `${subjects.map((s, i) => `${s}점수 : ${sc[i]}점`).join(", ")}이며, 평균 점수는 ${shown} 이므로 소수점 ${ORDINAL[d]} 번째 자리까지 ${out} 을 출력합니다.`;
        },
        body: `score = list(map(int, input().split()))\n\ntotal_score = 0\n\nfor subject in score:\n    total_score += subject\n\naverage = total_score / len(score)\n\nprint("%.${d}f" % average)`,
        blanks: r.pick(blankChoices),
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    type: "blank",
    make(r) {
      const big = r.int(0, 1) === 1;
      const word = big ? "큰" : "작은";
      const op = big ? ">" : "<";
      const one = () => {
        const [x, y] = r.distinct(2, 1, 999);
        return [String(x * r.pick([-1, 1])), String(y * r.pick([-1, 1]))];
      };
      const blankChoices = [
        [["abs_a = abs_a * -1\n\nif b < 0:\n    abs_b = abs_b * -1", "abs_a = abs_a * ⬜\n\nif b < 0:\n    abs_b = abs_b * ⬜"]],
        [[`if abs_a ${op} abs_b:`, `if ⬜ ${op} ⬜:`]],
      ];
      return {
        title: `절댓값이 더 ${word} 수`,
        desc: `정수 a, b 가 주어졌을 때, 절댓값이 더 ${word} 수를 출력하는 프로그램을 작성하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["a, b : -999 이상 999 이하의 정수", "  - a 와 b 의 절댓값은 항상 다르게 주어집니다."],
        outputDesc: `입력된 a, b 중 절댓값이 더 ${word} 수를 출력해 주세요.`,
        inputs: ["a", "b"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => ((big ? Math.abs(a) > Math.abs(b) : Math.abs(a) < Math.abs(b)) ? a : b),
        explain: ([a, b], out) => `a 의 절댓값은 ${Math.abs(a)}, b 의 절댓값은 ${Math.abs(b)} 이므로 절댓값이 더 ${word} ${out === a ? "a" : "b"} 의 값 ${out} 을 출력합니다.`,
        body: `a = int(input())\nb = int(input())\n\nabs_a = a\nabs_b = b\n\nif a < 0:\n    abs_a = abs_a * -1\n\nif b < 0:\n    abs_b = abs_b * -1\n\nif abs_a ${op} abs_b:\n    print(a)\nelse:\n    print(b)`,
        blanks: r.pick(blankChoices),
      };
    },
  },
  {
    grade: 3,
    topic: "builtin",
    type: "blank",
    make(r) {
      const d = r.int(1, 2);
      const shape = r.pick(["사각형", "평행사변형"]);
      const one = () => [String(r.int(2, 99)), String(r.int(2, 99))];
      const blankChoices = [
        [[`"%.${d}f %d"`, '"⬜"']],
        [["triangle = base * height / 2\nother = base * height", "triangle = ⬜\nother = ⬜"]],
      ];
      return {
        title: `삼각형과 ${shape}의 넓이`,
        desc: `밑변의 길이 base 와 높이 height 가 주어졌을 때, 삼각형의 넓이와 ${shape}의 넓이를 출력하려 합니다. 삼각형의 넓이는 소수점 아래 ${ORDINAL[d]}째 자리까지, ${shape}의 넓이는 정수로 공백으로 구분하여 한 줄에 출력합니다.\n\n${BLANK_END}`,
        inputDesc: ["base : 도형의 밑변 길이로서 1 이상 999 이하의 자연수", "height : 도형의 높이로서 1 이상 999 이하의 자연수"],
        outputDesc: `삼각형 넓이와 ${shape} 넓이를 차례대로 출력해 주세요.\n- 삼각형 넓이 : 실수 (소수점 ${ORDINAL[d]} 번째 자리까지)\n- ${shape} 넓이 : 정수`,
        inputs: ["base", "height"],
        tests: [one(), one(), one(), one()],
        ref: ([b, h]) => `${((b * h) / 2).toFixed(d)} ${b * h}`,
        explain: ([b, h]) => `밑변 ${b}, 높이 ${h} 이므로 삼각형 넓이는 ${b} x ${h} / 2 = ${((b * h) / 2).toFixed(d)}, ${shape} 넓이는 ${b} x ${h} = ${b * h} 입니다.`,
        body: `base = int(input())\nheight = int(input())\n\ntriangle = base * height / 2\nother = base * height\n\nprint("%.${d}f %d" % (triangle, other))`,
        blanks: r.pick(blankChoices),
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    type: "blank",
    make(r) {
      const both = r.int(0, 2) > 0; // 공배수 쪽을 더 자주
      const one = (wantTrue) => {
        const a = r.int(2, 9);
        const b = r.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== a));
        const lcm = (a * b) / gcd(a, b);
        let c;
        if (both) c = wantTrue ? lcm * r.int(1, 9) : lcm * r.int(1, 9) + r.int(1, Math.min(a, b) - 1);
        else c = wantTrue ? a * r.int(2, 30) : a * b * r.int(1, 5) + 1;
        return [String(a), String(b), String(c)];
      };
      const ok = ([a, b, c]) => (both ? c % a === 0 && c % b === 0 : c % a === 0 || c % b === 0);
      const cond = both ? "c % a == 0 and c % b == 0" : "c % a == 0 or c % b == 0";
      return {
        title: both ? "공배수 판별하기" : "배수 판별하기",
        desc: both
          ? `정수 a, b, c 가 주어졌을 때, c 가 a 와 b 의 공배수이면 True, 공배수가 아니면 False 를 출력하려 합니다.\n\n${BLANK_END}`
          : `정수 a, b, c 가 주어졌을 때, c 가 a 의 배수이거나 b 의 배수이면 True, 둘 다 아니면 False 를 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["a, b, c : 1 이상 999 이하의 자연수"],
        outputDesc: both
          ? "c 가 a 와 b 의 공배수이면 True, 아니면 False 를 출력해 주세요."
          : "c 가 a 또는 b 의 배수이면 True, 아니면 False 를 출력해 주세요.",
        inputs: ["a", "b", "c"],
        tests: r.shuffle([one(true), one(false)]).concat([one(true), one(false)]),
        ref: (t) => (ok(t.map(Number)) ? "True" : "False"),
        explain: ([a, b, c], out) => {
          [a, b, c] = [a, b, c].map(Number);
          if (both) return `${a} 과 ${b} 의 공배수는 ${(a * b) / gcd(a, b)} 의 배수이고, ${c} 는 ${(a * b) / gcd(a, b)} 의 배수${out === "True" ? "이므로" : "가 아니므로"} ${out} 를 출력합니다.`;
          if (out === "True") return `${c} 는 ${c % a === 0 ? a : b} 의 배수이므로 True 를 출력합니다.`;
          return `${c} 는 ${a} 의 배수도 ${b} 의 배수도 아니므로 False 를 출력합니다.`;
        },
        body: `a = int(input())\nb = int(input())\nc = int(input())\n\nif ${cond}:\n    print("True")\nelse:\n    print("False")`,
        blanks: [[`if ${cond}:`, "if ⬜:"]],
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    type: "blank",
    make(r) {
      const order = r.pick(["JQK", "JQKA", "ABC", "123"]);
      const chain = [...order].join(" < ");
      const one = () => r.shuffle([...order]).slice(0, 2).join("");
      const blankChoices = [
        [["range(i + 1, len(priority))", "range(⬜, len(priority))"]],
        [["if priority[i] == cards[0]:", "if priority[i] == ⬜:"], ["if priority[k] == cards[1]:", "if priority[k] == ⬜:"]],
      ];
      const win = (c) => (order.indexOf(c[1]) > order.indexOf(c[0]) ? "B" : "A");
      return {
        title: "카드 게임 승자",
        desc: `A 와 B 는 카드 게임을 하고 있습니다. ${[...order].join(", ")} 로 구성된 ${order.length}장의 카드에서 A 와 B 가 1장씩 뽑았을 때, 우선순위가 높은 카드를 뽑은 사람이 이깁니다. 카드의 우선순위는 ${chain} 입니다.\nA 와 B 가 뽑은 카드가 순서대로 저장된 문자열 cards 가 주어졌을 때, 이기는 사람을 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["cards : A 가 뽑은 카드와 B 가 뽑은 카드가 순서대로 저장된 문자열", `  - 각 문자는 ${[...order].join(", ")} 중 하나이며 같은 카드는 없습니다.`],
        outputDesc: "A 의 카드가 더 높으면 A 를, B 의 카드가 더 높으면 B 를 출력해 주세요.",
        inputs: ["cards"],
        tests: [[one()], [one()], [one()], [one()]],
        ref: ([c]) => win(c),
        explain: ([c], out) => `A 가 ${c[0]}, B 가 ${c[1]} 를 뽑았고 ${out === "A" ? c[0] : c[1]} 의 우선순위가 더 높으므로 ${out} 를 출력합니다.`,
        body: `cards = input()\n\npriority = "${order}"\nwinner = "A"\n\nfor i in range(0, len(priority)):\n    if priority[i] == cards[0]:\n        for k in range(i + 1, len(priority)):\n            if priority[k] == cards[1]:\n                winner = "B"\n\nprint(winner)`,
        blanks: r.pick(blankChoices),
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    type: "blank",
    make(r) {
      const odd = r.int(0, 1) === 1; // true: 홀수 번째(인덱스 0, 2, …)
      const start = odd ? 0 : 1;
      const one = () => {
        const arr = r.list(r.int(5, 9), 0, 90);
        return [String(arr.length), arr.join(" ")];
      };
      const pick = (line) => nums(line).filter((_, i) => i % 2 === start);
      return {
        title: odd ? "홀수 번째 원소의 합" : "짝수 번째 원소의 합",
        desc: `정수 n 과 n 개의 정수가 담긴 리스트 arr 이 주어졌을 때, arr 의 원소 중 ${odd ? "홀수" : "짝수"} 번째(${odd ? "1, 3, 5" : "2, 4, 6"} … 번째) 원소를 모두 더한 값을 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["n : arr 의 원소 개수로서 1 이상 100 이하의 자연수", "arr : n 개의 정수가 담긴 리스트 (공백으로 구분)"],
        outputDesc: `arr 의 ${odd ? "홀수" : "짝수"} 번째 원소를 모두 더한 값을 출력해 주세요.`,
        inputs: ["n", "arr"],
        tests: [one(), one(), one(), one()],
        ref: ([, line]) => String(pick(line).reduce((s, x) => s + x, 0)),
        explain: ([, line], out) => `${odd ? "홀수" : "짝수"} 번째 원소는 ${pick(line).join(", ")} 이고, ${pick(line).join(" + ")} = ${out} 을 출력합니다.`,
        body: `n = int(input())\narr = list(map(int, input().split()))\n\ntotal = 0\nfor i in range(${start}, n, 2):\n    total += arr[i]\n\nprint(total)`,
        blanks: r.pick([[["    total += arr[i]", "    ⬜"]], [[`range(${start}, n, 2)`, "range(⬜, n, 2)"]]]),
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    type: "blank",
    make(r) {
      const [method, what, test] = r.pick([
        ["islower", "알파벳 소문자", /[a-z]/],
        ["isupper", "알파벳 대문자", /[A-Z]/],
        ["isdigit", "숫자", /[0-9]/],
      ]);
      const one = () => [r.word(r.int(5, 9), "aBcDeFgHxYz0123")];
      const found = (s) => [...s].filter((c) => test.test(c));
      return {
        title: `${what} 개수 세기`,
        desc: `문자열이 주어졌을 때, 문자열에 포함된 ${what}의 개수를 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["s : 알파벳 대소문자와 숫자로 이루어진 문자열", "  - 문자열 길이는 1 이상 100 이하"],
        outputDesc: `문자열 s 에 포함된 ${what}의 개수를 출력해 주세요.`,
        inputs: ["s"],
        tests: [one(), one(), one(), one()],
        ref: ([s]) => String(found(s).length),
        explain: ([s], out) =>
          out === "0" ? `문자열에 ${what}가 없으므로 0 을 출력합니다.` : `문자열에 포함된 ${what}는 ${found(s).map((c) => `'${c}'`).join(", ")} 이므로 ${out} 을 출력합니다.`,
        body: `count = 0\ns = input()\n\nfor i in range(0, len(s)):\n    if s[i].${method}():\n        count += 1\n\nprint(count)`,
        blanks: [[`if s[i].${method}():`, "if ⬜:"]],
      };
    },
  },
  {
    grade: 3,
    topic: "string",
    type: "blank",
    make(r) {
      const sym = r.pick(["&", "-", "#", "@", "+", "*"]);
      const swap = r.int(0, 2) === 0; // 가끔은 두 번째 문자열을 앞에
      const one = () => r.shuffle(WORDS).slice(0, 2);
      const join = ([a, b]) => (swap ? b + sym + a : a + sym + b);
      return {
        title: `${sym} 로 연결하기`,
        desc: `문자열 두 개가 주어졌을 때, ${swap ? "두 번째 문자열을 앞에, 첫 번째 문자열을 뒤에 두고" : "첫 번째 문자열과 두 번째 문자열"} 사이에 특수문자(\`${sym}\`)를 넣어 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["s1, s2 : 알파벳 소문자로 이루어진 문자열"],
        outputDesc: `${swap ? "s2, s1 순서로" : "s1, s2 순서로"} 사이에 \`${sym}\` 를 넣은 문자열을 출력해 주세요.`,
        inputs: ["s1", "s2"],
        tests: [one(), one(), one(), one()],
        ref: join,
        explain: (t, out) => `'${swap ? t[1] : t[0]}' 와 '${swap ? t[0] : t[1]}' 사이에 ${sym} 를 넣어 ${out} 을 출력합니다.`,
        body: `s1 = input()\ns2 = input()\n\nprint(${swap ? `s2 + "${sym}" + s1` : `s1 + "${sym}" + s2`})`,
        blanks: [[`print(${swap ? `s2 + "${sym}" + s1` : `s1 + "${sym}" + s2`})`, "print(⬜)"]],
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    type: "blank",
    make(r) {
      const later = r.int(0, 1) === 1;
      const one = () => r.shuffle(WORDS).slice(0, 2);
      return {
        title: "영어사전 순 비교",
        desc: `두 문자열 중 영어사전 순으로 ${later ? "뒤에" : "앞에"} 오는 문자열을 구하려 합니다. 서로 다른 문자열 두 개가 주어졌을 때, 영어사전 순으로 ${later ? "뒤에" : "앞에"} 오는 문자열을 출력합니다.\n\n${BLANK_END}`,
        inputDesc: ["s1, s2 : 알파벳 소문자로 이루어진 서로 다른 문자열"],
        outputDesc: `영어사전 순으로 ${later ? "뒤에" : "앞에"} 오는 문자열을 출력해 주세요.`,
        inputs: ["s1", "s2"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => ((later ? a > b : a < b) ? a : b),
        explain: ([a, b], out) => `"${a}" 와 "${b}" 중 영어사전 순으로 ${later ? "뒤에" : "앞에"} 오는 문자열은 "${out}" 이므로 ${out} 을 출력합니다.`,
        body: `s1 = input()\ns2 = input()\n\nif s1 ${later ? ">" : "<"} s2:\n    print(s1)\nelse:\n    print(s2)`,
        blanks: [[`if s1 ${later ? ">" : "<"} s2:`, "if ⬜:"]],
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    type: "blank",
    make(r) {
      const fromBack = r.int(0, 2) === 0; // 가끔은 뒤에서부터 늘어나는 부분 문자열
      const one = () => [r.pick(["Data", "Code", "Python", "Smart", "Cloud", "Robot", "Pixel", "Mouse", "AIcode", "Game"])];
      const parts = (s) => [...s].map((_, i) => (fromBack ? s.slice(s.length - 1 - i) : s.slice(0, i + 1)));
      const inner = fromBack ? "for j in range(len(s) - 1 - i, len(s)):" : "for j in range(i + 1):";
      return {
        title: fromBack ? "뒤에서부터 한 글자씩 늘려 출력" : "한 글자씩 늘려 출력",
        desc: `문자열 하나가 주어졌을 때, ${fromBack ? "뒤에서부터" : "앞에서부터"} 한 글자씩 늘어나는 부분 문자열을 공백으로 구분하여 순서대로 출력하려 합니다.\n\n${BLANK_END}`,
        inputDesc: ["s : 알파벳 대소문자로 이루어진 문자열", "  - 문자열 길이는 1 이상 20 이하"],
        outputDesc: "한 글자씩 늘어나는 부분 문자열을 공백으로 구분하여 한 줄에 출력해 주세요.",
        inputs: ["s"],
        tests: r.shuffle([one(), one(), one(), one(), one()]).slice(0, 4),
        ref: ([s]) => parts(s).join(" "),
        explain: ([s]) => `"${s}" 의 한 글자씩 늘어나는 부분 문자열 ${parts(s).join(", ")} 를 공백으로 구분하여 출력합니다.`,
        body: `s = input()\n\nfor i in range(0, len(s)):\n    ${inner}\n        print(s[j], end="")\n    print(end=" ")`,
        blanks: [[`${inner}\n        print(s[j], end="")`, `${fromBack ? "for j in range(⬜, len(s)):" : "for j in range(⬜):"}\n        print(⬜, end="")`]],
      };
    },
  },

  // ════════════════ 구현 ════════════════
  {
    grade: 3,
    topic: "loop",
    type: "complete",
    make(r) {
      const d = r.pick([2, 4, 5, 6, 7, 9]);
      const one = () => [String(r.int(1, 30)), String(r.int(3, 8))];
      const seq = ([k, n]) => Array.from({ length: Number(n) }, (_, i) => Number(k) + d * i);
      return {
        title: `${d}씩 더하여 출력`,
        desc: `두 자연수 k 와 n 이 주어졌을 때, k 에서 시작해 ${d}씩 더한 수를 크기가 작은 순서대로 n 개 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["k : 1 이상 100 이하의 자연수", "n : 1 이상 20 이하의 자연수"],
        outputDesc: `k 부터 ${d}씩 더한 수 n 개를 공백으로 구분하여 한 줄에 출력해 주세요.`,
        inputs: ["k", "n"],
        tests: [one(), one(), one(), one()],
        ref: (t) => seq(t).join(" "),
        explain: (t, out) => `${t[0]} 에서부터 ${d}씩 더한 ${t[1]}개를 나열하면 ${out} 입니다.`,
        body: `k = int(input())\nn = int(input())\n\nfor i in range(n):\n    print(k + ${d} * i, end=" ")`,
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    type: "complete",
    make(r) {
      const t = r.int(1, 9);
      const after = r.int(0, 2) === 0; // 가끔은 '뒤에 있는' 개수
      const one = () => {
        const arr = r.list(r.int(6, 9), 10, 90);
        arr.splice(r.int(0, arr.length - 1), 0, t);
        return [arr.join(" ")];
      };
      const count = (line) => {
        const a = nums(line);
        const i = a.indexOf(t);
        return after ? a.length - 1 - i : i;
      };
      return {
        title: after ? `${t} 이후 값의 개수` : `${t} 이전 값의 개수`,
        desc: `숫자 정보를 가지는 리스트 n 이 주어졌을 때, ${t} 보다 ${after ? "뒤에" : "앞에"} 있는 숫자의 개수를 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["n : 공백으로 구분된 자연수 리스트", `  - ${t} 은(는) 리스트에 꼭 한 번만 들어 있습니다.`],
        outputDesc: `${t} 보다 ${after ? "뒤에" : "앞에"} 있는 숫자의 개수를 출력해 주세요.`,
        inputs: ["n"],
        tests: [one(), one(), one(), one()],
        ref: ([line]) => String(count(line)),
        explain: ([line], out) => {
          const a = nums(line);
          const i = a.indexOf(t);
          const part = after ? a.slice(i + 1) : a.slice(0, i);
          return part.length ? `${t} 보다 ${after ? "뒤에" : "앞에"} 있는 숫자는 ${part.join(", ")} 이므로 ${out} 을 출력합니다.` : `${t} 보다 ${after ? "뒤에" : "앞에"} 있는 숫자가 없으므로 0 을 출력합니다.`;
        },
        body: `n = list(map(int, input().split()))\n\ncount = 0\nfor x in n:\n    if x == ${t}:\n        break\n    count += 1\n\nprint(${after ? "len(n) - 1 - count" : "count"})`,
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    type: "complete",
    make(r) {
      const small = r.int(0, 1) === 1;
      const one = () => r.distinct(2, 1, 999).map(String);
      return {
        title: small ? "더 작은 수 출력" : "더 큰 수 출력",
        desc: `서로 다른 숫자 두 개가 주어졌을 때, 두 수 중 더 ${small ? "작은" : "큰"} 수를 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["n1, n2 : 1 이상 999 이하의 서로 다른 자연수"],
        outputDesc: `두 수 중 더 ${small ? "작은" : "큰"} 수를 출력해 주세요.`,
        inputs: ["n1", "n2"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => String(small ? Math.min(a, b) : Math.max(a, b)),
        explain: ([a, b], out) => `${a} 과 ${b} 중에서 더 ${small ? "작은" : "큰"} 수는 ${out} 이므로 ${out} 을 출력합니다.`,
        body: `n1 = int(input())\nn2 = int(input())\n\nif n1 ${small ? "<" : ">"} n2:\n    print(n1)\nelse:\n    print(n2)`,
      };
    },
  },
  {
    grade: 3,
    topic: "loop",
    type: "complete",
    make(r) {
      const [x, y, xt, yt] = r.pick([
        ["-", "*", "하이픈", "별"],
        ["_", "#", "밑줄", "샵"],
        ["=", "+", "등호", "더하기"],
        ["~", "@", "물결", "골뱅이"],
      ]);
      // 지문에서는 기호를 코드 표시로 감싸야 마크다운 서식(기울임 등)으로 바뀌지 않는다
      const xn = `${xt}(\`${x}\`)`;
      const yn = `${yt}(\`${y}\`)`;
      const one = () => [String(r.int(3, 7))];
      const shape = (n) => Array.from({ length: n }, (_, i) => x.repeat(i) + y.repeat(n - i)).join("");
      return {
        title: `${xt}(${x})과 ${yt}(${y}) 교차 출력`,
        desc: `자연수 n 이 주어졌을 때, ${xn} 모양은 0개부터 n-1개까지 1개씩 늘어나고 ${yn} 모양은 n개부터 1개까지 1개씩 줄어들면서, 두 모양을 교차하며 한 줄로 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["n : 1 이상 9 이하의 자연수"],
        outputDesc: `(${xn} 0개, ${yn} n개), (${xn} 1개, ${yn} n-1개), … 를 이어 붙여 한 줄로 출력해 주세요.`,
        inputs: ["n"],
        tests: [one(), one(), one(), one()],
        ref: ([n]) => shape(Number(n)),
        explain: ([n], out) => `n 이 ${n} 이므로 ${Array.from({ length: Number(n) }, (_, i) => `(${i}개, ${n - i}개)`).join(", ")} 를 이어 ${out} 을 출력합니다.`,
        body: `n = int(input())\n\nfor i in range(n):\n    print("${x}" * i + "${y}" * (n - i), end="")\nprint()`,
      };
    },
  },
  {
    grade: 3,
    topic: "if",
    type: "complete",
    make(r) {
      const one = () => r.distinct(2, 1, 99).map(String);
      return {
        title: "차이의 절댓값",
        desc: "숫자 두 개가 주어졌을 때, 두 수의 차이 값의 절댓값을 출력하는 **프로그램을 완성해 주세요.**",
        inputDesc: ["n1, n2 : 1 이상 999 이하의 자연수"],
        outputDesc: "두 수의 차이 값의 절댓값을 출력해 주세요.",
        inputs: ["n1", "n2"],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => String(Math.abs(a - b)),
        explain: ([a, b], out) => `${a} 와 ${b} 의 차이 값은 ${a - b} 이고 그 절댓값은 ${out} 이므로 ${out} 을 출력합니다.`,
        body: "n1 = int(input())\nn2 = int(input())\n\nif n1 > n2:\n    print(n1 - n2)\nelse:\n    print(n2 - n1)",
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    type: "complete",
    make(r) {
      const mode = r.pick(["곱", "곱", "차이"]);
      const one = () => [r.list(7, 1, 100).join(" ")];
      const count = (line) => {
        const a = nums(line);
        const odd = a.filter((x) => x % 2 === 1);
        return [odd, a.filter((x) => x % 2 === 0)];
      };
      const calc = (o, e) => (mode === "곱" ? o * e : Math.abs(o - e));
      return {
        title: mode === "곱" ? "홀수 개수와 짝수 개수의 곱" : "홀수 개수와 짝수 개수의 차이",
        desc: `7개의 정수를 원소로 가지는 리스트 arr 이 주어졌을 때, 홀수 개수와 짝수 개수의 ${mode === "곱" ? "곱셈 결과" : "차이(큰 수에서 작은 수를 뺀 값)"}를 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["arr : 1 이상 100 이하의 자연수 7개로 구성된 정수 리스트"],
        outputDesc: `arr 의 원소 중 홀수 개수와 짝수 개수를 세어 두 수의 ${mode === "곱" ? "곱" : "차이"}를 출력해 주세요.`,
        inputs: ["arr"],
        tests: [one(), one(), one(), one()],
        ref: ([line]) => {
          const [o, e] = count(line);
          return String(calc(o.length, e.length));
        },
        explain: ([line], out) => {
          const [o, e] = count(line);
          return `홀수는 ${o.join(", ") || "없음"} (${o.length}개), 짝수는 ${e.join(", ") || "없음"} (${e.length}개) 이므로 ${mode === "곱" ? `${o.length} x ${e.length}` : `${Math.max(o.length, e.length)} - ${Math.min(o.length, e.length)}`} = ${out} 을 출력합니다.`;
        },
        body: `arr = list(map(int, input().split()))\n\nodd_count = 0\neven_count = 0\n\nfor num in arr:\n    if num % 2 == 1:\n        odd_count += 1\n    else:\n        even_count += 1\n\nprint(${mode === "곱" ? "odd_count * even_count" : "abs(odd_count - even_count)"})`,
      };
    },
  },
  {
    grade: 3,
    topic: "builtin",
    type: "complete",
    make(r) {
      const lower = r.int(0, 1) === 1;
      // 대문자와 소문자가 꼭 하나 이상 들어가게
      const one = () => [r.pick([..."BDFHKMPS"]) + r.word(r.int(2, 4), "aBcDeFgHkM") + r.pick([..."aceghkmr"]) + r.int(10, 2099) + r.pick(["!", "@", "#", "$", "?"])];
      return {
        title: lower ? "소문자로 바꾸기" : "대문자로 바꾸기",
        desc: `숫자, 기호, 알파벳 소문자/대문자로 구성된 문자열 password 가 주어졌을 때, ${lower ? "대문자를 모두 소문자로" : "소문자를 모두 대문자로"} 바꾸어 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["password : 숫자, 기호, 알파벳 소문자, 대문자의 조합으로 구성된 문자열"],
        outputDesc: `${lower ? "대문자는 모두 소문자로" : "소문자는 모두 대문자로"} 바뀐 문자열을 출력해 주세요.`,
        inputs: ["password"],
        tests: [one(), one(), one(), one()],
        ref: ([p]) => (lower ? p.toLowerCase() : p.toUpperCase()),
        explain: ([p], out) => {
          const changed = [...p].filter((c) => (lower ? /[A-Z]/ : /[a-z]/).test(c));
          return `${lower ? "대문자" : "소문자"} ${changed.map((c) => `'${c}'`).join(", ")} 를 ${lower ? "소문자" : "대문자"}로 바꾸어 ${out} 을 출력합니다.`;
        },
        body: `password = input()\n\nprint(password.${lower ? "lower" : "upper"}())`,
      };
    },
  },
  {
    grade: 3,
    topic: "builtin",
    type: "complete",
    make(r) {
      const tallest = r.int(0, 1) === 1;
      const [c1, c2, v1, v2] = r.pick([
        ["초록반", "노랑반", "green", "yellow"],
        ["해바라기반", "장미반", "sunflower", "rose"],
        ["하늘반", "바다반", "sky", "sea"],
      ]);
      const row = () => r.list(4, 50, 150).join(" ");
      const one = () => [row(), row()];
      const f = tallest ? Math.max : Math.min;
      return {
        title: `각 반의 ${tallest ? "최장신" : "최단신"}`,
        desc: `${c1}, ${c2} 원아들의 키가 두 개의 정수 리스트 ${v1}, ${v2} 에 주어졌을 때, 각 반의 ${tallest ? "최장신(가장 큰 키)" : "최단신(가장 작은 키)"}을 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: [`${v1} : 4명의 ${c1} 원아들의 키가 저장된 정수 리스트`, "  - 50 이상 150 이하의 자연수", `${v2} : 4명의 ${c2} 원아들의 키가 저장된 정수 리스트`, "  - 50 이상 150 이하의 자연수"],
        outputDesc: `${c1}, ${c2}의 ${tallest ? "최장신" : "최단신"}을 차례대로 공백으로 구분하여 출력해 주세요.`,
        inputs: [v1, v2],
        tests: [one(), one(), one(), one()],
        ref: ([a, b]) => `${f(...nums(a))} ${f(...nums(b))}`,
        explain: ([a, b]) => `${c1}에서 가장 ${tallest ? "큰" : "작은"} 키는 ${f(...nums(a))}, ${c2}에서 가장 ${tallest ? "큰" : "작은"} 키는 ${f(...nums(b))} 입니다.`,
        body: `${v1} = list(map(int, input().split()))\n${v2} = list(map(int, input().split()))\n\nprint(${tallest ? "max" : "min"}(${v1}), ${tallest ? "max" : "min"}(${v2}))`,
      };
    },
  },
  {
    grade: 3,
    topic: "builtin",
    type: "complete",
    make(r) {
      const L = r.pick(["m", "s", "t", "j", "n"]);
      const U = L.toUpperCase();
      // 이름처럼 첫 글자는 대문자로, 찾는 글자가 꼭 하나 이상 들어가게
      const one = () => {
        const s = r.pick([U, U, "A", "E", "O"]) + r.word(r.int(3, 7), `${L}aeiouryl ${U}`).trim();
        return [s.includes(U) || s.includes(L) ? s : s + L];
      };
      const n = (s, c) => [...s].filter((x) => x === c).length;
      return {
        title: `'${L}' 와 '${U}' 개수 세기`,
        desc: `영어 알파벳으로 구성된 이름 문자열 name 이 주어졌을 때, 이름에 대문자 '${U}' 와 소문자 '${L}' 가 모두 몇 개 포함되어 있는지 출력하는 **프로그램을 완성해 주세요.**`,
        inputDesc: ["name : 알파벳 대소문자의 조합으로 구성된 문자열", "  - 문자열 길이는 2 이상, 999 이하"],
        outputDesc: `문자열 name 에 포함된 대문자 '${U}' 와 소문자 '${L}' 의 개수를 모두 합산하여 출력해 주세요.`,
        inputs: ["name"],
        tests: [one(), one(), one(), one()],
        ref: ([s]) => String(n(s, U) + n(s, L)),
        explain: ([s], out) => `대문자 ${U} ${n(s, U)}개와 소문자 ${L} ${n(s, L)}개이므로 총 ${out}개를 출력합니다.`,
        body: `name = input()\n\nresult = name.count("${U}") + name.count("${L}")\nprint(result)`,
      };
    },
  },
  {
    grade: 3,
    topic: "list",
    type: "complete",
    make(r) {
      const one = () => {
        const arr = r.shuffle([0, -r.int(1, 999), r.int(1, 999), ...r.list(2, -999, 999)]);
        return [arr.join(" "), String(r.int(1, 5))];
      };
      const sign = (x) => (x < 0 ? -1 : x > 0 ? 1 : 0);
      return {
        title: "n 번째 원소의 부호",
        desc: "5개 정수로 구성된 리스트 arr 과 정수 n 이 주어졌을 때, arr 의 n 번째 원소가 음수이면 -1, 0 이면 0, 양수이면 1 을 출력하는 **프로그램을 완성해 주세요.**",
        inputDesc: ["arr : 5개 정수를 원소로 가지는 리스트", "  - 각 원소는 -999 이상 999 이하", "n : 1 이상 5 이하의 자연수"],
        outputDesc: "arr 의 n 번째 원소가 음수이면 -1, 0 이면 0, 양수이면 1 을 출력해 주세요.",
        inputs: ["arr", "n"],
        tests: [one(), one(), one(), one()],
        ref: ([line, n]) => String(sign(nums(line)[n - 1])),
        explain: ([line, n], out) => {
          const v = nums(line)[n - 1];
          return `${n} 번째 원소는 ${v} 이고 ${v < 0 ? "음수" : v > 0 ? "양수" : "0"} 이므로 ${out} 을 출력합니다.`;
        },
        body: "arr = list(map(int, input().split()))\nn = int(input())\n\ntarget = arr[n - 1]\n\nif target < 0:\n    print(-1)\nelif target > 0:\n    print(1)\nelse:\n    print(0)",
      };
    },
  },
];

// [구현] 문제의 시작 코드 (시험 화면과 같은 안내 주석)
const IMPL_STARTER =
  "# 여기에 코드를 작성해주세요. 아래 주석은 예시입니다.\n" +
  "# 입력값은 상수로 고정하지 말고, 표준 입력으로부터 읽어 변수에 할당한 뒤 그 변수를 사용합니다\n" +
  "# a = input()\n" +
  "# print(a)\n";

// 표·예제 설명에 들어가는 값(*, _, ~, # 등)이 마크다운 서식으로 바뀌지 않게
const esc = (v) => String(v).replace(/[\\`*_~|#<>[\]]/g, "\\$&");

const bullet = (line) => (line.startsWith("  - ") ? line : `- ${line}`);

// 3급 시험 형식으로 문제 하나를 조립한다.
export function buildStdinProblem(t, type, grade, newId) {
  let starter = IMPL_STARTER;
  if (type === "blank") {
    starter = t.body;
    for (const [from, to] of t.blanks) starter = starter.replace(from, to);
    starter += "\n";
  }

  const examples = t.tests.slice(0, 2);
  const table = [
    `| ${[...t.inputs, "result"].join(" | ")} |`,
    `|${[...t.inputs, "result"].map(() => "---").join("|")}|`,
    ...examples.map((lines) => `| ${[...lines, t.ref(lines)].map(esc).join(" | ")} |`),
  ].join("\n");
  const notes = examples.map((lines, i) => `\\# 예제 ${i + 1}: ${esc(t.explain(lines, t.ref(lines)))}`).join("  \n");

  const description = [
    "### 문제 설명",
    "",
    t.desc,
    "",
    "### 입력 설명",
    "",
    ...t.inputDesc.map(bullet),
    "",
    "### 출력 설명",
    "",
    t.outputDesc,
    "",
    "### 예제",
    "",
    table,
    "",
    notes,
  ].join("\n");

  return {
    id: newId(),
    grade,
    title: `[${type === "blank" ? "빈칸" : "구현"}] ${t.title}`,
    description,
    starterCode: starter,
    answerCode: t.body + "\n",
    // 입력은 위에서부터 한 줄에 하나씩. 앞의 2개는 예제, 뒤의 2개는 채점용 숨은 입력
    stdin: t.tests.map((lines) => lines.join("\n")).join("\n---\n"),
    // 검사용: 입력 세트마다 나와야 하는 출력
    expected: t.tests.map((lines) => t.ref(lines)),
  };
}
