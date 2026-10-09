// STEP2 · 자료형별 기본 기능과 반복문 활용 (2시간)
import { code, ex, md, py } from "./blocks";

export default {
  n: 2,
  title: "자료형별 기본 기능과 반복문 활용",
  summary: ["문자열과 리스트의 기본 기능(메서드)", "자료형과 내장 함수", "시퀀스 자료형과 반복문", "조건문과 반복문 결합 활용"],
  topics: [
    {
      id: "s2-str",
      title: "문자열의 기본 기능 (메서드)",
      blocks: [
        md`
          ### 메서드
          **메서드**는 값 뒤에 점을 찍고 부르는 기능이에요. \`값.기능()\`
          문자열 메서드는 원래 문자열을 바꾸지 않고 **새 문자열을 돌려줘요**. 그래서 결과를 출력하거나 변수에 다시 넣어야 해요.

          | 메서드 | 하는 일 | 예 (\`s = "Hello World"\`) |
          |---|---|---|
          | \`upper()\` / \`lower()\` | 대문자로 / 소문자로 | \`s.upper()\` → \`HELLO WORLD\` |
          | \`replace(a, b)\` | a 를 b 로 바꿈 | \`s.replace("o", "0")\` |
          | \`count(x)\` | x 가 몇 번 나오는지 | \`s.count("l")\` → \`3\` |
          | \`find(x)\` | x 가 처음 나오는 위치 (없으면 -1) | \`s.find("W")\` → \`6\` |
          | \`strip()\` | 앞뒤 공백 지우기 | \`"  hi ".strip()\` → \`hi\` |
          | \`split()\` | 공백으로 나눠 리스트로 | \`s.split()\` → \`['Hello', 'World']\` |
          | \`isupper()\` \`islower()\` \`isdigit()\` \`isalpha()\` | 대문자인지, 소문자인지, 숫자인지, 글자인지 (True/False) | \`"A".isupper()\` → \`True\` |
        `,
        code(py`
          s = "Hello World"
          print(s.upper(), s.lower())
          print(s.replace("o", "0"))
          print(s.count("l"), s.find("W"), s.find("z"))
          print(s.split())
          print(len(s))
          print(s)    # 원래 문자열은 그대로예요
        `),
        md`
          \`isdigit()\`, \`isupper()\` 같은 검사 메서드는 **한 글자씩 검사하는 반복문**과 함께 시험에 자주 나와요.
        `,
        code(py`
          s = "PyThon3"
          print(s[0].isupper(), s[1].isupper(), s[-1].isdigit())
        `),
        ex({
          title: "글자 개수 세기",
          prompt: md`
            \`s = "banana apple"\` 에서 \`a\` 가 몇 번 나오는지, 공백을 지운 글자 수가 몇인지 출력해 보세요.
            결과: \`4 11\`
          `,
          starter: py`
            s = "banana apple"
          `,
          answer: py`
            s = "banana apple"
            print(s.count("a"), len(s.replace(" ", "")))
          `,
        }),
      ],
    },
    {
      id: "s2-list",
      title: "리스트의 기본 기능 (메서드)",
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
          | \`reverse()\` | 순서 뒤집기 |
          | \`index(x)\` / \`count(x)\` | x 의 위치 / x 의 개수 |

          \`x in 리스트\` 는 x 가 들어 있는지 \`True\`/\`False\` 로 알려 줘요.
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
          print(8 in nums, 7 in nums, nums.index(8))
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
      id: "s2-builtin",
      title: "자료형과 내장 함수",
      blocks: [
        md`
          ### 자주 쓰는 내장 함수
          파이썬에 처음부터 들어 있는 함수들이에요. 3급 시험에서 특히 많이 써요.

          | 함수 | 하는 일 | 예 |
          |---|---|---|
          | \`len(x)\` | 길이(개수) | \`len([3, 1, 2])\` → \`3\` |
          | \`sum(리스트)\` | 합 | \`sum([3, 1, 2])\` → \`6\` |
          | \`max()\` / \`min()\` | 가장 큰 / 작은 값 | \`max(3, 9)\` → \`9\` |
          | \`abs(x)\` | 절댓값 | \`abs(-5)\` → \`5\` |
          | \`round(x, n)\` | 소수 n 자리로 반올림 | \`round(3.146, 2)\` → \`3.15\` |
          | \`sorted(리스트)\` | 정렬한 **새** 리스트 | \`sorted([3, 1, 2])\` → \`[1, 2, 3]\` |
          | \`int()\` \`float()\` \`str()\` \`list()\` | 자료형 바꾸기 | \`list("abc")\` → \`['a', 'b', 'c']\` |
        `,
        code(py`
          scores = [80, 95, 72, 88]
          print(len(scores), sum(scores), max(scores), min(scores))
          print(sum(scores) / len(scores))       # 평균
          print(sorted(scores), scores)           # sorted 는 원래 리스트를 바꾸지 않아요
          print(abs(-7), round(3.146, 2))
          print(list("abc"), str(123) + "4")
        `),
        ex({
          title: "평균과 점수 차",
          prompt: md`
            \`scores = [70, 85, 90, 65]\` 의 평균과, 가장 높은 점수와 가장 낮은 점수의 차를 출력해 보세요.
            결과: \`77.5 25\`
          `,
          starter: py`
            scores = [70, 85, 90, 65]
          `,
          answer: py`
            scores = [70, 85, 90, 65]
            print(sum(scores) / len(scores), max(scores) - min(scores))
          `,
        }),
      ],
    },
    {
      id: "s2-split",
      title: "여러 값을 입력받기",
      blocks: [
        md`
          ### 한 줄에 여러 값: input().split()
          시험에서는 \`85 90 77\` 처럼 **한 줄에 공백으로 띄운 여러 값**을 자주 입력받아요.
          \`input().split()\` 은 공백으로 나눠 **문자열 리스트**를 만들어요.
        `,
        code(
          py`
            words = input().split()
            print(words)
            a, b = input().split()      # 두 개면 바로 나눠 담을 수 있어요
            print(a, b)
          `,
          "사과 배 감\n민지 15"
        ),
        md`
          ### 숫자로 바꾸기: map(int, …)
          나눈 값은 아직 문자열이라 계산이 안 돼요. \`map(int, 리스트)\` 는 리스트의 **모든 값에 int 를 적용**해요.

          | 코드 | 결과 (입력 \`3 5 7\`) |
          |---|---|
          | \`input().split()\` | \`['3', '5', '7']\` (문자열) |
          | \`list(map(int, input().split()))\` | \`[3, 5, 7]\` (정수 리스트) |
          | \`a, b, c = map(int, input().split())\` | \`a=3, b=5, c=7\` |

          > 시험 지문의 입력 설명에 "**리스트**"가 나오면 거의 늘 \`list(map(int, input().split()))\` 로 받아요.
        `,
        code(
          py`
            nums = list(map(int, input().split()))
            print(nums, sum(nums))
            a, b = map(int, input().split())
            print(a * b)
          `,
          "3 5 7\n4 6"
        ),
        ex({
          title: "두 수의 합과 차",
          prompt: md`
            한 줄에 두 정수가 공백으로 띄어 입력돼요. 두 수의 합과 차(앞 수 - 뒤 수)를 한 줄에 출력해 보세요.
          `,
          starter: py`
            # a, b = ...
          `,
          answer: py`
            a, b = map(int, input().split())
            print(a + b, a - b)
          `,
          stdin: "12 5",
        }),
        ex({
          title: "점수 리스트 입력받기",
          prompt: md`
            한 줄에 여러 점수가 입력돼요. 점수 개수와 가장 높은 점수를 출력해 보세요.
          `,
          starter: py`
            scores = input()
          `,
          answer: py`
            scores = list(map(int, input().split()))
            print(len(scores), max(scores))
          `,
          stdin: "88 92 75 100 64",
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
          ### 반복하면서 개수 세기·합 구하기
          **변수를 0 으로 만들어 두고, 반복하면서 조건에 맞을 때 더하는** 패턴이에요. 3급 문제 대부분이 이 모양이에요.
        `,
        code(py`
          s = "Hello Python"
          count = 0
          for ch in s:
              if ch.isupper():
                  count += 1
          print("대문자 개수:", count)
        `),
        ex({
          title: "모음 개수",
          prompt: md`
            문자열을 입력받아 모음(a, e, i, o, u)이 몇 개인지 출력해 보세요. (\`ch in "aeiou"\` 를 써 보세요)
          `,
          starter: py`
            s = input()
            count = 0
          `,
          answer: py`
            s = input()
            count = 0
            for ch in s:
                if ch in "aeiou":
                    count += 1
            print(count)
          `,
          stdin: "education",
        }),
        ex({
          title: "짝수 번째 원소의 합",
          prompt: md`
            정수 리스트를 입력받아 **두 번째, 네 번째, …** 원소(인덱스 1, 3, 5 …)의 합을 출력해 보세요.
          `,
          starter: py`
            arr = list(map(int, input().split()))
          `,
          answer: py`
            arr = list(map(int, input().split()))
            total = 0
            for i in range(1, len(arr), 2):
                total += arr[i]
            print(total)
          `,
          stdin: "41 23 27 0 12 36 50",
        }),
      ],
    },
    {
      id: "s2-ifloop",
      title: "조건문과 반복문 결합",
      blocks: [
        md`
          ### 가장 큰 값 찾기
          \`max()\` 를 쓰지 않고 직접 찾는 방법이에요. **첫 값을 기준으로 두고, 더 큰 값이 나오면 바꾸는** 패턴이에요.
        `,
        code(py`
          nums = [12, 45, 7, 33]
          best = nums[0]
          for n in nums:
              if n > best:
                  best = n
          print(best)
        `),
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
            n 을 입력받아 1 부터 n 까지 3 의 배수만 공백으로 띄어 한 줄에 출력해 보세요.
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                if i % 3 == 0:
                    print(i, end=" ")
          `,
          stdin: "20",
        }),
        ex({
          title: "처음 나오는 7 의 위치",
          prompt: md`
            숫자 리스트를 입력받아 7 보다 **앞에** 있는 숫자가 몇 개인지 출력해 보세요. (7 을 만나면 \`break\`)
          `,
          starter: py`
            nums = list(map(int, input().split()))
            count = 0
          `,
          answer: py`
            nums = list(map(int, input().split()))
            count = 0
            for n in nums:
                if n == 7:
                    break
                count += 1
            print(count)
          `,
          stdin: "14 45 50 3 7 11 5",
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
        code(
          py`
            n = int(input())
            print("짝수" if n % 2 == 0 else "홀수")

            a, b = 7, 3
            bigger = a if a > b else b
            print(bigger)
          `,
          "10"
        ),
        ex({
          title: "합격 / 불합격",
          prompt: md`
            점수를 입력받아 60 점 이상이면 \`합격\`, 아니면 \`불합격\` 을 **조건부 표현식 한 줄로** 출력해 보세요.
          `,
          starter: py`
            score = int(input())
          `,
          answer: py`
            score = int(input())
            print("합격" if score >= 60 else "불합격")
          `,
          stdin: "58",
        }),
      ],
    },
  ],
};
