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
      id: "s3-print",
      title: "여러 값 한 줄에 출력하기",
      blocks: [
        md`
          ### 정리
          | 하고 싶은 것 | 코드 | 결과 |
          |---|---|---|
          | 공백으로 띄어 출력 | \`print(a, b)\` | \`3 7\` |
          | 다른 글자로 띄어 출력 | \`print(a, b, sep=",")\` | \`3,7\` |
          | 반복하며 한 줄로 | \`print(x, end=" ")\` | \`1 2 3\` |
          | 리스트를 한 줄로 | \`print(*nums)\` | \`1 2 3\` |
          | 리스트를 글자로 이어서 | \`" ".join(map(str, nums))\` | \`1 2 3\` |

          \`print(nums)\` 는 \`[1, 2, 3]\` 처럼 대괄호까지 나오니 주의해요.
        `,
        code(py`
          nums = [1, 2, 3]
          print(nums)
          print(*nums)
          print(*nums, sep=",")
          print(" ".join(map(str, nums)))
          for n in nums:
              print(n * 10, end=" ")
        `),
        ex({
          title: "k 부터 d 씩 n 개",
          prompt: md`
            두 줄에 k 와 n 이 입력돼요. k 에서 시작해 3 씩 더한 수 n 개를 공백으로 띄어 한 줄에 출력해 보세요. (\`7\`, \`5\` → \`7 10 13 16 19\`)
          `,
          starter: py`
            k = int(input())
            n = int(input())
          `,
          answer: py`
            k = int(input())
            n = int(input())
            for i in range(n):
                print(k + 3 * i, end=" ")
          `,
          stdin: "7\n5",
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
