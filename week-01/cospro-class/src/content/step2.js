// STEP2 · 자료형별 기본 기능과 반복문 활용 (2시간)
// sum/max/min/abs 같은 내장 함수는 STEP3 에서 배우고, 여기서는 반복문·조건문으로 직접 구해 본다.
// 기초에 집중하도록 STEP2 는 input() 을 쓰지 않고 데이터를 코드 안에서 준다. (여러 값 입력받기는 STEP3)
// (3급 빈칸 문제는 바로 이 로직의 한 줄을 비워 두는 경우가 많다)
import { code, ex, md, py } from "./blocks";

export default {
  n: 2,
  title: "자료형별 기본 기능과 반복문 활용",
  summary: ["문자열과 리스트의 기본 기능(메서드)", "자료형과 내장 함수", "시퀀스 자료형과 반복문", "조건문과 반복문 결합 활용"],
  topics: [
    {
      id: "s2-str",
      title: "문자열의 기본 기능",
      blocks: [
        md`
          ### 길이: len()
          \`len(값)\` 은 문자열의 **글자 수**, 리스트의 **원소 개수**를 알려 주는 내장 함수예요. 공백도 한 글자로 세요.
        `,
        code(py`
          s = "Hello World"
          print(len(s))
          print(len("파이썬"), len([10, 20, 30]))
        `),
        md`
          ### 메서드
          **메서드**는 값 뒤에 점을 찍고 부르는 기능이에요. \`값.기능()\`
          문자열 메서드는 원래 문자열을 바꾸지 않고 **새 문자열을 돌려줘요**. 그래서 결과를 출력하거나 변수에 다시 넣어야 해요.

          | 메서드 | 하는 일 | 예 (\`s = "Hello World"\`) |
          |---|---|---|
          | \`upper()\` / \`lower()\` | 대문자로 / 소문자로 | \`s.upper()\` → \`HELLO WORLD\` |
          | \`replace(a, b)\` | a 를 b 로 바꿈 | \`s.replace("o", "0")\` → \`Hell0 W0rld\` |
          | \`count(x)\` | x 가 몇 번 나오는지 | \`s.count("l")\` → \`3\` |
          | \`split()\` | 공백으로 나눠 리스트로 | \`s.split()\` → \`['Hello', 'World']\` |
        `,
        code(py`
          s = "Hello World"
          print(s.upper(), s.lower())
          print(s.replace("o", "0"))
          print(s.count("l"), s.count("o"))
          print(s.split())
          print(s)    # 원래 문자열은 그대로예요
        `),
        ex({
          title: "글자 개수 세기",
          prompt: md`
            \`s = "banana apple"\` 에서 \`a\` 가 몇 번 나오는지, 공백을 지운 글자 수가 몇인지 출력해 보세요.
            결과: \`4 11\`  (공백 지우기는 \`replace(" ", "")\`)
          `,
          starter: py`
            s = "banana apple"
          `,
          answer: py`
            s = "banana apple"
            print(s.count("a"), len(s.replace(" ", "")))
          `,
        }),
        ex({
          title: "소문자로 바꾸기",
          prompt: md`
            \`name = "KaKao Kim"\` 을 모두 소문자로 바꾼 문자열과, 그 안에 \`k\` 가 몇 개 있는지 출력해 보세요.
          `,
          starter: py`
            name = "KaKao Kim"
          `,
          answer: py`
            name = "KaKao Kim"
            low = name.lower()
            print(low, low.count("k"))
          `,
        }),
      ],
    },
    {
      id: "s2-list",
      title: "리스트의 기본 기능",
      blocks: [
        md`
          ### 리스트 메서드
          리스트 메서드는 문자열과 달리 **리스트 자체를 바꿔요**.

          | 메서드 | 하는 일 |
          |---|---|
          | \`append(x)\` | 맨 뒤에 x 추가 |
          | \`insert(i, x)\` | i 위치에 x 끼워 넣기 |
          | \`remove(x)\` | 처음 나오는 x 지우기 |
          | \`pop()\` | 맨 뒤 값을 꺼내며 지우기 |
          | \`sort()\` / \`sort(reverse=True)\` | 작은 순 / 큰 순 정렬 |
          | \`index(x)\` / \`count(x)\` | x 의 위치 / x 의 개수 |

          \`x in 리스트\` 는 x 가 들어 있는지 \`True\`/\`False\` 로 알려 줘요. (문자열에도 쓸 수 있어요: \`"a" in "cat"\`)
        `,
        code(py`
          nums = [5, 2, 8]
          nums.append(1)
          nums.insert(0, 9)
          print(nums)
          nums.remove(2)
          last = nums.pop()
          print(nums, last)
          nums.sort()
          print(nums)
          nums.sort(reverse=True)
          print(nums)
          print(8 in nums, 7 in nums, nums.index(8), nums.count(5))
        `),
        ex({
          title: "빈 리스트 채우기",
          prompt: md`
            빈 리스트 \`squares\` 에 1 부터 5 까지 각 수의 제곱을 \`append()\` 로 넣고 출력해 보세요.
            결과: \`[1, 4, 9, 16, 25]\`
          `,
          starter: py`
            squares = []
          `,
          answer: py`
            squares = []
            for i in range(1, 6):
                squares.append(i * i)
            print(squares)
          `,
        }),
      ],
    },
    {
      id: "s2-seq",
      title: "시퀀스 자료형과 반복문",
      blocks: [
        md`
          ### 시퀀스 = 순서가 있는 자료형
          문자열, 리스트, \`range()\` 처럼 순서가 있는 자료형을 **시퀀스**라고 해요. 모두 \`for\` 로 하나씩 꺼낼 수 있어요.
          위치(인덱스)도 함께 필요하면 \`for i in range(len(리스트))\` 로 반복해요.
        `,
        code(py`
          fruits = ["사과", "배", "감"]
          for f in fruits:
              print(f, end=" ")
          print()
          for i in range(len(fruits)):
              print(i, fruits[i])
        `),
        md`
          ### 반복하면서 개수 세기
          **변수를 0 으로 만들어 두고, 반복하면서 조건에 맞을 때 1 씩 더하는** 패턴이에요. 3급 문제 대부분이 이 모양이에요.
        `,
        code(py`
          s = "banana"
          count = 0
          for ch in s:
              if ch == "a":
                  count += 1
          print("a 의 개수:", count)
        `),
        ex({
          title: "모음 개수",
          prompt: md`
            \`s = "education"\` 에 모음(a, e, i, o, u)이 몇 개인지 출력해 보세요. (\`ch in "aeiou"\` 를 써 보세요)
          `,
          starter: py`
            s = "education"
            count = 0
          `,
          answer: py`
            s = "education"
            count = 0
            for ch in s:
                if ch in "aeiou":
                    count += 1
            print(count)
          `,
        }),
        ex({
          title: "짝수 번째 원소의 합",
          prompt: md`
            리스트 \`arr\` 의 **두 번째, 네 번째, …** 원소(인덱스 1, 3, 5 …)의 합을 출력해 보세요.
          `,
          starter: py`
            arr = [41, 23, 27, 0, 12, 36, 50]
          `,
          answer: py`
            arr = [41, 23, 27, 0, 12, 36, 50]
            total = 0
            for i in range(1, len(arr), 2):
                total += arr[i]
            print(total)
          `,
        }),
      ],
    },
    {
      id: "s2-logic",
      title: "로직으로 직접 구하기 (합계·최댓값·절댓값·배수)",
      blocks: [
        md`
          ### 왜 직접 만들어 볼까요?
          파이썬에는 \`sum()\`, \`max()\`, \`abs()\` 같은 함수가 있지만(STEP3), 3급 **빈칸 문제**는 이 값을 **반복문과 조건문으로 직접 구하는 코드**의 한 줄을 비워 두는 경우가 많아요.
          아래 패턴은 눈에 익을 때까지 연습해 두세요. 실습의 \`____\` 는 빈칸이에요. 알맞은 코드로 바꾸고 실행해 보세요.

          ### 합계와 평균
          합을 담을 변수를 **0** 으로 시작하고, 반복하며 더해요. 평균은 합 ÷ 개수예요.
        `,
        code(py`
          nums = [80, 95, 72, 88]
          total = 0
          for x in nums:
              total += x
          print(total, total / len(nums))
        `),
        md`
          ### 최댓값과 최솟값
          **첫 값을 기준(best)으로 두고**, 더 큰 값(최솟값이면 더 작은 값)을 만나면 기준을 바꿔요.
        `,
        code(py`
          nums = [12, 45, 7, 33]
          best = nums[0]
          low = nums[0]
          for x in nums:
              if x > best:
                  best = x
              if x < low:
                  low = x
          print(best, low, best - low)
        `),
        md`
          ### 절댓값
          음수이면 \`-1\` 을 곱해 양수로 바꿔요. (0 과 양수는 그대로)
        `,
        code(py`
          n = -25
          if n < 0:
              n = n * -1
          print(n)
        `),
        md`
          ### 배수와 공배수
          **n 이 k 의 배수** ⇔ \`n % k == 0\` (나머지가 0)
          **c 가 a 와 b 의 공배수** ⇔ \`c % a == 0 and c % b == 0\`
          "a **또는** b 의 배수"면 \`or\` 를 써요.
        `,
        code(py`
          c = 12
          print(c % 3 == 0, c % 5 == 0)
          print(c % 3 == 0 and c % 4 == 0)   # 3 과 4 의 공배수인가?
          for i in range(1, 31):
              if i % 2 == 0 and i % 3 == 0:
                  print(i, end=" ")           # 2 와 3 의 공배수
        `),
        ex({
          title: "빈칸 채우기 · 합계와 평균",
          prompt: md`
            점수 리스트 \`scores\` 의 합계와 평균을 출력하는 코드예요. 빈칸 \`____\` 을 채워 완성해 보세요.
          `,
          starter: py`
            scores = [70, 85, 90, 65]
            total = 0
            for s in scores:
                total += ____
            print(total, total / len(scores))
          `,
          answer: py`
            scores = [70, 85, 90, 65]
            total = 0
            for s in scores:
                total += s
            print(total, total / len(scores))
          `,
        }),
        ex({
          title: "빈칸 채우기 · 가장 작은 수",
          prompt: md`
            리스트 \`nums\` 에서 가장 작은 수를 찾는 코드예요. 빈칸을 채워 완성해 보세요.
          `,
          starter: py`
            nums = [15, 8, 23, 4, 16]
            low = nums[0]
            for x in nums:
                if ____:
                    low = x
            print(low)
          `,
          answer: py`
            nums = [15, 8, 23, 4, 16]
            low = nums[0]
            for x in nums:
                if x < low:
                    low = x
            print(low)
          `,
        }),
        ex({
          title: "절댓값이 더 큰 수",
          prompt: md`
            정수 a, b 중 절댓값이 더 큰 **원래 수**를 출력해 보세요. a, b 값을 바꿔 가며 확인해 보세요. (\`abs()\` 없이)
            예: \`-10\`, \`5\` → \`-10\`
          `,
          starter: py`
            a = -10
            b = 5
          `,
          answer: py`
            a = -10
            b = 5
            abs_a = a
            abs_b = b
            if a < 0:
                abs_a = a * -1
            if b < 0:
                abs_b = b * -1
            if abs_a > abs_b:
                print(a)
            else:
                print(b)
          `,
        }),
        ex({
          title: "빈칸 채우기 · 공배수 판별",
          prompt: md`
            c 가 a 와 b 의 공배수이면 \`True\`, 아니면 \`False\` 를 출력하도록 빈칸을 채워 보세요.
          `,
          starter: py`
            a = 4
            b = 6
            c = 24
            if ____:
                print("True")
            else:
                print("False")
          `,
          answer: py`
            a = 4
            b = 6
            c = 24
            if c % a == 0 and c % b == 0:
                print("True")
            else:
                print("False")
          `,
        }),
        ex({
          title: "a 또는 b 의 배수 개수",
          prompt: md`
            1 부터 n 까지의 수 중 a 의 배수**이거나** b 의 배수인 수가 몇 개인지 출력해 보세요.
          `,
          starter: py`
            n = 20
            a = 3
            b = 5
          `,
          answer: py`
            n = 20
            a = 3
            b = 5
            count = 0
            for i in range(1, n + 1):
                if i % a == 0 or i % b == 0:
                    count += 1
            print(count)
          `,
        }),
      ],
    },
    {
      id: "s2-ifloop",
      title: "조건문과 반복문 결합 (break · continue)",
      blocks: [
        md`
          ### break 와 continue
          \`break\` 는 반복을 **바로 끝내고**, \`continue\` 는 이번 차례만 **건너뛰고** 다음으로 가요.
        `,
        code(py`
          for n in [3, 8, -1, 5]:
              if n < 0:
                  print("음수를 만나 멈춤")
                  break
              print(n)

          for i in range(1, 8):
              if i % 3 == 0:
                  continue        # 3의 배수는 건너뛰기
              print(i, end=" ")
        `),
        ex({
          title: "3의 배수만 출력",
          prompt: md`
            1 부터 n 까지 3 의 배수만 공백으로 띄어 한 줄에 출력해 보세요.
          `,
          starter: py`
            n = 20
          `,
          answer: py`
            n = 20
            for i in range(1, n + 1):
                if i % 3 == 0:
                    print(i, end=" ")
          `,
        }),
        ex({
          title: "처음 나오는 7 의 위치",
          prompt: md`
            리스트 \`nums\` 에서 7 보다 **앞에** 있는 숫자가 몇 개인지 출력해 보세요. (7 을 만나면 \`break\`)
          `,
          starter: py`
            nums = [14, 45, 50, 3, 7, 11, 5]
            count = 0
          `,
          answer: py`
            nums = [14, 45, 50, 3, 7, 11, 5]
            count = 0
            for n in nums:
                if n == 7:
                    break
                count += 1
            print(count)
          `,
        }),
      ],
    },
    {
      id: "s2-ternary",
      title: "조건부 표현식",
      blocks: [
        md`
          ### 한 줄 if: 값1 if 조건 else 값2
          조건이 참이면 **값1**, 거짓이면 **값2** 가 돼요. 둘 중 하나를 고를 때 \`if/else\` 4 줄을 한 줄로 쓸 수 있어요.
          (시험 코드에서 이 모양이 나오면 읽을 수 있으면 돼요)
        `,
        code(py`
          n = 10
          print("짝수" if n % 2 == 0 else "홀수")

          a, b = 7, 3
          bigger = a if a > b else b
          print(bigger)
        `),
        ex({
          title: "합격 / 불합격",
          prompt: md`
            \`score\` 가 60 점 이상이면 \`합격\`, 아니면 \`불합격\` 을 **조건부 표현식 한 줄로** 출력해 보세요.
          `,
          starter: py`
            score = 58
          `,
          answer: py`
            score = 58
            print("합격" if score >= 60 else "불합격")
          `,
        }),
      ],
    },
  ],
};
