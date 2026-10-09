// STEP3 · 시험 대비 문제 풀이 (2시간)
import { ex, md, problem, py, task } from "./blocks";
import problems from "./step3-problems.json";

export default {
  n: 3,
  title: "시험 대비 문제 풀이",
  summary: ["여러 값 입력받기와 출력하기", "문자열 반복 패턴과 반복문", "3급 기출 문제 풀이"],
  topics: [
    // ─────────────────────────────── 1
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
          | 입력 | \`input()\` 으로 받는다. 지문의 예제 값을 코드에 직접 적으면(상수로 고정하면) 안 된다 |
          | 채점 | 예제가 아닌 **다른 입력값들**로도 실행해서 출력이 정확히 같아야 정답 |

          시험 화면 아래에는 "**유의사항: 문제 예시의 테스트케이스는 채점에 반영되지 않습니다.**" 라는 문구가 있다. 예제만 맞추는 코드(예: \`print(59)\`)는 오답이다.

          ### 지문 읽는 법
          지문은 **문제 설명 → 입력 설명 → 출력 설명 → 예제** 순서이다. 입력 설명을 보고 받는 코드를 바로 정한다.

          | 입력 설명에 나오는 말 | 입력 받는 코드 |
          |---|---|
          | 정수 n | \`n = int(input())\` |
          | 문자열 s | \`s = input()\` |
          | 정수 a, b (줄마다 하나씩) | \`a = int(input())\` 을 두 번 |
          | 정수 **리스트** arr (공백으로 구분) | \`arr = list(map(int, input().split()))\` |
          | 한 줄에 두 정수 | \`a, b = map(int, input().split())\` |

          ### 출력은 글자 하나까지 정확하게
          공백, 줄바꿈, 소수점 자리까지 예제와 똑같아야 한다. \`"합계:", 15\` 처럼 설명 글을 덧붙이면 오답이다. **결과 값만** 출력한다.
        `,
      ],
    },
    // ─────────────────────────────── 2
    {
      id: "s3-input",
      title: "여러 값을 입력받기",
      blocks: [
        md`
          ### input().split()
          시험에서는 \`85 90 77\` 처럼 **한 줄에 공백으로 띄운 여러 값**을 자주 입력받는다.
          \`input().split()\` 은 한 줄을 공백으로 나눠 **문자열 리스트**를 만든다.
          \`a, b = input().split()\` 처럼 바로 나눠 담을 때는 **나뉜 개수와 변수 개수가 같아야** 한다. 다르면 \`ValueError\` 가 난다.
        `,
        task(`한 줄에 과일 이름 여러 개를 입력받아 리스트로 출력하기`, py`
          words = input().split()
          print(words)
        `, { sample: "사과 배 감" }),
        task(`한 줄에 이름과 나이를 입력받아 두 변수에 나눠 담고 출력하기`, py`
          name, age = input().split()
          print(name, age)
        `, { sample: "민지 15" }),
        md`
          ### map(int, …): 모두 정수로
          나눈 값은 아직 문자열이라 계산이 안 된다. \`map(int, 리스트)\` 는 리스트의 **모든 값에 int 를 적용**한다.
          \`map()\` 의 결과는 그대로 출력하면 \`<map object …>\` 로만 보이므로, \`list()\` 로 감싸 리스트로 만들거나 \`a, b = …\` 처럼 나눠 받는다.

          | 코드 | 결과 (입력 \`3 5 7\`) |
          |---|---|
          | \`input().split()\` | \`['3', '5', '7']\` (문자열) |
          | \`list(map(int, input().split()))\` | \`[3, 5, 7]\` (정수 리스트) |
          | \`a, b, c = map(int, input().split())\` | \`a=3, b=5, c=7\` |
        `,
        task(`한 줄에 정수 여러 개를 입력받아 정수 리스트로 출력하기`, py`
          nums = list(map(int, input().split()))
          print(nums)
        `, { sample: "3 5 7" }),
        task(`한 줄에 두 정수를 입력받아 곱 출력하기`, py`
          a, b = map(int, input().split())
          print(a * b)
        `, { sample: "4 6" }),
        task(`한 줄에 정수 여러 개를 입력받아 개수와 첫 번째 값 출력하기`, py`
          nums = list(map(int, input().split()))
          print(len(nums), nums[0])
        `, { sample: "88 92 75 100 64" }),
        ex({
          title: "두 수의 합과 차",
          prompt: md`
            한 줄에 두 정수를 입력받아 합과 차(앞 수 - 뒤 수)를 한 줄에 출력하기.
          `,
          answer: py`
            a, b = map(int, input().split())
            print(a + b, a - b)
          `,
          sample: "12 5",
        }),
        ex({
          title: "리스트의 짝수 합",
          prompt: md`
            한 줄에 정수 여러 개를 입력받아 그중 짝수만 더한 값 출력하기.
          `,
          answer: py`
            nums = list(map(int, input().split()))
            total = 0
            for n in nums:
                if n % 2 == 0:
                    total += n
            print(total)
          `,
          sample: "1 2 3 4 5 6",
        }),
        ex({
          title: "짝수 개수 × 홀수 개수",
          prompt: md`
            한 줄에 정수 여러 개를 입력받아 짝수의 개수와 홀수의 개수를 곱한 값 출력하기.
          `,
          answer: py`
            arr = list(map(int, input().split()))
            odd_count = 0
            even_count = 0
            for num in arr:
                if num % 2 == 1:
                    odd_count += 1
                else:
                    even_count += 1
            print(odd_count * even_count)
          `,
          sample: "52 42 61 34 17 1 98",
        }),
      ],
    },
    // ─────────────────────────────── 3
    {
      id: "s3-builtin",
      title: "내장 함수와 시험 단골 메서드",
      blocks: [
        md`
          ### STEP2 에서 직접 만든 것을 한 줄로
          STEP2 에서 반복문으로 구한 합계·최댓값·절댓값은 **내장 함수**로도 구할 수 있다. 구현 문제에서는 내장 함수가 짧고 정확하다.
          (빈칸 문제는 여전히 STEP2 방식의 코드가 많이 나오므로 둘 다 알아 둔다)

          | 내장 함수 | 하는 일 | STEP2 에서 직접 만든 방법 |
          |---|---|---|
          | \`sum(리스트)\` | 합계 | \`total += x\` 반복 |
          | \`max(리스트)\` / \`min(리스트)\` | 가장 큰 / 작은 값 (\`max(3, 9)\` 처럼 값을 바로 여러 개 넣어도 됨) | \`if x > best: best = x\` |
          | \`abs(x)\` | 절댓값 | \`if x < 0: x = x * -1\` |
          | \`round(x, n)\` | 소수 n 자리로 반올림 (n 을 빼면 정수로) | – |
          | \`sorted(리스트)\` | 정렬한 **새** 리스트 (원래 리스트는 그대로) | \`리스트.sort()\` 는 원래 리스트를 바꿈 |
        `,
        task(`scores 의 합계 출력하기 (sum)`, py`print(sum(scores))`, { given: py`scores = [80, 95, 72, 88]` }),
        task(`scores 의 가장 큰 값과 가장 작은 값 출력하기 (max, min)`, py`print(max(scores), min(scores))`, { given: py`scores = [80, 95, 72, 88]` }),
        task(`scores 의 평균 출력하기 (sum, len)`, py`print(sum(scores) / len(scores))`, { given: py`scores = [80, 95, 72, 88]` }),
        task(`-7 의 절댓값과 3 - 10 의 절댓값 출력하기 (abs)`, py`print(abs(-7), abs(3 - 10))`),
        task(`3.146 을 소수 둘째 자리로 반올림해 출력하기 (round)`, py`print(round(3.146, 2))`),
        task(`sorted() 로 정렬한 리스트와 원래 scores 를 함께 출력하기`, py`print(sorted(scores), scores)`, { given: py`scores = [80, 95, 72, 88]` }),
        md`
          \`round()\` 는 **정확히 반(.5)** 인 값을 가장 가까운 **짝수** 쪽으로 보낸다. (\`round(2.5)\` → \`2\`, \`round(3.5)\` → \`4\`)
          "몇째 자리까지 출력" 같은 시험 조건은 \`round()\` 대신 아래의 \`%.nf\` 서식으로 맞춘다.
        `,
        task(`round(2.5) 와 round(3.5) 를 한 줄에 출력해 결과 확인하기`, py`print(round(2.5), round(3.5))`),
        md`
          ### 검사 메서드
          STEP2 에서 비교 연산자(\`'A' <= ch <= 'Z'\`)로 했던 판별을 메서드로도 할 수 있다. 결과는 \`True\`/\`False\` 이다. (기출: "소문자 개수 세기" 의 빈칸)

          | 메서드 | True 가 되는 경우 |
          |---|---|
          | \`isupper()\` | 대문자 |
          | \`islower()\` | 소문자 |
          | \`isdigit()\` | 숫자 |
          | \`isalpha()\` | 글자(알파벳·한글) |

          문자열에 쓰면 **모든 글자가** 조건에 맞아야 \`True\` 이다. (\`"Ab".isupper()\` 는 \`False\`) 그래서 보통 한 글자씩 꺼내 검사한다.
        `,
        task(`"PyThon3" 의 각 글자가 대문자인지 한 줄에 하나씩 출력하기 (isupper)`, py`
          for ch in "PyThon3":
              print(ch, ch.isupper())
        `),
        task(`"AB" 와 "Ab" 가 모두 대문자인지 한 줄에 출력하기 (결과: True False)`, py`print("AB".isupper(), "Ab".isupper())`),
        task(`문자열을 입력받아 소문자 개수 출력하기 (islower)`, py`
          s = input()
          count = 0
          for ch in s:
              if ch.islower():
                  count += 1
          print(count)
        `, { sample: "LOGic" }),
        md`
          ### 수학 패턴
          **팩토리얼** n! = 1 × 2 × … × n — 곱할 변수는 **1** 로 시작한다. (0 으로 시작하면 늘 0)
          **자릿수의 합** — \`n % 10\` 은 맨 끝 자리, \`n // 10\` 은 끝 자리를 떼어 낸 수이다.
          **약수** — 1 부터 n 까지 \`n % i == 0\` 인 i 이다.
        `,
        task(`5! 출력하기 (결과: 120)`, py`
          result = 1
          for i in range(1, 6):
              result *= i
          print(result)
        `),
        task(`1234 의 각 자리 숫자의 합 출력하기 (결과: 10)`, py`
          n = 1234
          total = 0
          while n > 0:
              total += n % 10
              n //= 10
          print(total)
        `),
        task(`12 의 약수를 한 줄에 출력하기`, py`
          for i in range(1, 13):
              if 12 % i == 0:
                  print(i, end=" ")
        `),
        ex({
          title: "반별 최장신",
          prompt: md`
            두 줄에 두 반 학생들의 키가 공백으로 띄어 입력된다. 각 반에서 가장 큰 키를 공백으로 띄어 출력하기.
          `,
          answer: py`
            green = list(map(int, input().split()))
            yellow = list(map(int, input().split()))
            print(max(green), max(yellow))
          `,
          sample: "140 155 148\n150 162 158",
        }),
        ex({
          title: "최댓값과 최솟값의 차",
          prompt: md`
            한 줄에 정수 여러 개를 입력받아 가장 큰 값과 가장 작은 값의 차이 출력하기.
          `,
          answer: py`
            nums = list(map(int, input().split()))
            print(max(nums) - min(nums))
          `,
          sample: "12 45 7 33",
        }),
        ex({
          title: "평균 이상인 값의 개수",
          prompt: md`
            한 줄에 정수 여러 개를 입력받아 평균 이상인 값이 몇 개인지 출력하기.
          `,
          answer: py`
            nums = list(map(int, input().split()))
            avg = sum(nums) / len(nums)
            count = 0
            for n in nums:
                if n >= avg:
                    count += 1
            print(count)
          `,
          sample: "70 85 90 65",
        }),
        ex({
          title: "대문자 개수",
          prompt: md`
            문자열을 입력받아 대문자가 몇 개인지 출력하기.
          `,
          answer: py`
            s = input()
            count = 0
            for ch in s:
                if ch.isupper():
                    count += 1
            print(count)
          `,
          sample: "LOGic Python",
        }),
        ex({
          title: "팩토리얼",
          prompt: md`
            n 을 입력받아 n! 출력하기. (6 → \`720\`)
          `,
          answer: py`
            n = int(input())
            result = 1
            for i in range(1, n + 1):
                result *= i
            print(result)
          `,
          sample: "6",
        }),
        ex({
          title: "약수의 개수",
          prompt: md`
            자연수 n 을 입력받아 약수가 몇 개인지 출력하기. (12 → \`6\`)
          `,
          answer: py`
            n = int(input())
            count = 0
            for i in range(1, n + 1):
                if n % i == 0:
                    count += 1
            print(count)
          `,
          sample: "12",
        }),
      ],
    },
    // ─────────────────────────────── 4
    {
      id: "s3-format",
      title: "소수점 자리수 표현하기",
      blocks: [
        md`
          ### % 서식
          "**소수점 둘째 자리까지 출력**" 같은 조건이 자주 나온다. 문자열 안에 자리 표시를 두고 \`%\` 뒤에 값을 넣는다.

          | 서식 | 뜻 | 예 | 결과 |
          |---|---|---|---|
          | \`%d\` | 정수 | \`"%d" % 7\` | \`7\` |
          | \`%.1f\` | 소수 첫째 자리까지 | \`"%.1f" % 3.14159\` | \`3.1\` |
          | \`%.2f\` | 소수 둘째 자리까지 | \`"%.2f" % 2.5\` | \`2.50\` |
          | \`%s\` | 문자열 | \`"%s" % "hi"\` | \`hi\` |

          값이 여러 개면 괄호로 묶는다: \`"%.1f %d" % (a, b)\`
          \`%d\` 에 실수를 넣으면 반올림하지 않고 소수점 아래를 **버린다**. \`%.1f\` 처럼 자리를 정하면 그 자리에서 **반올림**한다.
        `,
        task(`avg 를 소수 둘째 자리까지 출력하기`, py`print("%.2f" % avg)`, { given: py`avg = 88.3333` }),
        task(`avg 를 소수 첫째 자리까지 출력하기`, py`print("%.1f" % avg)`, { given: py`avg = 88.3333` }),
        task(`88.9 를 %d 로 출력해 소수점이 버려지는지 확인하기`, py`print("%d" % 88.9)`),
        task(`16.5 와 33 을 "%.1f %d" 로 한 줄에 출력하기`, py`print("%.1f %d" % (16.5, 33))`),
        task(`f-문자열로 avg 를 소수 둘째 자리까지 출력하기`, py`print(f"{avg:.2f}")`, { given: py`avg = 88.3333` }),
        md`
          ### round() 와 다른 점
          \`round(2.5, 2)\` 는 \`2.5\` 처럼 **끝의 0 을 보여 주지 않는다**. "둘째 자리까지 출력" 이면 \`%.2f\` 를 써야 \`2.50\` 이 나온다.
        `,
        task(`x 를 round(x, 2) 와 "%.2f" 로 각각 출력해 비교하기`, py`print(round(x, 2), "%.2f" % x)`, { given: py`x = 2.5` }),
        ex({
          title: "세 과목 평균",
          prompt: md`
            국어, 영어, 수학 점수가 한 줄에 공백으로 띄어 입력된다. 평균을 소수점 둘째 자리까지 출력하기. (\`85 89 91\` → \`88.33\`)
          `,
          answer: py`
            score = list(map(int, input().split()))
            average = sum(score) / len(score)
            print("%.2f" % average)
          `,
          sample: "85 89 91",
        }),
        ex({
          title: "삼각형과 사각형의 넓이",
          prompt: md`
            밑변과 높이를 한 줄에 하나씩 입력받아 삼각형 넓이(소수 첫째 자리까지)와 사각형 넓이(정수)를 한 줄에 출력하기. (11, 3 → \`16.5 33\`)
          `,
          answer: py`
            base = int(input())
            height = int(input())
            print("%.1f %d" % (base * height / 2, base * height))
          `,
          sample: "11\n3",
        }),
        ex({
          title: "할인된 가격",
          prompt: md`
            가격과 할인율(%)을 한 줄에 하나씩 입력받아 할인된 가격을 소수 첫째 자리까지 출력하기. (15000, 15 → \`12750.0\`)
          `,
          answer: py`
            price = int(input())
            rate = int(input())
            print("%.1f" % (price * (100 - rate) / 100))
          `,
          sample: "15000\n15",
        }),
      ],
    },
    // ─────────────────────────────── 5
    {
      id: "s3-pattern",
      title: "문자열 반복 패턴 (별 그리기)",
      blocks: [
        md`
          ### 문자열 * 반복 + for
          **줄 번호 i 에 따라 몇 개를 찍을지**만 정하면 된다. 공백도 문자열이라 \`" " * 개수\` 로 반복할 수 있다.

          | 모양 (n = 4) | i 번째 줄 |
          |---|---|
          | 직각삼각형 | \`"*" * i\` (i = 1 … n) |
          | 거꾸로 | \`"*" * (n - i)\` (i = 0 … n-1) |
          | 오른쪽 정렬 | \`" " * (n - i) + "*" * i\` |
        `,
        task(`n 을 입력받아 별 직각삼각형 출력하기 (1 개부터 n 개까지)`, py`
          n = int(input())
          for i in range(1, n + 1):
              print("*" * i)
        `, { sample: "4" }),
        task(`n 을 입력받아 거꾸로 된 별 삼각형 출력하기 (n 개부터 1 개까지)`, py`
          n = int(input())
          for i in range(n):
              print("*" * (n - i))
        `, { sample: "4" }),
        task(`n 을 입력받아 오른쪽 정렬 별 삼각형 출력하기`, py`
          n = int(input())
          for i in range(1, n + 1):
              print(" " * (n - i) + "*" * i)
        `, { sample: "4" }),
        md`
          ### 한 줄에 패턴 이어 붙이기
          모의시험에 나온 모양이다. 하이픈은 0 개부터 늘고 별은 n 개부터 줄면서 **한 줄로** 이어 출력한다. (n = 5 → \`*****-****--***---**----*\`)
        `,
        task(`n 을 입력받아 하이픈과 별 교차 패턴을 한 줄로 출력하기`, py`
          n = int(input())
          for i in range(n):
              print("-" * i + "*" * (n - i), end="")
          print()
        `, { sample: "5" }),
        ex({
          title: "숫자 삼각형",
          prompt: md`
            n 을 입력받아 i 번째 줄에 숫자 i 를 i 번 출력하기. (n = 4)
            \`\`\`
            1
            22
            333
            4444
            \`\`\`
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                print(str(i) * i)
          `,
          sample: "4",
        }),
        ex({
          title: "피라미드",
          prompt: md`
            n 을 입력받아 가운데 정렬된 별 피라미드 출력하기. i 번째 줄(1 부터)은 공백 n-i 개와 별 2i-1 개. (n = 3)
            \`\`\`
              *
             ***
            *****
            \`\`\`
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                print(" " * (n - i) + "*" * (2 * i - 1))
          `,
          sample: "3",
        }),
        ex({
          title: "한 글자씩 늘려 출력",
          prompt: md`
            문자열을 입력받아 앞에서부터 한 글자씩 늘어나는 부분 문자열을 공백으로 띄어 한 줄에 출력하기. (IoT → \`I Io IoT\`)
          `,
          answer: py`
            s = input()
            for i in range(1, len(s) + 1):
                print(s[:i], end=" ")
          `,
          sample: "IoT",
        }),
      ],
    },
    // ─────────────────────────────── 6
    {
      id: "s3-problems",
      title: "실전 10문제",
      blocks: [
        md`
          ### 시험과 같은 형식으로 풀어 보기
          1~5 번은 **빈칸 채우기**(코드의 빈칸에만 입력), 6~10 번은 **코드 작성**이다.
          **[코드 실행]** 은 예제 입력으로 실행만 하고, **[채점하기]** 는 숨은 입력까지 모두 맞는지 확인한다. 오답이 나오면 **[정답 보기]** 가 열린다.
        `,
        ...problems.map(problem),
      ],
    },
  ],
};
