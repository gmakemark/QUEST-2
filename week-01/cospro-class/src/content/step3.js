// STEP3 · 시험 대비 문제 풀이 (2시간)
import { code, ex, md, problem, py } from "./blocks";
import problems from "./step3-problems.json";

export default {
  n: 3,
  title: "시험 대비 문제 풀이",
  summary: ["여러 값 입력받기와 출력하기", "문자열 반복 패턴과 반복문", "3급 기출 문제 풀이"],
  topics: [
    {
      id: "s3-exam",
      title: "3급 시험 알아보기",
      blocks: [
        md`
          ### 시험 구성
          | 항목 | 내용 |
          |---|---|
          | 시간 | 50 분 |
          | 문항 | 10 문항 — **1~5번 빈칸 채우기**, **6~10번 코드 작성(구현)** |
          | 입력 | \`input()\` 으로 받아요. 지문의 예제 값을 코드에 직접 적으면(상수로 고정하면) 안 돼요 |
          | 채점 | 예제가 아닌 **다른 입력값들**로도 실행해서 출력이 정확히 같아야 정답이에요 |

          시험 화면 아래에는 "**유의사항: 문제 예시의 테스트케이스는 채점에 반영되지 않습니다.**" 라는 문구가 있어요. 예제만 맞추는 코드(예: \`print(59)\`)는 오답이에요.

          ### 지문 읽는 법
          지문은 **문제 설명 → 입력 설명 → 출력 설명 → 예제** 순서예요. 입력 설명을 보고 받는 코드를 바로 정할 수 있어요.

          | 입력 설명에 나오는 말 | 입력 받는 코드 |
          |---|---|
          | 정수 n | \`n = int(input())\` |
          | 문자열 s | \`s = input()\` |
          | 정수 a, b (줄마다 하나씩) | \`a = int(input())\` 을 두 번 |
          | 정수 **리스트** arr (공백으로 구분) | \`arr = list(map(int, input().split()))\` |
          | 한 줄에 두 정수 | \`a, b = map(int, input().split())\` |

          ### 출력은 글자 하나까지 정확하게
          공백, 줄바꿈, 소수점 자리까지 예제와 똑같아야 해요. \`"합계:", 15\` 처럼 설명 글을 덧붙이면 오답이에요. 결과 **값만** 출력해요.
        `,
      ],
    },
    {
      id: "s3-input",
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
          나눈 값은 아직 문자열이라 계산이 안 돼요. \`map(int, 리스트)\` 는 리스트의 **모든 값에 int 를 적용**하고, \`list()\` 로 감싸면 리스트가 돼요.

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
            print(nums, len(nums))
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
            한 줄에 여러 점수가 입력돼요. 점수 개수와 첫 번째 점수, 마지막 점수를 출력해 보세요.
          `,
          starter: py`
            scores = input()
          `,
          answer: py`
            scores = list(map(int, input().split()))
            print(len(scores), scores[0], scores[-1])
          `,
          stdin: "88 92 75 100 64",
        }),
      ],
    },
    {
      id: "s3-builtin",
      title: "내장 함수와 시험 단골 메서드",
      blocks: [
        md`
          ### STEP2 에서 직접 만든 것을 한 줄로
          STEP2 에서 반복문으로 구한 합계·최댓값·절댓값은 파이썬에 **내장 함수**로 들어 있어요. 구현 문제에서는 내장 함수를 쓰면 짧고 정확해요.
          (빈칸 문제는 여전히 STEP2 방식의 코드가 많이 나오니 둘 다 알아 두세요)

          | 내장 함수 | 하는 일 | STEP2 에서 직접 만든 방법 |
          |---|---|---|
          | \`sum(리스트)\` | 합계 | \`total += x\` 반복 |
          | \`max(리스트)\` / \`min(리스트)\` | 가장 큰 / 작은 값 | \`if x > best: best = x\` |
          | \`abs(x)\` | 절댓값 | \`if x < 0: x = x * -1\` |
          | \`round(x, n)\` | 소수 n 자리로 반올림 | – |
          | \`sorted(리스트)\` | 정렬한 **새** 리스트 (원래 리스트는 그대로) | \`리스트.sort()\` 는 원래 리스트를 바꿈 |

          \`max(3, 9)\` 처럼 값을 여러 개 바로 넣어도 돼요.
        `,
        code(py`
          scores = [80, 95, 72, 88]
          print(sum(scores), max(scores), min(scores))
          print(sum(scores) / len(scores))        # 평균
          print(abs(-7), abs(7 - 12), max(3, 9))
          print(round(3.146, 2))
          print(sorted(scores), scores)
        `),
        md`
          ### 검사 메서드
          STEP2 에서 비교 연산자(예: 대문자 판별)로 했던 일을 메서드로 할 수 있어요. 문자 하나(또는 문자열)가 어떤 글자인지 \`True\`/\`False\` 로 알려 줘요. **한 글자씩 검사하는 반복문**과 함께 시험에 자주 나와요. (기출: "소문자 개수 세기"의 빈칸)

          | 메서드 | True 가 되는 경우 |
          |---|---|
          | \`isupper()\` | 대문자 |
          | \`islower()\` | 소문자 |
          | \`isdigit()\` | 숫자 |
          | \`isalpha()\` | 글자(알파벳·한글) |
        `,
        code(py`
          s = "PyThon3"
          for ch in s:
              print(ch, ch.isupper(), ch.islower(), ch.isdigit())
        `),
        md`
          ### 수학 패턴 두 가지
          **팩토리얼** n! = 1 × 2 × … × n — 곱할 변수는 **1** 로 시작해요. (0 으로 시작하면 늘 0)
          **자릿수의 합** — \`n % 10\` 은 맨 끝 자리, \`n // 10\` 은 끝 자리를 떼어 낸 수예요.
        `,
        code(py`
          n = 5
          result = 1
          for i in range(1, n + 1):
              result *= i
          print(result)

          n = 1234
          total = 0
          while n > 0:
              total += n % 10
              n //= 10
          print(total)
        `),
        ex({
          title: "대문자 개수",
          prompt: md`
            문자열을 입력받아 대문자가 몇 개인지 출력해 보세요.
          `,
          starter: py`
            s = input()
          `,
          answer: py`
            s = input()
            count = 0
            for ch in s:
                if ch.isupper():
                    count += 1
            print(count)
          `,
          stdin: "LOGic Python",
        }),
        ex({
          title: "반별 최장신",
          prompt: md`
            두 줄에 두 반 학생들의 키가 공백으로 띄어 입력돼요. 각 반에서 가장 큰 키를 공백으로 띄어 출력해 보세요.
          `,
          starter: py`
            green = list(map(int, input().split()))
            yellow = list(map(int, input().split()))
          `,
          answer: py`
            green = list(map(int, input().split()))
            yellow = list(map(int, input().split()))
            print(max(green), max(yellow))
          `,
          stdin: "140 155 148\n150 162 158",
        }),
        ex({
          title: "팩토리얼",
          prompt: md`
            n 을 입력받아 n! 을 출력해 보세요. (n = 6 → \`720\`)
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            result = 1
            for i in range(1, n + 1):
                result *= i
            print(result)
          `,
          stdin: "6",
        }),
      ],
    },
    {
      id: "s3-format",
      title: "소수점 자리수 표현하기",
      blocks: [
        md`
          ### % 서식
          시험에서는 "**소수점 둘째 자리까지 출력**" 같은 조건이 자주 나와요. 문자열 안에 자리 표시를 두고 \`%\` 뒤에 값을 넣어요.

          | 서식 | 뜻 | 예 | 결과 |
          |---|---|---|---|
          | \`%d\` | 정수 | \`"%d" % 7\` | \`7\` |
          | \`%.1f\` | 소수 첫째 자리까지 | \`"%.1f" % 3.14159\` | \`3.1\` |
          | \`%.2f\` | 소수 둘째 자리까지 | \`"%.2f" % 2.5\` | \`2.50\` |
          | \`%s\` | 문자열 | \`"%s" % "hi"\` | \`hi\` |

          값이 여러 개면 괄호로 묶어요: \`"%.1f %d" % (a, b)\`
        `,
        code(py`
          avg = 88.3333
          print("%.2f" % avg)
          print("%.1f" % avg)
          print("%d" % 88.9)              # %d 는 소수점을 버려요
          print("%.1f %d" % (16.5, 33))
          print(f"{avg:.2f}")             # f-문자열로도 같은 결과
        `),
        md`
          ### round() 와 다른 점
          \`round(2.5, 2)\` 는 \`2.5\` 처럼 **끝의 0 을 보여 주지 않아요**. 시험에서 "둘째 자리까지 출력"이면 \`%.2f\` 를 써야 \`2.50\` 이 나와요.
        `,
        code(py`
          x = 2.5
          print(round(x, 2), "%.2f" % x)
        `),
        ex({
          title: "세 과목 평균",
          prompt: md`
            국어, 영어, 수학 점수가 한 줄에 공백으로 띄어 입력돼요. 평균을 소수점 둘째 자리까지 출력해 보세요. (\`85 89 91\` → \`88.33\`)
          `,
          starter: py`
            score = list(map(int, input().split()))
          `,
          answer: py`
            score = list(map(int, input().split()))
            average = sum(score) / len(score)
            print("%.2f" % average)
          `,
          stdin: "85 89 91",
        }),
      ],
    },
    {
      id: "s3-pattern",
      title: "문자열 반복 패턴 (별 그리기)",
      blocks: [
        md`
          ### 문자열 * 반복 + for
          **줄 번호 i 에 따라 몇 개를 찍을지**만 정하면 돼요. 공백도 문자열이라 \`" " * 개수\` 로 반복할 수 있어요.

          | 모양 (n = 4) | i 번째 줄 |
          |---|---|
          | 직각삼각형 | \`"*" * i\` (i = 1 … n) |
          | 거꾸로 | \`"*" * (n - i)\` (i = 0 … n-1) |
          | 오른쪽 정렬 | \`" " * (n - i) + "*" * i\` |
        `,
        code(
          py`
            n = int(input())
            for i in range(1, n + 1):
                print("*" * i)
            for i in range(n):
                print("*" * (n - i))
            for i in range(1, n + 1):
                print(" " * (n - i) + "*" * i)
          `,
          "4"
        ),
        md`
          ### 한 줄에 패턴 이어 붙이기
          모의시험에 나온 모양이에요. 하이픈은 0 개부터 늘고 별은 n 개부터 줄면서, **한 줄로** 이어 출력해요. (n = 5 → \`*****-****--***---**----*\`)
        `,
        code(
          py`
            n = int(input())
            for i in range(n):
                print("-" * i + "*" * (n - i), end="")
            print()
          `,
          "5"
        ),
        ex({
          title: "숫자 삼각형",
          prompt: md`
            n 을 입력받아 i 번째 줄에 숫자 i 를 i 번 출력해 보세요. (n = 4)
            \`\`\`
            1
            22
            333
            4444
            \`\`\`
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                print(str(i) * i)
          `,
          stdin: "4",
        }),
        ex({
          title: "피라미드",
          prompt: md`
            n 을 입력받아 가운데 정렬된 별 피라미드를 출력해 보세요. i 번째 줄(1 부터)은 공백 n-i 개와 별 2i-1 개예요. (n = 3)
            \`\`\`
              *
             ***
            *****
            \`\`\`
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                print(" " * (n - i) + "*" * (2 * i - 1))
          `,
          stdin: "3",
        }),
      ],
    },
    {
      id: "s3-problems",
      title: "실전 10문제",
      blocks: [
        md`
          ### 시험과 같은 형식으로 풀어 보기
          1~5 번은 **빈칸 채우기**(코드의 빈칸에만 입력), 6~10 번은 **코드 작성**이에요.
          **[코드 실행]** 은 예제 입력으로 실행만 하고, **[채점하기]** 는 숨은 입력까지 모두 맞는지 확인해요. 오답이 나오면 **[정답 보기]** 를 누를 수 있어요.
        `,
        ...problems.map(problem),
      ],
    },
  ],
};
