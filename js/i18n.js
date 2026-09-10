/* AutoQuest — локализация UI (EN/RU). Не в IIFE, как matchEn/deCyr в
   modules-data.js — app.js целиком обёрнут в свою IIFE, и если объявить
   t()/getLang() внутри неё, снаружи (например, из будущих модулей) их не
   будет видно. Держим здесь же и словарь, и хелперы для контента модулей.

   Дефолт — английский (весь курс сознательно переведён на английский
   8 сентября 2026, см. CLAUDE.md). RU — это ПЕРЕВОД поверх английского
   оригинала, не отдельный источник истины: t() всегда падает обратно на
   английскую строку, если русской нет, а mField()/taskField()/theoryRu()
   так же падают на исходные английские поля модуля/задачи, если для этого
   id в MODULES_RU (js/modules-data-ru.js) перевода ещё нет — так что
   непереведённые модули просто остаются на английском, ничего не ломается. */

var I18N_LANGS = ['en', 'ru'];

// Russian noun agreement after a count: 1/21/31... -> one, 2-4/22-24... ->
// few, everything else (0, 5-20, 25-30...) -> many. Needed because a fixed
// word baked into a template (e.g. "N испытаний") is only correct for some
// counts — a 4-task checkpoint needs "испытания", not "испытаний" (found
// during the 9 September 2026 QA pass, see ROADMAP.md). Only the briefing's
// "trial(s)" noun needs this right now — English doesn't (it only ever
// shows counts >1 here), so there's no pluralEn() to match.
function pluralRu(n, one, few, many){
  const mod10 = n % 10, mod100 = n % 100;
  if(mod10 === 1 && mod100 !== 11) return one;
  if(mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

var I18N = {
  en: {
    // topbar / brand
    brandBackTitle: 'Back to title screen',
    hudLv: 'LV', hudXp: 'XP',
    hudLvTitle: 'Level — rises as you earn XP by completing tasks',
    hudXpTitle: 'XP — experience earned by completing tasks and challenges',
    hudStreakTitle: 'Day streak — consecutive days you have completed at least one task',
    // tap-to-reveal HUD detail cards (10 Sept 2026, replaces native title
    // tooltips on the three .hud-cell's — see CLAUDE.md/ROADMAP.md) — short
    // title line for the card, body text repurposes the hud*Title copy above
    hudLvName: 'LEVEL', hudXpName: 'XP', hudStreakName: 'STREAK',
    navStats: 'STATS', navSettings: 'SETTINGS',
    // stats page
    statsHeading: 'PROGRESS STATS',
    statsLevel: 'LEVEL', statsXp: 'TOTAL XP', statsStreak: 'STREAK', statsModulesLabel: 'MODULES', statsCheckpointsLabel: 'CHECKPOINTS',
    statsHistoryHeading: 'MODULE HISTORY',
    statsStatusDone: 'DONE', statsStatusAvail: 'AVAILABLE', statsStatusLocked: 'LOCKED',
    // settings page
    settingsHeading: 'SETTINGS',
    settingsSignalDesc: 'Cosmetic accent across the whole site',
    settingsLangLabel: 'LANGUAGE', settingsLangDesc: 'UI chrome and course content',
    settingsResetLabel: 'Reset progress', settingsResetDesc: 'Start the course over on this device',
    settingsResetBtn: 'RESET',
    settingsResetConfirm: 'Reset ALL progress on this device? This cannot be undone.',
    settingsResetModalTag: 'IRREVERSIBLE ACTION',
    settingsResetCancel: 'CANCEL',
    settingsResetConfirmBtn: 'RESET PROGRESS',
    // title screen
    titleStages: 'STAGES',
    titleTagline: 'python, one real bug at a time',
    titleSignalColor: 'SIGNAL COLOR',
    titleNewGame: 'NEW GAME',
    titleContinue: 'CONTINUE',
    titlePressStart: 'PRESS START',
    signalMint: 'MINT', signalAmber: 'AMBER', signalViolet: 'VIOLET', signalCyan: 'CYAN', signalRose: 'ROSE',
    charMint: 'Patch', charAmber: 'Trace', charViolet: 'Null', charCyan: 'Ping', charRose: 'Byte',
    // path (course map)
    pathKicker: 'Personal course · for Mikhail',
    pathTitle: 'A solid Python foundation, step by step',
    pathDesc: 'Small levels, instant feedback, no theory "for later". Open the path — every practice task relies only on what has already been explained next to it.',
    pathStorageNote: 'Progress saves to THIS browser only (no account, no server) — a different browser, device, or private window starts from zero.',
    phaseLabel: 'Phase',
    phaseSub: '{done} of {total} modules done in this phase',
    checkpointLabel: 'Checkpoint',
    moduleLabel: 'Module',
    bossLabel: 'Boss',
    youAreHere: '▶ you are here',
    chipDone: '✓ done',
    chipTasks: '{done}/{total} tasks',
    chipUnlockedSoon: 'unlocked · content coming soon',
    chipLocked: '🔒 locked',
    // module room
    soonTitle: 'This level unlocks in a future session',
    soonDesc: 'Content is added gradually, so every practice task relies only on theory that has already been explained.',
    theoryHeading: 'The short version',
    homeworkHeading: '📚 Homework',
    homeworkDesc: 'Harder tasks for between sessions. They do not gate the next module, but they give XP and good practice.',
    taskLabel: 'Task', homeworkLabel: 'Homework',
    taskNumOf: '{label} {i} of {total}',
    bossFinale: '🏆 Module finale',
    offlineBadge: '🐍 Real Python — not this sandbox',
    markDone: 'Mark as done', done: '✓ Done',
    hintBtn: '💡 Hint', hintPrefix: 'Hint:',
    revealAndCheck: '🔍 Reveal answer and check',
    predictQuestion: 'What will this code print?',
    predictPlaceholder: 'Type your answer line by line, as it will appear in the output',
    reasonPlaceholder: 'One sentence, just for you — not graded, but Check stays locked until you write something',
    btnRun: '▶ Run', btnCheck: '✓ Check', btnReset: '↺ Reset code',
    editorReady: 'READY',
    roomProgressTasks: '{done}/{total} tasks done',
    roomProgressHomework: '{done}/{total} homework done',
    nextModule: 'Next module → {title}',
    lastModule: '🏁 This is the last unlocked module — head back to the path',
    backToPath: '← Whole path',
    // run / check feedback
    outputLabel: 'Output', errorLabel: 'Error',
    emptyOutput: '(empty — the code printed nothing)',
    codeDidNotRun: '<b>The code did not run</b>',
    correctTitle: '<b>Correct! 🎉</b>', correctBody: 'Exactly what was needed — task complete.',
    notQuiteTitle: '<b>Not quite</b>',
    predictExactTitle: '<b>Exactly! 🎯</b>', predictExactBody: 'You read the code correctly — that is exactly how it runs.',
    predictWrongTitle: '<b>Not a match</b>',
    predictWrongBody: 'The code actually prints:<br><code>{actual}</code><br>Try to understand why, type a different answer in the field above, then hit the button again.',
    predictBrokenTitle: '<b>Something went wrong</b>', predictBrokenBody: 'The example failed to run — this is a bug in the task, not your mistake.',
    // briefing / boss / victory
    briefingCheckpoint: 'Checkpoint reached: {desc}. {n} {trialWord} queued &mdash; everything here is a mix of what already cleared.',
    briefingBoss: 'Incoming: {desc}. {n} {trialWord} queued &mdash; boss encounter at the end: <b>{boss}</b>.',
    briefingPlain: 'Incoming: {desc}. {n} {trialWord} queued.',
    bossTag: '&gt; BOSS ENCOUNTER', bossTagDefeated: '&gt; BOSS DEFEATED',
    victoryCleared: '{label} CLEARED',
    victoryDefeated: '{title} — DEFEATED',
    victoryBadgeText: 'BOSS DEFEATED',
    victoryXpEarned: 'XP EARNED', victoryStreak: 'STREAK', victoryLevel: 'LEVEL',
    victoryLastOne: '<div class="t">That was the last one — the whole course is cleared.</div>',
    victoryContinue: 'CONTINUE',
    // errors
    errSyntax: 'Syntax error — Python could not parse the structure of the code. Common causes: text typed without quotes around it (Python tries to read it as code, not as a string), an unclosed quote or bracket, or a missing colon after <code>if</code>/<code>while</code>/<code>for</code>.',
    errIndentation: 'An indentation problem. In Python, the indent at the start of a line is part of the code, not formatting. All lines of the same block must start with the same indent (usually 4 spaces).',
    errName: 'Python does not know that name — most likely a typo in the variable name, or it is used before it was created.',
    errType: 'Incompatible data types — for example, trying to add a number and a string directly. Check that every value is the right type (or try an f-string).',
    errZeroDiv: 'Division by zero — Python does not allow this. Check whether the divisor could be zero.',
    errValue: 'The value does not fit the operation — for example, trying to turn something that is not a number into a number.',
    errIndex: 'Accessing a list index that does not exist. Indices in Python start at 0.',
    errKey: 'The dictionary has no such key — check the key name and whether it was actually added.',
    errAttribute: 'No such method here — either a typo, or it is not supported yet in this sandbox.',
    errRuntime: 'Looks like the loop never ends — check that its condition eventually becomes False (for example, that the counter actually changes inside the loop).',
    errFallback: 'The code did not run. Read the error message in the console below — it almost always points to which line to look at.',
    // matchEn()'s own shared check() message (js/modules-data.js) — identical
    // text on every task that hits this branch, so it's one tr() key rather
    // than a per-task msgs entry like the rest of check()'s custom text.
    cyrillicLayoutMsg: 'Looks like some letters were typed in the Cyrillic layout — they look like English letters, but Python sees different characters. Switch to the English keyboard layout and retype.'
  },
  ru: {
    brandBackTitle: 'Вернуться на титульный экран',
    hudLv: 'УР', hudXp: 'ОП',
    hudLvTitle: 'Уровень — растёт по мере получения ОП за выполненные задания',
    hudXpTitle: 'ОП — очки опыта за выполненные задания и испытания',
    hudStreakTitle: 'Серия дней — сколько дней подряд выполнено хотя бы одно задание',
    hudLvName: 'УРОВЕНЬ', hudXpName: 'ОП', hudStreakName: 'СЕРИЯ',
    navStats: 'СТАТИСТИКА', navSettings: 'НАСТРОЙКИ',
    statsHeading: 'СТАТИСТИКА ПРОГРЕССА',
    statsLevel: 'УРОВЕНЬ', statsXp: 'ВСЕГО ОП', statsStreak: 'СЕРИЯ', statsModulesLabel: 'МОДУЛИ', statsCheckpointsLabel: 'ЧЕКПОИНТЫ',
    statsHistoryHeading: 'ИСТОРИЯ МОДУЛЕЙ',
    statsStatusDone: 'ПРОЙДЕН', statsStatusAvail: 'ДОСТУПЕН', statsStatusLocked: 'ЗАКРЫТ',
    settingsHeading: 'НАСТРОЙКИ',
    settingsSignalDesc: 'Косметический акцент по всему сайту',
    settingsLangLabel: 'ЯЗЫК', settingsLangDesc: 'UI-хром и контент курса',
    settingsResetLabel: 'Сбросить прогресс', settingsResetDesc: 'Начать курс заново на этом устройстве',
    settingsResetBtn: 'СБРОСИТЬ',
    settingsResetConfirm: 'Сбросить ВЕСЬ прогресс на этом устройстве? Это нельзя отменить.',
    settingsResetModalTag: 'НЕОБРАТИМОЕ ДЕЙСТВИЕ',
    settingsResetCancel: 'ОТМЕНА',
    settingsResetConfirmBtn: 'СБРОСИТЬ ПРОГРЕСС',
    titleStages: 'УРОВНЕЙ',
    titleTagline: 'python, один настоящий баг за раз',
    titleSignalColor: 'ЦВЕТ СИГНАЛА',
    titleNewGame: 'НОВАЯ ИГРА',
    titleContinue: 'ПРОДОЛЖИТЬ',
    titlePressStart: 'НАЖМИТЕ СТАРТ',
    signalMint: 'МЯТА', signalAmber: 'ЯНТАРЬ', signalViolet: 'ФИОЛЕТ', signalCyan: 'ЦИАН', signalRose: 'РОЗА',
    charMint: 'Патч', charAmber: 'Трейс', charViolet: 'Нулл', charCyan: 'Пинг', charRose: 'Байт',
    pathKicker: 'Личный курс · для Михаила',
    pathTitle: 'Крепкий фундамент Python, шаг за шагом',
    pathDesc: 'Небольшие уровни, мгновенная обратная связь, без теории «на потом». Открывайте путь — каждая практическая задача опирается только на то, что уже объяснено рядом с ней.',
    pathStorageNote: 'Прогресс сохраняется ТОЛЬКО в этом браузере (без аккаунта, без сервера) — другой браузер, устройство или приватное окно начнут с нуля.',
    phaseLabel: 'Этап',
    phaseSub: '{done} из {total} модулей пройдено на этом этапе',
    checkpointLabel: 'Контрольная точка',
    moduleLabel: 'Модуль',
    bossLabel: 'Босс',
    youAreHere: '▶ вы здесь',
    chipDone: '✓ пройдено',
    chipTasks: '{done}/{total} задач',
    chipUnlockedSoon: 'открыто · контент скоро появится',
    chipLocked: '🔒 закрыто',
    soonTitle: 'Этот уровень откроется в одной из следующих сессий',
    soonDesc: 'Контент добавляется постепенно, поэтому каждая практическая задача опирается только на уже объяснённую теорию.',
    theoryHeading: 'Коротко о главном',
    homeworkHeading: '📚 Домашнее задание',
    homeworkDesc: 'Задачи посложнее — на время между сессиями. Они не блокируют следующий модуль, но дают опыт и хорошую практику.',
    taskLabel: 'Задача', homeworkLabel: 'Задание',
    taskNumOf: '{label} {i} из {total}',
    bossFinale: '🏆 Финал модуля',
    offlineBadge: '🐍 Настоящий Python — не эта песочница',
    markDone: 'Отметить выполненным', done: '✓ Готово',
    hintBtn: '💡 Подсказка', hintPrefix: 'Подсказка:',
    revealAndCheck: '🔍 Показать ответ и проверить',
    predictQuestion: 'Что напечатает этот код?',
    predictPlaceholder: 'Введите ответ построчно, так же, как он появится в выводе',
    reasonPlaceholder: 'Одно предложение, просто для себя — не оценивается, но кнопка «Проверить» заблокирована, пока вы что-нибудь не напишете',
    btnRun: '▶ Запустить', btnCheck: '✓ Проверить', btnReset: '↺ Сбросить код',
    editorReady: 'ГОТОВ',
    roomProgressTasks: '{done}/{total} задач пройдено',
    roomProgressHomework: '{done}/{total} домашних заданий пройдено',
    nextModule: 'Следующий модуль → {title}',
    lastModule: '🏁 Это последний открытый модуль — вернитесь на карту пути',
    backToPath: '← Весь путь',
    outputLabel: 'Вывод', errorLabel: 'Ошибка',
    emptyOutput: '(пусто — код ничего не напечатал)',
    codeDidNotRun: '<b>Код не выполнился</b>',
    correctTitle: '<b>Верно! 🎉</b>', correctBody: 'Именно то, что нужно — задача выполнена.',
    notQuiteTitle: '<b>Почти</b>',
    predictExactTitle: '<b>Точно! 🎯</b>', predictExactBody: 'Вы правильно прочитали код — именно так он и выполняется.',
    predictWrongTitle: '<b>Не совпадает</b>',
    predictWrongBody: 'На самом деле код печатает:<br><code>{actual}</code><br>Попробуйте понять, почему, введите другой ответ в поле выше и нажмите кнопку ещё раз.',
    predictBrokenTitle: '<b>Что-то пошло не так</b>', predictBrokenBody: 'Пример не выполнился — это ошибка в задаче, а не ваша.',
    briefingCheckpoint: 'Контрольная точка: {desc}. В очереди {n} {trialWord} &mdash; здесь всё смешано из уже пройденного.',
    briefingBoss: 'Внимание: {desc}. В очереди {n} {trialWord} &mdash; в конце босс: <b>{boss}</b>.',
    briefingPlain: 'Внимание: {desc}. В очереди {n} {trialWord}.',
    bossTag: '&gt; СХВАТКА С БОССОМ', bossTagDefeated: '&gt; БОСС ПОВЕРЖЕН',
    victoryCleared: '{label} ПРОЙДЕН',
    victoryDefeated: '{title} — ПОВЕРЖЕН',
    victoryBadgeText: 'БОСС ПОВЕРЖЕН',
    victoryXpEarned: 'ПОЛУЧЕНО ОП', victoryStreak: 'СЕРИЯ', victoryLevel: 'УРОВЕНЬ',
    victoryLastOne: '<div class="t">Это был последний — весь курс пройден.</div>',
    victoryContinue: 'ПРОДОЛЖИТЬ',
    errSyntax: 'Синтаксическая ошибка — Python не смог разобрать структуру кода. Частые причины: текст напечатан без кавычек (Python пытается прочитать его как код, а не как строку), незакрытая кавычка/скобка, или пропущено двоеточие после <code>if</code>/<code>while</code>/<code>for</code>.',
    errIndentation: 'Проблема с отступами. В Python отступ в начале строки — часть кода, а не оформление. Все строки одного блока должны начинаться с одинакового отступа (обычно 4 пробела).',
    errName: 'Python не знает такое имя — скорее всего, опечатка в названии переменной, либо оно используется раньше, чем создано.',
    errType: 'Несовместимые типы данных — например, попытка сложить число и строку напрямую. Проверьте, что у каждого значения нужный тип (или попробуйте f-строку).',
    errZeroDiv: 'Деление на ноль — Python это не разрешает. Проверьте, не может ли делитель оказаться нулём.',
    errValue: 'Значение не подходит для операции — например, попытка превратить в число то, что числом не является.',
    errIndex: 'Обращение к несуществующему индексу списка. Индексы в Python начинаются с 0.',
    errKey: 'В словаре нет такого ключа — проверьте название ключа и то, действительно ли он был добавлен.',
    errAttribute: 'Такого метода здесь нет — либо опечатка, либо он пока не поддерживается в этой песочнице.',
    errRuntime: 'Похоже, цикл никогда не заканчивается — проверьте, что его условие рано или поздно станет False (например, что счётчик действительно меняется внутри цикла).',
    errFallback: 'Код не выполнился. Прочитайте сообщение об ошибке в консоли ниже — оно почти всегда указывает, на какую строку смотреть.',
    cyrillicLayoutMsg: 'Похоже, часть букв напечатана в русской раскладке — они похожи на английские буквы, но Python видит другие символы. Переключитесь на английскую раскладку и введите заново.'
  }
};

// The 3 phase names are course content (from MODULES[i].phase in
// modules-data.js), but they're also used unt­ranslated as a grouping key
// (m.phase !== prevPhase in renderPath) — translating the field itself
// would break that grouping the moment only some modules got a RU phase
// name. Kept as a tiny separate display-only lookup instead.
var PHASE_RU = {
  'Python basics': 'Основы Python',
  'Automated tests in Python': 'Автотесты на Python',
  'Automation tooling': 'Инструменты автоматизации'
};
function phaseName(phase){
  if(getLang() === 'ru' && PHASE_RU[phase]) return PHASE_RU[phase];
  return phase;
}

function getLang(){
  try{ const l = localStorage.getItem('autoquest-lang'); return I18N_LANGS.includes(l) ? l : 'en'; }catch(e){ return 'en'; }
}
function setLang(l){
  try{ localStorage.setItem('autoquest-lang', I18N_LANGS.includes(l) ? l : 'en'); }catch(e){}
}

// tr(key, vars?) — named tr(), not t(), because `t` is already used
// pervasively across app.js as the local variable name for "the current
// task" (renderTaskCard(t,...), bindTask(room,t,m), runCheck(t,m), ...) —
// a same-named global would get silently shadowed or, worse, called as
// t('key') where t is actually a task object and throw. vars does simple
// {name} substitution, no pluralization logic needed anywhere this is used
// (counts are always shown as "X/Y", not through a grammatical number word).
function tr(key, vars){
  const lang = getLang();
  let s = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : I18N.en[key];
  if(s === undefined) return key;
  if(vars){ for(const k in vars){ s = s.replace(new RegExp('\\{'+k+'\\}','g'), vars[k]); } }
  return s;
}

// mField(m, field) / taskField(t, m, field) — course CONTENT (module/task
// title, desc, goal, hint), as opposed to t() above for UI chrome. Looks up
// window.MODULES_RU (js/modules-data-ru.js, loaded after modules-data.js)
// for a translated override; falls back to the module/task's own English
// field when the current module (or this specific field on it) has no RU
// entry yet — this is what lets translation happen module-by-module instead
// of all-or-nothing.
function mField(m, field){
  if(getLang() === 'ru' && window.MODULES_RU){
    const ov = MODULES_RU[m.id];
    if(ov && ov[field] !== undefined) return ov[field];
  }
  return m[field];
}
function taskField(taskObj, m, field){
  if(getLang() === 'ru' && window.MODULES_RU){
    const ov = MODULES_RU[m.id];
    const tov = ov && ov.tasks && ov.tasks[taskObj.id];
    if(tov && tov[field] !== undefined) return tov[field];
  }
  return taskObj[field];
}
// msgTr(t, m, msg) — the .msg strings inside a task's own check() function
// (js/modules-data.js) are a different shape from title/goal/hint: they're
// generated at RUN TIME by arbitrary JS logic inside check(out){...}, not a
// static field on the task object, so mField/taskField above (which just
// read a named property) can't reach them. Rather than rewrite every
// check() to go through tr() internally (touching ~50 functions across the
// English source, exactly the file this project keeps English-only), the
// RU override lives as a `msgs: {<exact English text>: <Russian text>}`
// map per task in MODULES_RU — msgTr looks up the literal English msg text
// t.check() just returned and swaps it for the RU version if one exists,
// falling back to the English text otherwise (same fallback philosophy as
// mField/taskField). Only used at the one call site that actually displays
// a check() msg (runCheck in app.js) — checklist/predict tasks don't call
// check() at all, so they never need this.
function msgTr(taskObj, m, msg){
  if(getLang() === 'ru' && window.MODULES_RU){
    const ov = MODULES_RU[m.id];
    const tov = ov && ov.tasks && ov.tasks[taskObj.id];
    if(tov && tov.msgs && tov.msgs[msg] !== undefined) return tov.msgs[msg];
  }
  return msg;
}
// Theory is an array (of strings, or {text, examples:[{label,...}]} objects)
// — translated as a parallel array by index under MODULES_RU[id].theory.
// Falls back per-item: an index with no RU entry (or a shorter RU array,
// e.g. new English theory added after translating) renders in English
// rather than crashing or leaving a gap.
function theoryItem(m, index){
  const en = m.theory[index];
  if(getLang() === 'ru' && window.MODULES_RU){
    const ov = MODULES_RU[m.id];
    if(ov && ov.theory && ov.theory[index] !== undefined) return ov.theory[index];
  }
  return en;
}
