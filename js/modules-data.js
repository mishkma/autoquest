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
        {
          text:'<code>print(...)</code> prints to the console whatever is inside the parentheses. This is how you "see" a result — and in a real project, it is the simplest way to log what a test is doing.',
          examples:[
            {label:'Simple', code:'print("Hello")', result:'Hello'},
            {label:'In practice', kind:'real', code:'print("Login test:", "PASSED")', result:'Login test: PASSED'}
          ]
        },
        {
          text:'A variable is a labeled box for a value: <code>name = "Anna"</code> puts a string into the variable <code>name</code>. The value can be overwritten later — <code>name = "Bob"</code> — and whatever is inside it right now is what <code>print(name)</code> shows.',
          examples:[
            {label:'Simple', code:'name = "Anna"\nprint(name)', result:'Anna'},
            {label:'In practice', kind:'real', code:'test_name = "test_login"\nprint(test_name)', result:'test_login'}
          ]
        },
        {
          text:'The type of a value matters: <code>"5"</code> is a string (text), while <code>5</code> is a number — they cannot be added directly with <code>+</code>, and they are never equal to each other. A number itself can be a whole number — <code>5</code> (<code>int</code>) — or a fractional one — <code>5.0</code> (<code>float</code>); those two ARE considered equal.',
          examples:[
            {label:'Simple', code:'print(5 == 5.0)', result:'True'},
            {label:'In practice', kind:'real', code:'print(200 == "200")', result:'False'}
          ]
        },
        {
          text:'An f-string inserts values right into text: put an <code>f</code> right before the opening quote, then any variable name inside <code>{curly braces}</code> gets replaced by its value. You can even compute inside the braces, like <code>{a + b}</code>.',
          examples:[
            {label:'Simple', code:'age = 30\nprint(f"Age: {age}")', result:'Age: 30'},
            {label:'In practice', kind:'real', code:'passed = 8\ntotal = 10\nprint(f"Pass rate: {passed}/{total}")', result:'Pass rate: 8/10'}
          ]
        },
        {
          text:'Arithmetic: <code>+ - * /</code> work as in math, but <code>/</code> ALWAYS gives a fractional number, even when it divides evenly. <code>//</code> is integer division (drops the fraction), <code>%</code> is the remainder — both handy when splitting something into equal groups.',
          examples:[
            {label:'Simple', code:'print(10 / 2)', result:'5.0'},
            {label:'In practice', kind:'real', code:'items = 23\nper_page = 10\nprint(items % per_page)', result:'3'}
          ]
        },
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
          goal:'This code crashes with a NameError. Before you fix it, find the exact mismatch and put into one sentence why Python cannot find that name — that habit matters more than the fix itself. Then fix it so it prints: <b>5</b>',
          reasonPrompt:'Why can\'t Python find <code>cont</code>?',
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
        {
          text:'<code>if condition:</code> runs the indented block only when the condition is true. A colon at the end of the line and a 4-space indent for the block are both required.',
          examples:[
            {label:'Simple', code:'x = 5\nif x > 0:\n    print("positive")', result:'positive'},
            {label:'In practice', kind:'real', code:'status = 500\nif status >= 500:\n    print("Server error")', result:'Server error'}
          ]
        },
        {
          text:'Comparisons return <code>True</code> or <code>False</code>: <code>==</code> equal, <code>!=</code> not equal, plus <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>. This is the exact mechanism behind every "expected vs actual" check an automated test makes.',
          examples:[
            {label:'Simple', code:'print(5 == 5)', result:'True'},
            {label:'In practice', kind:'real', code:'expected = "PASS"\nactual = "FAIL"\nprint(expected == actual)', result:'False'}
          ]
        },
        {
          text:'<code>else</code> means "otherwise", <code>elif</code> means "else if". In an <code>if / elif / elif / else</code> chain, only the FIRST matching branch runs — Python never even looks at the rest once one has matched.',
          examples:[
            {label:'Simple', code:'if 5 > 3:\n    print("yes")\nelse:\n    print("no")', result:'yes'},
            {label:'In practice', kind:'real', code:'score = 72\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("F")', result:'B'}
          ]
        },
        {
          text:'<code>and</code> / <code>or</code> / <code>not</code> combine conditions: <code>and</code> — both at once, <code>or</code> — at least one, <code>not</code> — flips it.',
          examples:[
            {label:'Simple', code:'print(3 > 0 and 3 < 10)', result:'True'},
            {label:'In practice', kind:'real', code:'is_ci = True\nis_flaky = False\nprint(is_ci and not is_flaky)', result:'True'}
          ]
        },
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
          reasonPrompt:'Why can\'t a single <code>=</code> go inside a condition?',
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
        {
          text:'<code>for i in range(5):</code> repeats the block 5 times, and <code>i</code> takes on 0, 1, 2, 3, 4 in turn — Python counts from zero. <code>range(start, stop, step)</code> lets you control all three; the <code>stop</code> value is never included.',
          examples:[
            {label:'Simple', code:'for i in range(3):\n    print(i)', result:'0\n1\n2'},
            {label:'In practice', kind:'real', code:'for i in range(2, 10, 2):\n    print(i)', result:'2\n4\n6\n8'}
          ]
        },
        {
          text:'<code>while condition:</code> repeats the block while the condition stays True. Forgetting to change whatever the condition depends on turns the loop infinite — a common beginner mistake.',
          examples:[
            {label:'Simple', code:'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', result:'0\n1\n2'},
            {label:'In practice', kind:'real', code:'attempt = 1\nwhile attempt <= 3:\n    print(f"Attempt {attempt}")\n    attempt += 1', result:'Attempt 1\nAttempt 2\nAttempt 3'}
          ]
        },
        {
          text:'<code>+=</code> is shorthand for "add and store": <code>total += x</code> is the same as <code>total = total + x</code>. Create the counter BEFORE the loop (e.g. <code>total = 0</code>), then increase it inside the loop.',
          examples:[
            {label:'Simple', code:'total = 0\ntotal += 5\nprint(total)', result:'5'},
            {label:'In practice', kind:'real', code:'durations = [4, 7, 3]\ntotal = 0\nfor d in durations:\n    total += d\nprint(total)', result:'14'}
          ]
        },
        {
          text:'<code>break</code> immediately stops the whole loop — useful once what you were looking for has been found, so there is no need to check the rest.',
          examples:[
            {label:'Simple', code:'for i in range(5):\n    if i == 3:\n        break\n    print(i)', result:'0\n1\n2'},
            {label:'In practice', kind:'real', code:'tests = ["login", "search", "checkout"]\nfor t in tests:\n    if t == "checkout":\n        print("Found:", t)\n        break', result:'Found: checkout'}
          ]
        },
        {
          text:'<code>continue</code> skips the rest of the CURRENT iteration and jumps straight to the next one — code after <code>continue</code> does not run for that pass, but the loop itself keeps going.',
          examples:[
            {label:'Simple', code:'for i in range(5):\n    if i == 2:\n        continue\n    print(i)', result:'0\n1\n3\n4'},
            {label:'In practice', kind:'real', code:'results = ["pass", "fail", "pass"]\nfor r in results:\n    if r == "pass":\n        continue\n    print("Failed test found")', result:'Failed test found'}
          ]
        },
        'The tasks below are of different kinds, plus "Homework" at the end (does not gate progress, but gives XP and practice).'
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
          reasonPrompt:'Why does this loop\'s condition never become False?',
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
        {
          text:'<code>def</code> declares a function — a named chunk of code you can call as many times as you like instead of copying it over and over.',
          examples:[
            {label:'Simple', code:'def square(x):\n    return x * x\nprint(square(5))', result:'25'},
            {label:'In practice', kind:'real', code:'def calc_total(price, qty):\n    return price * qty\nprint(calc_total(10, 3))', result:'30'}
          ]
        },
        {
          text:'Parameters are placeholder names inside a function that receive values (arguments) at call time — <code>calc_total(10, 3)</code> makes <code>price</code> become 10 and <code>qty</code> become 3 inside the function, for that one call only.',
          examples:[
            {label:'Simple', code:'def greet(name):\n    return f"Hi, {name}"\nprint(greet("Sam"))', result:'Hi, Sam'},
            {label:'In practice', kind:'real', code:'def is_valid_status(code):\n    return code == 200\nprint(is_valid_status(200))', result:'True'}
          ]
        },
        {
          text:'<code>return</code> is not the same as <code>print</code>. <code>print</code> just displays a value on screen, while <code>return</code> hands the value back to wherever the function was called from, so it can be used further. A function with no <code>return</code> returns <code>None</code> — printing that result shows it plainly.',
          examples:[
            {label:'Simple', code:'def add(a, b):\n    return a + b\nprint(add(2, 3))', result:'5'},
            {label:'In practice', kind:'real', code:'def broken(a, b):\n    print(a + b)\n\nresult = broken(2, 3)\nprint(result)', result:'5\nNone'}
          ]
        },
        {
          text:'Inside a function you can use <code>if</code>, loops — everything you already know. A function can compute differently depending on a condition, exactly like a script can.',
          examples:[
            {label:'Simple', code:'def abs_val(x):\n    if x < 0:\n        return -x\n    return x\nprint(abs_val(-5))', result:'5'},
            {label:'In practice', kind:'real', code:'def apply_discount(price, is_member):\n    if is_member:\n        return price * 0.9\n    return price\nprint(apply_discount(100, True))', result:'90.0'}
          ]
        },
        {
          text:'A variable created INSIDE a function (e.g. by assignment) exists only inside it — this is called a local variable. Even if there is a variable with the same name outside, assigning inside the function creates a separate, new variable and never touches the outer one.',
          examples:[
            {label:'Simple', code:'def f():\n    x = 1\n    return x\nprint(f())', result:'1'},
            {label:'In practice', kind:'real', code:'count = 0\n\ndef increment():\n    count = 1\n    return count\n\nincrement()\nprint(count)', result:'0'}
          ]
        },
        {
          text:'In automation, functions are a way to avoid repeating the same check code many times — write it once, reuse it across dozens of tests instead of copy-pasting.',
          examples:[
            {label:'In practice', kind:'real', code:'def is_valid_status(code):\n    return code == 200\nprint(is_valid_status(404))', result:'False'}
          ]
        },
        'The tasks below are of different kinds, plus "Homework" at the end.'
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
          reasonPrompt:'Why does the outer <code>print</code> get <code>None</code>?',
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
        {
          text:'Lists are already familiar from loops — now let\'s look at working with individual items. <code>products[0]</code> is the first item (indices start at zero), and <code>products[-1]</code> is the last item — a negative index counts from the end.',
          examples:[
            {label:'Simple', code:'nums = [10, 20, 30]\nprint(nums[0])', result:'10'},
            {label:'In practice', kind:'real', code:'products = ["mouse", "keyboard", "monitor"]\nprint(products[-1])', result:'monitor'}
          ]
        },
        {
          text:'<code>.append(x)</code> adds an item to the end of a list, <code>.pop()</code> removes the LAST item and returns it.',
          examples:[
            {label:'Simple', code:'cart = []\ncart.append("mouse")\nprint(cart)', result:"['mouse']"},
            {label:'In practice', kind:'real', code:'cart = ["mouse", "keyboard"]\nremoved = cart.pop()\nprint(removed)', result:'keyboard'}
          ]
        },
        {
          text:'A dictionary (<code>dict</code>) stores key-value pairs — handy for one structured object instead of a pile of separate variables. Access a value with square brackets and the key.',
          examples:[
            {label:'Simple', code:'product = {"name": "Mouse"}\nprint(product["name"])', result:'Mouse'},
            {label:'In practice', kind:'real', code:'product = {"name": "Mouse", "price": 25, "in_stock": True}\nprint(product["price"])', result:'25'}
          ]
        },
        {
          text:'<code>.get(key, default)</code> is a safe way to read from a dict: if the key is missing, it returns the default value instead of a <code>KeyError</code>.',
          examples:[
            {label:'Simple', code:'settings = {"env": "staging"}\nprint(settings.get("env"))', result:'staging'},
            {label:'In practice', kind:'real', code:'settings = {"env": "staging"}\nprint(settings.get("timeout", 30))', result:'30'}
          ]
        },
        {
          text:'<code>.keys()</code> and <code>.values()</code> give just the keys or just the values to loop over. This sandbox has no <code>.items()</code> — to get both at once, loop over <code>.keys()</code> and look up the value by key.',
          examples:[
            {label:'Simple', code:'d = {"a": 1}\nfor key in d.keys():\n    print(key)', result:'a'},
            {label:'In practice', kind:'real', code:'settings = {"currency": "USD", "tax_rate": 20}\nfor key in settings.keys():\n    print(f"{key}: {settings[key]}")', result:'currency: USD\ntax_rate: 20'}
          ]
        },
        {
          text:'A list of dictionaries represents a set of same-shaped objects, like a product catalog — loop over it just like a plain list. This is not a coincidence: a JSON response from a real API (the exact thing you will parse in Module 11) looks and behaves exactly like this in Python — a list of dicts, or a dict of dicts.',
          examples:[
            {label:'Simple', code:'catalog = [{"name": "Mouse"}]\nfor p in catalog:\n    print(p["name"])', result:'Mouse'},
            {label:'In practice', kind:'real', code:'catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]\nfor p in catalog:\n    print(p["name"])', result:'Mouse\nKeyboard'}
          ]
        }
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
          reasonPrompt:'Why can\'t <code>settings["discount"]</code> fail gracefully?',
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
          goal:'Inside <code>autoquest-practice</code>, run <code>git init</code>. BEFORE committing, run <code>git config user.email</code> to see what email git will use here — if it shows a work email and this is a personal project, fix it just for this folder with <code>git config user.email "you@example.com"</code> (no <code>--global</code>). Then <code>git add hello.py</code> and <code>git commit -m "first commit"</code>. Confirm it worked with <code>git log</code>. Mark this done once you see your commit listed under the email you actually wanted.',
          hint:'Git often auto-fills your identity from machine-wide settings — on a work laptop that is frequently your work email, even for a personal repo. Checking BEFORE the first commit is much easier than fixing it in already-pushed history later.'
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
    {
      id:'m8', num:8, phase:'Python basics', title:'Standard library and generators',
      desc:'useful built-in modules, iterators and generators',
      theory:[
        'The standard library is a set of modules that ship with Python itself — no install needed, just <code>import</code>. This is different from a package like <code>requests</code> (Module 11), which you install separately with <code>pip</code>. Everything in this module is real Python only, same as Modules 6-7 — this sandbox does not support <code>import</code> at all.',
        '<code>json.dumps(obj)</code> turns a Python dict/list into a JSON text string; <code>json.loads(text)</code> turns JSON text back into Python objects. This is not a coincidence with Module 5\'s "list of dicts looks like JSON" note — this IS the conversion that happens automatically every time you call <code>.json()</code> on an API response later, just done by hand for now so you see it happen. One gotcha worth knowing now: Python\'s <code>True</code> becomes JSON\'s lowercase <code>true</code>.',
        '<code>random.randint(a, b)</code> gives a random whole number between <code>a</code> and <code>b</code> (both included); <code>random.choice(a_list)</code> picks one random item from a list. Generating test data — random IDs, random valid inputs — is one of the most common real uses of this module in an automation project.',
        '<code>datetime.now()</code> (from the <code>datetime</code> module) gives the current date and time. Automation code uses this constantly for things like timestamping a log line or giving a test-run report a unique name.',
        'A <b>generator</b> is a function that uses <code>yield</code> instead of <code>return</code> — calling it does not run the function body at all, it just creates a paused generator object. The body only starts running (and only runs up to the next <code>yield</code>) when you pull a value out of it, either with <code>next(gen)</code> or by looping over it with <code>for</code>. This matters for automation when you are producing a lot of test data or reading a huge file — a generator produces one item at a time instead of building the whole thing in memory first.',
        'A generator can only be gone through ONCE — once a <code>for</code> loop (or enough <code>next()</code> calls) has pulled every value out of it, looping over it again produces nothing at all. This trips people up constantly; better to know it now than debug it in a real test suite.'
      ],
      tasks:[
        {
          id:'m8-t1', kind:'checklist', title:'A dict becomes JSON text',
          goal:'Run <code>import json</code>, then <code>json.dumps({"name": "Mouse", "price": 25, "in_stock": True})</code>, print the result. Confirm you see <b>{"name": "Mouse", "price": 25, "in_stock": true}</b> — note the lowercase <code>true</code>, even though you wrote <code>True</code> in Python.',
          hint:'<code>json.dumps(...)</code> returns a string — store it in a variable and <code>print()</code> that variable to see it.'
        },
        {
          id:'m8-t2', kind:'checklist', title:'Parse JSON text back into Python',
          goal:'Given the text <code>raw = \'{"status": "pass", "duration": 12}\'</code>, use <code>json.loads(raw)</code> to turn it into a real Python dict, then print <code>data["status"]</code> and <code>data["duration"]</code>. Confirm you see <b>pass</b> then <b>12</b>.',
          hint:'Once parsed with <code>json.loads</code>, <code>data</code> behaves exactly like any dict you built by hand in Module 5 — same square-bracket access.'
        },
        {
          id:'m8-t3', kind:'checklist', title:'A random test data value',
          goal:'Run <code>import random</code>, then print <code>random.randint(1, 6)</code>. Run the whole file 3-4 times — confirm the number changes each time and always lands between 1 and 6.',
          hint:'There is no fixed expected output here on purpose — random data is random. What you are confirming is the RANGE, not one specific number.'
        },
        {
          id:'m8-t4', kind:'checklist', title:'Pick a random item',
          goal:'Given <code>names = ["Alice", "Bob", "Charlie", "Dana"]</code>, print <code>random.choice(names)</code>. Run it a few times — confirm you get a different name from the list on different runs.',
          hint:'<code>random.choice(a_list)</code> works on any list — same idea as <code>random.randint</code>, just picking an existing item instead of a number in a range.'
        },
        {
          id:'m8-t5', kind:'checklist', title:'The current timestamp',
          goal:'Run <code>from datetime import datetime</code>, then <code>now = datetime.now()</code>, then print <code>now.year</code>. Confirm it prints the current year.',
          hint:'<code>datetime.now()</code> returns an object with several pieces available separately — <code>.year</code>, <code>.month</code>, <code>.day</code>, and more — not just one combined timestamp.'
        },
        {
          id:'m8-t6', kind:'predict', offline:true, title:'Predict: a generator does not run until pulled',
          goal:'Read the code and predict the exact three-line output, then check yourself in real Python.',
          hint:'Creating <code>countdown()</code> does NOT run anything inside it yet — the body only starts once <code>next(gen)</code> actually asks for the first value. Watch where "created" lands relative to "starting".',
          code:
`def countdown():
    print("starting")
    yield 3
    yield 2
    yield 1

gen = countdown()
print("created")
first = next(gen)
print(first)
`,
          expected: 'created\nstarting\n3'
        },
        {
          id:'m8-t7', kind:'checklist', title:'Loop over a generator',
          goal:'Write the <code>countdown()</code> generator from the previous task (three <code>yield</code> statements: 3, 2, 1), then loop over it with <code>for n in countdown(): print(n)</code>. Confirm you see <b>3</b>, <b>2</b>, <b>1</b> on separate lines.',
          hint:'A <code>for</code> loop over a generator pulls values out of it automatically, one at a time, exactly like it does over a list — you never call <code>next()</code> yourself when using <code>for</code>.'
        },
        {
          id:'m8-t8', kind:'predict', offline:true, title:'Predict: a generator only works once',
          goal:'Read the code and predict the exact output — pay attention to whether the second loop prints anything at all.',
          hint:'Once the first <code>for</code> loop has pulled every value out of <code>gen</code>, there is nothing left in it — looping over the SAME generator object again finds it already empty.',
          code:
`def numbers():
    yield 1
    yield 2

gen = numbers()
for n in gen:
    print(n)
for n in gen:
    print(n)
`,
          expected: '1\n2'
        },
        {
          id:'m8-t9', kind:'checklist', title:'A random test case as JSON',
          goal:'Build a dict <code>{"id": random.randint(1000, 9999), "name": "test_login", "status": "pass"}</code>, then print it through <code>json.dumps(...)</code>. Confirm the printed text is valid JSON containing all three keys, with a different <code>id</code> each time you run it.',
          hint:'You need both <code>import json</code> and <code>import random</code> at the top of the file — combining two standard library modules in one script is completely normal.'
        },
        {
          id:'m8-t10', kind:'checklist', boss:true, title:'Test results from a generator',
          goal:'Write a generator <code>test_results()</code> that <code>yield</code>s three dicts, in order: <code>{"name": "test_login", "status": "pass"}</code>, <code>{"name": "test_logout", "status": "fail"}</code>, <code>{"name": "test_search", "status": "pass"}</code>. Loop over <code>test_results()</code>, count <code>"pass"</code> vs anything else, and print EXACTLY two lines: <b>Passed: 2</b> and <b>Failed: 1</b>.',
          hint:'This is the same counting pattern as the Module 3 checkpoint and the Module 7 boss task — the only new part is that the data comes one dict at a time out of a generator instead of already sitting in a list.'
        }
      ],
      homework:[
        {
          id:'m8-hw1', kind:'checklist', title:'A deliberate pause',
          goal:'Run <code>import time</code>, then <code>print("Starting")</code>, then <code>time.sleep(1)</code>, then <code>print("Done")</code>. Confirm there is roughly a one-second pause between the two lines printing.',
          hint:'<code>time.sleep(seconds)</code> is a REAL pause — nothing else runs during it. It is the blunt tool; once you reach Selenium/Playwright, you will use smarter waits that pause only as long as actually needed, not a fixed guess.'
        },
        {
          id:'m8-hw2', kind:'predict', offline:true, title:'Predict: next() resumes exactly where it left off',
          goal:'Read the code and predict the exact four-line output, then check yourself in real Python.',
          hint:'The first <code>next(gen)</code> runs the body up to (and including) the first <code>yield</code> — printing "step A" along the way. The SECOND <code>next(gen)</code> resumes from right after that <code>yield</code>, not from the top of the function again.',
          code:
`def steps():
    print("step A")
    yield "A"
    print("step B")
    yield "B"

gen = steps()
print(next(gen))
print(next(gen))
`,
          expected: 'step A\nA\nstep B\nB'
        },
        {
          id:'m8-hw3', kind:'checklist', title:'Sum prices from a JSON API response',
          goal:'Given <code>response = \'[{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]\'</code> (a string, exactly as it would arrive from a real API), use <code>json.loads(response)</code> to parse it, loop over the result, sum up the prices, and print the total. Confirm you see <b>70</b>.',
          hint:'Once parsed, this is EXACTLY the "list of dicts" shape from Module 5 — the summing loop is identical to what you already know, the only new step is the <code>json.loads</code> at the start.'
        }
      ]
    },
    {
      id:'m9', num:9, phase:'Automated tests in Python', title:'Pytest',
      desc:'running tests, assert, fixtures, parametrization',
      theory:[
        'Pytest is a TEST RUNNER: a program that finds and executes your test functions and reports which passed and which failed. A test is just a function whose name starts with <code>test_</code>, living in a file whose name starts with <code>test_</code>. Running <code>pytest</code> in a terminal inside that folder finds every one of them automatically — no need to call them yourself.',
        '<code>assert</code> is the real version of the ok/fail check this ENTIRE course has been simulating with its own <code>matchEn(...)</code> helper: <code>assert cart.total() == 70</code> does nothing if true, and raises an <code>AssertionError</code> if false — pytest catches that and reports the test as failed, showing you exactly what was compared.',
        'Install with <code>pip install pytest</code> — this is the first package from outside the standard library you have installed (Module 8 was all built-in; <code>requests</code> in Module 11 will be the same kind of install).',
        'A <b>fixture</b> is a function decorated with <code>@pytest.fixture</code> that sets something up once and hands it to any test that asks for it by naming it as a parameter. If five tests all need a pre-filled <code>Cart</code>, a fixture builds it once per test run instead of five tests each repeating the same setup code.',
        '<code>@pytest.mark.parametrize("price,expected", [(100, True), (50, False)])</code> runs the SAME test function once per row of data, instead of writing near-identical test functions for slightly different inputs. This is how a real suite covers many cases without copy-pasting a whole test each time.',
        'Reading a pytest failure is a real skill, not scary noise: it shows you the exact assert line, and often the actual values on both sides — <code>assert 71 == 70</code> tells you plainly that your code produced 71 when the test expected 70. Get comfortable reading this now; it is what every red run looks like from here on.'
      ],
      tasks:[
        {
          id:'m9-t1', kind:'checklist', title:'Install pytest',
          goal:'Run <code>pip install pytest</code>, then confirm it worked with <code>pytest --version</code> — it should print a version number. Mark this done once you see it.',
          hint:'If <code>pip</code> is not found, try <code>python -m pip install pytest</code> instead — same result, more explicit about which Python it installs into.'
        },
        {
          id:'m9-t2', kind:'checklist', title:'Your first passing test',
          goal:'Create a file <code>test_basic.py</code> with a function <code>test_addition()</code> that does <code>assert 2 + 2 == 4</code>. Run <code>pytest test_basic.py</code> in a terminal in that folder. Confirm the summary line says <b>1 passed</b>.',
          hint:'The file name and the function name both matter — pytest only discovers functions starting with <code>test_</code> inside files starting with <code>test_</code>.'
        },
        {
          id:'m9-t3', kind:'checklist', title:'Read a real failure on purpose',
          goal:'In a new file <code>test_fail.py</code>, write <code>def test_wrong(): assert 2 + 2 == 5</code>. Run <code>pytest test_fail.py</code> and read the output — find the line showing what was actually compared. Confirm you can point to where it says <b>1 failed</b> and the line showing the wrong assertion.',
          hint:'You are not fixing anything here — this task is purely about reading a real failure calmly, so the next one you see for real does not feel like an emergency.'
        },
        {
          id:'m9-t4', kind:'predict', offline:true, title:'Predict: a passing assert does nothing',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'When the condition after <code>assert</code> is true, absolutely nothing visible happens — execution just continues to the next line, exactly like an <code>if</code> whose condition was False and skipped its block.',
          code:
`x = 5
assert x == 5
print("passed")
`,
          expected: 'passed'
        },
        {
          id:'m9-t5', kind:'checklist', title:'Test a real Cart class',
          goal:'In <code>test_cart.py</code>, write the <code>Cart</code> class from Module 7 (<code>__init__</code>, <code>add_item</code>, <code>total</code>), then a function <code>test_cart_total()</code> that creates a cart, adds items priced 25 and 45, and asserts the total equals 70. Run <code>pytest test_cart.py</code> — confirm <b>1 passed</b>.',
          hint:'The class and the test function can live in the same file for now — splitting them into separate files comes later, once the reason for it (reuse across many test files) actually matters.'
        },
        {
          id:'m9-t6', kind:'checklist', title:'A fixture for the cart',
          goal:'Rewrite the previous file using a fixture: <code>@pytest.fixture def cart(): ...</code> that builds and returns a <code>Cart</code> with the same two items, then TWO test functions — <code>test_cart_total(cart)</code> asserting the total, and <code>test_cart_has_two_items(cart)</code> asserting <code>len(cart.items) == 2</code>. Run pytest — confirm <b>2 passed</b>.',
          hint:'Both test functions take <code>cart</code> as a parameter with that exact name — pytest matches it to the fixture function by name automatically, you never call the fixture yourself.'
        },
        {
          id:'m9-t7', kind:'predict', offline:true, title:'Predict: assert on parsed JSON',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'<code>json.loads(...)</code> gives you a real dict — <code>data["status"]</code> works exactly like every dict access you have done since Module 5, and the assert either passes silently or blows up.',
          code:
`import json
data = json.loads('{"status": "pass"}')
assert data["status"] == "pass"
print("ok")
`,
          expected: 'ok'
        },
        {
          id:'m9-t8', kind:'checklist', title:'Parametrize one test over multiple cases',
          goal:'Write <code>@pytest.mark.parametrize("price,expected", [(100, True), (50, False)])</code> above <code>def test_free_shipping(price, expected): assert (price >= 100) == expected</code>. Run pytest with <code>-v</code> (<code>pytest test_file.py -v</code>) — confirm you see TWO separate test results, both passing, one per row of data.',
          hint:'<code>-v</code> (verbose) makes pytest print one line per individual case instead of just a summary count — you should see the price value show up in each test\'s name.'
        },
        {
          id:'m9-t9', kind:'checklist', title:'A failing test finds a real bug',
          goal:'Run the <code>Cart</code> class and <code>test_cart_total</code> test below EXACTLY as given — it fails. Read the failure output to see what value <code>total()</code> actually produced, find the bug in the CLASS (not the test), fix it, and re-run until you see <b>1 passed</b>.',
          hint:'The failure output shows something like <code>assert 71 == 70</code> — one extra unit came from somewhere in <code>total()</code> that has nothing to do with the items themselves.',
          starter:
`class Cart:
    def __init__(self):
        self.items = []
    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})
    def total(self):
        total = 1
        for item in self.items:
            total += item["price"]
        return total

def test_cart_total():
    cart = Cart()
    cart.add_item("Mouse", 25)
    cart.add_item("Keyboard", 45)
    assert cart.total() == 70
`
        },
        {
          id:'m9-t10', kind:'checklist', boss:true, title:'A small real test suite',
          goal:'In one file, bring together everything from this module: the <code>Cart</code> class (from Module 7, with <code>add_item</code>, <code>total</code>, <code>free_shipping_eligible</code>), a <code>@pytest.fixture</code> providing a pre-filled cart, and at least THREE test functions using that fixture — one checking the total, one checking the item count, one checking free-shipping eligibility. Run <code>pytest -v</code> — confirm all of them show <b>PASSED</b>.',
          hint:'This is the exact shape a real test file for this class would take in a real project — nothing about the mechanics changes once the class gets more complex, only how many tests you write against it.'
        }
      ],
      homework:[
        {
          id:'m9-hw1', kind:'checklist', title:'Run a subset of tests by name',
          goal:'In a file with at least two differently-named test functions, run only one of them with <code>pytest test_file.py -k test_name_here</code> (replace with the real function name). Confirm the summary shows only 1 test ran, not all of them.',
          hint:'<code>-k</code> matches by substring, not exact name — useful when you want to re-run just the one test you are currently fixing without waiting for the whole suite.'
        },
        {
          id:'m9-hw2', kind:'checklist', title:'A custom assert message',
          goal:'Write a test that deliberately fails, with a custom message: <code>assert 1 == 2, "one is never two"</code>. Run it and confirm your custom message <b>"one is never two"</b> shows up in the failure output, alongside pytest\'s own comparison details.',
          hint:'The text after the comma only shows up when the assertion actually fails — it never appears on a passing test, so it costs nothing to add for the cases you expect might break.'
        },
        {
          id:'m9-hw3', kind:'checklist', title:'Split the class from its test',
          goal:'Create <code>cart.py</code> containing just the <code>Cart</code> class (no tests). In <code>test_cart.py</code>, add <code>from cart import Cart</code> at the top, then write your fixture and tests using that imported class instead of redefining it. Run pytest — confirm it still passes, now reading the class from a separate file.',
          hint:'Both files need to be in the same folder for a plain <code>from cart import Cart</code> to find it — this is the smallest possible version of the project structure a real test suite uses.'
        }
      ]
    },
    {
      id:'m10', num:10, phase:'Automated tests in Python', title:'Exception handling',
      desc:'try/except, raising your own errors, when to catch what',
      theory:[
        '<code>try: ... except SomeError: ...</code> is the real, controlled version of every traceback you have been reading since Module 6 and 7 — instead of the script dying, YOUR code decides what happens next. Code inside <code>try:</code> runs normally; if it raises the exact exception type named after <code>except</code>, the <code>except</code> block runs instead of crashing.',
        'Always name a SPECIFIC exception type — <code>except ValueError:</code>, not a bare <code>except:</code>. A bare <code>except:</code> catches literally everything, including bugs you never meant to hide, and turns a real crash into silent wrong behavior that is much harder to debug later.',
        '<code>else:</code> after a try/except runs only when NO exception happened; <code>finally:</code> runs no matter what — exception or not. <code>finally</code> is for cleanup that must always happen, like closing a connection, whether the test passed or blew up.',
        'You can raise your own exception on purpose with <code>raise ValueError("a clear message")</code> — this is how you fail fast with a message that actually explains what went wrong, instead of letting broken data silently propagate deeper into your code.',
        'In automation this is not optional politeness — it is how you tell the difference between "this specific, expected thing went wrong, handle it" (a flaky network call, a missing optional field) and "something is actually broken, let it crash loudly." Catching too much hides real bugs; catching too little makes your test helpers fragile.'
      ],
      tasks:[
        {
          id:'m10-t1', kind:'checklist', title:'Catch a real ZeroDivisionError',
          goal:'Wrap <code>print(10 / 0)</code> in a <code>try</code>/<code>except ZeroDivisionError:</code> that prints <b>Cannot divide by zero</b> instead of crashing. Run it — confirm you see that message, not a traceback.',
          hint:'<code>try:</code> then the risky line indented under it, then <code>except ZeroDivisionError:</code> at the same indent as <code>try</code>, with the fallback <code>print(...)</code> indented under that.'
        },
        {
          id:'m10-t2', kind:'checklist', title:'Catch a real ValueError',
          goal:'Wrap <code>age = int("abc")</code> in a <code>try</code>/<code>except ValueError:</code> that prints <b>Invalid number</b> instead of crashing. Run it — confirm you see that message.',
          hint:'<code>int("abc")</code> raises <code>ValueError</code> in real Python for the exact same reason your sandbox tasks warned about it back in Module 1 — text that is not a valid number cannot become one.'
        },
        {
          id:'m10-t3', kind:'predict', offline:true, title:'Predict: else runs only when nothing went wrong',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'<code>10 / 2</code> does not raise anything, so the <code>except</code> block is skipped entirely and the <code>else</code> block runs instead — <code>else</code> is not a generic fallback, it specifically means "no exception happened."',
          code:
`try:
    x = 10 / 2
except ZeroDivisionError:
    print("Error")
else:
    print("No error, result is", x)
`,
          expected: 'No error, result is 5.0'
        },
        {
          id:'m10-t4', kind:'checklist', title:'Wrong exception type still crashes',
          goal:'Run the exact code below — it still crashes with a real <code>ValueError</code>, even though there IS a <code>try</code>/<code>except</code>. Read the traceback, figure out why the except block did not catch it, fix the exception type, and re-run until you see <b>Handled</b>.',
          hint:'An <code>except</code> block only catches the EXACT exception type (or a parent of it) that it names — <code>except ZeroDivisionError:</code> does nothing at all for a <code>ValueError</code>, the crash just passes straight through it.',
          starter:
`try:
    age = int("abc")
except ZeroDivisionError:
    print("Handled")
`
        },
        {
          id:'m10-t5', kind:'predict', offline:true, title:'Predict: finally always runs',
          goal:'Read the code and predict the exact two-line output, then check yourself in real Python.',
          hint:'<code>finally</code> runs after the <code>try</code>/<code>except</code> is done, no matter which branch ran — think of it as "no matter what happened above, do this last."',
          code:
`try:
    print(10 / 0)
except ZeroDivisionError:
    print("Handled")
finally:
    print("Cleanup done")
`,
          expected: 'Handled\nCleanup done'
        },
        {
          id:'m10-t6', kind:'checklist', title:'A real retry loop',
          goal:'Write a function <code>flaky_call()</code> that raises <code>ConnectionError("Network issue")</code> most of the time (e.g. <code>if random.random() &lt; 0.7: raise ConnectionError(...)</code>), otherwise returns <code>"success"</code>. Using a <code>while</code> loop and <code>try</code>/<code>except ConnectionError</code>, retry up to 5 times, printing <b>Retry N</b> on each failure and the result on success, then stopping either way. Run it a few times — confirm you sometimes see it succeed after a few retries, and sometimes exhaust all 5.',
          hint:'This is the exact retry pattern from the Module 3 homework, with one addition: the thing that might fail is now wrapped in <code>try</code>/<code>except</code> instead of just being trusted to work.'
        },
        {
          id:'m10-t7', kind:'checklist', title:'Read your own raised error',
          goal:'Run the code below EXACTLY as given — it deliberately crashes. Read the traceback and confirm you can find your own custom message, <b>"Age cannot be negative"</b>, inside it, right next to <code>ValueError</code>.',
          hint:'<code>raise ValueError("...")</code> creates and immediately throws a brand new exception with your message — reading it back in the traceback is exactly how you would debug a real failure that came from your own validation code.',
          starter:
`def check_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age

check_age(-5)
`
        },
        {
          id:'m10-t8', kind:'checklist', title:'Handle a real IndexError',
          goal:'Given <code>items = ["a", "b", "c"]</code>, wrap <code>print(items[5])</code> in a <code>try</code>/<code>except IndexError:</code> that prints <b>No item at that position</b> instead of crashing. Run it — confirm you see that message.',
          hint:'Same idea as the <code>ZeroDivisionError</code> and <code>ValueError</code> tasks — only the exception type named after <code>except</code> changes, to match whatever the risky line can actually raise.'
        },
        {
          id:'m10-t9', kind:'checklist', title:'Catch two exception types at once',
          goal:'Write a function <code>parse(value)</code> that returns <code>int(value)</code>, but returns <code>None</code> if that raises EITHER a <code>ValueError</code> OR a <code>TypeError</code> — using one <code>except (ValueError, TypeError):</code> block, not two separate ones. Test it with <code>parse("42")</code>, <code>parse("abc")</code>, and <code>parse(None)</code>. Confirm you see <b>42</b>, then <b>None</b>, then <b>None</b>.',
          hint:'Putting several exception types in parentheses after <code>except</code> catches any one of them with a single block — <code>int(None)</code> raises a <code>TypeError</code> (wrong type entirely), while <code>int("abc")</code> raises a <code>ValueError</code> (right type, invalid content).'
        },
        {
          id:'m10-t10', kind:'checklist', boss:true, title:'Safely parse a list of raw prices',
          goal:'Write <code>safe_parse_price(raw)</code> that returns <code>int(raw)</code>, or <code>None</code> if that raises a <code>ValueError</code>. Given <code>raw_prices = ["25", "abc", "45", "", "60"]</code>, build a list of only the successfully parsed prices (skip the <code>None</code> ones), and print their sum. Confirm you see <b>130</b>.',
          hint:'<code>price is not None</code> checks identity against the special value <code>None</code> — the conventional way to test for it in real Python, instead of <code>price != None</code>. An empty string <code>""</code> also fails <code>int(...)</code>, exactly like <code>"abc"</code> does.'
        }
      ],
      homework:[
        {
          id:'m10-hw1', kind:'checklist', title:'Your own exception type',
          goal:'Define <code>class InvalidPriceError(Exception): pass</code> — a custom exception. Write <code>validate_price(price)</code> that raises it with the message <code>"Price must be positive"</code> if <code>price &lt;= 0</code>. Catch it with <code>except InvalidPriceError as e:</code> and print <code>f"Rejected: {e}"</code>. Test with <code>validate_price(-10)</code> — confirm you see <b>Rejected: Price must be positive</b>.',
          hint:'<code>class InvalidPriceError(Exception): pass</code> creates a new exception TYPE by building on the real <code>Exception</code> class from Module 7\'s class syntax — <code>as e</code> then lets you read its message back with <code>str(e)</code> or, as here, directly inside an f-string.'
        },
        {
          id:'m10-hw2', kind:'predict', offline:true, title:'Predict: nested try/except',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'The INNER <code>except</code> only catches <code>ValueError</code> — a <code>ZeroDivisionError</code> is not that, so it skips the inner except entirely and keeps propagating outward until the OUTER <code>except ZeroDivisionError</code> catches it instead.',
          code:
`try:
    try:
        print(10 / 0)
    except ValueError:
        print("Inner catch")
except ZeroDivisionError:
    print("Outer catch")
`,
          expected: 'Outer catch'
        },
        {
          id:'m10-hw3', kind:'checklist', title:'try/except vs .get() for the same problem',
          goal:'Given <code>settings = {"env": "staging"}</code>, wrap <code>print(settings["timeout"])</code> in a <code>try</code>/<code>except KeyError:</code> that prints <b>Using default timeout: 30</b> instead of crashing. Confirm you see that message — then think about how this compares to <code>settings.get("timeout", 30)</code> from Module 5.',
          hint:'Both solve the exact same problem here. <code>.get(key, default)</code> is shorter and reads better for a single dict lookup; <code>try</code>/<code>except</code> is the more general tool that also works for things <code>.get</code> cannot help with at all, like the earlier <code>int(...)</code> or <code>items[5]</code> tasks.'
        }
      ]
    },
    {
      id:'m11', num:11, phase:'Automated tests in Python', title:'Mocks and stubs',
      desc:'faking dependencies: mock, stub — when and why',
      theory:[
        'A test should not depend on a real payment API, a real email server, or the exact current time to be fast, repeatable, and pass even when the internet is down. A <b>mock</b> is a fake stand-in object you hand to your code INSTEAD of the real dependency — it behaves close enough to be useful, without doing anything real.',
        '<code>from unittest.mock import Mock</code> — <code>Mock()</code> creates a fake object that accepts ANY attribute access or method call without complaint, auto-creating a new Mock for each one. This is what makes it useful as a stand-in for something you have not built yet, or do not want to actually call.',
        '<code>Mock(return_value=X)</code> makes CALLING the mock return <code>X</code> instead of another Mock. You can also set it after creation on a specific method: <code>fake_db.get_user.return_value = {...}</code> — only that one method is scripted, everything else on the object still behaves like a generic Mock.',
        'A mock also REMEMBERS how it was called — <code>mock.assert_called_with(args)</code> fails loudly (a real <code>AssertionError</code>, with both what was expected and what actually happened) if your code called it differently than expected, or not at all. This turns "did my code talk to the dependency correctly" into something a test can check automatically.',
        '<code>side_effect</code> makes a mock do more than return one fixed value: set it to an exception INSTANCE to make every call raise it, or to a LIST to make each successive call return (or raise) the next item — perfect for simulating something that fails once and then succeeds, without touching anything real.',
        '<code>patch("module.function", return_value=X)</code>, used with <code>with</code>, temporarily REPLACES a real function everywhere it is looked up by that name, only for the code inside the <code>with</code> block — outside it, the real function is back untouched. This is how you neutralize something unpredictable (like <code>random</code> or the network) for the length of one test only.'
      ],
      tasks:[
        {
          id:'m11-t1', kind:'checklist', title:'A mock accepts anything',
          goal:'Run <code>from unittest.mock import Mock</code>, create <code>fake_api = Mock()</code>, then call <code>fake_api.get_status()</code> — a method that was never defined anywhere. Confirm it does NOT crash, and print <b>Called without error</b> afterward.',
          hint:'A plain <code>Mock()</code> auto-creates whatever attribute or method you ask for, on the spot — there is no such thing as an "undefined method" error on a Mock.'
        },
        {
          id:'m11-t2', kind:'checklist', title:'Control what calling it returns',
          goal:'Create <code>fake_api = Mock(return_value="200 OK")</code>, call it with <code>fake_api()</code>, and print the result. Confirm you see <b>200 OK</b>.',
          hint:'<code>return_value</code> is set once, at creation — every call to <code>fake_api()</code> after that returns the exact same scripted value.'
        },
        {
          id:'m11-t3', kind:'predict', offline:true, title:'Predict: scripting one specific method',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'Only <code>get_user</code> was scripted with a <code>return_value</code> — calling it with <code>42</code> or any other argument still returns the same fixed dict, because a plain Mock does not actually check its arguments unless you ask it to.',
          code:
`from unittest.mock import Mock

fake_db = Mock()
fake_db.get_user.return_value = {"name": "Alex", "active": True}
user = fake_db.get_user(42)
print(user["name"])
`,
          expected: 'Alex'
        },
        {
          id:'m11-t4', kind:'checklist', title:'Assert a mock was called correctly',
          goal:'Write a function <code>notify_user(email, message)</code> that calls <code>send_email(email, message)</code>, where <code>send_email = Mock()</code>. Call <code>notify_user("alex@example.com", "Order shipped")</code>, then <code>send_email.assert_called_with("alex@example.com", "Order shipped")</code>, then print <b>Assertion passed</b>. Confirm you see it (no crash means the assertion succeeded).',
          hint:'<code>assert_called_with(...)</code> does not return <code>True</code>/<code>False</code> — it raises a real <code>AssertionError</code> if the call does not match, and does nothing at all (execution just continues) if it does.'
        },
        {
          id:'m11-t5', kind:'checklist', title:'Read a real mock assertion failure',
          goal:'Run the code below EXACTLY as given — it deliberately calls <code>send_email</code> with the WRONG arguments, then asserts the expected ones. Read the resulting <code>AssertionError</code> and confirm you can find both the <b>Expected</b> and <b>Actual</b> call it shows you.',
          hint:'Mock\'s own assertion failures are unusually readable on purpose — they print exactly what was expected next to exactly what actually happened, specifically so you do not have to guess.',
          starter:
`from unittest.mock import Mock

send_email = Mock()
send_email("wrong@example.com", "Oops")
send_email.assert_called_with("alex@example.com", "Order shipped")
`
        },
        {
          id:'m11-t6', kind:'predict', offline:true, title:'Predict: call_count',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'Every mock automatically counts how many times it has been called, available as <code>.call_count</code> — no setup needed, it is tracked from the moment the mock is created.',
          code:
`from unittest.mock import Mock

retry = Mock()
retry()
retry()
retry()
print(retry.call_count)
`,
          expected: '3'
        },
        {
          id:'m11-t7', kind:'checklist', title:'Patch a real function temporarily',
          goal:'Write <code>roll_dice()</code> that returns <code>random.randint(1, 6)</code>. Using <code>with patch("random.randint", return_value=4):</code>, call <code>roll_dice()</code> inside the <code>with</code> block and print the result. Confirm you see <b>4</b> every time you run it, not a random number.',
          hint:'<code>patch(...)</code> replaces the real <code>random.randint</code> everywhere it is looked up by that name, for as long as the indented <code>with</code> block runs — <code>roll_dice</code> did not change at all, but what it calls did.'
        },
        {
          id:'m11-t8', kind:'checklist', title:'A mock that raises instead of returning',
          goal:'Create <code>flaky = Mock(side_effect=ConnectionError("Network down"))</code>. Call it inside a <code>try</code>/<code>except ConnectionError as e:</code> that prints <code>f"Caught: {e}"</code>. Confirm you see <b>Caught: Network down</b>.',
          hint:'Setting <code>side_effect</code> to an exception INSTANCE (not just the class) makes every call to the mock raise that exact exception — this is the Module 10 pattern, now simulating a dependency that fails on purpose.'
        },
        {
          id:'m11-t9', kind:'checklist', title:'Mock a payment gateway',
          goal:'Write <code>checkout(cart_total, payment_gateway)</code> that calls <code>payment_gateway.charge(cart_total)</code> and returns <b>"Order placed"</b>. Call it with <code>150</code> and a <code>fake_gateway = Mock()</code>, then assert <code>fake_gateway.charge.assert_called_with(150)</code>, then print the result. Confirm you see <b>Order placed</b> with no crash.',
          hint:'The function under test never knows <code>payment_gateway</code> is fake — it just calls <code>.charge(...)</code> on whatever object it was given, exactly like it would on a real payment client.'
        },
        {
          id:'m11-t10', kind:'checklist', boss:true, title:'Checkout with a mocked email service',
          goal:'Write <code>checkout(cart, email_service)</code> that sums <code>item["price"]</code> for every item in <code>cart</code>, calls <code>email_service.send(f"Your total is {total}")</code>, and returns <code>total</code>. Given <code>cart = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]</code> and <code>fake_email = Mock()</code>, call <code>checkout(cart, fake_email)</code>, then assert <code>fake_email.send.assert_called_once_with("Your total is 70")</code>, then print the returned total. Confirm you see <b>70</b> with no crash.',
          hint:'<code>assert_called_once_with(...)</code> checks two things at once: the exact arguments AND that it was called exactly one time — stricter than plain <code>assert_called_with</code>, which allows any number of calls as long as one of them matches.'
        }
      ],
      homework:[
        {
          id:'m11-hw1', kind:'checklist', title:'Assert something was NEVER called',
          goal:'Write <code>maybe_notify(should_notify, email_service)</code> that calls <code>email_service.send("Hi")</code> only if <code>should_notify</code> is <code>True</code>. Call it with <code>False</code> and <code>send_email = Mock()</code>, then <code>send_email.assert_not_called()</code>, then print <b>Confirmed: email was never sent</b>. Confirm you see it with no crash.',
          hint:'<code>assert_not_called()</code> is the mirror image of <code>assert_called_with(...)</code> — it fails if the mock was called even once, for any reason.'
        },
        {
          id:'m11-hw2', kind:'predict', offline:true, title:'Predict: reset_mock() clears the call history',
          goal:'Read the code and predict the exact two-line output, then check yourself in real Python.',
          hint:'<code>.reset_mock()</code> wipes the recorded call history (like <code>call_count</code>) back to zero — it does not remove the mock itself, just forgets everything that happened to it so far.',
          code:
`from unittest.mock import Mock

counter = Mock()
counter()
counter()
print(counter.call_count)
counter.reset_mock()
print(counter.call_count)
`,
          expected: '2\n0'
        },
        {
          id:'m11-hw3', kind:'checklist', title:'Simulate fail-once-then-succeed',
          goal:'Create <code>flaky_call = Mock(side_effect=[ConnectionError("Network down"), "success"])</code>. Using a <code>for attempt in range(2):</code> loop with <code>try</code>/<code>except ConnectionError:</code> (print <b>Retry</b> on failure, print the result and <code>break</code> on success), confirm the output is exactly <b>Retry</b> then <b>success</b>.',
          hint:'When <code>side_effect</code> is a LIST instead of a single exception, each call consumes the NEXT item in order — the first call raises the exception, the second call returns the plain string, exactly like a real flaky dependency that recovers on retry.'
        }
      ]
    },
    {
      id:'m12', num:12, phase:'Automation tooling', title:'API testing',
      desc:'checking requests and responses with requests',
      theory:[
        'Every task below hits the REAL public API of automationexercise.com — the same site your Module 4-11 examples have been themed around. <code>pip install requests</code>, then <code>requests.get(url, timeout=10)</code> sends a real HTTP request and returns a <code>Response</code> object — <code>.status_code</code> is the HTTP status (200 = OK), <code>.json()</code> parses the body as JSON, exactly like <code>json.loads(...)</code> did in Module 8, because that is literally what <code>.json()</code> does internally.',
        'ALWAYS pass <code>timeout=...</code> to a real request. Without it, a request can hang forever if the server never responds — a single stuck test freezing an entire suite is a real, common automation failure, not a hypothetical one.',
        '<code>requests.get(url)</code> reads data, <code>requests.post(url, data={...})</code> sends data — the dict passed as <code>data=</code> gets form-encoded into the request body, similar in spirit to the dicts you have been building all course, just sent over the network instead of printed.',
        'A crucial, easy-to-miss gotcha: the HTTP status code and an API\'s OWN success/error code inside the JSON body are two DIFFERENT things. automationexercise.com\'s API always answers with HTTP 200, even on a request it considers wrong — the real error (like "wrong method") shows up as a <code>responseCode</code> field inside the JSON, not as the HTTP status. A test that only checks <code>status_code == 200</code> here would incorrectly call broken requests "fine."',
        'Once parsed, an API response is just Python data you already know how to work with — a list of dicts (Module 5), maybe nested. Looping, counting, filtering — none of that changes just because the data arrived over a network instead of being typed by hand.'
      ],
      tasks:[
        {
          id:'m12-t1', kind:'checklist', title:'Your first real API call',
          goal:'Run <code>pip install requests</code>, then <code>r = requests.get("https://automationexercise.com/api/productsList", timeout=10)</code> and print <code>r.status_code</code>. Confirm you see <b>200</b>.',
          hint:'This is a real network call to a real, live site — if it fails, check your internet connection before assuming your code is wrong.'
        },
        {
          id:'m12-t2', kind:'checklist', title:'Parse the JSON body',
          goal:'Using the same GET request, call <code>data = r.json()</code>, then print <code>data["responseCode"]</code>. Confirm you also see <b>200</b> here.',
          hint:'<code>r.json()</code> gives you a regular Python dict — <code>data["responseCode"]</code> is just square-bracket access, exactly like every dict you have used since Module 5.'
        },
        {
          id:'m12-t3', kind:'checklist', title:'HTTP status vs API response code',
          goal:'GET (not POST) <code>https://automationexercise.com/api/searchProduct</code> — this endpoint actually expects POST. Print BOTH <code>r.status_code</code> and <code>r.json()["responseCode"]</code>. Confirm the HTTP status is still <b>200</b>, while the API\'s own <code>responseCode</code> is <b>405</b> (wrong method) — two different numbers telling two different stories about the same response.',
          hint:'If your test only checked <code>status_code == 200</code> here, it would say this broken request "passed" — this is exactly the gotcha described in the theory above, now happening for real.'
        },
        {
          id:'m12-t4', kind:'checklist', title:'Search products with POST',
          goal:'POST to <code>https://automationexercise.com/api/searchProduct</code> with <code>data={"search_product": "dress"}</code>. Parse the JSON, print <code>data["responseCode"]</code> and <code>len(data["products"])</code>. Confirm <code>responseCode</code> is <b>200</b> and you get a positive count of matching products.',
          hint:'The count itself may not always be the exact same number — the live site\'s catalog is real data, not a fixture frozen in time. What matters is that it is a sensible positive number, not zero or an error.'
        },
        {
          id:'m12-t5', kind:'checklist', title:'Count products by brand',
          goal:'GET <code>productsList</code>, loop over <code>data["products"]</code>, and count how many have <code>product["brand"] == "Polo"</code>. Print the count.',
          hint:'Same counting pattern as every module since M3 — a counter starting at 0, a loop, an <code>if</code> bumping it on a match. The data source is the only new part.'
        },
        {
          id:'m12-t6', kind:'checklist', title:'Print the first five product names',
          goal:'GET <code>productsList</code>, then loop over <code>data["products"][:5]</code> (real Python slicing — the first five items) and print each <code>product["name"]</code>, one per line.',
          hint:'<code>[:5]</code> is a slice with no start (defaults to the beginning) and a stop at index 5 — real Python only, exactly like the slicing you first saw back in Module 6.'
        },
        {
          id:'m12-t7', kind:'checklist', title:'A real API test with pytest',
          goal:'Write a pytest test <code>test_products_list_ok()</code> that GETs <code>productsList</code> and asserts BOTH <code>r.status_code == 200</code> AND <code>r.json()["responseCode"] == 200</code> — checking the gotcha from task 3 on purpose. Run <code>pytest -v</code>. Confirm <b>1 passed</b>.',
          hint:'This brings Module 9 (pytest) and this module together — an API test is still just a function starting with <code>test_</code>, full of <code>assert</code>s, run the exact same way.'
        },
        {
          id:'m12-t8', kind:'checklist', title:'Catch a real Timeout',
          goal:'Call <code>requests.get("https://automationexercise.com/api/productsList", timeout=0.001)</code> — a timeout far too short to succeed — inside a <code>try</code>/<code>except requests.exceptions.Timeout:</code> that prints <b>Timed out</b>. Run it a few times — confirm you consistently see that message, not a crash.',
          hint:'<code>requests.exceptions.Timeout</code> is <code>requests</code>\' own exception type, but it is caught with the exact same <code>try</code>/<code>except</code> syntax from Module 10 — nothing about exception handling changes just because the risky operation is a network call.'
        },
        {
          id:'m12-t9', kind:'checklist', title:'Check a login attempt',
          goal:'POST to <code>https://automationexercise.com/api/verifyLogin</code> with <code>data={"email": "nonexistent_test_email_xyz@example.com", "password": "wrongpass"}</code>. Print <code>r.json()["responseCode"]</code> and <code>r.json()["message"]</code>. Confirm the response code is <b>404</b> with a "User not found!" message — a real API telling you, correctly, that this login should fail.',
          hint:'This is a safe, read-only check against a fake account — it does not create or change anything on the real site.'
        },
        {
          id:'m12-t10', kind:'checklist', boss:true, title:'A reusable brand-counting function',
          goal:'Write a function <code>count_products_by_brand(brand_name)</code> that GETs <code>productsList</code>, loops through the products, counts how many have that exact brand, and RETURNS the count (does not print inside the function). Call it for <code>"Polo"</code> and print the result, matching what you found by hand in task 5.',
          hint:'This is the exact same logic as task 5, just wrapped in a function so it can be reused for any brand name — the kind of small reusable helper a real test suite accumulates over time instead of repeating inline everywhere.'
        }
      ],
      homework:[
        {
          id:'m12-hw1', kind:'checklist', title:'Mock the network for a fast, offline test',
          goal:'Write <code>get_product_count()</code> that GETs <code>productsList</code> and returns <code>len(data["products"])</code>. In a pytest test, use <code>with patch("requests.get", return_value=fake_response):</code> where <code>fake_response</code> is a <code>Mock()</code> with <code>fake_response.json.return_value</code> set to a small fake products list, then assert the count matches. Run pytest — confirm it passes WITHOUT touching the real network.',
          hint:'This is Module 11\'s <code>patch</code> applied to the exact function this module has been calling for real all along — a genuine choice a real project makes constantly: hit the real API in a few end-to-end tests, but mock it in the many fast unit tests that check your own logic.'
        },
        {
          id:'m12-hw2', kind:'checklist', title:'A missing required field',
          goal:'POST to <code>verifyLogin</code> with ONLY <code>data={"email": "test@example.com"}</code> (no password). Print <code>r.json()["responseCode"]</code> and <code>r.json()["message"]</code>. Confirm you get <b>400</b> with a message about a missing parameter.',
          hint:'A real API validating its own inputs and telling you clearly what is missing — worth testing on purpose, since "what happens when a required field is missing" is exactly the kind of case a thin happy-path-only test suite misses.'
        },
        {
          id:'m12-hw3', kind:'checklist', title:'Inspect real response headers',
          goal:'GET <code>productsList</code>, then print <code>r.headers["Content-Type"]</code>. Confirm it mentions <b>json</b> somewhere in the value.',
          hint:'<code>r.headers</code> behaves like a dict of metadata ABOUT the response, separate from <code>r.json()</code> which is the actual body content — <code>Content-Type</code> is the server telling you what format to expect before you even parse it.'
        }
      ]
    },
    {
      id:'m13', num:13, phase:'Automation tooling', title:'Databases',
      desc:'checking data in a DB straight from tests',
      theory:[
        'A UI or API saying "order placed" is not proof it actually happened — checking the database directly confirms the real state, underneath whatever the interface claims. <code>sqlite3</code> is part of the standard library (no install), stores everything in a single file — or, for tests, entirely in memory with <code>sqlite3.connect(":memory:")</code>, which vanishes the moment the script ends. No server, no cleanup, ideal for quick checks.',
        'A <code>cursor</code> is what actually runs SQL: <code>cursor.execute("CREATE TABLE tests (name TEXT, status TEXT)")</code>, then <code>cursor.execute("INSERT INTO tests VALUES (\'test_login\', \'pass\')")</code>, then <code>conn.commit()</code> — nothing is actually saved until you commit. <code>cursor.fetchone()</code> gets one row back as a plain tuple; <code>cursor.fetchall()</code> gets every matching row as a list of tuples.',
        'NEVER build SQL by gluing strings together with a value that came from outside your own code — <code>"...WHERE name = \'" + user_input + "\'"</code> lets that value change what the query actually does (SQL injection: a real, serious vulnerability class, not a theoretical one). Use a <code>?</code> placeholder and pass the value separately: <code>cursor.execute("SELECT * FROM tests WHERE name = ?", (name,))</code> — the database handles it safely no matter what the value contains.',
        '<code>WHERE</code> filters which rows a query touches — <code>SELECT * FROM tests WHERE status = \'fail\'</code> only returns the failing ones. The exact same clause works with <code>UPDATE</code> and <code>DELETE</code>: <code>UPDATE tests SET status = ? WHERE name = ?</code> changes only the matching row, everything else stays untouched.',
        'A row comes back as a TUPLE, not a dict — <code>row[0]</code>, <code>row[1]</code> access columns by position, in the order they were selected, not by name. This is different from the dicts you have used everywhere since Module 5; keep the two straight.'
      ],
      tasks:[
        {
          id:'m13-t1', kind:'checklist', title:'Create, insert, select',
          goal:'Connect with <code>conn = sqlite3.connect(":memory:")</code>, get <code>cursor = conn.cursor()</code>, run <code>CREATE TABLE tests (name TEXT, status TEXT)</code>, insert one row <code>(\'test_login\', \'pass\')</code>, commit, then <code>SELECT * FROM tests</code> and print <code>cursor.fetchone()</code>. Confirm you see <b>(\'test_login\', \'pass\')</b>.',
          hint:'Four steps in order: create the table, insert a row, <code>conn.commit()</code>, then select — skipping the commit still lets you read it back later in the SAME connection, but it is good habit to commit right after writing.'
        },
        {
          id:'m13-t2', kind:'checklist', title:'Count all rows',
          goal:'Create the same table, insert THREE rows (any names/statuses), commit, then run <code>SELECT COUNT(*) FROM tests</code> and print <code>cursor.fetchone()[0]</code>. Confirm you see <b>3</b>.',
          hint:'<code>COUNT(*)</code> returns one row with one column — the count itself — so <code>fetchone()</code> gives you a one-item tuple, and <code>[0]</code> pulls the number out of it.'
        },
        {
          id:'m13-t3', kind:'predict', offline:true, title:'Predict: fetchall returns a list of tuples',
          goal:'Read the code and predict the exact two-line output, then check yourself in real Python.',
          hint:'<code>fetchall()</code> gives every matching row as a list — <code>len(rows)</code> counts them, and <code>rows[0]</code> is the first row, itself a tuple like the one from the previous task.',
          code:
`import sqlite3
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("CREATE TABLE tests (name TEXT, status TEXT)")
cursor.execute("INSERT INTO tests VALUES ('a', 'pass')")
cursor.execute("INSERT INTO tests VALUES ('b', 'fail')")
conn.commit()
cursor.execute("SELECT * FROM tests")
rows = cursor.fetchall()
print(len(rows))
print(rows[0])
`,
          expected: "2\n('a', 'pass')"
        },
        {
          id:'m13-t4', kind:'checklist', title:'Filter with WHERE',
          goal:'Insert three tests, two of them with <code>status = \'fail\'</code>. Run <code>SELECT name FROM tests WHERE status = \'fail\'</code> and loop over <code>cursor.fetchall()</code>, printing <code>row[0]</code> for each. Confirm you see exactly the two failing test names, nothing else.',
          hint:'Selecting only <code>name</code> (not <code>*</code>) means each row is a one-item tuple — <code>row[0]</code> is the name, there is no <code>row[1]</code> to accidentally use here.'
        },
        {
          id:'m13-t5', kind:'checklist', title:'A safe parameterized query',
          goal:'Insert one row using <code>cursor.execute("INSERT INTO tests VALUES (?, ?)", (name, status))</code> with variables, not a hand-built string. Then select it back with <code>cursor.execute("SELECT * FROM tests WHERE name = ?", (name,))</code> and print the result. Confirm it matches what you inserted.',
          hint:'The second argument to <code>execute(...)</code> is always a TUPLE, even with one value — <code>(name,)</code> needs that trailing comma, or Python reads it as parentheses around a single value instead of a tuple.'
        },
        {
          id:'m13-t6', kind:'predict', offline:true, title:'Predict: a row is a tuple, not a dict',
          goal:'Read the code and predict the exact two-line output, then check yourself in real Python.',
          hint:'<code>row[0]</code> is whatever was selected first (<code>name</code>), <code>row[1]</code> is whatever came second (<code>status</code>) — position, not a key name like a dict would use.',
          code:
`import sqlite3
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("CREATE TABLE tests (name TEXT, status TEXT)")
cursor.execute("INSERT INTO tests VALUES ('test_login', 'pass')")
conn.commit()
cursor.execute("SELECT * FROM tests")
row = cursor.fetchone()
print(row[0])
print(row[1])
`,
          expected: 'test_login\npass'
        },
        {
          id:'m13-t7', kind:'checklist', title:'Update a row and verify it',
          goal:'Insert <code>(\'test_login\', \'fail\')</code>. Run <code>UPDATE tests SET status = ? WHERE name = ?</code> with <code>("pass", "test_login")</code>, commit, then select the status back for <code>\'test_login\'</code> and print it. Confirm you see <b>pass</b> — the change actually happened.',
          hint:'Never trust that an <code>UPDATE</code> worked just because it did not crash — selecting the row again afterward is the only real proof, exactly like checking a UI after clicking a button.'
        },
        {
          id:'m13-t8', kind:'checklist', title:'Delete and verify the count dropped',
          goal:'Insert two rows, one <code>\'pass\'</code> and one <code>\'fail\'</code>. Run <code>DELETE FROM tests WHERE status = \'fail\'</code>, commit, then <code>SELECT COUNT(*) FROM tests</code> and print the count. Confirm you see <b>1</b>.',
          hint:'<code>DELETE FROM tests WHERE ...</code> removes only the matching rows — leaving off the <code>WHERE</code> entirely would delete everything, so always double check it is there before running a real delete.'
        },
        {
          id:'m13-t9', kind:'checklist', title:'Insert a list of results in a loop',
          goal:'Given <code>results = [{"name": "test_login", "status": "pass"}, {"name": "test_logout", "status": "fail"}, {"name": "test_search", "status": "pass"}]</code>, loop over it and insert each one with a parameterized <code>INSERT</code>. Commit, then print <code>SELECT COUNT(*)</code>. Confirm you see <b>3</b>.',
          hint:'This is the exact list-of-dicts shape from Module 5 and the JSON responses from Module 12 — only the destination changed, from a printed report to rows in a real table.'
        },
        {
          id:'m13-t10', kind:'checklist', boss:true, title:'A reusable pass-count function',
          goal:'Write <code>count_passed_tests(conn)</code> that takes an open connection, runs <code>SELECT COUNT(*) FROM tests WHERE status = \'pass\'</code> on it, and returns the count. Set up a table with a mix of pass/fail rows, then call the function and print the result.',
          hint:'The function takes the CONNECTION as a parameter and creates its own cursor from it — this is how a real test suite shares one database connection across many small helper functions instead of reconnecting every time.'
        }
      ],
      homework:[
        {
          id:'m13-hw1', kind:'checklist', title:'See a real SQL injection',
          goal:'Create a <code>users</code> table with one row, <code>(\'admin\', \'secret123\')</code>. Set <code>malicious_input = "\' OR \'1\'=\'1"</code>. Build an UNSAFE query with string concatenation: <code>"SELECT * FROM users WHERE username = \'" + malicious_input + "\'"</code>, run it, and print the result — confirm it WRONGLY returns the admin row, despite never actually matching that username. Then run the SAME lookup safely with a <code>?</code> placeholder instead, and confirm it correctly returns nothing.',
          hint:'The malicious string turns the WHERE clause into something that is always true, regardless of username — this is the actual mechanism behind real SQL injection attacks, not just a warning label.'
        },
        {
          id:'m13-hw2', kind:'predict', offline:true, title:'Predict: rowcount after an UPDATE',
          goal:'Read the code and predict the exact output, then check yourself in real Python.',
          hint:'<code>cursor.rowcount</code> reports how many rows the LAST executed statement actually affected — two rows matched <code>status = \'fail\'</code> here, the third already being <code>\'pass\'</code> was left untouched.',
          code:
`import sqlite3
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("CREATE TABLE tests (name TEXT, status TEXT)")
cursor.execute("INSERT INTO tests VALUES ('a', 'fail')")
cursor.execute("INSERT INTO tests VALUES ('b', 'fail')")
cursor.execute("INSERT INTO tests VALUES ('c', 'pass')")
conn.commit()
cursor.execute("UPDATE tests SET status = 'pass' WHERE status = 'fail'")
print(cursor.rowcount)
`,
          expected: '2'
        },
        {
          id:'m13-hw3', kind:'checklist', title:'with conn does not close the connection',
          goal:'Run <code>with conn:</code> around one insert, letting it auto-commit. AFTER that block ends, try running another query on the SAME <code>conn</code> — confirm it still works. <code>with conn:</code> manages commit/rollback for the block, nothing more; the connection itself stays open until you explicitly call <code>conn.close()</code>.',
          hint:'This trips people up constantly — <code>with</code> on a database connection in Python does NOT mean "close it when done," unlike a file opened with <code>with open(...)</code>. Two different libraries, two different meanings for the same keyword.'
        }
      ]
    },
    {
      id:'m14', num:14, phase:'Automation tooling', title:'Locators and Selenium',
      desc:'finding elements and automating the browser',
      theory:[
        'Selenium drives a REAL browser — unlike Module 12\'s <code>requests</code> calls (talking straight to the server) or every module before it, this actually opens Chrome and clicks/types exactly like a person would. <code>pip install selenium</code>, then <code>from selenium import webdriver; driver = webdriver.Chrome()</code>, then <code>driver.get("https://automationexercise.com")</code> opens a real page. Every task below runs against that real, live site.',
        'A locator finds an element: <code>driver.find_element(By.ID, "search_product")</code> — needs <code>from selenium.webdriver.common.by import By</code> first. <code>find_element</code> (singular) returns exactly ONE match and raises <code>NoSuchElementException</code> if there is none; <code>find_elements</code> (plural) always returns a LIST, empty (<code>[]</code>) if nothing matches — it never crashes, which makes it the safer choice for "does this exist at all" checks.',
        'Reading vs acting, same split as everywhere else in this course: <code>.text</code> reads visible text, <code>.get_attribute("value")</code> reads an attribute (like what is currently typed into a field); <code>.click()</code> and <code>.send_keys("...")</code> actually act on the element, exactly like a real click or real typing.',
        'THE single most important lesson in browser automation: a page takes TIME to load and react. Calling <code>find_element</code> the instant after <code>.get(...)</code> or <code>.click()</code> can fail simply because the element has not rendered yet — not because the locator is wrong. <code>WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "...")))</code> checks repeatedly for up to 10 seconds instead of guessing a fixed pause, needing <code>from selenium.webdriver.support.ui import WebDriverWait</code> and <code>from selenium.webdriver.support import expected_conditions as EC</code>.',
        'Always <code>driver.quit()</code> when a script is done — a leftover browser process wastes resources, and piles up fast across a real test suite running many times in CI.',
        'This is the exact moment Module 7\'s <code>Page Object</code> preview stops being a preview: a class per page, an <code>__init__</code> storing the <code>driver</code>, methods wrapping the raw <code>find_element</code>/<code>click</code>/<code>send_keys</code> calls for that one page — so a test reads like <code>login_page.login(email, password)</code> instead of five raw Selenium lines repeated in every test that needs to log in.'
      ],
      tasks:[
        {
          id:'m14-t1', kind:'checklist', title:'Open a real page',
          goal:'Run <code>pip install selenium</code>, then <code>driver = webdriver.Chrome()</code>, then <code>driver.get("https://automationexercise.com")</code>, then print <code>driver.title</code>. Confirm you see <b>Automation Exercise</b>, and that a real Chrome window actually opened.',
          hint:'If Chrome does not open at all, Selenium (4.6+) downloads a matching chromedriver automatically the first time — make sure you have an actual Chrome browser installed on your machine first.'
        },
        {
          id:'m14-t2', kind:'checklist', title:'Find one element',
          goal:'On the home page, find the site logo with <code>driver.find_element(By.CSS_SELECTOR, ".logo")</code> and print its <code>.tag_name</code>. Confirm it runs without a <code>NoSuchElementException</code>.',
          hint:'A CSS selector starting with a dot (<code>.logo</code>) matches by CLASS name — the same idea as a CSS class in any web page, just used here to locate an element instead of styling it.'
        },
        {
          id:'m14-t3', kind:'checklist', title:'Find many elements safely',
          goal:'Use <code>driver.find_elements(By.CSS_SELECTOR, ".nav.navbar-nav li a")</code> (plural) to get every top navigation link, and print <code>len(...)</code>. Then try the SAME selector but for something that does not exist, e.g. <code>driver.find_elements(By.ID, "nothing_here_12345")</code>, and print the result directly — confirm it is an empty list <code>[]</code>, not a crash.',
          hint:'This is exactly why <code>find_elements</code> exists alongside <code>find_element</code> — checking "how many are there, including maybe zero" should never need a <code>try</code>/<code>except</code> around it.'
        },
        {
          id:'m14-t4', kind:'checklist', title:'Read form field attributes',
          goal:'Navigate to <code>https://automationexercise.com/login</code>. Find the email field with <code>driver.find_element(By.CSS_SELECTOR, \'input[data-qa="login-email"]\')</code> and print <code>.get_attribute("name")</code>. Confirm you see <b>email</b>.',
          hint:'<code>data-qa="..."</code> attributes exist on this site specifically to give automation a stable way to find things, independent of visual styling classes that might change — a real pattern worth recognizing when you see it on other sites.'
        },
        {
          id:'m14-t5', kind:'checklist', title:'Type into a field and read it back',
          goal:'On the login page, find the email field and call <code>.send_keys("test@example.com")</code> on it. Then print <code>.get_attribute("value")</code> on that SAME element. Confirm it shows exactly what you typed.',
          hint:'<code>send_keys</code> does not overwrite by default — it types onto whatever is already there. On an empty field like this one, that does not matter, but it is worth remembering for a field that might already have text in it.'
        },
        {
          id:'m14-t6', kind:'checklist', title:'Read a real NoSuchElementException',
          goal:'Run <code>driver.find_element(By.ID, "this_does_not_exist_12345")</code> on any page — it deliberately crashes. Read the traceback and confirm you can find the locator you used (<code>this_does_not_exist_12345</code>) echoed back inside the error message.',
          hint:'Reading exactly which locator failed, right there in the message, is what tells you whether the problem is a typo, the wrong page, or a genuinely missing element — the same disciplined reading habit from every traceback since Module 6.'
        },
        {
          id:'m14-t7', kind:'checklist', title:'Wait for an element instead of guessing',
          goal:'Navigate to the home page, then use <code>WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".logo")))</code> instead of calling <code>find_element</code> directly. Print the found element\'s <code>.tag_name</code>. Confirm it works the same as task 2, just through an explicit wait.',
          hint:'On a fast page like this one the difference is invisible — but on a slower real page, <code>WebDriverWait</code> gives the page real time to finish rendering, while a bare <code>find_element</code> called too early would simply fail.'
        },
        {
          id:'m14-t8', kind:'checklist', title:'Click a link and confirm navigation',
          goal:'On the home page, wait for the "Cart" link to be clickable with <code>WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, "Cart")))</code>, click it, then print <code>driver.current_url</code>. Confirm the URL now contains <b>view_cart</b>.',
          hint:'<code>EC.element_to_be_clickable</code> checks both that the element exists AND that nothing else is currently covering it — a stricter, more useful wait than just checking it is present when the next step is a click.'
        },
        {
          id:'m14-t9', kind:'checklist', title:'Always quit, even on failure',
          goal:'Wrap a small script (open the site, find one element) in <code>try</code>/<code>finally</code>, with <code>driver.quit()</code> in the <code>finally</code> block. Deliberately make the middle step fail (look for a locator that does not exist) — confirm the browser still closes properly instead of being left open.',
          hint:'This is Module 10\'s <code>finally</code>, applied to the one cleanup step that matters most in browser automation — a crashed test should never leave a browser process running behind it.'
        },
        {
          id:'m14-t10', kind:'checklist', boss:true, title:'A real Page Object',
          goal:'Write <code>class LoginPage:</code> with <code>__init__(self, driver)</code> storing the driver, and a method <code>open(self)</code> that navigates to the login URL, and a method <code>enter_email(self, email)</code> that finds the email field and sends it the given text. Create an instance, call <code>.open()</code>, then <code>.enter_email("alex@example.com")</code>, then read the field\'s value directly through <code>page.driver.find_element(...)</code> to confirm it worked.',
          hint:'This is Module 7\'s class syntax wrapping Module 14\'s Selenium calls — the exact shape a real Page Object takes: the class knows HOW to interact with one page, a test just calls its methods by name.'
        }
      ],
      homework:[
        {
          id:'m14-hw1', kind:'checklist', title:'Compare implicit and explicit waits',
          goal:'Add <code>driver.implicitly_wait(10)</code> right after creating the driver — this makes EVERY <code>find_element</code> call automatically retry for up to 10 seconds before giving up, without any <code>WebDriverWait</code> needed. Try a normal <code>find_element</code> call after setting this and confirm it still works. Do not mix implicit and explicit waits in the same real project — pick one style and stick to it.',
          hint:'Implicit wait is simpler to set up once; explicit <code>WebDriverWait</code> is more precise about WHAT condition you are actually waiting for (present vs visible vs clickable) — most real projects choose explicit waits for that precision.'
        },
        {
          id:'m14-hw2', kind:'checklist', title:'A screenshot on failure',
          goal:'Wrap a script in <code>try</code>/<code>except Exception:</code>, and inside the <code>except</code> block, call <code>driver.save_screenshot("failure.png")</code> before re-raising or printing the error. Deliberately trigger a failure (a bad locator) and confirm a real <code>failure.png</code> file appears in your folder.',
          hint:'This is one of the most common real patterns in browser test suites — a screenshot taken at the exact moment of failure is often the single most useful piece of debugging information in a CI log.'
        },
        {
          id:'m14-hw3', kind:'checklist', title:'Extend the Page Object',
          goal:'Add a method <code>enter_password(self, password)</code> to your <code>LoginPage</code> class from task 10, following the same pattern as <code>enter_email</code>. Call both methods on one instance, then read both field values back to confirm.',
          hint:'A real Page Object grows exactly like this over time — one small, focused method per interaction, added as the tests that need them are written, not all planned out perfectly in advance.'
        }
      ]
    },
    {
      id:'m15', num:15, phase:'Automation tooling', title:'Playwright',
      desc:'modern browser automation',
      theory:[
        'Playwright is a newer alternative to Selenium — same core idea (drive a real browser), a different API, built more recently with automation specifically in mind. <code>pip install playwright</code>, then <code>python -m playwright install chromium</code> downloads an actual browser binary directly — no separate driver executable to match versions with, unlike Selenium\'s chromedriver.',
        'Every action starts inside <code>with sync_playwright() as p:</code>, then <code>browser = p.chromium.launch()</code>, <code>page = browser.new_page()</code>, <code>page.goto(url)</code>. A <code>page.locator(selector)</code> represents an element (or a set of them) — <code>.click()</code>, <code>.fill("text")</code>, <code>.count()</code>, <code>.inner_text()</code>.',
        'The biggest practical difference from Selenium: Playwright\'s actions AUTO-WAIT — <code>.click()</code> and <code>.fill()</code> already wait for the element to actually be ready (visible, not covered, not disabled) before acting, so Module 14\'s manual <code>WebDriverWait</code> is rarely needed for ordinary actions.',
        '<code>expect(locator).to_have_text("...")</code> (needs <code>from playwright.sync_api import expect</code>) is Playwright\'s own assertion, built specifically for web pages — it keeps re-checking for a few seconds if the text is not there yet, instead of failing instantly like a plain Python <code>assert</code> would on a page that just has not finished updating.',
        'A real, extremely common blocker: cookie-consent banners and similar overlays sitting on top of the page, physically intercepting clicks meant for something underneath. The fix is not a mystery workaround — it is dismissing the overlay first, exactly like a real user would, before continuing with the actual test.',
        'One subtlety worth knowing: <code>.inner_text()</code> returns text as it visually RENDERS (including CSS effects like uppercase styling), while <code>expect(...).to_have_text(...)</code> compares against the actual text written in the page\'s HTML — the same heading can look different between the two.'
      ],
      tasks:[
        {
          id:'m15-t1', kind:'checklist', title:'Launch and open a real page',
          goal:'Run <code>pip install playwright</code>, then <code>python -m playwright install chromium</code> (downloads the browser once). Inside <code>with sync_playwright() as p:</code>, launch chromium, open a new page, <code>goto("https://automationexercise.com")</code>, and print <code>page.title()</code>. Confirm you see <b>Automation Exercise</b>.',
          hint:'The one-time <code>playwright install chromium</code> step downloads Playwright\'s own bundled browser — it is separate from any Chrome you may already have installed for Module 14.'
        },
        {
          id:'m15-t2', kind:'checklist', title:'Dismiss the real cookie banner',
          goal:'After opening the home page, use <code>page.locator(".fc-cta-consent")</code> and print its <code>.count()</code> — confirm it is <b>1</b>. Then call <code>.click()</code> on it to dismiss the real cookie-consent overlay this site shows on every fresh visit.',
          hint:'This overlay is exactly the kind of thing described in the theory above — do this BEFORE trying to click anything else on the page, or the click will fail with the overlay in the way.'
        },
        {
          id:'m15-t3', kind:'checklist', title:'Click a link and confirm navigation',
          goal:'After dismissing the cookie banner, click the Products link with <code>page.click(\'a[href="/products"]\')</code>, then print <code>page.url</code>. Confirm the URL now ends in <b>/products</b>.',
          hint:'Notice there is no explicit wait here — <code>page.click(...)</code> already waited for the link to be genuinely clickable on its own before acting.'
        },
        {
          id:'m15-t4', kind:'checklist', title:'Search for a product',
          goal:'On the products page, run <code>page.fill("#search_product", "Dress")</code>, then <code>page.click("#submit_search")</code>, then <code>page.wait_for_selector(".product-image-wrapper")</code>. Print <code>page.locator(".product-image-wrapper").count()</code>. Confirm you get a positive number of results.',
          hint:'<code>.fill(...)</code> clears the field first and then types the given text — unlike Selenium\'s <code>send_keys</code>, which appends onto whatever was already there.'
        },
        {
          id:'m15-t5', kind:'checklist', title:'Read the rendered heading text',
          goal:'After searching, print <code>page.locator("h2.title.text-center").inner_text()</code>. Confirm you see <b>SEARCHED PRODUCTS</b> — in capitals, because that is how it visually renders.',
          hint:'<code>.inner_text()</code> reflects what a person would actually SEE, capital letters included, even though the underlying HTML text is written in mixed case.'
        },
        {
          id:'m15-t6', kind:'checklist', title:'Assert with expect(), not inner_text()',
          goal:'Using <code>from playwright.sync_api import expect</code>, run <code>expect(page.locator("h2.title.text-center")).to_have_text("Searched Products")</code> — note the MIXED case this time, not capitals. Confirm it passes with no crash.',
          hint:'<code>to_have_text</code> compares against the real underlying HTML text ("Searched Products"), not the capitalized visual rendering from the previous task — using the capitalized version here would fail.'
        },
        {
          id:'m15-t7', kind:'checklist', title:'A locator that matches nothing',
          goal:'Run <code>page.locator("#this_does_not_exist_999").count()</code> for a selector that matches nothing at all. Confirm you get <b>0</b>, with no crash.',
          hint:'Same idea as Selenium\'s <code>find_elements</code> returning <code>[]</code> in Module 14 — checking "how many, possibly zero" should never need a <code>try</code>/<code>except</code> around it.'
        },
        {
          id:'m15-t8', kind:'checklist', title:'Read a real click-intercepted error',
          goal:'On a FRESH page (cookie banner still showing, not yet dismissed), immediately try <code>page.click(\'a[href="/products"]\', timeout=3000)</code> — it deliberately fails. Read the error and confirm you can find the phrase <b>"intercepts pointer events"</b> in it, naming the overlay that is in the way.',
          hint:'This is the real error behind the real problem from task 2 and 3 — seeing it fail on purpose here makes it instantly recognizable if it ever happens by accident in a real test.'
        },
        {
          id:'m15-t9', kind:'checklist', title:'Full search flow with an assertion',
          goal:'Starting from a fresh page: dismiss the cookie banner, navigate to Products, search for <b>"Top"</b>, and finish with <code>expect(page.locator("h2.title.text-center")).to_have_text("Searched Products")</code>. Confirm the whole flow runs start to finish with no crash.',
          hint:'This chains together every piece from this module in the order a real test would — dismiss the overlay once, then act on the actual page underneath it.'
        },
        {
          id:'m15-t10', kind:'checklist', boss:true, title:'A Playwright Page Object',
          goal:'Write <code>class ProductsPage:</code> with <code>__init__(self, page)</code> storing the page, an <code>open(self)</code> method navigating to the products URL, and a <code>search(self, term)</code> method doing the fill + click + wait_for_selector sequence from task 4. Dismiss the cookie banner, create a <code>ProductsPage</code> instance, call <code>.open()</code> then <code>.search("Dress")</code>, then print the result count through <code>page.locator(...)</code> directly.',
          hint:'Same Page Object shape as Module 14\'s boss task, just wrapping Playwright\'s <code>page</code> instead of Selenium\'s <code>driver</code> — the PATTERN does not change between tools, only the calls inside each method do.'
        }
      ],
      homework:[
        {
          id:'m15-hw1', kind:'checklist', title:'Watch the browser run',
          goal:'Launch with <code>p.chromium.launch(headless=False)</code> instead of the default. Run any earlier task\'s code and confirm you can actually SEE the browser window open and act, instead of it running invisibly.',
          hint:'<code>headless=False</code> is purely for a human watching — real CI pipelines run headless (the default) because there is no screen to show a window on.'
        },
        {
          id:'m15-hw2', kind:'checklist', title:'A screenshot for debugging',
          goal:'After navigating to any page, call <code>page.screenshot(path="failure.png")</code>. Confirm a real <code>failure.png</code> file appears in your folder afterward.',
          hint:'Same practice as Module 14\'s homework, Playwright\'s own version of it — a screenshot taken right when something goes wrong is often the fastest way to understand a CI failure without re-running anything.'
        },
        {
          id:'m15-hw3', kind:'checklist', title:'Always close the browser',
          goal:'Wrap a small script in <code>try</code>/<code>finally</code>, with <code>browser.close()</code> in the <code>finally</code> block. Deliberately make the middle step fail (a bad selector with a short timeout) and confirm the browser still closes properly.',
          hint:'The exact same discipline as Module 14\'s <code>driver.quit()</code> in <code>finally</code> — a crashed script should never leave a browser process running behind it, regardless of which tool opened it.'
        }
      ]
    },
    {id:'m16', num:16, phase:'Automation tooling', title:'Test framework architecture', desc:'building a maintainable autotest project'}
  ];
