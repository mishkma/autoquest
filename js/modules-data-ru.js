/* AutoQuest — переводы контента модулей на русский (перевод ПОВЕРХ
   английского оригинала в modules-data.js, не отдельный источник истины).

   Формат: MODULES_RU[moduleId] = { title, desc, theory:[...], tasks:{taskId:{title,goal,hint,reasonPrompt,msgs}} }.
   Любое поле, которого здесь нет — рендерится на английском (см. mField/
   taskField/theoryItem в js/i18n.js, которые и делают этот fallback).

   `msgs` — отдельный случай (9 сентября 2026): это не статическое поле, а
   карта {<точный английский текст из check()>: <перевод>} — check() в
   modules-data.js генерирует .msg динамически внутри своей JS-логики, а не
   как готовое поле, поэтому переводится через точное совпадение строки
   (см. msgTr() в js/i18n.js), а не через прямой доступ к полю, как
   title/goal/hint. Есть только у модулей 1-5 + cp1/cp2 — начиная с модуля
   6 задачи используют kind:'checklist'/'predict' и вообще не вызывают
   check() с собственным текстом ошибки.

   Что НЕ переводится и почему:
   - `starter`/`code` (сам Python-код в задачах) — это код, а не текст.
   - буквальные ожидаемые строки вывода внутри goal (то, что реально должен
     напечатать код, напр. "Hello, QA!") — check() сверяет вывод programы
     побуквенно с английским текстом; если перевести саму фразу-цель "надо
     напечатать X", разумеется, а вот X (то, что именно должно быть
     напечатано) остаётся английским, иначе перевод разойдётся с тем, что
     реально проверяет check().
   - `check()` — логика проверки, не текст (кроме её `.msg`-строк — см. `msgs` выше).

   Статус: переведены все 16 модулей + оба чекпоинта (m1-m16, cp1, cp2). */

var MODULES_RU = {
  m1: {
    title: 'Первый код и переменные',
    desc: 'print, переменные, типы данных, простые вычисления',
    theory: [
      {
        text: '<code>print(...)</code> печатает в консоль всё, что находится в скобках. Так вы «видите» результат — а в реальном проекте это самый простой способ залогировать, что делает тест.',
        examples: [
          {label:'Просто', code:'print("Hello")', result:'Hello'},
          {label:'На практике', kind:'real', code:'print("Login test:", "PASSED")', result:'Login test: PASSED'}
        ]
      },
      {
        text: 'Переменная — это подписанная коробка для значения: <code>name = "Anna"</code> кладёт строку в переменную <code>name</code>. Значение можно переписать позже — <code>name = "Bob"</code> — и то, что сейчас лежит внутри, покажет <code>print(name)</code>.',
        examples: [
          {label:'Просто', code:'name = "Anna"\nprint(name)', result:'Anna'},
          {label:'На практике', kind:'real', code:'test_name = "test_login"\nprint(test_name)', result:'test_login'}
        ]
      },
      {
        text: 'Тип значения важен: <code>"5"</code> — это строка (текст), а <code>5</code> — число, их нельзя напрямую сложить через <code>+</code>, и друг другу они никогда не равны. Само число может быть целым — <code>5</code> (<code>int</code>) — или дробным — <code>5.0</code> (<code>float</code>); а вот эти два равны.',
        examples: [
          {label:'Просто', code:'print(5 == 5.0)', result:'True'},
          {label:'На практике', kind:'real', code:'print(200 == "200")', result:'False'}
        ]
      },
      {
        text: '<code>int(...)</code> превращает текст в целое число — <code>int("34")</code> становится настоящим числом <code>34</code>, с которым можно делать арифметику вроде <code>+</code>; строка <code>"34"</code> сама по себе так не может. Обратное действие, <code>str(...)</code>, превращает число в текст. Это постоянно всплывает в реальной автоматизации: данные из API, поля формы или файла почти всегда приходят ТЕКСТОМ, даже если выглядят как число.',
        examples: [
          {label:'Просто', code:'age_text = "30"\nage = int(age_text)\nprint(age + 1)', result:'31'},
          {label:'На практике', kind:'real', code:'passed_raw = "18"\npassed = int(passed_raw)\nprint(passed + 4)', result:'22'}
        ]
      },
      {
        text: 'F-строка вставляет значения прямо в текст: поставьте <code>f</code> сразу перед открывающей кавычкой, и тогда любое имя переменной внутри <code>{фигурных скобок}</code> заменится её значением. Внутри скобок можно даже вычислять, например <code>{a + b}</code>.',
        examples: [
          {label:'Просто', code:'age = 30\nprint(f"Age: {age}")', result:'Age: 30'},
          {label:'На практике', kind:'real', code:'passed = 8\ntotal = 10\nprint(f"Pass rate: {passed}/{total}")', result:'Pass rate: 8/10'}
        ]
      },
      {
        text: 'Арифметика: <code>+ - * /</code> работают как в математике, но <code>/</code> ВСЕГДА даёт дробное число, даже если делится нацело. <code>//</code> — целочисленное деление (отбрасывает дробную часть), <code>%</code> — остаток от деления — оба удобны при разбиении на равные группы.',
        examples: [
          {label:'Просто', code:'print(10 / 2)', result:'5.0'},
          {label:'На практике', kind:'real', code:'items = 23\nper_page = 10\nprint(items % per_page)', result:'3'}
        ]
      },
      'Эта песочница — учебное подмножество Python: она целиком работает в браузере, ничего устанавливать не нужно. Настоящий Python умеет больше: в нём есть срезы, <code>.items()</code>, распаковка кортежей, <code>*args</code>/<code>**kwargs</code> и многое другое — здесь этого пока нет. Всё это появится, когда вы установите настоящий Python в модуле 6 — эта песочница не весь язык, а только та его часть, которой достаточно, чтобы быстро выработать реальные привычки.',
      'Задачи ниже разных видов: написать код с нуля, дописать его, найти и исправить баг, предсказать вывод, и финальная задача-босс. Если условие задачи неясно, нажмите «Подсказка».'
    ],
    tasks: {
      'm1-t1': {
        title: 'Ваш первый вывод',
        goal: 'Напечатайте ровно одну строку: <b>Hello, QA!</b>',
        hint: '<code>print()</code> показывает в консоли то, что вы положите в кавычки. Больше ничего не нужно.',
        msgs: {
          'Nothing was printed yet. Add a line like <code>print("Hello, QA!")</code> and check again.': 'Пока ничего не напечатано. Добавьте строку вида <code>print("Hello, QA!")</code> и проверьте снова.',
          'Expected exactly <code>Hello, QA!</code> on one line — mind the capital letters, the comma and the exclamation mark.': 'Ожидается ровно <code>Hello, QA!</code> на одной строке — обратите внимание на заглавные буквы, запятую и восклицательный знак.'
        }
      },
      'm1-t2': {
        title: 'Имя и роль',
        goal: 'Задайте своё имя в переменной <code>name</code>, затем напечатайте: <b>I am NAME, a QA engineer.</b>',
        hint: 'Переменная — подписанная коробка: <code>name = "Anna"</code>. Вставьте переменную в текст через f-строку: <code>f"I am {name}, ..."</code>.',
        msgs: {
          'Looks like you did not replace <code>???</code> with your name in the <code>name</code> variable.': 'Похоже, вы не заменили <code>???</code> на своё имя в переменной <code>name</code>.',
          'The format must be exactly: <code>I am NAME, a QA engineer.</code> — check the comma, the spaces and the period at the end.': 'Формат должен быть ровно таким: <code>I am ИМЯ, a QA engineer.</code> — проверьте запятую, пробелы и точку в конце.'
        }
      },
      'm1-t3': {
        title: 'Предскажите: результат деления',
        goal: 'Пока не запускайте. Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: 'В Python <code>/</code> всегда даёт float — число с точкой — даже если делится нацело.'
      },
      'm1-t4': {
        title: 'Исправьте опечатку (NameError)',
        goal: 'Этот код падает с NameError. Прежде чем чинить, найдите точное несовпадение и сформулируйте одним предложением, почему Python не может найти это имя — эта привычка важнее самого фикса. Затем исправьте код так, чтобы он напечатал: <b>5</b>',
        reasonPrompt: 'Почему Python не может найти <code>cont</code>?',
        hint: 'NameError означает, что Python не знает такое имя. Сравните переменную, созданную в первой строке, с именем, использованным во второй — они должны совпадать точно.',
        msgs: {
          'Expected the number <code>5</code>. Make the name inside <code>print(...)</code> match the variable <code>count</code> exactly.': 'Ожидается число <code>5</code>. Сделайте так, чтобы имя внутри <code>print(...)</code> точно совпадало с переменной <code>count</code>.'
        }
      },
      'm1-t5': {
        title: 'Общее число тестов',
        goal: 'В прогоне были прошедшие и упавшие тесты. Напечатайте общее число тестов одним числом.',
        hint: 'Общее число — это прошедшие плюс упавшие. Сложите обе переменные и напечатайте результат.',
        msgs: {
          'Expected <code>22</code> — the sum of <code>passed</code> and <code>failed</code>.': 'Ожидается <code>22</code> — сумма <code>passed</code> и <code>failed</code>.'
        }
      },
      'm1-t6': {
        title: 'Элементы на последней странице',
        goal: 'Мы показываем по 10 элементов на странице. Напечатайте, сколько элементов осталось на последней, не полностью заполненной странице.',
        hint: 'Оператор остатка <code>%</code> даёт то, что осталось после группировки. Подумайте: 23 элемента по 10 на странице.',
        msgs: {
          'Expected <code>3</code> — that is <code>items % per_page</code> (what is left after the full pages of 10).': 'Ожидается <code>3</code> — это <code>items % per_page</code> (то, что остаётся после полных страниц по 10).'
        }
      },
      'm1-t7': {
        title: 'Исправьте: текст + число',
        goal: 'Этот код пытается склеить строку и число через <code>+</code> и падает (TypeError). Исправьте его через f-строку так, чтобы он напечатал: <b>Age: 20</b>',
        hint: 'Нельзя сложить строку и число через <code>+</code>. Используйте вместо этого f-строку: <code>f"Age: {age}"</code>.',
        msgs: {
          'Expected <code>Age: 20</code>. Rewrite the line as an f-string: <code>f"Age: {age}"</code>.': 'Ожидается <code>Age: 20</code>. Перепишите строку как f-строку: <code>f"Age: {age}"</code>.'
        }
      },
      'm1-t8': {
        title: 'Предскажите: два вида деления',
        goal: 'Прочитайте обе строки и напишите точный двухстрочный вывод, затем проверьте себя.',
        hint: '<code>//</code> — целочисленное деление (отбрасывает дробную часть), <code>/</code> — обычное деление (всегда float). Одна строка будет целым числом, другая — с точкой.'
      },
      'm1-t9': {
        title: 'Общее число тестов из API',
        goal: 'API вернул число прошедших тестов как текст: <code>passed_raw = "34"</code>. Также есть <code>failed = 9</code>. Напечатайте одну строку, ровно: <b>Total tests: 43</b>',
        hint: 'Значение из API — текст, а не число, с ним нельзя напрямую делать арифметику. Сначала преобразуйте его: <code>int(passed_raw)</code>. Затем прибавьте <code>failed</code> и соберите итоговое сообщение через f-строку.',
        msgs: {
          'Expected exactly <code>Total tests: 43</code>. Convert <code>passed_raw</code> to a number first, then add <code>failed</code>, then build the message with an f-string.': 'Ожидается ровно <code>Total tests: 43</code>. Сначала преобразуйте <code>passed_raw</code> в число, затем прибавьте <code>failed</code>, затем соберите сообщение f-строкой.'
        }
      },
      'm1-t10': {
        title: 'Отчёт о прогоне тестов',
        goal: 'При <code>passed = 6</code> и <code>total = 8</code> напечатайте двухстрочный отчёт РОВНО так:<br><code>Passed: 6 of 8</code><br><code>Pass rate: 75.0%</code>',
        hint: 'Первая строка — просто текст с двумя числами через f-строку. Pass rate = passed / total * 100; знак <code>%</code> — обычный текст сразу после числа.',
        msgs: {
          'Expected exactly two lines: <code>Passed: 6 of 8</code> and <code>Pass rate: 75.0%</code>. Pass rate is <code>passed / total * 100</code>.': 'Ожидаются ровно две строки: <code>Passed: 6 of 8</code> и <code>Pass rate: 75.0%</code>. Pass rate — это <code>passed / total * 100</code>.'
        }
      },
      'm1-hw1': {
        title: 'Длительность в секундах',
        goal: 'Тест занял <code>duration_ms = 1500</code> миллисекунд. Напечатайте ровно: <b>Duration: 1.5s</b> (переведите в секунды, поделив на 1000).',
        hint: 'Поделите <code>duration_ms</code> на 1000 внутри f-строки: <code>f"Duration: {duration_ms / 1000}s"</code>.',
        msgs: { 'Expected exactly <code>Duration: 1.5s</code>. Divide <code>duration_ms</code> by 1000 inside an f-string.': 'Ожидается ровно <code>Duration: 1.5s</code>. Поделите <code>duration_ms</code> на 1000 внутри f-строки.' }
      },
      'm1-hw2': {
        title: 'Оставшиеся попытки',
        goal: 'Конфигурационный файл хранит число уже использованных попыток как текст: <code>retries_used_raw = "3"</code>. Также есть <code>max_retries = 5</code>. Напечатайте ровно: <b>2 retries left</b> (max_retries минус использованные попытки, сначала преобразованные в число).',
        hint: '<code>retries_used_raw</code> — текст, сначала преобразуйте его: <code>int(retries_used_raw)</code>. Затем <code>retries_left = max_retries - int(retries_used_raw)</code>, и напечатайте через f-строку: <code>f"{retries_left} retries left"</code>.',
        msgs: { 'Expected exactly <code>2 retries left</code>. Convert <code>retries_used_raw</code> to a number first, then subtract it from <code>max_retries</code>.': 'Ожидается ровно <code>2 retries left</code>. Сначала преобразуйте <code>retries_used_raw</code> в число, затем вычтите его из <code>max_retries</code>.' }
      },
      'm1-hw3': {
        title: 'Процент прохождения из сырого текста API',
        goal: 'API вернул два сырых текстовых значения: <code>passed_raw = "13"</code> и <code>total_raw = "16"</code>. Преобразуйте оба в числа, затем напечатайте двухстрочный отчёт РОВНО так:<br><code>Passed: 13 of 16</code><br><code>Pass rate: 81.25%</code>',
        hint: 'Сначала преобразуйте оба: <code>passed = int(passed_raw)</code>, <code>total = int(total_raw)</code>. Первая строка — просто текст с двумя числами через f-строку. Pass rate — это <code>passed / total * 100</code> — та же формула, что в боссовой задаче модуля 1, только начиная с текста, а не с чисел.',
        msgs: { 'Expected exactly two lines: <code>Passed: 13 of 16</code> and <code>Pass rate: 81.25%</code>. Convert both raw values with <code>int(...)</code> first.': 'Ожидаются ровно две строки: <code>Passed: 13 of 16</code> и <code>Pass rate: 81.25%</code>. Сначала преобразуйте оба сырых значения через <code>int(...)</code>.' }
      }
    }
  },
  m2: {
    title: 'Условия',
    desc: 'if / elif / else, сравнения, and / or / not',
    theory: [
      {
        text: '<code>if condition:</code> выполняет блок с отступом только тогда, когда условие истинно. Обязательны и двоеточие в конце строки, и отступ в 4 пробела для блока.',
        examples: [
          {label:'Просто', code:'x = 5\nif x > 0:\n    print("positive")', result:'positive'},
          {label:'На практике', kind:'real', code:'status = 500\nif status >= 500:\n    print("Server error")', result:'Server error'}
        ]
      },
      {
        text: 'Сравнения возвращают <code>True</code> или <code>False</code>: <code>==</code> равно, <code>!=</code> не равно, а также <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>. Это именно тот механизм, который стоит за любой проверкой «ожидаемое vs фактическое» в автотесте.',
        examples: [
          {label:'Просто', code:'print(5 == 5)', result:'True'},
          {label:'На практике', kind:'real', code:'expected = "PASS"\nactual = "FAIL"\nprint(expected == actual)', result:'False'}
        ]
      },
      {
        text: '<code>else</code> означает «иначе», <code>elif</code> — «иначе если». В цепочке <code>if / elif / elif / else</code> выполняется только ПЕРВАЯ подошедшая ветка — Python даже не смотрит на остальные, как только одна сработала.',
        examples: [
          {label:'Просто', code:'if 5 > 3:\n    print("yes")\nelse:\n    print("no")', result:'yes'},
          {label:'На практике', kind:'real', code:'score = 72\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("F")', result:'B'}
        ]
      },
      {
        text: '<code>and</code> / <code>or</code> / <code>not</code> объединяют условия: <code>and</code> — оба сразу, <code>or</code> — хотя бы одно, <code>not</code> — переворачивает значение.',
        examples: [
          {label:'Просто', code:'print(3 > 0 and 3 < 10)', result:'True'},
          {label:'На практике', kind:'real', code:'is_ci = True\nis_flaky = False\nprint(is_ci and not is_flaky)', result:'True'}
        ]
      },
      'Задачи ниже разных видов: написать с нуля, дописать, найти и исправить баг, предсказать вывод, и финальная задача-босс. Плюс блок «Домашнее задание» — задачи посложнее на потом, они не блокируют следующий модуль. Если условие на английском неясно, нажмите «Подсказка».'
    ],
    tasks: {
      'm2-t1': {
        title: 'Пройден или провален',
        goal: 'При <code>passed = True</code> напечатайте <b>PASS</b>, если тест прошёл, иначе <b>FAIL</b>.',
        hint: '<code>if</code> выполняет свой блок только когда условие True; <code>else</code> — ветка «иначе». Не забудьте двоеточие и отступ в 4 пробела.',
        msgs: { 'Expected <code>PASS</code> when <code>passed</code> is True. Use <code>if</code>/<code>else</code> and print PASS in the if-branch.': 'Ожидается <code>PASS</code>, когда <code>passed</code> равно True. Используйте <code>if</code>/<code>else</code> и напечатайте PASS в ветке if.' }
      },
      'm2-t2': {
        title: 'Код ответа',
        goal: 'При <code>status = 200</code> напечатайте <b>OK</b>, если он равен 200, иначе <b>Error</b>.',
        hint: 'Равенство в условии — это ДВА знака равно <code>==</code>. Один <code>=</code> присваивает значение, а не сравнивает.',
        msgs: { 'Expected <code>OK</code> for status 200. Compare with <code>==</code> (two equals), not <code>=</code>.': 'Ожидается <code>OK</code> для статуса 200. Сравнивайте через <code>==</code> (два знака равенства), а не <code>=</code>.' }
      },
      'm2-t3': {
        title: 'Предскажите: оценка',
        goal: 'Пока не запускайте. Прочитайте цепочку elif и напишите, что она напечатает, затем проверьте себя.',
        hint: 'Ветки проверяются сверху вниз, и выполняется только ПЕРВАЯ подошедшая. 72 не &gt;= 90, но &gt;= 70.'
      },
      'm2-t4': {
        title: 'Исправьте: одно равно',
        goal: 'Этот код падает, потому что в условии один <code>=</code>. Прежде чем чинить, сформулируйте одним предложением, почему одиночный <code>=</code> нельзя использовать внутри условия — это ровно то, что вы бы объяснили на код-ревью. Затем исправьте код так, чтобы он напечатал: <b>Five</b>',
        reasonPrompt: 'Почему одиночный <code>=</code> нельзя использовать внутри условия?',
        hint: 'Внутри условия нужно СРАВНИВАТЬ через <code>==</code> (два равно). Один <code>=</code> означает «присвоить», это недопустимо в <code>if</code>.',
        msgs: { 'Expected <code>Five</code>. Change <code>=</code> to <code>==</code> in the condition.': 'Ожидается <code>Five</code>. Замените <code>=</code> на <code>==</code> в условии.' }
      },
      'm2-t5': {
        title: 'Логин и пароль (and)',
        goal: 'При <code>login_ok = True</code> и <code>password_ok = True</code> напечатайте <b>Access granted</b>, если оба True, иначе <b>Denied</b>.',
        hint: '<code>and</code> значит оба сразу. Если хоть одна сторона False — всё условие False.',
        msgs: { 'Expected <code>Access granted</code> when both are True. Join the two conditions with <code>and</code>.': 'Ожидается <code>Access granted</code>, когда оба условия True. Соедините два условия через <code>and</code>.' }
      },
      'm2-t6': {
        title: 'Выходной или праздник (or)',
        goal: 'При <code>is_weekend = False</code> и <code>is_holiday = True</code> напечатайте <b>Rest day</b>, если хотя бы одно True, иначе <b>Work day</b>.',
        hint: '<code>or</code> значит хотя бы одно из двух. Истинно, если истинна хотя бы одна сторона.',
        msgs: { 'Expected <code>Rest day</code> — the holiday is True. Join the two conditions with <code>or</code>.': 'Ожидается <code>Rest day</code> — праздник равен True. Соедините два условия через <code>or</code>.' }
      },
      'm2-t7': {
        title: 'Исправьте: пропущено двоеточие',
        goal: 'Этот код падает, потому что пропущено двоеточие. Исправьте его так, чтобы он напечатал: <b>Even</b>',
        hint: 'Каждое условие <code>if</code> заканчивается двоеточием <code>:</code> — оно говорит Python «дальше идёт блок с отступом».',
        msgs: { 'Expected <code>Even</code>. Add a colon <code>:</code> at the end of the <code>if</code> line.': 'Ожидается <code>Even</code>. Добавьте двоеточие <code>:</code> в конце строки <code>if</code>.' }
      },
      'm2-t8': {
        title: 'Предскажите: not',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>not</code> переворачивает булево значение: <code>not False</code> — это True, поэтому выполнится ветка if.'
      },
      'm2-t9': {
        title: 'Безопасно запускать в проде',
        goal: 'При <code>is_destructive = False</code> и <code>env = "prod"</code> напечатайте <b>Blocked</b> только если тест ОДНОВРЕМЕННО является разрушающим И выполняется в prod, иначе <b>Allowed</b>.',
        hint: 'Подумайте, какие два условия должны быть истинны ОДНОВРЕМЕННО, чтобы прогон заблокировали — вы уже умеете требовать выполнения двух условий сразу.',
        msgs: { 'Expected <code>Allowed</code> — the test is not destructive, so it should never be Blocked, no matter the environment. Check how you combine the two conditions.': 'Ожидается <code>Allowed</code> — тест не разрушительный, значит он никогда не должен быть Blocked, независимо от окружения. Проверьте, как вы объединяете два условия.' }
      },
      'm2-t10': {
        title: 'Скорость ответа API',
        goal: 'При <code>response_ms = 250</code> напечатайте метку скорости: <b>Fast</b>, если меньше 100, <b>Normal</b>, если меньше 300, иначе <b>Slow</b>.',
        hint: 'Три диапазона — значит <code>if</code> / <code>elif</code> / <code>else</code>. Начните с наименьшей границы (100), затем 300, затем else. Порядок важен.',
        msgs: { 'Expected <code>Normal</code> for 250 (not below 100, but below 300). Check the order of the bounds.': 'Ожидается <code>Normal</code> для 250 (не меньше 100, но меньше 300). Проверьте порядок границ.' }
      },
      'm2-hw1': {
        title: 'Категория HTTP-статуса',
        goal: 'При <code>status = 404</code> напечатайте категорию: <b>Success</b> для 200-299, <b>Client error</b> для 400-499, <b>Server error</b> для 500-599, иначе <b>Other</b>.',
        hint: 'Цепочка elif по диапазонам. Диапазон пишется как <code>status &gt;= 200 and status &lt; 300</code>. Идите от меньших кодов к большим. Именно так автотесты классифицируют ответы.',
        msgs: { 'Expected <code>Client error</code> — 404 is in the 400-499 range. Build an elif chain, each range like <code>status &gt;= 400 and status &lt; 500</code>.': 'Ожидается <code>Client error</code> — 404 попадает в диапазон 400-499. Постройте цепочку elif, каждый диапазон вида <code>status &gt;= 400 and status &lt; 500</code>.' }
      },
      'm2-hw2': {
        title: 'Предскажите: результат теста',
        goal: 'Прочитайте составное условие и напишите, что оно напечатает, затем проверьте себя.',
        hint: 'Первая ветка требует ОБА условия: passed И duration меньше 10. Здесь duration равен 12, поэтому эта ветка пропускается и срабатывает следующая подходящая.'
      },
      'm2-hw3': {
        title: 'Какой прогон быстрее',
        goal: 'При <code>a = 120</code> и <code>b = 95</code> (время ответа в мс, меньше — быстрее) напечатайте <b>A is faster</b>, если a меньше, <b>B is faster</b>, если b меньше, иначе <b>Same</b>.',
        hint: 'Тройное сравнение через <code>if</code> / <code>elif</code> / <code>else</code>. Меньшее время значит быстрее — подумайте, какое значение здесь меньше.',
        msgs: { 'Expected <code>B is faster</code> — 95 is smaller than 120. Compare a and b with <code>if</code> / <code>elif</code> / <code>else</code>.': 'Ожидается <code>B is faster</code> — 95 меньше, чем 120. Сравните a и b через <code>if</code> / <code>elif</code> / <code>else</code>.' }
      }
    }
  },
  m3: {
    title: 'Циклы',
    desc: 'for, while, range — повторение действий',
    theory: [
      {
        text: '<code>for i in range(5):</code> повторяет блок 5 раз, и <code>i</code> по очереди принимает значения 0, 1, 2, 3, 4 — Python считает с нуля. <code>range(start, stop, step)</code> позволяет управлять всеми тремя параметрами; значение <code>stop</code> никогда не включается.',
        examples: [
          {label:'Просто', code:'for i in range(3):\n    print(i)', result:'0\n1\n2'},
          {label:'На практике', kind:'real', code:'for i in range(2, 10, 2):\n    print(i)', result:'2\n4\n6\n8'}
        ]
      },
      {
        text: '<code>len(...)</code> считает, сколько элементов в чём-либо — <code>len([1, 2, 3])</code> это <code>3</code>, <code>len("hello")</code> это <code>5</code>. Это постоянно нужно, как только вы начинаете работать с реальными данными в цикле: «сколько пришло результатов», «сколько тестов прогналось» — и то, и другое просто <code>len(...)</code> от списка.',
        examples: [
          {label:'Просто', code:'items = [10, 20, 30]\nprint(len(items))', result:'3'},
          {label:'На практике', kind:'real', code:'results = ["pass", "fail", "pass", "pass"]\nprint(f"Ran {len(results)} tests")', result:'Ran 4 tests'}
        ]
      },
      {
        text: '<code>while condition:</code> повторяет блок, пока условие остаётся True. Забыть изменить то, от чего зависит условие, превращает цикл в бесконечный — частая ошибка новичков.',
        examples: [
          {label:'Просто', code:'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', result:'0\n1\n2'},
          {label:'На практике', kind:'real', code:'attempt = 1\nwhile attempt <= 3:\n    print(f"Attempt {attempt}")\n    attempt += 1', result:'Attempt 1\nAttempt 2\nAttempt 3'}
        ]
      },
      {
        text: '<code>+=</code> — сокращение для «прибавить и сохранить»: <code>total += x</code> — то же самое, что <code>total = total + x</code>. Создайте счётчик ДО цикла (например, <code>total = 0</code>), затем увеличивайте его внутри цикла.',
        examples: [
          {label:'Просто', code:'total = 0\ntotal += 5\nprint(total)', result:'5'},
          {label:'На практике', kind:'real', code:'durations = [4, 7, 3]\ntotal = 0\nfor d in durations:\n    total += d\nprint(total)', result:'14'}
        ]
      },
      {
        text: '<code>break</code> немедленно останавливает весь цикл — полезно, когда искомое уже найдено, и остальное проверять не нужно.',
        examples: [
          {label:'Просто', code:'for i in range(5):\n    if i == 3:\n        break\n    print(i)', result:'0\n1\n2'},
          {label:'На практике', kind:'real', code:'tests = ["login", "search", "checkout"]\nfor t in tests:\n    if t == "checkout":\n        print("Found:", t)\n        break', result:'Found: checkout'}
        ]
      },
      {
        text: '<code>continue</code> пропускает оставшуюся часть ТЕКУЩЕЙ итерации и сразу переходит к следующей — код после <code>continue</code> не выполнится в этом проходе, но сам цикл продолжается.',
        examples: [
          {label:'Просто', code:'for i in range(5):\n    if i == 2:\n        continue\n    print(i)', result:'0\n1\n3\n4'},
          {label:'На практике', kind:'real', code:'results = ["pass", "fail", "pass"]\nfor r in results:\n    if r == "pass":\n        continue\n    print("Failed test found")', result:'Failed test found'}
        ]
      },
      'Задачи ниже разных видов, плюс «Домашнее задание» в конце (не блокирует прогресс, но даёт опыт и XP).'
    ],
    tasks: {
      'm3-t1': {
        title: 'Считаем от 1 до 5',
        goal: 'Напечатайте числа от 1 до 5, каждое на своей строке.',
        hint: '<code>range(1, 6)</code> считает 1, 2, 3, 4, 5 — верхняя граница не включается, поэтому прибавьте 1 к последнему нужному числу.',
        msgs: { 'Expected the numbers <code>1</code> to <code>5</code>, each on its own line. Check the bounds of your <code>range(...)</code>.': 'Ожидаются числа от <code>1</code> до <code>5</code>, каждое на своей строке. Проверьте границы вашего <code>range(...)</code>.' }
      },
      'm3-t2': {
        title: 'Сумма длительностей тестов',
        goal: 'При <code>durations = [4, 7, 3, 6, 2]</code> сложите их в цикле и напечатайте общую сумму одним числом.',
        hint: 'Заведите счётчик до цикла: <code>total = 0</code>. Внутри <code>for d in durations:</code> прибавляйте каждое значение: <code>total += d</code>. Напечатайте <code>total</code> после окончания цикла.',
        msgs: { 'Expected <code>22</code> — the sum of all values in <code>durations</code>. Make sure <code>total</code> is printed AFTER the loop, not inside it.': 'Ожидается <code>22</code> — сумма всех значений в <code>durations</code>. Убедитесь, что <code>total</code> печатается ПОСЛЕ цикла, а не внутри него.' }
      },
      'm3-t3': {
        title: 'Предскажите: range с шагом',
        goal: 'Пока не запускайте. Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>range(2, 11, 2)</code> начинается с 2, останавливается перед 11 и шагает по 2: 2, 4, 6, 8, 10.'
      },
      'm3-t4': {
        title: 'Исправьте: цикл никогда не останавливается',
        goal: 'Этот код зависает навсегда — счётчик никогда не меняется. Прежде чем чинить, сформулируйте одним предложением, почему именно это условие никогда не станет False само по себе. Затем исправьте код так, чтобы он напечатал <b>1</b>, <b>2</b>, <b>3</b>, каждое на своей строке, и остановился.',
        reasonPrompt: 'Почему условие этого цикла никогда не станет False?',
        hint: 'Каждому циклу <code>while</code> нужно что-то, что меняется внутри него, иначе условие останется True навсегда. Добавьте <code>count += 1</code> внутрь тела цикла.',
        msgs: { 'Expected <code>1</code>, <code>2</code>, <code>3</code> on separate lines. Make sure <code>count</code> actually changes inside the loop.': 'Ожидаются <code>1</code>, <code>2</code>, <code>3</code> на отдельных строках. Убедитесь, что <code>count</code> реально меняется внутри цикла.' }
      },
      'm3-t5': {
        title: 'Только упавшие тесты',
        goal: 'При <code>results = ["pass", "fail", "pass", "fail", "fail"]</code> напечатайте только элементы равные <b>fail</b>, по одному на строке.',
        hint: 'Совместите цикл с условием: <code>for r in results:</code>, затем <code>if r == "fail":</code> напечатайте его.',
        msgs: { 'Expected <code>fail</code> printed three times, once per line. Check your <code>if</code> condition inside the loop.': 'Ожидается, что <code>fail</code> напечатано три раза, по одному на строку. Проверьте условие <code>if</code> внутри цикла.' }
      },
      'm3-t6': {
        title: 'Найти нужный тест (break)',
        goal: 'В <code>tests = ["login", "search", "checkout", "logout"]</code> найдите <b>checkout</b> и напечатайте <b>Found: checkout</b> — затем прекратите поиск, не проверяя остальное.',
        hint: 'Внутри <code>for t in tests:</code> добавьте <code>if t == "checkout":</code> — напечатайте сообщение, затем <code>break</code>, чтобы цикл сразу остановился.',
        msgs: { 'Expected exactly one line: <code>Found: checkout</code>. Check the comparison and that you break right after printing.': 'Ожидается ровно одна строка: <code>Found: checkout</code>. Проверьте сравнение и что вы делаете break сразу после печати.' }
      },
      'm3-t7': {
        title: 'Исправьте: ошибка на единицу',
        goal: 'Это должно напечатать от 1 до 5, но останавливается на 4 — исправьте range так, чтобы напечатались все пять чисел.',
        hint: '<code>range(start, stop)</code> никогда не включает <code>stop</code>. Чтобы включить 5, значение stop должно быть 6.',
        msgs: { 'Expected <code>1</code> to <code>5</code>, each on its own line. Adjust the second number in <code>range(...)</code>.': 'Ожидаются числа от <code>1</code> до <code>5</code>, каждое на своей строке. Поправьте второе число в <code>range(...)</code>.' }
      },
      'm3-t8': {
        title: 'Предскажите: continue',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>continue</code> пропускает оставшуюся часть ЭТОЙ итерации и переходит к следующей — <code>print</code> после него не выполнится для этого значения.'
      },
      'm3-t9': {
        title: 'Подряд идущие успехи до первого провала',
        goal: 'При <code>results = ["pass", "pass", "pass", "fail", "pass", "fail"]</code> посчитайте, сколько тестов прошло ПОДРЯД с самого начала, и напечатайте это число. Тест после первого провала не считается, даже если он прошёл.',
        hint: 'Заведите счётчик с 0 и пройдитесь циклом по <code>results</code>, увеличивая его, пока видите <code>"pass"</code>. В момент, когда встретится что-то другое, счёт должен остановиться немедленно — подумайте, какое ключевое слово останавливает цикл сразу.',
        msgs: { 'Expected <code>3</code> — three passes in a row before the first fail. Make sure you stop counting (and stop the loop) as soon as you hit something other than "pass".': 'Ожидается <code>3</code> — три подряд успешных перед первым провалом. Убедитесь, что вы прекращаете считать (и останавливаете цикл), как только встречаете что-то, кроме "pass".' }
      },
      'm3-t10': {
        title: 'Отчёт о медленных ответах',
        goal: 'При <code>times = [120, 340, 90, 410, 260, 500]</code> (время ответа в мс) посчитайте, сколько из них медленные (300 и больше), и напечатайте двухстрочный отчёт РОВНО так:<br><code>Slow: 3 of 6</code><br><code>Slow rate: 50.0%</code>',
        hint: 'Пройдитесь циклом по <code>times</code>, считая в счётчик те, что <code>&gt;= 300</code>. Общее число — <code>len(times)</code>. Slow rate — это <code>slow / len(times) * 100</code> — та же схема, что в боссе модуля 1.',
        msgs: { 'Expected exactly two lines: <code>Slow: 3 of 6</code> and <code>Slow rate: 50.0%</code>. Check your <code>&gt;=</code> comparison and the percentage formula.': 'Ожидаются ровно две строки: <code>Slow: 3 of 6</code> и <code>Slow rate: 50.0%</code>. Проверьте сравнение через <code>&gt;=</code> и формулу процента.' }
      },
      'm3-hw1': {
        title: 'Повторять до успеха',
        goal: 'Нестабильному тесту нужно <code>attempts_needed = 4</code> попытки, прежде чем он пройдёт. Начиная с <code>attempt = 1</code>, печатайте номер каждой попытки, пока он меньше <code>attempts_needed</code>, увеличивая его на 1 каждый раз; после цикла напечатайте <b>Success on attempt 4</b>, используя итоговое значение <code>attempt</code>.',
        hint: 'Используйте цикл while: напечатайте <code>attempt</code>, затем <code>attempt += 1</code>, пока <code>attempt &lt; attempts_needed</code>. После окончания цикла <code>attempt</code> равен <code>attempts_needed</code> — напечатайте финальное сообщение через f-строку.',
        msgs: { 'Expected <code>1</code>, <code>2</code>, <code>3</code>, then <code>Success on attempt 4</code>. Check the while condition and where the final print happens.': 'Ожидаются <code>1</code>, <code>2</code>, <code>3</code>, затем <code>Success on attempt 4</code>. Проверьте условие while и где происходит финальная печать.' }
      },
      'm3-hw2': {
        title: 'Предскажите: continue и break вместе',
        goal: 'Прочитайте цикл с <code>continue</code> и <code>break</code> одновременно и напишите точный вывод, затем проверьте себя.',
        hint: 'Когда <code>i</code> равен 2, <code>continue</code> пропускает печать и переходит к следующему числу. Когда <code>i</code> равен 4, <code>break</code> сразу останавливает цикл — 4 тоже никогда не печатается.'
      },
      'm3-hw3': {
        title: 'Посчитать каждый тип результата',
        goal: 'При <code>results = ["pass", "fail", "pass", "pass", "fail", "fail", "fail"]</code> посчитайте, сколько <b>pass</b> и сколько <b>fail</b>, затем напечатайте две строки РОВНО так:<br><code>Passed: 3</code><br><code>Failed: 4</code>',
        hint: 'Два отдельных счётчика, оба начинаются с 0. Пройдитесь циклом по <code>results</code> один раз, и внутри цикла используйте <code>if</code> / <code>elif</code>, чтобы увеличивать нужный счётчик на 1.',
        msgs: { 'Expected exactly <code>Passed: 3</code> then <code>Failed: 4</code>. Check both counters and that each result matches only one branch.': 'Ожидается ровно <code>Passed: 3</code>, затем <code>Failed: 4</code>. Проверьте оба счётчика и что каждый результат попадает ровно в одну ветку.' }
      }
    }
  },
  cp1: {
    title: 'Контрольная точка: переменные, условия, циклы',
    desc: 'без новой теории — каждая задача смешивает понятия из модулей 1-3',
    theory: [
      'Новых понятий здесь нет. Каждая задача ниже намеренно объединяет то, что было в последних трёх модулях (переменные, <code>if</code>/<code>elif</code>/<code>else</code>, <code>for</code>/<code>while</code>, <code>break</code>) так, как это делается в настоящем скрипте — больше ничего изолированного. Если задача кажется сложнее того, что вы только что делали, так и задумано: откройте теорию модулей 1-3 ещё раз, если что-то не складывается.'
    ],
    tasks: {
      'cp1-t1': {
        title: 'Fizz для кратных трём',
        goal: 'Напечатайте числа от 1 до 15, по одному на строке — но для каждого числа, кратного 3, напечатайте <b>Fizz</b> вместо самого числа.',
        hint: 'Цикл с <code>range(1, 16)</code>. Внутри проверьте <code>i % 3 == 0</code>, чтобы решить, что напечатать для этого числа.',
        msgs: { 'Expected 1 to 15 with every multiple of 3 replaced by <code>Fizz</code>. Check your <code>%</code> comparison and the range bounds.': 'Ожидается от 1 до 15, где каждое кратное 3 заменено на <code>Fizz</code>. Проверьте сравнение через <code>%</code> и границы диапазона.' }
      },
      'cp1-t2': {
        title: 'Суммарное время медленных ответов',
        goal: 'При <code>times = [120, 340, 90, 410, 260, 500]</code> (время ответа в мс) сложите только те, что 300 или больше, и напечатайте сумму.',
        hint: 'Тот же паттерн накопителя, что и раньше, но теперь вы суммируете сами медленные ЗНАЧЕНИЯ, а не считаете их количество.',
        msgs: { 'Expected <code>1250</code> — the sum of 340, 410 and 500. Make sure you add the VALUE, not increase a counter by 1.': 'Ожидается <code>1250</code> — сумма 340, 410 и 500. Убедитесь, что вы прибавляете само ЗНАЧЕНИЕ, а не увеличиваете счётчик на 1.' }
      },
      'cp1-t3': {
        title: 'Опрашивать до готовности',
        goal: 'Начиная с <code>attempt = 1</code>, смоделируйте опрос медленного сервиса: пока <code>attempt</code> меньше или равен 10, печатайте <b>Waiting... attempt N</b> и увеличивайте <code>attempt</code> на 1 — ЗА ИСКЛЮЧЕНИЕМ случая, когда <code>attempt</code> равен 4: тогда вместо этого напечатайте <b>Ready on attempt 4</b> и немедленно прекратите опрос.',
        hint: 'Цикл <code>while</code> с <code>if</code>/<code>else</code> внутри. Ветка <code>if</code> (attempt == 4) должна напечатать своё сообщение и сразу остановить цикл — подумайте, какое ключевое слово делает это внутри <code>while</code>, а не только <code>for</code>.',
        msgs: { 'Expected three "Waiting..." lines for attempts 1-3, then <code>Ready on attempt 4</code>, and nothing after that. <code>break</code> works inside <code>while</code> loops too.': 'Ожидаются три строки «Waiting...» для попыток 1-3, затем <code>Ready on attempt 4</code>, и больше ничего после. <code>break</code> работает и внутри циклов <code>while</code> тоже.' }
      },
      'cp1-t4': {
        title: 'Отчёт о разборе тестового прогона',
        goal: 'При <code>results = ["pass", "fail", "pass", "skip", "fail", "pass", "fail"]</code> посчитайте, сколько <b>pass</b>, <b>fail</b> и <b>skip</b>, затем напечатайте РОВНО три строки:<br><code>Passed: 3</code><br><code>Failed: 3</code><br><code>Skipped: 1</code>',
        hint: 'Три счётчика, один цикл, цепочка <code>if</code>/<code>elif</code>/<code>elif</code>, решающая, какой счётчик увеличить для каждого результата. Именно это печатает CI-пайплайн после прогона тестов.',
        msgs: { 'Expected exactly <code>Passed: 3</code>, <code>Failed: 3</code>, <code>Skipped: 1</code>, in that order. Check that every result updates exactly one of the three counters.': 'Ожидается ровно <code>Passed: 3</code>, <code>Failed: 3</code>, <code>Skipped: 1</code>, именно в этом порядке. Проверьте, что каждый результат обновляет ровно один из трёх счётчиков.' }
      }
    }
  },
  m4: {
    title: 'Функции',
    desc: 'зачем они нужны, def, параметры, return',
    theory: [
      {
        text: '<code>def</code> объявляет функцию — именованный кусок кода, который можно вызывать сколько угодно раз вместо того, чтобы копировать его снова и снова.',
        examples: [
          {label:'Просто', code:'def square(x):\n    return x * x\nprint(square(5))', result:'25'},
          {label:'На практике', kind:'real', code:'def calc_total(price, qty):\n    return price * qty\nprint(calc_total(10, 3))', result:'30'}
        ]
      },
      {
        text: 'Параметры — это имена-заглушки внутри функции, которые получают значения (аргументы) в момент вызова — <code>calc_total(10, 3)</code> делает так, что <code>price</code> становится 10, а <code>qty</code> — 3 внутри функции, только для этого одного вызова.',
        examples: [
          {label:'Просто', code:'def greet(name):\n    return f"Hi, {name}"\nprint(greet("Sam"))', result:'Hi, Sam'},
          {label:'На практике', kind:'real', code:'def is_valid_status(code):\n    return code == 200\nprint(is_valid_status(200))', result:'True'}
        ]
      },
      {
        text: '<code>return</code> — это не то же самое, что <code>print</code>. <code>print</code> просто показывает значение на экране, а <code>return</code> передаёт значение обратно туда, откуда функцию вызвали, чтобы использовать его дальше. Функция без <code>return</code> возвращает <code>None</code> — печать такого результата это явно покажет.',
        examples: [
          {label:'Просто', code:'def add(a, b):\n    return a + b\nprint(add(2, 3))', result:'5'},
          {label:'На практике', kind:'real', code:'def broken(a, b):\n    print(a + b)\n\nresult = broken(2, 3)\nprint(result)', result:'5\nNone'}
        ]
      },
      {
        text: 'Внутри функции можно использовать <code>if</code>, циклы — всё, что вы уже знаете. Функция может вычислять по-разному в зависимости от условия, точно так же, как обычный скрипт.',
        examples: [
          {label:'Просто', code:'def abs_val(x):\n    if x < 0:\n        return -x\n    return x\nprint(abs_val(-5))', result:'5'},
          {label:'На практике', kind:'real', code:'def apply_discount(price, is_member):\n    if is_member:\n        return price * 0.9\n    return price\nprint(apply_discount(100, True))', result:'90.0'}
        ]
      },
      {
        text: 'Переменная, созданная ВНУТРИ функции (например, присваиванием), существует только внутри неё — это называется локальной переменной. Даже если снаружи есть переменная с тем же именем, присваивание внутри функции создаёт отдельную, новую переменную и никогда не трогает внешнюю.',
        examples: [
          {label:'Просто', code:'def f():\n    x = 1\n    return x\nprint(f())', result:'1'},
          {label:'На практике', kind:'real', code:'count = 0\n\ndef increment():\n    count = 1\n    return count\n\nincrement()\nprint(count)', result:'0'}
        ]
      },
      {
        text: 'В автоматизации функции — это способ не повторять один и тот же код проверки много раз: напишите его один раз, переиспользуйте в десятках тестов вместо копипаста.',
        examples: [
          {label:'На практике', kind:'real', code:'def is_valid_status(code):\n    return code == 200\nprint(is_valid_status(404))', result:'False'}
        ]
      },
      'Задачи ниже разных видов, плюс «Домашнее задание» в конце.'
    ],
    tasks: {
      'm4-t1': {
        title: 'Поприветствовать тестировщика',
        goal: 'Напишите функцию <code>greet_tester</code>, принимающую один параметр <code>name</code> и возвращающую строку <b>"Hello, NAME, ready to test?"</b> (через f-строку). Затем вызовите <code>greet_tester("Alex")</code> и напечатайте результат.',
        hint: '<code>def greet_tester(name): return f"Hello, {name}, ready to test?"</code> — затем <code>print(greet_tester("Alex"))</code>.',
        msgs: { 'Expected <code>Hello, Alex, ready to test?</code>. Make sure the function RETURNS the string (not prints it), and that you print the result of the call.': 'Ожидается <code>Hello, Alex, ready to test?</code>. Убедитесь, что функция ВОЗВРАЩАЕТ строку (а не печатает её), и что вы печатаете результат вызова.' }
      },
      'm4-t2': {
        title: 'Сумма корзины',
        goal: 'Напишите функцию <code>calc_total(price, qty)</code>, возвращающую <code>price * qty</code>. Затем напечатайте <code>calc_total(25, 4)</code>.',
        hint: '<code>def calc_total(price, qty): return price * qty</code> — вызовите её внутри <code>print(...)</code>.',
        msgs: { 'Expected <code>100</code> — 25 multiplied by 4. Check that the function returns <code>price * qty</code>.': 'Ожидается <code>100</code> — 25, умноженное на 4. Проверьте, что функция возвращает <code>price * qty</code>.' }
      },
      'm4-t3': {
        title: 'Предскажите: параметры — это локальные копии',
        goal: 'Пока не запускайте. Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>x</code> внутри <code>double</code> — отдельная локальная переменная: её изменение не меняет <code>n</code> снаружи функции.'
      },
      'm4-t4': {
        title: 'Исправьте: печатает вместо возврата',
        goal: 'Вызов <code>print(triple(5))</code> должен напечатать только <b>15</b>. Сейчас печатаются две строки (<code>15</code>, а затем <code>None</code>), потому что функция печатает сама, вместо того чтобы возвращать значение. Прежде чем чинить, сформулируйте одним предложением, почему внешний <code>print</code> получает <code>None</code>, хотя <code>15</code> всё же напечаталось. Исправьте функцию.',
        reasonPrompt: 'Почему внешний <code>print</code> получает <code>None</code>?',
        hint: 'Удалите строку <code>print(result)</code> внутри функции и замените её на <code>return result</code> — тогда внешний <code>print(triple(5))</code> покажет значение.',
        msgs: { 'Expected exactly one line: <code>15</code>. The function should RETURN the value instead of printing it itself.': 'Ожидается ровно одна строка: <code>15</code>. Функция должна ВОЗВРАЩАТЬ значение, а не печатать его сама.' }
      },
      'm4-t5': {
        title: 'Применить скидку',
        goal: 'Напишите функцию <code>apply_discount(price, is_member)</code>, которая возвращает <code>price * 0.9</code>, если <code>is_member</code> равно <code>True</code>, иначе возвращает <code>price</code> без изменений. Напечатайте <code>apply_discount(100, True)</code>, затем <code>apply_discount(100, False)</code>.',
        hint: '<code>if is_member: return price * 0.9</code>, затем (вне if) <code>return price</code>. Учтите, что <code>100 * 0.9</code> становится float, поэтому печатается как <code>90.0</code>.',
        msgs: { 'Expected <code>90.0</code> then <code>100</code>. Check both branches of your <code>if</code>.': 'Ожидается <code>90.0</code>, затем <code>100</code>. Проверьте обе ветки вашего <code>if</code>.' }
      },
      'm4-t6': {
        title: 'Одна функция внутри другой',
        goal: 'Напишите две функции: <code>calc_subtotal(price, qty)</code>, возвращающую <code>price * qty</code>, и <code>add_tax(amount)</code>, возвращающую <code>amount * 1.2</code> (налог 20%). Затем напечатайте <code>add_tax(calc_subtotal(50, 2))</code> — вызов одной функции внутри другой.',
        hint: 'Сначала определите обе функции. Результат <code>calc_subtotal(50, 2)</code> становится аргументом, передаваемым в <code>add_tax(...)</code>.',
        msgs: { 'Expected <code>120.0</code> — subtotal 100, then +20% tax. Check both functions and the order you call them in.': 'Ожидается <code>120.0</code> — подытог 100, затем +20% налога. Проверьте обе функции и порядок, в котором вы их вызываете.' }
      },
      'm4-t7': {
        title: 'Исправьте: перепутаны аргументы',
        goal: 'Это должно применить скидку 5 к цене 100 (ожидаемый результат: <b>95</b>). Печатается неверное число, потому что аргументы переданы в неправильном порядке. Исправьте вызов функции.',
        hint: 'Функция определена как <code>apply_discount(price, discount)</code> — проверьте порядок двух чисел в вызове ниже.',
        msgs: { 'Expected <code>95</code>. Swap the order of the two arguments in the call to match <code>apply_discount(price, discount)</code>.': 'Ожидается <code>95</code>. Поменяйте местами порядок двух аргументов в вызове, чтобы он соответствовал <code>apply_discount(price, discount)</code>.' }
      },
      'm4-t8': {
        title: 'Предскажите: локальная переменная затеняет внешнюю',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: 'Присваивание <code>count</code> внутри <code>increment</code> создаёт НОВУЮ локальную переменную — она не меняет <code>count</code>, определённый снаружи функции.'
      },
      'm4-t9': {
        title: 'Классифицировать скорость ответа',
        goal: 'Напишите функцию <code>speed_label(response_time)</code>, возвращающую <b>"Fast"</b>, если <code>response_time</code> меньше 100, <b>"Normal"</b>, если меньше 300, иначе <b>"Slow"</b>. Затем напечатайте <code>speed_label(250)</code>.',
        hint: 'Внутри функции можно использовать <code>if</code> / <code>elif</code> / <code>else</code> точно так же, как везде — единственное отличие: в каждой ветке вы <code>return</code>-ите метку, а не печатаете её.',
        msgs: { 'Expected <code>Normal</code> — 250 is not below 100, but it is below 300. Check the order of your bounds inside the function.': 'Ожидается <code>Normal</code> — 250 не меньше 100, но меньше 300. Проверьте порядок границ внутри функции.' }
      },
      'm4-t10': {
        title: 'Отчёт по сумме заказов',
        goal: 'Напишите функцию <code>calc_total(price, qty)</code>, возвращающую <code>price * qty</code>. Используйте её, чтобы посчитать суммы трёх заказов — <code>calc_total(20, 2)</code>, <code>calc_total(45, 1)</code>, <code>calc_total(15, 3)</code> — сложите все три суммы в одно число <code>grand_total</code> и напечатайте РОВНО:<br><code>Order total: 130</code>',
        hint: 'Сохраните каждый вызов в свою переменную (или сложите напрямую), затем напечатайте через f-строку: <code>print(f"Order total: {grand_total}")</code>.',
        msgs: { 'Expected exactly <code>Order total: 130</code>. Check <code>calc_total</code> and that you added up all three results correctly.': 'Ожидается ровно <code>Order total: 130</code>. Проверьте <code>calc_total</code> и то, что вы верно сложили все три результата.' }
      },
      'm4-hw1': {
        title: 'Отформатировать результат теста',
        goal: 'Напишите функцию <code>format_result(name, passed)</code>, возвращающую <b>"NAME: PASS"</b>, если <code>passed</code> равно <code>True</code>, иначе <b>"NAME: FAIL"</b> (f-строки). Вызовите её с <code>("test_login", True)</code> и <code>("test_logout", False)</code>, напечатав каждый результат на своей строке.',
        hint: '<code>if passed: return f"{name}: PASS"</code>, иначе <code>return f"{name}: FAIL"</code>. Вызовите функцию дважды, по одному разу на <code>print</code>.',
        msgs: { 'Expected <code>test_login: PASS</code> then <code>test_logout: FAIL</code>. Check both branches of the function.': 'Ожидается <code>test_login: PASS</code>, затем <code>test_logout: FAIL</code>. Проверьте обе ветки функции.' }
      },
      'm4-hw2': {
        title: 'Предскажите: бонус не меняет оригинал',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>score</code> внутри <code>add_bonus</code> — локальная копия <code>s</code>: её изменение не влияет на <code>s</code> снаружи.'
      },
      'm4-hw3': {
        title: 'Считать через функцию',
        goal: 'Напишите функцию <code>count_fails(results)</code>, которая принимает список, проходит по нему циклом со счётчиком и возвращает, сколько элементов равны <b>"fail"</b>. Вызовите её с <code>results = ["pass", "fail", "fail", "pass", "fail"]</code> и напечатайте возвращённое число.',
        hint: 'Внутри функции: <code>count = 0</code>, затем <code>for r in results:</code> с <code>if r == "fail": count += 1</code>. Верните <code>count</code> после цикла.',
        msgs: { 'Expected <code>3</code> — the number of <code>"fail"</code> items. Make sure the counter is returned, not printed inside the function.': 'Ожидается <code>3</code> — количество элементов <code>"fail"</code>. Убедитесь, что счётчик возвращается, а не печатается внутри функции.' }
      }
    }
  },
  m5: {
    title: 'Списки и словари',
    desc: 'коллекции данных и циклы по ним',
    theory: [
      {
        text: 'Списки уже знакомы по циклам — теперь посмотрим на работу с отдельными элементами. <code>products[0]</code> — первый элемент (индексы начинаются с нуля), а <code>products[-1]</code> — последний элемент: отрицательный индекс считает с конца.',
        examples: [
          {label:'Просто', code:'nums = [10, 20, 30]\nprint(nums[0])', result:'10'},
          {label:'На практике', kind:'real', code:'products = ["mouse", "keyboard", "monitor"]\nprint(products[-1])', result:'monitor'}
        ]
      },
      {
        text: '<code>.append(x)</code> добавляет элемент в конец списка, <code>.pop()</code> удаляет ПОСЛЕДНИЙ элемент и возвращает его.',
        examples: [
          {label:'Просто', code:'cart = []\ncart.append("mouse")\nprint(cart)', result:"['mouse']"},
          {label:'На практике', kind:'real', code:'cart = ["mouse", "keyboard"]\nremoved = cart.pop()\nprint(removed)', result:'keyboard'}
        ]
      },
      {
        text: 'Словарь (<code>dict</code>) хранит пары ключ-значение — удобно для одного структурированного объекта вместо кучи отдельных переменных. Доступ к значению — через квадратные скобки и ключ.',
        examples: [
          {label:'Просто', code:'product = {"name": "Mouse"}\nprint(product["name"])', result:'Mouse'},
          {label:'На практике', kind:'real', code:'product = {"name": "Mouse", "price": 25, "in_stock": True}\nprint(product["price"])', result:'25'}
        ]
      },
      {
        text: '<code>.get(key, default)</code> — безопасный способ читать из словаря: если ключа нет, возвращается значение по умолчанию вместо <code>KeyError</code>.',
        examples: [
          {label:'Просто', code:'settings = {"env": "staging"}\nprint(settings.get("env"))', result:'staging'},
          {label:'На практике', kind:'real', code:'settings = {"env": "staging"}\nprint(settings.get("timeout", 30))', result:'30'}
        ]
      },
      {
        text: '<code>.keys()</code> и <code>.values()</code> дают только ключи или только значения для перебора в цикле. В этой песочнице нет <code>.items()</code> — чтобы получить и то, и другое сразу, переберите <code>.keys()</code> и находите значение по ключу.',
        examples: [
          {label:'Просто', code:'d = {"a": 1}\nfor key in d.keys():\n    print(key)', result:'a'},
          {label:'На практике', kind:'real', code:'settings = {"currency": "USD", "tax_rate": 20}\nfor key in settings.keys():\n    print(f"{key}: {settings[key]}")', result:'currency: USD\ntax_rate: 20'}
        ]
      },
      {
        text: 'Список словарей представляет набор однотипных объектов, например каталог товаров — перебирайте его в цикле точно так же, как обычный список. Это не случайность: JSON-ответ от настоящего API (именно то, что вы будете разбирать в модуле 11) в Python выглядит и ведёт себя ровно так же — список словарей или словарь словарей.',
        examples: [
          {label:'Просто', code:'catalog = [{"name": "Mouse"}]\nfor p in catalog:\n    print(p["name"])', result:'Mouse'},
          {label:'На практике', kind:'real', code:'catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]\nfor p in catalog:\n    print(p["name"])', result:'Mouse\nKeyboard'}
        ]
      }
    ],
    tasks: {
      'm5-t1': {
        title: 'Первый и последний товар',
        goal: 'При <code>products = ["mouse", "keyboard", "monitor", "webcam"]</code> напечатайте первый товар и последний товар, каждый на своей строке — используйте индексацию, не вводите слова вручную.',
        hint: '<code>products[0]</code> — первый элемент. <code>products[-1]</code> — последний элемент: отрицательный индекс считает с конца.',
        msgs: { 'Expected <code>mouse</code> then <code>webcam</code>. Use <code>products[0]</code> and <code>products[-1]</code>, not the literal words.': 'Ожидается <code>mouse</code>, затем <code>webcam</code>. Используйте <code>products[0]</code> и <code>products[-1]</code>, а не сами слова буквально.' }
      },
      'm5-t2': {
        title: 'Добавить в корзину',
        goal: 'Начните с <code>cart = ["mouse"]</code>. Добавьте <b>"keyboard"</b> в корзину через <code>.append(...)</code>, затем напечатайте всю корзину.',
        hint: '<code>cart.append("keyboard")</code> добавляет элемент в конец. Затем <code>print(cart)</code> покажет весь список, в стиле Python, в квадратных скобках.'
      },
      'm5-t3': {
        title: 'Предскажите: pop удаляет последний элемент',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>.pop()</code> удаляет и возвращает ПОСЛЕДНИЙ элемент списка — сам список становится короче.'
      },
      'm5-t4': {
        title: 'Детали товара',
        goal: 'Создайте словарь <code>product</code> с ключами <b>"name"</b> (значение <b>"Mouse"</b>), <b>"price"</b> (значение <b>25</b>) и <b>"in_stock"</b> (значение <b>True</b>). Затем напечатайте <code>product["name"]</code> и <code>product["price"]</code>, каждое на своей строке.',
        hint: 'Литерал словаря выглядит как <code>{"key": value, "key2": value2}</code>. Доступ к значению — через квадратные скобки и ключ: <code>product["name"]</code>.',
        msgs: { 'Expected <code>Mouse</code> then <code>25</code>. Check the dict literal and the keys you access.': 'Ожидается <code>Mouse</code>, затем <code>25</code>. Проверьте литерал словаря и ключи, к которым вы обращаетесь.' }
      },
      'm5-t5': {
        title: 'Исправьте: отсутствующий ключ роняет код',
        goal: 'Этот код падает с <b>KeyError</b>, потому что <code>"discount"</code> нет в <code>settings</code>. Прежде чем чинить, сформулируйте одним предложением, почему обращение через квадратные скобки здесь не может завершиться без падения. Исправьте код так, чтобы безопасно прочитать <code>"discount"</code> со значением по умолчанию <b>0</b>, и напечатайте результат.',
        reasonPrompt: 'Почему <code>settings["discount"]</code> не может завершиться без падения?',
        hint: 'Используйте <code>settings.get("discount", 0)</code> вместо <code>settings["discount"]</code> — <code>.get</code> позволяет задать значение по умолчанию вместо падения при отсутствующем ключе.',
        msgs: { 'Expected <code>0</code>. Use <code>.get("discount", 0)</code> instead of square-bracket access.': 'Ожидается <code>0</code>. Используйте <code>.get("discount", 0)</code> вместо обращения через квадратные скобки.' }
      },
      'm5-t6': {
        title: 'Напечатать все настройки',
        goal: 'При <code>settings = {"currency": "USD", "tax_rate": 20, "free_shipping": True}</code> пройдитесь циклом по ключам и напечатайте каждый вместе со значением, по одному на строке, вот так: <code>currency: USD</code>.',
        hint: '<code>for key in settings.keys():</code> перебирает только ключи. Внутри: <code>print(f"{key}: {settings[key]}")</code>.',
        msgs: { 'Expected three lines: <code>currency: USD</code>, <code>tax_rate: 20</code>, <code>free_shipping: True</code>, in that order. Check your f-string and loop variable.': 'Ожидаются три строки: <code>currency: USD</code>, <code>tax_rate: 20</code>, <code>free_shipping: True</code>, именно в этом порядке. Проверьте вашу f-строку и переменную цикла.' }
      },
      'm5-t7': {
        title: 'Каталог товаров',
        goal: 'При <code>catalog</code> — списке из трёх словарей-товаров (name + price) — пройдитесь по нему циклом и напечатайте название каждого товара, по одному на строке.',
        hint: '<code>for product in catalog:</code> — каждый <code>product</code> это словарь, поэтому используйте <code>product["name"]</code> внутри цикла.',
        msgs: { 'Expected <code>Mouse</code>, <code>Keyboard</code>, <code>Monitor</code> on separate lines, in catalog order.': 'Ожидаются <code>Mouse</code>, <code>Keyboard</code>, <code>Monitor</code> на отдельных строках, в порядке каталога.' }
      },
      'm5-t8': {
        title: 'Предскажите: суммирование списка словарей',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: 'Цикл складывает <code>product["price"]</code> для каждого товара в списке — 25 + 45.'
      },
      'm5-t9': {
        title: 'Средняя цена товаров в наличии',
        goal: 'При <code>catalog</code> из четырёх товаров, у части из которых вообще нет ключа <code>"in_stock"</code>, вычислите среднюю цену только товаров, которые ЕСТЬ в наличии (отсутствующий ключ считается «нет в наличии»), и напечатайте результат.',
        hint: 'Используйте <code>.get("in_stock", False)</code>, чтобы отсутствующий ключ считался «нет в наличии», а не приводил к падению. Накапливайте сумму и одновременно считайте товары в наличии, затем поделите сумму на счётчик после цикла.',
        msgs: { 'Expected <code>80.0</code> — the average of the three in-stock prices (25, 150, 65). Check you use <code>.get("in_stock", False)</code> and divide by the count of in-stock items only.': 'Ожидается <code>80.0</code> — среднее трёх цен товаров в наличии (25, 150, 65). Проверьте, что вы используете <code>.get("in_stock", False)</code> и делите только на количество товаров в наличии.' }
      },
      'm5-t10': {
        title: 'Отчёт о стоимости каталога',
        goal: 'При <code>catalog</code> из четырёх товаров посчитайте, сколько стоят <b>50 или больше</b>, и общую стоимость всего каталога. Напечатайте РОВНО две строки:<br><code>Expensive: 2 of 4</code><br><code>Total value: 280</code>',
        hint: 'Пройдитесь циклом по <code>catalog</code> один раз. Внутри: прибавляйте <code>product["price"]</code> к <code>total</code>, и если <code>product["price"] &gt;= 50</code>, прибавляйте 1 к <code>expensive</code>. Напечатайте обе строки после цикла.',
        msgs: { 'Expected exactly <code>Expensive: 2 of 4</code> then <code>Total value: 280</code>. Check the comparison and that both counters use the same loop.': 'Ожидается ровно <code>Expensive: 2 of 4</code>, затем <code>Total value: 280</code>. Проверьте сравнение и что оба счётчика используют один и тот же цикл.' }
      },
      'm5-hw1': {
        title: 'Безопасное чтение конфига',
        goal: 'При <code>config = {"env": "staging", "retries": 3}</code> безопасно напечатайте значение ключа <b>"timeout"</b> через <code>.get</code> со значением по умолчанию <b>30</b> (поскольку <code>"timeout"</code> нет в <code>config</code>).',
        hint: '<code>config.get("timeout", 30)</code> возвращает <code>30</code>, потому что <code>"timeout"</code> отсутствует — без падения.',
        msgs: { 'Expected <code>30</code>. Use <code>.get("timeout", 30)</code>.': 'Ожидается <code>30</code>. Используйте <code>.get("timeout", 30)</code>.' }
      },
      'm5-hw2': {
        title: 'Предскажите: сортировка, затем разворот',
        goal: 'Прочитайте код и напишите, что он напечатает, затем проверьте себя.',
        hint: '<code>.sort()</code> располагает числа от меньшего к большему, затем <code>.reverse()</code> разворачивает весь список — результат идёт от большего к меньшему.'
      },
      'm5-hw3': {
        title: 'Найти товар по имени',
        goal: 'При <code>catalog</code> из трёх словарей-товаров пройдитесь по нему циклом и найдите товар с именем <b>"Keyboard"</b> — напечатайте его цену, затем прекратите поиск через <code>break</code>.',
        hint: '<code>for product in catalog:</code> проверьте <code>if product["name"] == "Keyboard":</code>, затем <code>print(product["price"])</code> и <code>break</code>.',
        msgs: { 'Expected <code>45</code> — the price of the Keyboard product. Check the comparison and that you print product["price"], not something else.': 'Ожидается <code>45</code> — цена товара Keyboard. Проверьте сравнение и что вы печатаете product["price"], а не что-то другое.' }
      }
    }
  },
  cp2: {
    title: 'Контрольная точка: функции, списки, словари',
    desc: 'без новой теории — каждая задача смешивает функции с реальными данными каталога/корзины',
    theory: [
      'Новых понятий здесь нет. Каждая задача ниже пишет маленькую переиспользуемую функцию, работающую со списком словарей — именно так выглядит настоящий ответ API или тестовая фикстура. Это паттерн, который вы будете использовать постоянно, когда дойдёте до Pytest и тестирования API: вспомогательная функция, вызываемая из теста, возвращает то, что тест может проверить.'
    ],
    tasks: {
      'cp2-t1': {
        title: 'Отфильтровать корректные цены',
        goal: 'Напишите функцию <code>is_valid_price(price)</code>, возвращающую <code>True</code>, если <code>price</code> больше 0, иначе <code>False</code>. При <code>prices = [25, -5, 40, 0, 15]</code> используйте функцию, чтобы напечатать только корректные цены, по одной на строке.',
        hint: 'Сначала определите функцию. Затем пройдитесь циклом по <code>prices</code>, и для каждой вызывайте <code>is_valid_price(p)</code> внутри <code>if</code>, чтобы решить, печатать её или нет.',
        msgs: { 'Expected <code>25</code>, <code>40</code>, <code>15</code> on separate lines, in that order. Check that is_valid_price returns a comparison, and that you call it inside the loop.': 'Ожидаются <code>25</code>, <code>40</code>, <code>15</code> на отдельных строках, именно в этом порядке. Проверьте, что is_valid_price возвращает сравнение, и что вы вызываете её внутри цикла.' }
      },
      'cp2-t2': {
        title: 'Сумма корзины с учётом количества',
        goal: 'Напишите функцию <code>calc_cart_total(cart)</code>, которая проходит циклом по списку словарей-товаров (у каждого есть <code>"price"</code> и <code>"qty"</code>), складывает <code>price * qty</code> для всех них и возвращает сумму. Затем напечатайте <code>calc_cart_total(cart)</code> для <code>cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}, {"name": "Monitor", "price": 150, "qty": 1}]</code>.',
        hint: 'Внутри функции: сумма, начинающаяся с 0, цикл по <code>cart</code>, и для каждого <code>item</code> прибавляйте <code>item["price"] * item["qty"]</code>. Верните сумму после цикла — не печатайте её внутри функции.',
        msgs: { 'Expected <code>245</code> — (25*2) + (45*1) + (150*1). Check the function multiplies price by qty for every item and returns the sum.': 'Ожидается <code>245</code> — (25*2) + (45*1) + (150*1). Проверьте, что функция умножает price на qty для каждого товара и возвращает сумму.' }
      },
      'cp2-t3': {
        title: 'Найти самый дешёвый товар',
        goal: 'Напишите функцию <code>find_cheapest(catalog)</code>, которая проходит циклом по списку словарей-товаров и возвращает ИМЯ товара с наименьшей ценой. Затем напечатайте <code>find_cheapest(catalog)</code> для <code>catalog = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}, {"name": "Monitor", "price": 150}, {"name": "Webcam", "price": 15}]</code>.',
        hint: '<code>min()</code> здесь сравнивает только обычные числа, а не словари — придётся отслеживать самый дешёвый товар самостоятельно. Начните с предположения, что первый товар (<code>catalog[0]</code>) самый дешёвый, затем в цикле обновляйте отслеживаемые имя и цену, как только найдёте что-то дешевле.',
        msgs: { 'Expected <code>Webcam</code> — it has the lowest price (15). Check you update BOTH the tracked name and the tracked price together whenever you find a cheaper product.': 'Ожидается <code>Webcam</code> — у него самая низкая цена (15). Проверьте, что вы обновляете ОБЕ отслеживаемые переменные — имя и цену — вместе, когда находите более дешёвый товар.' }
      },
      'cp2-t4': {
        title: 'Отчёт о праве на бесплатную доставку',
        goal: 'Напишите функцию <code>cart_report(cart)</code>, которая складывает <code>price * qty</code> для каждого элемента <code>cart</code> и возвращает строку <b>"Total: N, Free shipping: Yes"</b>, если сумма 100 или больше, иначе <b>"Total: N, Free shipping: No"</b>. Напечатайте <code>cart_report(cart)</code> для <code>cart = [{"name": "Mouse", "price": 25, "qty": 2}, {"name": "Keyboard", "price": 45, "qty": 1}]</code>.',
        hint: 'Переиспользуйте цикл суммирования из предыдущей задачи, затем обычный <code>if</code>/<code>else</code>, решающий, какую f-строку вернуть. Функции нужен ровно один <code>return</code> в каждой ветке — ничего сложнее не требуется.',
        msgs: { 'Expected <code>Total: 95, Free shipping: No</code> — total is 25*2 + 45*1 = 95, which is below 100. Check both the total calculation and the 100 threshold.': 'Ожидается <code>Total: 95, Free shipping: No</code> — итог 25*2 + 45*1 = 95, что меньше 100. Проверьте и подсчёт итога, и порог в 100.' }
      }
    }
  },
  m6: {
    title: 'Настройка окружения',
    desc: 'установка настоящего Python — VS Code, запуск файлов, git, первый push',
    theory: [
      'Песочница в браузере была нужна для скорости — ничего не устанавливать, мгновенная обратная связь, быстро выучить язык. Настоящему проекту нужен настоящий интерпретатор, настоящий файл, настоящий терминал и настоящий редактор. Именно это настраивает этот модуль: настоящий Python, VS Code и git — те же самые инструменты, которыми вы будете пользоваться, начиная строить AutoQuest Test Framework уже через несколько модулей.',
      'Установите Python с сайта <code>python.org</code> (3.12 или новее). Чтобы убедиться, что всё получилось, откройте терминал и выполните <code>python --version</code> (на некоторых системах — <code>python3 --version</code>) — должно напечататься что-то вроде <code>Python 3.12.4</code>. Эта команда терминала — совсем не то же самое, что <code>print()</code>, которым вы пользовались до сих пор: <code>python --version</code> спрашивает УСТАНОВЛЕННУЮ ПРОГРАММУ о ней самой, она не выполняет ваш код.',
      'VS Code — редактор кода с расширением для Python (установите его из панели Extensions — ищите официальное от Microsoft). После установки открытие <code>.py</code>-файла даёт кнопку Run, а встроенный терминал VS Code позволяет запускать <code>python file.py</code> напрямую — тот же результат, два способа его получить.',
      'Git отслеживает снимки папки во времени: <code>git init</code> превращает папку в репозиторий, <code>git add file.py</code> готовит файл к следующему снимку, <code>git commit -m "message"</code> сохраняет этот снимок с описанием. Сам сайт AutoQuest живёт в git-репозитории точно так же — каждый пройденный вами модуль существует как история коммитов, которую можно посмотреть.',
      'GitHub хостит ваш репозиторий онлайн, чтобы он был не только на одной машине. <code>git push</code> загружает туда ваши локальные коммиты. Это важно по двум причинам: это резервная копия, и — начиная с ближайших модулей — именно это позволяет автоматическому пайплайну (CI) запускать ваши тесты при каждом push, вместо того чтобы запускать их вручную.',
      'Виртуальное окружение (<code>venv</code>) — это личная, изолированная копия Python для одной папки проекта: пакеты, которые вы ставите через <code>pip install</code> внутри него, существуют ТОЛЬКО там, не на всю систему. Без него все проекты на вашей машине делят один общий набор пакетов, и два проекта, которым нужны разные версии одной и той же библиотеки, молча ломают друг друга — это одна из самых первых вещей, которые реальная команда проверяет, когда новый проект «просто не работает» на чужой машине.',
      'Несколько настоящих возможностей Python сознательно отсутствуют в этой песочнице (это учебное подмножество, помните?) — срезы (<code>list[1:3]</code>), <code>.items()</code>, распаковка кортежей, <code>*args</code>. Несколько задач ниже показывают настоящий код с их использованием и просят предсказать вывод — точно так же, как раньше работали задачи «предскажите», — только теперь ничего не выполняется в браузере, потому что это настоящий Python, а не песочница.'
    ],
    tasks: {
      'm6-t1': {
        title: 'Установить настоящий Python',
        goal: 'Установите Python 3.12 или новее с сайта <code>python.org</code>. Откройте терминал и выполните <code>python --version</code> (или <code>python3 --version</code>) — убедитесь, что печатается строка вида <code>Python 3.x.x</code>. Отметьте выполненным, когда увидите этот вывод.',
        hint: 'В Windows во время установки отметьте «Add python.exe to PATH» — иначе терминал потом не найдёт команду <code>python</code>.'
      },
      'm6-t2': {
        title: 'Установить VS Code и расширение Python',
        goal: 'Установите VS Code, затем откройте панель Extensions (значок из четырёх квадратов на боковой панели) и установите официальное расширение <b>Python</b> от Microsoft. Отметьте выполненным, когда оно покажется установленным.',
        hint: 'Можно также установить его из командной строки через <code>code --install-extension ms-python.python</code>, если не хочется кликать по интерфейсу.'
      },
      'm6-t3': {
        title: 'Запустить свой первый настоящий .py-файл',
        goal: 'Создайте папку <code>autoquest-practice</code>, откройте её в VS Code, создайте файл <code>hello.py</code> с содержимым <code>print("Hello from real Python")</code>, и запустите его — либо кнопкой Run в VS Code, либо командой <code>python hello.py</code> в терминале, открытом в этой папке. Отметьте выполненным, когда увидите сообщение, напечатанное в НАСТОЯЩЕМ терминале, а не в этой браузерной песочнице.',
        hint: 'Если <code>python hello.py</code> говорит, что файл не найден, скорее всего терминал открыт не в папке <code>autoquest-practice</code> — сначала проверьте текущую директорию.'
      },
      'm6-t4': {
        title: 'Предскажите: настоящие срезы',
        goal: 'Здесь используется настоящая возможность Python (срезы), которую эта песочница не поддерживает. Прочитайте код, предскажите вывод так, как он выполнился бы в настоящем Python, который вы только что установили, затем проверьте себя.',
        hint: '<code>list[1:3]</code> берёт элементы начиная с индекса 1, вплоть до (не включая) индекса 3 — то есть элементы с индексами 1 и 2.'
      },
      'm6-t5': {
        title: 'Предскажите: настоящий dict.items()',
        goal: 'У настоящих словарей Python есть метод <code>.items()</code>, которого нет в этой песочнице. Прочитайте код и предскажите вывод.',
        hint: '<code>.items()</code> даёт сразу и ключ, и значение на каждом проходе цикла — не нужно искать значение через <code>settings[key]</code>, как раньше.'
      },
      'm6-t6': {
        title: 'Предскажите: распаковка кортежа',
        goal: 'Настоящий Python позволяет распаковать кортеж в несколько переменных одной строкой — эта песочница этого не поддерживает. Прочитайте код и предскажите вывод.',
        hint: '<code>x, y = point</code> достаёт два значения из кортежа <code>point</code> и присваивает их <code>x</code> и <code>y</code> по порядку.'
      },
      'm6-t7': {
        title: 'Превратить папку в git-репозиторий',
        goal: 'Внутри <code>autoquest-practice</code> выполните <code>git init</code>. ПЕРЕД коммитом выполните <code>git config user.email</code>, чтобы увидеть, какой email использует здесь git — если показывается рабочий email, а это личный проект, исправьте его только для этой папки через <code>git config user.email "you@example.com"</code> (без <code>--global</code>). Затем <code>git add hello.py</code> и <code>git commit -m "first commit"</code>. Убедитесь через <code>git log</code>. Отметьте выполненным, когда увидите свой коммит с тем email, который вы на самом деле хотели.',
        hint: 'Git часто подставляет вашу личность из общесистемных настроек — на рабочем ноутбуке это часто рабочий email, даже для личного репозитория. Проверить ДО первого коммита намного проще, чем чинить это в уже запушенной истории позже.'
      },
      'm6-t8': {
        title: 'Запушить на GitHub',
        goal: 'Создайте новый пустой репозиторий на GitHub (любое имя, например <code>autoquest-practice</code>) — не инициализируйте его с README. Следуйте собственным инструкциям GitHub, чтобы подключить локальную папку как <code>origin</code>, и выполните <code>git push -u origin main</code> (или <code>master</code>, в зависимости от имени вашей ветки по умолчанию). Убедитесь, что файл <code>hello.py</code> появился на странице GitHub. Отметьте выполненным, когда увидите его там.',
        hint: 'Если <code>push</code> отклоняется или просит учётные данные так, что это не срабатывает — GitHub теперь требует personal access token вместо пароля аккаунта для этого, страница с инструкциями push на самом GitHub объясняет, как его настроить.'
      },
      'm6-t9': {
        title: 'Предскажите: *args собирает лишние аргументы',
        goal: 'Настоящий Python позволяет функции принимать любое число аргументов через <code>*args</code> — эта песочница этого не поддерживает. Прочитайте код и предскажите вывод.',
        hint: '<code>*args</code> собирает все переданные в функцию аргументы в кортеж чисел; <code>sum(args)</code> складывает их все, сколько бы их ни было.'
      },
      'm6-t10': {
        title: 'Предскажите: sorted() и срезы вместе',
        goal: 'Совместите две возможности, доступные только в настоящем Python: <code>sorted()</code> и срезы. Прочитайте код и предскажите точный вывод.',
        hint: '<code>sorted(durations)</code> возвращает НОВЫЙ список по возрастанию, не меняя сам <code>durations</code> (в отличие от <code>.sort()</code> из модуля 5, который сортирует на месте). Затем <code>[:3]</code> берёт первые три элемента этого нового отсортированного списка.'
      },
      'm6-hw1': {
        title: 'Создать и использовать настоящее виртуальное окружение',
        goal: 'Откройте собственный встроенный терминал VS Code (View → Terminal) внутри <code>autoquest-practice</code> и убедитесь, что <code>python --version</code>/<code>git --version</code> оба работают изнутри него. Затем создайте виртуальное окружение через <code>python -m venv venv</code>, активируйте его (<code>venv\\Scripts\\activate</code> на Windows, <code>source venv/bin/activate</code> на macOS/Linux — в приглашении терминала должно появиться <code>(venv)</code>), и выполните <code>pip install requests</code> внутри него. Подтвердите изоляцию: выполните <code>pip show requests</code> (пакет на месте), затем <code>deactivate</code> и снова <code>pip show requests</code> УЖЕ ВНЕ venv — отметьте выполненным, когда увидите «not found» снаружи, что доказывает: установка осталась только внутри этого проекта.',
        hint: 'Это не просто формальность — именно venv позволяет двум разным проектам на одной машине нуждаться в разных версиях одной и той же библиотеки, не ломая друг друга, и это самая первая вещь, которую реальная команда проверяет, когда «у меня работает» на деле означает «работает только внутри моей одной глобальной установки Python». Всё, что вы до сих пор делали в отдельном терминале, точно так же работает и во встроенном терминале VS Code — поэтому оба шага объединены в одной задаче.'
      },
      'm6-hw2': {
        title: 'Предскажите: самодокументирующиеся f-строки',
        goal: 'У настоящих f-строк Python (3.8+) есть сокращение для отладки, которое эта песочница не поддерживает. Прочитайте код и предскажите точный вывод.',
        hint: 'Добавление <code>=</code> прямо перед закрывающей <code>}</code> в f-строке печатает и само выражение, И его значение, ровно как написано — удобно для быстрой отладки без написания отдельного сообщения.'
      },
      'm6-hw3': {
        title: 'Изменить, закоммитить, запушить снова',
        goal: 'Измените сообщение в <code>hello.py</code> на что-нибудь другое, сохраните, затем снова выполните <code>git add</code>, <code>git commit -m "..."</code> и <code>git push</code>. Убедитесь, что обновлённый файл появился на GitHub. Отметьте выполненным, когда это случится — именно этот цикл правка → коммит → push вы будете постоянно повторять, когда начнёте строить настоящий тестовый фреймворк.',
        hint: 'Не нужно снова выполнять <code>git init</code> или заново подключать <code>origin</code> — эта настройка делается один раз на весь репозиторий. На этот раз это просто add, commit, push.'
      }
    }
  },
  m7: {
    title: 'ООП: классы и объекты',
    desc: 'классы, объекты, атрибуты и методы — основа Page Object и фикстур',
    theory: [
      'Эта песочница вообще не понимает <code>class</code> — каждая задача этого модуля выполняется в настоящем Python и VS Code, которые вы настроили в модуле 6. Это также значит настоящие ошибки отныне: реальный Python traceback, а не дружелюбные объяснения этого сайта. Читать их по-настоящему, прямо сейчас, пока ставки низкие, — это именно тот навык, на который вы будете опираться позже.',
      '<code>class</code> — это чертёж; объект («экземпляр») — конкретная вещь, построенная по нему. <code>def __init__(self, name, price):</code> — конструктор: он запускается автоматически в момент создания объекта и настраивает его начальные атрибуты: <code>self.name = name</code> сохраняет значение на ЭТОМ конкретном объекте.',
      '<code>self</code> — это просто «этот конкретный объект» — Python автоматически передаёт его первым аргументом в каждый метод, вы никогда не передаёте его сами при вызове. <code>product.price_with_tax()</code> незаметно превращается в <code>Product.price_with_tax(product)</code> под капотом — <code>self</code> И ЕСТЬ <code>product</code> внутри этого метода.',
      'Атрибуты (<code>self.name</code>, <code>self.price</code>) хранят данные объекта; методы (функции, определённые внутри класса, с <code>self</code> первым параметром) — это то, что объект умеет ДЕЛАТЬ. У двух объектов одного класса совершенно раздельные атрибуты — изменение одного никогда не влияет на другой, даже если у них общий чертёж.',
      'Это ровно та форма, в которой существует Page Object — паттерн, который вы будете использовать постоянно, когда дойдёте до Selenium/Playwright: класс на страницу, атрибуты для вещей вроде базового URL, методы для действий на этой странице (<code>login()</code>, <code>search(query)</code>) — вместо копипаста сырых команд браузера в каждый тест.',
      'Метод может вызвать другой метод того же объекта через <code>self</code> — <code>self.total()</code> внутри другого метода того же класса. Так собираются небольшие кусочки, которые сочетаются друг с другом, точно как функции в модуле 4, только теперь они автоматически несут между собой общее состояние (атрибуты объекта).'
    ],
    tasks: {
      'm7-t1': {
        title: 'Ваш первый класс',
        goal: 'В новом файле напишите <code>class Product:</code> с <code>__init__(self, name, price)</code>, сохраняющим оба значения как атрибуты. Создайте <code>mouse = Product("Mouse", 25)</code> и напечатайте <code>f"{mouse.name}: ${mouse.price}"</code>. Запустите — убедитесь, что видите <b>Mouse: $25</b>. Отметьте выполненным, когда получится.',
        hint: '<code>def __init__(self, name, price): self.name = name; self.price = price</code> — каждое на своей строке, с отступом внутри класса. Затем обращайтесь через <code>mouse.name</code>, а не просто <code>name</code>.'
      },
      'm7-t2': {
        title: 'Добавить метод',
        goal: 'Добавьте метод <code>price_with_tax(self)</code> в <code>Product</code>, возвращающий <code>self.price * 1.2</code>. Напечатайте <code>mouse.price_with_tax()</code> для товара ценой 25 — убедитесь, что видите <b>30.0</b>.',
        hint: 'Метод определяется точно как функция, только с отступом внутри класса, с <code>self</code> первым параметром — хотя вы никогда не передаёте его сами при вызове <code>mouse.price_with_tax()</code>.'
      },
      'm7-t3': {
        title: 'Предскажите: разные объекты — разное состояние',
        goal: 'Прочитайте код и предскажите точный двухстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>a</code> и <code>b</code> построены из одного класса, но это два разных объекта — у каждого свой <code>self.count</code>, полностью независимый от другого.'
      },
      'm7-t4': {
        title: 'Прочитать настоящий TypeError',
        goal: 'Запустите этот код точно как есть (скопируйте без изменений) и прочитайте настоящий traceback, который он выдаёт — он жалуется на количество аргументов у <code>greet</code>. Разберитесь, чего не хватает в определении метода, исправьте и запустите снова, пока не увидите <b>Hello, Alex!</b>',
        hint: 'Каждому методу нужен <code>self</code> первым параметром, даже тем, что не используют другой ввод. Формулировка «positional arguments» в traceback — это то, как настоящий Python описывает такое несовпадение.'
      },
      'm7-t5': {
        title: 'Крошечный Page Object',
        goal: 'Напишите <code>class LoginPage:</code> с <code>__init__(self, base_url)</code>, сохраняющим <code>base_url</code>, и методом <code>login_url(self)</code>, возвращающим <code>f"{self.base_url}/login"</code>. Создайте <code>page = LoginPage("https://automationexercise.com")</code> и напечатайте <code>page.login_url()</code> — убедитесь, что видите <b>https://automationexercise.com/login</b>.',
        hint: 'Это и есть настоящая форма Page Object: атрибут для URL, метод для конкретного действия на этой странице. Модули Selenium/Playwright позже переиспользуют ровно этот паттерн с настоящими командами браузера внутри методов.'
      },
      'm7-t6': {
        title: 'Корзина как класс',
        goal: 'Напишите <code>class Cart:</code> с <code>__init__(self)</code>, задающим <code>self.items = []</code>, методом <code>add_item(self, name, price)</code>, добавляющим <code>{"name": name, "price": price}</code> в <code>self.items</code>, и методом <code>total(self)</code>, проходящим циклом по <code>self.items</code> и возвращающим сумму цен. Добавьте два товара по 25 и 45, напечатайте <code>cart.total()</code> — убедитесь, что видите <b>70</b>.',
        hint: 'Тот же паттерн накопителя из модуля 3 (сумма, цикл, <code>total += item["price"]</code>) — просто теперь он живёт внутри метода, а не отдельного скрипта.'
      },
      'm7-t7': {
        title: 'Есть право на бесплатную доставку?',
        goal: 'Добавьте метод <code>free_shipping_eligible(self)</code> в <code>Cart</code>, возвращающий <code>True</code>, если <code>self.total()</code> 100 или больше, иначе <code>False</code>. Добавьте товары по 60 и 45, напечатайте <code>cart.free_shipping_eligible()</code> — убедитесь, что видите <b>True</b>.',
        hint: 'Внутри <code>free_shipping_eligible</code> вызовите <code>self.total()</code> точно так же, как вызвали бы любой другой метод — не нужно переписывать цикл суммирования, переиспользуйте то, что уже делает <code>total()</code>.'
      },
      'm7-t8': {
        title: 'Предскажите: метод вызывает другой метод',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>summary()</code> вызывает <code>self.total()</code> внутри себя — он не повторяет цикл суммирования, а просто переиспользует другой метод через <code>self</code>, точно как в предыдущей задаче.'
      },
      'm7-t9': {
        title: 'Две независимые корзины',
        goal: 'Создайте два отдельных экземпляра <code>Cart</code>, добавьте в каждый разные товары (убедитесь, что суммы отличаются), и напечатайте обе суммы, чтобы УБЕДИТЬСЯ, что они независимы — изменение товаров одной корзины никогда не должно влиять на сумму другой.',
        hint: 'Если обе суммы совпадают или одна влияет на другую, вы, скорее всего, создали только один <code>Cart</code> и переиспользовали его, либо скопировали ссылку вместо повторного вызова <code>Cart()</code>.'
      },
      'm7-t10': {
        title: 'Отчёт о тестовом наборе как класс',
        goal: 'Напишите <code>class TestSuiteReport:</code> с <code>__init__(self, results)</code>, сохраняющим список, и методом <code>summary(self)</code>, который проходит циклом по <code>self.results</code>, считает <code>"pass"</code> и всё остальное, и возвращает РОВНО две строки: <b>Passed: N</b> и <b>Failed: N</b> (одной строкой, соединённой через <code>\\n</code>). Проверьте на <code>["pass", "fail", "pass", "pass", "fail"]</code> — убедитесь, что видите <b>Passed: 3</b>, затем <b>Failed: 2</b>.',
        hint: 'Это ровно тот же паттерн подсчёта из checkpoint модуля 3 (цикл + if/else + два счётчика) — теперь упакованный в метод, который владеет своими данными через <code>self.results</code>, вместо скрипта со свободными переменными.'
      },
      'm7-hw1': {
        title: 'Превратить функцию в класс',
        goal: 'Напишите <code>class PriceValidator:</code> с методом <code>is_valid(self, price)</code>, возвращающим <code>True</code>, если <code>price &gt; 0</code>, иначе <code>False</code> (та же логика, что <code>is_valid_price</code> из checkpoint модуля 5, теперь как метод). Напечатайте результат для 25 и для -5 — убедитесь: <b>True</b>, затем <b>False</b>.',
        hint: 'Заметьте, что у этого класса вообще нет <code>__init__</code> — не каждому классу он нужен, если нет состояния, которое нужно настроить при создании.'
      },
      'm7-hw2': {
        title: 'Предскажите: __init__ выполняется немедленно',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>__init__</code> — это не то, что вы вызываете сами — он запускается автоматически в момент вычисления <code>Logger()</code>, до всего, что идёт после этой строки.'
      },
      'm7-hw3': {
        title: 'Страница, которая знает своё состояние',
        goal: 'Добавьте метод <code>is_secure(self)</code> в ваш класс <code>LoginPage</code> из более ранней задачи, возвращающий <code>self.base_url.startswith("https")</code>. Затем, используя <code>if page.is_secure():</code>, напечатайте <code>"Secure:", page.login_url()</code> в ветке True и <code>"Insecure:", page.login_url()</code> в ветке False. Убедитесь, что вывод для <code>"https://automationexercise.com"</code> — <b>Secure: https://automationexercise.com/login</b>.',
        hint: '<code>.startswith("https")</code> — настоящий строковый метод Python: он проверяет, начинается ли строка с этого текста, напрямую возвращая True или False, точно как сравнения, которыми вы пользовались всё это время.'
      }
    }
  },
  m8: {
    title: 'Стандартная библиотека и генераторы',
    desc: 'полезные встроенные модули, итераторы и генераторы',
    theory: [
      'Стандартная библиотека — набор модулей, поставляемых вместе с самим Python — ничего не нужно устанавливать, только <code>import</code>. Это отличается от пакета вроде <code>requests</code> (модуль 11), который вы устанавливаете отдельно через <code>pip</code>. Всё в этом модуле — только настоящий Python, как и в модулях 6-7 — эта песочница вообще не поддерживает <code>import</code>.',
      '<code>json.dumps(obj)</code> превращает Python-словарь/список в текстовую JSON-строку; <code>json.loads(text)</code> превращает JSON-текст обратно в объекты Python. Это не случайное совпадение с заметкой из модуля 5 «список словарей похож на JSON» — это ИМЕННО ТО преобразование, которое автоматически происходит каждый раз, когда вы позже вызываете <code>.json()</code> у ответа API, просто сейчас сделанное вручную, чтобы вы увидели, как это работает. Одна деталь, которую стоит знать заранее: Python-<code>True</code> становится JSON-ным <code>true</code> с маленькой буквы.',
      '<code>random.randint(a, b)</code> даёт случайное целое число между <code>a</code> и <code>b</code> (оба включительно); <code>random.choice(a_list)</code> выбирает один случайный элемент из списка. Генерация тестовых данных — случайные ID, случайные валидные входные значения — одно из самых частых реальных применений этого модуля в автоматизации.',
      '<code>datetime.now()</code> (из модуля <code>datetime</code>) даёт текущие дату и время. Код автоматизации постоянно использует это для вещей вроде временной метки строки лога или уникального имени отчёта о прогоне тестов.',
      '<b>Генератор</b> — это функция, использующая <code>yield</code> вместо <code>return</code> — её вызов вообще не выполняет тело функции, а только создаёт приостановленный объект-генератор. Тело начинает выполняться (и выполняется только до следующего <code>yield</code>) лишь тогда, когда вы достаёте из него значение — либо через <code>next(gen)</code>, либо перебирая его циклом <code>for</code>. Это важно в автоматизации, когда вы генерируете много тестовых данных или читаете огромный файл — генератор выдаёт по одному элементу за раз, вместо того чтобы сразу собрать всё в памяти.',
      'Генератор можно пройти только ОДИН РАЗ — как только цикл <code>for</code> (или достаточное число вызовов <code>next()</code>) вытянул из него все значения, повторный проход по нему больше ничего не даёт. Это постоянно сбивает с толку; лучше узнать это сейчас, чем отлаживать в настоящем наборе тестов.'
    ],
    tasks: {
      'm8-t1': {
        title: 'Словарь становится JSON-текстом',
        goal: 'Выполните <code>import json</code>, затем <code>json.dumps({"name": "Mouse", "price": 25, "in_stock": True})</code>, напечатайте результат. Убедитесь, что видите <b>{"name": "Mouse", "price": 25, "in_stock": true}</b> — обратите внимание на <code>true</code> с маленькой буквы, хотя в Python вы написали <code>True</code>.',
        hint: '<code>json.dumps(...)</code> возвращает строку — сохраните её в переменную и напечатайте эту переменную через <code>print()</code>, чтобы увидеть.'
      },
      'm8-t2': {
        title: 'Разобрать JSON-текст обратно в Python',
        goal: 'При тексте <code>raw = \'{"status": "pass", "duration": 12}\'</code> используйте <code>json.loads(raw)</code>, чтобы превратить его в настоящий словарь Python, затем напечатайте <code>data["status"]</code> и <code>data["duration"]</code>. Убедитесь, что видите <b>pass</b>, затем <b>12</b>.',
        hint: 'После разбора через <code>json.loads</code> <code>data</code> ведёт себя точно как любой словарь, который вы собирали вручную в модуле 5 — тот же доступ через квадратные скобки.'
      },
      'm8-t3': {
        title: 'Случайное значение тестовых данных',
        goal: 'Выполните <code>import random</code>, затем напечатайте <code>random.randint(1, 6)</code>. Запустите весь файл 3-4 раза — убедитесь, что число каждый раз меняется и всегда попадает между 1 и 6.',
        hint: 'Здесь сознательно нет фиксированного ожидаемого вывода — случайные данные случайны. Вы проверяете ДИАПАЗОН, а не одно конкретное число.'
      },
      'm8-t4': {
        title: 'Выбрать случайный элемент',
        goal: 'При <code>names = ["Alice", "Bob", "Charlie", "Dana"]</code> напечатайте <code>random.choice(names)</code>. Запустите несколько раз — убедитесь, что получаете разные имена из списка при разных запусках.',
        hint: '<code>random.choice(a_list)</code> работает с любым списком — та же идея, что и <code>random.randint</code>, только выбирается существующий элемент, а не число в диапазоне.'
      },
      'm8-t5': {
        title: 'Текущая временная метка',
        goal: 'Выполните <code>from datetime import datetime</code>, затем <code>now = datetime.now()</code>, затем напечатайте <code>now.year</code>. Убедитесь, что печатается текущий год.',
        hint: '<code>datetime.now()</code> возвращает объект с несколькими отдельно доступными частями — <code>.year</code>, <code>.month</code>, <code>.day</code> и другие — а не одну общую временную метку.'
      },
      'm8-t6': {
        title: 'Предскажите: генератор не выполняется, пока из него не тянут',
        goal: 'Прочитайте код и предскажите точный трёхстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: 'Создание <code>countdown()</code> ЕЩЁ НЕ выполняет ничего внутри неё — тело начинает работать, только когда <code>next(gen)</code> реально запрашивает первое значение. Обратите внимание, где окажется "created" относительно "starting".'
      },
      'm8-t7': {
        title: 'Пройти циклом по генератору',
        goal: 'Напишите генератор <code>countdown()</code> из предыдущей задачи (три оператора <code>yield</code>: 3, 2, 1), затем пройдитесь по нему циклом через <code>for n in countdown(): print(n)</code>. Убедитесь, что видите <b>3</b>, <b>2</b>, <b>1</b> на отдельных строках.',
        hint: 'Цикл <code>for</code> по генератору автоматически вытягивает из него значения по одному, точно как по списку — вы никогда не вызываете <code>next()</code> сами, используя <code>for</code>.'
      },
      'm8-t8': {
        title: 'Предскажите: генератор работает только один раз',
        goal: 'Прочитайте код и предскажите точный вывод — обратите внимание, напечатает ли второй цикл вообще что-нибудь.',
        hint: 'Как только первый цикл <code>for</code> вытянул из <code>gen</code> все значения, в нём ничего не остаётся — повторный проход по ТОМУ ЖЕ объекту-генератору находит его уже пустым.'
      },
      'm8-t9': {
        title: 'Случайный тест-кейс как JSON',
        goal: 'Соберите словарь <code>{"id": random.randint(1000, 9999), "name": "test_login", "status": "pass"}</code>, затем напечатайте его через <code>json.dumps(...)</code>. Убедитесь, что напечатанный текст — валидный JSON со всеми тремя ключами, и каждый запуск даёт другой <code>id</code>.',
        hint: 'В начале файла нужны и <code>import json</code>, и <code>import random</code> — совмещение двух модулей стандартной библиотеки в одном скрипте — обычное дело.'
      },
      'm8-t10': {
        title: 'Результаты тестов из генератора',
        goal: 'Напишите генератор <code>test_results()</code>, который через <code>yield</code> по порядку выдаёт три словаря: <code>{"name": "test_login", "status": "pass"}</code>, <code>{"name": "test_logout", "status": "fail"}</code>, <code>{"name": "test_search", "status": "pass"}</code>. Пройдитесь циклом по <code>test_results()</code>, посчитайте <code>"pass"</code> и всё остальное, и напечатайте РОВНО две строки: <b>Passed: 2</b> и <b>Failed: 1</b>.',
        hint: 'Это тот же паттерн подсчёта, что в checkpoint модуля 3 и в боссе модуля 7 — единственное новое здесь то, что данные приходят по одному словарю из генератора, а не сразу лежат в списке.'
      },
      'm8-hw1': {
        title: 'Намеренная пауза',
        goal: 'Выполните <code>import time</code>, затем <code>print("Starting")</code>, затем <code>time.sleep(1)</code>, затем <code>print("Done")</code>. Убедитесь, что между печатью двух строк проходит примерно секунда.',
        hint: '<code>time.sleep(seconds)</code> — это НАСТОЯЩАЯ пауза — во время неё ничего больше не выполняется. Это грубый инструмент; дойдя до Selenium/Playwright, вы будете использовать умные ожидания, которые ждут ровно столько, сколько реально нужно, а не заданное наугад время.'
      },
      'm8-hw2': {
        title: 'Предскажите: next() продолжает ровно с того места, где остановился',
        goal: 'Прочитайте код и предскажите точный четырёхстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: 'Первый <code>next(gen)</code> выполняет тело вплоть до (и включая) первый <code>yield</code> — попутно печатая "step A". ВТОРОЙ <code>next(gen)</code> продолжает сразу после того <code>yield</code>, а не сначала функции.'
      },
      'm8-hw3': {
        title: 'Сложить цены из ответа API в формате JSON',
        goal: 'При <code>response = \'[{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]\'</code> (строка, ровно как она пришла бы от настоящего API), используйте <code>json.loads(response)</code>, чтобы разобрать её, пройдитесь циклом по результату, сложите цены и напечатайте сумму. Убедитесь, что видите <b>70</b>.',
        hint: 'После разбора это РОВНО та же форма «список словарей» из модуля 5 — цикл суммирования идентичен тому, что вы уже знаете, единственный новый шаг — <code>json.loads</code> в начале.'
      }
    }
  },
  m9: {
    title: 'Pytest',
    desc: 'запуск тестов, assert, фикстуры, параметризация',
    theory: [
      'Pytest — это СРЕДСТВО ЗАПУСКА ТЕСТОВ (test runner): программа, которая находит и выполняет ваши тестовые функции и сообщает, какие прошли, а какие упали. Тест — это просто функция, чьё имя начинается с <code>test_</code>, живущая в файле, чьё имя начинается с <code>test_</code>. Запуск <code>pytest</code> в терминале внутри этой папки находит их все автоматически — вызывать их самостоятельно не нужно.',
      '<code>assert</code> — это настоящая версия проверки ok/fail, которую ВЕСЬ этот курс имитировал своим собственным хелпером <code>matchEn(...)</code>: <code>assert cart.total() == 70</code> ничего не делает, если это верно, и поднимает <code>AssertionError</code>, если нет — pytest это ловит и сообщает, что тест упал, показывая, что именно сравнивалось.',
      'Устанавливается через <code>pip install pytest</code> — это первый пакет не из стандартной библиотеки, который вы устанавливаете (модуль 8 был весь встроенным; <code>requests</code> в модуле 11 будет такой же установкой).',
      '<b>Фикстура</b> — функция с декоратором <code>@pytest.fixture</code>, которая что-то настраивает один раз и передаёт это любому тесту, который попросит её, назвав её именем как параметр. Если пяти тестам нужна предзаполненная <code>Cart</code>, фикстура строит её один раз за прогон тестов, вместо того чтобы пять тестов каждый раз повторяли один и тот же код настройки.',
      '<code>@pytest.mark.parametrize("price,expected", [(100, True), (50, False)])</code> запускает ОДНУ И ТУ ЖЕ тестовую функцию по разу на каждую строку данных, вместо того чтобы писать почти одинаковые тестовые функции для чуть разных входных данных. Именно так настоящий набор тестов покрывает много случаев без копипаста целого теста каждый раз.',
      'Читать провал pytest — настоящий навык, а не пугающий шум: он показывает вам точную строку assert, а часто и фактические значения с обеих сторон — <code>assert 71 == 70</code> прямо говорит, что ваш код выдал 71, когда тест ожидал 70. Освойтесь читать это уже сейчас — так выглядит каждый красный прогон отныне.'
    ],
    tasks: {
      'm9-t1': {
        title: 'Установить pytest',
        goal: 'Выполните <code>pip install pytest</code>, затем убедитесь, что всё получилось, через <code>pytest --version</code> — должен напечататься номер версии. Отметьте выполненным, когда увидите его.',
        hint: 'Если <code>pip</code> не найден, попробуйте вместо этого <code>python -m pip install pytest</code> — тот же результат, но явно указывает, в какой именно Python идёт установка.'
      },
      'm9-t2': {
        title: 'Ваш первый прошедший тест',
        goal: 'Создайте файл <code>test_basic.py</code> с функцией <code>test_addition()</code>, которая делает <code>assert 2 + 2 == 4</code>. Запустите <code>pytest test_basic.py</code> в терминале в этой папке. Убедитесь, что итоговая строка говорит <b>1 passed</b>.',
        hint: 'Важны и имя файла, и имя функции — pytest находит только функции, начинающиеся с <code>test_</code>, внутри файлов, начинающихся с <code>test_</code>.'
      },
      'm9-t3': {
        title: 'Намеренно прочитать настоящий провал',
        goal: 'В новом файле <code>test_fail.py</code> напишите <code>def test_wrong(): assert 2 + 2 == 5</code>. Запустите <code>pytest test_fail.py</code> и прочитайте вывод — найдите строку, показывающую, что на самом деле сравнивалось. Убедитесь, что можете указать, где написано <b>1 failed</b> и строку с неверным assert.',
        hint: 'Здесь вы ничего не чините — эта задача исключительно про то, чтобы спокойно прочитать настоящий провал, чтобы следующий, который вы увидите по-настоящему, не вызывал панику.'
      },
      'm9-t4': {
        title: 'Предскажите: успешный assert ничего не делает',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: 'Когда условие после <code>assert</code> истинно, абсолютно ничего видимого не происходит — выполнение просто продолжается на следующей строке, точно как <code>if</code>, чьё условие было False и пропустило свой блок.'
      },
      'm9-t5': {
        title: 'Протестировать настоящий класс Cart',
        goal: 'В <code>test_cart.py</code> напишите класс <code>Cart</code> из модуля 7 (<code>__init__</code>, <code>add_item</code>, <code>total</code>), затем функцию <code>test_cart_total()</code>, которая создаёт корзину, добавляет товары по 25 и 45, и проверяет через assert, что сумма равна 70. Запустите <code>pytest test_cart.py</code> — убедитесь: <b>1 passed</b>.',
        hint: 'Класс и тестовая функция пока могут жить в одном файле — разделение на отдельные файлы придёт позже, когда причина для этого (переиспользование во многих тестовых файлах) реально понадобится.'
      },
      'm9-t6': {
        title: 'Фикстура для корзины',
        goal: 'Перепишите предыдущий файл, используя фикстуру: <code>@pytest.fixture def cart(): ...</code>, которая строит и возвращает <code>Cart</code> с теми же двумя товарами, затем ДВЕ тестовые функции — <code>test_cart_total(cart)</code>, проверяющую сумму, и <code>test_cart_has_two_items(cart)</code>, проверяющую <code>len(cart.items) == 2</code>. Запустите pytest — убедитесь: <b>2 passed</b>.',
        hint: 'Обе тестовые функции принимают <code>cart</code> параметром с ровно этим именем — pytest автоматически сопоставляет его с функцией-фикстурой по имени, вы никогда не вызываете фикстуру сами.'
      },
      'm9-t7': {
        title: 'Предскажите: assert на разобранном JSON',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>json.loads(...)</code> даёт настоящий словарь — <code>data["status"]</code> работает точно как любое обращение к словарю, которое вы делали начиная с модуля 5, а assert либо молча проходит, либо взрывается.'
      },
      'm9-t8': {
        title: 'Параметризовать один тест на несколько случаев',
        goal: 'Напишите <code>@pytest.mark.parametrize("price,expected", [(100, True), (50, False)])</code> над <code>def test_free_shipping(price, expected): assert (price >= 100) == expected</code>. Запустите pytest с <code>-v</code> (<code>pytest test_file.py -v</code>) — убедитесь, что видите ДВА отдельных результата теста, оба успешных, по одному на строку данных.',
        hint: '<code>-v</code> (подробный режим) заставляет pytest печатать по строке на каждый отдельный случай вместо просто итогового счётчика — вы должны увидеть значение price в имени каждого теста.'
      },
      'm9-t9': {
        title: 'Падающий тест находит настоящий баг',
        goal: 'Запустите класс <code>Cart</code> и тест <code>test_cart_total</code> ниже РОВНО как есть — он падает. Прочитайте вывод падения, чтобы увидеть, какое значение на самом деле выдал <code>total()</code>, найдите баг в КЛАССЕ (не в тесте), исправьте его и перезапускайте, пока не увидите <b>1 passed</b>.',
        hint: 'Вывод падения показывает что-то вроде <code>assert 71 == 70</code> — лишняя единица откуда-то взялась в <code>total()</code>, и не имеет отношения к самим товарам.'
      },
      'm9-t10': {
        title: 'Маленький настоящий набор тестов',
        goal: 'В одном файле соберите вместе всё из этого модуля: класс <code>Cart</code> (из модуля 7, с <code>add_item</code>, <code>total</code>, <code>free_shipping_eligible</code>), <code>@pytest.fixture</code>, предоставляющую предзаполненную корзину, и как минимум ТРИ тестовые функции, использующие эту фикстуру — одна проверяет сумму, одна — количество товаров, одна — право на бесплатную доставку. Запустите <code>pytest -v</code> — убедитесь, что все показывают <b>PASSED</b>.',
        hint: 'Это ровно та форма, которую принял бы настоящий тестовый файл для этого класса в настоящем проекте — механика не меняется, когда класс усложняется, меняется только количество написанных против него тестов.'
      },
      'm9-hw1': {
        title: 'Запустить подмножество тестов по имени',
        goal: 'В файле как минимум с двумя по-разному названными тестовыми функциями запустите только одну из них через <code>pytest test_file.py -k test_name_here</code> (замените на реальное имя функции). Убедитесь, что итог показывает, что запустился только 1 тест, а не все.',
        hint: '<code>-k</code> сопоставляет по подстроке, а не по точному имени — удобно, когда хочется перезапустить только тот тест, который вы сейчас чините, не дожидаясь всего набора.'
      },
      'm9-hw2': {
        title: 'Своё сообщение assert',
        goal: 'Напишите тест, который намеренно падает, со своим сообщением: <code>assert 1 == 2, "one is never two"</code>. Запустите его и убедитесь, что ваше сообщение <b>"one is never two"</b> появляется в выводе падения, рядом с собственными деталями сравнения pytest.',
        hint: 'Текст после запятой появляется только когда assert реально падает — на прошедшем тесте он никогда не показывается, так что добавлять его для случаев, которые вы подозреваете, ничего не стоит.'
      },
      'm9-hw3': {
        title: 'Отделить класс от его теста',
        goal: 'Создайте <code>cart.py</code>, содержащий только класс <code>Cart</code> (без тестов). В <code>test_cart.py</code> добавьте <code>from cart import Cart</code> в начале, затем напишите фикстуру и тесты, используя этот импортированный класс вместо повторного определения. Запустите pytest — убедитесь, что всё ещё проходит, теперь читая класс из отдельного файла.',
        hint: 'Оба файла должны быть в одной папке, чтобы обычный <code>from cart import Cart</code> его нашёл — это минимально возможная версия структуры проекта, которую использует настоящий набор тестов.'
      }
    }
  },
  m10: {
    title: 'Обработка исключений',
    desc: 'try/except, генерация собственных ошибок, что и когда ловить',
    theory: [
      '<code>try: ... except SomeError: ...</code> — настоящая, управляемая версия каждого traceback, который вы читали начиная с модулей 6 и 7 — вместо того чтобы скрипт умирал, ВАШ код решает, что делать дальше. Код внутри <code>try:</code> выполняется как обычно; если он вызывает ровно тот тип исключения, что назван после <code>except</code>, вместо падения выполняется блок <code>except</code>.',
      'Всегда называйте КОНКРЕТНЫЙ тип исключения — <code>except ValueError:</code>, а не голый <code>except:</code>. Голый <code>except:</code> ловит буквально всё, включая баги, которые вы никогда не хотели скрывать, и превращает настоящее падение в тихое неверное поведение, которое намного труднее отладить позже.',
      '<code>else:</code> после try/except выполняется только когда исключения НЕ произошло; <code>finally:</code> выполняется в любом случае — было исключение или нет. <code>finally</code> нужен для очистки, которая должна произойти всегда, например закрытие соединения, независимо от того, прошёл тест или взорвался.',
      'Можно намеренно поднять своё собственное исключение через <code>raise ValueError("a clear message")</code> — так вы падаете быстро с сообщением, которое реально объясняет, что пошло не так, вместо того чтобы позволить сломанным данным тихо распространяться глубже в код.',
      'В автоматизации это не необязательная вежливость — это то, как вы отличаете «это конкретное, ожидаемое явление пошло не так, обработай его» (нестабильный сетевой вызов, отсутствующее необязательное поле) от «что-то реально сломано, пусть падает громко». Ловить слишком много скрывает настоящие баги; ловить слишком мало делает ваши тестовые хелперы хрупкими.'
    ],
    tasks: {
      'm10-t1': {
        title: 'Поймать настоящий ZeroDivisionError',
        goal: 'Оберните <code>print(10 / 0)</code> в <code>try</code>/<code>except ZeroDivisionError:</code>, печатающий <b>Cannot divide by zero</b> вместо падения. Запустите — убедитесь, что видите это сообщение, а не traceback.',
        hint: '<code>try:</code>, затем рискованная строка с отступом под ним, затем <code>except ZeroDivisionError:</code> с тем же отступом, что и <code>try</code>, а запасной <code>print(...)</code> с отступом уже под ним.'
      },
      'm10-t2': {
        title: 'Поймать настоящий ValueError',
        goal: 'Оберните <code>age = int("abc")</code> в <code>try</code>/<code>except ValueError:</code>, печатающий <b>Invalid number</b> вместо падения. Запустите — убедитесь, что видите это сообщение.',
        hint: '<code>int("abc")</code> поднимает <code>ValueError</code> в настоящем Python ровно по той же причине, о которой предупреждали задачи песочницы ещё в модуле 1 — текст, не являющийся валидным числом, не может им стать.'
      },
      'm10-t3': {
        title: 'Предскажите: else выполняется, только когда всё прошло без ошибок',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>10 / 2</code> ничего не поднимает, поэтому блок <code>except</code> целиком пропускается, и вместо него выполняется блок <code>else</code> — <code>else</code> не общий запасной вариант, он означает именно «исключения не произошло».'
      },
      'm10-t4': {
        title: 'Не тот тип исключения — всё равно падает',
        goal: 'Запустите код ниже ровно как есть — он всё равно падает с настоящим <code>ValueError</code>, хотя <code>try</code>/<code>except</code> ЕСТЬ. Прочитайте traceback, разберитесь, почему блок except его не поймал, исправьте тип исключения и перезапускайте, пока не увидите <b>Handled</b>.',
        hint: 'Блок <code>except</code> ловит только ТОЧНО тот тип исключения (или его родителя), что назван — <code>except ZeroDivisionError:</code> вообще ничего не делает для <code>ValueError</code>, падение просто проходит прямо сквозь него.'
      },
      'm10-t5': {
        title: 'Предскажите: finally выполняется всегда',
        goal: 'Прочитайте код и предскажите точный двухстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>finally</code> выполняется после завершения <code>try</code>/<code>except</code>, независимо от того, какая ветка сработала — думайте об этом как «что бы ни случилось выше, сделай это последним».'
      },
      'm10-t6': {
        title: 'Настоящий цикл повторных попыток',
        goal: 'Напишите функцию <code>flaky_call()</code>, которая большую часть времени поднимает <code>ConnectionError("Network issue")</code> (например, <code>if random.random() &lt; 0.7: raise ConnectionError(...)</code>), иначе возвращает <code>"success"</code>. Используя цикл <code>while</code> и <code>try</code>/<code>except ConnectionError</code>, повторяйте попытку до 5 раз, печатая <b>Retry N</b> при каждой неудаче и результат при успехе, затем в любом случае останавливаясь. Запустите несколько раз — убедитесь, что иногда видите успех после нескольких попыток, а иногда — исчерпание всех 5.',
        hint: 'Это ровно тот же паттерн повторных попыток из домашнего задания модуля 3, с одним дополнением: то, что может упасть, теперь обёрнуто в <code>try</code>/<code>except</code>, а не просто считается надёжным.'
      },
      'm10-t7': {
        title: 'Прочитать свою собственную поднятую ошибку',
        goal: 'Запустите код ниже РОВНО как есть — он намеренно падает. Прочитайте traceback и убедитесь, что можете найти в нём своё собственное сообщение, <b>"Age cannot be negative"</b>, прямо рядом с <code>ValueError</code>.',
        hint: '<code>raise ValueError("...")</code> создаёт и немедленно бросает совершенно новое исключение с вашим сообщением — прочитать его обратно в traceback — это именно то, как вы отлаживали бы настоящее падение, пришедшее из вашего собственного кода валидации.'
      },
      'm10-t8': {
        title: 'Обработать настоящий IndexError',
        goal: 'При <code>items = ["a", "b", "c"]</code> оберните <code>print(items[5])</code> в <code>try</code>/<code>except IndexError:</code>, печатающий <b>No item at that position</b> вместо падения. Запустите — убедитесь, что видите это сообщение.',
        hint: 'Та же идея, что и в задачах с <code>ZeroDivisionError</code> и <code>ValueError</code> — меняется только тип исключения, названный после <code>except</code>, чтобы совпасть с тем, что реально может поднять рискованная строка.'
      },
      'm10-t9': {
        title: 'Поймать два типа исключений сразу',
        goal: 'Напишите функцию <code>parse(value)</code>, которая возвращает <code>int(value)</code>, но возвращает <code>None</code>, если это поднимает ЛИБО <code>ValueError</code>, ЛИБО <code>TypeError</code> — используя один блок <code>except (ValueError, TypeError):</code>, а не два отдельных. Проверьте на <code>parse("42")</code>, <code>parse("abc")</code> и <code>parse(None)</code>. Убедитесь, что видите <b>42</b>, затем <b>None</b>, затем <b>None</b>.',
        hint: 'Указание нескольких типов исключений в скобках после <code>except</code> ловит любой из них одним блоком — <code>int(None)</code> поднимает <code>TypeError</code> (совсем не тот тип), а <code>int("abc")</code> — <code>ValueError</code> (тип верный, содержимое невалидно).'
      },
      'm10-t10': {
        title: 'Безопасно разобрать список сырых цен',
        goal: 'Напишите <code>safe_parse_price(raw)</code>, возвращающую <code>int(raw)</code>, или <code>None</code>, если это поднимает <code>ValueError</code>. При <code>raw_prices = ["25", "abc", "45", "", "60"]</code> соберите список только успешно разобранных цен (пропустив те, что дали <code>None</code>), и напечатайте их сумму. Убедитесь, что видите <b>130</b>.',
        hint: '<code>price is not None</code> проверяет тождественность специальному значению <code>None</code> — общепринятый способ проверить это в настоящем Python, вместо <code>price != None</code>. Пустая строка <code>""</code> тоже не проходит <code>int(...)</code>, точно как <code>"abc"</code>.'
      },
      'm10-hw1': {
        title: 'Свой собственный тип исключения',
        goal: 'Определите <code>class InvalidPriceError(Exception): pass</code> — своё исключение. Напишите <code>validate_price(price)</code>, поднимающую его с сообщением <code>"Price must be positive"</code>, если <code>price &lt;= 0</code>. Поймайте его через <code>except InvalidPriceError as e:</code> и напечатайте <code>f"Rejected: {e}"</code>. Проверьте на <code>validate_price(-10)</code> — убедитесь, что видите <b>Rejected: Price must be positive</b>.',
        hint: '<code>class InvalidPriceError(Exception):</code> — имя в скобках это РОДИТЕЛЬСКИЙ класс: так создаётся новый ТИП исключения, унаследовавший всё, что уже умеет <code>Exception</code> (например, нести сообщение и ловиться через except) — тот же синтаксис классов из модуля 7, только на основе уже существующего класса, а не с нуля. <code>pass</code> — это заглушка Python «ничего не делать»: она означает «тело этого класса намеренно пустое, добавлять нечего», и нужна здесь только потому, что у класса (как и у функции) не может быть совсем пустого тела. <code>as e</code> затем позволяет прочитать сообщение исключения обратно через <code>str(e)</code> или, как здесь, прямо внутри f-строки.'
      },
      'm10-hw2': {
        title: 'Предскажите: вложенные try/except',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: 'ВНУТРЕННИЙ <code>except</code> ловит только <code>ValueError</code> — <code>ZeroDivisionError</code> не является им, поэтому он полностью пропускает внутренний except и продолжает распространяться наружу, пока его не поймает ВНЕШНИЙ <code>except ZeroDivisionError</code>.'
      },
      'm10-hw3': {
        title: 'try/except против .get() для одной и той же проблемы',
        goal: 'При <code>settings = {"env": "staging"}</code> оберните <code>print(settings["timeout"])</code> в <code>try</code>/<code>except KeyError:</code>, печатающий <b>Using default timeout: 30</b> вместо падения. Убедитесь, что видите это сообщение — затем подумайте, как это соотносится с <code>settings.get("timeout", 30)</code> из модуля 5.',
        hint: 'Оба решают здесь ровно одну и ту же проблему. <code>.get(key, default)</code> короче и лучше читается для одного обращения к словарю; <code>try</code>/<code>except</code> — более общий инструмент, который также работает там, где <code>.get</code> вообще не может помочь, как в более ранних задачах с <code>int(...)</code> или <code>items[5]</code>.'
      }
    }
  },
  m11: {
    title: 'Моки и стабы',
    desc: 'подделка зависимостей: mock, stub — когда и зачем',
    theory: [
      'Тест не должен зависеть от настоящего платёжного API, настоящего почтового сервера или точного текущего времени, чтобы быть быстрым, воспроизводимым и проходить, даже когда интернет не работает. <b>Mock</b> — это поддельный объект-заменитель, который вы передаёте своему коду ВМЕСТО настоящей зависимости — он ведёт себя достаточно похоже, чтобы быть полезным, ничего реального не делая.',
      '<code>from unittest.mock import Mock</code> — <code>Mock()</code> создаёт поддельный объект, который без возражений принимает ЛЮБОЕ обращение к атрибуту или вызов метода, автоматически создавая новый Mock для каждого из них. Именно это делает его полезным как заменитель того, что вы ещё не построили, или не хотите вызывать по-настоящему.',
      '<code>Mock(return_value=X)</code> заставляет ВЫЗОВ мока возвращать <code>X</code> вместо очередного Mock. Можно также задать это после создания у конкретного метода: <code>fake_db.get_user.return_value = {...}</code> — сценарий прописан только для этого одного метода, всё остальное на объекте по-прежнему ведёт себя как обычный Mock.',
      'Mock также ЗАПОМИНАЕТ, как его вызывали — <code>mock.assert_called_with(args)</code> громко падает (настоящий <code>AssertionError</code>, с тем, что ожидалось, и тем, что было на самом деле), если ваш код вызвал его не так, как ожидалось, или вообще не вызвал. Это превращает «правильно ли мой код обратился к зависимости» в то, что тест может проверить автоматически.',
      '<code>side_effect</code> заставляет мок делать больше, чем возвращать одно фиксированное значение: задайте ему экземпляр исключения, чтобы каждый вызов его поднимал, или СПИСОК, чтобы каждый следующий вызов возвращал (или поднимал) следующий элемент — идеально, чтобы смоделировать нечто, что один раз падает, а потом срабатывает, не трогая ничего настоящего.',
      '<code>patch("module.function", return_value=X)</code>, используемый с <code>with</code>, временно ЗАМЕНЯЕТ настоящую функцию везде, где она ищется по этому имени, только для кода внутри блока <code>with</code> — снаружи него настоящая функция снова на месте, нетронутая. Именно так вы нейтрализуете что-то непредсказуемое (вроде <code>random</code> или сети) только на длительность одного теста.'
    ],
    tasks: {
      'm11-t1': {
        title: 'Mock принимает что угодно',
        goal: 'Выполните <code>from unittest.mock import Mock</code>, создайте <code>fake_api = Mock()</code>, затем вызовите <code>fake_api.get_status()</code> — метод, который нигде никогда не определялся. Убедитесь, что это НЕ падает, и напечатайте после этого <b>Called without error</b>.',
        hint: 'Обычный <code>Mock()</code> автоматически создаёт на месте любой атрибут или метод, который вы запросите — на Mock не бывает ошибки «неопределённый метод».'
      },
      'm11-t2': {
        title: 'Управлять тем, что возвращает вызов',
        goal: 'Создайте <code>fake_api = Mock(return_value="200 OK")</code>, вызовите его как <code>fake_api()</code>, и напечатайте результат. Убедитесь, что видите <b>200 OK</b>.',
        hint: '<code>return_value</code> задаётся один раз, при создании — каждый последующий вызов <code>fake_api()</code> возвращает ровно то же прописанное значение.'
      },
      'm11-t3': {
        title: 'Предскажите: сценарий для одного конкретного метода',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: 'Сценарий с <code>return_value</code> прописан только для <code>get_user</code> — вызов его с <code>42</code> или любым другим аргументом всё равно возвращает тот же фиксированный словарь, потому что обычный Mock не проверяет свои аргументы, пока вы его об этом не попросите.'
      },
      'm11-t4': {
        title: 'Проверить, что mock был вызван правильно',
        goal: 'Напишите функцию <code>notify_user(email, message)</code>, вызывающую <code>send_email(email, message)</code>, где <code>send_email = Mock()</code>. Вызовите <code>notify_user("alex@example.com", "Order shipped")</code>, затем <code>send_email.assert_called_with("alex@example.com", "Order shipped")</code>, затем напечатайте <b>Assertion passed</b>. Убедитесь, что видите это (отсутствие падения значит, что проверка прошла).',
        hint: '<code>assert_called_with(...)</code> не возвращает <code>True</code>/<code>False</code> — он поднимает настоящий <code>AssertionError</code>, если вызов не совпадает, и вообще ничего не делает (выполнение просто продолжается), если совпадает.'
      },
      'm11-t5': {
        title: 'Прочитать настоящий провал проверки мока',
        goal: 'Запустите код ниже РОВНО как есть — он намеренно вызывает <code>send_email</code> с НЕВЕРНЫМИ аргументами, а затем проверяет ожидаемые. Прочитайте получившийся <code>AssertionError</code> и убедитесь, что можете найти в нём и показанный <b>Expected</b>, и <b>Actual</b> вызов.',
        hint: 'Собственные провалы проверок Mock нарочно необычно читаемы — они печатают ровно то, что ожидалось, рядом с ровно тем, что произошло на самом деле, специально, чтобы вам не пришлось гадать.'
      },
      'm11-t6': {
        title: 'Предскажите: call_count',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: 'Каждый mock автоматически считает, сколько раз его вызывали, доступно как <code>.call_count</code> — настройка не нужна, отслеживается с момента создания мока.'
      },
      'm11-t7': {
        title: 'Временно подменить настоящую функцию',
        goal: 'Напишите <code>roll_dice()</code>, возвращающую <code>random.randint(1, 6)</code>. Используя <code>with patch("random.randint", return_value=4):</code>, вызовите <code>roll_dice()</code> внутри блока <code>with</code> и напечатайте результат. Убедитесь, что видите <b>4</b> при каждом запуске, а не случайное число.',
        hint: '<code>patch(...)</code> заменяет настоящий <code>random.randint</code> везде, где он ищется по этому имени, на время выполнения блока <code>with</code> с отступом — <code>roll_dice</code> вообще не изменилась, но то, что она вызывает, изменилось.'
      },
      'm11-t8': {
        title: 'Mock, который поднимает исключение вместо возврата',
        goal: 'Создайте <code>flaky = Mock(side_effect=ConnectionError("Network down"))</code>. Вызовите его внутри <code>try</code>/<code>except ConnectionError as e:</code>, печатающего <code>f"Caught: {e}"</code>. Убедитесь, что видите <b>Caught: Network down</b>.',
        hint: 'Задание <code>side_effect</code> в виде ЭКЗЕМПЛЯРА исключения (а не просто класса) заставляет каждый вызов мока поднимать ровно это исключение — это паттерн модуля 10, теперь моделирующий зависимость, которая намеренно падает.'
      },
      'm11-t9': {
        title: 'Замокать платёжный шлюз',
        goal: 'Напишите <code>checkout(cart_total, payment_gateway)</code>, вызывающую <code>payment_gateway.charge(cart_total)</code> и возвращающую <b>"Order placed"</b>. Вызовите её с <code>150</code> и <code>fake_gateway = Mock()</code>, затем проверьте <code>fake_gateway.charge.assert_called_with(150)</code>, затем напечатайте результат. Убедитесь, что видите <b>Order placed</b> без падения.',
        hint: 'Тестируемая функция никогда не знает, что <code>payment_gateway</code> поддельный — она просто вызывает <code>.charge(...)</code> у того объекта, что ей дали, точно как сделала бы это с настоящим платёжным клиентом.'
      },
      'm11-t10': {
        title: 'Оформление заказа с замоканным email-сервисом',
        goal: 'Напишите <code>checkout(cart, email_service)</code>, которая складывает <code>item["price"]</code> для каждого элемента <code>cart</code>, вызывает <code>email_service.send(f"Your total is {total}")</code>, и возвращает <code>total</code>. При <code>cart = [{"name": "Mouse", "price": 25}, {"name": "Keyboard", "price": 45}]</code> и <code>fake_email = Mock()</code>, вызовите <code>checkout(cart, fake_email)</code>, затем проверьте <code>fake_email.send.assert_called_once_with("Your total is 70")</code>, затем напечатайте возвращённую сумму. Убедитесь, что видите <b>70</b> без падения.',
        hint: '<code>assert_called_once_with(...)</code> проверяет две вещи сразу: точные аргументы И то, что вызов был ровно один раз — строже, чем обычный <code>assert_called_with</code>, который допускает любое число вызовов, лишь бы один из них совпал.'
      },
      'm11-hw1': {
        title: 'Проверить, что что-то НИКОГДА не вызывалось',
        goal: 'Напишите <code>maybe_notify(should_notify, email_service)</code>, вызывающую <code>email_service.send("Hi")</code> только если <code>should_notify</code> равно <code>True</code>. Вызовите её с <code>False</code> и <code>send_email = Mock()</code>, затем <code>send_email.assert_not_called()</code>, затем напечатайте <b>Confirmed: email was never sent</b>. Убедитесь, что видите это без падения.',
        hint: '<code>assert_not_called()</code> — зеркальная противоположность <code>assert_called_with(...)</code> — она падает, если мок был вызван хоть раз, по любой причине.'
      },
      'm11-hw2': {
        title: 'Предскажите: reset_mock() очищает историю вызовов',
        goal: 'Прочитайте код и предскажите точный двухстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>.reset_mock()</code> обнуляет записанную историю вызовов (вроде <code>call_count</code>) — сам мок при этом не удаляется, просто забывается всё, что с ним происходило до этого.'
      },
      'm11-hw3': {
        title: 'Смоделировать «один раз падает, потом срабатывает»',
        goal: 'Создайте <code>flaky_call = Mock(side_effect=[ConnectionError("Network down"), "success"])</code>. Используя цикл <code>for attempt in range(2):</code> с <code>try</code>/<code>except ConnectionError:</code> (печатайте <b>Retry</b> при неудаче, печатайте результат и <code>break</code> при успехе), убедитесь, что вывод ровно <b>Retry</b>, затем <b>success</b>.',
        hint: 'Когда <code>side_effect</code> — СПИСОК, а не одно исключение, каждый вызов потребляет СЛЕДУЮЩИЙ элемент по порядку — первый вызов поднимает исключение, второй возвращает обычную строку, точно как настоящая нестабильная зависимость, которая восстанавливается при повторе.'
      }
    }
  },
  m12: {
    title: 'API-тестирование',
    desc: 'проверка запросов и ответов через requests',
    theory: [
      'Каждая задача ниже обращается к НАСТОЯЩЕМУ публичному API automationexercise.com — того же сайта, вокруг которого строились примеры модулей 4-11. <code>pip install requests</code>, затем <code>requests.get(url, timeout=10)</code> отправляет настоящий HTTP-запрос и возвращает объект <code>Response</code> — <code>.status_code</code> это HTTP-статус (200 = OK), <code>.json()</code> разбирает тело ответа как JSON, точно как <code>json.loads(...)</code> в модуле 8 — потому что именно это <code>.json()</code> и делает внутри себя.',
      'ВСЕГДА передавайте <code>timeout=...</code> в настоящий запрос. Без него запрос может зависнуть навсегда, если сервер так и не ответит — один зависший тест, замораживающий весь набор тестов, это реальный, частый сбой автоматизации, а не гипотетический.',
      '<code>requests.get(url)</code> читает данные, <code>requests.post(url, data={...})</code> отправляет данные — словарь, переданный как <code>data=</code>, кодируется в тело запроса как форма, по духу похоже на словари, которые вы строили весь курс, только теперь отправленные по сети, а не напечатанные.',
      'Важная, легко упускаемая ловушка: HTTP-статус-код и СОБСТВЕННЫЙ код успеха/ошибки API внутри тела JSON — это ДВЕ РАЗНЫЕ вещи. API automationexercise.com всегда отвечает HTTP 200, даже на запрос, который сам считает неверным — настоящая ошибка (вроде «неверный метод») отображается в поле <code>responseCode</code> внутри JSON, а не в HTTP-статусе. Тест, который проверяет только <code>status_code == 200</code>, здесь ошибочно назвал бы сломанные запросы «нормальными».',
      'После разбора ответ API — это просто Python-данные, с которыми вы уже умеете работать — список словарей (модуль 5), возможно вложенный. Циклы, подсчёт, фильтрация — ничего из этого не меняется только потому, что данные пришли по сети, а не были набраны руками.'
    ],
    tasks: {
      'm12-t1': {
        title: 'Ваш первый настоящий вызов API',
        goal: 'Выполните <code>pip install requests</code>, затем <code>r = requests.get("https://automationexercise.com/api/productsList", timeout=10)</code> и напечатайте <code>r.status_code</code>. Убедитесь, что видите <b>200</b>.',
        hint: 'Это настоящий сетевой вызов к настоящему, живому сайту — если он падает, сначала проверьте интернет-соединение, прежде чем считать, что ваш код неверен.'
      },
      'm12-t2': {
        title: 'Разобрать тело JSON',
        goal: 'Используя тот же GET-запрос, вызовите <code>data = r.json()</code>, затем напечатайте <code>data["responseCode"]</code>. Убедитесь, что здесь тоже видите <b>200</b>.',
        hint: '<code>r.json()</code> даёт обычный Python-словарь — <code>data["responseCode"]</code> это просто обращение по квадратным скобкам, точно как с любым словарём, которым вы пользовались с модуля 5.'
      },
      'm12-t3': {
        title: 'HTTP-статус против кода ответа API',
        goal: 'Выполните GET (не POST) к <code>https://automationexercise.com/api/searchProduct</code> — этот endpoint на самом деле ожидает POST. Напечатайте И <code>r.status_code</code>, И <code>r.json()["responseCode"]</code>. Убедитесь, что HTTP-статус всё ещё <b>200</b>, а собственный <code>responseCode</code> у API — <b>405</b> (неверный метод) — два разных числа рассказывают две разные истории об одном и том же ответе.',
        hint: 'Если бы ваш тест проверял здесь только <code>status_code == 200</code>, он бы сказал, что этот сломанный запрос «прошёл» — это ровно та ловушка, что описана в теории выше, теперь произошедшая по-настоящему.'
      },
      'm12-t4': {
        title: 'Искать товары через POST',
        goal: 'Отправьте POST на <code>https://automationexercise.com/api/searchProduct</code> с <code>data={"search_product": "dress"}</code>. Разберите JSON, напечатайте <code>data["responseCode"]</code> и <code>len(data["products"])</code>. Убедитесь, что <code>responseCode</code> равен <b>200</b>, а количество совпадающих товаров положительное.',
        hint: 'Само число может не всегда быть одним и тем же — каталог живого сайта это настоящие данные, а не зафиксированная во времени заготовка. Важно, чтобы оно было разумным положительным числом, а не нулём или ошибкой.'
      },
      'm12-t5': {
        title: 'Посчитать товары по бренду',
        goal: 'Выполните GET <code>productsList</code>, пройдитесь циклом по <code>data["products"]</code> и посчитайте, сколько из них имеют <code>product["brand"] == "Polo"</code>. Напечатайте количество.',
        hint: 'Тот же паттерн подсчёта, что и в каждом модуле начиная с М3 — счётчик с 0, цикл, <code>if</code>, увеличивающий его при совпадении. Меняется только источник данных.'
      },
      'm12-t6': {
        title: 'Напечатать первые пять названий товаров',
        goal: 'Выполните GET <code>productsList</code>, затем пройдитесь циклом по <code>data["products"][:5]</code> (настоящий срез Python — первые пять элементов) и напечатайте <code>product["name"]</code> для каждого, по одному на строку.',
        hint: '<code>[:5]</code> это срез без начала (по умолчанию с начала) и остановкой на индексе 5 — только настоящий Python, точно как срезы, впервые показанные в модуле 6.'
      },
      'm12-t7': {
        title: 'Настоящий API-тест на pytest',
        goal: 'Напишите pytest-тест <code>test_products_list_ok()</code>, который делает GET <code>productsList</code> и проверяет ОБА условия: <code>r.status_code == 200</code> И <code>r.json()["responseCode"] == 200</code> — намеренно проверяя ловушку из задачи 3. Запустите <code>pytest -v</code>. Убедитесь, что видите <b>1 passed</b>.',
        hint: 'Здесь модуль 9 (pytest) соединяется с этим модулем — API-тест это всё та же функция, начинающаяся с <code>test_</code>, полная <code>assert</code>ов, запускаемая точно так же.'
      },
      'm12-t8': {
        title: 'Поймать настоящий Timeout',
        goal: 'Вызовите <code>requests.get("https://automationexercise.com/api/productsList", timeout=0.001)</code> — тайм-аут заведомо слишком короткий для успеха — внутри <code>try</code>/<code>except requests.exceptions.Timeout:</code>, печатающего <b>Timed out</b>. Запустите несколько раз — убедитесь, что стабильно видите это сообщение, а не падение.',
        hint: '<code>requests.exceptions.Timeout</code> это собственный тип исключения <code>requests</code>, но ловится он тем же самым синтаксисом <code>try</code>/<code>except</code> из модуля 10 — в обработке исключений ничего не меняется от того, что рискованная операция это сетевой вызов.'
      },
      'm12-t9': {
        title: 'Проверить попытку входа',
        goal: 'Отправьте POST на <code>https://automationexercise.com/api/verifyLogin</code> с <code>data={"email": "nonexistent_test_email_xyz@example.com", "password": "wrongpass"}</code>. Напечатайте <code>r.json()["responseCode"]</code> и <code>r.json()["message"]</code>. Убедитесь, что код ответа <b>404</b> с сообщением «User not found!» — настоящий API верно сообщает вам, что этот вход должен провалиться.',
        hint: 'Это безопасная, только для чтения проверка против несуществующего аккаунта — она ничего не создаёт и не меняет на настоящем сайте.'
      },
      'm12-t10': {
        title: 'Переиспользуемая функция подсчёта по бренду',
        goal: 'Напишите функцию <code>count_products_by_brand(brand_name)</code>, которая делает GET <code>productsList</code>, проходит циклом по товарам, считает, сколько из них имеют этот точный бренд, и ВОЗВРАЩАЕТ количество (не печатает внутри функции). Вызовите её для <code>"Polo"</code> и напечатайте результат, сверив с тем, что нашли вручную в задаче 5.',
        hint: 'Это ровно та же логика, что в задаче 5, просто обёрнутая в функцию, чтобы её можно было переиспользовать для любого бренда — тот вид маленького переиспользуемого хелпера, что настоящий набор тестов накапливает со временем, вместо повторения инлайн повсюду.'
      },
      'm12-hw1': {
        title: 'Замокать сеть для быстрого офлайн-теста',
        goal: 'Напишите <code>get_product_count()</code>, которая делает GET <code>productsList</code> и возвращает <code>len(data["products"])</code>. В pytest-тесте используйте <code>with patch("requests.get", return_value=fake_response):</code>, где <code>fake_response</code> это <code>Mock()</code> с заданным <code>fake_response.json.return_value</code> — маленьким поддельным списком товаров, затем проверьте, что количество совпадает. Запустите pytest — убедитесь, что тест проходит, НЕ трогая настоящую сеть.',
        hint: 'Это <code>patch</code> из модуля 11, применённый ровно к той функции, которую этот модуль по-настоящему вызывал всё это время — реальный выбор, который настоящий проект делает постоянно: бить по настоящему API в нескольких end-to-end тестах, но мокать его в множестве быстрых юнит-тестов, проверяющих вашу собственную логику.'
      },
      'm12-hw2': {
        title: 'Отсутствующее обязательное поле',
        goal: 'Отправьте POST на <code>verifyLogin</code> ТОЛЬКО с <code>data={"email": "test@example.com"}</code> (без пароля). Напечатайте <code>r.json()["responseCode"]</code> и <code>r.json()["message"]</code>. Убедитесь, что получаете <b>400</b> с сообщением об отсутствующем параметре.',
        hint: 'Настоящий API валидирует собственные входные данные и ясно сообщает, чего не хватает — стоит проверить намеренно, потому что «что происходит при отсутствии обязательного поля» это ровно тот случай, что упускает тонкий набор тестов, проверяющий только happy path.'
      },
      'm12-hw3': {
        title: 'Изучить настоящие заголовки ответа (и поймать реальное несоответствие)',
        goal: 'Выполните GET <code>productsList</code>, затем напечатайте <code>r.headers["Content-Type"]</code>. На этом настоящем API он возвращается как <code>text/html; charset=utf-8</code> — НИЧЕГО про json — хотя <code>r.json()</code> разбирает тело без единой ошибки. Напечатайте <code>r.headers["Content-Type"]</code> и <code>type(r.json())</code> рядом и убедитесь, что видите несоответствие своими глазами: заголовок заявляет HTML, а тело на самом деле валидный JSON.',
        hint: '<code>r.headers</code> ведёт себя как словарь метаданных О ответе, отдельно от <code>r.json()</code>, который является настоящим содержимым тела — и именно поэтому нельзя всегда доверять одному в описании другого. Настоящий API, врущий о собственном <code>Content-Type</code>, — не редкость; это тот же урок, что gotcha из задачи 3 про HTTP-статус vs responseCode, только на один заголовок ниже: никогда не считайте, что метаданные совпадают с телом, — проверяйте напрямую то, что вам действительно важно.'
      }
    }
  },
  m13: {
    title: 'Базы данных',
    desc: 'проверка данных в БД прямо из тестов',
    theory: [
      'UI или API, говорящий «заказ оформлен», не доказательство, что это действительно произошло — проверка базы данных напрямую подтверждает настоящее состояние, независимо от того, что заявляет интерфейс. <code>sqlite3</code> входит в стандартную библиотеку (установка не нужна), хранит всё в одном файле — или, для тестов, целиком в памяти через <code>sqlite3.connect(":memory:")</code>, которая исчезает в момент завершения скрипта. Ни сервера, ни очистки — идеально для быстрых проверок.',
      '<code>cursor</code> это то, что на самом деле выполняет SQL: <code>cursor.execute("CREATE TABLE tests (name TEXT, status TEXT)")</code>, затем <code>cursor.execute("INSERT INTO tests VALUES (\'test_login\', \'pass\')")</code>, затем <code>conn.commit()</code> — ничего на самом деле не сохраняется, пока вы не сделаете commit. <code>cursor.fetchone()</code> возвращает одну строку как обычный кортеж; <code>cursor.fetchall()</code> возвращает все подходящие строки как список кортежей.',
      'НИКОГДА не собирайте SQL склейкой строк со значением, пришедшим извне вашего собственного кода — <code>"...WHERE name = \'" + user_input + "\'"</code> позволяет этому значению изменить то, что запрос на самом деле делает (SQL-инъекция: настоящий, серьёзный класс уязвимостей, а не теоретический). Используйте плейсхолдер <code>?</code> и передавайте значение отдельно: <code>cursor.execute("SELECT * FROM tests WHERE name = ?", (name,))</code> — база данных безопасно обрабатывает это независимо от содержимого значения.',
      '<code>WHERE</code> фильтрует, какие строки затрагивает запрос — <code>SELECT * FROM tests WHERE status = \'fail\'</code> возвращает только проваленные. Ровно то же самое условие работает с <code>UPDATE</code> и <code>DELETE</code>: <code>UPDATE tests SET status = ? WHERE name = ?</code> меняет только подходящую строку, всё остальное остаётся нетронутым.',
      'Строка возвращается как КОРТЕЖ, а не словарь — <code>row[0]</code>, <code>row[1]</code> обращаются к столбцам по позиции, в порядке, в котором они были выбраны, а не по имени. Это отличается от словарей, которыми вы пользовались повсюду начиная с модуля 5 — не путайте эти два понятия.'
    ],
    tasks: {
      'm13-t1': {
        title: 'Создать, вставить, выбрать',
        goal: 'Подключитесь через <code>conn = sqlite3.connect(":memory:")</code>, получите <code>cursor = conn.cursor()</code>, выполните <code>CREATE TABLE tests (name TEXT, status TEXT)</code>, вставьте одну строку <code>(\'test_login\', \'pass\')</code>, сделайте commit, затем <code>SELECT * FROM tests</code> и напечатайте <code>cursor.fetchone()</code>. Убедитесь, что видите <b>(\'test_login\', \'pass\')</b>.',
        hint: 'Четыре шага по порядку: создать таблицу, вставить строку, <code>conn.commit()</code>, затем выбрать — пропуск commit всё ещё позволит прочитать это позже в ТОМ ЖЕ соединении, но хорошая привычка — коммитить сразу после записи.'
      },
      'm13-t2': {
        title: 'Посчитать все строки',
        goal: 'Создайте ту же таблицу, вставьте ТРИ строки (любые имена/статусы), сделайте commit, затем выполните <code>SELECT COUNT(*) FROM tests</code> и напечатайте <code>cursor.fetchone()[0]</code>. Убедитесь, что видите <b>3</b>.',
        hint: '<code>COUNT(*)</code> возвращает одну строку с одним столбцом — самим количеством, так что <code>fetchone()</code> даёт кортеж из одного элемента, а <code>[0]</code> достаёт из него число.'
      },
      'm13-t3': {
        title: 'Предскажите: fetchall возвращает список кортежей',
        goal: 'Прочитайте код и предскажите точный двухстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>fetchall()</code> даёт каждую подходящую строку в виде списка — <code>len(rows)</code> считает их, а <code>rows[0]</code> это первая строка, сама по себе кортеж, как в предыдущей задаче.'
      },
      'm13-t4': {
        title: 'Фильтровать через WHERE',
        goal: 'Вставьте три теста, два из них со <code>status = \'fail\'</code>. Выполните <code>SELECT name FROM tests WHERE status = \'fail\'</code> и пройдитесь циклом по <code>cursor.fetchall()</code>, печатая <code>row[0]</code> для каждой. Убедитесь, что видите ровно два проваленных имени теста, ничего больше.',
        hint: 'Выбор только <code>name</code> (не <code>*</code>) означает, что каждая строка — кортеж из одного элемента — <code>row[0]</code> это имя, здесь просто нет <code>row[1]</code>, который можно было бы случайно использовать.'
      },
      'm13-t5': {
        title: 'Безопасный параметризованный запрос',
        goal: 'Вставьте одну строку через <code>cursor.execute("INSERT INTO tests VALUES (?, ?)", (name, status))</code> с переменными, а не собранной вручную строкой. Затем выберите её обратно через <code>cursor.execute("SELECT * FROM tests WHERE name = ?", (name,))</code> и напечатайте результат. Убедитесь, что он совпадает с тем, что вы вставили.',
        hint: 'Второй аргумент <code>execute(...)</code> всегда КОРТЕЖ, даже с одним значением — <code>(name,)</code> нужна эта завершающая запятая, иначе Python прочитает это как скобки вокруг одного значения, а не кортеж.'
      },
      'm13-t6': {
        title: 'Предскажите: строка это кортеж, а не словарь',
        goal: 'Прочитайте код и предскажите точный двухстрочный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>row[0]</code> это то, что было выбрано первым (<code>name</code>), <code>row[1]</code> — то, что вторым (<code>status</code>) — по позиции, а не по имени ключа, как было бы у словаря.'
      },
      'm13-t7': {
        title: 'Обновить строку и проверить это',
        goal: 'Вставьте <code>(\'test_login\', \'fail\')</code>. Выполните <code>UPDATE tests SET status = ? WHERE name = ?</code> с <code>("pass", "test_login")</code>, сделайте commit, затем выберите статус обратно для <code>\'test_login\'</code> и напечатайте его. Убедитесь, что видите <b>pass</b> — изменение действительно произошло.',
        hint: 'Никогда не доверяйте, что <code>UPDATE</code> сработал, только потому что он не упал — выбрать строку заново после этого — единственное настоящее доказательство, точно как проверка UI после нажатия кнопки.'
      },
      'm13-t8': {
        title: 'Удалить и проверить, что количество уменьшилось',
        goal: 'Вставьте две строки, одну <code>\'pass\'</code> и одну <code>\'fail\'</code>. Выполните <code>DELETE FROM tests WHERE status = \'fail\'</code>, сделайте commit, затем <code>SELECT COUNT(*) FROM tests</code> и напечатайте количество. Убедитесь, что видите <b>1</b>.',
        hint: '<code>DELETE FROM tests WHERE ...</code> удаляет только подходящие строки — полное отсутствие <code>WHERE</code> удалило бы вообще всё, так что всегда перепроверяйте его наличие перед настоящим удалением.'
      },
      'm13-t9': {
        title: 'Вставить список результатов в цикле',
        goal: 'При <code>results = [{"name": "test_login", "status": "pass"}, {"name": "test_logout", "status": "fail"}, {"name": "test_search", "status": "pass"}]</code> пройдитесь по нему циклом и вставьте каждый параметризованным <code>INSERT</code>. Сделайте commit, затем напечатайте <code>SELECT COUNT(*)</code>. Убедитесь, что видите <b>3</b>.',
        hint: 'Это ровно та же форма списка словарей из модуля 5 и JSON-ответов из модуля 12 — изменился только пункт назначения: с напечатанного отчёта на строки в настоящей таблице.'
      },
      'm13-t10': {
        title: 'Переиспользуемая функция подсчёта пройденных',
        goal: 'Напишите <code>count_passed_tests(conn)</code>, которая принимает открытое соединение, выполняет на нём <code>SELECT COUNT(*) FROM tests WHERE status = \'pass\'</code> и возвращает количество. Настройте таблицу со смесью пройденных/проваленных строк, затем вызовите функцию и напечатайте результат.',
        hint: 'Функция принимает СОЕДИНЕНИЕ как параметр и создаёт свой собственный курсор из него — так настоящий набор тестов делит одно соединение с базой между множеством маленьких вспомогательных функций, вместо переподключения каждый раз.'
      },
      'm13-hw1': {
        title: 'Увидеть настоящую SQL-инъекцию',
        goal: 'Создайте таблицу <code>users</code> с одной строкой, <code>(\'admin\', \'secret123\')</code>. Задайте <code>malicious_input = "\' OR \'1\'=\'1"</code>. Соберите НЕБЕЗОПАСНЫЙ запрос склейкой строк: <code>"SELECT * FROM users WHERE username = \'" + malicious_input + "\'"</code>, выполните его и напечатайте результат — убедитесь, что он ОШИБОЧНО возвращает строку admin, хотя это имя пользователя никогда по-настоящему не совпадало. Затем выполните ТОТ ЖЕ поиск безопасно, с плейсхолдером <code>?</code>, и убедитесь, что он верно ничего не возвращает.',
        hint: 'Вредоносная строка превращает условие WHERE в нечто всегда истинное, независимо от имени пользователя — это и есть настоящий механизм за реальными атаками SQL-инъекции, а не просто предупреждающая наклейка.'
      },
      'm13-hw2': {
        title: 'Предскажите: rowcount после UPDATE',
        goal: 'Прочитайте код и предскажите точный вывод, затем проверьте себя в настоящем Python.',
        hint: '<code>cursor.rowcount</code> сообщает, сколько строк реально затронул ПОСЛЕДНИЙ выполненный оператор — здесь под <code>status = \'fail\'</code> подошли две строки, третья, уже бывшая <code>\'pass\'</code>, осталась нетронутой.'
      },
      'm13-hw3': {
        title: '«with conn» не закрывает соединение',
        goal: 'Выполните <code>with conn:</code> вокруг одной вставки, позволив ей автоматически закоммититься. ПОСЛЕ завершения этого блока попробуйте выполнить ещё один запрос на ТОМ ЖЕ <code>conn</code> — убедитесь, что он всё ещё работает. <code>with conn:</code> управляет commit/rollback для блока, не более того; само соединение остаётся открытым, пока вы явно не вызовете <code>conn.close()</code>.',
        hint: 'Это постоянно всех сбивает с толку — <code>with</code> на соединении с базой данных в Python НЕ означает «закрыть по завершении», в отличие от файла, открытого через <code>with open(...)</code>. Две разные библиотеки, два разных значения одного и того же ключевого слова.'
      }
    }
  },
  m14: {
    title: 'Локаторы и Selenium',
    desc: 'поиск элементов и автоматизация браузера',
    theory: [
      'Selenium управляет НАСТОЯЩИМ браузером — в отличие от вызовов <code>requests</code> из модуля 12 (говорящих напрямую с сервером) или любого предыдущего модуля, это реально открывает Chrome и кликает/печатает точно как человек. <code>pip install selenium</code>, затем <code>from selenium import webdriver; driver = webdriver.Chrome()</code>, затем <code>driver.get("https://automationexercise.com")</code> открывает настоящую страницу. Каждая задача ниже выполняется на этом настоящем, живом сайте.',
      'Локатор находит элемент: <code>driver.find_element(By.ID, "search_product")</code> — сначала нужен <code>from selenium.webdriver.common.by import By</code>. <code>find_element</code> (единственное число) возвращает РОВНО ОДНО совпадение и поднимает <code>NoSuchElementException</code>, если такого нет; <code>find_elements</code> (множественное число) всегда возвращает СПИСОК, пустой (<code>[]</code>), если ничего не совпало — он никогда не падает, что делает его более безопасным выбором для проверок «существует ли это вообще».',
      'Чтение против действия — то же разделение, что и везде в этом курсе: <code>.text</code> читает видимый текст, <code>.get_attribute("value")</code> читает атрибут (например, что сейчас введено в поле); <code>.click()</code> и <code>.send_keys("...")</code> реально воздействуют на элемент, точно как настоящий клик или настоящий ввод.',
      'САМЫЙ важный урок в автоматизации браузера: странице нужно ВРЕМЯ, чтобы загрузиться и отреагировать. Вызов <code>find_element</code> сразу после <code>.get(...)</code> или <code>.click()</code> может провалиться просто потому, что элемент ещё не отрендерился — а не потому, что локатор неверен. <code>WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "...")))</code> проверяет повторно до 10 секунд вместо угадывания фиксированной паузы, для этого нужны <code>from selenium.webdriver.support.ui import WebDriverWait</code> и <code>from selenium.webdriver.support import expected_conditions as EC</code>.',
      'Всегда вызывайте <code>driver.quit()</code> по завершении скрипта — оставшийся процесс браузера тратит ресурсы и быстро накапливается в настоящем наборе тестов, запускаемом много раз в CI.',
      'Настоящее, очень частое препятствие именно на этом сайте: оверлей согласия на использование данных («This site asks for consent to use your data») лежит поверх страницы при первом заходе и физически перехватывает клики/ввод, предназначенные тому, что под ним — включая форму входа, которая встретится дальше в этом модуле. Решение — не мистическая обходная манипуляция, а закрытие оверлея первым делом, точно как это сделал бы настоящий пользователь: <code>driver.find_element(By.CSS_SELECTOR, ".fc-cta-consent").click()</code> сразу после <code>driver.get(...)</code>, до взаимодействия с чем-либо ещё на странице. (Модуль 15 сталкивается ровно с тем же оверлеем на том же сайте — то же решение, другая библиотека.)',
      'Это тот самый момент, когда превью <code>Page Object</code> из модуля 7 перестаёт быть превью: класс на страницу, <code>__init__</code>, сохраняющий <code>driver</code>, методы, оборачивающие сырые вызовы <code>find_element</code>/<code>click</code>/<code>send_keys</code> для этой одной страницы — так что тест читается как <code>login_page.login(email, password)</code>, а не пять сырых строк Selenium, повторяемых в каждом тесте, которому нужен вход.'
    ],
    tasks: {
      'm14-t1': {
        title: 'Открыть настоящую страницу',
        goal: 'Выполните <code>pip install selenium</code>, затем <code>driver = webdriver.Chrome()</code>, затем <code>driver.get("https://automationexercise.com")</code>, затем напечатайте <code>driver.title</code>. Убедитесь, что видите <b>Automation Exercise</b>, и что реально открылось окно Chrome.',
        hint: 'Если Chrome вообще не открывается, Selenium (4.6+) автоматически скачивает подходящий chromedriver при первом запуске — сначала убедитесь, что на вашей машине реально установлен браузер Chrome.'
      },
      'm14-t2': {
        title: 'Найти один элемент',
        goal: 'На главной странице найдите логотип сайта через <code>driver.find_element(By.CSS_SELECTOR, ".logo")</code> и напечатайте его <code>.tag_name</code>. Убедитесь, что это выполняется без <code>NoSuchElementException</code>.',
        hint: 'CSS-селектор, начинающийся с точки (<code>.logo</code>), совпадает по имени КЛАССА — та же идея, что и CSS-класс на любой веб-странице, только здесь использованная для поиска элемента, а не для стилизации.'
      },
      'm14-t3': {
        title: 'Безопасно найти много элементов',
        goal: 'Используйте <code>driver.find_elements(By.CSS_SELECTOR, ".nav.navbar-nav li a")</code> (множественное число), чтобы получить все ссылки верхней навигации, и напечатайте <code>len(...)</code>. Затем попробуйте ТОТ ЖЕ селектор, но для того, чего не существует, например <code>driver.find_elements(By.ID, "nothing_here_12345")</code>, и напечатайте результат напрямую — убедитесь, что это пустой список <code>[]</code>, а не падение.',
        hint: 'Именно поэтому <code>find_elements</code> существует наряду с <code>find_element</code> — проверка «сколько их, возможно ноль» никогда не должна нуждаться в <code>try</code>/<code>except</code> вокруг себя.'
      },
      'm14-t4': {
        title: 'Прочитать атрибуты поля формы',
        goal: 'Перейдите на <code>https://automationexercise.com/login</code>. СНАЧАЛА закройте оверлей согласия на cookies, который этот сайт показывает при первом заходе — <code>driver.find_element(By.CSS_SELECTOR, ".fc-cta-consent").click()</code> — иначе он лежит поверх страницы, и следующие шаги этого модуля провалятся с ошибкой «элемент недоступен для взаимодействия», не имеющей отношения к вашему локатору. Затем найдите поле email через <code>driver.find_element(By.CSS_SELECTOR, \'input[data-qa="login-email"]\')</code> и напечатайте <code>.get_attribute("name")</code>. Убедитесь, что видите <b>email</b>.',
        hint: 'Атрибуты <code>data-qa="..."</code> существуют на этом сайте специально, чтобы дать автоматизации стабильный способ найти элементы, независимо от визуальных классов стилей, которые могут измениться — реальный паттерн, стоящий узнавания при встрече на других сайтах. Если сам клик по кнопке согласия падает, потому что она ещё не появилась — оберните его в <code>WebDriverWait(driver, 5).until(EC.element_to_be_clickable(...))</code>, точно как это делает задача 7.'
      },
      'm14-t5': {
        title: 'Ввести в поле и прочитать обратно',
        goal: 'На странице входа (с уже закрытым в задаче 4 баннером cookies) найдите поле email и вызовите на нём <code>.send_keys("test@example.com")</code>. Затем напечатайте <code>.get_attribute("value")</code> на ТОМ ЖЕ элементе. Убедитесь, что показывается ровно то, что вы ввели.',
        hint: '<code>send_keys</code> по умолчанию не перезаписывает — она печатает поверх того, что уже там есть. На пустом поле вроде этого это не важно, но стоит помнить об этом для поля, в котором уже может быть текст. Если это падает с «элемент недоступен для взаимодействия» и в этом запуске скрипта вы ещё не закрыли баннер cookies — почти всегда причина именно в нём, см. задачу 4.'
      },
      'm14-t6': {
        title: 'Прочитать настоящий NoSuchElementException',
        goal: 'Выполните <code>driver.find_element(By.ID, "this_does_not_exist_12345")</code> на любой странице — это намеренно падает. Прочитайте traceback и убедитесь, что можете найти использованный локатор (<code>this_does_not_exist_12345</code>), повторённый прямо внутри сообщения об ошибке.',
        hint: 'Чтение того, какой именно локатор провалился, прямо в сообщении — это то, что говорит вам, опечатка ли это, не та страница, или реально отсутствующий элемент — та же дисциплинированная привычка чтения, что и у каждого traceback начиная с модуля 6.'
      },
      'm14-t7': {
        title: 'Ждать элемент вместо угадывания',
        goal: 'Перейдите на главную страницу, затем используйте <code>WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".logo")))</code> вместо прямого вызова <code>find_element</code>. Напечатайте <code>.tag_name</code> найденного элемента. Убедитесь, что это работает так же, как в задаче 2, только через явное ожидание.',
        hint: 'На такой быстрой странице, как эта, разница незаметна — но на более медленной настоящей странице <code>WebDriverWait</code> даёт странице реальное время закончить рендеринг, тогда как голый <code>find_element</code>, вызванный слишком рано, просто провалился бы.'
      },
      'm14-t8': {
        title: 'Кликнуть ссылку и подтвердить переход',
        goal: 'На главной странице сначала закройте оверлей согласия на cookies (см. задачу 4) — ссылка «Cart» находится прямо за ним при свежей загрузке страницы, и клик по ней может быть перехвачен оверлеем, даже если <code>EC.element_to_be_clickable</code> считает саму ссылку готовой. Затем дождитесь, что ссылка «Cart» кликабельна, через <code>WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, "Cart")))</code>, кликните её, затем напечатайте <code>driver.current_url</code>. Убедитесь, что URL теперь содержит <b>view_cart</b>.',
        hint: '<code>EC.element_to_be_clickable</code> проверяет, что элемент существует и включён — но НЕ знает про отдельный оверлей, плавающий поверх него. Именно поэтому «ожидание говорит, что кликабельно, а клик всё равно падает» — один из самых частых реальных сюрпризов Selenium, и почти всегда причина — оверлей вроде этого.'
      },
      'm14-t9': {
        title: 'Всегда завершать работу, даже при падении',
        goal: 'Оберните небольшой скрипт (открыть сайт, найти один элемент) в <code>try</code>/<code>finally</code>, с <code>driver.quit()</code> в блоке <code>finally</code>. Намеренно сделайте так, чтобы средний шаг провалился (ищите локатор, которого не существует) — убедитесь, что браузер всё равно корректно закрывается, вместо того чтобы остаться открытым.',
        hint: 'Это <code>finally</code> из модуля 10, применённый к тому единственному шагу очистки, что важнее всего в автоматизации браузера — упавший тест никогда не должен оставлять за собой работающий процесс браузера.'
      },
      'm14-t10': {
        title: 'Настоящий Page Object',
        goal: 'Напишите <code>class LoginPage:</code> с <code>__init__(self, driver)</code>, сохраняющим driver, методом <code>open(self)</code>, переходящим на URL входа И закрывающим прямо там же оверлей согласия на cookies из задачи 4 (чтобы каждый тест, использующий этот page object, получал это бесплатно, вместо того чтобы каждому тесту отдельно об этом помнить), и методом <code>enter_email(self, email)</code>, находящим поле email и отправляющим в него данный текст. Создайте экземпляр, вызовите <code>.open()</code>, затем <code>.enter_email("alex@example.com")</code>, затем прочитайте значение поля напрямую через <code>page.driver.find_element(...)</code>, чтобы подтвердить, что сработало.',
        hint: 'Это синтаксис классов из модуля 7, оборачивающий вызовы Selenium из модуля 14 — ровно та форма, что принимает настоящий Page Object: класс знает, КАК взаимодействовать с одной страницей, тест просто вызывает его методы по имени. Вшить закрытие баннера cookies прямо в <code>open()</code> — тоже настоящий, частый паттерн Page Object: особенности всей страницы живут в page object, а не повторяются в каждом использующем её тесте.'
      },
      'm14-hw1': {
        title: 'Сравнить неявное и явное ожидание',
        goal: 'Добавьте <code>driver.implicitly_wait(10)</code> сразу после создания драйвера — это заставляет КАЖДЫЙ вызов <code>find_element</code> автоматически повторять попытки до 10 секунд перед отказом, без необходимости в <code>WebDriverWait</code>. Попробуйте обычный вызов <code>find_element</code> после этого и убедитесь, что он всё ещё работает. Не смешивайте неявные и явные ожидания в одном настоящем проекте — выберите один стиль и придерживайтесь его.',
        hint: 'Неявное ожидание проще настроить один раз; явный <code>WebDriverWait</code> более точен насчёт ТОГО, какое именно условие вы на самом деле ждёте (присутствие против видимости против кликабельности) — большинство настоящих проектов выбирают явные ожидания ради этой точности.'
      },
      'm14-hw2': {
        title: 'Скриншот при падении',
        goal: 'Оберните скрипт в <code>try</code>/<code>except Exception:</code>, и внутри блока <code>except</code> вызовите <code>driver.save_screenshot("failure.png")</code> перед повторным поднятием или печатью ошибки. Намеренно вызовите падение (неверный локатор) и убедитесь, что реальный файл <code>failure.png</code> появляется в вашей папке.',
        hint: 'Это один из самых частых реальных паттернов в наборах браузерных тестов — скриншот, сделанный в точный момент падения, часто оказывается самой полезной единицей отладочной информации в логе CI.'
      },
      'm14-hw3': {
        title: 'Расширить Page Object',
        goal: 'Добавьте метод <code>enter_password(self, password)</code> в ваш класс <code>LoginPage</code> из задачи 10, следуя тому же паттерну, что и <code>enter_email</code>. Вызовите оба метода на одном экземпляре, затем прочитайте оба значения полей обратно, чтобы подтвердить.',
        hint: 'Настоящий Page Object растёт ровно так со временем — один маленький, сфокусированный метод на взаимодействие, добавляемый по мере написания тестов, которым он нужен, а не спланированный идеально заранее.'
      }
    }
  },
  m15: {
    title: 'Playwright',
    desc: 'современная автоматизация браузера',
    theory: [
      'Playwright — более новая альтернатива Selenium: та же основная идея (управлять настоящим браузером), другой API, построенный позже специально с прицелом на автоматизацию. <code>pip install playwright</code>, затем <code>python -m playwright install chromium</code> напрямую скачивает настоящий бинарник браузера — никакого отдельного исполняемого файла драйвера, версии которого нужно подбирать, в отличие от chromedriver у Selenium.',
      'Каждое действие начинается внутри <code>with sync_playwright() as p:</code>, затем <code>browser = p.chromium.launch()</code>, <code>page = browser.new_page()</code>, <code>page.goto(url)</code>. <code>page.locator(selector)</code> представляет элемент (или набор из них) — <code>.click()</code>, <code>.fill("text")</code>, <code>.count()</code>, <code>.inner_text()</code>.',
      'Самое большое практическое отличие от Selenium: действия Playwright АВТОМАТИЧЕСКИ ЖДУТ — <code>.click()</code> и <code>.fill()</code> уже сами ждут, пока элемент реально станет готов (виден, не перекрыт, не отключён), прежде чем действовать, так что ручной <code>WebDriverWait</code> из модуля 14 редко нужен для обычных действий.',
      '<code>expect(locator).to_have_text("...")</code> (нужен <code>from playwright.sync_api import expect</code>) это собственная проверка Playwright, построенная специально для веб-страниц — она продолжает перепроверять несколько секунд, если текста ещё нет, вместо мгновенного падения, как это сделал бы обычный Python <code>assert</code> на странице, которая просто ещё не успела обновиться.',
      'Настоящее, крайне частое препятствие: баннеры согласия на куки и похожие оверлеи, лежащие поверх страницы и физически перехватывающие клики, предназначенные для чего-то под ними. Решение не какой-то загадочный обходной путь — это сначала закрыть оверлей, точно как это сделал бы настоящий пользователь, прежде чем продолжать сам тест.',
      'Стоит знать одну тонкость: <code>.inner_text()</code> возвращает текст так, как он визуально ОТОБРАЖАЕТСЯ (включая CSS-эффекты вроде стиля «капслок»), тогда как <code>expect(...).to_have_text(...)</code> сравнивает с настоящим текстом, записанным в HTML страницы — один и тот же заголовок может выглядеть по-разному между этими двумя.'
    ],
    tasks: {
      'm15-t1': {
        title: 'Запустить и открыть настоящую страницу',
        goal: 'Выполните <code>pip install playwright</code>, затем <code>python -m playwright install chromium</code> (скачивает браузер один раз). Внутри <code>with sync_playwright() as p:</code> запустите chromium, откройте новую страницу, <code>goto("https://automationexercise.com")</code>, и напечатайте <code>page.title()</code>. Убедитесь, что видите <b>Automation Exercise</b>.',
        hint: 'Разовый шаг <code>playwright install chromium</code> скачивает собственный встроенный браузер Playwright — он отдельный от любого Chrome, который у вас уже может быть установлен для модуля 14.'
      },
      'm15-t2': {
        title: 'Закрыть настоящий баннер куки',
        goal: 'После открытия главной страницы используйте <code>page.locator(".fc-cta-consent")</code> и напечатайте его <code>.count()</code> — убедитесь, что это <b>1</b>. Затем вызовите на нём <code>.click()</code>, чтобы закрыть настоящий оверлей согласия на куки, который этот сайт показывает при каждом новом визите.',
        hint: 'Этот оверлей — ровно то, что описано в теории выше — сделайте это ДО попытки кликнуть что-либо ещё на странице, иначе клик провалится из-за оверлея на пути.'
      },
      'm15-t3': {
        title: 'Кликнуть ссылку и подтвердить переход',
        goal: 'После закрытия баннера куки кликните ссылку Products через <code>page.click(\'a[href="/products"]\')</code>, затем напечатайте <code>page.url</code>. Убедитесь, что URL теперь заканчивается на <b>/products</b>.',
        hint: 'Обратите внимание — здесь нет явного ожидания: <code>page.click(...)</code> уже сам дождался, пока ссылка станет по-настоящему кликабельной, прежде чем действовать.'
      },
      'm15-t4': {
        title: 'Найти товар через поиск',
        goal: 'На странице товаров выполните <code>page.fill("#search_product", "Dress")</code>, затем <code>page.click("#submit_search")</code>, затем <code>page.wait_for_selector(".product-image-wrapper")</code>. Напечатайте <code>page.locator(".product-image-wrapper").count()</code>. Убедитесь, что получаете положительное число результатов.',
        hint: '<code>.fill(...)</code> сначала очищает поле, а затем печатает данный текст — в отличие от <code>send_keys</code> у Selenium, которая дописывает поверх того, что уже было.'
      },
      'm15-t5': {
        title: 'Прочитать отрендеренный текст заголовка',
        goal: 'После поиска напечатайте <code>page.locator("h2.title.text-center").inner_text()</code>. Убедитесь, что видите <b>SEARCHED PRODUCTS</b> — заглавными буквами, потому что именно так это визуально отображается.',
        hint: '<code>.inner_text()</code> отражает то, что реально УВИДИТ человек, включая заглавные буквы, даже если исходный HTML-текст написан в смешанном регистре.'
      },
      'm15-t6': {
        title: 'Проверять через expect(), а не inner_text()',
        goal: 'Используя <code>from playwright.sync_api import expect</code>, выполните <code>expect(page.locator("h2.title.text-center")).to_have_text("Searched Products")</code> — обратите внимание на СМЕШАННЫЙ регистр на этот раз, не заглавные буквы. Убедитесь, что это проходит без падения.',
        hint: '<code>to_have_text</code> сравнивает с настоящим исходным HTML-текстом ("Searched Products"), а не с заглавным визуальным отображением из предыдущей задачи — использование здесь заглавного варианта провалилось бы.'
      },
      'm15-t7': {
        title: 'Локатор, не совпадающий ни с чем',
        goal: 'Выполните <code>page.locator("#this_does_not_exist_999").count()</code> для селектора, который не совпадает вообще ни с чем. Убедитесь, что получаете <b>0</b>, без падения.',
        hint: 'Та же идея, что и <code>find_elements</code> у Selenium, возвращающий <code>[]</code> в модуле 14 — проверка «сколько, возможно ноль» никогда не должна нуждаться в <code>try</code>/<code>except</code> вокруг себя.'
      },
      'm15-t8': {
        title: 'Прочитать настоящую ошибку перехвата клика',
        goal: 'На СВЕЖЕЙ странице (баннер куки ещё показан, ещё не закрыт), сразу попробуйте <code>page.click(\'a[href="/products"]\', timeout=3000)</code> — это намеренно проваливается. Прочитайте ошибку и убедитесь, что можете найти в ней фразу <b>«intercepts pointer events»</b>, называющую оверлей, который на пути.',
        hint: 'Это настоящая ошибка за настоящей проблемой из задач 2 и 3 — увидев её падение намеренно здесь, вы мгновенно узнаете её, если она когда-нибудь случится случайно в настоящем тесте.'
      },
      'm15-t9': {
        title: 'Полный поток поиска с проверкой',
        goal: 'Начиная со свежей страницы: закройте баннер куки, перейдите на Products, найдите <b>«Top»</b>, и закончите через <code>expect(page.locator("h2.title.text-center")).to_have_text("Searched Products")</code>. Убедитесь, что весь поток проходит от начала до конца без падения.',
        hint: 'Это связывает воедино каждую часть этого модуля в том порядке, в каком это сделал бы настоящий тест — закрыть оверлей один раз, затем действовать на настоящей странице под ним.'
      },
      'm15-t10': {
        title: 'Page Object для Playwright',
        goal: 'Напишите <code>class ProductsPage:</code> с <code>__init__(self, page)</code>, сохраняющим page, методом <code>open(self)</code>, переходящим на URL товаров, и методом <code>search(self, term)</code>, выполняющим последовательность fill + click + wait_for_selector из задачи 4. Закройте баннер куки, создайте экземпляр <code>ProductsPage</code>, вызовите <code>.open()</code>, затем <code>.search("Dress")</code>, затем напечатайте количество результатов напрямую через <code>page.locator(...)</code>.',
        hint: 'Та же форма Page Object, что и в боссовой задаче модуля 14, только оборачивающая <code>page</code> Playwright вместо <code>driver</code> Selenium — ПАТТЕРН не меняется между инструментами, меняются только вызовы внутри каждого метода.'
      },
      'm15-hw1': {
        title: 'Смотреть, как работает браузер',
        goal: 'Запустите с <code>p.chromium.launch(headless=False)</code> вместо значения по умолчанию. Выполните код любой предыдущей задачи и убедитесь, что реально ВИДИТЕ, как открывается и действует окно браузера, вместо невидимой работы.',
        hint: '<code>headless=False</code> нужен исключительно для наблюдающего человека — настоящие CI-конвейеры запускаются headless (по умолчанию), потому что показывать окно там не на чем.'
      },
      'm15-hw2': {
        title: 'Скриншот для отладки',
        goal: 'После перехода на любую страницу вызовите <code>page.screenshot(path="failure.png")</code>. Убедитесь, что реальный файл <code>failure.png</code> появляется в вашей папке после этого.',
        hint: 'Та же практика, что домашнее задание модуля 14, только собственная версия Playwright — скриншот, сделанный ровно в момент, когда что-то идёт не так, часто самый быстрый способ понять падение CI без повторного запуска.'
      },
      'm15-hw3': {
        title: 'Всегда закрывать браузер',
        goal: 'Оберните небольшой скрипт в <code>try</code>/<code>finally</code>, с <code>browser.close()</code> в блоке <code>finally</code>. Намеренно сделайте так, чтобы средний шаг провалился (неверный селектор с коротким тайм-аутом), и убедитесь, что браузер всё равно корректно закрывается.',
        hint: 'Ровно та же дисциплина, что и <code>driver.quit()</code> в <code>finally</code> из модуля 14 — упавший скрипт никогда не должен оставлять за собой работающий процесс браузера, независимо от того, какой инструмент его открыл.'
      }
    }
  },
  m16: {
    title: 'Архитектура тест-фреймворка',
    desc: 'построение поддерживаемого автотест-проекта',
    theory: [
      'Каждый модуль до сих пор жил в одном файле. Это работает для горстки тестов, но настоящий проект накапливает десятки или сотни — плоская куча скриптов быстро становится неуправляемой. Фреймворк — это просто организующая ФОРМА: папка <code>pages/</code> для Page Object\'ов (модули 7, 14, 15), папка <code>tests/</code> для настоящих файлов <code>test_*.py</code>, и <code>conftest.py</code> для общей настройки — концептуально ничего нового, просто уже знакомые части, расставленные так, чтобы каждый файл теста оставался коротким.',
      '<code>conftest.py</code> — особое имя файла для pytest: фикстура, определённая там, автоматически доступна каждому тесту в этой папке (и подпапках) простым указанием её имени как параметра — <code>import</code> не нужен, в отличие от всего остального в Python. Именно так настоящий проект делит одну настройку браузера, один базовый URL API, одно соединение с базой между множеством файлов тестов, не повторяя код настройки в каждом.',
      'Фикстура, использующая <code>yield</code> вместо <code>return</code>, делится на две половины: всё ДО <code>yield</code> — это настройка, значение после yield — то, что получает тест, всё ПОСЛЕ <code>yield</code> — это очистка — и pytest гарантирует, что половина с очисткой выполнится после завершения теста, независимо от того, прошёл он или провалился. Это заменяет ручное открытие и закрытие браузера (модуль 14/15) или соединения с БД (модуль 13) в каждом отдельном тесте.',
      '<code>@pytest.fixture(scope="module")</code> (по умолчанию область — на каждый тест, называется «function») меняет то, КАК ЧАСТО выполняется настройка/очистка — <code>scope="module"</code> выполняет настройку ОДИН РАЗ для всех тестов в этом файле, а не для каждого теста отдельно, что сильно важно для чего-то настолько медленного, как запуск настоящего браузера.',
      '<code>requirements.txt</code> перечисляет каждый пакет, нужный проекту (<code>pytest</code>, <code>playwright</code>, <code>requests</code>, ...), так что <code>pip install -r requirements.txt</code> воспроизводит ровно ту же настройку на любой машине — именно так сам репозиторий AutoQuest передал бы свои зависимости кому-то ещё, кто его подхватит.',
      'Настоящий фреймворк смешивает разные ВИДЫ тестов бок о бок в одном запуске — быстрый юнит-тест с моком (модуль 11), настоящую проверку API (модуль 12), полный поток браузера через Page Object (модуль 14/15) — потому что каждый из них всё ещё просто функция <code>test_</code>, полная <code>assert</code>ов. Одна команда <code>pytest -v</code> запускает их все вместе, независимо от того, что каждый из них на самом деле делает внутри.'
    ],
    tasks: {
      'm16-t1': {
        title: 'Настроить структуру папок',
        goal: 'Создайте новую папку проекта с ТРЕМЯ вещами внутри: папкой <code>pages/</code>, папкой <code>tests/</code> и пустым файлом <code>conftest.py</code> на верхнем уровне (рядом с обеими папками, не внутри них). Убедитесь, что все три существуют.',
        hint: 'Ровно эта форма — <code>pages/</code>, <code>tests/</code>, <code>conftest.py</code> — это наименьшая настоящая версия того, как выглядит производственный тест-фреймворк; всё остальное в этом модуле заполняет эти три части.'
      },
      'm16-t2': {
        title: 'Page Object как отдельный файл',
        goal: 'Внутри <code>pages/</code> создайте <code>products_page.py</code>, содержащий класс <code>ProductsPage</code> из боссовой задачи модуля 15 (<code>__init__</code>, <code>open</code>, <code>search</code>). Убедитесь, что файл выполняется без синтаксических ошибок (например, <code>python -m py_compile pages/products_page.py</code> ничего не печатает).',
        hint: 'В этом файле вообще нет тестов — он ТОЛЬКО определяет класс. Отделение «как взаимодействовать со страницей» от «что проверять» — это весь смысл паттерна Page Object.'
      },
      'm16-t3': {
        title: 'Общая фикстура page в conftest.py',
        goal: 'В <code>conftest.py</code> напишите фикстуру на <code>yield</code> с именем <code>page</code>, которая запускает Playwright chromium, открывает новую страницу, переходит на главную, закрывает баннер куки, отдаёт <code>page</code> через <code>yield</code>, а затем закрывает браузер после этого. НЕ импортируйте ничего из <code>conftest.py</code> в ваш файл теста.',
        hint: 'Каждый тест, назвавший <code>page</code> параметром, автоматически получает ровно эту настройку — pytest находит <code>conftest.py</code> по одному лишь особому имени файла, в папке, где живёт тест, или в любой папке выше.'
      },
      'm16-t4': {
        title: 'Тест, использующий фикстуру и Page Object вместе',
        goal: 'В <code>tests/test_search.py</code> импортируйте <code>ProductsPage</code> из вашего пакета <code>pages</code>, напишите <code>def test_search_returns_results(page):</code>, использующую фикстуру <code>page</code>, создайте <code>ProductsPage(page)</code>, вызовите <code>.open()</code> и <code>.search("Dress")</code>, затем проверьте, что количество результатов больше 0. Запустите <code>pytest -v</code> — убедитесь, что видите <b>1 passed</b>.',
        hint: 'Функция теста сама никогда не запускает и не закрывает браузер — она просто просит <code>page</code> как параметр и доверяет <code>conftest.py</code>, что тот об этом позаботился, точно как фикстуры модуля 9.'
      },
      'm16-t5': {
        title: 'Увидеть, как setup и teardown выполняются по порядку',
        goal: 'В отдельном небольшом файле напишите фикстуру <code>def resource(): print("Setting up"); yield "ready"; print("Tearing down")</code> и тест, печатающий <code>f"Running test with {resource}"</code>. Запустите <code>pytest -v -s test_file.py</code> (флаг <code>-s</code> показывает вывод print). Убедитесь, что три строки появляются РОВНО в этом порядке: <b>Setting up</b>, <b>Running test with ready</b>, <b>Tearing down</b>.',
        hint: 'Это ровно тот механизм, что стоит за вашей фикстурой <code>page</code> из задачи 3 — часть «запустить браузер» выполняется до теста, часть «закрыть браузер» — после, автоматически, в этом порядке, каждый раз.'
      },
      'm16-t6': {
        title: 'requirements.txt',
        goal: 'Создайте файл <code>requirements.txt</code>, перечисляющий <code>pytest</code>, <code>playwright</code> и <code>requests</code>, по одному на строку. Создайте НОВОЕ, отдельное виртуальное окружение именно для этой папки фреймворка (<code>python -m venv venv</code>, как в модуле 6), активируйте его и убедитесь, что <code>pip install -r requirements.txt</code> реально устанавливает в него всё нужное проекту одной командой — не пропускайте это рассуждением «концептуально», реально выполните в чистом venv и посмотрите на установку пакетов.',
        hint: 'Это и есть отдача от задачи на venv из модуля 6: <code>requirements.txt</code> по-настоящему воспроизводим, только если вы доказали, что он работает, стартуя с НИЧЕГО не установленного — запуск в окружении, где и так всё уже стоит глобально, не поймал бы недостающую зависимость. Выполните <code>pip freeze</code>, чтобы увидеть точные установленные версии — фиксация точных версий (например, <code>pytest==9.1.1</code>) делает проект воспроизводимым; без неё всегда ставится последняя версия.'
      },
      'm16-t7': {
        title: 'API- и UI-тесты, запущенные вместе',
        goal: 'Добавьте <code>tests/test_api.py</code> с тестом, который делает GET <code>productsList</code> (в стиле модуля 12) и проверяет <code>status_code == 200</code>. Запустите <code>pytest -v</code> из корня проекта (не внутри <code>tests/</code>) — убедитесь, что И <code>test_api.py</code>, И <code>test_search.py</code> появляются и проходят в одном запуске.',
        hint: 'Ничто намеренно не связывает эти два файла теста между собой — pytest автоматически обнаруживает каждый файл <code>test_*.py</code> в текущей папке, независимо от того, что каждый из них на самом деле делает внутри.'
      },
      'm16-t8': {
        title: 'Делить дорогую настройку через scope',
        goal: 'Измените вашу фикстуру <code>page</code> (или её копию в небольшом файле теста) на <code>@pytest.fixture(scope="module")</code>. Напишите ДВЕ функции теста в одном файле, обе использующие её. Запустите <code>pytest -v -s</code> и убедитесь, что print-строка настройки появляется только ОДИН раз для обоих тестов, а не дважды.',
        hint: 'Для чего-то настолько медленного, как запуск настоящего браузера, разделение одного экземпляра между всеми тестами файла (вместо перезапуска на каждый тест) — реальная, значимая разница в скорости в большом наборе тестов.'
      },
      'm16-t9': {
        title: '.gitignore для проекта',
        goal: 'Создайте файл <code>.gitignore</code>, перечисляющий <code>__pycache__/</code>, <code>.pytest_cache/</code> и <code>venv/</code> — папки, автоматически создаваемые Python и pytest, которые никогда не должны коммититься. Выполните <code>git status</code> после однократного запуска набора тестов и убедитесь, что ни одна из них не появляется как неотслеживаемый файл.',
        hint: 'Это знания о git из модуля 6, применённые к настоящему проекту — коммит сгенерированных кэш-папок раздувает репозиторий и создаёт бессмысленные конфликты слияния без всякой пользы.'
      },
      'm16-t10': {
        title: 'Тест-фреймворк AutoQuest, собранный воедино',
        goal: 'Соберите каждую часть этого модуля вместе в одном проекте: <code>pages/products_page.py</code> (задача 2), <code>conftest.py</code> с фикстурой <code>page</code> (задача 3), <code>tests/test_search.py</code> (задача 4) И <code>tests/test_api.py</code> (задача 7), плюс <code>requirements.txt</code> и <code>.gitignore</code>. Запустите <code>pytest -v</code> из корня проекта. Убедитесь, что ВСЕ тесты проходят в одном запуске — это настоящий, работающий, минимальный фреймворк автоматизации, а не более крупное упражнение.',
        hint: 'Здесь нет нового кода — это каждая часть из задач 1-9, собранная в форме, описанной в теории выше. Если какая-то одна часть отсутствует, перечитайте ту задачу, а не гадайте.'
      },
      'm16-hw1': {
        title: 'Закоммитить фреймворк в git',
        goal: 'Внутри вашего проекта-фреймворка выполните <code>git init</code> (сначала проверив <code>git config user.email</code>, по модулю 6), затем <code>git add .</code> и <code>git commit -m "Initial test framework"</code>. Убедитесь, что <code>git log</code> показывает коммит, и что игнорируемые папки из задачи 9 НЕ являются его частью.',
        hint: 'Проверьте <code>git status</code> прямо перед коммитом — появление <code>__pycache__/</code> или <code>.pytest_cache/</code> в staged означает, что <code>.gitignore</code> отсутствует или был создан слишком поздно, чтобы подействовать на уже отслеживаемые файлы.'
      },
      'm16-hw2': {
        title: 'Добавить замоканный юнит-тест рядом с настоящими',
        goal: 'Добавьте <code>tests/test_cart_logic.py</code>, содержащий быстрый, замоканный юнит-тест в стиле модуля 11 (вообще без настоящей сети или браузера). Запустите <code>pytest -v</code> из корня проекта снова — убедитесь, что он выполняется рядом с API- и UI-тестами из задачи 10, всё в одной команде.',
        hint: 'Это и есть отдача всего модуля: быстрые замоканные тесты, настоящие API-тесты и полные браузерные тесты все живут бок о бок, и один запуск <code>pytest</code> не заботится о том, какого вида каждый из них.'
      },
      'm16-hw3': {
        title: 'Написать README',
        goal: 'Создайте <code>README.md</code> в корне проекта с коротким описанием того, что тестирует фреймворк, и точной командой для его запуска (<code>pip install -r requirements.txt</code>, затем <code>pytest -v</code>). Убедитесь, что кто-то без другого контекста мог бы прочитать это и запустить набор тестов самостоятельно.',
        hint: 'Фреймворк, который никто, кроме автора, не может понять, как запустить, на самом деле не закончен — тот же инстинкт стоит за каждым хорошим README в настоящем GitHub-проекте, включая собственный README этого репозитория AutoQuest.'
      },
      'm16-hw4': {
        title: 'Реально запустить это на push — настоящий CI-пайплайн',
        goal: 'Модуль 6 обещал именно этот момент: создайте <code>.github/workflows/tests.yml</code> в вашем запушенном репозитории с минимальным workflow GitHub Actions, срабатывающим <code>on: push</code>, который делает checkout кода, ставит Python, выполняет <code>pip install -r requirements.txt</code>, затем <code>pytest -v</code>. Запушьте его, затем откройте вкладку «Actions» на странице вашего GitHub-репозитория и убедитесь, что видите настоящий прогон — зелёный, если всё прошло, красный, если что-то упало, с реальным выводом pytest прямо в логе, не запущенным вами вручную на своей машине.',
        hint: 'Это и есть то самое обещание из теории модуля 6 — «именно это позволяет автоматическому пайплайну (CI) запускать ваши тесты при каждом push, вместо того чтобы запускать их вручную» — наконец выполненное. Минимальный стартовый workflow выглядит так: <code>on: [push]</code> на верхнем уровне, одна job <code>jobs.test</code>, запускаемая на <code>ubuntu-latest</code>, шаги <code>actions/checkout@v4</code>, <code>actions/setup-python@v5</code> (с указанием <code>python-version</code>), затем два шага <code>run:</code> — установка и pytest — если сам синтаксис YAML незнаком, поищите «GitHub Actions python pytest workflow» готовый шаблон для копирования; цель здесь — увидеть, как это реально работает, а не запомнить YAML наизусть.'
      }
    }
  }
};
