// STEP1 · 출력과 입력, 자료형 및 제어문의 기본 구조 (2시간)
// 개념 하나에 연습 칸 하나. 칸 맨 위 주석이 문제이고, 그 아래에 직접 코드를 쓴다.
import { code, ex, md, py, task } from "./blocks";

export default {
  n: 1,
  title: "출력과 입력, 자료형 및 제어문의 기본 구조",
  summary: ["print(), input() 활용", "숫자, 문자열, 불린 자료형 및 리스트 자료형", "연산자 활용, 인덱싱과 슬라이싱", "조건문과 반복문의 기본 구조"],
  topics: [
    // ─────────────────────────────── 1
    {
      id: "s1-print",
      title: "print() 로 출력하기",
      blocks: [
        md`
          ### print()
          \`print()\` 는 괄호 안의 값을 화면에 출력하는 **함수**이다. 괄호 안에는 글자, 숫자, 계산식 등 어떤 값이든 넣을 수 있다.

          ### 문자열 출력
          글자로 된 값을 **문자열**이라고 한다. 파이썬에서 문자열은 \`print()\` 안이든 변수에 저장할 때든 **어디서나** 큰따옴표(\`"안녕"\`)나 작은따옴표(\`'안녕'\`)로 감싸서 쓴다. 두 따옴표는 뜻이 같다.
          따옴표는 "여기부터 여기까지가 글자"라는 표시라서, 출력할 때는 따옴표 없이 글자만 나온다.
        `,
        task(`문자열 "안녕하세요, 파이썬!" 출력하기`, py`print("안녕하세요, 파이썬!")`),
        task(`작은따옴표로 문자열 'Hello' 출력하기`, py`print('Hello')`),
        md`
          ### 숫자 출력
          숫자는 따옴표 없이 쓴다. 소수점이 없는 수는 **정수**, 소수점이 있는 수는 **실수**이다.
          숫자를 따옴표로 감싸면 숫자가 아니라 **문자열**이 된다. (\`2026\` 은 숫자, \`"2026"\` 은 글자)
        `,
        task(`정수 2026 출력하기`, py`print(2026)`),
        task(`실수 3.14 출력하기`, py`print(3.14)`),
        md`
          ### 계산식 출력
          괄호 안에 계산식을 쓰면 **계산한 결과**가 출력된다. 따옴표로 감싸면 계산하지 않고 **글자 그대로** 출력된다.
        `,
        task(`3 + 4 의 계산 결과 출력하기`, py`print(3 + 4)`),
        task(`글자 "3 + 4" 를 계산하지 않고 그대로 출력하기`, py`print("3 + 4")`),
        md`
          ### 여러 줄 출력
          \`print()\` 를 여러 번 쓰면 한 번에 한 줄씩 출력된다. 괄호 안이 빈 \`print()\` 는 **빈 줄**을 출력한다.
        `,
        task(`첫째 줄에 "가", 둘째 줄에 "나" 출력하기`, py`
          print("가")
          print("나")
        `),
        task(`"위" 와 "아래" 사이에 빈 줄 하나를 넣어 출력하기`, py`
          print("위")
          print()
          print("아래")
        `),
        md`
          ### 주석
          \`#\` 부터 그 줄 끝까지는 **주석**이다. 실행되지 않으므로 설명이나 메모를 적을 때 쓴다. 지금 보고 있는 칸의 문제도 주석이다.
          단, 따옴표 안의 \`#\` 은 주석이 아니라 그냥 글자이다.
        `,
        task(`문자열 "#1 등" 출력하기 (따옴표 안의 # 은 글자)`, py`print("#1 등")`),
        task(`둘째 줄 앞에 # 를 붙여 "B" 가 출력되지 않게 하기`, py`
          print("A")
          # print("B")
        `, { given: py`
          print("A")
          print("B")
        `, fix: true }),
        md`
          ### 오류 메시지 읽기
          코드가 틀리면 빨간 오류 메시지가 나온다. **맨 아래 줄**이 오류의 종류와 이유이고, 그 위의 \`line 2\` 가 틀린 줄 번호이다.

          | 오류 | 뜻 | 흔한 원인 |
          |---|---|---|
          | \`SyntaxError\` | 문법이 틀림 | 따옴표·괄호를 닫지 않음, 콜론 \`:\` 빠짐 |
          | \`NameError\` | 없는 이름을 씀 | 변수 이름 오타, 저장하기 전에 사용, 글자에 따옴표를 빠뜨림 |
          | \`TypeError\` | 자료형이 맞지 않음 | 문자열과 숫자를 \`+\` 로 연결 |
          | \`ValueError\` | 값이 맞지 않음 | \`int("abc")\` 처럼 바꿀 수 없는 값 |
          | \`IndentationError\` | 들여쓰기가 틀림 | \`if\`, \`for\` 아래 들여쓰기 빠짐 |
          | \`IndexError\` | 없는 위치 | 리스트·문자열의 범위를 넘는 인덱스 |
        `,
        task(`실행해서 오류 메시지를 확인한 뒤, 따옴표를 닫아 고치기`, py`
          print("첫째 줄")
          print("둘째 줄")
        `, { given: py`
          print("첫째 줄")
          print("둘째 줄)
        `, fix: true }),
        task(`실행해서 NameError 를 확인한 뒤, 따옴표를 넣어 고치기`, py`
          print("Hello")
        `, { given: py`
          print(Hello)
        `, fix: true }),
        task(`실행해서 오류 메시지를 확인한 뒤, 괄호를 닫아 고치기`, py`
          print(100)
        `, { given: py`
          print(100
        `, fix: true }),
        ex({
          title: "자기소개 세 줄",
          prompt: md`
            이름(문자열), 나이(정수), 좋아하는 과목(문자열)을 **한 줄에 하나씩** 세 줄로 출력하기.
          `,
          answer: py`
            print("김민지")
            print(15)
            print("수학")
          `,
        }),
      ],
    },
    // ─────────────────────────────── 2
    {
      id: "s1-print2",
      title: "여러 값을 한 줄에 출력하기",
      blocks: [
        md`
          ### 쉼표로 여러 값 출력
          \`print()\` 에 값을 쉼표 \`,\` 로 여러 개 넣으면 **사이를 공백 한 칸**으로 띄어 한 줄에 출력한다. 문자열과 숫자를 섞어도 된다.
        `,
        task(`"사과", 3, "개" 를 한 줄에 출력하기 (결과: 사과 3 개)`, py`print("사과", 3, "개")`),
        task(`이름 "민지" 와 나이 15 를 한 줄에 출력하기`, py`print("민지", 15)`),
        md`
          ### sep
          \`sep=\` 를 쓰면 값 사이의 공백 대신 다른 글자를 넣는다. \`sep=""\` 이면 **사이에 아무것도 넣지 않는다**.
          \`sep\` 에 넣는 값도 문자열이므로 따옴표로 감싼다. 값이 두 개 이상일 때만 의미가 있다.
        `,
        task(`2026, 10, 10 을 - 로 이어 출력하기 (결과: 2026-10-10)`, py`print(2026, 10, 10, sep="-")`),
        task(`"a", "b", "c" 를 사이에 아무것도 없이 출력하기 (결과: abc)`, py`print("a", "b", "c", sep="")`),
        md`
          ### end
          \`print()\` 는 출력 끝에 **줄바꿈**(\`\n\`)을 붙이는 것이 기본이다. \`end=\` 로 끝에 붙일 글자를 바꾸면 줄을 바꾸지 않으므로, 다음 \`print()\` 가 **같은 줄에 이어서** 출력된다.
        `,
        task(`print() 두 번으로 "Hello World" 를 한 줄에 출력하기`, py`
          print("Hello", end=" ")
          print("World")
        `),
        task(`print() 세 번으로 1 2 3 을 한 줄에 출력하기`, py`
          print(1, end=" ")
          print(2, end=" ")
          print(3)
        `),
        task(`"로딩" 뒤에 ... 을 붙이고 이어서 "완료" 출력하기 (결과: 로딩...완료)`, py`
          print("로딩", end="...")
          print("완료")
        `),
        ex({
          title: "날짜 출력",
          prompt: md`
            \`print()\` 를 **한 번만** 써서 \`2026/10/10\` 출력하기. (숫자 2026, 10, 10 과 \`sep\` 사용)
          `,
          answer: py`
            print(2026, 10, 10, sep="/")
          `,
        }),
        ex({
          title: "시각 출력",
          prompt: md`
            문자열 "09", "30", "00" 과 \`sep\` 을 써서 \`09:30:00\` 출력하기.
          `,
          answer: py`
            print("09", "30", "00", sep=":")
          `,
        }),
      ],
    },
    // ─────────────────────────────── 3
    {
      id: "s1-var",
      title: "변수",
      blocks: [
        md`
          ### 변수에 값 저장
          **변수**는 값에 붙이는 이름표이다. \`=\` 는 "같다"가 아니라 **오른쪽 값을 왼쪽 이름에 저장한다**는 뜻이다.
          변수 이름 규칙
          - 영문자·숫자·밑줄 \`_\` 로 짓는다. (예: \`name\`, \`score1\`, \`total_price\`)
          - 숫자로 시작할 수 없고(\`1st\` ✕), 공백을 넣을 수 없다(\`my name\` ✕).
          - 대문자와 소문자는 다른 이름이다. (\`Age\` 와 \`age\` 는 다른 변수)
          - \`if\`, \`for\`, \`while\` 처럼 파이썬이 이미 쓰는 말은 쓸 수 없다.
        `,
        task(`변수 name 에 "민지" 를 저장하고 name 출력하기`, py`
          name = "민지"
          print(name)
        `),
        task(`변수 age 에 15 를 저장하고 age 출력하기`, py`
          age = 15
          print(age)
        `),
        md`
          ### 변수 이름과 따옴표
          \`print(name)\` 은 변수 name 에 **저장된 값**을, \`print("name")\` 은 **글자 name** 을 출력한다.
          저장한 적 없는 변수를 쓰면 \`NameError\` 가 난다.
        `,
        task(`변수 name 의 값과 글자 "name" 을 한 줄에 출력하기 (결과: 민지 name)`, py`print(name, "name")`, { given: py`name = "민지"` }),
        md`
          ### 값 바꾸기
          같은 변수에 다시 저장하면 **새 값으로 바뀐다**. 앞의 값은 사라진다.
        `,
        task(`score 를 95 로 바꾼 뒤 출력하기`, py`
          score = 95
          print(score)
        `, { given: py`
          score = 80
        ` }),
        md`
          ### 여러 변수에 한 번에 저장
          \`a, b = 7, 3\` 처럼 쉼표로 이어 쓰면 왼쪽 변수에 오른쪽 값이 **차례대로** 들어간다. 변수 개수와 값 개수가 같아야 한다.
        `,
        task(`a 에 7, b 에 3 을 한 줄로 저장하고 a 와 b 출력하기`, py`
          a, b = 7, 3
          print(a, b)
        `),
        md`
          ### 변수로 계산
          변수끼리 계산한 결과를 다른 변수에 저장할 수 있다.
        `,
        task(`a 와 b 의 합을 변수 total 에 저장하고 출력하기`, py`
          total = a + b
          print(total)
        `, { given: py`
          a = 7
          b = 3
        ` }),
        md`
          ### +=, -=, *=, //=, %=
          \`count = count + 1\` 은 "지금 count 에 1 을 더해서 다시 count 에 저장"이다. 줄여서 \`count += 1\` 로 쓴다.
          반복문에서 개수를 세거나 합을 구할 때 계속 쓰는 모양이다. 다른 연산도 같은 방법으로 줄여 쓴다.

          | 줄여 쓴 모양 | 같은 뜻 |
          |---|---|
          | \`n += 2\` | \`n = n + 2\` |
          | \`n -= 2\` | \`n = n - 2\` |
          | \`n *= 2\` | \`n = n * 2\` |
          | \`n //= 2\` | \`n = n // 2\` |
          | \`n %= 2\` | \`n = n % 2\` |
        `,
        task(`count 에 1 을 두 번 더한 뒤 출력하기 (결과: 2)`, py`
          count = count + 1
          count = count + 1
          print(count)
        `, { given: py`
          count = 0
        ` }),
        task(`+= 를 써서 total 에 5 를 더한 뒤 출력하기 (결과: 15)`, py`
          total += 5
          print(total)
        `, { given: py`
          total = 10
        ` }),
        task(`-= 로 n 에서 4 를 뺀 뒤, *= 로 3 을 곱해 출력하기 (결과: 18)`, py`
          n -= 4
          n *= 3
          print(n)
        `, { given: py`
          n = 10
        ` }),
        ex({
          title: "합계 구하기",
          prompt: md`
            한 개에 1200 원인 물건을 3 개 샀다. 변수 \`price\`, \`count\` 를 만들고, 둘을 곱한 합계를 변수 \`total\` 에 저장해 출력하기.
          `,
          answer: py`
            price = 1200
            count = 3
            total = price * count
            print(total)
          `,
        }),
      ],
    },
    // ─────────────────────────────── 4
    {
      id: "s1-types",
      title: "자료형",
      blocks: [
        md`
          ### 기본 자료형
          | 자료형 | 예 | 설명 |
          |---|---|---|
          | \`int\` (정수) | \`10\`, \`-3\` | 소수점 없는 수 |
          | \`float\` (실수) | \`3.14\`, \`2.0\` | 소수점 있는 수 |
          | \`str\` (문자열) | \`"파이썬"\`, \`'a'\` | 글자로 된 값 (따옴표로 감싸서 씀) |
          | \`bool\` (불린) | \`True\`, \`False\` | 참/거짓 (첫 글자 대문자) |
          | \`list\` (리스트) | \`[1, 2, 3]\` | 여러 값을 순서대로 담은 묶음 |

          \`type(값)\` 은 값의 자료형을 알려 준다. 결과는 \`<class 'int'>\` 처럼 나온다.
        `,
        task(`10 과 3.14 의 자료형을 한 줄에 출력하기`, py`print(type(10), type(3.14))`),
        task(`"파이썬" 과 True 의 자료형을 한 줄에 출력하기`, py`print(type("파이썬"), type(True))`),
        task(`리스트 [1, 2, 3] 을 변수 nums 에 저장하고, nums 와 nums 의 자료형 출력하기`, py`
          nums = [1, 2, 3]
          print(nums, type(nums))
        `),
        md`
          ### 자료형 바꾸기
          \`"3"\` 은 글자이고 \`3\` 은 숫자이다. 글자끼리 \`+\` 하면 **이어 붙이고**, 숫자끼리 \`+\` 하면 **더한다**.
          \`int()\` 는 정수로, \`float()\` 는 실수로, \`str()\` 은 문자열로 바꾼다.
          - \`int()\` 에 실수를 넣으면 소수점 아래를 **버린다**. (\`int(3.7)\` → \`3\`)
          - 숫자 모양이 아닌 문자열은 바꿀 수 없어 \`ValueError\` 가 난다. (\`int("abc")\`, 소수점이 있는 \`int("3.5")\`)
        `,
        task(`"3" + "4" 의 결과를 출력해서 확인하기`, py`print("3" + "4")`),
        task(`int() 로 "3" 과 "4" 를 정수로 바꿔 더한 값 출력하기 (결과: 7)`, py`print(int("3") + int("4"))`),
        task(`float() 로 "2.5" 를 실수로 바꿔 2 를 곱한 값 출력하기`, py`print(float("2.5") * 2)`),
        task(`str() 로 95 를 문자열로 바꿔 "점수: " 뒤에 이어 붙여 출력하기`, py`print("점수: " + str(95))`),
        task(`int() 로 3.7 을 정수로 바꿔 출력하기 (소수점 아래가 버려지는지 확인)`, py`print(int(3.7))`),
        task(`실행해서 ValueError 를 확인한 뒤, float() 로 바꿔 고치기`, py`print(float("3.5"))`, { given: py`print(int("3.5"))`, fix: true }),
        task(`실행해서 TypeError 를 확인한 뒤, str() 을 써서 고치기`, py`
          age = 20
          print("나이: " + str(age))
        `, { given: py`
          age = 20
          print("나이: " + age)
        `, fix: true }),
        md`
          ### f-문자열
          따옴표 앞에 \`f\` 를 붙이고, 넣고 싶은 변수나 계산식을 **중괄호 \`{ }\`** 안에 쓴다. 숫자를 \`str()\` 로 바꾸지 않아도 되어 편하다. 만들어진 값은 문자열이다.
        `,
        task(`f-문자열로 "민지님은 20살" 출력하기`, py`print(f"{name}님은 {age}살")`, { given: py`
          name = "민지"
          age = 20
        ` }),
        task(`f-문자열로 "3 + 5 = 8" 출력하기 (중괄호 안에서 a + b 계산)`, py`print(f"{a} + {b} = {a + b}")`, { given: py`
          a = 3
          b = 5
        ` }),
        ex({
          title: "영수증 한 줄",
          prompt: md`
            \`item = "연필"\`, \`price = 500\`, \`count = 4\` 일 때 f-문자열로 \`연필 4개: 2000원\` 출력하기.
          `,
          starter: py`
            item = "연필"
            price = 500
            count = 4
          `,
          answer: py`
            item = "연필"
            price = 500
            count = 4
            print(f"{item} {count}개: {price * count}원")
          `,
        }),
      ],
    },
    // ─────────────────────────────── 5
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
        `,
        task(`7 곱하기 2 의 결과 출력하기`, py`print(7 * 2)`),
        task(`7 나누기 2 의 결과 출력하기`, py`print(7 / 2)`),
        task(`10 나누기 2 의 결과 출력하기 (나누어떨어져도 실수 5.0 인지 확인)`, py`print(10 / 2)`),
        task(`7 을 2 로 나눈 몫 출력하기`, py`print(7 // 2)`),
        task(`7 을 2 로 나눈 나머지 출력하기`, py`print(7 % 2)`),
        task(`2 의 10 제곱 출력하기`, py`print(2 ** 10)`),
        md`
          ### 연산 순서
          수학과 같다. \`**\` 가 가장 먼저, 그다음 \`*\` \`/\` \`//\` \`%\`, 마지막에 \`+\` \`-\` 를 계산한다. 같은 순위는 왼쪽부터 계산한다. (\`**\` 만 오른쪽부터)
          먼저 계산할 부분은 **괄호 \`( )\`** 로 묶는다.
        `,
        task(`2 + 3 * 4 의 결과 출력하기 (곱셈이 먼저)`, py`print(2 + 3 * 4)`),
        task(`괄호를 써서 2 + 3 을 먼저 계산한 뒤 4 를 곱한 결과 출력하기 (결과: 20)`, py`print((2 + 3) * 4)`),
        task(`80, 90, 70 의 평균 출력하기 (괄호로 합을 먼저)`, py`print((80 + 90 + 70) / 3)`),
        md`
          ### 나머지 %
          **짝수는 2 로 나눈 나머지가 0**, 홀수는 1 이다. "n 이 k 의 배수" 는 \`n % k\` 가 0 이라는 뜻이다. 시험에 아주 자주 나온다.
        `,
        task(`15 를 4 로 나눈 몫과 나머지를 한 줄에 출력하기 (결과: 3 3)`, py`print(15 // 4, 15 % 4)`),
        task(`24 를 6 으로 나눈 나머지 출력하기 (0 이면 24 는 6 의 배수)`, py`print(24 % 6)`),
        md`
          ### 문자열 연산
          문자열끼리 \`+\` 는 **이어 붙이기**, 문자열 \`*\` 정수는 그 횟수만큼 **반복**이다.
        `,
        task(`"ab" 와 "cd" 를 이어 붙여 출력하기`, py`print("ab" + "cd")`),
        task(`"=" 를 20 번 반복해 출력하기`, py`print("=" * 20)`),
        task(`"-" 3 개 뒤에 "*" 2 개를 붙여 출력하기 (결과: ---**)`, py`print("-" * 3 + "*" * 2)`),
        md`
          ### 비교 연산자
          비교한 결과는 \`True\` 또는 \`False\` 이다.
          \`==\` 같다, \`!=\` 다르다, \`>\` 크다, \`<\` 작다, \`>=\` 크거나 같다, \`<=\` 작거나 같다. (\`=\` 하나는 저장, \`==\` 두 개는 비교)
        `,
        task(`x 가 5 보다 큰지 출력하기`, py`print(x > 5)`, { given: py`x = 7` }),
        task(`x 가 7 과 같은지 출력하기`, py`print(x == 7)`, { given: py`x = 7` }),
        task(`x 가 짝수인지 출력하기 (x % 2 == 0)`, py`print(x % 2 == 0)`, { given: py`x = 7` }),
        md`
          ### 논리 연산자
          \`and\` 는 둘 다 참이면 참, \`or\` 는 하나라도 참이면 참, \`not\` 은 참과 거짓을 뒤집는다.
        `,
        task(`x 가 5 보다 크고 10 보다 작은지 출력하기`, py`print(x > 5 and x < 10)`, { given: py`x = 7` }),
        task(`x 가 0 보다 작거나 7 과 같은지 출력하기`, py`print(x < 0 or x == 7)`, { given: py`x = 7` }),
        task(`not 을 써서 "x 가 7 이 아니다" 를 출력하기`, py`print(not x == 7)`, { given: py`x = 7` }),
        ex({
          title: "초를 분과 초로",
          prompt: md`
            \`sec = 125\` 를 \`//\` 와 \`%\` 로 나누어 \`2 분 5 초\` 출력하기.
          `,
          starter: py`
            sec = 125
          `,
          answer: py`
            sec = 125
            print(sec // 60, "분", sec % 60, "초")
          `,
        }),
        ex({
          title: "문자열 반복",
          prompt: md`
            \`n = 4\` 일 때 별 n 개 뒤에 하이픈 n 개 출력하기 (결과: \`****----\`). n 을 바꿔도 맞게 나와야 한다.
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
    // ─────────────────────────────── 6
    {
      id: "s1-input",
      title: "input() 으로 입력받기",
      blocks: [
        md`
          ### input()
          \`input()\` 은 키보드로 입력한 **한 줄을 문자열로** 돌려준다. 실행하면 실행 결과 창에 입력칸이 나타나고, 값을 쓰고 Enter 를 누르면 다음 줄이 실행된다.
          괄호 안에 안내 문구를 넣을 수 있다. **시험에서는 안내 문구 없이 \`input()\` 만** 쓴다.
        `,
        task(`안내 문구 "이름: " 으로 이름을 입력받아 "안녕, 이름" 출력하기`, py`
          name = input("이름: ")
          print("안녕,", name)
        `, { sample: "민지" }),
        task(`input() 으로 받은 값의 자료형 출력하기 (숫자를 넣어도 str 인지 확인)`, py`
          value = input()
          print(type(value))
        `, { sample: "15" }),
        md`
          ### int(input())
          \`input()\` 은 늘 문자열이므로, 숫자 계산을 하려면 \`int(input())\` 처럼 바꾼다. 실수는 \`float(input())\`.
          \`int(input())\` 에 정수가 아닌 값(\`3.5\`, \`abc\`)을 넣으면 \`ValueError\` 가 난다.
        `,
        task(`두 값을 입력받아 a + b 출력하기. 3 과 4 를 입력해 결과(34)가 왜 그런지 확인`, py`
          a = input()
          b = input()
          print(a + b)
        `, { sample: "3\n4" }),
        task(`위 코드를 int(input()) 으로 고쳐 3 과 4 의 합 7 출력하기`, py`
          a = int(input())
          b = int(input())
          print(a + b)
        `, { sample: "3\n4" }),
        task(`실수 하나를 입력받아 2 를 곱한 값 출력하기`, py`
          x = float(input())
          print(x * 2)
        `, { sample: "2.5" }),
        ex({
          title: "내년 나이",
          prompt: md`
            나이를 입력받아 f-문자열로 \`내년에는 16살\` 처럼 내년 나이 출력하기.
          `,
          answer: py`
            age = int(input())
            print(f"내년에는 {age + 1}살")
          `,
          sample: "15",
        }),
        ex({
          title: "직사각형의 넓이와 둘레",
          prompt: md`
            가로와 세로를 한 줄에 하나씩 입력받아 넓이와 둘레를 한 줄에 출력하기. (가로 3, 세로 5 → \`15 16\`)
          `,
          answer: py`
            w = int(input())
            h = int(input())
            print(w * h, 2 * (w + h))
          `,
          sample: "3\n5",
        }),
      ],
    },
    // ─────────────────────────────── 7
    {
      id: "s1-index",
      title: "인덱싱과 슬라이싱",
      blocks: [
        md`
          ### 인덱싱
          문자열과 리스트는 순서가 있어서 **위치 번호(인덱스)** 로 꺼낼 수 있다. 번호는 **0 부터** 시작하고, \`-1\` 은 맨 끝이다.

          | 글자 | P | Y | T | H | O | N |
          |---|---|---|---|---|---|---|
          | 인덱스 | 0 | 1 | 2 | 3 | 4 | 5 |
          | 음수 인덱스 | -6 | -5 | -4 | -3 | -2 | -1 |
        `,
        task(`s 의 첫 글자 출력하기`, py`print(s[0])`, { given: py`s = "PYTHON"` }),
        task(`s 의 마지막 글자 출력하기 (음수 인덱스)`, py`print(s[-1])`, { given: py`s = "PYTHON"` }),
        task(`s 의 세 번째 글자 출력하기`, py`print(s[2])`, { given: py`s = "PYTHON"` }),
        md`
          ### 슬라이싱
          \`s[시작:끝]\` 은 시작부터 **끝 바로 앞까지**이다. 시작을 비우면 처음부터, 끝을 비우면 마지막까지.
          \`s[시작:끝:간격]\` 처럼 간격도 줄 수 있고, \`s[::-1]\` 은 거꾸로이다.
        `,
        task(`s 의 인덱스 1 부터 3 까지 출력하기 (결과: YTH)`, py`print(s[1:4])`, { given: py`s = "PYTHON"` }),
        task(`s 의 앞 세 글자 출력하기`, py`print(s[:3])`, { given: py`s = "PYTHON"` }),
        task(`s 의 네 번째 글자부터 끝까지 출력하기`, py`print(s[3:])`, { given: py`s = "PYTHON"` }),
        task(`s 의 뒤 세 글자 출력하기 (음수 인덱스로 시작)`, py`print(s[-3:])`, { given: py`s = "PYTHON"` }),
        task(`s 를 한 글자씩 건너뛰며 출력하기 (결과: PTO)`, py`print(s[::2])`, { given: py`s = "PYTHON"` }),
        task(`s 를 거꾸로 출력하기`, py`print(s[::-1])`, { given: py`s = "PYTHON"` }),
        md`
          ### 리스트 인덱싱과 슬라이싱
          리스트도 같은 방법으로 꺼내고 자른다.
          **인덱싱**으로 없는 위치를 꺼내면 \`IndexError\` 가 나지만, **슬라이싱**은 범위를 넘어도 오류 없이 있는 데까지만 잘라 준다.
        `,
        task(`nums 의 세 번째 값 출력하기`, py`print(nums[2])`, { given: py`nums = [10, 20, 30, 40, 50]` }),
        task(`nums 의 뒤에서 두 번째 값 출력하기`, py`print(nums[-2])`, { given: py`nums = [10, 20, 30, 40, 50]` }),
        task(`nums 의 두 번째, 세 번째 값을 슬라이싱으로 출력하기 (결과: [20, 30])`, py`print(nums[1:3])`, { given: py`nums = [10, 20, 30, 40, 50]` }),
        task(`nums[3:100] 을 출력해서 범위를 넘는 슬라이싱이 오류 없이 되는지 확인하기`, py`print(nums[3:100])`, { given: py`nums = [10, 20, 30, 40, 50]` }),
        task(`실행해서 IndexError 를 확인한 뒤, 마지막 값을 출력하도록 고치기`, py`
          nums = [10, 20, 30, 40, 50]
          print(nums[4])
        `, { given: py`
          nums = [10, 20, 30, 40, 50]
          print(nums[5])
        `, fix: true }),
        ex({
          title: "단어 자르기",
          prompt: md`
            \`word = "programming"\` 의 첫 글자, 마지막 글자, 앞 세 글자, 거꾸로 뒤집은 단어를 한 줄에 출력하기.
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
    // ─────────────────────────────── 8
    {
      id: "s1-if",
      title: "조건문",
      blocks: [
        md`
          ### if
          조건이 참일 때만 실행할 코드를 정한다. **조건 뒤에 콜론 \`:\`**, 실행할 코드는 **들여쓰기(공백 4칸)** 한다.
          들여쓰기가 같은 줄들이 한 묶음(블록)이다. 실행할 때마다 다른 값을 입력해 결과가 어떻게 바뀌는지 본다.
          조건에서 같은지 비교할 때는 \`==\` 를 쓴다. \`=\` 하나를 쓰면 \`SyntaxError\` 가 난다.
        `,
        task(`정수를 입력받아 양수일 때만 "양수" 출력하기 (5, -2 를 입력해 비교)`, py`
          n = int(input())
          if n > 0:
              print("양수")
        `, { sample: "5" }),
        md`
          ### if-else
          조건이 거짓일 때 실행할 코드는 \`else:\` 아래에 쓴다.
        `,
        task(`정수를 입력받아 짝수면 "짝수", 아니면 "홀수" 출력하기`, py`
          n = int(input())
          if n % 2 == 0:
              print("짝수")
          else:
              print("홀수")
        `, { sample: "7" }),
        md`
          ### if-elif-else
          조건이 여러 개면 \`elif\` 로 이어 간다. **위에서부터 처음 참인 조건 하나만** 실행된다.
        `,
        task(`점수를 입력받아 90 이상 "A", 80 이상 "B", 그 밖에는 "C" 출력하기`, py`
          score = int(input())
          if score >= 90:
              print("A")
          elif score >= 80:
              print("B")
          else:
              print("C")
        `, { sample: "85" }),
        task(`실행해서 IndentationError 를 확인한 뒤, 들여쓰기를 넣어 고치기`, py`
          n = 4
          if n % 2 == 0:
              print("짝수")
        `, { given: py`
          n = 4
          if n % 2 == 0:
          print("짝수")
        `, fix: true }),
        md`
          ### 조건의 순서
          \`elif\` 는 위에서부터 검사하므로 **범위가 좁은 조건을 먼저** 쓴다. \`score >= 80\` 을 \`score >= 90\` 보다 먼저 쓰면 95 점도 "B" 가 된다.
        `,
        task(`95 를 입력하면 "B" 가 나오는 이유를 확인하고, 조건 순서를 바꿔 "A" 가 나오게 고치기`, py`
          score = int(input())
          if score >= 90:
              print("A")
          elif score >= 80:
              print("B")
          else:
              print("C")
        `, { given: py`
          score = int(input())
          if score >= 80:
              print("B")
          elif score >= 90:
              print("A")
          else:
              print("C")
        `, fix: true, sample: "95" }),
        md`
          ### if 안의 if
          조건문 안에 조건문을 또 쓸 수 있다. 안쪽 \`if\` 는 한 번 더 들여 쓴다.
        `,
        task(`정수를 입력받아 양수이면 짝수인지 홀수인지까지 출력하고, 양수가 아니면 "양수 아님" 출력하기`, py`
          n = int(input())
          if n > 0:
              if n % 2 == 0:
                  print("양수 짝수")
              else:
                  print("양수 홀수")
          else:
              print("양수 아님")
        `, { sample: "8" }),
        md`
          ### 조건 여러 개 묶기
          \`and\`, \`or\` 로 조건을 묶는다. "13 이상 19 이하" 는 \`age >= 13 and age <= 19\` 또는 \`13 <= age <= 19\` 로 쓴다.
        `,
        task(`나이를 입력받아 13 이상 19 이하면 "청소년", 아니면 "청소년 아님" 출력하기`, py`
          age = int(input())
          if 13 <= age <= 19:
              print("청소년")
          else:
              print("청소년 아님")
        `, { sample: "15" }),
        ex({
          title: "양수, 음수, 0",
          prompt: md`
            정수를 입력받아 양수이면 \`양수\`, 음수이면 \`음수\`, 0 이면 \`0\` 출력하기.
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
          sample: "-3",
        }),
        ex({
          title: "더 큰 수",
          prompt: md`
            두 정수를 한 줄에 하나씩 입력받아 더 큰 수 출력하기. 같으면 \`같음\` 출력하기.
          `,
          answer: py`
            a = int(input())
            b = int(input())
            if a > b:
                print(a)
            elif a < b:
                print(b)
            else:
                print("같음")
          `,
          sample: "8\n13",
        }),
        ex({
          title: "3 과 5 의 배수",
          prompt: md`
            정수를 입력받아 3 과 5 의 공배수이면 \`공배수\`, 3 의 배수만이면 \`3의 배수\`, 5 의 배수만이면 \`5의 배수\`, 둘 다 아니면 \`아님\` 출력하기.
          `,
          answer: py`
            n = int(input())
            if n % 3 == 0 and n % 5 == 0:
                print("공배수")
            elif n % 3 == 0:
                print("3의 배수")
            elif n % 5 == 0:
                print("5의 배수")
            else:
                print("아님")
          `,
          sample: "30",
        }),
      ],
    },
    // ─────────────────────────────── 9
    {
      id: "s1-for",
      title: "반복문 for 와 range()",
      blocks: [
        md`
          ### for 변수 in range(n)
          \`for i in range(n):\` 아래 들여 쓴 코드를 **n 번** 반복한다. 콜론과 들여쓰기는 조건문과 같다.
        `,
        task(`"안녕" 을 5 번 출력하기`, py`
          for i in range(5):
              print("안녕")
        `),
        md`
          ### range(끝)
          \`range(n)\` 은 **0 부터 n-1 까지**의 수를 차례로 만든다. 반복할 때마다 그 수가 \`i\` 에 들어간다. **끝 수는 포함하지 않는다.**
        `,
        task(`range(10) 의 i 를 한 줄에 출력하기 (결과: 0 1 2 … 9)`, py`
          for i in range(10):
              print(i, end=" ")
        `),
        md`
          ### range(시작, 끝)
          \`range(1, 11)\` 은 1 부터 10 까지이다. 끝 수 11 은 들어가지 않는다.
          반복할 때마다 값을 받는 변수 이름(\`i\`)은 마음대로 지어도 된다.
        `,
        task(`1 부터 10 까지 한 줄에 출력하기`, py`
          for i in range(1, 11):
              print(i, end=" ")
        `),
        task(`5 부터 9 까지 한 줄에 출력하기`, py`
          for i in range(5, 10):
              print(i, end=" ")
        `),
        md`
          ### range(시작, 끝, 간격)
          세 번째 값은 **몇씩 건너뛸지**이다. \`range(0, 11, 2)\` → 0, 2, 4, 6, 8, 10
        `,
        task(`0 부터 10 까지의 짝수 출력하기 (range 의 간격 사용)`, py`
          for i in range(0, 11, 2):
              print(i, end=" ")
        `),
        task(`1 부터 9 까지의 홀수 출력하기`, py`
          for i in range(1, 10, 2):
              print(i, end=" ")
        `),
        task(`3 부터 30 까지의 3 의 배수 출력하기`, py`
          for i in range(3, 31, 3):
              print(i, end=" ")
        `),
        md`
          ### 거꾸로 세기
          간격을 **음수**로 주면 줄어든다. \`range(10, -1, -1)\` → 10, 9, … 0 (끝 -1 은 들어가지 않으므로 0 까지)
          간격이 양수인데 시작이 끝보다 크거나 같으면(\`range(5, 1)\`) **한 번도 반복하지 않는다**.
        `,
        task(`10 부터 0 까지 거꾸로 출력하기`, py`
          for i in range(10, -1, -1):
              print(i, end=" ")
        `),
        task(`range(5, 1) 로 반복해 아무것도 출력되지 않는 것을 확인한 뒤, 반복이 끝나면 "끝" 출력하기`, py`
          for i in range(5, 1):
              print(i)
          print("끝")
        `),
        task(`5 4 3 2 1 출력하기`, py`
          for i in range(5, 0, -1):
              print(i, end=" ")
        `),
        md`
          ### for 변수 in 자료
          \`for 변수 in 문자열\` 은 한 글자씩, \`for 변수 in 리스트\` 는 원소를 하나씩 꺼낸다.
        `,
        task(`"ABC" 를 한 글자씩 한 줄에 하나씩 출력하기`, py`
          for ch in "ABC":
              print(ch)
        `),
        task(`리스트 [3, 5, 7] 의 원소를 하나씩 꺼내 10 배 한 값 출력하기`, py`
          for x in [3, 5, 7]:
              print(x * 10)
        `),
        md`
          ### 반복하며 합 구하기
          **합을 담을 변수를 0 으로 만들고**, 반복할 때마다 더한다. 반복이 끝난 뒤 출력하려면 \`print()\` 를 **들여쓰지 않는다**.
        `,
        task(`1 부터 10 까지의 합 출력하기 (결과: 55)`, py`
          total = 0
          for i in range(1, 11):
              total += i
          print(total)
        `),
        task(`print 를 반복문 안으로 들여 써서, 1 부터 5 까지 더해지는 과정을 한 줄씩 출력하기 (1 3 6 10 15)`, py`
          total = 0
          for i in range(1, 6):
              total += i
              print(total)
        `),
        task(`리스트 [3, 5, 7] 의 합 출력하기`, py`
          total = 0
          for x in [3, 5, 7]:
              total += x
          print(total)
        `),
        md`
          ### 문자열 반복으로 모양 만들기
          \`"*" * i\` 를 반복문 안에서 쓰면 줄마다 개수가 달라진다. STEP3 별 그리기의 기본 모양이다.
        `,
        task(`별을 1 개부터 4 개까지 늘려 가며 네 줄 출력하기`, py`
          for i in range(1, 5):
              print("*" * i)
        `),
        ex({
          title: "빈칸 채우기 · 짝수만 출력",
          prompt: md`
            1 부터 20 까지의 짝수만 한 줄에 출력하도록 빈칸 \`____\` 채우기.
          `,
          starter: py`
            for i in range(____):
                print(i, end=" ")
          `,
          answer: py`
            for i in range(2, 21, 2):
                print(i, end=" ")
          `,
        }),
        ex({
          title: "1 부터 n 까지의 합",
          prompt: md`
            자연수 n 을 입력받아 1 부터 n 까지의 합 출력하기. (10 → \`55\`)
          `,
          answer: py`
            n = int(input())
            total = 0
            for i in range(1, n + 1):
                total += i
            print(total)
          `,
          sample: "10",
        }),
        ex({
          title: "구구단 n 단",
          prompt: md`
            n 을 입력받아 \`3 x 1 = 3\` 부터 \`3 x 9 = 27\` 처럼 n 단 출력하기. (f-문자열 사용)
          `,
          answer: py`
            n = int(input())
            for i in range(1, 10):
                print(f"{n} x {i} = {n * i}")
          `,
          sample: "3",
        }),
      ],
    },
    // ─────────────────────────────── 10
    {
      id: "s1-while",
      title: "반복문 while",
      blocks: [
        md`
          ### while
          조건이 **참인 동안** 계속 반복한다. 반복 안에서 조건에 쓰인 값이 바뀌지 않으면 끝나지 않는다(무한 반복). 이 페이지는 10 초가 지나면 자동으로 멈춘다.
          반복 횟수나 범위를 미리 알면 \`for\`, "어떤 조건이 될 때까지" 반복하면 \`while\` 이 편하다.
        `,
        task(`n 이 100 보다 작은 동안 2 배씩 키운 뒤 n 출력하기 (결과: 128)`, py`
          n = 1
          while n < 100:
              n = n * 2
          print(n)
        `),
        task(`while 로 10 부터 1 까지 거꾸로 한 줄에 출력하기`, py`
          n = 10
          while n >= 1:
              print(n, end=" ")
              n -= 1
        `),
        ex({
          title: "자릿수 세기",
          prompt: md`
            자연수를 입력받아 10 으로 계속 나누면서(\`//= 10\`) 몇 자리 수인지 출력하기. (12345 → \`5\`)
          `,
          answer: py`
            n = int(input())
            count = 0
            while n > 0:
                n //= 10
                count += 1
            print(count)
          `,
          sample: "12345",
        }),
      ],
    },
  ],
};
