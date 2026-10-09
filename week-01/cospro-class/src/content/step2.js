// STEP2 · 자료형별 기본 기능과 반복문 활용 (2시간)
// sum/max/min/abs 같은 내장 함수는 STEP3 에서 배우고, 여기서는 반복문·조건문으로 직접 구한다.
// (3급 빈칸 문제는 바로 이 로직의 한 줄을 비워 두는 경우가 많다)
// 여러 값을 한 줄로 입력받는 것(split)은 STEP3. 여기서는 데이터를 코드 안에서 주고,
// 조건문을 여러 값으로 시험해 볼 문제만 input() / int(input()) 으로 한 값씩 받는다.
import { code, ex, md, py, task } from "./blocks";

export default {
  n: 2,
  title: "자료형별 기본 기능과 반복문 활용",
  summary: ["문자열과 리스트의 기본 기능(메서드)", "자료형과 내장 함수", "시퀀스 자료형과 반복문", "조건문과 반복문 결합 활용"],
  topics: [
    // ─────────────────────────────── 1
    {
      id: "s2-str",
      title: "문자열의 기본 기능",
      blocks: [
        md`
          ### len()
          \`len(값)\` 은 문자열의 **글자 수**, 리스트의 **원소 개수**를 알려 주는 내장 함수이다. 공백도 한 글자로 센다.
        `,
        task(`"Hello World" 의 글자 수 출력하기 (결과: 11)`, py`print(len("Hello World"))`),
        task(`변수 s 의 글자 수 출력하기`, py`print(len(s))`, { given: py`s = "파이썬 기초"` }),
        md`
          ### 문자열 메서드
          **메서드**는 값 뒤에 점을 찍고 부르는 기능이다. \`값.기능()\`
          문자열 메서드는 **원래 문자열을 바꾸지 않고**, 결과를 새 값으로 돌려준다. 바뀐 값을 쓰려면 출력하거나 변수에 다시 저장한다.

          | 메서드 | 하는 일 | 돌려주는 값 |
          |---|---|---|
          | \`upper()\` / \`lower()\` | 영문자를 대문자로 / 소문자로 (다른 글자는 그대로) | 새 문자열 |
          | \`replace(a, b)\` | a 를 모두 b 로 바꿈 | 새 문자열 |
          | \`count(x)\` | x 가 몇 번 나오는지 (겹치지 않게 셈) | 정수 |
          | \`split()\` | 공백을 기준으로 나눔 (공백이 여러 칸이어도 하나로 봄) | 리스트 |
        `,
        task(`s 를 모두 대문자로 출력하기`, py`print(s.upper())`, { given: py`s = "Hello World"` }),
        task(`s 를 모두 소문자로 출력하기`, py`print(s.lower())`, { given: py`s = "Hello World"` }),
        task(`s.upper() 를 실행한 뒤 s 를 출력해, 원래 문자열이 그대로인지 확인하기`, py`
          s.upper()
          print(s)
        `, { given: py`s = "Hello World"` }),
        task(`s 를 대문자로 바꾼 결과를 s 에 다시 저장하고 출력하기`, py`
          s = s.upper()
          print(s)
        `, { given: py`s = "Hello World"` }),
        task(`s 의 "o" 를 모두 "0" 으로 바꿔 출력하기`, py`print(s.replace("o", "0"))`, { given: py`s = "Hello World"` }),
        task(`s 의 공백을 모두 지워 출력하기 (공백 " " 을 빈 문자열 "" 로 바꾸기)`, py`print(s.replace(" ", ""))`, { given: py`s = "Hello World"` }),
        task(`s 에 "l" 이 몇 번 나오는지 출력하기`, py`print(s.count("l"))`, { given: py`s = "Hello World"` }),
        task(`"banana" 에 "an" 이 몇 번 나오는지 출력하기`, py`print("banana".count("an"))`),
        task(`s 를 공백으로 나눈 리스트 출력하기`, py`print(s.split())`, { given: py`s = "사과 배 감"` }),
        task(`s 를 나눈 리스트의 원소 개수 출력하기`, py`print(len(s.split()))`, { given: py`s = "사과 배 감"` }),
        md`
          \`split()\` 괄호 안에 글자를 넣으면 공백 대신 **그 글자를 기준으로** 나눈다. (\`"2026-10-10".split("-")\` → \`['2026', '10', '10']\`)
        `,
        task(`d 를 "-" 기준으로 나눈 리스트 출력하기`, py`print(d.split("-"))`, { given: py`d = "2026-10-10"` }),
        md`
          ### 문자열 한 글자 바꾸기
          \`s[0]\` 으로 꺼내 볼 수는 있지만, \`s[0] = "J"\` 처럼 **한 글자만 바꿀 수는 없다**(\`TypeError\`). 바꾸려면 새 문자열을 만들어 다시 저장한다.
        `,
        task(`실행해서 TypeError 를 확인한 뒤, 슬라이싱으로 새 문자열을 만들어 "Java" 출력하기`, py`
          s = "Hava"
          s = "J" + s[1:]
          print(s)
        `, { given: py`
          s = "Hava"
          s[0] = "J"
          print(s)
        `, fix: true }),
        md`
          ### in, not in
          \`x in 문자열\` 은 x 가 들어 있으면 \`True\`, 없으면 \`False\` 이다. 반대로 "들어 있지 않은지" 는 \`x not in 문자열\` 로 쓴다. (리스트에도 똑같이 쓴다)
        `,
        task(`"a" 가 "cat" 에 들어 있는지 출력하기`, py`print("a" in "cat")`),
        task(`"dog" 가 s 에 들어 있는지 출력하기`, py`print("dog" in s)`, { given: py`s = "I love cats"` }),
        task(`"z" 가 s 에 들어 있지 않은지 출력하기 (not in)`, py`print("z" not in s)`, { given: py`s = "I love cats"` }),
        ex({
          title: "이름 대문자로",
          prompt: md`
            영어 이름을 입력받아 모두 대문자로 바꾼 이름과 글자 수를 한 줄에 출력하기. (minji → \`MINJI 5\`)
          `,
          answer: py`
            name = input()
            print(name.upper(), len(name))
          `,
          sample: "minji",
        }),
        ex({
          title: "단어 개수와 공백 개수",
          prompt: md`
            문장을 입력받아 단어 개수와 공백 개수를 한 줄에 출력하기. (단어는 공백 하나로 구분)
          `,
          answer: py`
            s = input()
            print(len(s.split()), s.count(" "))
          `,
          sample: "I like python very much",
        }),
        ex({
          title: "k 의 개수",
          prompt: md`
            문자열을 입력받아 소문자로 바꾼 뒤, \`k\` 가 몇 개인지 출력하기. (소문자로 바꾸면 대문자 K 도 함께 세어진다)
          `,
          answer: py`
            s = input()
            print(s.lower().count("k"))
          `,
          sample: "KaKao Kim",
        }),
      ],
    },
    // ─────────────────────────────── 2
    {
      id: "s2-list",
      title: "리스트의 기본 기능",
      blocks: [
        md`
          ### 리스트 값 바꾸기
          리스트는 인덱스로 꺼낼 수 있고, \`nums[0] = 99\` 처럼 **그 자리의 값을 바꿀 수 있다**. (문자열은 바꿀 수 없다)
        `,
        task(`nums 의 첫 번째 값을 99 로 바꾼 뒤 nums 출력하기`, py`
          nums[0] = 99
          print(nums)
        `, { given: py`nums = [5, 2, 8]` }),
        md`
          ### 리스트 메서드
          문자열과 달리, 아래 위쪽 다섯 메서드는 **리스트 자체를 바꾼다**. \`index\`, \`count\` 는 바꾸지 않고 값만 알려 준다.

          | 메서드 | 하는 일 |
          |---|---|
          | \`append(x)\` | 맨 뒤에 x 추가 |
          | \`insert(i, x)\` | i 위치에 x 끼워 넣기 |
          | \`remove(x)\` | 처음 나오는 x 하나 지우기 (없으면 \`ValueError\`) |
          | \`pop()\` / \`pop(i)\` | 맨 뒤 값 / i 위치 값을 꺼내 돌려주고 지우기 |
          | \`sort()\` / \`sort(reverse=True)\` | 작은 순 / 큰 순 정렬 |
          | \`index(x)\` / \`count(x)\` | x 가 처음 나오는 위치 / x 의 개수 |
        `,
        task(`nums 맨 뒤에 1 을 추가하고 출력하기`, py`
          nums.append(1)
          print(nums)
        `, { given: py`nums = [5, 2, 8]` }),
        task(`nums 맨 앞(인덱스 0)에 9 를 끼워 넣고 출력하기`, py`
          nums.insert(0, 9)
          print(nums)
        `, { given: py`nums = [5, 2, 8]` }),
        task(`nums 에서 2 를 지우고 출력하기`, py`
          nums.remove(2)
          print(nums)
        `, { given: py`nums = [5, 2, 8]` }),
        task(`pop() 으로 맨 뒤 값을 꺼내 last 에 저장한 뒤, last 와 nums 출력하기`, py`
          last = nums.pop()
          print(last, nums)
        `, { given: py`nums = [5, 2, 8]` }),
        task(`nums 를 작은 순으로 정렬해 출력하기`, py`
          nums.sort()
          print(nums)
        `, { given: py`nums = [5, 2, 8, 1]` }),
        md`
          \`sort()\` 는 리스트를 바꾸기만 하고 **결과를 돌려주지 않는다**(\`None\`). \`nums = nums.sort()\` 라고 쓰면 nums 가 \`None\` 이 되어 버린다.
        `,
        task(`실행해서 None 이 나오는 것을 확인한 뒤, 정렬된 리스트가 출력되게 고치기`, py`
          nums = [5, 2, 8, 1]
          nums.sort()
          print(nums)
        `, { given: py`
          nums = [5, 2, 8, 1]
          nums = nums.sort()
          print(nums)
        `, fix: true }),
        task(`nums 를 큰 순으로 정렬해 출력하기`, py`
          nums.sort(reverse=True)
          print(nums)
        `, { given: py`nums = [5, 2, 8, 1]` }),
        task(`nums 에서 8 의 위치(인덱스) 출력하기`, py`print(nums.index(8))`, { given: py`nums = [5, 2, 8, 1]` }),
        task(`nums 에 5 가 몇 개 있는지 출력하기`, py`print(nums.count(5))`, { given: py`nums = [5, 2, 5, 1, 5]` }),
        task(`7 이 nums 에 들어 있는지 출력하기`, py`print(7 in nums)`, { given: py`nums = [5, 2, 8, 1]` }),
        ex({
          title: "빈 리스트 채우기",
          prompt: md`
            빈 리스트 \`squares\` 에 1 부터 5 까지 각 수의 제곱을 \`append()\` 로 넣고 출력하기. (결과: \`[1, 4, 9, 16, 25]\`)
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
        ex({
          title: "정렬해서 가장 작은 값과 큰 값",
          prompt: md`
            \`scores = [72, 95, 88, 64, 81]\` 을 작은 순으로 정렬한 뒤, **인덱스로** 가장 작은 점수와 가장 큰 점수를 출력하기.
          `,
          starter: py`
            scores = [72, 95, 88, 64, 81]
          `,
          answer: py`
            scores = [72, 95, 88, 64, 81]
            scores.sort()
            print(scores[0], scores[-1])
          `,
        }),
        ex({
          title: "입력한 값을 리스트에",
          prompt: md`
            빈 리스트를 만들고, 정수 세 개를 **한 줄에 하나씩** 입력받아 차례로 추가한 뒤 리스트 출력하기.
          `,
          answer: py`
            nums = []
            for i in range(3):
                nums.append(int(input()))
            print(nums)
          `,
          sample: "4\n9\n2",
        }),
      ],
    },
    // ─────────────────────────────── 3
    {
      id: "s2-seq",
      title: "시퀀스 자료형과 반복문",
      blocks: [
        md`
          ### 시퀀스
          문자열, 리스트, \`range()\` 처럼 순서가 있는 자료형을 **시퀀스**라고 한다. 모두 \`for\` 로 하나씩 꺼낼 수 있다.
        `,
        task(`fruits 의 원소를 한 줄에 하나씩 출력하기`, py`
          for f in fruits:
              print(f)
        `, { given: py`fruits = ["사과", "배", "감"]` }),
        md`
          ### for i in range(len(자료))
          위치 번호도 필요하면 \`for i in range(len(리스트))\` 로 반복하고 \`리스트[i]\` 로 꺼낸다.
        `,
        task(`fruits 의 인덱스와 값을 한 줄에 하나씩 출력하기 (0 사과 / 1 배 / 2 감)`, py`
          for i in range(len(fruits)):
              print(i, fruits[i])
        `, { given: py`fruits = ["사과", "배", "감"]` }),
        task(`arr 의 짝수 인덱스(0, 2, 4 …) 원소만 출력하기`, py`
          for i in range(0, len(arr), 2):
              print(arr[i])
        `, { given: py`arr = [10, 20, 30, 40, 50]` }),
        md`
          ### 반복 결과 한 줄 출력
          반복문 안에서 \`print()\` 를 그냥 쓰면 한 줄에 하나씩 나온다. **한 줄에 이어서** 출력하려면 \`end\` 를 쓴다.

          | 하고 싶은 것 | 코드 | 결과 |
          |---|---|---|
          | 반복하며 공백으로 이어서 | \`print(x, end=" ")\` | \`1 2 3\` |
          | 리스트를 한 번에 공백으로 | \`print(*nums)\` | \`1 2 3\` |
          | 리스트를 한 번에 다른 글자로 | \`print(*nums, sep=",")\` | \`1,2,3\` |

          \`print(*nums)\` 의 \`*\` 는 리스트를 **풀어서 값을 하나씩** 넘긴다는 뜻이다. \`print(1, 2, 3)\` 과 같다.
          \`print(nums)\` 는 \`[1, 2, 3]\` 처럼 대괄호까지 나온다. 반복이 끝난 뒤 \`print()\` 를 한 번 쓰면 줄이 바뀐다.
        `,
        task(`nums 의 원소를 10 배 해서 한 줄에 출력하기 (결과: 10 20 30)`, py`
          for n in nums:
              print(n * 10, end=" ")
        `, { given: py`nums = [1, 2, 3]` }),
        task(`print(*nums) 로 nums 를 대괄호 없이 한 줄에 출력하기`, py`print(*nums)`, { given: py`nums = [1, 2, 3]` }),
        task(`nums 를 쉼표로 이어 출력하기 (결과: 1,2,3)`, py`print(*nums, sep=",")`, { given: py`nums = [1, 2, 3]` }),
        task(`"ABC" 의 글자를 한 줄에 공백으로 띄어 출력한 뒤, 줄을 바꿔 "끝" 출력하기`, py`
          for ch in "ABC":
              print(ch, end=" ")
          print()
          print("끝")
        `),
        md`
          ### 반복하면서 개수 세기
          **변수를 0 으로 만들어 두고, 조건에 맞을 때마다 1 씩 더하는** 패턴이다. 3급 문제 대부분이 이 모양이다.
        `,
        task(`s 에 "a" 가 몇 개인지 반복문으로 세어 출력하기 (count() 없이)`, py`
          count = 0
          for ch in s:
              if ch == "a":
                  count += 1
          print(count)
        `, { given: py`s = "banana"` }),
        task(`nums 에서 50 보다 큰 수가 몇 개인지 출력하기`, py`
          count = 0
          for n in nums:
              if n > 50:
                  count += 1
          print(count)
        `, { given: py`nums = [35, 72, 50, 91, 18, 66]` }),
        ex({
          title: "k 부터 3 씩 n 개",
          prompt: md`
            \`k = 7\`, \`n = 5\` 일 때 k 에서 시작해 3 씩 더한 수 n 개를 한 줄에 출력하기. (결과: \`7 10 13 16 19\`)
          `,
          starter: py`
            k = 7
            n = 5
          `,
          answer: py`
            k = 7
            n = 5
            for i in range(n):
                print(k + 3 * i, end=" ")
          `,
        }),
        ex({
          title: "짝수 번째 원소의 합",
          prompt: md`
            리스트 \`arr\` 의 **두 번째, 네 번째, …** 원소(인덱스 1, 3, 5 …)의 합 출력하기.
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
        ex({
          title: "모음 개수",
          prompt: md`
            문자열을 입력받아 모음(a, e, i, o, u)이 몇 개인지 출력하기. (\`ch in "aeiou"\` 사용)
          `,
          answer: py`
            s = input()
            count = 0
            for ch in s:
                if ch in "aeiou":
                    count += 1
            print(count)
          `,
          sample: "education",
        }),
        ex({
          title: "글자 사이에 - 넣기",
          prompt: md`
            단어를 입력받아 글자 사이에 \`-\` 를 넣어 한 줄에 출력하기. (python → \`p-y-t-h-o-n\`)
          `,
          answer: py`
            word = input()
            for i in range(len(word)):
                if i < len(word) - 1:
                    print(word[i], end="-")
                else:
                    print(word[i])
          `,
          sample: "python",
        }),
      ],
    },
    // ─────────────────────────────── 4
    {
      id: "s2-logic",
      title: "로직으로 직접 구하기 (합계·최댓값·절댓값·배수·문자 판별)",
      blocks: [
        md`
          ### 직접 구하는 이유
          파이썬에는 \`sum()\`, \`max()\`, \`abs()\` 같은 함수가 있지만(STEP3), 3급 **빈칸 문제**는 이 값을 **반복문과 조건문으로 직접 구하는 코드**의 한 줄을 비워 두는 경우가 많다. 아래 패턴은 눈에 익을 때까지 연습한다. \`____\` 는 빈칸이다.

          ### 합계와 평균
          합을 담을 변수를 **0** 으로 시작하고, 반복하며 더한다. 평균은 합 ÷ 개수이다.
        `,
        task(`scores 의 합계 출력하기`, py`
          total = 0
          for s in scores:
              total += s
          print(total)
        `, { given: py`scores = [80, 95, 72, 88]` }),
        task(`scores 의 평균 출력하기 (합계 ÷ len(scores))`, py`
          total = 0
          for s in scores:
              total += s
          print(total / len(scores))
        `, { given: py`scores = [80, 95, 72, 88]` }),
        md`
          ### 최댓값과 최솟값
          **첫 값을 기준으로 두고**, 더 큰 값(최솟값이면 더 작은 값)을 만나면 기준을 바꾼다.
          기준을 \`0\` 으로 두면 안 된다. 음수만 있는 리스트에서는 0 보다 큰 값이 없어서 답이 0 으로 나온다. (기출 "한 줄 고치기" 에 나오는 실수)
        `,
        task(`nums 의 가장 큰 값 출력하기`, py`
          best = nums[0]
          for x in nums:
              if x > best:
                  best = x
          print(best)
        `, { given: py`nums = [12, 45, 7, 33]` }),
        task(`nums 의 가장 작은 값 출력하기`, py`
          low = nums[0]
          for x in nums:
              if x < low:
                  low = x
          print(low)
        `, { given: py`nums = [12, 45, 7, 33]` }),
        task(`실행해서 답이 0 으로 나오는 것을 확인한 뒤, 한 줄만 고쳐 가장 큰 값 -2 가 나오게 하기`, py`
          nums = [-5, -2, -8]
          best = nums[0]
          for x in nums:
              if x > best:
                  best = x
          print(best)
        `, { given: py`
          nums = [-5, -2, -8]
          best = 0
          for x in nums:
              if x > best:
                  best = x
          print(best)
        `, fix: true }),
        md`
          ### 절댓값
          음수이면 \`-1\` 을 곱해 양수로 바꾼다. (0 과 양수는 그대로)
        `,
        task(`정수를 입력받아 절댓값 출력하기 (-25, 7 을 넣어 확인)`, py`
          n = int(input())
          if n < 0:
              n = n * -1
          print(n)
        `, { sample: "-25" }),
        md`
          ### 배수와 공배수
          **n 이 k 의 배수** ⇔ \`n % k == 0\`
          **c 가 a 와 b 의 공배수** ⇔ \`c % a == 0 and c % b == 0\` ("a **또는** b 의 배수"면 \`or\`)
        `,
        task(`정수를 입력받아 7 의 배수이면 "YES", 아니면 "NO" 출력하기`, py`
          n = int(input())
          if n % 7 == 0:
              print("YES")
          else:
              print("NO")
        `, { sample: "21" }),
        task(`1 부터 30 까지 2 와 3 의 공배수를 한 줄에 출력하기`, py`
          for i in range(1, 31):
              if i % 2 == 0 and i % 3 == 0:
                  print(i, end=" ")
        `),
        md`
          ### 대문자·소문자·숫자 판별
          글자도 \`<\`, \`>\` 로 크기를 비교할 수 있다. 글자마다 번호가 있고, \`'0'\`~\`'9'\`, \`'A'\`~\`'Z'\`, \`'a'\`~\`'z'\` 가 각각 차례대로 붙어 있기 때문이다.
          파이썬은 비교를 이어서 쓸 수 있어서 "**A 이상이고 Z 이하**" 를 \`'A' <= ch <= 'Z'\` 처럼 쓴다.

          | 조건 | 뜻 |
          |---|---|
          | \`'A' <= ch <= 'Z'\` | ch 가 대문자 |
          | \`'a' <= ch <= 'z'\` | ch 가 소문자 |
          | \`'0' <= ch <= '9'\` | ch 가 숫자 |

          번호는 숫자 → 대문자 → 소문자 순서라서, 대문자가 소문자보다 작다. (\`'Z' < 'a'\` 는 \`True\`)
        `,
        task(`"aZ5?" 의 각 글자가 대문자인지 한 줄에 하나씩 출력하기`, py`
          for ch in "aZ5?":
              print(ch, 'A' <= ch <= 'Z')
        `),
        task(`글자 하나를 입력받아 소문자이면 "소문자", 아니면 "아님" 출력하기`, py`
          ch = input()
          if 'a' <= ch <= 'z':
              print("소문자")
          else:
              print("아님")
        `, { sample: "g" }),
        md`
          ### 문자열 크기 비교
          문자열끼리 \`<\`, \`>\` 로 비교하면 **첫 글자부터 차례로** 비교한다. 영어사전에서 앞에 오는 단어가 더 작다. (\`"apple" < "banana"\` 는 \`True\`)
          기출 "영어사전 순 비교" 에 나온다.
        `,
        task(`"apple" 이 "banana" 보다 작은지 출력하기`, py`print("apple" < "banana")`),
        task(`두 단어를 한 줄에 하나씩 입력받아 영어사전 순으로 뒤에 오는 단어 출력하기`, py`
          a = input()
          b = input()
          if a > b:
              print(a)
          else:
              print(b)
        `, { sample: "yellow\ngreen" }),
        ex({
          title: "빈칸 채우기 · 합계와 평균",
          prompt: md`
            점수 리스트 \`scores\` 의 합계와 평균을 출력하는 코드의 빈칸 채우기.
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
            리스트 \`nums\` 에서 가장 작은 수를 찾는 코드의 빈칸 채우기.
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
          title: "빈칸 채우기 · 대문자 개수",
          prompt: md`
            문자열 \`s\` 의 대문자 개수를 출력하는 코드의 빈칸을 **비교 연산자로** 채우기.
          `,
          starter: py`
            s = "Hello Python World"
            count = 0
            for ch in s:
                if ____:
                    count += 1
            print(count)
          `,
          answer: py`
            s = "Hello Python World"
            count = 0
            for ch in s:
                if 'A' <= ch <= 'Z':
                    count += 1
            print(count)
          `,
        }),
        ex({
          title: "절댓값이 더 큰 수",
          prompt: md`
            두 정수를 한 줄에 하나씩 입력받아 절댓값이 더 큰 **원래 수** 출력하기. 같으면 \`same\` 출력하기. (\`abs()\` 없이)
          `,
          answer: py`
            a = int(input())
            b = int(input())
            abs_a = a
            abs_b = b
            if a < 0:
                abs_a = a * -1
            if b < 0:
                abs_b = b * -1
            if abs_a > abs_b:
                print(a)
            elif abs_a < abs_b:
                print(b)
            else:
                print("same")
          `,
          sample: "-10\n5",
        }),
        ex({
          title: "공배수 판별",
          prompt: md`
            세 정수 a, b, c 를 한 줄에 하나씩 입력받아 c 가 a 와 b 의 공배수이면 \`True\`, 아니면 \`False\` 출력하기.
          `,
          answer: py`
            a = int(input())
            b = int(input())
            c = int(input())
            if c % a == 0 and c % b == 0:
                print("True")
            else:
                print("False")
          `,
          sample: "4\n6\n24",
        }),
        ex({
          title: "글자 종류 판별",
          prompt: md`
            글자 하나를 입력받아 대문자면 \`대문자\`, 소문자면 \`소문자\`, 숫자면 \`숫자\`, 그 밖에는 \`기호\` 출력하기. (비교 연산자 사용)
          `,
          answer: py`
            ch = input()
            if 'A' <= ch <= 'Z':
                print("대문자")
            elif 'a' <= ch <= 'z':
                print("소문자")
            elif '0' <= ch <= '9':
                print("숫자")
            else:
                print("기호")
          `,
          sample: "Q",
        }),
        ex({
          title: "소문자와 숫자 세기",
          prompt: md`
            비밀번호를 입력받아 소문자 개수와 숫자 개수를 한 줄에 출력하기. (Class2026!go → \`6 4\`)
          `,
          answer: py`
            password = input()
            lower = 0
            digit = 0
            for ch in password:
                if 'a' <= ch <= 'z':
                    lower += 1
                elif '0' <= ch <= '9':
                    digit += 1
            print(lower, digit)
          `,
          sample: "Class2026!go",
        }),
        ex({
          title: "윤년 판별",
          prompt: md`
            연도를 입력받아 윤년이면 \`윤년\`, 아니면 \`평년\` 출력하기.
            윤년: 4 로 나누어떨어지되 100 으로 나누어떨어지지 않는 해, 또는 400 으로 나누어떨어지는 해. (2024, 1900, 2000 으로 확인)
          `,
          answer: py`
            year = int(input())
            if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
                print("윤년")
            else:
                print("평년")
          `,
          sample: "2024",
        }),
      ],
    },
    // ─────────────────────────────── 5
    {
      id: "s2-break",
      title: "조건문과 반복문 결합 (break · continue)",
      blocks: [
        md`
          ### break
          \`break\` 를 만나면 반복을 **바로 끝내고** 반복문 다음 줄로 간다.
          \`while True:\` 는 조건이 늘 참이라 끝없이 반복하므로, 안에서 원하는 때에 \`break\` 로 끝낸다.
        `,
        task(`nums 를 차례로 출력하다가 음수를 만나면 "멈춤" 을 출력하고 끝내기`, py`
          for n in nums:
              if n < 0:
                  print("멈춤")
                  break
              print(n)
        `, { given: py`nums = [3, 8, -1, 5]` }),
        task(`while True 와 break 로 n 을 1 부터 늘려 가며 출력하다가 n 이 5 가 되면 끝내기`, py`
          n = 1
          while True:
              print(n, end=" ")
              if n == 5:
                  break
              n += 1
        `),
        md`
          ### continue
          \`continue\` 를 만나면 아래 코드를 건너뛰고 **다음 차례**로 간다.
        `,
        task(`1 부터 10 까지 출력하되 3 의 배수는 건너뛰기`, py`
          for i in range(1, 11):
              if i % 3 == 0:
                  continue
              print(i, end=" ")
        `),
        ex({
          title: "n 까지의 3 의 배수",
          prompt: md`
            n 을 입력받아 1 부터 n 까지 3 의 배수만 한 줄에 출력하기.
          `,
          answer: py`
            n = int(input())
            for i in range(1, n + 1):
                if i % 3 == 0:
                    print(i, end=" ")
          `,
          sample: "20",
        }),
        ex({
          title: "7 앞에 있는 숫자 개수",
          prompt: md`
            리스트 \`nums\` 에서 7 보다 **앞에** 있는 숫자가 몇 개인지 출력하기. (7 을 만나면 \`break\`)
          `,
          starter: py`
            nums = [14, 45, 50, 3, 7, 11, 5]
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
        ex({
          title: "0 이 나올 때까지 더하기",
          prompt: md`
            정수를 한 줄에 하나씩 계속 입력받다가 **0 이 들어오면 멈추고**, 그때까지 입력한 수의 합 출력하기. (\`while True\` 와 \`break\` 사용)
          `,
          answer: py`
            total = 0
            while True:
                n = int(input())
                if n == 0:
                    break
                total += n
            print(total)
          `,
          sample: "5\n8\n3\n0",
        }),
      ],
    },
    // ─────────────────────────────── 6
    {
      id: "s2-ternary",
      title: "조건부 표현식",
      blocks: [
        md`
          ### 값1 if 조건 else 값2
          조건이 참이면 **값1**, 거짓이면 **값2** 가 된다. 둘 중 하나를 고를 때 \`if/else\` 네 줄을 한 줄로 쓴다.
          (시험 코드에서 이 모양이 나오면 읽을 수 있으면 된다)
        `,
        task(`n 이 짝수면 "짝수", 아니면 "홀수" 를 조건부 표현식 한 줄로 출력하기`, py`print("짝수" if n % 2 == 0 else "홀수")`, { given: py`n = 10` }),
        task(`a 와 b 중 큰 값을 조건부 표현식으로 bigger 에 저장하고 출력하기`, py`
          bigger = a if a > b else b
          print(bigger)
        `, { given: py`
          a = 7
          b = 3
        ` }),
        ex({
          title: "합격 / 불합격",
          prompt: md`
            점수를 입력받아 60 점 이상이면 \`합격\`, 아니면 \`불합격\` 을 **조건부 표현식 한 줄로** 출력하기.
          `,
          answer: py`
            score = int(input())
            print("합격" if score >= 60 else "불합격")
          `,
          sample: "58",
        }),
      ],
    },
  ],
};
