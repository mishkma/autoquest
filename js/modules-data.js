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
        'This sandbox is a teaching subset of Python — it runs entirely in the browser, with no install. Real Python is bigger: it has slices, <code>.items()</code>, tuple unpacking, <code>*args</code>/<code>**kwargs</code> and more, none of which exist here yet. All of that arrives once you install real Python in Module 6 — this sandbox is not the whole language, just enough of it to build real habits fast.',
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
          goal:'This code crashes with a NameError. Before you fix it, find the exact mismatch and put into one sentence (to yourself) why Python cannot find that name — that habit matters more than the fix itself. Then fix it so it prints: <b>5</b>',
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
          id:'m1-t9', title:'Total test count from the API',
          goal:'An API returned the number of passed tests as text: <code>passed_raw = "34"</code>. You also have <code>failed = 9</code>. Print one line, exactly: <b>Total tests: 43</b>',
          hint:'The value from the API is text, not a number — you cannot do math with it as-is. Think back to how you turned text into a number earlier in this module, then build the final message.',
          starter:
`passed_raw = "34"
failed = 9

# Task: convert passed_raw to a number, add failed, print: Total tests: 43
`,
          check(out){
            const m = matchEn(out, 'Total tests: 43'); if(m) return m;
            return {ok:false, msg:'Expected exactly <code>Total tests: 43</code>. Convert <code>passed_raw</code> to a number first, then add <code>failed</code>, then build the message with an f-string.'};
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
          goal:'This code crashes because the condition uses a single <code>=</code>. Before fixing it, put into one sentence why a single <code>=</code> cannot go inside a condition — this is the kind of thing you would explain in a code review. Then fix it so it prints: <b>Five</b>',
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
          id:'m2-t9', title:'Safe to run in production',
          goal:'Given <code>is_destructive = False</code> and <code>env = "prod"</code>, print <b>Blocked</b> only if the test is BOTH destructive AND running in prod, otherwise print <b>Allowed</b>.',
          hint:'Figure out which two things must be true AT THE SAME TIME for the run to be blocked — you already know how to require two conditions together.',
          starter:
`is_destructive = False
env = "prod"

# Task: print Blocked only when the test is destructive AND env is "prod"; otherwise print Allowed
`,
          check(out){
            const m = matchEn(out, 'Allowed'); if(m) return m;
            return {ok:false, msg:'Expected <code>Allowed</code> — the test is not destructive, so it should never be Blocked, no matter the environment. Check how you combine the two conditions.'};
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
          goal:'This code hangs forever — the counter never changes. Before fixing it, put into one sentence why this specific loop can never become False on its own. Then fix it so it prints <b>1</b>, <b>2</b>, <b>3</b>, each on its own line, then stops.',
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
          id:'m3-t9', title:'Consecutive passes before the first failure',
          goal:'Given <code>results = ["pass", "pass", "pass", "fail", "pass", "fail"]</code>, count how many tests passed IN A ROW starting from the beginning, and print that count as one number. A test after the first failure does not count, even if it passed.',
          hint:'Keep a counter starting at 0 and loop through <code>results</code>, increasing it while you see <code>"pass"</code>. The moment you see anything else, counting has to stop right there — think about which keyword stops a loop immediately.',
          starter:
`results = ["pass", "pass", "pass", "fail", "pass", "fail"]
streak = 0

# Task: count consecutive "pass" values from the start of results
# Stop counting the instant you hit something that is not "pass"
# Then print streak
`,
          check(out){
            const m = matchEn(out, '3'); if(m) return m;
            return {ok:false, msg:'Expected <code>3</code> — three passes in a row before the first fail. Make sure you stop counting (and stop the loop) as soon as you hit something other than "pass".'};
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
      id:'cp1', checkpoint:true, phase:'Python basics', title:'Checkpoint: variables, conditions, loops',
      desc:'no new theory — every task mixes concepts from modules 1-3',
      theory:[
        'No new concepts here. Every task below deliberately combines things from the last three modules (variables, <code>if</code>/<code>elif</code>/<code>else</code>, <code>for</code>/<code>while</code>, <code>break</code>) the way a real script does — nothing isolated anymore. If a task feels harder than what you just did, that is the point: re-open Module 1-3 theory if something does not click.'
      ],
      tasks:[
        {
          id:'cp1-t1', title:'Fizz for multiples of three',
          goal:'Print the numbers 1 to 15, one per line — but for every multiple of 3, print <b>Fizz</b> instead of the number.',
          hint:'Loop with <code>range(1, 16)</code>. Inside, check <code>i % 3 == 0</code> to decide what to print for this number.',
          starter:
`# Task: print 1 to 15, one per line
# For multiples of 3, print Fizz instead of the number
`,
          check(out){
            const m = matchEn(out, '1\n2\nFizz\n4\n5\nFizz\n7\n8\nFizz\n10\n11\nFizz\n13\n14\nFizz'); if(m) return m;
            return {ok:false, msg:'Expected 1 to 15 with every multiple of 3 replaced by <code>Fizz</code>. Check your <code>%</code> comparison and the range bounds.'};
          }
        },
        {
          id:'cp1-t2', title:'Total time spent on slow responses',
          goal:'Given <code>times = [120, 340, 90, 410, 260, 500]</code> (response times in ms), add up only the ones that are 300 or more, and print the total.',
          hint:'Same accumulator pattern as before, but this time you sum the slow VALUES themselves, not how many there are.',
          starter:
`times = [120, 340, 90, 410, 260, 500]
total_slow = 0

# Task: loop over times, add up only the values >= 300, print total_slow
`,
          check(out){
            const m = matchEn(out, '1250'); if(m) return m;
            return {ok:false, msg:'Expected <code>1250</code> — the sum of 340, 410 and 500. Make sure you add the VALUE, not increase a counter by 1.'};
          }
        },
        {
          id:'cp1-t3', title:'Poll until ready',
          goal:'Starting from <code>attempt = 1</code>, simulate polling a slow service: while <code>attempt</code> is 10 or below, print <b>Waiting... attempt N</b> and increase <code>attempt</code> by 1 — UNLESS <code>attempt</code> equals 4, in which case print <b>Ready on attempt 4</b> instead and stop polling immediately.',
          hint:'A <code>while</code> loop with an <code>if</code>/<code>else</code> inside it. The <code>if</code> branch (attempt == 4) needs to print its message and then stop the loop right away — think about which keyword does that inside a <code>while</code>, not just a <code>for</code>.',
          starter:
`attempt = 1

# Task: while attempt <= 10:
#   if attempt == 4: print "Ready on attempt 4" and stop the loop
#   otherwise: print "Waiting... attempt N" and increase attempt by 1
`,
          check(out){
            const m = matchEn(out, 'Waiting... attempt 1\nWaiting... attempt 2\nWaiting... attempt 3\nReady on attempt 4'); if(m) return m;
            return {ok:false, msg:'Expected three "Waiting..." lines for attempts 1-3, then <code>Ready on attempt 4</code>, and nothing after that. <code>break</code> works inside <code>while</code> loops too.'};
          }
        },
        {
          id:'cp1-t4', title:'Test suite triage report',
          goal:'Given <code>results = ["pass", "fail", "pass", "skip", "fail", "pass", "fail"]</code>, count how many are <b>pass</b>, <b>fail</b> and <b>skip</b>, then print EXACTLY three lines:<br><code>Passed: 3</code><br><code>Failed: 3</code><br><code>Skipped: 1</code>',
          hint:'Three counters, one loop, an <code>if</code>/<code>elif</code>/<code>elif</code> chain deciding which counter to bump for each result. This is exactly what a CI pipeline prints after a test run.',
          starter:
`results = ["pass", "fail", "pass", "skip", "fail", "pass", "fail"]
passed = 0
failed = 0
skipped = 0

# Task: loop once, bump the right counter for each result, then print:
# Passed: <passed>
# Failed: <failed>
# Skipped: <skipped>
`,
          check(out){
            const m = matchEn(out, 'Passed: 3\nFailed: 3\nSkipped: 1'); if(m) return m;
            return {ok:false, msg:'Expected exactly <code>Passed: 3</code>, <code>Failed: 3</code>, <code>Skipped: 1</code>, in that order. Check that every result updates exactly one of the three counters.'};
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
          goal:'Calling <code>print(triple(5))</code> should print only <b>15</b>. Right now it prints two lines (<code>15</code> and then <code>None</code>) because the function prints internally instead of returning. Before fixing it, put into one sentence why the outer <code>print</code> gets <code>None</code> even though <code>15</code> did get printed. Fix the function.',
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
          id:'m4-t9', title:'Classify the response speed',
          goal:'Write a function <code>speed_label(response_time)</code> that returns <b>"Fast"</b> if <code>response_time</code> is below 100, <b>"Normal"</b> if below 300, otherwise <b>"Slow"</b>. Then print <code>speed_label(250)</code>.',
          hint:'Inside a function you can use <code>if</code> / <code>elif</code> / <code>else</code> exactly like anywhere else — the only difference is you <code>return</code> the label in each branch instead of printing it.',
          starter:
`def speed_label(response_time):
    # Task: return "Fast" / "Normal" / "Slow" using if / elif / else

print(speed_label(250))
`,
          check(out){
            const m = matchEn(out, 'Normal'); if(m) return m;
            return {ok:false, msg:'Expected <code>Normal</code> — 250 is not below 100, but it is below 300. Check the order of your bounds inside the function.'};
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
        'A list of dictionaries is a way to represent a set of same-shaped objects, for example a product catalog: <code>catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]</code>. Looping works the same as with a plain list: <code>for product in catalog:</code>, and inside — <code>product["name"]</code>. This is not just a coincidence: a JSON response from a real API — the exact thing you will parse in Module 11 (API testing) — looks and behaves exactly like this in Python: a list of dicts, or a dict of dicts.'
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
          goal:'This code crashes with a <b>KeyError</b> because <code>"discount"</code> is not in <code>settings</code>. Before fixing it, put into one sentence why square-bracket access has no way to fail gracefully here. Fix it to safely read <code>"discount"</code> with a default value of <b>0</b>, and print the result.',
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
          id:'m5-t9', title:'Average price of products in stock',
          goal:'Given a <code>catalog</code> of four products, some missing the <code>"in_stock"</code> key entirely, compute the average price of only the products that ARE in stock (a missing key counts as not in stock), and print the result.',
          hint:'Use <code>.get("in_stock", False)</code> so a missing key is treated as not in stock instead of crashing. Keep a running total AND a running count of in-stock items, then divide the total by the count after the loop.',
          starter:
`catalog = [{"name": "Mouse", "price": 25, "in_stock": True}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150, "in_stock": True}, {"name": "Webcam", "price": 65, "in_stock": True}]

# Task: loop over catalog, add up the price of in-stock products into a total,
# and count how many are in stock (treat a missing "in_stock" key as not in stock)
# Then print total / count
`,
          check(out){
            const m = matchEn(out, '80.0'); if(m) return m;
            return {ok:false, msg:'Expected <code>80.0</code> — the average of the three in-stock prices (25, 150, 65). Check you use <code>.get("in_stock", False)</code> and divide by the count of in-stock items only.'};
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
    {
      id:'cp2', checkpoint:true, phase:'Python basics', title:'Checkpoint: functions, lists, dicts',
      desc:'no new theory — every task mixes functions with real catalog/cart data',
      theory:[
        'No new concepts here. Every task below writes a small reusable function that works on a list of dicts — exactly the shape of a real API response or test fixture. This is the pattern you will use constantly once you get to Pytest and API testing: a helper function, called from a test, that returns something the test can check.'
      ],
      tasks:[
        {
          id:'cp2-t1', title:'Filter valid prices',
          goal:'Write a function <code>is_valid_price(price)</code> that returns <code>True</code> if <code>price</code> is greater than 0, otherwise <code>False</code>. Given <code>prices = [25, -5, 40, 0, 15]</code>, use the function to print only the valid prices, one per line.',
          hint:'Define the function first. Then loop over <code>prices</code>, and for each one call <code>is_valid_price(p)</code> inside an <code>if</code> to decide whether to print it.',
          starter:
`# Task: define is_valid_price(price) -> True if price > 0, else False

prices = [25, -5, 40, 0, 15]

# Task: loop over prices, print only the ones where is_valid_price(p) is True
`,
          check(out){
            const m = matchEn(out, '25\n40\n15'); if(m) return m;
            return {ok:false, msg:'Expected <code>25</code>, <code>40</code>, <code>15</code> on separate lines, in that order. Check that is_valid_price returns a comparison, and that you call it inside the loop.'};
          }
        },
        {
          id:'cp2-t2', title:'Cart total with quantities',
          goal:'Write a function <code>calc_cart_total(cart)</code> that loops over a list of product dicts (each with <code>"price"</code> and <code>"qty"</code>), sums <code>price * qty</code> for all of them, and returns the total. Then print <code>calc_cart_total(cart)</code> for <code>cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}, {"name": "Monitor", "price": 150, "qty": 1}]</code>.',
          hint:'Inside the function: a running total starting at 0, a loop over <code>cart</code>, and for each <code>item</code> add <code>item["price"] * item["qty"]</code>. Return the total after the loop — do not print it inside the function.',
          starter:
`def calc_cart_total(cart):
    # Task: sum price * qty for every item in cart, return the total

cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}, {"name": "Monitor", "price": 150, "qty": 1}]
print(calc_cart_total(cart))
`,
          check(out){
            const m = matchEn(out, '245'); if(m) return m;
            return {ok:false, msg:'Expected <code>245</code> — (25*2) + (45*1) + (150*1). Check the function multiplies price by qty for every item and returns the sum.'};
          }
        },
        {
          id:'cp2-t3', title:'Find the cheapest product',
          goal:'Write a function <code>find_cheapest(catalog)</code> that loops over a list of product dicts and returns the NAME of the one with the lowest price. Then print <code>find_cheapest(catalog)</code> for <code>catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}, {"name": "Webcam", "price": 15}]</code>.',
          hint:'<code>min()</code> only compares plain numbers here, not dicts — you have to track the cheapest one yourself. Start by assuming the first product is the cheapest (<code>catalog[0]</code>), then loop and update your tracked name and price whenever you find something cheaper.',
          starter:
`def find_cheapest(catalog):
    # Task: track the name and price of the cheapest product as you loop, return the name

catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}, {"name": "Webcam", "price": 15}]
print(find_cheapest(catalog))
`,
          check(out){
            const m = matchEn(out, 'Webcam'); if(m) return m;
            return {ok:false, msg:'Expected <code>Webcam</code> — it has the lowest price (15). Check you update BOTH the tracked name and the tracked price together whenever you find a cheaper product.'};
          }
        },
        {
          id:'cp2-t4', title:'Cart eligibility report',
          goal:'Write a function <code>cart_report(cart)</code> that sums <code>price * qty</code> for every item in <code>cart</code>, and returns the string <b>"Total: N, Free shipping: Yes"</b> if the total is 100 or more, otherwise <b>"Total: N, Free shipping: No"</b>. Print <code>cart_report(cart)</code> for <code>cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}]</code>.',
          hint:'Reuse the total-summing loop from the earlier task, then a plain <code>if</code>/<code>else</code> deciding which f-string to return. The function needs exactly one <code>return</code> in each branch — no need for anything fancier.',
          starter:
`def cart_report(cart):
    # Task: sum price * qty for every item into total
    # Then return "Total: <total>, Free shipping: Yes" if total >= 100
    # Otherwise return "Total: <total>, Free shipping: No"

cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}]
print(cart_report(cart))
`,
          check(out){
            const m = matchEn(out, 'Total: 95, Free shipping: No'); if(m) return m;
            return {ok:false, msg:'Expected <code>Total: 95, Free shipping: No</code> — total is 25*2 + 45*1 = 95, which is below 100. Check both the total calculation and the 100 threshold.'};
          }
        }
      ]
    },
    {
      id:'m6', num:6, phase:'Python basics', title:'Environment setup',
      desc:'installing Python for real — VS Code, running files, git, first push',
      theory:[
        'The browser sandbox was for speed — no install, instant feedback, learn the language fast. A real project needs a real interpreter, a real file, a real terminal and a real editor. That is what this module sets up: real Python, VS Code, and git — the exact same tools you will use to build the AutoQuest Test Framework starting in a few modules.',
        'Install Python from <code>python.org</code> (3.12 or newer). To confirm it worked, open a terminal and run <code>python --version</code> (on some systems it is <code>python3 --version</code>) — it should print something like <code>Python 3.12.4</code>. This terminal command is completely different from the <code>print()</code> you have been using: <code>python --version</code> asks the INSTALLED PROGRAM about itself, it does not run any of your code.',
        'VS Code is a code editor with a Python extension (install it from the Extensions panel — look for the official one by Microsoft). Once installed, opening a <code>.py</code> file gives you a Run button, and VS Code\'s own integrated terminal lets you run <code>python file.py</code> directly — same result, two ways to trigger it.',
        'Git tracks snapshots of a folder over time: <code>git init</code> turns a folder into a repository, <code>git add file.py</code> stages a file for the next snapshot, <code>git commit -m "message"</code> saves that snapshot with a description. This AutoQuest site itself lives in a git repository exactly like this — every module you have completed so far exists as a commit history you could inspect.',
        'GitHub hosts your repository online so it is not just on one machine. <code>git push</code> uploads your local commits there. This matters for two reasons: it is a backup, and — starting a few modules from now — it is what lets an automated pipeline (CI) run your tests every time you push, instead of you running them by hand.',
        'A few real Python features do not exist in this sandbox on purpose (it is a teaching subset, remember?) — slicing (<code>list[1:3]</code>), <code>.items()</code>, tuple unpacking, <code>*args</code>. Several tasks below show you real code using them and ask you to predict the output, the same way the "predict" tasks worked before — except now nothing runs in the browser, because this is real Python, not the sandbox.'
      ],
      tasks:[
        {
          id:'m6-t1', kind:'checklist', title:'Install real Python',
          goal:'Install Python 3.12 or newer from <code>python.org</code>. Open a terminal and run <code>python --version</code> (or <code>python3 --version</code>) — confirm it prints a <code>Python 3.x.x</code> line. Mark this done once you see that output.',
          hint:'On Windows, during install, tick "Add python.exe to PATH" — otherwise the terminal will not find the <code>python</code> command afterward.'
        },
        {
          id:'m6-t2', kind:'checklist', title:'Install VS Code and the Python extension',
          goal:'Install VS Code, then open the Extensions panel (the icon with four squares in the sidebar) and install the official <b>Python</b> extension by Microsoft. Mark this done once it shows as installed.',
          hint:'You can also install it from the command line with <code>code --install-extension ms-python.python</code> if you prefer not to click through the UI.'
        },
        {
          id:'m6-t3', kind:'checklist', title:'Run your first real .py file',
          goal:'Create a folder called <code>autoquest-practice</code>, open it in VS Code, create a file <code>hello.py</code> containing <code>print("Hello from real Python")</code>, and run it — either with the Run button in VS Code, or by typing <code>python hello.py</code> in a terminal opened in that folder. Mark this done once you see the message printed in a REAL terminal, not this browser sandbox.',
          hint:'If <code>python hello.py</code> says the file is not found, your terminal is probably not open in the <code>autoquest-practice</code> folder — check the current directory first.'
        },
        {
          id:'m6-t4', kind:'predict', offline:true, title:'Predict: real slicing',
          goal:'This uses a real Python feature (slicing) that this sandbox does not support. Read the code, predict the output as it would run in the real Python you just installed, then check yourself.',
          hint:'<code>list[1:3]</code> takes items starting at index 1, up to (not including) index 3 — so items at index 1 and 2.',
          code:
`nums = [10, 20, 30, 40, 50]
print(nums[1:3])
`,
          expected: '[20, 30]'
        },
        {
          id:'m6-t5', kind:'predict', offline:true, title:'Predict: real dict.items()',
          goal:'Real Python dicts have an <code>.items()</code> method this sandbox does not implement. Read the code and predict the output.',
          hint:'<code>.items()</code> gives you both the key and the value together on each pass of the loop — no need for <code>settings[key]</code> lookups like you did before.',
          code:
`settings = {"env": "staging", "retries": 3}
for key, value in settings.items():
    print(key, value)
`,
          expected: 'env staging\nretries 3'
        },
        {
          id:'m6-t6', kind:'predict', offline:true, title:'Predict: tuple unpacking',
          goal:'Real Python lets you unpack a tuple into several variables in one line — this sandbox does not support it. Read the code and predict the output.',
          hint:'<code>x, y = point</code> takes the two values out of the tuple <code>point</code> and assigns them to <code>x</code> and <code>y</code> in order.',
          code:
`point = (3, 7)
x, y = point
print(x + y)
`,
          expected: '10'
        },
        {
          id:'m6-t7', kind:'checklist', title:'Turn the folder into a git repository',
          goal:'Inside <code>autoquest-practice</code>, run <code>git init</code>, then <code>git add hello.py</code>, then <code>git commit -m "first commit"</code>. Confirm it worked by running <code>git log</code> — you should see your commit listed. Mark this done once you see it.',
          hint:'If <code>git commit</code> asks you to configure <code>user.name</code>/<code>user.email</code> first, that is normal for a brand new machine — follow the exact command it prints, then try the commit again.'
        },
        {
          id:'m6-t8', kind:'checklist', title:'Push to GitHub',
          goal:'Create a new empty repository on GitHub (any name, e.g. <code>autoquest-practice</code>) — do not initialize it with a README. Follow GitHub\'s own instructions to connect your local folder as <code>origin</code> and run <code>git push -u origin main</code> (or <code>master</code>, depending on your default branch name). Confirm your <code>hello.py</code> file shows up on the GitHub page. Mark this done once you see it there.',
          hint:'If <code>push</code> is rejected or asks for credentials in a way that fails, GitHub now requires a personal access token instead of your account password for this — GitHub\'s own push instructions page explains how to set one up.'
        },
        {
          id:'m6-t9', kind:'predict', offline:true, title:'Predict: *args collects extra arguments',
          goal:'Real Python lets a function accept any number of arguments with <code>*args</code> — this sandbox does not support it. Read the code and predict the output.',
          hint:'<code>*args</code> collects every argument passed into the function as a tuple of numbers; <code>sum(args)</code> adds them all up, how ever many there are.',
          code:
`def total(*args):
    return sum(args)

print(total(10, 20, 30))
`,
          expected: '60'
        },
        {
          id:'m6-t10', kind:'predict', offline:true, boss:true, title:'Predict: sorted() and slicing together',
          goal:'Combine two real-Python-only features: <code>sorted()</code> and slicing. Read the code and predict the exact output.',
          hint:'<code>sorted(durations)</code> returns a NEW list in ascending order, without changing <code>durations</code> itself (unlike <code>.sort()</code> from Module 5, which sorts in place). Then <code>[:3]</code> takes the first three items of that new sorted list.',
          code:
`durations = [12, 45, 8, 30, 5]
fastest_three = sorted(durations)[:3]
print(fastest_three)
`,
          expected: '[5, 8, 12]'
        }
      ],
      homework:[
        {
          id:'m6-hw1', kind:'checklist', title:'Use the integrated terminal',
          goal:'Open VS Code\'s own integrated terminal (View → Terminal, or the shortcut it shows there) instead of a separate terminal window, and run both <code>python --version</code> and <code>git --version</code> inside it. Mark this done once both work from inside VS Code.',
          hint:'Everything you have done in a separate terminal so far also works inside VS Code\'s integrated one — that is the whole point of using it day to day.'
        },
        {
          id:'m6-hw2', kind:'predict', offline:true, title:'Predict: self-documenting f-strings',
          goal:'Real Python f-strings (3.8+) have a debugging shortcut this sandbox does not support. Read the code and predict the exact output.',
          hint:'Adding <code>=</code> right before the closing <code>}</code> in an f-string prints both the expression AND its value, exactly as written — handy for quick debugging without writing a full message yourself.',
          code:
`x = 5
print(f"{x=}")
`,
          expected: 'x=5'
        },
        {
          id:'m6-hw3', kind:'checklist', title:'Edit, commit, push again',
          goal:'Change the message in <code>hello.py</code> to something else, save it, then <code>git add</code>, <code>git commit -m "..."</code> and <code>git push</code> again. Confirm the updated file shows on GitHub. Mark this done once it does — this edit → commit → push loop is exactly what you will repeat constantly once building the real test framework.',
          hint:'You do not need <code>git init</code> or to reconnect <code>origin</code> again — that setup only happens once per repository. This time it is just add, commit, push.'
        }
      ]
    },
    {
      id:'m7', num:7, phase:'Python basics', title:'OOP: classes and objects',
      desc:'classes, objects, attributes and methods — the foundation of Page Object and fixtures',
      theory:[
        'This sandbox does not understand <code>class</code> at all — every task in this module runs in the real Python and VS Code you set up in Module 6. That also means real errors from here on: an actual Python traceback, not this site\'s friendly explanations. Reading those for real, right now while the stakes are low, is exactly the skill you will lean on later.',
        'A <code>class</code> is a blueprint; an object (an "instance") is one concrete thing built from it. <code>def __init__(self, name, price):</code> is the constructor — it runs automatically the moment you create an object, and sets up its starting attributes: <code>self.name = name</code> stores the value on THIS particular object.',
        '<code>self</code> is just "this specific object" — Python passes it automatically as the first argument to every method, you never pass it yourself when calling. <code>product.price_with_tax()</code> quietly becomes <code>Product.price_with_tax(product)</code> under the hood — <code>self</code> IS <code>product</code> inside that method.',
        'Attributes (<code>self.name</code>, <code>self.price</code>) hold an object\'s data; methods (functions defined inside the class, with <code>self</code> as the first parameter) are what it can DO. Two objects from the same class have completely separate attributes — changing one never affects the other, even though they share the same blueprint.',
        'This is the exact shape of a Page Object, the pattern you will use constantly once you get to Selenium/Playwright: a class per page, attributes for things like the base URL, methods for actions you can take on that page (<code>login()</code>, <code>search(query)</code>) — instead of copy-pasting raw browser commands into every test.',
        'A method can call another method on the same object through <code>self</code> — <code>self.total()</code> inside another method of the same class. This is how you build small pieces that combine, exactly like functions did in Module 4, except now they carry shared state (the object\'s attributes) between them automatically.'
      ],
      tasks:[
        {
          id:'m7-t1', kind:'checklist', title:'Your first class',
          goal:'In a new file, write <code>class Product:</code> with <code>__init__(self, name, price)</code> that stores both as attributes. Create <code>mouse = Product("Mouse", 25)</code> and print <code>f"{mouse.name}: ${mouse.price}"</code>. Run it — confirm you see <b>Mouse: $25</b>. Mark this done once you do.',
          hint:'<code>def __init__(self, name, price): self.name = name; self.price = price</code> — each on its own line, indented inside the class. Then access with <code>mouse.name</code>, not just <code>name</code>.'
        },
        {
          id:'m7-t2', kind:'checklist', title:'Add a method',
          goal:'Add a method <code>price_with_tax(self)</code> to <code>Product</code> that returns <code>self.price * 1.2</code>. Print <code>mouse.price_with_tax()</code> for a product priced at 25 — confirm you see <b>30.0</b>.',
          hint:'A method is defined exactly like a function, just indented inside the class, with <code>self</code> as its first parameter — even though you never pass it yourself when calling <code>mouse.price_with_tax()</code>.'
        },
        {
          id:'m7-t3', kind:'predict', offline:true, title:'Predict: separate objects, separate state',
          goal:'Read the code and predict the exact two-line output, then check yourself in real Python.',
          hint:'<code>a</code> and <code>b</code> are built from the same class, but they are two different objects — each has its own <code>self.count</code>, completely independent of the other.',
          code:
`class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1

a = Counter()
b = Counter()
a.increment()
a.increment()
b.increment()
print(a.count)
print(b.count)
`,
          expected: '2\n1'
        },
        {
          id:'m7-t4', kind:'checklist', title:'Read a real TypeError',
          goal:'Run this exact code (copy it as-is) and read the real traceback it produces — it complains about the number of arguments to <code>greet</code>. Figure out what is missing from the method definition, fix it, and run again until you see <b>Hello, Alex!</b>',
          hint:'Every method needs <code>self</code> as its first parameter, even ones that do not use any other input. The traceback\'s "positional arguments" wording is real Python\'s way of describing that mismatch.',
          starter:
`class Greeter:
    def __init__(self, name):
        self.name = name

    def greet():
        return f"Hello, {self.name}!"

g = Greeter("Alex")
print(g.greet())
`
        },
        {
          id:'m7-t5', kind:'checklist', title:'A tiny Page Object',
          goal:'Write <code>class LoginPage:</code> with <code>__init__(self, base_url)</code> storing <code>base_url</code>, and a method <code>login_url(self)</code> returning <code>f"{self.base_url}/login"</code>. Create <code>page = LoginPage("https://automationexercise.com")</code> and print <code>page.login_url()</code> — confirm you see <b>https://automationexercise.com/login</b>.',
          hint:'This is the actual shape of a Page Object: an attribute for the URL, a method for a specific action on that page. Selenium/Playwright modules later reuse exactly this pattern with real browser commands inside the methods.'
        },
        {
          id:'m7-t6', kind:'checklist', title:'Cart as a class',
          goal:'Write <code>class Cart:</code> with <code>__init__(self)</code> setting <code>self.items = []</code>, a method <code>add_item(self, name, price)</code> that appends <code>{"name": name, "price": price}</code> to <code>self.items</code>, and a method <code>total(self)</code> that loops over <code>self.items</code> and returns the sum of the prices. Add two items priced 25 and 45, print <code>cart.total()</code> — confirm you see <b>70</b>.',
          hint:'Same accumulator pattern from Module 3 (a running total, a loop, <code>total += item["price"]</code>) — just living inside a method now instead of a standalone script.'
        },
        {
          id:'m7-t7', kind:'checklist', title:'Eligible for free shipping?',
          goal:'Add a method <code>free_shipping_eligible(self)</code> to <code>Cart</code> that returns <code>True</code> if <code>self.total()</code> is 100 or more, otherwise <code>False</code>. Add items priced 60 and 45, print <code>cart.free_shipping_eligible()</code> — confirm you see <b>True</b>.',
          hint:'Inside <code>free_shipping_eligible</code>, call <code>self.total()</code> the same way you would call any other method — no need to redo the summing loop, reuse what <code>total()</code> already does.'
        },
        {
          id:'m7-t8', kind:'predict', offline:true, title:'Predict: a method calling another method',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'<code>summary()</code> calls <code>self.total()</code> internally — it does not repeat the summing loop, it just reuses the other method through <code>self</code>, exactly like you did in the previous task.',
          code:
`class Cart:
    def __init__(self):
        self.items = []

    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})

    def total(self):
        total = 0
        for item in self.items:
            total += item["price"]
        return total

    def summary(self):
        return f"Cart total: {self.total()}"

cart = Cart()
cart.add_item("Mouse", 25)
cart.add_item("Webcam", 65)
print(cart.summary())
`,
          expected: 'Cart total: 90'
        },
        {
          id:'m7-t9', kind:'checklist', title:'Two independent carts',
          goal:'Create two separate <code>Cart</code> instances, add different items to each (make sure the totals differ), and print both totals to CONFIRM they are independent — changing one cart\'s items must never affect the other\'s total.',
          hint:'If both totals come out the same or one affects the other, you probably created only one <code>Cart</code> and reused it, or copied a reference instead of calling <code>Cart()</code> twice.'
        },
        {
          id:'m7-t10', kind:'checklist', boss:true, title:'Test suite report as a class',
          goal:'Write <code>class TestSuiteReport:</code> with <code>__init__(self, results)</code> storing the list, and a method <code>summary(self)</code> that loops over <code>self.results</code>, counts <code>"pass"</code> vs anything else, and returns EXACTLY two lines: <b>Passed: N</b> and <b>Failed: N</b> (as one string, joined with <code>\\n</code>). Test it with <code>["pass", "fail", "pass", "pass", "fail"]</code> — confirm you see <b>Passed: 3</b> then <b>Failed: 2</b>.',
          hint:'This is the exact counting pattern from the Module 3 checkpoint (loop + if/else + two counters) — now packaged as a method that owns its own data via <code>self.results</code>, instead of a script with loose variables.'
        }
      ],
      homework:[
        {
          id:'m7-hw1', kind:'checklist', title:'Refactor a function into a class',
          goal:'Write <code>class PriceValidator:</code> with a method <code>is_valid(self, price)</code> that returns <code>True</code> if <code>price &gt; 0</code>, otherwise <code>False</code> (the same logic as <code>is_valid_price</code> from the Module 5 checkpoint, now as a method). Print the result for 25 and for -5 — confirm <b>True</b> then <b>False</b>.',
          hint:'Notice this class has no <code>__init__</code> at all — not every class needs one if there is no state to set up on creation.'
        },
        {
          id:'m7-hw2', kind:'predict', offline:true, title:'Predict: __init__ runs immediately',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'<code>__init__</code> is not something you call yourself — it runs automatically the instant <code>Logger()</code> is evaluated, before anything after that line.',
          code:
`class Logger:
    def __init__(self):
        print("Logger started")

log = Logger()
print("Ready")
`,
          expected: 'Logger started\nReady'
        },
        {
          id:'m7-hw3', kind:'checklist', title:'A page that knows its own state',
          goal:'Add a method <code>is_secure(self)</code> to your <code>LoginPage</code> class from earlier, returning <code>self.base_url.startswith("https")</code>. Then, using <code>if page.is_secure():</code>, print <code>"Secure:", page.login_url()</code> in the True branch and <code>"Insecure:", page.login_url()</code> in the False branch. Confirm the output for <code>"https://automationexercise.com"</code> is <b>Secure: https://automationexercise.com/login</b>.',
          hint:'<code>.startswith("https")</code> is a real Python string method — it checks whether the string begins with that exact text, returning True or False directly, just like the comparisons you have used all along.'
        }
      ]
    },
    {id:'m8', num:8, phase:'Python basics', title:'Standard library and generators', desc:'useful built-in modules, iterators and generators'},
    {id:'m9', num:9, phase:'Automated tests in Python', title:'Pytest', desc:'running tests, assert, fixtures, parametrization'},
    {id:'m10', num:10, phase:'Automated tests in Python', title:'Mocks and stubs', desc:'faking dependencies: mock, stub — when and why'},
    {id:'m11', num:11, phase:'Automation tooling', title:'API testing', desc:'checking requests and responses with requests'},
    {id:'m12', num:12, phase:'Automation tooling', title:'Databases', desc:'checking data in a DB straight from tests'},
    {id:'m13', num:13, phase:'Automation tooling', title:'Locators and Selenium', desc:'finding elements and automating the browser'},
    {id:'m14', num:14, phase:'Automation tooling', title:'Playwright', desc:'modern browser automation'},
    {id:'m15', num:15, phase:'Automation tooling', title:'Test framework architecture', desc:'building a maintainable autotest project'}
  ];
