/* AutoQuest — данные модулей курса (теория + задачи + домашние задания). */

const MODULES = [
    {
      id:'m1', num:1, phase:'База Python', title:'Первый код и переменные',
      desc:'print, переменные, типы данных, простые вычисления',
      theory: [
        '<code>print(...)</code> печатает в консоль то, что внутри скобок. Пример: <code>print("Hello")</code> → напечатает <code>Hello</code>, а <code>print(2 + 2)</code> → <code>4</code>. Это твой способ «увидеть» результат.',
        'Переменная — это подписанная коробка для значения: <code>name = "Anna"</code> кладёт строку в переменную <code>name</code>; дальше <code>print(name)</code> напечатает <code>Anna</code>. Значение можно перезаписать: <code>name = "Bob"</code>.',
        'Тип значения важен: <code>"5"</code> — это строка (текст), а <code>5</code> — число. Их нельзя напрямую складывать оператором <code>+</code>. Само число бывает целым — <code>5</code> (<code>int</code>) — и дробным — <code>5.0</code> (<code>float</code>).',
        'f-строка подставляет значения прямо в текст: <code>age = 30</code>; <code>print(f"Age: {age}")</code> → <code>Age: 30</code>. Внутри фигурных скобок можно даже вычислять: <code>f"{a + b}"</code> подставит сумму.',
        'Арифметика: <code>+ - * /</code> — как в математике, но <code>/</code> ВСЕГДА даёт дробное число: <code>10 / 2</code> → <code>5.0</code>. Ещё есть <code>//</code> — целочисленное деление (<code>7 // 2</code> → <code>3</code>), <code>%</code> — остаток (<code>7 % 2</code> → <code>1</code>) и <code>**</code> — степень. Остаток и целочисленное деление удобны, когда раскладываешь что-то по группам или страницам.',
        'Задания ниже — на английском (заодно тренируем язык). Они разного типа: написать код с нуля, дополнить, найти и починить ошибку, предсказать вывод и финальная задача-босс. Если английское условие непонятно — жми «Подсказка».'
      ],
      tasks:[
        {
          id:'m1-t1', title:'Your first output',
          goal:'Print exactly one line: <b>Hello, QA!</b>',
          hint:'<code>print()</code> shows in the console whatever you put inside the quotes. Nothing else is needed.',
          starter:
`# Task: print the line  Hello, QA!
# Use print("...")
`,
          check(out){
            const m = matchEn(out, 'Hello, QA!'); if(m) return m;
            if(!out.trim()) return {ok:false, msg:'Nothing was printed yet. Add a line like <code>print("Hello, QA!")</code> and check again.'};
            return {ok:false, msg:'Expected exactly <code>Hello, QA!</code> on one line — mind the capital letters, the comma and the exclamation mark.'};
          }
        },
        {
          id:'m1-t2', title:'Name and role',
          goal:'Set your name in the <code>name</code> variable, then print: <b>I am NAME, a QA engineer.</b>',
          hint:'A variable is a labeled box: <code>name = "Anna"</code>. Put the variable into text with an f-string: <code>f"I am {name}, ..."</code>.',
          starter:
`name = "???"   # put your name here, in quotes

# Task: print  I am <name>, a QA engineer.  using an f-string
`,
          check(out){
            const t = out.trim();
            if(t.includes('???')) return {ok:false, msg:'Looks like you did not replace <code>???</code> with your name in the <code>name</code> variable.'};
            const re = /^I am .+, a QA engineer\.$/;
            if(re.test(t)) return {ok:true};
            if(re.test(deCyr(t))) return {ok:false, msg:'Похоже, часть букв набрана в русской раскладке — они выглядят как английские, но Python видит другие символы. Переключи раскладку на английскую и набери заново.'};
            return {ok:false, msg:'The format must be exactly: <code>I am NAME, a QA engineer.</code> — check the comma, the spaces and the period at the end.'};
          }
        },
        {
          id:'m1-t3', title:'Predict: division result', kind:'predict',
          goal:'Do not run it yet. Read the code and type what it will print, then check yourself.',
          hint:'In Python <code>/</code> always gives a float — a number with a dot — even when it divides evenly.',
          code:
`print(10 / 2)
`
        },
        {
          id:'m1-t4', title:'Fix the typo (NameError)',
          goal:'This code crashes with a NameError. Fix it so it prints: <b>5</b>',
          hint:'A NameError means Python does not know that name. Compare the variable created on the first line with the name used on the second — they must match exactly.',
          starter:
`count = 5
print(cont)
`,
          check(out){
            const m = matchEn(out, '5'); if(m) return m;
            return {ok:false, msg:'Expected the number <code>5</code>. Make the name inside <code>print(...)</code> match the variable <code>count</code> exactly.'};
          }
        },
        {
          id:'m1-t5', title:'Total number of tests',
          goal:'A run had some passed and some failed tests. Print the total number of tests as one number.',
          hint:'The total is passed plus failed. Add the two variables and print the result.',
          starter:
`passed = 18
failed = 4

# Task: print the total number of tests (one number)
`,
          check(out){
            const m = matchEn(out, '22'); if(m) return m;
            return {ok:false, msg:'Expected <code>22</code> — the sum of <code>passed</code> and <code>failed</code>.'};
          }
        },
        {
          id:'m1-t6', title:'Items on the last page',
          goal:'We show 10 items per page. Print how many items are left on the last, not-full page.',
          hint:'The remainder operator <code>%</code> gives what is left over after grouping. Think 23 items by 10 per page.',
          starter:
`items = 23
per_page = 10

# Task: print how many items remain on the last incomplete page
# (use the remainder operator %)
`,
          check(out){
            const m = matchEn(out, '3'); if(m) return m;
            return {ok:false, msg:'Expected <code>3</code> — that is <code>items % per_page</code> (what is left after the full pages of 10).'};
          }
        },
        {
          id:'m1-t7', title:'Fix: text + number',
          goal:'This code tries to glue a string and a number with <code>+</code> and crashes (TypeError). Fix it with an f-string so it prints: <b>Age: 20</b>',
          hint:'You cannot add a string and a number with <code>+</code>. Use an f-string instead: <code>f"Age: {age}"</code>.',
          starter:
`age = 20
print("Age: " + age)
`,
          check(out){
            const m = matchEn(out, 'Age: 20'); if(m) return m;
            return {ok:false, msg:'Expected <code>Age: 20</code>. Rewrite the line as an f-string: <code>f"Age: {age}"</code>.'};
          }
        },
        {
          id:'m1-t8', title:'Predict: two kinds of division', kind:'predict',
          goal:'Read both lines and type the exact two-line output, then check yourself.',
          hint:'<code>//</code> is integer division (drops the fractional part), <code>/</code> is true division (always a float). One line will be a whole number, the other will have a dot.',
          code:
`print(7 // 2)
print(7 / 2)
`
        },
        {
          id:'m1-t9', title:'From text to number',
          goal:'A value arrived as text. Convert it to a number, add 8, and print the result.',
          hint:'<code>int("42")</code> turns the text <code>"42"</code> into the number 42. Then you can do math with it.',
          starter:
`raw = "42"

# Task: convert raw to a number, add 8, print the result
`,
          check(out){
            const m = matchEn(out, '50'); if(m) return m;
            return {ok:false, msg:'Expected <code>50</code> — convert <code>raw</code> with <code>int(...)</code>, then add 8.'};
          }
        },
        {
          id:'m1-t10', title:'Test run report', boss:true,
          goal:'Given <code>passed = 6</code> and <code>total = 8</code>, print a two-line report EXACTLY like this:<br><code>Passed: 6 of 8</code><br><code>Pass rate: 75.0%</code>',
          hint:'First line is just text with the two numbers via an f-string. Pass rate = passed / total * 100; the <code>%</code> sign is plain text right after the number.',
          starter:
`passed = 6
total = 8

# Task: print two lines:
# 1) Passed: 6 of 8
# 2) Pass rate: 75.0%   (that is passed / total * 100)
`,
          check(out){
            const m = matchEn(out, 'Passed: 6 of 8\nPass rate: 75.0%'); if(m) return m;
            return {ok:false, msg:'Expected exactly two lines: <code>Passed: 6 of 8</code> and <code>Pass rate: 75.0%</code>. Pass rate is <code>passed / total * 100</code>.'};
          }
        }
      ]
    },
    {
      id:'m2', num:2, phase:'База Python', title:'Условия', desc:'if / elif / else, сравнения, and / or / not',
      theory:[
        '<code>if условие:</code> выполняет блок с отступом, только если условие истинно. Обязательны двоеточие в конце строки и отступ в 4 пробела у блока. Пример: <code>if x &gt; 0:</code>, а на следующей строке с отступом — <code>print("positive")</code>.',
        'Сравнения возвращают <code>True</code> или <code>False</code>: <code>==</code> равно, <code>!=</code> не равно, а также <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>. Пример: <code>5 == 5</code> → <code>True</code>, а <code>3 &gt; 10</code> → <code>False</code>.',
        '<code>else</code> — «иначе», <code>elif</code> — «иначе если». В цепочке <code>if / elif / elif / else</code> выполняется только ПЕРВАЯ подошедшая ветка. Пример: при <code>score = 72</code> проверка <code>score &gt;= 90</code> не сработает, а <code>score &gt;= 70</code> сработает — остальные ветки Python даже не смотрит.',
        '<code>and</code> / <code>or</code> / <code>not</code> объединяют условия: <code>and</code> — оба сразу, <code>or</code> — хотя бы одно, <code>not</code> — переворот. Пример: «число больше 0 и меньше 10» — это <code>x &gt; 0 and x &lt; 10</code> (два отдельных сравнения, соединённых через <code>and</code>).',
        'Задания ниже — на английском (заодно тренируем язык), разных типов: написать с нуля, дополнить, найти и починить ошибку, предсказать вывод и финальная задача-босс. Плюс блок «Домашка» — задачи посложнее на потом; на переход к следующему модулю они не влияют. Непонятно английское условие — жми «Подсказка».'
      ],
      tasks:[
        {
          id:'m2-t1', title:'Passed or failed',
          goal:'Given <code>passed = True</code>, print <b>PASS</b> if the test passed, otherwise print <b>FAIL</b>.',
          hint:'<code>if</code> runs its block only when the condition is True; <code>else</code> is the "otherwise" branch. Do not forget the colon and the 4-space indent.',
          starter:
`passed = True

# Task: if the test passed, print PASS; otherwise print FAIL
`,
          check(out){
            const m = matchEn(out, 'PASS'); if(m) return m;
            return {ok:false, msg:'Expected <code>PASS</code> when <code>passed</code> is True. Use <code>if</code>/<code>else</code> and print PASS in the if-branch.'};
          }
        },
        {
          id:'m2-t2', title:'Response code',
          goal:'Given <code>status = 200</code>, print <b>OK</b> if it equals 200, otherwise print <b>Error</b>.',
          hint:'Equality in a condition is TWO equals signs <code>==</code>. A single <code>=</code> assigns a value, it does not compare.',
          starter:
`status = 200

# Task: if status equals 200, print OK; otherwise print Error
`,
          check(out){
            const m = matchEn(out, 'OK'); if(m) return m;
            return {ok:false, msg:'Expected <code>OK</code> for status 200. Compare with <code>==</code> (two equals), not <code>=</code>.'};
          }
        },
        {
          id:'m2-t3', title:'Predict: grade', kind:'predict',
          goal:'Do not run it yet. Read the elif chain and type what it will print, then check yourself.',
          hint:'Branches are checked top to bottom, and only the FIRST matching one runs. 72 is not &gt;= 90, but it is &gt;= 70.',
          code:
`score = 72
if score >= 90:
    print("A")
elif score >= 70:
    print("B")
elif score >= 50:
    print("C")
else:
    print("F")
`
        },
        {
          id:'m2-t4', title:'Fix: one equals',
          goal:'This code crashes because the condition uses a single <code>=</code>. Fix it so it prints: <b>Five</b>',
          hint:'Inside a condition you must COMPARE with <code>==</code> (two equals). One <code>=</code> means "assign", which is not allowed in an <code>if</code>.',
          starter:
`x = 5
if x = 5:
    print("Five")
`,
          check(out){
            const m = matchEn(out, 'Five'); if(m) return m;
            return {ok:false, msg:'Expected <code>Five</code>. Change <code>=</code> to <code>==</code> in the condition.'};
          }
        },
        {
          id:'m2-t5', title:'Login and password (and)',
          goal:'Given <code>login_ok = True</code> and <code>password_ok = True</code>, print <b>Access granted</b> if both are True, otherwise print <b>Denied</b>.',
          hint:'<code>and</code> means both at once. If either side is False, the whole condition is False.',
          starter:
`login_ok = True
password_ok = True

# Task: if both the login and the password are OK, print Access granted; otherwise print Denied
`,
          check(out){
            const m = matchEn(out, 'Access granted'); if(m) return m;
            return {ok:false, msg:'Expected <code>Access granted</code> when both are True. Join the two conditions with <code>and</code>.'};
          }
        },
        {
          id:'m2-t6', title:'Weekend or holiday (or)',
          goal:'Given <code>is_weekend = False</code> and <code>is_holiday = True</code>, print <b>Rest day</b> if at least one is True, otherwise print <b>Work day</b>.',
          hint:'<code>or</code> means at least one of the two. It is True when either side is True.',
          starter:
`is_weekend = False
is_holiday = True

# Task: if at least one of them is True, print Rest day; otherwise print Work day
`,
          check(out){
            const m = matchEn(out, 'Rest day'); if(m) return m;
            return {ok:false, msg:'Expected <code>Rest day</code> — the holiday is True. Join the two conditions with <code>or</code>.'};
          }
        },
        {
          id:'m2-t7', title:'Fix: missing colon',
          goal:'This code crashes because a colon is missing. Fix it so it prints: <b>Even</b>',
          hint:'Every <code>if</code> condition ends with a colon <code>:</code> — it tells Python "an indented block follows".',
          starter:
`n = 4
if n % 2 == 0
    print("Even")
`,
          check(out){
            const m = matchEn(out, 'Even'); if(m) return m;
            return {ok:false, msg:'Expected <code>Even</code>. Add a colon <code>:</code> at the end of the <code>if</code> line.'};
          }
        },
        {
          id:'m2-t8', title:'Predict: not', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'<code>not</code> flips a boolean: <code>not False</code> is True, so the if-branch runs.',
          code:
`is_broken = False
if not is_broken:
    print("Deploy")
else:
    print("Blocked")
`
        },
        {
          id:'m2-t9', title:'Age range (and)',
          goal:'Given <code>age = 25</code>, print <b>Eligible</b> if age is at least 18 AND at most 60, otherwise print <b>Not eligible</b>.',
          hint:'Two separate comparisons joined with <code>and</code>, e.g. <code>age &gt;= 18 and age &lt;= 60</code>. Do NOT chain them into one expression.',
          starter:
`age = 25

# Task: print Eligible if age is at least 18 AND at most 60; otherwise Not eligible
# Combine two separate comparisons with and (do not chain them)
`,
          check(out){
            const m = matchEn(out, 'Eligible'); if(m) return m;
            return {ok:false, msg:'Expected <code>Eligible</code> for age 25. Join <code>age &gt;= 18</code> and <code>age &lt;= 60</code> with <code>and</code>.'};
          }
        },
        {
          id:'m2-t10', title:'API response speed', boss:true,
          goal:'Given <code>response_ms = 250</code>, print the speed label: <b>Fast</b> if below 100, <b>Normal</b> if below 300, otherwise <b>Slow</b>.',
          hint:'Three ranges means <code>if</code> / <code>elif</code> / <code>else</code>. Start from the smallest bound (100), then 300, then else. Order matters.',
          starter:
`response_ms = 250

# Task: print the speed label:
#   Fast   if response_ms is below 100
#   Normal if response_ms is below 300
#   Slow   otherwise
# Use if / elif / else, starting from the smallest bound
`,
          check(out){
            const m = matchEn(out, 'Normal'); if(m) return m;
            return {ok:false, msg:'Expected <code>Normal</code> for 250 (not below 100, but below 300). Check the order of the bounds.'};
          }
        }
      ],
      homework:[
        {
          id:'m2-hw1', title:'HTTP status category',
          goal:'Given <code>status = 404</code>, print the category: <b>Success</b> for 200-299, <b>Client error</b> for 400-499, <b>Server error</b> for 500-599, otherwise <b>Other</b>.',
          hint:'An elif chain over ranges. Write a range as <code>status &gt;= 200 and status &lt; 300</code>. Go from smaller codes up. This is exactly how autotests classify responses.',
          starter:
`status = 404

# Task: print the status category:
#   Success      for codes 200-299
#   Client error for codes 400-499
#   Server error for codes 500-599
#   Other        for anything else
# This is exactly how autotests classify responses.
`,
          check(out){
            const m = matchEn(out, 'Client error'); if(m) return m;
            return {ok:false, msg:'Expected <code>Client error</code> — 404 is in the 400-499 range. Build an elif chain, each range like <code>status &gt;= 400 and status &lt; 500</code>.'};
          }
        },
        {
          id:'m2-hw2', title:'Predict: test result', kind:'predict',
          goal:'Read the combined condition and type what it will print, then check yourself.',
          hint:'The first branch needs BOTH: passed AND duration below 10. Here duration is 12, so that branch is skipped and the next matching one runs.',
          code:
`passed = True
duration = 12
if passed and duration < 10:
    print("Great")
elif passed:
    print("Passed but slow")
else:
    print("Failed")
`
        },
        {
          id:'m2-hw3', title:'Which run is faster',
          goal:'Given <code>a = 120</code> and <code>b = 95</code> (response times in ms, smaller is faster), print <b>A is faster</b> if a is smaller, <b>B is faster</b> if b is smaller, otherwise <b>Same</b>.',
          hint:'A three-way compare with <code>if</code> / <code>elif</code> / <code>else</code>. Smaller time means faster — think which value is smaller here.',
          starter:
`a = 120
b = 95

# Task: a and b are response times in ms (smaller is faster).
# Print  A is faster  if a is smaller, B is faster  if b is smaller, otherwise Same
`,
          check(out){
            const m = matchEn(out, 'B is faster'); if(m) return m;
            return {ok:false, msg:'Expected <code>B is faster</code> — 95 is smaller than 120. Compare a and b with <code>if</code> / <code>elif</code> / <code>else</code>.'};
          }
        }
      ]
    },
    {
      id:'m3', num:3, phase:'База Python', title:'Циклы', desc:'for, while, range — повторяем действия',
      theory:[
        '<code>for i in range(5):</code> повторяет блок 5 раз, причём <code>i</code> по очереди принимает 0, 1, 2, 3, 4 — Python считает с нуля. Пример посложнее: <code>range(2, 10, 2)</code> идёт от 2 до 8 с шагом 2 (2, 4, 6, 8) — второе число не включается, третье — это шаг.',
        '<code>while условие:</code> повторяет блок, пока условие остаётся True. Пример: <code>while count &lt; 3:</code> с <code>count += 1</code> внутри выполнится 3 раза. Если забыть менять то, от чего зависит условие, цикл станет бесконечным — частая ошибка новичков.',
        '<code>+=</code> — сокращение для «прибавить и сохранить»: <code>total += x</code> то же самое, что <code>total = total + x</code>. Так удобно копить сумму или считать количество: заведи переменную-счётчик ДО цикла (например, <code>count = 0</code>), а внутри цикла увеличивай её при нужном условии.',
        '<code>break</code> немедленно останавливает цикл целиком — полезно, когда нужное уже найдено. Пример: ищем элемент в списке и, как только нашли, <code>break</code> — незачем проверять остальное.',
        '<code>continue</code> пропускает оставшуюся часть ТЕКУЩЕЙ итерации и сразу переходит к следующей — код после <code>continue</code> в этом проходе цикла не выполнится, но сам цикл продолжится дальше.',
        '<code>for x in список:</code> перебирает элементы списка по одному — ровно так автотесты проходят по списку кейсов, статусов или времён ответа. Задания ниже — на английском, разных типов, плюс «Домашка» в конце (не влияет на переход дальше, но даёт XP и практику).'
      ],
      tasks:[
        {
          id:'m3-t1', title:'Count from 1 to 5',
          goal:'Print numbers 1 through 5, each on its own line.',
          hint:'<code>range(1, 6)</code> counts 1, 2, 3, 4, 5 — the upper bound is not included, so add 1 to the last number you want.',
          starter:
`# Task: print numbers 1 to 5, one per line
`,
          check(out){
            const m = matchEn(out, '1\n2\n3\n4\n5'); if(m) return m;
            return {ok:false, msg:'Expected the numbers <code>1</code> to <code>5</code>, each on its own line. Check the bounds of your <code>range(...)</code>.'};
          }
        },
        {
          id:'m3-t2', title:'Sum of test durations',
          goal:'Given <code>durations = [4, 7, 3, 6, 2]</code>, add them up with a loop and print the total as one number.',
          hint:'Start a counter before the loop: <code>total = 0</code>. Inside <code>for d in durations:</code>, add each value: <code>total += d</code>. Print <code>total</code> after the loop ends.',
          starter:
`durations = [4, 7, 3, 6, 2]
total = 0

# Task: loop over durations, add each one to total, then print total
`,
          check(out){
            const m = matchEn(out, '22'); if(m) return m;
            return {ok:false, msg:'Expected <code>22</code> — the sum of all values in <code>durations</code>. Make sure <code>total</code> is printed AFTER the loop, not inside it.'};
          }
        },
        {
          id:'m3-t3', title:'Predict: range with a step', kind:'predict',
          goal:'Do not run it yet. Read the code and type what it will print, then check yourself.',
          hint:'<code>range(2, 11, 2)</code> starts at 2, stops before 11, and steps by 2 each time: 2, 4, 6, 8, 10.',
          code:
`for i in range(2, 11, 2):
    print(i)
`
        },
        {
          id:'m3-t4', title:'Fix: the loop never stops',
          goal:'This code hangs forever — the counter never changes. Fix it so it prints <b>1</b>, <b>2</b>, <b>3</b>, each on its own line, then stops.',
          hint:'Every <code>while</code> loop needs something that changes inside it, or the condition stays True forever. Add <code>count += 1</code> inside the loop body.',
          starter:
`count = 1
while count <= 3:
    print(count)
`,
          check(out){
            const m = matchEn(out, '1\n2\n3'); if(m) return m;
            return {ok:false, msg:'Expected <code>1</code>, <code>2</code>, <code>3</code> on separate lines. Make sure <code>count</code> actually changes inside the loop.'};
          }
        },
        {
          id:'m3-t5', title:'Only failed tests',
          goal:'Given <code>results = ["pass", "fail", "pass", "fail", "fail"]</code>, print only the items equal to <b>fail</b>, one per line.',
          hint:'Combine a loop with a condition: <code>for r in results:</code>, then <code>if r == "fail":</code> print it.',
          starter:
`results = ["pass", "fail", "pass", "fail", "fail"]

# Task: loop over results, print only the items equal to "fail"
`,
          check(out){
            const m = matchEn(out, 'fail\nfail\nfail'); if(m) return m;
            return {ok:false, msg:'Expected <code>fail</code> printed three times, once per line. Check your <code>if</code> condition inside the loop.'};
          }
        },
        {
          id:'m3-t6', title:'Find the target test (break)',
          goal:'In <code>tests = ["login", "search", "checkout", "logout"]</code>, find <b>checkout</b> and print <b>Found: checkout</b> — then stop looking, do not check the rest.',
          hint:'Inside <code>for t in tests:</code>, add <code>if t == "checkout":</code> — print the message, then <code>break</code> so the loop stops right away.',
          starter:
`tests = ["login", "search", "checkout", "logout"]

# Task: find "checkout", print Found: checkout, then stop the loop with break
`,
          check(out){
            const m = matchEn(out, 'Found: checkout'); if(m) return m;
            return {ok:false, msg:'Expected exactly one line: <code>Found: checkout</code>. Check the comparison and that you break right after printing.'};
          }
        },
        {
          id:'m3-t7', title:'Fix: off-by-one',
          goal:'This should print 1 through 5, but it stops at 4 — fix the range so it prints all five numbers.',
          hint:'<code>range(start, stop)</code> never includes <code>stop</code>. To include 5, the stop value must be 6.',
          starter:
`for i in range(1, 5):
    print(i)
`,
          check(out){
            const m = matchEn(out, '1\n2\n3\n4\n5'); if(m) return m;
            return {ok:false, msg:'Expected <code>1</code> to <code>5</code>, each on its own line. Adjust the second number in <code>range(...)</code>.'};
          }
        },
        {
          id:'m3-t8', title:'Predict: continue', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'<code>continue</code> skips the rest of THIS iteration and jumps to the next one — the <code>print</code> after it never runs for that value.',
          code:
`for i in range(1, 6):
    if i == 3:
        continue
    print(i)
`
        },
        {
          id:'m3-t9', title:'Count failed tests',
          goal:'Given <code>results = ["pass", "pass", "fail", "pass", "fail", "fail"]</code>, count how many items equal <b>fail</b> and print the count as one number.',
          hint:'Start a counter <code>count = 0</code> before the loop. Inside the loop, when <code>r == "fail"</code>, do <code>count += 1</code>. Print <code>count</code> after the loop.',
          starter:
`results = ["pass", "pass", "fail", "pass", "fail", "fail"]
count = 0

# Task: loop over results, increase count by 1 for each "fail", then print count
`,
          check(out){
            const m = matchEn(out, '3'); if(m) return m;
            return {ok:false, msg:'Expected <code>3</code> — the number of <code>"fail"</code> items in the list. Make sure the counter only increases on a match.'};
          }
        },
        {
          id:'m3-t10', title:'Slow response report', boss:true,
          goal:'Given <code>times = [120, 340, 90, 410, 260, 500]</code> (response times in ms), count how many are slow (300 or more) and print a two-line report EXACTLY like this:<br><code>Slow: 3 of 6</code><br><code>Slow rate: 50.0%</code>',
          hint:'Loop through <code>times</code>, counting how many are <code>&gt;= 300</code> into a counter. The total is <code>len(times)</code>. Slow rate is <code>slow / len(times) * 100</code> — same pattern as the Module 1 boss task.',
          starter:
`times = [120, 340, 90, 410, 260, 500]
slow = 0

# Task: loop over times, count how many are >= 300 into slow
# Then print two lines:
# 1) Slow: <slow> of <how many times total>
# 2) Slow rate: <percentage>%   (that is slow / total * 100)
`,
          check(out){
            const m = matchEn(out, 'Slow: 3 of 6\nSlow rate: 50.0%'); if(m) return m;
            return {ok:false, msg:'Expected exactly two lines: <code>Slow: 3 of 6</code> and <code>Slow rate: 50.0%</code>. Check your <code>&gt;=</code> comparison and the percentage formula.'};
          }
        }
      ],
      homework:[
        {
          id:'m3-hw1', title:'Retry until success',
          goal:'A flaky test needs <code>attempts_needed = 4</code> tries before it passes. Starting from <code>attempt = 1</code>, print each attempt number while it is below <code>attempts_needed</code>, increasing it by 1 each time; after the loop, print <b>Success on attempt 4</b> using the final value of <code>attempt</code>.',
          hint:'Use a while loop: print <code>attempt</code>, then <code>attempt += 1</code>, while <code>attempt &lt; attempts_needed</code>. After the loop finishes, <code>attempt</code> equals <code>attempts_needed</code> — print the final message with an f-string.',
          starter:
`attempts_needed = 4
attempt = 1

# Task: while attempt < attempts_needed: print attempt, then increase it by 1
# After the loop, print: Success on attempt 4   (use attempt in an f-string)
`,
          check(out){
            const m = matchEn(out, '1\n2\n3\nSuccess on attempt 4'); if(m) return m;
            return {ok:false, msg:'Expected <code>1</code>, <code>2</code>, <code>3</code>, then <code>Success on attempt 4</code>. Check the while condition and where the final print happens.'};
          }
        },
        {
          id:'m3-hw2', title:'Predict: continue and break together', kind:'predict',
          goal:'Read the loop with both <code>continue</code> and <code>break</code>, and type the exact output, then check yourself.',
          hint:'When <code>i</code> is 2, <code>continue</code> skips printing and jumps to the next number. When <code>i</code> is 4, <code>break</code> stops the loop right away — 4 is never printed either.',
          code:
`for i in range(1, 6):
    if i == 2:
        continue
    if i == 4:
        break
    print(i)
`
        },
        {
          id:'m3-hw3', title:'Count each result type',
          goal:'Given <code>results = ["pass", "fail", "pass", "pass", "fail", "fail", "fail"]</code>, count how many are <b>pass</b> and how many are <b>fail</b>, then print two lines EXACTLY like this:<br><code>Passed: 3</code><br><code>Failed: 4</code>',
          hint:'Two separate counters, both starting at 0. Loop once through <code>results</code>, and inside the loop use <code>if</code> / <code>elif</code> to increase the matching counter by 1.',
          starter:
`results = ["pass", "fail", "pass", "pass", "fail", "fail", "fail"]
passed = 0
failed = 0

# Task: loop over results, count "pass" into passed and "fail" into failed
# Then print two lines:
# 1) Passed: <passed>
# 2) Failed: <failed>
`,
          check(out){
            const m = matchEn(out, 'Passed: 3\nFailed: 4'); if(m) return m;
            return {ok:false, msg:'Expected exactly <code>Passed: 3</code> then <code>Failed: 4</code>. Check both counters and that each result matches only one branch.'};
          }
        }
      ]
    },
    {id:'m4', num:4, phase:'База Python', title:'Функции', desc:'зачем нужны, def, параметры, return'},
    {id:'m5', num:5, phase:'База Python', title:'Списки и словари', desc:'коллекции данных и перебор циклом'},
    {id:'m6', num:6, phase:'База Python', title:'Установка окружения', desc:'ставим Python по-настоящему — VS Code, запуск файлов'},
    {id:'m7', num:7, phase:'База Python', title:'ООП: классы и объекты', desc:'классы, объекты, атрибуты и методы — фундамент Page Object и фикстур'},
    {id:'m8', num:8, phase:'База Python', title:'Стандартная библиотека и генераторы', desc:'полезные встроенные модули, итераторы и генераторы'},
    {id:'m9', num:9, phase:'Автотесты на Python', title:'Pytest', desc:'запуск тестов, assert, фикстуры, параметризация'},
    {id:'m10', num:10, phase:'Автотесты на Python', title:'Моки и стабы', desc:'подмена зависимостей: mock, stub — когда и зачем'},
    {id:'m11', num:11, phase:'Инструменты автоматизации', title:'API-тестирование', desc:'проверка запросов и ответов через requests'},
    {id:'m12', num:12, phase:'Инструменты автоматизации', title:'Базы данных', desc:'проверка данных в БД прямо из тестов'},
    {id:'m13', num:13, phase:'Инструменты автоматизации', title:'Локаторы и Selenium', desc:'поиск элементов и автоматизация браузера'},
    {id:'m14', num:14, phase:'Инструменты автоматизации', title:'Playwright', desc:'современная автоматизация браузера'},
    {id:'m15', num:15, phase:'Инструменты автоматизации', title:'Архитектура фреймворка автотестов', desc:'как собрать поддерживаемый проект автотестов'}
  ];
