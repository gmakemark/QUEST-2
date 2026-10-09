// STEP1 · 출력과 입력, 자료형 및 제어문의 기본 구조 (2시간)
import { code, ex, md, py } from "./blocks";

export default {
  n: 1,
  title: "출력과 입력, 자료형 및 제어문의 기본 구조",
  summary: ["print(), input() 활용", "숫자, 문자열, 불린 자료형 및 리스트 자료형", "연산자 활용, 인덱싱과 슬라이싱", "조건문과 반복문의 기본 구조"],
  topics: [
    {
      id: "s1-print",
      title: "print() 로 출력하기",
      blocks: [
        md`
          ### 이 페이지 사용법
          회색 코드 칸은 **직접 고칠 수 있는 파이썬 편집기**예요. 코드를 고친 뒤 **[실행]**(또는 \`Ctrl + Enter\`)을 누르면 아래에 실행 결과가 나와요.
          잘못 고쳤으면 **[처음 코드로]** 를 누르면 돼요.

          ### print()
          \`print()\` 는 괄호 안의 값을 화면에 보여 주는 **함수**예요. 글자(문자열)는 따옴표로 감싸고, 숫자와 계산식은 그대로 써요.
        `,
        code(py`
          print("안녕하세요, 파이썬!")
          print(2026)
          print(3 + 4)
          print("3 + 4")
        `),
        md`
          마지막 두 줄을 비교해 보세요. 따옴표가 있으면 **글자 그대로**, 없으면 **계산한 값**이 나와요.

          ### 오류 메시지 읽기
          코드가 틀리면 빨간색 오류 메시지가 나와요. **맨 아래 줄**이 오류의 종류와 이유, 그 위의 \`line 2\` 가 틀린 줄 번호예요.
          아래 코드를 실행해 보고, 따옴표를 닫아서 고쳐 보세요.
        `,
        code(py`
          print("첫째 줄")
          print("둘째 줄)
        `),
        md`
          ### 여러 값을 한 줄에 출력하기
          쉼표 \`,\` 로 여러 값을 넘기면 **한 칸씩 띄어서** 한 줄에 출력해요. 시험 문제에서 아주 자주 쓰여요.

          | 쓰는 법 | 뜻 |
          |---|---|
          | \`print(a, b)\` | a 와 b 를 공백 한 칸으로 띄어 출력 |
          | \`print(a, b, sep="-")\` | 사이에 공백 대신 \`-\` 를 넣음 |
          | \`print(a, end=" ")\` | 출력 뒤에 줄을 바꾸지 않고 공백 한 칸 (다음 print 가 같은 줄에 이어짐) |

          \`#\` 뒤의 글은 **주석**이라서 실행되지 않아요. 설명을 적을 때 써요.
        `,
        code(py`
          print("사과", 3, "개")
          print(2026, 10, 10, sep="-")   # 사이에 - 를 넣어요
          print("한 줄로", end=" ")       # 줄을 바꾸지 않아요
          print("이어서 출력")
        `),
        ex({
          title: "날짜 출력하기",
          prompt: md`
            \`print()\` 를 **한 번만** 써서 \`2026/10/10\` 을 출력해 보세요. (숫자 2026, 10, 10 을 쉼표로 넘기고 \`sep\` 를 써요)
          `,
          starter: py`
            print(2026, 10, 10)
          `,
          answer: py`
            print(2026, 10, 10, sep="/")
          `,
        }),
        ex({
          title: "한 줄에 이어서 출력하기",
          prompt: md`
            \`print()\` 세 번으로 \`1 2 3\` 이 **한 줄에** 나오게 해 보세요. (\`end\` 를 써요)
          `,
          starter: py`
            print(1)
            print(2)
            print(3)
          `,
          answer: py`
            print(1, end=" ")
            print(2, end=" ")
            print(3)
          `,
        }),
      ],
    },
    {
      id: "s1-types",
      title: "변수와 자료형",
      blocks: [
        md`
          ### 변수
          **변수**는 값에 붙이는 이름표예요. \`=\` 는 "같다"가 아니라 **오른쪽 값을 왼쪽 이름에 넣는다**는 뜻이에요.

          ### 기본 자료형
          | 자료형 | 예 | 설명 |
          |---|---|---|
          | \`int\` (정수) | \`10\`, \`-3\` | 소수점 없는 수 |
          | \`float\` (실수) | \`3.14\`, \`2.0\` | 소수점 있는 수 |
          | \`str\` (문자열) | \`"파이썬"\`, \`'a'\` | 따옴표로 감싼 글자 |
          | \`bool\` (불린) | \`True\`, \`False\` | 참/거짓 (첫 글자 대문자!) |
          | \`list\` (리스트) | \`[1, 2, 3]\` | 여러 값을 순서대로 담은 묶음 |

          \`type(값)\` 으로 자료형을 확인할 수 있어요.
        `,
        code(py`
          a = 10
          b = 3.14
          c = "파이썬"
          d = True
          e = [1, 2, 3]
          print(a, b, c, d, e)
          print(type(a), type(b), type(c), type(d), type(e))
        `),
        md`
          ### 자료형 바꾸기
          \`"3"\` 은 글자이고 \`3\` 은 숫자예요. 글자끼리 \`+\` 하면 **이어 붙이고**, 숫자끼리 \`+\` 하면 **더해요**.
          \`int()\`, \`float()\`, \`str()\` 로 자료형을 바꿀 수 있어요.
        `,
        code(py`
          print("3" + "4")
          print(int("3") + int("4"))
          print(float("2.5") * 2)
          print("점수: " + str(95))
        `),
        md`
          숫자와 글자를 \`+\` 로 바로 붙이면 \`TypeError\` 가 나요. 실행해서 오류 메시지를 확인해 보세요.
        `,
        code(py`
          age = 20
          print("나이: " + age)
        `),
        ex({
          title: "합계 구하기",
          prompt: md`
            한 개에 1200 원인 물건을 3 개 샀어요. 변수 \`price\`, \`count\` 를 써서 \`합계: 3600\` 을 출력해 보세요.
          `,
          starter: py`
            price = 1200
            count = 3
            # 여기에 출력 코드를 쓰세요
          `,
          answer: py`
            price = 1200
            count = 3
            print("합계:", price * count)
          `,
        }),
      ],
    },
    {
      id: "s1-ops",
      title: "연산자",
      blocks: [
        md`
          ### 산술 연산자
          | 연산자 | 뜻 | 예 | 결과 |
          |---|---|---|---|
          | \`+\` \`-\` \`*\` | 더하기, 빼기, 곱하기 | \`7 * 2\` | \`14\` |
          | \`/\` | 나누기 (결과는 늘 실수) | \`7 / 2\` | \`3.5\` |
          | \`//\` | 몫 | \`7 // 2\` | \`3\` |
          | \`%\` | 나머지 | \`7 % 2\` | \`1\` |
          | \`**\` | 거듭제곱 | \`2 ** 3\` | \`8\` |

          \`%\` 는 **짝수·홀수, 배수 판별**에 아주 많이 쓰여요. \`n % 2 == 0\` 이면 짝수예요.
        `,
        code(py`
          print(7 / 2, 7 // 2, 7 % 2, 2 ** 3)
          print(10 / 2)      # 나누어떨어져도 실수 5.0
        `),
        md`
          ### 문자열 연산: 이어 붙이기와 반복
          문자열끼리 \`+\` 는 이어 붙이기, **문자열 \`*\` 정수**는 그 횟수만큼 반복이에요. 시험의 별 그리기 문제에서 꼭 써요.
        `,
        code(py`
          print("ab" + "cd")
          print("=" * 20)
          print("-" * 3 + "*" * 2)
        `),
        md`
          ### 비교 연산자와 논리 연산자
          비교 결과는 \`True\` 또는 \`False\` 예요. \`==\` (같다), \`!=\` (다르다), \`>\`, \`<\`, \`>=\`, \`<=\`
          여러 조건은 \`and\` (모두 참), \`or\` (하나라도 참), \`not\` (반대) 로 묶어요.
        `,
        code(py`
          x = 7
          print(x > 5, x % 2 == 0)
          print(x > 5 and x < 10)
          print(x < 0 or x == 7)
          print(not x == 7)
        `),
        ex({
          title: "초를 분과 초로",
          prompt: md`
            \`sec = 125\` 초를 \`//\` 와 \`%\` 로 나누어 \`2 분 5 초\` 를 출력해 보세요.
          `,
          starter: py`
            sec = 125
            # 여기에 코드를 쓰세요
          `,
          answer: py`
            sec = 125
            print(sec // 60, "분", sec % 60, "초")
          `,
        }),
        ex({
          title: "문자열 반복",
          prompt: md`
            \`n = 4\` 일 때 \`****----\` 처럼 별 n 개 뒤에 하이픈 n 개를 출력해 보세요. n 을 바꿔도 맞게 나와야 해요.
          `,
          starter: py`
            n = 4
          `,
          answer: py`
            n = 4
            print("*" * n + "-" * n)
          `,
        }),
      ],
    },
    {
      id: "s1-input",
      title: "input() 으로 입력받기",
      blocks: [
        md`
          ### input()
          \`input()\` 은 사용자가 입력한 한 줄을 **문자열로** 돌려줘요. 이 페이지에서는 코드 아래 **입력값** 칸에 미리 적어 두면, \`input()\` 이 위에서부터 한 줄씩 읽어요.
          괄호 안에 안내 문구를 넣을 수 있지만, **시험에서는 안내 문구 없이 \`input()\` 만** 써요.
        `,
        code(
          py`
            name = input("이름을 입력하세요: ")
            print("안녕하세요,", name)
          `,
          "민지"
        ),
        md`
          ### 숫자로 바꿔야 계산돼요
          \`input()\` 은 늘 문자열이라서, 숫자 계산을 하려면 \`int(input())\` 처럼 바꿔야 해요. 아래 코드는 \`3\` 과 \`4\` 를 입력했는데 \`34\` 가 나와요. 왜 그런지 생각해 보고 고쳐 보세요.
        `,
        code(
          py`
            a = input()
            b = input()
            print(a + b)
          `,
          "3\n4"
        ),
        md`
          입력값 칸을 비우고 실행하면 \`EOFError\` 가 나요. "읽을 입력이 없다"는 뜻이에요.
        `,
        ex({
          title: "내년 나이",
          prompt: md`
            나이를 입력받아 \`내년에는 16 살\` 처럼 내년 나이를 출력해 보세요. (입력값 칸에 15 가 들어 있어요)
          `,
          starter: py`
            age = input()
          `,
          answer: py`
            age = int(input())
            print("내년에는", age + 1, "살")
          `,
          stdin: "15",
        }),
      ],
    },
    {
      id: "s1-index",
      title: "인덱싱과 슬라이싱",
      blocks: [
        md`
          ### 인덱싱: 한 글자(한 개) 꺼내기
          문자열과 리스트는 순서가 있어서 **위치 번호(인덱스)** 로 꺼낼 수 있어요. 번호는 **0 부터** 시작하고, \`-1\` 은 맨 끝이에요.

          | 글자 | P | Y | T | H | O | N |
          |---|---|---|---|---|---|---|
          | 인덱스 | 0 | 1 | 2 | 3 | 4 | 5 |
          | 음수 인덱스 | -6 | -5 | -4 | -3 | -2 | -1 |

          ### 슬라이싱: 여러 개 잘라 내기
          \`s[시작:끝]\` 은 시작부터 **끝 바로 앞까지**예요. 비우면 처음/끝까지, \`s[::2]\` 는 두 칸씩, \`s[::-1]\` 은 거꾸로예요.
        `,
        code(py`
          s = "PYTHON"
          print(s[0], s[-1])
          print(s[1:4])
          print(s[:3], s[3:])
          print(s[::2], s[::-1])
        `),
        code(py`
          nums = [10, 20, 30, 40, 50]
          print(nums[2], nums[-2])
          print(nums[1:3])
          print(nums[5])   # 없는 위치 → IndexError
        `),
        ex({
          title: "단어 자르기",
          prompt: md`
            \`word = "programming"\` 에서 첫 글자, 마지막 글자, 앞 세 글자, 거꾸로 뒤집은 단어를 한 줄에 공백으로 띄어 출력해 보세요.
            결과: \`p g pro gnimmargorp\`
          `,
          starter: py`
            word = "programming"
          `,
          answer: py`
            word = "programming"
            print(word[0], word[-1], word[:3], word[::-1])
          `,
        }),
      ],
    },
    {
      id: "s1-if",
      title: "조건문",
      blocks: [
        md`
          ### if / elif / else
          조건이 참일 때만 실행할 코드를 정해요. **조건 뒤에 콜론 \`:\`**, 실행할 코드는 **들여쓰기(공백 4칸)** 해요.
          들여쓰기가 같은 줄들이 한 묶음(블록)이에요.
        `,
        code(
          py`
            score = int(input())
            if score >= 90:
                print("A")
            elif score >= 80:
                print("B")
            else:
                print("C")
            print("끝")
          `,
          "85"
        ),
        md`
          입력값을 95, 70 으로 바꿔서 실행해 보세요. 마지막 \`print("끝")\` 은 들여쓰기가 없어서 항상 실행돼요.

          ### 들여쓰기 오류
          들여쓰기를 빠뜨리면 \`IndentationError\` 가 나요.
        `,
        code(py`
          n = 4
          if n % 2 == 0:
          print("짝수")
        `),
        ex({
          title: "양수, 음수, 0",
          prompt: md`
            정수를 입력받아 양수이면 \`양수\`, 음수이면 \`음수\`, 0 이면 \`0\` 을 출력해 보세요.
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            if n > 0:
                print("양수")
            elif n < 0:
                print("음수")
            else:
                print("0")
          `,
          stdin: "-3",
        }),
      ],
    },
    {
      id: "s1-loop",
      title: "반복문",
      blocks: [
        md`
          ### for 와 range()
          \`for 변수 in range(n):\` 은 0 부터 n-1 까지 반복해요.
          \`range(시작, 끝, 간격)\` 도 **끝은 포함하지 않아요**. 예: \`range(1, 10, 2)\` → 1, 3, 5, 7, 9
        `,
        code(py`
          for i in range(5):
              print(i)
          for i in range(1, 10, 2):
              print(i, end=" ")
        `),
        md`
          ### 리스트와 문자열도 하나씩 꺼내며 반복
          \`for x in 리스트\`, \`for ch in 문자열\` 처럼 쓰면 앞에서부터 하나씩 꺼내요. 아래처럼 **합계를 쌓아 가는 패턴**은 시험에 자주 나와요.
        `,
        code(py`
          for ch in "ABC":
              print(ch)

          total = 0
          for n in [3, 5, 7]:
              total = total + n    # total += n 과 같아요
          print("합계:", total)
        `),
        md`
          ### while
          \`while 조건:\` 은 조건이 참인 동안 반복해요. 조건이 영원히 참이면 끝나지 않으니(무한 반복) 조심해요. 이 페이지는 10초가 지나면 자동으로 멈춰요.
        `,
        code(py`
          n = 1
          while n < 100:
              n = n * 2
          print(n)
        `),
        md`
          ### 문자열 반복 + 반복문
          STEP3 에서 연습할 별 그리기의 기본 모양이에요.
        `,
        code(py`
          for i in range(1, 5):
              print("*" * i)
        `),
        ex({
          title: "1부터 n까지의 합",
          prompt: md`
            자연수 n 을 입력받아 1 부터 n 까지의 합을 출력해 보세요. (n 이 10 이면 \`55\`)
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            total = 0
            for i in range(1, n + 1):
                total += i
            print(total)
          `,
          stdin: "10",
        }),
        ex({
          title: "구구단 n단",
          prompt: md`
            n 을 입력받아 \`3 x 1 = 3\` 부터 \`3 x 9 = 27\` 까지 n 단을 출력해 보세요. (\`print()\` 에 여러 값을 쉼표로 넘겨요)
          `,
          starter: py`
            n = int(input())
          `,
          answer: py`
            n = int(input())
            for i in range(1, 10):
                print(n, "x", i, "=", n * i)
          `,
          stdin: "3",
        }),
      ],
    },
  ],
};
