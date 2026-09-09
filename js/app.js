/* AutoQuest — логика приложения: состояние, рендер, запуск/проверка задач, редактор. */

(function(){


  const XP_PER_TASK = 10;

  /* ---------------- error dictionary ---------------- */

  const ERROR_HINTS = {
    SyntaxError: 'Syntax error — Python could not parse the structure of the code. Common causes: text typed without quotes around it (Python tries to read it as code, not as a string), an unclosed quote or bracket, or a missing colon after <code>if</code>/<code>while</code>/<code>for</code>.',
    IndentationError: 'An indentation problem. In Python, the indent at the start of a line is part of the code, not formatting. All lines of the same block must start with the same indent (usually 4 spaces).',
    NameError: 'Python does not know that name — most likely a typo in the variable name, or it is used before it was created.',
    TypeError: 'Incompatible data types — for example, trying to add a number and a string directly. Check that every value is the right type (or try an f-string).',
    ZeroDivisionError: 'Division by zero — Python does not allow this. Check whether the divisor could be zero.',
    ValueError: 'The value does not fit the operation — for example, trying to turn something that is not a number into a number.',
    IndexError: 'Accessing a list index that does not exist. Indices in Python start at 0.',
    KeyError: 'The dictionary has no such key — check the key name and whether it was actually added.',
    AttributeError: 'No such method here — either a typo, or it is not supported yet in this sandbox.',
    RuntimeError: 'Looks like the loop never ends — check that its condition eventually becomes False (for example, that the counter actually changes inside the loop).'
  };

  function errorHint(pyName, text){
    if(pyName && ERROR_HINTS[pyName]) return ERROR_HINTS[pyName];
    for(const key in ERROR_HINTS){ if(text && text.includes(key)) return ERROR_HINTS[key]; }
    return 'The code did not run. Read the error message in the console below — it almost always points to which line to look at.';
  }

  /* ---------------- arcade: signal color (title/boss/victory only) ---------------- */
  // Purely cosmetic per-viewer choice — retints .arcade elements via
  // data-signal, stored separately from real progress. Never affects
  // task content, difficulty, or the rest of the site's own theme.
  const SIGNALS = ['mint','amber','violet','cyan'];
  function getSignal(){
    try{ const s = localStorage.getItem('autoquest-signal'); return SIGNALS.includes(s) ? s : 'mint'; }catch(e){ return 'mint'; }
  }
  function setSignal(s){
    try{ localStorage.setItem('autoquest-signal', s); }catch(e){}
  }

  const HERO_SVG = `
    <path class="outline" d="M50 8 C28 8 18 28 20 48 L18 60 L30 56 L28 70 L50 66 L72 70 L70 56 L82 60 L80 48 C82 28 72 8 50 8Z" fill="#101815" stroke-width="2"/>
    <ellipse cx="50" cy="44" rx="24" ry="20" fill="#0b1210"/>
    <circle class="eye" cx="41" cy="44" r="3.6"/>
    <circle class="eye" cx="59" cy="44" r="3.6"/>
    <path class="outline" d="M34 78 L30 150 L44 150 L48 96 L52 96 L56 150 L70 150 L66 78 Z" fill="#101815" stroke-width="2"/>
    <rect class="outline" x="8" y="76" width="16" height="46" rx="4" fill="#0b1210" stroke-width="2"/>
    <rect class="outline" x="76" y="76" width="16" height="46" rx="4" fill="#0b1210" stroke-width="2"/>`;

  function renderBossHeader(t, m){
    return `
      <div class="boss-header">
        <div class="arcade arcade-screen" data-signal="${getSignal()}">
          <div class="arcade-backdrop"><div class="arcade-linebg"></div></div>
          <div class="arcade-content">
            <div class="arcade-hud">
              <div class="arcade-life"><i></i><i></i><i></i></div>
              <div class="arcade-hud-right">${m.checkpoint ? 'CHECKPOINT' : 'MODULE ' + m.num}</div>
            </div>
            <div>
              <div class="boss-tag">&gt; BOSS ENCOUNTER</div>
              <div class="boss-name">${escapeHtml(t.title).toUpperCase()}</div>
              <div class="boss-track"><i></i></div>
            </div>
            <div class="boss-arena">
              <svg class="boss-hero" viewBox="0 0 100 160">${HERO_SVG}</svg>
              <div class="boss-ring">
                <svg viewBox="0 0 200 200">
                  <path d="M100 22 L138 42 L158 80 L148 118 L166 148 L138 178 L92 182 L58 164 L44 130 L58 100 L44 72 L58 38 Z"
                        fill="none" stroke="#ff6b6b" stroke-width="13" stroke-linejoin="round"/>
                  <circle cx="100" cy="100" r="7" fill="#2a0a0a"/>
                  <circle cx="96" cy="97" r="2" fill="#ff6b6b"/>
                  <circle cx="104" cy="97" r="2" fill="#ff6b6b"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function showVictory(t, m){
    const overlay = document.getElementById('victory-overlay');
    if(!overlay) return;
    overlay.dataset.signal = getSignal();
    const modEl = document.getElementById('victory-module');
    if(modEl) modEl.textContent = (m.checkpoint ? 'CHECKPOINT' : 'MODULE ' + m.num) + ' CLEARED';
    const titleEl = document.getElementById('victory-title');
    if(titleEl) titleEl.textContent = t.title.toUpperCase() + ' — DEFEATED';
    const xpEl = document.getElementById('victory-xp'); if(xpEl) xpEl.textContent = '+' + XP_PER_TASK;
    const streakEl = document.getElementById('victory-streak'); if(streakEl) streakEl.textContent = state.streak || 0;
    const levelEl = document.getElementById('victory-level'); if(levelEl) levelEl.textContent = computeLevel(state.xp);

    const idx = MODULES.findIndex(x=>x.id===m.id);
    const next = MODULES[idx+1];
    const nextEl = document.getElementById('victory-next');
    if(nextEl){
      if(next){
        nextEl.innerHTML = `<div class="n">${next.checkpoint ? '\u{1F3AF}' : next.num}</div><div><div class="t">${escapeHtml(next.title).toUpperCase()}</div><div class="d">${escapeHtml(next.desc)}</div></div>`;
      } else {
        nextEl.innerHTML = `<div class="t">That was the last one — the whole course is cleared.</div>`;
      }
    }
    overlay.hidden = false;
  }

  // Every top-level .arcade container (title, path/world-map, victory) shares
  // the same persisted signal color — applied here whenever it changes, not
  // just on the screen the swatch happens to live on.
  function applySignalEverywhere(){
    const s = getSignal();
    document.querySelectorAll('.arcade').forEach(el => { el.dataset.signal = s; });
  }

  function initTitleScreen(){
    const titleScreen = document.getElementById('view-title');
    if(!titleScreen) return;
    applySignalEverywhere();
    const swatches = titleScreen.querySelectorAll('.arcade-swatch');
    swatches.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.signal === getSignal());
      btn.addEventListener('click', () => {
        setSignal(btn.dataset.signal);
        applySignalEverywhere();
        swatches.forEach(b => b.classList.toggle('active', b === btn));
      });
    });
    const cta = document.getElementById('title-cta');
    if(cta){
      cta.addEventListener('click', () => {
        document.getElementById('view-title').hidden = true;
        document.getElementById('site-wrap').hidden = false;
        document.getElementById('view-path').hidden = false;
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }
    const brandBtn = document.getElementById('brand-home');
    if(brandBtn){
      brandBtn.addEventListener('click', () => {
        document.getElementById('site-wrap').hidden = true;
        document.getElementById('view-title').hidden = false;
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }
    const continueBtn = document.getElementById('victory-continue');
    if(continueBtn){
      continueBtn.addEventListener('click', () => {
        document.getElementById('victory-overlay').hidden = true;
      });
    }
  }

  function updateTitleCta(hasPriorVisit){
    const cta = document.getElementById('title-cta');
    if(cta) cta.textContent = hasPriorVisit ? 'CONTINUE' : 'NEW GAME';
  }

  /* ---------------- state ---------------- */

  let state = {xp:0, completed:{}, streak:0, lastOpen:null};
  let db = null;

  function computeLevel(xp){ return 1 + Math.floor(xp / 50); }
  function levelProgress(xp){ return (xp % 50) / 50 * 100; }

  function loadLocal(){
    try{
      const raw = localStorage.getItem('autoquest-state');
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return null;
  }
  function saveLocal(s){
    try{ localStorage.setItem('autoquest-state', JSON.stringify(s)); }catch(e){}
  }

  function todayStr(){ return new Date().toISOString().slice(0,10); }

  function bumpStreak(s){
    const today = todayStr();
    if(s.lastOpen === today) return s;
    const y = new Date(Date.now()-86400000).toISOString().slice(0,10);
    s.streak = (s.lastOpen === y) ? (s.streak||0) + 1 : 1;
    s.lastOpen = today;
    return s;
  }

  function mergeState(base, incoming){
    if(!incoming) return base;
    return {
      xp: Math.max(base.xp||0, incoming.xp||0),
      completed: Object.assign({}, base.completed||{}, incoming.completed||{}),
      streak: Math.max(base.streak||0, incoming.streak||0),
      lastOpen: incoming.lastOpen || base.lastOpen || null
    };
  }

  async function initState(){
    const local = loadLocal();
    // Snapshot BEFORE bumpStreak() below — that always sets streak >= 1 on
    // every load, including a genuine first visit, so it cannot tell the
    // title screen apart. Whether a saved state already existed can.
    let hasPriorVisit = !!local;
    if(local) state = mergeState(state, local);

    try{
      db = await claude.use('db');
    }catch(e){ db = null; }

    if(db){
      try{
        const snap = await db.doc('progress/state').get();
        if(snap.exists){
          const d = snap.data();
          hasPriorVisit = true;
          state = mergeState(state, d);
        }
      }catch(e){}
    }

    state = bumpStreak(state);
    persist();
    renderStats();
    renderPath();
    updateTitleCta(hasPriorVisit);
  }

  function persist(){
    saveLocal(state);
    if(db){
      db.doc('progress/state').set(state).catch(()=>{});
    }
  }

  function markDone(taskId){
    if(state.completed[taskId]) return;
    state.completed[taskId] = true;
    state.xp += XP_PER_TASK;
    persist();
    renderStats();
  }

  /* ---------------- render: stats ---------------- */

  function renderStats(){
    const lvl = computeLevel(state.xp);
    document.getElementById('stat-level').textContent = lvl;
    document.getElementById('stat-xp').textContent = state.xp;
    document.getElementById('xpbar-fill').style.width = levelProgress(state.xp) + '%';
    document.getElementById('stat-streak').textContent = state.streak || 0;
  }

  /* ---------------- render: path ---------------- */

  function moduleStatus(m){
    if(!m.tasks) return 'locked';
    const done = m.tasks.every(t => state.completed[t.id]);
    if(done) return 'done';
    return 'available';
  }

  // ?unlock in the URL opens every module regardless of progress — for
  // reviewing content while building the course. Never linked from the UI;
  // the normal locked path is untouched for anyone without the param.
  const DEV_UNLOCK = new URLSearchParams(location.search).has('unlock');

  function prevModuleDone(idx){
    if(DEV_UNLOCK) return true;
    if(idx === 0) return true;
    const prev = MODULES[idx-1];
    if(!prev.tasks) return false;
    // Следующий модуль открывается, как только начат предыдущий (хотя бы одна
    // задача решена). Так добавление новых задач в модуль не «перезакрывает»
    // уже открытые дальше модули.
    return prev.tasks.some(t => state.completed[t.id]);
  }

  function renderPath(){
    const el = document.getElementById('path-list');
    el.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'path-line';
    el.appendChild(line);

    // «ты здесь» — первый открытый, но ещё не пройденный модуль с задачами
    let currentId = null;
    for(let i = 0; i < MODULES.length; i++){
      const mm = MODULES[i];
      if(mm.tasks && prevModuleDone(i) && moduleStatus(mm) !== 'done'){ currentId = mm.id; break; }
    }

    // счётчики «пройдено X из Y» по этапам
    const phaseTotals = {}, phaseDone = {};
    MODULES.forEach(mm => {
      phaseTotals[mm.phase] = (phaseTotals[mm.phase] || 0) + 1;
      if(moduleStatus(mm) === 'done') phaseDone[mm.phase] = (phaseDone[mm.phase] || 0) + 1;
    });

    let prevPhase = null, phaseNum = 0;
    MODULES.forEach((m, idx) => {
      if(m.phase !== prevPhase){
        phaseNum++;
        prevPhase = m.phase;
        const head = document.createElement('div');
        head.className = 'phase-head';
        head.innerHTML = `
          <div class="kicker">Phase ${phaseNum}</div>
          <div class="phase-title">${m.phase}</div>
          <div class="phase-sub">${phaseDone[m.phase] || 0} of ${phaseTotals[m.phase]} modules done in this phase</div>`;
        el.appendChild(head);
      }

      let status = moduleStatus(m);
      const unlocked = prevModuleDone(idx);
      if(!m.tasks && !unlocked) status = 'locked';
      if(!m.tasks && unlocked) status = 'available';

      const isCurrent = m.id === currentId;
      const node = document.createElement('div');
      node.className = 'node' + (isCurrent ? ' current' : '');
      node.tabIndex = unlocked ? 0 : -1;
      node.dataset.status = status;
      node.dataset.locked = (!unlocked).toString();

      const doneCount = m.tasks ? m.tasks.filter(t=>state.completed[t.id]).length : 0;
      const totalCount = m.tasks ? m.tasks.length : null;

      const chips = [];
      if(isCurrent) chips.push('<span class="chip current">▶ you are here</span>');
      if(status === 'done'){
        chips.push('<span class="chip good">✓ done</span>');
      } else if(m.tasks){
        chips.push(`<span class="chip">${doneCount}/${totalCount} tasks</span>`);
      } else if(unlocked){
        chips.push('<span class="chip">unlocked · content coming soon</span>');
      } else {
        chips.push('<span class="chip">🔒 locked</span>');
      }

      node.innerHTML = `
        <div class="badge">${status==='done' ? '✓' : (m.checkpoint ? '🎯' : m.num)}</div>
        <div class="node-body">
          <div class="node-kicker">${m.checkpoint ? 'Checkpoint' : 'Module ' + m.num}</div>
          <div class="node-title">${m.title}</div>
          <div class="node-desc">${m.desc}</div>
          <div class="node-meta">${chips.join('')}</div>
        </div>`;

      if(unlocked){
        node.addEventListener('click', () => openModule(m.id));
        node.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModule(m.id);} });
      }
      el.appendChild(node);
    });
  }

  /* ---------------- render: module room ---------------- */

  function openModule(id){
    const m = MODULES.find(x=>x.id===id);
    document.getElementById('view-path').hidden = true;
    document.getElementById('view-module').hidden = false;
    const room = document.getElementById('module-room');

    if(!m.tasks){
      room.innerHTML = `
        <div class="room-head">
          <div class="kicker">Module ${m.num}</div>
          <h2>${m.title}</h2>
        </div>
        <div class="soon">
          <div class="display">This level unlocks in a future session</div>
          <p>Content is added gradually, so every practice task relies only on theory that has already been explained.</p>
        </div>`;
      window.scrollTo({top:0, behavior:'smooth'});
      return;
    }

    let html = `
      <div class="room-head">
        <div class="kicker">${m.checkpoint ? 'Checkpoint' : 'Module ' + m.num}</div>
        <h2>${m.title}</h2>
        <div class="room-progress" id="room-progress"></div>
      </div>
      <div class="card theory">
        <h3>The short version</h3>
        ${m.theory.map(renderTheoryItem).join('')}
      </div>`;

    m.tasks.forEach((t, i) => {
      if(t.boss) html += renderBossHeader(t, m);
      html += renderTaskCard(t, i, m.tasks.length, 'Task');
    });

    if(m.homework && m.homework.length){
      html += `
      <div class="card hw-head">
        <h3>📚 Homework</h3>
        <p>Harder tasks for between sessions. They do not gate the next module, but they give XP and good practice.</p>
        <div class="room-progress" id="hw-progress"></div>
      </div>`;
      m.homework.forEach((t, i) => {
        html += renderTaskCard(t, i, m.homework.length, 'Homework');
      });
    }

    html += `<div class="room-next" id="room-next"></div>`;

    room.innerHTML = html;

    m.tasks.forEach(t => bindTask(room, t, m));
    if(m.homework){ m.homework.forEach(t => bindTask(room, t, m)); }

    updateRoomProgress(m);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // Theory items are either a plain string (rendered as-is, old format) or
  // {text, examples:[{label, kind, code, result}]} for a concept with one or
  // more separated, visually distinct example cards (simple + real-world).
  function renderTheoryItem(item){
    if(typeof item === 'string') return `<p>${item}</p>`;
    const examples = (item.examples || []).map(ex => `
      <div class="theory-ex ${ex.kind || ''}">
        <div class="theory-ex-label"><span class="dot"></span>${ex.label}</div>
        <pre>${escapeHtml(ex.code)}</pre>
        ${ex.result !== undefined ? `<div class="theory-ex-result"><span class="arrow">&rarr;</span><code>${escapeHtml(ex.result)}</code></div>` : ''}
      </div>`).join('');
    return `
      <div class="theory-item">
        <p class="theory-text">${item.text}</p>
        ${examples ? `<div class="theory-examples">${examples}</div>` : ''}
      </div>`;
  }

  function renderTaskCard(t, i, total, label){
    const done = !!state.completed[t.id];
    const badge = t.boss ? '<span class="chip boss">🏆 Module finale</span>' : '';
    if(t.kind === 'checklist'){
      const codeBlock = t.starter ? `<pre class="code-preview">${escapeHtml(t.starter)}</pre>` : '';
      return `
      <div class="card task checklist ${done?'done':''}" id="task-${t.id}">
        <div class="task-head">
          <span class="task-num">${label} ${i+1} of ${total}</span>
          ${badge}
        </div>
        <div class="task-title">${t.title}</div>
        <div class="task-goal">${t.goal}</div>
        ${codeBlock}
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn primary" data-checklist="${t.id}">${done ? '✓ Done' : 'Mark as done'}</button>
          <button class="btn" data-hint="${t.id}">💡 Hint</button>
        </div>
        <div class="hint-box" id="hint-${t.id}"><b>Hint:</b> ${t.hint || ''}</div>
        <div class="result" id="res-${t.id}"></div>
      </div>`;
    }
    if(t.kind === 'predict'){
      const offlineBadge = t.offline ? '<span class="chip">🐍 Real Python — not this sandbox</span>' : '';
      return `
      <div class="card task predict ${done?'done':''}" id="task-${t.id}">
        <div class="task-head">
          <span class="task-num">${label} ${i+1} of ${total}</span>
          ${badge}${offlineBadge}
        </div>
        <div class="task-title">${t.title}</div>
        <div class="task-goal">${t.goal}</div>
        <pre class="code-preview">${escapeHtml(t.code)}</pre>
        <label class="field-label">What will this code print?</label>
        <textarea class="editor" id="guess-${t.id}" spellcheck="false" placeholder="Type your answer line by line, as it will appear in the output"></textarea>
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn primary" data-check="${t.id}">🔍 Reveal answer and check</button>
          <button class="btn" data-hint="${t.id}">💡 Hint</button>
        </div>
        <div class="console" id="console-${t.id}"></div>
        <div class="hint-box" id="hint-${t.id}"><b>Hint:</b> ${t.hint || ''}</div>
        <div class="result" id="res-${t.id}"></div>
      </div>`;
    }
    return `
      <div class="card task ${done?'done':''}" id="task-${t.id}">
        <div class="task-head">
          <span class="task-num">${label} ${i+1} of ${total}</span>
          ${badge}
        </div>
        <div class="task-title">${t.title}</div>
        <div class="task-goal">${t.goal}</div>
        <div class="editor-hud">
          <div class="editor-hudbar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="editor-hudlabel">${t.id}.py</span>
            <span class="editor-hudlive"><i></i>READY</span>
          </div>
          <div class="editor-hudframe">
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
            <div class="editor-wrap">
              <div class="editor-gutter" id="gutter-${t.id}" aria-hidden="true">1</div>
              <div class="editor-code">
                <pre class="editor-highlight" id="hl-${t.id}" aria-hidden="true"><code></code></pre>
                <textarea class="editor" id="code-${t.id}" spellcheck="false" wrap="off"></textarea>
              </div>
            </div>
          </div>
        </div>
        ${t.reasonPrompt ? `
        <div class="reason-field">
          <label class="field-label" for="reason-${t.id}">${t.reasonPrompt}</label>
          <input type="text" class="reason-input" id="reason-${t.id}" placeholder="One sentence, just for you — not graded, but Check stays locked until you write something">
        </div>` : ''}
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn" data-run="${t.id}">▶ Run</button>
          <button class="btn primary" data-check="${t.id}" ${t.reasonPrompt ? 'disabled' : ''}>✓ Check</button>
          <button class="btn" data-hint="${t.id}">💡 Hint</button>
          <button class="btn" data-reset="${t.id}">↺ Reset code</button>
        </div>
        <div class="console" id="console-${t.id}"></div>
        <div class="hint-box" id="hint-${t.id}"><b>Hint:</b> ${t.hint || ''}</div>
        <div class="result" id="res-${t.id}"></div>
      </div>`;
  }

  function bindTask(room, t, m){
    if(t.kind === 'checklist'){
      const btn = room.querySelector(`[data-checklist="${t.id}"]`);
      btn.addEventListener('click', () => {
        if(state.completed[t.id]) return;
        markDone(t.id);
        document.getElementById(`task-${t.id}`).classList.add('done');
        btn.textContent = '✓ Done';
        renderStats();
        if(m) updateRoomProgress(m);
        if(t.boss && m) showVictory(t, m);
      });
      room.querySelector(`[data-hint="${t.id}"]`).addEventListener('click', () => {
        document.getElementById(`hint-${t.id}`).classList.toggle('show');
      });
      return;
    }
    if(t.kind === 'predict'){
      const guessEl = room.querySelector(`#guess-${t.id}`);
      guessEl.addEventListener('keydown', onEditorTab);
      room.querySelector(`[data-check="${t.id}"]`).addEventListener('click', () => runPredictCheck(t, m));
      room.querySelector(`[data-hint="${t.id}"]`).addEventListener('click', () => {
        document.getElementById(`hint-${t.id}`).classList.toggle('show');
      });
      return;
    }
    const editor = room.querySelector(`#code-${t.id}`);
    const gutter = room.querySelector(`#gutter-${t.id}`);
    const hl = room.querySelector(`#hl-${t.id}`);
    editor.value = savedCode(t.id) || t.starter;
    syncGutter(editor, gutter);
    updateHighlight(hl, editor.value, null);
    editor.addEventListener('keydown', onEditorKeydown);
    editor.addEventListener('input', () => {
      saveCode(t.id, editor.value);
      syncGutter(editor, gutter);
      updateHighlight(hl, editor.value, null);
      acOpen(editor);
      // Как только пользователь начал править код, убираем старый результат проверки,
      // чтобы он не противоречил новому коду (напр. красное «Пока не то» после исправления).
      const rr = document.getElementById(`res-${t.id}`);
      if(rr){ rr.className = 'result'; rr.innerHTML = ''; }
    });
    editor.addEventListener('scroll', () => {
      gutter.scrollTop = editor.scrollTop; hl.scrollTop = editor.scrollTop;
      if(ac.editor === editor) acPosition(editor);
    });
    editor.addEventListener('blur', () => { if(ac.editor === editor) acClose(); });

    const checkBtn = room.querySelector(`[data-check="${t.id}"]`);
    // A fix-the-bug task can ask for a one-line reason before Check unlocks —
    // not graded on content, just a forced pause before jumping to the fix.
    if(t.reasonPrompt){
      const reasonEl = room.querySelector(`#reason-${t.id}`);
      const saved = savedReason(t.id);
      if(saved) reasonEl.value = saved;
      checkBtn.disabled = !reasonEl.value.trim();
      reasonEl.addEventListener('input', () => {
        saveReason(t.id, reasonEl.value);
        checkBtn.disabled = !reasonEl.value.trim();
      });
    }

    room.querySelector(`[data-run="${t.id}"]`).addEventListener('click', () => runOnly(t));
    checkBtn.addEventListener('click', () => runCheck(t, m));
    room.querySelector(`[data-hint="${t.id}"]`).addEventListener('click', () => {
      document.getElementById(`hint-${t.id}`).classList.toggle('show');
    });
    room.querySelector(`[data-reset="${t.id}"]`).addEventListener('click', () => {
      editor.value = t.starter;
      saveCode(t.id, t.starter);
      syncGutter(editor, gutter);
      updateHighlight(hl, editor.value, null);
      const c = document.getElementById(`console-${t.id}`); c.className='console'; c.textContent='';
      const r = document.getElementById(`res-${t.id}`); r.className='result';
    });
  }

  // Простая подсветка синтаксиса для отображения (терпима к неполному/неверному
  // коду во время печати — это не тот же строгий токенайзер, что у интерпретатора).
  const HL_KEYWORDS = new Set(['if','elif','else','while','for','in','def','return',
    'break','continue','pass','True','False','None','and','or','not']);
  const HL_BUILTINS = new Set(['print','len','range','int','float','str','abs','round','sum','min','max']);
  const HL_TOKEN_RE = /(#.*$)|((?:f|F)?"(?:[^"\\]|\\.)*"?)|((?:f|F)?'(?:[^'\\]|\\.)*'?)|(\b\d+\.?\d*\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)/gm;

  function highlightLine(line){
    let out = '', last = 0, m;
    HL_TOKEN_RE.lastIndex = 0;
    while ((m = HL_TOKEN_RE.exec(line))) {
      if (m.index > last) out += escapeHtml(line.slice(last, m.index));
      const tok = m[0];
      if (m[1] !== undefined) out += `<span class="tok-comment">${escapeHtml(tok)}</span>`;
      else if (m[2] !== undefined || m[3] !== undefined) out += `<span class="tok-string">${escapeHtml(tok)}</span>`;
      else if (m[4] !== undefined) out += `<span class="tok-number">${escapeHtml(tok)}</span>`;
      else if (m[5] !== undefined) {
        if (HL_KEYWORDS.has(tok)) out += `<span class="tok-keyword">${escapeHtml(tok)}</span>`;
        else if (HL_BUILTINS.has(tok)) out += `<span class="tok-builtin">${escapeHtml(tok)}</span>`;
        else out += escapeHtml(tok);
      }
      last = HL_TOKEN_RE.lastIndex;
    }
    out += escapeHtml(line.slice(last));
    return out;
  }

  function renderHighlight(code, errLine){
    return code.split('\n').map((line, i) => {
      const html = highlightLine(line);
      if (errLine && (i + 1) === errLine) return `<span class="err-line">${html || ' '}</span>`;
      return html;
    }).join('\n');
  }

  // hl — элемент <pre class="editor-highlight"> над textarea; errLine — номер
  // строки с ошибкой (1-based) или null/undefined, если ошибки нет / код правится.
  function updateHighlight(hl, code, errLine){
    if(!hl) return;
    const codeEl = hl.querySelector('code');
    if(codeEl) codeEl.innerHTML = renderHighlight(code, errLine);
  }

  // Колонка с номерами строк слева от textarea: пересчитываем количество строк
  // по числу переносов в значении и синхронизируем прокрутку с textarea.
  function syncGutter(editor, gutter){
    if(!gutter) return;
    const n = (editor.value.match(/\n/g) || []).length + 1;
    let s = '';
    for(let i=1;i<=n;i++) s += i + (i<n ? '\n' : '');
    gutter.textContent = s;
    gutter.scrollTop = editor.scrollTop;
  }

  function updateRoomProgress(m){
    const idx = MODULES.findIndex(x=>x.id===m.id);
    const doneCount = m.tasks.filter(t=>state.completed[t.id]).length;
    const totalCount = m.tasks.length;
    const prog = document.getElementById('room-progress');
    if(prog){
      const allDone = doneCount === totalCount;
      prog.innerHTML = `<span class="chip${allDone ? ' good' : ''}">${allDone ? '✓ ' : ''}${doneCount}/${totalCount} tasks done</span>`;
    }

    if(m.homework){
      const hwDone = m.homework.filter(t=>state.completed[t.id]).length;
      const hwTotal = m.homework.length;
      const hwEl = document.getElementById('hw-progress');
      if(hwEl){
        const allHw = hwDone === hwTotal;
        hwEl.innerHTML = `<span class="chip${allHw ? ' good' : ''}">${allHw ? '✓ ' : ''}${hwDone}/${hwTotal} homework done</span>`;
      }
    }

    const nextEl = document.getElementById('room-next');
    if(!nextEl) return;
    if(doneCount === totalCount){
      const next = MODULES[idx+1];
      if(next){
        nextEl.innerHTML = `<button class="btn primary" id="btn-next-module">Next module → ${next.title}</button>`;
        const btn = document.getElementById('btn-next-module');
        if(btn) btn.addEventListener('click', () => openModule(next.id));
      } else {
        nextEl.innerHTML = `<div class="chip good">🏁 This is the last unlocked module — head back to the path</div>`;
      }
    } else {
      nextEl.innerHTML = '';
    }
  }

  function onEditorTab(e){
    if(e.key === 'Tab'){
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      el.value = el.value.slice(0,s) + '    ' + el.value.slice(en);
      el.selectionStart = el.selectionEnd = s + 4;
      // Прямая правка .value не порождает событие input сама по себе —
      // рассылаем его вручную, чтобы гуттер/подсветка/автосохранение не отстали.
      el.dispatchEvent(new Event('input'));
    }
  }

  /* ---------------- автодополнение ---------------- */
  // Один общий выпадающий список на всю страницу (переиспользуется для любого
  // редактора) + позиционирование по пикселям через измерение текста canvas'ом
  // (моноширинный шрифт — измерение надёжное, без скрытого зеркального div).

  let ac = { editor:null, items:[], index:-1, wordStart:0, wordEnd:0 };
  let acEl = null;
  let acCanvas = null;

  function ensureAcEl(){
    if(acEl) return acEl;
    acEl = document.createElement('div');
    acEl.className = 'ac-dropdown';
    acEl.hidden = true;
    acEl.addEventListener('mousedown', (e) => {
      const item = e.target.closest('.ac-item');
      if(!item) return;
      e.preventDefault(); // не даём textarea потерять фокус до клика
      ac.index = parseInt(item.dataset.i, 10);
      acAccept();
    });
    document.body.appendChild(acEl);
    return acEl;
  }

  function measureTextWidth(text, font){
    if(!acCanvas) acCanvas = document.createElement('canvas');
    const ctx = acCanvas.getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  function currentWordAtCaret(editor){
    if(editor.selectionStart !== editor.selectionEnd) return null;
    const pos = editor.selectionStart;
    const before = editor.value.slice(0, pos);
    const m = /[A-Za-z_][A-Za-z0-9_]*$/.exec(before);
    return m ? { word:m[0], start:pos - m[0].length, end:pos } : null;
  }

  function getCaretPixelPos(editor){
    const pos = editor.selectionStart;
    const before = editor.value.slice(0, pos);
    const lines = before.split('\n');
    const lineIndex = lines.length - 1;
    const col = lines[lines.length - 1];
    const cs = getComputedStyle(editor);
    const font = `${cs.fontSize} ${cs.fontFamily}`;
    const padLeft = parseFloat(cs.paddingLeft) || 0;
    const padTop = parseFloat(cs.paddingTop) || 0;
    const lineHeight = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) * 1.6);
    const x = padLeft + measureTextWidth(col, font) - editor.scrollLeft;
    const y = padTop + lineIndex * lineHeight - editor.scrollTop + lineHeight;
    return { x, y };
  }

  function codeIdentifiers(code){
    const set = new Set();
    const re = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
    let m;
    while ((m = re.exec(code))) {
      const w = m[0];
      if (!HL_KEYWORDS.has(w) && !HL_BUILTINS.has(w)) set.add(w);
    }
    return set;
  }

  function acCandidates(editor, word){
    if(!word) return [];
    const out = [];
    const seen = new Set();
    const wl = word.toLowerCase();
    function add(list, kind){
      for(const w of list){
        if(w === word) continue;
        if(!w.toLowerCase().startsWith(wl)) continue;
        if(seen.has(w)) continue;
        seen.add(w);
        out.push({ word:w, kind });
      }
    }
    add(Array.from(HL_KEYWORDS).sort(), 'keyword');
    add(Array.from(HL_BUILTINS).sort(), 'builtin');
    add(Array.from(codeIdentifiers(editor.value)).sort(), 'name');
    return out.slice(0, 8);
  }

  const AC_KIND_LABEL = { keyword:'keyword', builtin:'builtin', name:'from code' };

  function acOpen(editor){
    const cw = currentWordAtCaret(editor);
    if(!cw){ acClose(); return; }
    const items = acCandidates(editor, cw.word);
    if(!items.length){ acClose(); return; }
    ac.editor = editor; ac.items = items; ac.index = 0; ac.wordStart = cw.start; ac.wordEnd = cw.end;
    const el = ensureAcEl();
    el.innerHTML = items.map((it, i) =>
      `<div class="ac-item${i===0?' active':''}" data-i="${i}"><span class="ac-word">${escapeHtml(it.word)}</span><span class="ac-kind">${AC_KIND_LABEL[it.kind]}</span></div>`
    ).join('');
    el.hidden = false;
    acPosition(editor);
  }

  function acClose(){
    ac.editor = null; ac.items = []; ac.index = -1;
    if(acEl) acEl.hidden = true;
  }

  function acPosition(editor){
    if(!acEl || acEl.hidden) return;
    const { x, y } = getCaretPixelPos(editor);
    const rect = editor.getBoundingClientRect();
    acEl.style.left = Math.round(rect.left + x) + 'px';
    acEl.style.top = Math.round(rect.top + y) + 'px';
  }

  function acRenderActive(){
    if(!acEl) return;
    acEl.querySelectorAll('.ac-item').forEach((el, i) => {
      const active = i === ac.index;
      el.classList.toggle('active', active);
      if(active) el.scrollIntoView({ block:'nearest' });
    });
  }

  function acAccept(){
    if(!ac.editor || ac.index < 0) return;
    const editor = ac.editor;
    const chosen = ac.items[ac.index].word;
    const val = editor.value;
    editor.value = val.slice(0, ac.wordStart) + chosen + val.slice(ac.wordEnd);
    const caret = ac.wordStart + chosen.length;
    editor.selectionStart = editor.selectionEnd = caret;
    acClose();
    editor.focus();
    editor.dispatchEvent(new Event('input'));
    acClose(); // на случай, если обработчик input снова открыл список по новому слову
  }

  function onEditorKeydown(e){
    const editor = e.target;
    if(ac.editor === editor && ac.items.length){
      if(e.key === 'ArrowDown'){ e.preventDefault(); ac.index = (ac.index + 1) % ac.items.length; acRenderActive(); return; }
      if(e.key === 'ArrowUp'){ e.preventDefault(); ac.index = (ac.index - 1 + ac.items.length) % ac.items.length; acRenderActive(); return; }
      if(e.key === 'Enter' || e.key === 'Tab'){ e.preventDefault(); acAccept(); return; }
      if(e.key === 'Escape'){ e.preventDefault(); acClose(); return; }
    }
    onEditorTab(e);
  }

  function savedCode(id){
    try{ return localStorage.getItem('autoquest-code-'+id); }catch(e){ return null; }
  }
  function saveCode(id, code){
    try{ localStorage.setItem('autoquest-code-'+id, code); }catch(e){}
  }
  function savedReason(id){
    try{ return localStorage.getItem('autoquest-reason-'+id); }catch(e){ return null; }
  }
  function saveReason(id, text){
    try{ localStorage.setItem('autoquest-reason-'+id, text); }catch(e){}
  }

  function showConsole(id, r){
    const c = document.getElementById(`console-${id}`);
    c.className = 'console show' + (r.ok ? '' : ' err');
    const label = r.ok ? 'Output' : 'Error';
    const body = r.ok ? (r.output || '(empty — the code printed nothing)') : (r.output ? r.output + '\n' + r.error : r.error);
    c.innerHTML = `<span class="label">${label}</span>` + body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function runOnly(t){
    const code = document.getElementById(`code-${t.id}`).value;
    const r = runPython(code);
    showConsole(t.id, r);
    updateHighlight(document.getElementById(`hl-${t.id}`), code, r.ok ? null : r.pyLine);
    // Просто «Запустить» не проверяет задачу — поэтому убираем старый вердикт
    // проверки, чтобы он не противоречил свежему выводу.
    const resEl = document.getElementById(`res-${t.id}`);
    if(resEl){ resEl.className = 'result'; resEl.innerHTML = ''; }
  }

  function runCheck(t, m){
    const code = document.getElementById(`code-${t.id}`).value;
    const resEl = document.getElementById(`res-${t.id}`);
    const r = runPython(code);
    showConsole(t.id, r);
    updateHighlight(document.getElementById(`hl-${t.id}`), code, r.ok ? null : r.pyLine);

    if(!r.ok){
      resEl.className = 'result show err';
      resEl.innerHTML = `<b>The code did not run</b>${errorHint(r.pyName, r.error)}`;
      return;
    }

    const result = t.check(r.output);
    resEl.className = 'result show ' + (result.ok ? 'ok' : 'err');
    resEl.innerHTML = result.ok
      ? '<b>Correct! 🎉</b>Exactly what was needed — task complete.'
      : `<b>Not quite</b>${result.msg}`;

    if(result.ok){
      markDone(t.id);
      document.getElementById(`task-${t.id}`).classList.add('done');
      renderStats();
      if(m) updateRoomProgress(m);
      if(t.boss && m) showVictory(t, m);
    }
  }

  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function runPredictCheck(t, m){
    const guess = document.getElementById(`guess-${t.id}`).value.trim();
    const resEl = document.getElementById(`res-${t.id}`);
    let actual;

    if(t.offline){
      // Real-Python-only feature: this sandbox cannot run the code, so there is
      // nothing to execute — the expected output is simply the known-correct
      // behavior of real CPython, provided by the task itself.
      actual = t.expected.trim();
    } else {
      const r = runPython(t.code);
      showConsole(t.id, r);
      if(!r.ok){
        resEl.className = 'result show err';
        resEl.innerHTML = `<b>Something went wrong</b>The example failed to run — this is a bug in the task, not your mistake.`;
        return;
      }
      actual = r.output.trim();
    }

    const isMatch = guess === actual;
    resEl.className = 'result show ' + (isMatch ? 'ok' : 'err');
    if(isMatch){
      resEl.innerHTML = '<b>Exactly! 🎯</b>You read the code correctly — that is exactly how it runs.';
      markDone(t.id);
      document.getElementById(`task-${t.id}`).classList.add('done');
      renderStats();
      if(m) updateRoomProgress(m);
      if(t.boss && m) showVictory(t, m);
    } else {
      resEl.innerHTML = `<b>Not a match</b>The code actually prints:<br><code>${escapeHtml(actual).replace(/\n/g,'<br>')}</code><br>Try to understand why, type a different answer in the field above, then hit the button again.`;
    }
  }

  /* ---------------- nav ---------------- */

  document.getElementById('btn-back').addEventListener('click', () => {
    document.getElementById('view-module').hidden = true;
    document.getElementById('view-path').hidden = false;
    renderPath();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  initTitleScreen();
  initState();
})();
