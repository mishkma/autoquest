/* AutoQuest — встроенный Python-движок (подмножество, без Pyodide). */

/* Минимальный учебный интерпретатор подмножества Python — работает целиком в
   браузере, без установки и без сетевых запросов. Поддерживает: переменные,
   числа (int/float), строки и f-строки, арифметику, сравнения, and/or/not,
   if/elif/else, while, for..in range()/list, списки, словари (базово),
   функции def/return, print(), len(), range(), базовые методы списков. */

function runPython(src, opts) {
  opts = opts || {};
  const maxSteps = opts.maxSteps || 200000;
  const out = [];
  try {
    const tokens = tokenize(src);
    const ast = parseProgram(tokens);
    const env = newEnv(null);
    let steps = 0;
    function tick() {
      steps++;
      if (steps > maxSteps) {
        const e = new Error('Похоже на бесконечный цикл — выполнение остановлено.');
        e.pyName = 'RuntimeError';
        throw e;
      }
    }
    execBlock(ast.body, env, out, tick);
    return { ok: true, output: out.join('\n') };
  } catch (e) {
    if (e && e.__control) {
      return { ok: false, output: out.join('\n'), error: 'return/break/continue вне цикла или функции', pyName:'SyntaxError' };
    }
    const msg = (e && e.message) || String(e);
    let pyLine = e && e.pyLine;
    if (pyLine === undefined) {
      const lm = /строка (\d+)/.exec(msg);
      if (lm) pyLine = parseInt(lm[1], 10);
    }
    return { ok: false, output: out.join('\n'), error: msg, pyName: (e && e.pyName) || 'Error', pyLine };
  }
}

/* ---------------- lexer ---------------- */

const KEYWORDS = new Set(['if','elif','else','while','for','in','def','return',
  'break','continue','pass','True','False','None','and','or','not']);

function stripComment(line) {
  let inStr = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
    } else {
      if (c === '"' || c === "'") inStr = c;
      else if (c === '#') return line.slice(0, i);
    }
  }
  return line;
}

function tokenizeLine(text, lineNo) {
  const toks = [];
  let i = 0;
  const n = text.length;
  const OPS3 = ['**=', '//='];
  const OPS2 = ['==', '!=', '<=', '>=', '//', '**', '+=', '-=', '*=', '/=', '%='];
  while (i < n) {
    const c = text[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (/[0-9]/.test(c)) {
      let j = i; let isFloat = false;
      while (j < n && /[0-9]/.test(text[j])) j++;
      if (text[j] === '.' && /[0-9]/.test(text[j+1] || '')) { isFloat = true; j++; while (j < n && /[0-9]/.test(text[j])) j++; }
      toks.push({ t: 'NUMBER', v: text.slice(i, j), float: isFloat, line: lineNo });
      i = j; continue;
    }
    if (c === '"' || c === "'" || ((c === 'f' || c === 'F') && (text[i+1] === '"' || text[i+1] === "'"))) {
      let isF = false, j = i;
      if (c === 'f' || c === 'F') { isF = true; j++; }
      const quote = text[j]; j++;
      let s = '';
      while (j < n && text[j] !== quote) {
        if (text[j] === '\\') {
          const nx = text[j+1];
          if (nx === 'n') s += '\n';
          else if (nx === 't') s += '\t';
          else if (nx === quote) s += quote;
          else if (nx === '\\') s += '\\';
          else s += nx;
          j += 2;
        } else { s += text[j]; j++; }
      }
      j++; // closing quote
      toks.push({ t: isF ? 'FSTRING' : 'STRING', v: s, line: lineNo });
      i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(text[j])) j++;
      const word = text.slice(i, j);
      toks.push({ t: KEYWORDS.has(word) ? 'KW' : 'NAME', v: word, line: lineNo });
      i = j; continue;
    }
    const three = text.slice(i, i+3);
    if (OPS3.includes(three)) { toks.push({ t:'OP', v: three, line: lineNo }); i += 3; continue; }
    const two = text.slice(i, i+2);
    if (OPS2.includes(two)) { toks.push({ t: 'OP', v: two, line: lineNo }); i += 2; continue; }
    if ('+-*/%=<>()[]{},:.'.includes(c)) { toks.push({ t: 'OP', v: c, line: lineNo }); i++; continue; }
    const e = new Error(`Не понимаю символ "${c}" в строке ${lineNo}.`);
    e.pyName = 'SyntaxError';
    throw e;
  }
  return toks;
}

function tokenize(src) {
  const lines = src.replace(/\t/g, '    ').split(/\r\n|\n/);
  const tokens = [];
  const indentStack = [0];
  for (let ln = 0; ln < lines.length; ln++) {
    let raw = lines[ln];
    const codeOnly = stripComment(raw);
    if (codeOnly.trim() === '') continue; // blank or comment-only line
    const indent = codeOnly.match(/^ */)[0].length;
    const body = codeOnly.slice(indent);
    if (indent > indentStack[indentStack.length - 1]) {
      indentStack.push(indent);
      tokens.push({ t: 'INDENT', line: ln + 1 });
    } else if (indent < indentStack[indentStack.length - 1]) {
      while (indentStack.length && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        tokens.push({ t: 'DEDENT', line: ln + 1 });
      }
      if (indentStack[indentStack.length - 1] !== indent) {
        const e = new Error(`Неровный отступ в строке ${ln + 1}.`);
        e.pyName = 'IndentationError';
        throw e;
      }
    }
    const lineToks = tokenizeLine(body, ln + 1);
    tokens.push(...lineToks);
    tokens.push({ t: 'NEWLINE', line: ln + 1 });
  }
  while (indentStack.length > 1) { indentStack.pop(); tokens.push({ t: 'DEDENT', line: lines.length }); }
  tokens.push({ t: 'END', line: lines.length });
  return tokens;
}

/* ---------------- parser ---------------- */

function parseProgram(tokens) {
  const p = { toks: tokens, i: 0 };
  const body = parseStatements(p, () => peek(p).t === 'END');
  return { body };
}

function peek(p, o) { return p.toks[p.i + (o || 0)]; }
function advance(p) { return p.toks[p.i++]; }
function check(p, t, v) { const tok = peek(p); return tok.t === t && (v === undefined || tok.v === v); }
function expect(p, t, v) {
  const tok = peek(p);
  if (!check(p, t, v)) {
    const e = new Error(`Ожидалось "${v || t}", а встретилось "${tok.v || tok.t}" (строка ${tok.line}).`);
    e.pyName = 'SyntaxError';
    throw e;
  }
  return advance(p);
}

function skipNewlines(p) { while (check(p, 'NEWLINE')) advance(p); }

function parseStatements(p, stop) {
  const stmts = [];
  skipNewlines(p);
  while (!stop()) {
    stmts.push(parseStatement(p));
    skipNewlines(p);
  }
  return stmts;
}

function parseBlock(p) {
  expect(p, 'OP', ':');
  expect(p, 'NEWLINE');
  skipNewlines(p);
  expect(p, 'INDENT');
  const stmts = parseStatements(p, () => check(p, 'DEDENT') || check(p, 'END'));
  if (check(p, 'DEDENT')) advance(p);
  return stmts;
}

function parseStatement(p) {
  const __line = peek(p).line;
  const __node = parseStatementInner(p);
  if (__node && __node.line === undefined) __node.line = __line;
  return __node;
}

function parseStatementInner(p) {
  const tok = peek(p);
  if (tok.t === 'KW') {
    switch (tok.v) {
      case 'if': return parseIf(p);
      case 'while': return parseWhile(p);
      case 'for': return parseFor(p);
      case 'def': return parseDef(p);
      case 'return': { advance(p); let e = null; if (!check(p,'NEWLINE')) e = parseExpr(p); expect(p,'NEWLINE'); return { type:'Return', value:e }; }
      case 'break': advance(p); expect(p,'NEWLINE'); return { type:'Break' };
      case 'continue': advance(p); expect(p,'NEWLINE'); return { type:'Continue' };
      case 'pass': advance(p); expect(p,'NEWLINE'); return { type:'Pass' };
    }
  }
  return parseSimpleStatement(p);
}

function parseIf(p) {
  advance(p);
  const cond = parseExpr(p);
  const body = parseBlock(p);
  const branches = [{ cond, body }];
  let elseBody = [];
  while (check(p, 'KW', 'elif')) {
    advance(p);
    const c2 = parseExpr(p);
    const b2 = parseBlock(p);
    branches.push({ cond: c2, body: b2 });
  }
  if (check(p, 'KW', 'else')) {
    advance(p);
    elseBody = parseBlock(p);
  }
  return { type: 'If', branches, elseBody };
}

function parseWhile(p) {
  advance(p);
  const cond = parseExpr(p);
  const body = parseBlock(p);
  return { type: 'While', cond, body };
}

function parseFor(p) {
  advance(p);
  const name = expect(p, 'NAME').v;
  expect(p, 'KW', 'in');
  const iter = parseExpr(p);
  const body = parseBlock(p);
  return { type: 'For', name, iter, body };
}

function parseDef(p) {
  advance(p);
  const name = expect(p, 'NAME').v;
  expect(p, 'OP', '(');
  const params = [];
  while (!check(p, 'OP', ')')) {
    params.push(expect(p, 'NAME').v);
    if (check(p, 'OP', ',')) advance(p); else break;
  }
  expect(p, 'OP', ')');
  const body = parseBlock(p);
  return { type: 'FuncDef', name, params, body };
}

const AUG = { '+=':'+', '-=':'-', '*=':'*', '/=':'/', '%=':'%', '//=':'//', '**=':'**' };

function parseSimpleStatement(p) {
  const expr = parseExpr(p);
  if (check(p, 'OP', '=')) {
    advance(p);
    const value = parseExpr(p);
    expect(p, 'NEWLINE');
    return { type: 'Assign', target: expr, value };
  }
  if (peek(p).t === 'OP' && AUG[peek(p).v]) {
    const op = AUG[advance(p).v];
    const value = parseExpr(p);
    expect(p, 'NEWLINE');
    return { type: 'Assign', target: expr, value: { type:'BinOp', op, left: expr, right: value } };
  }
  expect(p, 'NEWLINE');
  return { type: 'ExprStmt', expr };
}

/* expressions, precedence climbing */
function parseExpr(p) { return parseOr(p); }
function parseOr(p) {
  let left = parseAnd(p);
  while (check(p, 'KW', 'or')) { advance(p); const right = parseAnd(p); left = { type:'BoolOp', op:'or', left, right }; }
  return left;
}
function parseAnd(p) {
  let left = parseNot(p);
  while (check(p, 'KW', 'and')) { advance(p); const right = parseNot(p); left = { type:'BoolOp', op:'and', left, right }; }
  return left;
}
function parseNot(p) {
  if (check(p, 'KW', 'not')) { advance(p); const operand = parseNot(p); return { type:'UnaryOp', op:'not', operand }; }
  return parseCompare(p);
}
const CMP_OPS = ['==','!=','<','>','<=','>='];
function parseCompare(p) {
  let left = parseArith(p);
  while (peek(p).t === 'OP' && CMP_OPS.includes(peek(p).v)) {
    const op = advance(p).v;
    const right = parseArith(p);
    left = { type:'Compare', op, left, right };
  }
  return left;
}
function parseArith(p) {
  let left = parseTerm(p);
  while (peek(p).t === 'OP' && (peek(p).v === '+' || peek(p).v === '-')) {
    const op = advance(p).v;
    const right = parseTerm(p);
    left = { type:'BinOp', op, left, right };
  }
  return left;
}
function parseTerm(p) {
  let left = parseUnary(p);
  while (peek(p).t === 'OP' && ['*','/','//','%'].includes(peek(p).v)) {
    const op = advance(p).v;
    const right = parseUnary(p);
    left = { type:'BinOp', op, left, right };
  }
  return left;
}
function parseUnary(p) {
  if (peek(p).t === 'OP' && (peek(p).v === '-' || peek(p).v === '+')) {
    const op = advance(p).v;
    const operand = parseUnary(p);
    return { type:'UnaryOp', op, operand };
  }
  return parsePower(p);
}
function parsePower(p) {
  const base = parsePostfix(p);
  if (check(p, 'OP', '**')) { advance(p); const exp = parseUnary(p); return { type:'BinOp', op:'**', left: base, right: exp }; }
  return base;
}
function parsePostfix(p) {
  let node = parsePrimary(p);
  for (;;) {
    if (check(p, 'OP', '(')) {
      advance(p);
      const args = [];
      while (!check(p, 'OP', ')')) {
        args.push(parseExpr(p));
        if (check(p, 'OP', ',')) advance(p); else break;
      }
      expect(p, 'OP', ')');
      node = { type: 'Call', callee: node, args };
    } else if (check(p, 'OP', '[')) {
      advance(p);
      const index = parseExpr(p);
      expect(p, 'OP', ']');
      node = { type: 'Index', obj: node, index };
    } else if (check(p, 'OP', '.')) {
      advance(p);
      const name = expect(p, 'NAME').v;
      node = { type: 'Attr', obj: node, name };
    } else break;
  }
  return node;
}
function parsePrimary(p) {
  const tok = peek(p);
  if (tok.t === 'NUMBER') { advance(p); return { type:'Num', value: parseFloat(tok.v), isFloat: tok.float }; }
  if (tok.t === 'STRING') { advance(p); return { type:'Str', value: tok.v }; }
  if (tok.t === 'FSTRING') { advance(p); return { type:'FStr', parts: parseFStringParts(tok.v, tok.line) }; }
  if (tok.t === 'KW' && tok.v === 'True') { advance(p); return { type:'Bool', value:true }; }
  if (tok.t === 'KW' && tok.v === 'False') { advance(p); return { type:'Bool', value:false }; }
  if (tok.t === 'KW' && tok.v === 'None') { advance(p); return { type:'None' }; }
  if (tok.t === 'NAME') { advance(p); return { type:'Name', name: tok.v }; }
  if (check(p, 'OP', '(')) {
    advance(p);
    const e = parseExpr(p);
    expect(p, 'OP', ')');
    return e;
  }
  if (check(p, 'OP', '[')) {
    advance(p);
    const items = [];
    while (!check(p, 'OP', ']')) {
      items.push(parseExpr(p));
      if (check(p, 'OP', ',')) advance(p); else break;
    }
    expect(p, 'OP', ']');
    return { type:'ListLit', items };
  }
  if (check(p, 'OP', '{')) {
    advance(p);
    const pairs = [];
    while (!check(p, 'OP', '}')) {
      const k = parseExpr(p);
      expect(p, 'OP', ':');
      const v = parseExpr(p);
      pairs.push([k, v]);
      if (check(p, 'OP', ',')) advance(p); else break;
    }
    expect(p, 'OP', '}');
    return { type:'DictLit', pairs };
  }
  const e = new Error(`Не понимаю выражение возле "${tok.v || tok.t}" (строка ${tok.line}).`);
  e.pyName = 'SyntaxError';
  throw e;
}

function parseFStringParts(raw, line) {
  const parts = [];
  let i = 0, buf = '';
  while (i < raw.length) {
    if (raw[i] === '{' && raw[i+1] !== '{') {
      if (buf) { parts.push({ lit: buf }); buf = ''; }
      let depth = 1, j = i + 1, exprSrc = '';
      while (j < raw.length && depth > 0) {
        if (raw[j] === '{') depth++;
        else if (raw[j] === '}') { depth--; if (depth === 0) break; }
        exprSrc += raw[j]; j++;
      }
      let spec = null;
      const colon = exprSrc.indexOf(':');
      if (colon >= 0) { spec = exprSrc.slice(colon+1); exprSrc = exprSrc.slice(0, colon); }
      const toks = tokenizeLine(exprSrc, line);
      toks.push({ t:'NEWLINE', line }); toks.push({ t:'END', line });
      const sub = { toks, i: 0 };
      const exprAst = parseExpr(sub);
      parts.push({ expr: exprAst, spec });
      i = j + 1;
    } else if (raw[i] === '{' && raw[i+1] === '{') { buf += '{'; i += 2; }
    else if (raw[i] === '}' && raw[i+1] === '}') { buf += '}'; i += 2; }
    else { buf += raw[i]; i++; }
  }
  if (buf) parts.push({ lit: buf });
  return parts;
}

/* ---------------- runtime values ---------------- */

class PyFloat { constructor(v) { this.v = v; } }
function mkFloat(v) { return new PyFloat(v); }
function isFloatVal(v) { return v instanceof PyFloat; }
function numOf(v) { return isFloatVal(v) ? v.v : v; }

class PyList { constructor(items) { this.items = items; } }
class PyDict { constructor() { this.map = new Map(); } }
class PyFunc { constructor(name, params, body, closure) { this.name=name; this.params=params; this.body=body; this.closure=closure; } }

function pyStr(v) {
  if (v === null || v === undefined) return 'None';
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (isFloatVal(v)) return Number.isInteger(v.v) ? v.v.toFixed(1) : String(v.v);
  if (v instanceof PyList) return '[' + v.items.map(pyRepr).join(', ') + ']';
  if (v instanceof PyDict) {
    const parts = [];
    for (const [k, val] of v.map.entries()) parts.push(`${pyRepr(k)}: ${pyRepr(val)}`);
    return '{' + parts.join(', ') + '}';
  }
  if (v instanceof PyFunc) return `<function ${v.name}>`;
  return String(v);
}
function pyRepr(v) {
  if (typeof v === 'string') return `'${v}'`;
  return pyStr(v);
}
function truthy(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (isFloatVal(v)) return v.v !== 0;
  if (typeof v === 'string') return v.length > 0;
  if (v instanceof PyList) return v.items.length > 0;
  if (v instanceof PyDict) return v.map.size > 0;
  return true;
}

/* ---------------- environment ---------------- */

function newEnv(parent) { return { vars: Object.create(null), parent }; }
function envGet(env, name) {
  let e = env;
  while (e) { if (name in e.vars) return e.vars[name]; e = e.parent; }
  const err = new Error(`Переменная или имя "${name}" не определены (NameError).`);
  err.pyName = 'NameError';
  throw err;
}
function envSet(env, name, value) { env.vars[name] = value; }

/* ---------------- control-flow signals ---------------- */

class ReturnSignal { constructor(value) { this.value = value; this.__control = true; } }
class BreakSignal { constructor() { this.__control = true; } }
class ContinueSignal { constructor() { this.__control = true; } }

/* ---------------- executor ---------------- */

function execBlock(stmts, env, out, tick) {
  for (const s of stmts) execStmt(s, env, out, tick);
}

function execStmt(s, env, out, tick) {
  tick();
  try {
    return execStmtInner(s, env, out, tick);
  } catch (e) {
    if (e && !e.__control && e.pyLine === undefined) e.pyLine = s.line;
    throw e;
  }
}

function execStmtInner(s, env, out, tick) {
  switch (s.type) {
    case 'ExprStmt': evalExpr(s.expr, env, out, tick); return;
    case 'Pass': return;
    case 'Assign': {
      const val = evalExpr(s.value, env, out, tick);
      assignTo(s.target, val, env, out, tick);
      return;
    }
    case 'If': {
      for (const br of s.branches) {
        if (truthy(evalExpr(br.cond, env, out, tick))) { execBlock(br.body, env, out, tick); return; }
      }
      execBlock(s.elseBody, env, out, tick);
      return;
    }
    case 'While': {
      while (truthy(evalExpr(s.cond, env, out, tick))) {
        try { execBlock(s.body, env, out, tick); }
        catch (e) { if (e instanceof BreakSignal) break; if (e instanceof ContinueSignal) continue; throw e; }
        tick();
      }
      return;
    }
    case 'For': {
      const iter = evalExpr(s.iter, env, out, tick);
      const items = iterToArray(iter);
      for (const it of items) {
        envSet(env, s.name, it);
        try { execBlock(s.body, env, out, tick); }
        catch (e) { if (e instanceof BreakSignal) break; if (e instanceof ContinueSignal) continue; throw e; }
        tick();
      }
      return;
    }
    case 'FuncDef': envSet(env, s.name, new PyFunc(s.name, s.params, s.body, env)); return;
    case 'Return': throw new ReturnSignal(s.value ? evalExpr(s.value, env, out, tick) : null);
    case 'Break': throw new BreakSignal();
    case 'Continue': throw new ContinueSignal();
    default: { const e = new Error(`Неизвестная конструкция: ${s.type}`); e.pyName='SyntaxError'; throw e; }
  }
}

function iterToArray(v) {
  if (Array.isArray(v)) return v;
  if (v instanceof PyList) return v.items;
  if (typeof v === 'string') return v.split('');
  if (v instanceof PyDict) return Array.from(v.map.keys());
  const e = new Error('Это значение нельзя перебрать в цикле for (TypeError).');
  e.pyName = 'TypeError';
  throw e;
}

function assignTo(target, val, env, out, tick) {
  if (target.type === 'Name') { envSet(env, target.name, val); return; }
  if (target.type === 'Index') {
    const obj = evalExpr(target.obj, env, out, tick);
    const idx = evalExpr(target.index, env, out, tick);
    if (obj instanceof PyList) { obj.items[numOf(idx)] = val; return; }
    if (obj instanceof PyDict) { obj.map.set(keyOf(idx), val); return; }
  }
  const e = new Error('В это выражение нельзя присвоить значение (SyntaxError).');
  e.pyName = 'SyntaxError';
  throw e;
}

function keyOf(v) { return typeof v === 'object' ? pyStr(v) : v; }

function evalExpr(node, env, out, tick) {
  tick();
  switch (node.type) {
    case 'Num': return node.isFloat ? mkFloat(node.value) : node.value;
    case 'Str': return node.value;
    case 'Bool': return node.value;
    case 'None': return null;
    case 'Name': return envGet(env, node.name);
    case 'FStr': {
      let s = '';
      for (const part of node.parts) {
        if ('lit' in part) s += part.lit;
        else s += pyStr(evalExpr(part.expr, env, out, tick));
      }
      return s;
    }
    case 'ListLit': return new PyList(node.items.map(it => evalExpr(it, env, out, tick)));
    case 'DictLit': { const d = new PyDict(); for (const [k, v] of node.pairs) d.map.set(keyOf(evalExpr(k, env, out, tick)), evalExpr(v, env, out, tick)); return d; }
    case 'UnaryOp': {
      if (node.op === 'not') return !truthy(evalExpr(node.operand, env, out, tick));
      const v = evalExpr(node.operand, env, out, tick);
      const n = numOf(v);
      const r = node.op === '-' ? -n : n;
      return isFloatVal(v) ? mkFloat(r) : r;
    }
    case 'BoolOp': {
      const l = evalExpr(node.left, env, out, tick);
      if (node.op === 'and') return truthy(l) ? evalExpr(node.right, env, out, tick) : l;
      return truthy(l) ? l : evalExpr(node.right, env, out, tick);
    }
    case 'Compare': {
      const l = evalExpr(node.left, env, out, tick), r = evalExpr(node.right, env, out, tick);
      return compareVals(node.op, l, r);
    }
    case 'BinOp': return binOp(node.op, evalExpr(node.left, env, out, tick), evalExpr(node.right, env, out, tick));
    case 'Call': return doCall(node, env, out, tick);
    case 'Index': {
      const obj = evalExpr(node.obj, env, out, tick);
      const idx = evalExpr(node.index, env, out, tick);
      return doIndex(obj, idx);
    }
    case 'Attr': {
      const obj = evalExpr(node.obj, env, out, tick);
      return { __bound: true, obj, name: node.name };
    }
    default: { const e = new Error(`Не умею вычислять: ${node.type}`); e.pyName='SyntaxError'; throw e; }
  }
}

function doIndex(obj, idx) {
  if (obj instanceof PyList) {
    let i = numOf(idx);
    if (i < 0) i += obj.items.length;
    if (i < 0 || i >= obj.items.length) { const e = new Error('Индекс списка выходит за границы (IndexError).'); e.pyName='IndexError'; throw e; }
    return obj.items[i];
  }
  if (typeof obj === 'string') {
    let i = numOf(idx);
    if (i < 0) i += obj.length;
    if (i < 0 || i >= obj.length) { const e = new Error('Индекс строки выходит за границы (IndexError).'); e.pyName='IndexError'; throw e; }
    return obj[i];
  }
  if (obj instanceof PyDict) {
    const k = keyOf(idx);
    if (!obj.map.has(k)) { const e = new Error(`Такого ключа нет в словаре (KeyError: ${pyRepr(idx)}).`); e.pyName='KeyError'; throw e; }
    return obj.map.get(k);
  }
  const e = new Error('К этому значению нельзя обратиться по индексу (TypeError).'); e.pyName='TypeError'; throw e;
}

function compareVals(op, l, r) {
  const a = isFloatVal(l) || typeof l === 'number' ? numOf(l) : l;
  const b = isFloatVal(r) || typeof r === 'number' ? numOf(r) : r;
  switch (op) {
    case '==': return a === b;
    case '!=': return a !== b;
    case '<': return a < b;
    case '>': return a > b;
    case '<=': return a <= b;
    case '>=': return a >= b;
  }
}

function binOp(op, l, r) {
  if (typeof l === 'string' && op === '+') {
    if (typeof r !== 'string') { const e = new Error('Нельзя сложить строку и не-строку напрямую (TypeError). Попробуй f-строку.'); e.pyName='TypeError'; throw e; }
    return l + r;
  }
  if (typeof l === 'string' && op === '*' && typeof numOf(r) === 'number') return l.repeat(numOf(r));
  const lf = isFloatVal(l), rf = isFloatVal(r);
  if ((typeof l !== 'number' && !lf) || (typeof r !== 'number' && !rf)) {
    const e = new Error(`Операция "${op}" не поддерживается для этих типов значений (TypeError).`);
    e.pyName = 'TypeError';
    throw e;
  }
  const a = numOf(l), b = numOf(r);
  const resultFloat = lf || rf || op === '/';
  let res;
  switch (op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '**': res = Math.pow(a, b); break;
    case '/': if (b === 0) { const e = new Error('Деление на ноль (ZeroDivisionError).'); e.pyName='ZeroDivisionError'; throw e; } res = a / b; break;
    case '//': if (b === 0) { const e = new Error('Деление на ноль (ZeroDivisionError).'); e.pyName='ZeroDivisionError'; throw e; } res = Math.floor(a / b); break;
    case '%': if (b === 0) { const e = new Error('Деление на ноль (ZeroDivisionError).'); e.pyName='ZeroDivisionError'; throw e; } res = ((a % b) + b) % b; break;
    default: { const e = new Error(`Неизвестный оператор "${op}".`); e.pyName='SyntaxError'; throw e; }
  }
  return resultFloat ? mkFloat(res) : res;
}

function doCall(node, env, out, tick) {
  const args = node.args.map(a => evalExpr(a, env, out, tick));
  const callee = node.callee;
  if (callee.type === 'Attr') {
    const target = evalExpr(callee.obj, env, out, tick);
    return callMethod(target, callee.name, args);
  }
  if (callee.type === 'Name') {
    const name = callee.name;
    if (BUILTINS[name]) return BUILTINS[name](args, out);
    const fn = envGet(env, name);
    if (fn instanceof PyFunc) return callFunc(fn, args, out, tick);
    const e = new Error(`"${name}" не является функцией (TypeError).`);
    e.pyName = 'TypeError';
    throw e;
  }
  const e = new Error('Это выражение нельзя вызвать как функцию (TypeError).');
  e.pyName = 'TypeError';
  throw e;
}

function callFunc(fn, args, out, tick) {
  const local = newEnv(fn.closure);
  fn.params.forEach((p, idx) => { local.vars[p] = idx < args.length ? args[idx] : null; });
  try { execBlock(fn.body, local, out, tick); }
  catch (e) { if (e instanceof ReturnSignal) return e.value; throw e; }
  return null;
}

function callMethod(target, name, args) {
  if (target instanceof PyList) {
    if (name === 'append') { target.items.push(args[0]); return null; }
    if (name === 'pop') { return target.items.pop(); }
    if (name === 'sort') { target.items.sort((a,b)=> numOf(a)-numOf(b)); return null; }
    if (name === 'reverse') { target.items.reverse(); return null; }
  }
  if (target instanceof PyDict) {
    if (name === 'get') { const k = keyOf(args[0]); return target.map.has(k) ? target.map.get(k) : (args[1] !== undefined ? args[1] : null); }
    if (name === 'keys') { return new PyList(Array.from(target.map.keys())); }
    if (name === 'values') { return new PyList(Array.from(target.map.values())); }
  }
  if (typeof target === 'string') {
    if (name === 'upper') return target.toUpperCase();
    if (name === 'lower') return target.toLowerCase();
    if (name === 'strip') return target.trim();
    if (name === 'split') return new PyList(target.split(args.length ? args[0] : /\s+/).filter(x=>x.length));
    if (name === 'replace') return target.split(args[0]).join(args[1]);
  }
  const e = new Error(`Метод "${name}" не поддерживается в этой песочнице (AttributeError).`);
  e.pyName = 'AttributeError';
  throw e;
}

const BUILTINS = {
  print: (args, out) => { out.push(args.map(pyStr).join(' ')); return null; },
  len: (args) => { const v = args[0]; if (v instanceof PyList) return v.items.length; if (typeof v === 'string') return v.length; if (v instanceof PyDict) return v.map.size; const e=new Error('У этого значения нет длины (TypeError).'); e.pyName='TypeError'; throw e; },
  range: (args) => {
    let start = 0, stop, step = 1;
    const nums = args.map(numOf);
    if (nums.length === 1) stop = nums[0];
    else if (nums.length === 2) { start = nums[0]; stop = nums[1]; }
    else { start = nums[0]; stop = nums[1]; step = nums[2]; }
    const res = [];
    if (step > 0) for (let i = start; i < stop; i += step) res.push(i);
    else for (let i = start; i > stop; i += step) res.push(i);
    return res;
  },
  int: (args) => { const v = args[0]; if (typeof v === 'string') { const n = parseInt(v,10); if (Number.isNaN(n)) { const e=new Error(`Не могу превратить "${v}" в число (ValueError).`); e.pyName='ValueError'; throw e;} return n;} return Math.trunc(numOf(v)); },
  float: (args) => { const v = args[0]; if (typeof v === 'string') { const n = parseFloat(v); if (Number.isNaN(n)) { const e=new Error(`Не могу превратить "${v}" в число (ValueError).`); e.pyName='ValueError'; throw e;} return mkFloat(n);} return mkFloat(numOf(v)); },
  str: (args) => pyStr(args[0]),
  abs: (args) => { const v = args[0]; const r = Math.abs(numOf(v)); return isFloatVal(v) ? mkFloat(r) : r; },
  round: (args) => Math.round(numOf(args[0])),
  sum: (args) => { const items = iterToArray(args[0]); let s=0, fl=false; for (const it of items){ if(isFloatVal(it)) fl=true; s+=numOf(it);} return fl?mkFloat(s):s; },
  min: (args) => { const items = args.length===1 ? iterToArray(args[0]) : args; return items.reduce((a,b)=> numOf(b)<numOf(a)?b:a); },
  max: (args) => { const items = args.length===1 ? iterToArray(args[0]) : args; return items.reduce((a,b)=> numOf(b)>numOf(a)?b:a); },
};
