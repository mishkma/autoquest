/* AutoQuest — course module data (theory + tasks + homework). */

// Exact match against the expected ASCII output; if it would match after
// swapping look-alike Cyrillic letters for Latin ones, hint about the keyboard layout.
// (Shared by every check() below — that is why it is declared here, not in app.js.)
const CYR2LAT = {'А':'A','В':'B','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','С':'C','Т':'T','Х':'X','а':'a','е':'e','о':'o','р':'p','с':'c','у':'y','х':'x'};
function deCyr(s){ return String(s).replace(/[А-Яа-яЁё]/g, c => CYR2LAT[c] || c); }
function matchEn(out, expected){
  const t = String(out).trim();
  if(t === expected) return {ok:true};
  if(deCyr(t) === expected) return {ok:false, msg:'Looks like some letters were typed in the Cyrillic layout — they look like English letters, but Python sees different characters. Switch to the English keyboard layout and retype.'};
  return null;
}

const MODULES = [
    {
      id:'m1', num:1, phase:'Python basics', title:'First code and variables',
      desc:'print, variables, data types, simple calculations',
      theory: [
        '<code>print(...)</code> prints to the console whatever is inside the parentheses. Example: <code>print("Hello")</code> → prints <code>Hello</code>, and <code>print(2 + 2)</code> → <code>4</code>. This is how you "see" a result.',
        'A variable is a labeled box for a value: <code>name = "Anna"</code> puts a string into the variable <code>name</code>; then <code>print(name)</code> prints <code>Anna</code>. The value can be overwritten: <code>name = "Bob"</code>.',
        'The type of a value matters: <code>"5"</code> is a string (text), while <code>5</code> is a number. They cannot be added directly with <code>+</code>. A number itself can be a whole number — <code>5</code> (<code>int</code>) — or a fractional one — <code>5.0</code> (<code>float</code>).',
        'An f-string inserts values right into text: <code>age = 30</code>; <code>print(f"Age: {age}")</code> → <code>Age: 30</code>. Inside the curly braces you can even compute: <code>f"{a + b}"</code> inserts the sum.',
        'Arithmetic: <code>+ - * /</code> work as in math, but <code>/</code> ALWAYS gives a fractional number: <code>10 / 2</code> → <code>5.0</code>. There is also <code>//</code> — integer division (<code>7 // 2</code> → <code>3</code>), <code>%</code> — remainder (<code>7 % 2</code> → <code>1</code>) and <code>**</code> — power. The remainder and integer division are handy when splitting something into groups or pages.',
        'The tasks below are of different kinds: write code from scratch, complete it, find and fix a bug, predict the output, and a final boss task. If a task condition is unclear, hit "Hint".'
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
            if(re.test(deCyr(t))) return {ok:false, msg:'Looks like some letters were typed in the Cyrillic layout — they look like English letters, but Python sees different characters. Switch to the English keyboard layout and retype.'};
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
      id:'m2', num:2, phase:'Python basics', title:'Conditions', desc:'if / elif / else, comparisons, and / or / not',
      theory:[
        '<code>if condition:</code> runs the indented block only when the condition is true. A colon at the end of the line and a 4-space indent for the block are both required. Example: <code>if x &gt; 0:</code>, then on the next indented line — <code>print("positive")</code>.',
        'Comparisons return <code>True</code> or <code>False</code>: <code>==</code> equal, <code>!=</code> not equal, plus <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>. Example: <code>5 == 5</code> → <code>True</code>, and <code>3 &gt; 10</code> → <code>False</code>.',
        '<code>else</code> means "otherwise", <code>elif</code> means "else if". In an <code>if / elif / elif / else</code> chain, only the FIRST matching branch runs. Example: with <code>score = 72</code>, the check <code>score &gt;= 90</code> fails, but <code>score &gt;= 70</code> succeeds — Python never even looks at the remaining branches.',
        '<code>and</code> / <code>or</code> / <code>not</code> combine conditions: <code>and</code> — both at once, <code>or</code> — at least one, <code>not</code> — flips it. Example: "the number is greater than 0 and less than 10" is <code>x &gt; 0 and x &lt; 10</code> (two separate comparisons joined with <code>and</code>).',
        'The tasks below are of different kinds: write from scratch, complete, find and fix a bug, predict the output, and a final boss task. Plus a "Homework" block — harder tasks for later; they do not gate the next module. If an English condition is unclear, hit "Hint".'
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
      id:'m3', num:3, phase:'Python basics', title:'Loops', desc:'for, while, range — repeating actions',
      theory:[
        '<code>for i in range(5):</code> repeats the block 5 times, and <code>i</code> takes on 0, 1, 2, 3, 4 in turn — Python counts from zero. A trickier example: <code>range(2, 10, 2)</code> goes from 2 up to 8 with a step of 2 (2, 4, 6, 8) — the second number is not included, the third is the step.',
        '<code>while condition:</code> repeats the block while the condition stays True. Example: <code>while count &lt; 3:</code> with <code>count += 1</code> inside runs 3 times. Forgetting to change whatever the condition depends on turns the loop infinite — a common beginner mistake.',
        '<code>+=</code> is shorthand for "add and store": <code>total += x</code> is the same as <code>total = total + x</code>. This is how you accumulate a sum or count: create a counter variable BEFORE the loop (e.g. <code>count = 0</code>), then increase it inside the loop when the condition is met.',
        '<code>break</code> immediately stops the whole loop — useful once what you were looking for has been found. Example: search a list for an item, and as soon as it is found, <code>break</code> — no need to check the rest.',
        '<code>continue</code> skips the rest of the CURRENT iteration and jumps straight to the next one — code after <code>continue</code> does not run for that pass, but the loop itself keeps going.',
        '<code>for x in list:</code> walks through a list one item at a time — exactly how autotests iterate over a list of test cases, statuses or response times. The tasks below are of different kinds, plus "Homework" at the end (does not gate progress, but gives XP and practice).'
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
    {
      id:'m4', num:4, phase:'Python basics', title:'Functions',
      desc:'why they matter, def, parameters, return',
      theory:[
        '<code>def</code> declares a function — a named chunk of code you can call as many times as you like instead of copying it over and over. Simple example: <code>def square(x): return x * x</code>, then <code>square(5)</code> returns 25. A trickier example — a function with two parameters: <code>def calc_total(price, qty): return price * qty</code>.',
        'Parameters are placeholder names inside a function that receive values (arguments) at call time. <code>calc_total(price, qty)</code> declares two parameters; <code>calc_total(10, 3)</code> calls the function with the arguments 10 and 3 — inside, <code>price</code> becomes 10 and <code>qty</code> becomes 3.',
        '<code>return</code> is not the same as <code>print</code>. <code>print</code> just displays a value on screen, while <code>return</code> hands the value back to wherever the function was called from, so it can be used further: stored in a variable, passed into another function, used in a calculation. A function with no <code>return</code> returns <code>None</code>.',
        'Inside a function you can use <code>if</code>, loops — everything you already know. Example: a discount function — <code>def apply_discount(price, is_member): if is_member: return price * 0.9; return price</code> — computes differently depending on the condition.',
        'A variable created INSIDE a function (e.g. by assignment) exists only inside it — this is called a local variable. Even if there is a variable with the same name outside, assigning inside the function creates a separate, new variable and does not touch the outer one. A function can read outer values, but it cannot change them by assignment.',
        'In automation, functions are a way to avoid repeating the same check code many times: write <code>is_valid_status(...)</code> or <code>calc_total(...)</code> once — and reuse it across dozens of tests instead of copy-pasting. The tasks below are of different kinds, plus "Homework" at the end.'
      ],
      tasks:[
        {
          id:'m4-t1', title:'Greet the tester',
          goal:'Write a function named <code>greet_tester</code> that takes one parameter <code>name</code> and returns the string <b>"Hello, NAME, ready to test?"</b> (using an f-string). Then call <code>greet_tester("Alex")</code> and print the result.',
          hint:'<code>def greet_tester(name): return f"Hello, {name}, ready to test?"</code> — then <code>print(greet_tester("Alex"))</code>.',
          starter:
`# Task: define greet_tester(name) that returns an f-string greeting
# Then call greet_tester("Alex") and print the result

`,
          check(out){
            const m = matchEn(out, 'Hello, Alex, ready to test?'); if(m) return m;
            return {ok:false, msg:'Expected <code>Hello, Alex, ready to test?</code>. Make sure the function RETURNS the string (not prints it), and that you print the result of the call.'};
          }
        },
        {
          id:'m4-t2', title:'Cart total',
          goal:'Write a function <code>calc_total(price, qty)</code> that returns <code>price * qty</code>. Then print <code>calc_total(25, 4)</code>.',
          hint:'<code>def calc_total(price, qty): return price * qty</code> — call it inside <code>print(...)</code>.',
          starter:
`# Task: define calc_total(price, qty) that returns price * qty
# Then print calc_total(25, 4)

`,
          check(out){
            const m = matchEn(out, '100'); if(m) return m;
            return {ok:false, msg:'Expected <code>100</code> — 25 multiplied by 4. Check that the function returns <code>price * qty</code>.'};
          }
        },
        {
          id:'m4-t3', title:'Predict: parameters are local copies', kind:'predict',
          goal:'Do not run it yet. Read the code and type what it will print, then check yourself.',
          hint:'<code>x</code> inside <code>double</code> is a separate local variable — changing it does not change <code>n</code> outside the function.',
          code:
`def double(x):
    x = x * 2
    return x

n = 5
result = double(n)
print(n)
print(result)
`
        },
        {
          id:'m4-t4', title:'Fix: prints instead of returns',
          goal:'Calling <code>print(triple(5))</code> should print only <b>15</b>. Right now it prints two lines (<code>15</code> and then <code>None</code>) because the function prints internally instead of returning. Fix the function.',
          hint:'Remove the <code>print(result)</code> line inside the function and replace it with <code>return result</code> — then the outer <code>print(triple(5))</code> will show the value.',
          starter:
`def triple(x):
    result = x * 3
    print(result)

print(triple(5))
`,
          check(out){
            const m = matchEn(out, '15'); if(m) return m;
            return {ok:false, msg:'Expected exactly one line: <code>15</code>. The function should RETURN the value instead of printing it itself.'};
          }
        },
        {
          id:'m4-t5', title:'Apply discount',
          goal:'Write a function <code>apply_discount(price, is_member)</code> that returns <code>price * 0.9</code> if <code>is_member</code> is <code>True</code>, otherwise returns <code>price</code> unchanged. Print <code>apply_discount(100, True)</code>, then <code>apply_discount(100, False)</code>.',
          hint:'<code>if is_member: return price * 0.9</code>, then (outside the if) <code>return price</code>. Note that <code>100 * 0.9</code> becomes a float, so it prints as <code>90.0</code>.',
          starter:
`def apply_discount(price, is_member):
    # Task: return price * 0.9 if is_member is True, otherwise return price

print(apply_discount(100, True))
print(apply_discount(100, False))
`,
          check(out){
            const m = matchEn(out, '90.0\n100'); if(m) return m;
            return {ok:false, msg:'Expected <code>90.0</code> then <code>100</code>. Check both branches of your <code>if</code>.'};
          }
        },
        {
          id:'m4-t6', title:'One function inside another',
          goal:'Write two functions: <code>calc_subtotal(price, qty)</code> returning <code>price * qty</code>, and <code>add_tax(amount)</code> returning <code>amount * 1.2</code> (20% tax). Then print <code>add_tax(calc_subtotal(50, 2))</code> — call one function inside the other.',
          hint:'Define both functions first. The result of <code>calc_subtotal(50, 2)</code> becomes the argument passed into <code>add_tax(...)</code>.',
          starter:
`# Task: define calc_subtotal(price, qty) -> price * qty
# Task: define add_tax(amount) -> amount * 1.2
# Then print add_tax(calc_subtotal(50, 2))

`,
          check(out){
            const m = matchEn(out, '120.0'); if(m) return m;
            return {ok:false, msg:'Expected <code>120.0</code> — subtotal 100, then +20% tax. Check both functions and the order you call them in.'};
          }
        },
        {
          id:'m4-t7', title:'Fix: swapped arguments',
          goal:'This should apply a discount of 5 to a price of 100 (expected result: <b>95</b>). It prints the wrong number because the arguments are passed in the wrong order. Fix the function call.',
          hint:'The function is defined as <code>apply_discount(price, discount)</code> — check the order of the two numbers in the call below.',
          starter:
`def apply_discount(price, discount):
    return price - discount

print(apply_discount(5, 100))
`,
          check(out){
            const m = matchEn(out, '95'); if(m) return m;
            return {ok:false, msg:'Expected <code>95</code>. Swap the order of the two arguments in the call to match <code>apply_discount(price, discount)</code>.'};
          }
        },
        {
          id:'m4-t8', title:'Predict: local variable shadows the outer one', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'Assigning to <code>count</code> inside <code>increment</code> creates a NEW local variable — it does not change the <code>count</code> defined outside the function.',
          code:
`count = 0

def increment():
    count = 1
    return count

increment()
print(count)
`
        },
        {
          id:'m4-t9', title:'Is the response fast?',
          goal:'Write a function <code>is_fast(response_time)</code> that returns <code>True</code> if <code>response_time</code> is less than 200, otherwise <code>False</code>. Then write <code>if is_fast(150): print("OK") else: print("SLOW")</code>.',
          hint:'<code>def is_fast(response_time): return response_time &lt; 200</code> — a comparison is already a value, you can return it directly without an <code>if</code> inside the function.',
          starter:
`# Task: define is_fast(response_time) that returns response_time < 200

if is_fast(150):
    print("OK")
else:
    print("SLOW")
`,
          check(out){
            const m = matchEn(out, 'OK'); if(m) return m;
            return {ok:false, msg:'Expected <code>OK</code> — 150 is less than 200. Check that <code>is_fast</code> returns the comparison result.'};
          }
        },
        {
          id:'m4-t10', title:'Order summary report', boss:true,
          goal:'Write a function <code>calc_total(price, qty)</code> that returns <code>price * qty</code>. Use it to compute totals for three orders — <code>calc_total(20, 2)</code>, <code>calc_total(45, 1)</code>, <code>calc_total(15, 3)</code> — add all three totals into one number called <code>grand_total</code>, and print EXACTLY:<br><code>Order total: 130</code>',
          hint:'Store each call in its own variable (or add them directly), then print with an f-string: <code>print(f"Order total: {grand_total}")</code>.',
          starter:
`def calc_total(price, qty):
    # Task: return price * qty

# Task: compute totals for (20,2), (45,1), (15,3), add them into grand_total
# Then print: Order total: <grand_total>
`,
          check(out){
            const m = matchEn(out, 'Order total: 130'); if(m) return m;
            return {ok:false, msg:'Expected exactly <code>Order total: 130</code>. Check <code>calc_total</code> and that you added up all three results correctly.'};
          }
        }
      ],
      homework:[
        {
          id:'m4-hw1', title:'Format test result',
          goal:'Write a function <code>format_result(name, passed)</code> that returns <b>"NAME: PASS"</b> if <code>passed</code> is <code>True</code>, otherwise <b>"NAME: FAIL"</b> (f-strings). Call it with <code>("test_login", True)</code> and <code>("test_logout", False)</code>, printing each result on its own line.',
          hint:'<code>if passed: return f"{name}: PASS"</code>, else <code>return f"{name}: FAIL"</code>. Call the function twice, once per <code>print</code>.',
          starter:
`# Task: define format_result(name, passed) -> f"{name}: PASS" or f"{name}: FAIL"

print(format_result("test_login", True))
print(format_result("test_logout", False))
`,
          check(out){
            const m = matchEn(out, 'test_login: PASS\ntest_logout: FAIL'); if(m) return m;
            return {ok:false, msg:'Expected <code>test_login: PASS</code> then <code>test_logout: FAIL</code>. Check both branches of the function.'};
          }
        },
        {
          id:'m4-hw2', title:'Predict: bonus does not change the original', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'<code>score</code> inside <code>add_bonus</code> is a local copy of <code>s</code> — changing it does not affect <code>s</code> outside.',
          code:
`def add_bonus(score):
    score = score + 10
    return score

s = 50
print(add_bonus(s))
print(s)
`
        },
        {
          id:'m4-hw3', title:'Count using a function',
          goal:'Write a function <code>count_fails(results)</code> that takes a list, loops over it with a counter, and returns how many items equal <b>"fail"</b>. Call it with <code>results = ["pass", "fail", "fail", "pass", "fail"]</code> and print the returned count.',
          hint:'Inside the function: <code>count = 0</code>, then <code>for r in results:</code> with <code>if r == "fail": count += 1</code>. Return <code>count</code> after the loop.',
          starter:
`# Task: define count_fails(results) — loop, count "fail" items, return the count

results = ["pass", "fail", "fail", "pass", "fail"]
print(count_fails(results))
`,
          check(out){
            const m = matchEn(out, '3'); if(m) return m;
            return {ok:false, msg:'Expected <code>3</code> — the number of <code>"fail"</code> items. Make sure the counter is returned, not printed inside the function.'};
          }
        }
      ]
    },
    {
      id:'m5', num:5, phase:'Python basics', title:'Lists and dictionaries',
      desc:'data collections and looping over them',
      theory:[
        'Lists are already familiar from loops — now let\'s look at working with individual items. <code>products[0]</code> is the first item (indices start at zero), and <code>products[-1]</code> is the last item — a negative index counts from the end. Example: <code>products = ["mouse", "keyboard", "monitor"]</code>; <code>products[0]</code> → <code>"mouse"</code>, <code>products[-1]</code> → <code>"monitor"</code>.',
        '<code>.append(x)</code> adds an item to the end of a list, <code>.pop()</code> removes the LAST item and returns it. Example: <code>cart = ["mouse"]</code>; <code>cart.append("keyboard")</code> → list becomes <code>["mouse", "keyboard"]</code>; <code>cart.pop()</code> removes <code>"keyboard"</code> and returns it.',
        'A dictionary (<code>dict</code>) stores key-value pairs — handy for one structured object instead of a pile of separate variables. Simple example: <code>product = {"name": "Mouse", "price": 25}</code>; access by key — <code>product["name"]</code> → <code>"Mouse"</code>. A trickier example: a dict with several value types at once — string, number, boolean.',
        '<code>.get(key, default)</code> is a safe way to read from a dict: if the key is missing, it returns the default value instead of a <code>KeyError</code>. Example: <code>settings.get("discount", 0)</code> returns 0 if <code>"discount"</code> is not set — useful for optional test settings.',
        '<code>.keys()</code> and <code>.values()</code> give just the keys or just the values to loop over. This sandbox has no <code>.items()</code> — to get both the key and the value at once, loop over <code>.keys()</code> and look up the value by key: <code>for key in settings.keys(): print(key, settings[key])</code>.',
        'A list of dictionaries is a way to represent a set of same-shaped objects, for example a product catalog: <code>catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]</code>. Looping works the same as with a plain list: <code>for product in catalog:</code>, and inside — <code>product["name"]</code>.'
      ],
      tasks:[
        {
          id:'m5-t1', title:'First and last product',
          goal:'Given <code>products = ["mouse", "keyboard", "monitor", "webcam"]</code>, print the first product and the last product, each on its own line — use indexing, do not type the words.',
          hint:'<code>products[0]</code> is the first item. <code>products[-1]</code> is the last item — a negative index counts from the end.',
          starter:
`products = ["mouse", "keyboard", "monitor", "webcam"]

# Task: print products[0], then print the last item using a negative index
`,
          check(out){
            const m = matchEn(out, 'mouse\nwebcam'); if(m) return m;
            return {ok:false, msg:'Expected <code>mouse</code> then <code>webcam</code>. Use <code>products[0]</code> and <code>products[-1]</code>, not the literal words.'};
          }
        },
        {
          id:'m5-t2', title:'Add to cart',
          goal:'Start with <code>cart = ["mouse"]</code>. Add <b>"keyboard"</b> to the cart with <code>.append(...)</code>, then print the whole cart.',
          hint:'<code>cart.append("keyboard")</code> adds an item to the end. Then <code>print(cart)</code> shows the whole list, Python-style, in square brackets.',
          starter:
`cart = ["mouse"]

# Task: append "keyboard" to cart, then print cart
`,
          check(out){
            const m = matchEn(out, "['mouse', 'keyboard']"); if(m) return m;
            return {ok:false, msg:"Expected <code>['mouse', 'keyboard']</code> — print the whole list after appending, not the items separately."};
          }
        },
        {
          id:'m5-t3', title:'Predict: pop removes the last item', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'<code>.pop()</code> removes and returns the LAST item of the list — the list itself gets shorter.',
          code:
`cart = ["mouse", "keyboard", "monitor"]
removed = cart.pop()
print(removed)
print(cart)
`
        },
        {
          id:'m5-t4', title:'Product details',
          goal:'Create a dict <code>product</code> with keys <b>"name"</b> (value <b>"Mouse"</b>), <b>"price"</b> (value <b>25</b>), and <b>"in_stock"</b> (value <b>True</b>). Then print <code>product["name"]</code> and <code>product["price"]</code>, each on its own line.',
          hint:'A dict literal looks like <code>{"key": value, "key2": value2}</code>. Access a value with square brackets and the key: <code>product["name"]</code>.',
          starter:
`# Task: create product = {"name": "Mouse", "price": 25, "in_stock": True}
# Then print product["name"] and product["price"]
`,
          check(out){
            const m = matchEn(out, 'Mouse\n25'); if(m) return m;
            return {ok:false, msg:'Expected <code>Mouse</code> then <code>25</code>. Check the dict literal and the keys you access.'};
          }
        },
        {
          id:'m5-t5', title:'Fix: missing key crashes',
          goal:'This code crashes with a <b>KeyError</b> because <code>"discount"</code> is not in <code>settings</code>. Fix it to safely read <code>"discount"</code> with a default value of <b>0</b>, and print the result.',
          hint:'Use <code>settings.get("discount", 0)</code> instead of <code>settings["discount"]</code> — <code>.get</code> lets you provide a default instead of crashing when the key is missing.',
          starter:
`settings = {"currency": "USD", "tax_rate": 20}

print(settings["discount"])
`,
          check(out){
            const m = matchEn(out, '0'); if(m) return m;
            return {ok:false, msg:'Expected <code>0</code>. Use <code>.get("discount", 0)</code> instead of square-bracket access.'};
          }
        },
        {
          id:'m5-t6', title:'Print all settings',
          goal:'Given <code>settings = {"currency": "USD", "tax_rate": 20, "free_shipping": True}</code>, loop over the keys and print each one together with its value, one per line, like this: <code>currency: USD</code>.',
          hint:'<code>for key in settings.keys():</code> loops over just the keys. Inside: <code>print(f"{key}: {settings[key]}")</code>.',
          starter:
`settings = {"currency": "USD", "tax_rate": 20, "free_shipping": True}

# Task: loop over settings.keys(), print "KEY: VALUE" for each (use settings[key])
`,
          check(out){
            const m = matchEn(out, 'currency: USD\ntax_rate: 20\nfree_shipping: True'); if(m) return m;
            return {ok:false, msg:'Expected three lines: <code>currency: USD</code>, <code>tax_rate: 20</code>, <code>free_shipping: True</code>, in that order. Check your f-string and loop variable.'};
          }
        },
        {
          id:'m5-t7', title:'Product catalog',
          goal:'Given <code>catalog</code> — a list of three product dicts (name + price) — loop over it and print each product name, one per line.',
          hint:'<code>for product in catalog:</code> — each <code>product</code> is a dict, so use <code>product["name"]</code> inside the loop.',
          starter:
`catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}]

# Task: loop over catalog, print product["name"] for each product
`,
          check(out){
            const m = matchEn(out, 'Mouse\nKeyboard\nMonitor'); if(m) return m;
            return {ok:false, msg:'Expected <code>Mouse</code>, <code>Keyboard</code>, <code>Monitor</code> on separate lines, in catalog order.'};
          }
        },
        {
          id:'m5-t8', title:'Predict: summing a list of dicts', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'The loop adds up <code>product["price"]</code> for every product in the list — 25 + 45.',
          code:
`catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]

total = 0
for product in catalog:
    total += product["price"]

print(total)
`
        },
        {
          id:'m5-t9', title:'Fix: wrong key name',
          goal:'This code crashes with a <b>KeyError</b>. Fix the key name so it correctly prints the price of the first product.',
          hint:'The dict uses the key <code>"price"</code>, not <code>"cost"</code> — check the dict literal above for the exact key name.',
          starter:
`catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]

print(catalog[0]["cost"])
`,
          check(out){
            const m = matchEn(out, '25'); if(m) return m;
            return {ok:false, msg:'Expected <code>25</code>. Fix the key name used to look up the price.'};
          }
        },
        {
          id:'m5-t10', title:'Catalog value report', boss:true,
          goal:'Given a <code>catalog</code> of four products, compute how many cost <b>50 or more</b>, and the total value of the whole catalog. Print EXACTLY two lines:<br><code>Expensive: 2 of 4</code><br><code>Total value: 280</code>',
          hint:'Loop once over <code>catalog</code>. Inside: add <code>product["price"]</code> to <code>total</code>, and if <code>product["price"] &gt;= 50</code>, add 1 to <code>expensive</code>. Print both lines after the loop.',
          starter:
`catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}, {"name": "Webcam", "price": 60}]
expensive = 0
total = 0

# Task: loop over catalog, add up total value, count products with price >= 50 into expensive
# Then print:
# 1) Expensive: <expensive> of <len(catalog)>
# 2) Total value: <total>
`,
          check(out){
            const m = matchEn(out, 'Expensive: 2 of 4\nTotal value: 280'); if(m) return m;
            return {ok:false, msg:'Expected exactly <code>Expensive: 2 of 4</code> then <code>Total value: 280</code>. Check the comparison and that both counters use the same loop.'};
          }
        }
      ],
      homework:[
        {
          id:'m5-hw1', title:'Safe config read',
          goal:'Given <code>config = {"env": "staging", "retries": 3}</code>, safely print the value for key <b>"timeout"</b> using <code>.get</code> with a default of <b>30</b> (since <code>"timeout"</code> is not in <code>config</code>).',
          hint:'<code>config.get("timeout", 30)</code> returns <code>30</code> because <code>"timeout"</code> is missing — no crash.',
          starter:
`config = {"env": "staging", "retries": 3}

# Task: print config.get("timeout", 30)
`,
          check(out){
            const m = matchEn(out, '30'); if(m) return m;
            return {ok:false, msg:'Expected <code>30</code>. Use <code>.get("timeout", 30)</code>.'};
          }
        },
        {
          id:'m5-hw2', title:'Predict: sort then reverse', kind:'predict',
          goal:'Read the code and type what it will print, then check yourself.',
          hint:'<code>.sort()</code> arranges the numbers from smallest to largest, then <code>.reverse()</code> flips the whole list — the result goes from largest to smallest.',
          code:
`prices = [10, 25, 15, 40]
prices.sort()
prices.reverse()
print(prices)
`
        },
        {
          id:'m5-hw3', title:'Find product by name',
          goal:'Given a <code>catalog</code> of three product dicts, loop over it and find the product with name <b>"Keyboard"</b> — print its price, then stop looking with <code>break</code>.',
          hint:'<code>for product in catalog:</code> check <code>if product["name"] == "Keyboard":</code>, then <code>print(product["price"])</code> and <code>break</code>.',
          starter:
`catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}]

# Task: loop over catalog, find the product named "Keyboard", print its price, then break
`,
          check(out){
            const m = matchEn(out, '45'); if(m) return m;
            return {ok:false, msg:'Expected <code>45</code> — the price of the Keyboard product. Check the comparison and that you print product["price"], not something else.'};
          }
        }
      ]
    },
    {id:'m6', num:6, phase:'Python basics', title:'Environment setup', desc:'installing Python for real — VS Code, running files'},
    {id:'m7', num:7, phase:'Python basics', title:'OOP: classes and objects', desc:'classes, objects, attributes and methods — the foundation of Page Object and fixtures'},
    {id:'m8', num:8, phase:'Python basics', title:'Standard library and generators', desc:'useful built-in modules, iterators and generators'},
    {id:'m9', num:9, phase:'Automated tests in Python', title:'Pytest', desc:'running tests, assert, fixtures, parametrization'},
    {id:'m10', num:10, phase:'Automated tests in Python', title:'Mocks and stubs', desc:'faking dependencies: mock, stub — when and why'},
    {id:'m11', num:11, phase:'Automation tooling', title:'API testing', desc:'checking requests and responses with requests'},
    {id:'m12', num:12, phase:'Automation tooling', title:'Databases', desc:'checking data in a DB straight from tests'},
    {id:'m13', num:13, phase:'Automation tooling', title:'Locators and Selenium', desc:'finding elements and automating the browser'},
    {id:'m14', num:14, phase:'Automation tooling', title:'Playwright', desc:'modern browser automation'},
    {id:'m15', num:15, phase:'Automation tooling', title:'Test framework architecture', desc:'building a maintainable autotest project'}
  ];
