/* AutoQuest — логика приложения: состояние, рендер, запуск/проверка задач, редактор. */

(function(){


  const XP_PER_TASK = 10;

  /* ---------------- error dictionary ---------------- */

  // Keys into the I18N dictionary (js/i18n.js) rather than the English text
  // itself — errorHint() must re-resolve the current language on every call,
  // not freeze in whatever language was active when this file loaded.
  const ERROR_HINT_KEYS = {
    SyntaxError: 'errSyntax', IndentationError: 'errIndentation', NameError: 'errName',
    TypeError: 'errType', ZeroDivisionError: 'errZeroDiv', ValueError: 'errValue',
    IndexError: 'errIndex', KeyError: 'errKey', AttributeError: 'errAttribute',
    RuntimeError: 'errRuntime'
  };

  function errorHint(pyName, text){
    if(pyName && ERROR_HINT_KEYS[pyName]) return tr(ERROR_HINT_KEYS[pyName]);
    for(const key in ERROR_HINT_KEYS){ if(text && text.includes(key)) return tr(ERROR_HINT_KEYS[key]); }
    return tr('errFallback');
  }

  /* ---------------- arcade: signal color (title/boss/victory only) ---------------- */
  // Purely cosmetic per-viewer choice — retints .arcade elements via
  // data-signal, stored separately from real progress. Never affects
  // task content, difficulty, or the rest of the site's own theme.
  const SIGNALS = ['mint','amber','violet','cyan','rose'];
  function getSignal(){
    try{ const s = localStorage.getItem('autoquest-signal'); return SIGNALS.includes(s) ? s : 'mint'; }catch(e){ return 'mint'; }
  }
  function setSignal(s){
    try{ localStorage.setItem('autoquest-signal', s); }catch(e){}
  }

  // One named character per Signal Color (9 September 2026) — until now
  // Signal Color only recolored one single silhouette; the user asked for
  // an actual distinct character per color, shown wherever the hero already
  // appears (title screen, path intro, boss encounter). Kept in the same
  // visual family on purpose (this project tried and rejected detailed
  // character/face art — see "Визуальная концепция" in CLAUDE.md): every
  // character shares the exact same body/arms/legs paths from the old
  // HERO_SVG, only the HEAD differs, so they read as one cast, not five
  // unrelated designs. HERO_BODY_SVG below is that shared, unchanged body.
  // Names go through tr() (charMint/charAmber/... in js/i18n.js) rather
  // than living here as plain strings — the user asked for these
  // characters the same session localization shipped, and a name is UI
  // chrome like a button label, not course content, so it gets the same
  // EN/RU treatment (Patch/Патч, Trace/Трейс, ...) instead of staying
  // English-only like module/task text does.
  const CHARACTER_KEYS = { mint:'charMint', amber:'charAmber', violet:'charViolet', cyan:'charCyan', rose:'charRose' };
  const HERO_BODY_SVG = `
    <path class="outline" d="M34 78 L30 150 L44 150 L48 96 L52 96 L56 150 L70 150 L66 78 Z" fill="#101815" stroke-width="2"/>
    <rect class="outline" x="8" y="76" width="16" height="46" rx="4" fill="#0b1210" stroke-width="2"/>
    <rect class="outline" x="76" y="76" width="16" height="46" rx="4" fill="#0b1210" stroke-width="2"/>`;
  const HERO_HEADS = {
    // Patch (mint) — the original hood, two round eyes.
    mint: `
      <path class="outline" d="M50 8 C28 8 18 28 20 48 L18 60 L30 56 L28 70 L50 66 L72 70 L70 56 L82 60 L80 48 C82 28 72 8 50 8Z" fill="#101815" stroke-width="2"/>
      <ellipse cx="50" cy="44" rx="24" ry="20" fill="#0b1210"/>
      <circle class="eye" cx="41" cy="44" r="3.6"/>
      <circle class="eye" cx="59" cy="44" r="3.6"/>`,
    // Trace (amber) — a flat-topped cap with a wide brim bar spanning past
    // both edges of the head, instead of mint's rounded hood. Silhouette is
    // rectangular where mint's is a soft curved cowl, so the two stay
    // distinct even in a 1-color icon at small sizes (the 9 Sept 2026
    // "mint and amber look identical" report — amber previously reused
    // mint's exact hood outline and only swapped the eyes for a visor).
    amber: `
      <rect class="outline" x="12" y="22" width="76" height="8" rx="4" fill="#101815" stroke-width="2"/>
      <path class="outline" d="M28 24 Q28 8 50 8 Q72 8 72 24 L72 54 Q72 63 62 63 L38 63 Q28 63 28 54 Z" fill="#101815" stroke-width="2"/>
      <ellipse cx="50" cy="42" rx="19" ry="15" fill="#0b1210"/>
      <rect class="eye" x="34" y="39" width="32" height="6" rx="3"/>`,
    // Null (violet) — a faceted hexagon head instead of a rounded hood.
    violet: `
      <path class="outline" d="M50 8 L76 24 L76 56 L50 72 L24 56 L24 24 Z" fill="#101815" stroke-width="2"/>
      <circle class="eye" cx="41" cy="42" r="3.2"/>
      <circle class="eye" cx="59" cy="42" r="3.2"/>`,
    // Ping (cyan) — a full round dome/helmet with a short antenna, instead
    // of reusing mint's hood shape (the 9 Sept 2026 report: cyan previously
    // was mint's exact hood + antenna, so the two read as the same head at
    // a glance — only the antenna differed). A circle silhouette is
    // distinct from mint's curved-and-flared hood, amber's flat cap, and
    // violet's angular hexagon.
    cyan: `
      <line x1="50" y1="8" x2="50" y2="0" stroke="#0b1210" stroke-width="3"/>
      <circle cx="50" cy="0" r="3.4" class="eye"/>
      <circle class="outline" cx="50" cy="40" r="32" fill="#101815" stroke-width="2"/>
      <circle cx="50" cy="40" r="24" fill="#0b1210"/>
      <circle class="eye" cx="41" cy="40" r="3.6"/>
      <circle class="eye" cx="59" cy="40" r="3.6"/>`,
    // Byte (rose) — a small rounded-square head, one centered cyclops eye.
    rose: `
      <rect class="outline" x="26" y="14" width="48" height="42" rx="14" fill="#101815" stroke-width="2"/>
      <circle class="eye" cx="50" cy="34" r="5.2"/>`
  };
  function heroSvgFor(signal){
    return (HERO_HEADS[signal] || HERO_HEADS.mint) + HERO_BODY_SVG;
  }

  // A short SYSTEM briefing on entering a module — built entirely from the
  // module's own real data (desc, task count, the boss task's actual title
  // if it has one), not hand-authored lore per module. Keeps the same
  // terminal voice already used in the boss encounter, one line, no new
  // characters introduced.
  function renderBriefing(m){
    const bossTask = m.tasks.find(t => t.boss);
    const taskCount = m.tasks.length;
    const desc = escapeHtml(mField(m, 'desc'));
    // Russian needs the noun after the count to agree with it (испытание /
    // испытания / испытаний) — a checkpoint's 4 tasks previously always
    // rendered the invariant "испытаний" from the template text itself,
    // which reads as "4 испытаний" (wrong; found in the 9 Sept 2026 QA
    // pass). English doesn't need this — every count shown here is >1.
    const trialWord = getLang() === 'ru' ? pluralRu(taskCount, 'испытание', 'испытания', 'испытаний') : (taskCount === 1 ? 'trial' : 'trials');
    let line;
    if(m.checkpoint){
      line = tr('briefingCheckpoint', {desc, n: taskCount, trialWord});
    } else if(bossTask){
      line = tr('briefingBoss', {desc, n: taskCount, trialWord, boss: escapeHtml(taskField(bossTask, m, 'title')).toUpperCase()});
    } else {
      line = tr('briefingPlain', {desc, n: taskCount, trialWord});
    }
    // The announcer's "face" — a CRT terminal whose mouth is the same blinking
    // cursor block already used at the end of the line, so the icon and the
    // text share one motif instead of introducing a second one. 12x12 pixel
    // grid, drawn as plain <rect> blocks (see the icon pitch artifact) —
    // crispEdges keeps it sharp at the small size it renders at here.
    const briefingIcon = `
      <svg class="briefing-icon" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="2" y="1" width="8" height="1"/><rect x="1" y="2" width="1" height="8"/>
        <rect x="10" y="2" width="1" height="8"/><rect x="2" y="10" width="8" height="1"/>
        <rect x="4" y="4" width="2" height="2"/><rect x="7" y="4" width="2" height="2"/>
        <rect x="4" y="7" width="4" height="2"/>
        <rect x="5" y="11" width="2" height="1"/><rect x="3" y="12" width="6" height="1"/>
      </svg>`;
    return `
      <div class="briefing">
        ${briefingIcon}
        <span class="briefing-who">SYSTEM&gt;</span>
        <span class="briefing-text">${line}<span class="briefing-cursor"></span></span>
      </div>`;
  }

  // Per-module boss silhouette — every module's boss used the exact same
  // hardcoded blob+eyes SVG (found during the 9 September 2026 QA/feedback
  // round: "боссы... визуалы для каждого" — CLAUDE.md's own vision names
  // per-module bugs like Infinite Loop / Spaghetti Hydra / KeyError Kraken
  // but nothing distinguished them visually). Rather than hand-drawing 16
  // bespoke creatures (expensive, and this project has already tried and
  // rejected detailed character art — see CLAUDE.md "Визуальная
  // концепция"), a small deterministic generator produces a distinct but
  // consistently-styled jagged silhouette per module: spike count/jitter/
  // rotation vary the outline, an eye arrangement gives it a "face", and a
  // couple of modules get a small thematic accent (a blinking cursor mouth
  // for the environment-setup module, a crosshair for locators, etc.).
  // Seeded by the module id, so it's stable across reloads/re-renders, not
  // random per view.
  function hashStr(s){ let h = 0; for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  function seededRand(seed){
    let s = seed % 2147483647; if(s <= 0) s += 2147483646;
    return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  // First attempt at a 9 Sept 2026 polish pass traced the old jitter-around-
  // a-circle vertices with smooth curves — reported back immediately as
  // "ужасные дизайны.. просто круги" (looked like plain circles/blobs, not
  // monsters). Root cause was deeper than the curve smoothing: with only
  // small radius jitter (as low as .03-.15 for several modules) around a
  // single circle, the vertices were already nearly circular BEFORE any
  // smoothing — there was no real spike to preserve. Rebuilt from the
  // vertices up as an actual star/crown/gear silhouette: alternating
  // OUTER (spike tip) and INNER (concave notch) vertices, each module's
  // `inner` ratio (inner radius / outer radius) controlling how sharp
  // (low ratio, e.g. m6/m10/m16's ninja-star spikes) or chunky (high
  // ratio, e.g. m3/m8's gear-like teeth) it reads. Straight `L` segments
  // are kept deliberately — a curve through a spike tip rounds it back
  // into the "just a blob" look this was trying to escape; sharp corners
  // are the whole point of a spiky creature silhouette. A small per-vertex
  // angle wobble (in addition to the existing radius jitter) keeps spikes
  // from looking like a perfectly regular, mechanical ninja-star stamp.
  function bossBlobPath(spikes, jitter, rotDeg, seed, innerRatio){
    const rand = seededRand(seed), cx = 100, cy = 100, outerR = 82;
    const innerR = outerR * (innerRatio == null ? 0.5 : innerRatio);
    const n = spikes * 2;
    let d = '';
    for(let i = 0; i < n; i++){
      const baseR = (i % 2 === 0) ? outerR : innerR;
      const angleWobble = (rand() * 2 - 1) * (Math.PI / n) * 0.35;
      const angle = (Math.PI * 2 * i / n) + (rotDeg * Math.PI / 180) + angleWobble;
      const r = baseR * (1 + (rand() * 2 - 1) * jitter);
      const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d + 'Z';
  }
  const BOSS_EYE_PATTERNS = {
    single: [{cx:100,cy:96,r:3.4}],
    pair: [{cx:91,cy:94,r:2.6},{cx:109,cy:94,r:2.6}],
    triangle: [{cx:100,cy:86,r:2.4},{cx:89,cy:103,r:2.4},{cx:111,cy:103,r:2.4}],
    row: [{cx:80,cy:96,r:2.1},{cx:100,cy:96,r:2.1},{cx:120,cy:96,r:2.1}],
    none: []
  };
  // Mouths — added alongside the eyes (9 Sept 2026, "мордочки какие-нибудь
  // интересные придумай") so each boss reads as an actual creature face,
  // not just a pair of dots. Left off modules whose `accent` already puts
  // something else in the same lower-face real estate (m6's blinking
  // cursor, m8/m3's spiral third eye, m13's database stack) to avoid
  // cluttering one small area with two unrelated motifs.
  const BOSS_MOUTH_PATTERNS = {
    fangs: `<path d="M82 110 Q100 117 118 110" fill="none" stroke="#ff6b6b" stroke-width="2.2"/><path d="M90 110 L93.5 121 L97 110 Z" fill="#ffe8e8"/><path d="M103 110 L106.5 121 L110 110 Z" fill="#ffe8e8"/>`,
    fang1: `<path d="M85 110 Q100 116 115 110" fill="none" stroke="#ff6b6b" stroke-width="2.2"/><path d="M96.5 111 L100 126 L103.5 111 Z" fill="#ffe8e8"/>`,
    grin: `<path d="M80 111 L86 118 L92 111 L98 118 L104 111 L110 118 L116 111" fill="none" stroke="#ffe8e8" stroke-width="2"/>`,
    frown: `<path d="M85 120 Q100 108 115 120" fill="none" stroke="#ff6b6b" stroke-width="2.2"/>`,
    none: ''
  };
  // Config per module: spikes/jitter/rotation shape the silhouette, `eyes`
  // picks a face pattern, `accent` adds one small thematic extra. `inner`
  // (added in the star/crown rewrite above) is the concave-notch radius as
  // a fraction of the outer spike radius — low (.28-.4) reads as a sharp
  // dangerous ninja-star, high (.6-.72) reads as a chunkier gear/crystal;
  // omitted defaults to .5 in bossBlobPath.
  const BOSS_LOOK = {
    m1: {spikes:6, jitter:.15, rot:0, inner:.55, eyes:'pair', mouth:'fangs'},
    m2: {spikes:5, jitter:.28, rot:10, inner:.42, eyes:'pair', mouth:'grin'},
    m3: {spikes:10, jitter:.06, rot:0, inner:.72, eyes:'single', accent:'spiral', mouth:'none'},
    m4: {spikes:8, jitter:.15, rot:5, inner:.5, eyes:'triangle', mouth:'fang1'},
    m5: {spikes:12, jitter:.15, rot:0, inner:.62, eyes:'row', mouth:'grin'},
    m6: {spikes:4, jitter:.05, rot:45, inner:.3, eyes:'none', accent:'cursor', mouth:'none'},
    m7: {spikes:6, jitter:.03, rot:0, inner:.65, eyes:'triangle', mouth:'frown'},
    m8: {spikes:9, jitter:.08, rot:0, inner:.68, eyes:'single', accent:'spiral', mouth:'none'},
    m9: {spikes:7, jitter:.2, rot:-15, inner:.4, eyes:'pair', mouth:'fangs'},
    m10: {spikes:7, jitter:.25, rot:0, inner:.28, eyes:'single', mouth:'grin'},
    m11: {spikes:6, jitter:.15, rot:0, inner:.55, eyes:'pair', accent:'twin', mouth:'fang1'},
    m12: {spikes:11, jitter:.1, rot:0, inner:.6, eyes:'pair', mouth:'grin'},
    m13: {spikes:6, jitter:.05, rot:0, inner:.6, eyes:'single', accent:'stack', mouth:'none'},
    m14: {spikes:8, jitter:.12, rot:0, inner:.48, eyes:'single', accent:'crosshair', mouth:'frown'},
    m15: {spikes:6, jitter:.15, rot:0, inner:.45, eyes:'pair', accent:'strings', mouth:'fangs'},
    m16: {spikes:13, jitter:.18, rot:0, inner:.32, eyes:'triangle', mouth:'grin'}
  };
  // A handful of seeded lightning-bolt crack lines radiating from the
  // silhouette's center toward its edge — the "поломанным, трещина" ask
  // (9 Sept 2026, after the rotate+desaturate-only defeated pose still
  // didn't read as broken): each bolt is a 2-segment jagged line (a
  // sideways-jogged midpoint, same trick real glass-crack SVGs use) drawn
  // in a bright near-white so it pops against the now-grey dead fill.
  // Seeded off (moduleId hash + 777) so it's stable per boss like
  // everything else here, not re-randomized on every re-render.
  function crackLines(seed, count){
    const rand = seededRand(seed + 777), cx = 100, cy = 100;
    let out = '';
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i / count) + (rand() * 2 - 1) * 0.6;
      const len = 58 + rand() * 22;
      const midLen = len * (0.45 + rand() * 0.2);
      const perp = angle + Math.PI / 2;
      const jag = (rand() * 2 - 1) * 11;
      const mx = cx + Math.cos(angle) * midLen + Math.cos(perp) * jag;
      const my = cy + Math.sin(angle) * midLen + Math.sin(perp) * jag;
      const ex = cx + Math.cos(angle) * len, ey = cy + Math.sin(angle) * len;
      out += `<path d="M${cx} ${cy} L${mx.toFixed(1)} ${my.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#e8e4e0" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`;
    }
    return out;
  }
  // defeated: the module's boss task is already cleared (state.completed).
  // Same silhouette (still recognizably THIS module's boss, not swapped
  // for generic "dead" art), but knocked onto its side (rotated + squashed
  // flatter), recolored from the living red-gradient to a cracked grey/ash
  // one (crackLines() above + a grayscale radialGradient below), with X
  // eyes — a "shattered" K.O. rather than just a dimmer copy of the same
  // red monster (the tilt-and-fade-only first attempt didn't read as
  // "broken" either — see CLAUDE.md).
  function renderBossVisual(moduleId, defeated){
    const look = BOSS_LOOK[moduleId] || BOSS_LOOK.m1;
    const seed = hashStr(moduleId);
    const path = bossBlobPath(look.spikes, look.jitter, look.rot, seed, look.inner);
    let extra = '';
    if(look.accent === 'twin'){
      // Doppelganger — a faint second copy of the same silhouette, offset,
      // standing in for the module's "mocks and stubs" theme.
      const twinPath = bossBlobPath(look.spikes, look.jitter, look.rot + 25, seed + 1, look.inner);
      extra += `<path d="${twinPath}" fill="none" stroke="#ff6b6b" stroke-width="6" stroke-linejoin="round" opacity=".35" transform="translate(14,-10) scale(.82)" transform-origin="100 100"/>`;
    }
    if(look.accent === 'crosshair'){
      extra += `<g stroke="#ff6b6b" stroke-width="2" opacity=".7"><line x1="100" y1="60" x2="100" y2="140"/><line x1="60" y1="100" x2="140" y2="100"/><circle cx="100" cy="100" r="18" fill="none"/></g>`;
    }
    if(look.accent === 'stack'){
      extra += `<g fill="none" stroke="#ff6b6b" stroke-width="4"><ellipse cx="100" cy="70" rx="34" ry="10"/><ellipse cx="100" cy="100" rx="34" ry="10"/><ellipse cx="100" cy="130" rx="34" ry="10"/></g>`;
    }
    if(look.accent === 'strings'){
      extra += `<g stroke="#ff6b6b" stroke-width="1.5" opacity=".6"><line x1="70" y1="30" x2="86" y2="80"/><line x1="130" y1="30" x2="114" y2="80"/></g>`;
    }
    if(look.accent === 'cursor'){
      extra += `<rect class="boss-cursor" x="88" y="112" width="24" height="9" fill="#ff6b6b"/>`;
    }
    if(look.accent === 'spiral'){
      extra += `<path d="M100 100 m0 -10 a10 10 0 1 1 -8 16 a5 5 0 1 1 3 -8" fill="none" stroke="#ff6b6b" stroke-width="2" opacity=".7"/>`;
    }
    // Glowing eyes when alive (pale near-white core + soft red halo, "lit
    // from within" rather than a flat sticker); grey X's when defeated,
    // matching the grey/ash palette below instead of staying alive-red.
    const eyes = (BOSS_EYE_PATTERNS[look.eyes] || []).map(e => defeated
      ? `<g stroke="#8a8681" stroke-width="2"><line x1="${e.cx-3.2}" y1="${e.cy-3.2}" x2="${e.cx+3.2}" y2="${e.cy+3.2}"/><line x1="${e.cx-3.2}" y1="${e.cy+3.2}" x2="${e.cx+3.2}" y2="${e.cy-3.2}"/></g>`
      : `<circle cx="${e.cx}" cy="${e.cy}" r="${e.r+2.6}" fill="#ff6b6b" opacity=".35"/><circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="#ffd9d3"/>`
    ).join('');
    const mouth = BOSS_MOUTH_PATTERNS[look.mouth] || '';
    // Radial gradient gives the silhouette actual volume instead of being
    // a hollow outline (the 9 Sept 2026 "make the bosses prettier" pass) —
    // lighter coral core fading to a dark maroon edge when alive. When
    // defeated it swaps to a grey/ash version instead of just dimming the
    // same red (a later 9 Sept 2026 request: "поломанным чтобы был...
    // трещина" — a dimmer red monster still read as "alive but tired", not
    // broken) — paired with crackLines() below for an actual shattered
    // look. id is unique per module+state because #view-path renders many
    // of these <svg> elements on screen at once — a shared id would make
    // every instance point at whichever <radialGradient> happens to be
    // first in the DOM.
    const gradId = `bossGrad-${moduleId}${defeated ? '-d' : ''}`;
    const edgeColor = defeated ? '#5a564f' : '#ff6b6b';
    const body = `
        <defs>
          <radialGradient id="${gradId}" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="${defeated ? '#8a8681' : '#ffab9e'}"/>
            <stop offset="55%" stop-color="${defeated ? '#524e48' : '#ff6b6b'}"/>
            <stop offset="100%" stop-color="${defeated ? '#1c1a17' : '#7a1f1f'}"/>
          </radialGradient>
        </defs>
        <path d="${path}" fill="url(#${gradId})" fill-opacity=".6" stroke="${edgeColor}" stroke-width="6" stroke-linejoin="round"/>
        ${defeated ? crackLines(seed, 4) : ''}
        ${look.eyes !== 'none' && look.accent !== 'stack' && look.accent !== 'crosshair' ? `<circle cx="100" cy="100" r="7" fill="#2a0a0a"/>` : ''}
        ${eyes}
        ${mouth}
        ${extra}`;
    return `
      <svg viewBox="0 0 200 200">
        ${defeated ? `<g transform="rotate(65 100 100) scale(1,0.65)" opacity=".7">${body}</g>` : body}
      </svg>`;
  }

  function renderBossHeader(t, m){
    const defeated = !!state.completed[t.id];
    return `
      <div class="boss-header">
        <div class="arcade arcade-screen" data-signal="${getSignal()}">
          <div class="arcade-backdrop"><div class="arcade-linebg"></div></div>
          <div class="arcade-content">
            <div class="arcade-hud">
              <div class="arcade-life"><i></i><i></i><i></i></div>
              <div class="arcade-hud-right">${m.checkpoint ? tr('checkpointLabel').toUpperCase() : tr('moduleLabel').toUpperCase() + ' ' + m.num}</div>
            </div>
            <div>
              <div class="boss-tag">${defeated ? tr('bossTagDefeated') : tr('bossTag')}</div>
              <div class="boss-name">${escapeHtml(taskField(t, m, 'title')).toUpperCase()}</div>
              <div class="boss-track"><i style="${defeated ? 'width:4%' : ''}"></i></div>
            </div>
            <div class="boss-arena">
              <div class="boss-side">
                <svg class="boss-hero" viewBox="0 0 100 160">${heroSvgFor(getSignal())}</svg>
                <div class="boss-hero-name">${escapeHtml(tr(CHARACTER_KEYS[getSignal()] || CHARACTER_KEYS.mint))}</div>
              </div>
              <div class="boss-ring${defeated ? ' defeated' : ''}">${renderBossVisual(m.id, defeated)}</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // Re-renders the boss encounter block in place right after its task is
  // marked done — runCheck()/runPredictCheck()/the checklist handler only
  // ever patch the specific task card + stats + progress, not the whole
  // room, so without this the boss-header sitting above the task kept
  // showing its "not defeated" pose until the visitor left the module and
  // came back (state.completed was already true, just nothing had told
  // renderBossHeader to run again with it). Called right alongside
  // showVictory() at each of its 3 call sites, so the header updates while
  // that overlay is still showing, not only after Continue is dismissed.
  function refreshBossHeader(t, m){
    const old = document.querySelector('.boss-header');
    if(old) old.outerHTML = renderBossHeader(t, m);
  }

  function showVictory(t, m){
    const overlay = document.getElementById('victory-overlay');
    if(!overlay) return;
    overlay.dataset.signal = getSignal();
    const modEl = document.getElementById('victory-module');
    if(modEl) modEl.textContent = tr('victoryCleared', {label: m.checkpoint ? tr('checkpointLabel').toUpperCase() : tr('moduleLabel').toUpperCase() + ' ' + m.num});
    const titleEl = document.getElementById('victory-title');
    if(titleEl) titleEl.textContent = tr('victoryDefeated', {title: taskField(t, m, 'title').toUpperCase()});
    const xpEl = document.getElementById('victory-xp'); if(xpEl) xpEl.textContent = '+' + XP_PER_TASK;
    const streakEl = document.getElementById('victory-streak'); if(streakEl) streakEl.textContent = state.streak || 0;
    const levelEl = document.getElementById('victory-level'); if(levelEl) levelEl.textContent = computeLevel(state.xp);

    const idx = MODULES.findIndex(x=>x.id===m.id);
    const next = MODULES[idx+1];
    const nextEl = document.getElementById('victory-next');
    if(nextEl){
      if(next){
        nextEl.innerHTML = `<div class="n">${next.checkpoint ? '\u{1F3AF}' : next.num}</div><div><div class="t">${escapeHtml(mField(next, 'title')).toUpperCase()}</div><div class="d">${escapeHtml(mField(next, 'desc'))}</div></div>`;
      } else {
        nextEl.innerHTML = tr('victoryLastOne');
      }
    }
    overlay.hidden = false;
  }

  // Animated screen transitions (9 Sept 2026, user request: "переработать
  // переходы по страницам") — every top-level screen switch used to be an
  // instant `hidden = true/false` toggle with no visual continuity at all.
  // switchView() replaces that one pair of toggles with a fade + a small
  // vertical slide (14px, 320ms): `showEl` starts offset and transparent,
  // is un-hidden, then animates to its resting position on the next frame;
  // `hideEl` just fades out and is only actually `hidden` once its fade has
  // finished (so it stays laid out and visible, mid-fade, right up to that
  // point — CSS can't transition an element that's already display:none).
  // `direction` only changes which way `showEl` slides in from ('back'
  // slides down from above, anything else — 'fwd' — slides up from below)
  // so going deeper into the site and backing out of it read as opposite
  // motions, not the same animation played twice. A stale timer on the
  // SAME hideEl is cleared first — otherwise two quick nav clicks in a row
  // could have an earlier call's delayed `hidden = true` fire after a
  // later call already changed what that element should be doing.
  // Shared counter stamped onto whichever element is CURRENTLY being shown
  // by any switchView() call — see the race-condition comment inside the
  // scheduled hide below for why this exists.
  let viewGenCounter = 0;
  function switchView(hideEl, showEl, direction){
    if(!showEl || hideEl === showEl){ if(showEl) showEl.hidden = false; return; }
    if(!hideEl || hideEl.hidden){ showEl.hidden = false; return; }
    const enterCls = direction === 'back' ? 'view-enter-back' : 'view-enter-fwd';
    showEl.classList.add(enterCls);
    showEl.hidden = false;
    void showEl.offsetWidth; // force a style flush WITH the enter class applied — this is what makes the
    // immediately-following class removal (below) register as a real state
    // change the browser transitions from, without needing to wait for a
    // requestAnimationFrame callback. An earlier version used rAF here to
    // remove the class on "next frame" — found broken during verification
    // (9 Sept 2026): rAF simply never fired in this session's automation
    // browser tab, leaving the entering screen permanently stuck at
    // opacity:0 with the enter-class transform never cleared. Since a
    // backgrounded real browser tab also pauses rAF, the same stuck-screen
    // bug could hit a real visitor who switches tabs mid-navigation — not
    // just a tooling artifact worth working around, an actual robustness
    // gap. The offsetWidth-forced-reflow pattern needs no callback at all.
    showEl.classList.remove(enterCls);
    // Stamping showEl here (not just hideEl below) is what fixes a rapid
    // back-and-forth navigation race found while testing this feature
    // (9 Sept 2026): open a module then immediately hit "back" — path is
    // still mid-fade-out from the FIRST transition (its hide is on a timer,
    // not instant) when the SECOND transition re-shows it. The stale timer
    // from transition 1 was never told path got re-claimed, so ~170ms
    // later it fired anyway and hid the screen the visitor was now
    // actually looking at — both path and module ended up hidden at once,
    // a blank page. Stamping the shared counter on every element a
    // switchView call actually wants visible lets the OTHER half's
    // scheduled hide (below) recognize it's been outdated and skip itself.
    showEl.dataset.viewGen = String(++viewGenCounter);
    hideEl.classList.add('view-leave');
    const myGen = String(++viewGenCounter);
    hideEl.dataset.viewGen = myGen;
    clearTimeout(hideEl._viewLeaveTimer);
    hideEl._viewLeaveTimer = setTimeout(() => {
      // Only hide if nothing re-showed this exact element since THIS
      // transition scheduled the hide (see the comment above).
      if(hideEl.dataset.viewGen === myGen){
        hideEl.hidden = true;
        hideEl.classList.remove('view-leave');
      }
    }, 320);
  }

  // Which of the 4 mutually-exclusive sections inside #site-wrap is
  // currently showing — path/module/stats/settings all live at this one
  // level (title screen is a level above, handled separately by the
  // title-cta/brand-home handlers below).
  function currentInnerView(){
    if(!document.getElementById('view-module').hidden) return 'module';
    if(!document.getElementById('view-stats').hidden) return 'stats';
    if(!document.getElementById('view-settings').hidden) return 'settings';
    return 'path';
  }
  const INNER_VIEW_IDS = {path:'view-path', module:'view-module', stats:'view-stats', settings:'view-settings'};
  function goToInner(target, direction){
    const from = currentInnerView();
    if(from === target) return;
    switchView(document.getElementById(INNER_VIEW_IDS[from]), document.getElementById(INNER_VIEW_IDS[target]), direction);
  }

  // Every top-level .arcade container (title, path/world-map, victory) shares
  // the same persisted signal color — applied here whenever it changes, not
  // just on the screen the swatch happens to live on.
  function applySignalEverywhere(){
    const s = getSignal();
    document.querySelectorAll('.arcade').forEach(el => { el.dataset.signal = s; });
    // The character (head shape + name) tied to the chosen Signal Color —
    // redrawn into the two STATIC svg placeholders left in index.html
    // (#title-hero-svg, #path-hero-svg) every time the signal changes, not
    // just once on load. The third spot the hero appears (boss encounter)
    // is already generated fresh by renderBossHeader() itself each time,
    // so it doesn't need updating here.
    const svg = heroSvgFor(s);
    const titleHero = document.getElementById('title-hero-svg');
    if(titleHero) titleHero.innerHTML = svg;
    const pathHero = document.getElementById('path-hero-svg');
    if(pathHero) pathHero.innerHTML = svg;
    const nameEl = document.getElementById('character-name');
    if(nameEl) nameEl.textContent = tr(CHARACTER_KEYS[s] || CHARACTER_KEYS.mint);
    // Bug found 10 Sept 2026 (user report): pick a color in Settings, then
    // go to the title screen — the whole page is correctly retinted, but
    // the title screen's OWN swatch ring still shows the PREVIOUS color as
    // "active". Root cause: each swatch UI (title screen's .arcade-swatch,
    // Settings page's .settings-sw) only ever toggled its own `.active`
    // class inside its own click handler — correct for the screen you
    // changed it FROM, stale for any other screen showing swatches, since
    // nothing re-synced them when the signal changed from elsewhere.
    // Centralized here instead: applySignalEverywhere() already runs on
    // every actual signal change (either swatch's click handler, initial
    // load) and now keeps BOTH sets of swatch buttons in sync with the one
    // real source of truth (getSignal()), not just the set that was
    // physically clicked.
    document.querySelectorAll('.arcade-swatch').forEach(b => b.classList.toggle('active', b.dataset.signal === s));
    document.querySelectorAll('.settings-sw').forEach(b => b.classList.toggle('active', b.dataset.signal === s));
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
        // Defensive: title -> path should always land on a clean path
        // screen. Without this, Title -> open a module -> click the
        // brand/logo (which only hides #site-wrap, not #view-module
        // itself) -> Continue from the title again left the OLD module
        // room sitting un-hidden underneath the freshly-shown path list —
        // both rendered on the same page at once (found by the user,
        // 9 September 2026). Belt-and-suspenders with the brand-home fix
        // right below, which is the actual place that state goes stale.
        // Set BEFORE the animated switchView below, not after — #site-wrap
        // itself is what's animating in here, its children should already
        // be in their resting state (no separate inner transition) the
        // moment it becomes visible.
        document.getElementById('view-module').hidden = true;
        document.getElementById('view-stats').hidden = true;
        document.getElementById('view-settings').hidden = true;
        document.getElementById('view-path').hidden = false;
        currentModuleId = null;
        // The path list was last rendered whenever initState() first ran
        // (page load, always in whatever language was current then) or the
        // last time the language switch actually saw #view-path visible —
        // if the visitor changed language while still on the title screen,
        // neither of those re-ran it, so it can be stale here. Cheap to
        // just always re-render on the way in rather than track that.
        renderPath();
        switchView(document.getElementById('view-title'), document.getElementById('site-wrap'), 'fwd');
        window.scrollTo({top:0, behavior:'smooth'});
      });
    }
    const brandBtn = document.getElementById('brand-home');
    if(brandBtn){
      brandBtn.addEventListener('click', () => {
        // Root cause of the "path and an old module both visible" bug:
        // this only ever hid the outer #site-wrap, leaving whichever of
        // #view-path/#view-module was showing underneath still marked
        // not-hidden — invisible while site-wrap itself was hidden, but
        // #view-module came back un-hidden the moment title-cta's click
        // handler un-hid #site-wrap again on the next "Continue click".
        // Reset to the same clean state the back-to-path button leaves.
        document.getElementById('view-module').hidden = true;
        document.getElementById('view-stats').hidden = true;
        document.getElementById('view-settings').hidden = true;
        document.getElementById('view-path').hidden = true;
        currentModuleId = null;
        switchView(document.getElementById('site-wrap'), document.getElementById('view-title'), 'back');
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

  // Stats and Settings pages (9 Sept 2026, user request — new pages
  // alongside the transition rework above). The topbar's own nav buttons
  // are visible even on the title screen (the topbar is sticky and always
  // rendered), so a click there has to handle both "already inside
  // #site-wrap, just switch which inner view is showing" AND "still on
  // the title screen, need the title->site-wrap transition too" —
  // goToTopLevelPage() below covers both starting points with one
  // function instead of duplicating the same landing logic per button.
  function goToTopLevelPage(target){
    const titleVisible = !document.getElementById('view-title').hidden;
    if(titleVisible){
      document.getElementById('view-path').hidden = true;
      document.getElementById('view-module').hidden = true;
      document.getElementById('view-stats').hidden = (target !== 'stats');
      document.getElementById('view-settings').hidden = (target !== 'settings');
      currentModuleId = null;
      switchView(document.getElementById('view-title'), document.getElementById('site-wrap'), 'fwd');
    } else {
      goToInner(target, 'fwd');
    }
    if(target === 'stats') renderStatsPage();
    if(target === 'settings') renderSettingsPage();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function initTopbarNav(){
    const statsBtn = document.getElementById('nav-stats');
    if(statsBtn) statsBtn.addEventListener('click', () => goToTopLevelPage('stats'));
    const settingsBtn = document.getElementById('nav-settings');
    if(settingsBtn) settingsBtn.addEventListener('click', () => goToTopLevelPage('settings'));
    const backStats = document.getElementById('btn-back-stats');
    if(backStats) backStats.addEventListener('click', () => { goToInner('path', 'back'); window.scrollTo({top:0, behavior:'smooth'}); });
    const backSettings = document.getElementById('btn-back-settings');
    if(backSettings) backSettings.addEventListener('click', () => { goToInner('path', 'back'); window.scrollTo({top:0, behavior:'smooth'}); });
  }

  // Real per-module status/unlock rules live in renderPath() — mirrored
  // here rather than shared via a helper because renderPath's version is
  // entangled with building the DOM nodes themselves, and the stats page
  // only needs the 3 labels (done/available/locked) plus a done/total
  // count, not the node markup.
  function renderStatsPage(){
    const room = document.getElementById('stats-room');
    if(!room) return;
    const lvl = computeLevel(state.xp);
    const doneModules = MODULES.filter(m => m.tasks && m.tasks.every(t => state.completed[t.id])).length;
    const rows = MODULES.map((m, idx) => {
      let status = moduleStatus(m);
      const unlocked = prevModuleDone(idx);
      if(!m.tasks && !unlocked) status = 'locked';
      if(!m.tasks && unlocked) status = 'available';
      const doneCount = m.tasks ? m.tasks.filter(t => state.completed[t.id]).length : 0;
      const totalCount = m.tasks ? m.tasks.length : null;
      const statusLabel = status === 'done' ? tr('statsStatusDone') : (unlocked ? tr('statsStatusAvail') : tr('statsStatusLocked'));
      return `
        <div class="stats-row ${status === 'locked' ? 'locked' : ''}">
          <div class="num">${String(m.num).padStart(2,'0')}</div>
          <div class="body">
            <div class="t">${escapeHtml(mField(m, 'title'))}</div>
            <div class="phase">${phaseName(m.phase)}${totalCount ? ' · ' + tr('chipTasks', {done: doneCount, total: totalCount}) : ''}</div>
          </div>
          <div class="status ${status}">${statusLabel}</div>
        </div>`;
    }).join('');
    room.innerHTML = `
      <div class="room-head"><h2>${tr('statsHeading')}</h2></div>
      <div class="stats-tiles">
        <div class="stats-tile"><div class="k">${tr('statsLevel')}</div><div class="v">LV.${String(lvl).padStart(2,'0')}</div></div>
        <div class="stats-tile"><div class="k">${tr('statsXp')}</div><div class="v">${String(state.xp).padStart(4,'0')}</div></div>
        <div class="stats-tile"><div class="k">${tr('statsStreak')}</div><div class="v">🔥 ${String(state.streak || 0).padStart(2,'0')}</div></div>
        <div class="stats-tile"><div class="k">${tr('statsCleared')}</div><div class="v">${doneModules} / ${MODULES.length}</div></div>
      </div>
      <div class="stats-history-head">${tr('statsHistoryHeading')}</div>
      <div class="stats-history">${rows}</div>`;
  }

  function renderSettingsPage(){
    const room = document.getElementById('settings-room');
    if(!room) return;
    const swatchesHtml = SIGNALS.map(s => `<button type="button" class="settings-sw ${s===getSignal()?'active':''}" data-signal="${s}" style="--c:var(--a-accent)"></button>`).join('');
    room.innerHTML = `
      <div class="room-head"><h2>${tr('settingsHeading')}</h2></div>
      <div class="settings-row">
        <div class="settings-label"><div class="t">${tr('titleSignalColor')}</div><div class="d">${tr('settingsSignalDesc')}</div></div>
        <div class="settings-swatches" id="settings-swatches">${swatchesHtml}</div>
      </div>
      <div class="settings-row">
        <div class="settings-label"><div class="t">${tr('settingsLangLabel')}</div><div class="d">${tr('settingsLangDesc')}</div></div>
        <div class="segbtn" id="settings-langseg">
          <button type="button" data-lang="en" class="${getLang()==='en'?'active':''}">EN</button>
          <button type="button" data-lang="ru" class="${getLang()==='ru'?'active':''}">RU</button>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-label"><div class="t">${tr('settingsResetLabel')}</div><div class="d">${tr('settingsResetDesc')}</div></div>
        <button type="button" class="settings-dangerbtn" id="settings-reset-btn">${tr('settingsResetBtn')}</button>
      </div>`;
    // Real per-color swatch backgrounds — set via inline style rather than
    // baked into a CSS class per signal, same reason SIGNAL_HEX exists
    // nowhere else in the codebase: the 5 hexes already live in exactly one
    // place, the title screen's own swatch markup in index.html, and
    // duplicating them into a lookup table just to color these dots risked
    // the two silently drifting apart on a future palette tweak.
    const SIGNAL_HEX = {mint:'#8ff0a8', amber:'#f2c94c', violet:'#c78ff0', cyan:'#6bc8f0', rose:'#ff6fae'};
    room.querySelectorAll('.settings-sw').forEach(btn => {
      btn.style.background = SIGNAL_HEX[btn.dataset.signal];
      btn.addEventListener('click', () => {
        setSignal(btn.dataset.signal);
        applySignalEverywhere();
        room.querySelectorAll('.settings-sw').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
    room.querySelectorAll('#settings-langseg button').forEach(btn => {
      btn.addEventListener('click', () => {
        if(btn.dataset.lang === getLang()) return;
        setLang(btn.dataset.lang);
        applyLangEverywhere();
        renderSettingsPage();
      });
    });
    const resetBtn = document.getElementById('settings-reset-btn');
    if(resetBtn){
      resetBtn.addEventListener('click', () => {
        if(!window.confirm(tr('settingsResetConfirm'))) return;
        state = {xp:0, completed:{}, streak:0, lastOpen:null};
        persist();
        renderStats();
        renderPath();
        renderSettingsPage();
        updateTitleCta(false);
      });
    }
  }

  function updateTitleCta(hasPriorVisit){
    const cta = document.getElementById('title-cta');
    if(cta){
      cta.dataset.state = hasPriorVisit ? 'continue' : 'new';
      cta.textContent = tr(hasPriorVisit ? 'titleContinue' : 'titleNewGame');
    }
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
    // Zero-padded, arcade-score-style — real values underneath, just
    // formatted the way a HUD counter reads (LV.01, 0090 XP), not truncated.
    document.getElementById('stat-level').textContent = String(lvl).padStart(2,'0');
    document.getElementById('stat-xp').textContent = String(state.xp).padStart(4,'0');
    document.getElementById('xpbar-fill').style.width = levelProgress(state.xp) + '%';
    document.getElementById('stat-streak').textContent = String(state.streak || 0).padStart(2,'0');
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
          <div class="kicker">${tr('phaseLabel')} ${phaseNum}</div>
          <div class="phase-title">${phaseName(m.phase)}</div>
          <div class="phase-sub">${tr('phaseSub', {done: phaseDone[m.phase] || 0, total: phaseTotals[m.phase]})}</div>`;
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
      if(isCurrent) chips.push(`<span class="chip current">${tr('youAreHere')}</span>`);
      if(status === 'done'){
        chips.push(`<span class="chip good">${tr('chipDone')}</span>`);
      } else if(m.tasks){
        chips.push(`<span class="chip">${tr('chipTasks', {done: doneCount, total: totalCount})}</span>`);
      } else if(unlocked){
        chips.push(`<span class="chip">${tr('chipUnlockedSoon')}</span>`);
      } else {
        chips.push(`<span class="chip">${tr('chipLocked')}</span>`);
      }

      // Small preview of the module's own boss creature (renderBossVisual,
      // the per-module generator added 9 September 2026) — the node's own
      // grid column for title/desc/chips left a lot of unused width to its
      // right on wide screens (found in the same feedback round), and "what
      // boss is waiting in this module" is real course content already
      // sitting right there in m.tasks, not a made-up decoration.
      const bossTask = m.tasks && m.tasks.find(x => x.boss);
      const bossPreview = bossTask
        ? `<div class="node-boss${state.completed[bossTask.id] ? ' defeated' : ''}">${renderBossVisual(m.id, !!state.completed[bossTask.id])}</div>`
        : '';

      node.innerHTML = `
        <div class="badge">${status==='done' ? '✓' : (m.checkpoint ? '🎯' : m.num)}</div>
        <div class="node-body">
          <div class="node-kicker">${m.checkpoint ? tr('checkpointLabel') : tr('moduleLabel') + ' ' + m.num}</div>
          <div class="node-title">${mField(m, 'title')}</div>
          <div class="node-desc">${mField(m, 'desc')}</div>
          <div class="node-meta">${chips.join('')}</div>
        </div>
        ${bossPreview}`;

      if(unlocked){
        node.addEventListener('click', () => openModule(m.id));
        node.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModule(m.id);} });
      }
      el.appendChild(node);
    });
  }

  /* ---------------- render: module room ---------------- */

  // Tracked so a language switch while a module is open can re-render THAT
  // module in the new language (openModule() itself always pulls text
  // through tr()/mField()/taskField() at render time — it just needs to be
  // told to run again). Cleared when navigating back to the path.
  let currentModuleId = null;

  // preserveScroll: true when re-rendering the SAME module the visitor is
  // already looking at (a language switch) rather than actually navigating
  // to it — jumping back to the top on every language toggle was reported
  // as annoying, and there's no navigation happening to justify it.
  function openModule(id, preserveScroll){
    currentModuleId = id;
    const m = MODULES.find(x=>x.id===id);
    // preserveScroll is a re-render of the module the visitor is already
    // looking at (a language switch), not real navigation — skip the
    // transition then, goToInner() already no-ops if 'module' is already
    // showing so this only matters for the timing, not correctness.
    if(!preserveScroll){
      goToInner('module', 'fwd');
    } else {
      document.getElementById('view-path').hidden = true;
      document.getElementById('view-module').hidden = false;
    }
    const room = document.getElementById('module-room');

    if(!m.tasks){
      room.innerHTML = `
        <div class="room-head">
          <div class="kicker">${tr('moduleLabel')} ${m.num}</div>
          <h2>${mField(m, 'title')}</h2>
        </div>
        <div class="soon">
          <div class="display">${tr('soonTitle')}</div>
          <p>${tr('soonDesc')}</p>
        </div>`;
      if(!preserveScroll) window.scrollTo({top:0, behavior:'smooth'});
      return;
    }

    let html = `
      <div class="room-head">
        <div class="kicker">${m.checkpoint ? tr('checkpointLabel') : tr('moduleLabel') + ' ' + m.num}</div>
        <h2>${mField(m, 'title')}</h2>
        <div class="room-progress" id="room-progress"></div>
      </div>
      ${renderBriefing(m)}
      <div class="card theory">
        <h3>${tr('theoryHeading')}</h3>
        ${m.theory.map((item, i) => renderTheoryItem(theoryItem(m, i))).join('')}
      </div>`;

    m.tasks.forEach((task, i) => {
      if(task.boss) html += renderBossHeader(task, m);
      html += renderTaskCard(task, m, i, m.tasks.length, tr('taskLabel'));
    });

    if(m.homework && m.homework.length){
      html += `
      <div class="card hw-head">
        <h3>${tr('homeworkHeading')}</h3>
        <p>${tr('homeworkDesc')}</p>
        <div class="room-progress" id="hw-progress"></div>
      </div>`;
      m.homework.forEach((task, i) => {
        html += renderTaskCard(task, m, i, m.homework.length, tr('homeworkLabel'));
      });
    }

    html += `<div class="room-next" id="room-next"></div>`;

    room.innerHTML = html;

    m.tasks.forEach(t => bindTask(room, t, m));
    if(m.homework){ m.homework.forEach(t => bindTask(room, t, m)); }

    updateRoomProgress(m);
    if(!preserveScroll) window.scrollTo({top:0, behavior:'smooth'});
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

  // HUD corner brackets — same span/class shape as .editor-hudframe's, just
  // reused on the outer task card so a task's whole frame reads as one more
  // arcade screen instead of a plain recolored card (see CLAUDE.md → task
  // card visual pass). Pure decoration, absolutely positioned by CSS.
  const TASK_CORNERS = `<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>`;

  function renderTaskCard(t, m, i, total, label){
    const done = !!state.completed[t.id];
    const badge = t.boss ? `<span class="chip boss">${tr('bossFinale')}</span>` : '';
    const title = taskField(t, m, 'title'), goal = taskField(t, m, 'goal'), hint = taskField(t, m, 'hint');
    if(t.kind === 'checklist'){
      const codeBlock = t.starter ? `<pre class="code-preview">${escapeHtml(t.starter)}</pre>` : '';
      return `
      <div class="card task checklist ${done?'done':''}" id="task-${t.id}">
        ${TASK_CORNERS}
        <div class="task-head">
          <span class="task-num">${tr('taskNumOf', {label, i: i+1, total})}</span>
          ${badge}
        </div>
        <div class="task-title">${title}</div>
        <div class="task-goal">${goal}</div>
        ${codeBlock}
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn primary" data-checklist="${t.id}">${done ? tr('done') : tr('markDone')}</button>
          <button class="btn" data-hint="${t.id}">${tr('hintBtn')}</button>
        </div>
        <div class="hint-box" id="hint-${t.id}"><b>${tr('hintPrefix')}</b> ${hint || ''}</div>
        <div class="result" id="res-${t.id}"></div>
      </div>`;
    }
    if(t.kind === 'predict'){
      const offlineBadge = t.offline ? `<span class="chip">${tr('offlineBadge')}</span>` : '';
      return `
      <div class="card task predict ${done?'done':''}" id="task-${t.id}">
        ${TASK_CORNERS}
        <div class="task-head">
          <span class="task-num">${tr('taskNumOf', {label, i: i+1, total})}</span>
          ${badge}${offlineBadge}
        </div>
        <div class="task-title">${title}</div>
        <div class="task-goal">${goal}</div>
        <pre class="code-preview">${escapeHtml(t.code)}</pre>
        <label class="field-label">${tr('predictQuestion')}</label>
        <textarea class="editor" id="guess-${t.id}" spellcheck="false" placeholder="${tr('predictPlaceholder')}"></textarea>
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn primary" data-check="${t.id}">${tr('revealAndCheck')}</button>
          <button class="btn" data-hint="${t.id}">${tr('hintBtn')}</button>
        </div>
        <div class="console" id="console-${t.id}"></div>
        <div class="hint-box" id="hint-${t.id}"><b>${tr('hintPrefix')}</b> ${hint || ''}</div>
        <div class="result" id="res-${t.id}"></div>
      </div>`;
    }
    return `
      <div class="card task ${done?'done':''}" id="task-${t.id}">
        ${TASK_CORNERS}
        <div class="task-head">
          <span class="task-num">${tr('taskNumOf', {label, i: i+1, total})}</span>
          ${badge}
        </div>
        <div class="task-title">${title}</div>
        <div class="task-goal">${goal}</div>
        <div class="editor-hud">
          <div class="editor-hudbar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="editor-hudlabel">${t.id}.py</span>
            <span class="editor-hudlive"><i></i>${tr('editorReady')}</span>
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
          <label class="field-label" for="reason-${t.id}">${taskField(t, m, 'reasonPrompt')}</label>
          <input type="text" class="reason-input" id="reason-${t.id}" placeholder="${tr('reasonPlaceholder')}">
        </div>` : ''}
        <div class="rowbtns" style="margin-top:12px;">
          <button class="btn" data-run="${t.id}">${tr('btnRun')}</button>
          <button class="btn primary" data-check="${t.id}" ${t.reasonPrompt ? 'disabled' : ''}>${tr('btnCheck')}</button>
          <button class="btn" data-hint="${t.id}">${tr('hintBtn')}</button>
          <button class="btn" data-reset="${t.id}">${tr('btnReset')}</button>
        </div>
        <div class="console" id="console-${t.id}"></div>
        <div class="hint-box" id="hint-${t.id}"><b>${tr('hintPrefix')}</b> ${hint || ''}</div>
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
        btn.textContent = tr('done');
        renderStats();
        if(m) updateRoomProgress(m);
        if(t.boss && m){ refreshBossHeader(t, m); showVictory(t, m); }
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
    // gutter/highlight only ever moved in response to the textarea's 'scroll'
    // event, but that event is dispatched on the main thread and can be
    // throttled/coalesced while the user is actively dragging the textarea's
    // own native scrollbar thumb — the textarea itself keeps repainting on
    // the compositor every frame regardless, so gutter/highlight visibly lag
    // behind it during the drag (confirmed by hand, screen-recorded — an
    // event-driven or drag-window-scoped rAF sync both still missed frames).
    // Polling scrollTop unconditionally on every animation frame, for as
    // long as this editor stays in the DOM, removes the dependency on any
    // event firing at all — there's no window where the three can drift.
    // Self-terminates once the task's DOM is torn down (room re-rendered),
    // so it doesn't keep spinning forever for editors nobody can see.
    //
    // Also copies the textarea's own live height onto .editor-wrap every
    // frame — the textarea got resize:vertical, and .editor-wrap's height
    // is what its flex-stretched gutter/highlight actually size against
    // (see the CSS comment on .editor-wrap textarea.editor), so dragging
    // the resize handle needs this to keep them matching, exactly the
    // "if resize is ever added, sync .editor-wrap's height via JS" this
    // codebase already flagged as a future requirement.
    const wrap = editor.closest('.editor-wrap');
    (function pollEditorScroll(){
      if(!editor.isConnected) return;
      const st = editor.scrollTop;
      if(gutter.scrollTop !== st) gutter.scrollTop = st;
      if(hl.scrollTop !== st) hl.scrollTop = st;
      const h = editor.offsetHeight + 'px';
      if(wrap && wrap.style.height !== h) wrap.style.height = h;
      requestAnimationFrame(pollEditorScroll);
    })();
    editor.addEventListener('scroll', () => { if(ac.editor === editor) acPosition(editor); });
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

  // Each line is its own block <div>, not text joined by literal '\n'
  // characters — a real, persistent bug (not the earlier scroll-timing
  // ones): when `code` ends in a newline (or several — a "blank line at
  // the end" is exactly what triggered it), the trailing empty segment
  // from code.split('\n') contributes nothing to a plain text node's
  // rendered height in a few browsers, so the <pre> ends up one full
  // line-height SHORTER than .editor-gutter's plain-text line list (which
  // never has a trailing newline — syncGutter() only inserts '\n' BETWEEN
  // numbers) and the real textarea. No amount of scroll-timing sync fixes
  // that: the two layers disagree on their own scrollHeight, not just on
  // when scrollTop last got copied. A block-level div per line always gets
  // its own line box — including a genuinely empty one — so this can't
  // recur regardless of what the code ends with.
  function renderHighlight(code, errLine){
    return code.split('\n').map((line, i) => {
      const html = highlightLine(line) || '&nbsp;';
      const cls = (errLine && (i + 1) === errLine) ? ' err-line' : '';
      return `<div class="hl-line${cls}">${html}</div>`;
    }).join('');
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
      prog.innerHTML = `<span class="chip${allDone ? ' good' : ''}">${allDone ? '✓ ' : ''}${tr('roomProgressTasks', {done: doneCount, total: totalCount})}</span>`;
    }

    if(m.homework){
      const hwDone = m.homework.filter(t=>state.completed[t.id]).length;
      const hwTotal = m.homework.length;
      const hwEl = document.getElementById('hw-progress');
      if(hwEl){
        const allHw = hwDone === hwTotal;
        hwEl.innerHTML = `<span class="chip${allHw ? ' good' : ''}">${allHw ? '✓ ' : ''}${tr('roomProgressHomework', {done: hwDone, total: hwTotal})}</span>`;
      }
    }

    const nextEl = document.getElementById('room-next');
    if(!nextEl) return;
    if(doneCount === totalCount){
      const next = MODULES[idx+1];
      if(next){
        nextEl.innerHTML = `<button class="btn primary" id="btn-next-module">${tr('nextModule', {title: mField(next, 'title')})}</button>`;
        const btn = document.getElementById('btn-next-module');
        if(btn) btn.addEventListener('click', () => openModule(next.id));
      } else {
        nextEl.innerHTML = `<div class="chip good">${tr('lastModule')}</div>`;
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
    const label = r.ok ? tr('outputLabel') : tr('errorLabel');
    const body = r.ok ? (r.output || tr('emptyOutput')) : (r.output ? r.output + '\n' + r.error : r.error);
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
      resEl.innerHTML = `${tr('codeDidNotRun')}${errorHint(r.pyName, r.error)}`;
      return;
    }

    const result = t.check(r.output);
    resEl.className = 'result show ' + (result.ok ? 'ok' : 'err');
    resEl.innerHTML = result.ok
      ? `${tr('correctTitle')}${tr('correctBody')}`
      : `${tr('notQuiteTitle')}${msgTr(t, m, result.msg)}`;

    if(result.ok){
      markDone(t.id);
      document.getElementById(`task-${t.id}`).classList.add('done');
      renderStats();
      if(m) updateRoomProgress(m);
      if(t.boss && m){ refreshBossHeader(t, m); showVictory(t, m); }
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
        resEl.innerHTML = `${tr('predictBrokenTitle')}${tr('predictBrokenBody')}`;
        return;
      }
      actual = r.output.trim();
    }

    const isMatch = guess === actual;
    resEl.className = 'result show ' + (isMatch ? 'ok' : 'err');
    if(isMatch){
      resEl.innerHTML = `${tr('predictExactTitle')}${tr('predictExactBody')}`;
      markDone(t.id);
      document.getElementById(`task-${t.id}`).classList.add('done');
      renderStats();
      if(m) updateRoomProgress(m);
      if(t.boss && m){ refreshBossHeader(t, m); showVictory(t, m); }
    } else {
      resEl.innerHTML = `${tr('predictWrongTitle')}${tr('predictWrongBody', {actual: escapeHtml(actual).replace(/\n/g,'<br>')})}`;
    }
  }

  /* ---------------- nav ---------------- */

  document.getElementById('btn-back').addEventListener('click', () => {
    currentModuleId = null;
    renderPath();
    goToInner('path', 'back');
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---------------- language switch ---------------- */
  // Static chrome (title screen, path hero, victory labels, topbar HUD
  // labels) is just [data-i18n]/[data-i18n-title] text swapped in place.
  // Dynamic content (path list, an open module's room) is rebuilt by
  // calling its own render function again — every one of those already
  // pulls text through tr()/mField()/taskField() at render time, so
  // calling them again is all a language switch needs, no separate
  // "translate this DOM" step for them.
  function applyLangEverywhere(){
    document.documentElement.lang = getLang();
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = tr(el.dataset.i18nTitle); });
    document.querySelectorAll('.lang-switch .lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === getLang());
    });
    const cta = document.getElementById('title-cta');
    if(cta && cta.dataset.state) cta.textContent = tr(cta.dataset.state === 'continue' ? 'titleContinue' : 'titleNewGame');
    // Character name isn't behind [data-i18n] (it's set from JS, not a
    // static tag) — re-resolve it too so switching language updates
    // "Patch" -> "Патч" without needing to also touch Signal Color.
    const nameEl = document.getElementById('character-name');
    if(nameEl) nameEl.textContent = tr(CHARACTER_KEYS[getSignal()] || CHARACTER_KEYS.mint);
    if(!document.getElementById('view-path').hidden) renderPath();
    if(currentModuleId && !document.getElementById('view-module').hidden) openModule(currentModuleId, true);
    if(!document.getElementById('view-stats').hidden) renderStatsPage();
    if(!document.getElementById('view-settings').hidden) renderSettingsPage();
  }

  function initLangSwitch(){
    document.querySelectorAll('.lang-switch .lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if(btn.dataset.lang === getLang()) return;
        setLang(btn.dataset.lang);
        applyLangEverywhere();
      });
    });
    applyLangEverywhere();
  }

  initLangSwitch();
  initTitleScreen();
  initTopbarNav();
  initState();
})();
