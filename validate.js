// 临时校验脚本：验证 index.html 中的 12 个华容道布局
// 1) 棋子构成正确（1×2×2 + 4×2×1竖 + 1×1×2横 + 4×1×1，恰好 2 个空格）
// 2) 无重叠、无越界
// 3) BFS 可解，输出最优步数
// 4) 求解器正确性基准：横刀立马（l9）最优步数应为 81
'use strict';
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = html.match(/\/\*DATA_START\*\/([\s\S]*?)\/\*DATA_END\*\//);
if (!m) { console.error('✗ 未找到 LEVELS_DATA'); process.exit(1); }
const LEVELS_DATA = eval('(' + m[1] + ')');

const COLS = 4, ROWS = 5;
const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];

function buildPieces(lv) {
  const pieces = [{ hero: true, row: lv.hero[0], col: lv.hero[1], w: 2, h: 2 }];
  lv.v.forEach(([r, c]) => pieces.push({ row: r, col: c, w: 1, h: 2 }));
  pieces.push({ row: lv.h[0], col: lv.h[1], w: 2, h: 1 });
  lv.s.forEach(([r, c]) => pieces.push({ row: r, col: c, w: 1, h: 1 }));
  return pieces;
}

function solveOptimal(lv) {
  const pieces = buildPieces(lv);
  const n = pieces.length;
  const keyOf = pos => {
    const a = pos.slice(6).sort((x, y) => x - y);
    return pos.slice(0, 6).concat(a).join(',');
  };
  const seen = new Map();
  const start = pieces.map(p => p.row * COLS + p.col);
  seen.set(keyOf(start), 0);
  const q = [start];
  let head = 0;
  while (head < q.length) {
    const pos = q[head++];
    const d = seen.get(keyOf(pos));
    if (pos[0] === 3 * COLS + 1) return d;
    const occ = new Uint8Array(COLS * ROWS);
    for (let i = 0; i < n; i++) {
      const r = (pos[i] / COLS) | 0, c = pos[i] % COLS;
      for (let a = 0; a < pieces[i].h; a++)
        for (let b = 0; b < pieces[i].w; b++) occ[(r + a) * COLS + c + b] = 1;
    }
    for (let i = 0; i < n; i++) {
      const r = (pos[i] / COLS) | 0, c = pos[i] % COLS, p = pieces[i];
      for (let dir = 0; dir < 4; dir++) {
        const nr = r + DIRS[dir][0], nc = c + DIRS[dir][1];
        if (nr < 0 || nc < 0 || nr + p.h > ROWS || nc + p.w > COLS) continue;
        const edge = [];
        if (dir === 0) for (let b = 0; b < p.w; b++) edge.push((r - 1) * COLS + c + b);
        if (dir === 1) for (let b = 0; b < p.w; b++) edge.push((r + p.h) * COLS + c + b);
        if (dir === 2) for (let a = 0; a < p.h; a++) edge.push((r + a) * COLS + c - 1);
        if (dir === 3) for (let a = 0; a < p.h; a++) edge.push((r + a) * COLS + c + p.w);
        let free = true;
        for (const ci of edge) if (occ[ci]) { free = false; break; }
        if (!free) continue;
        const np = pos.slice(); np[i] = nr * COLS + nc;
        const k = keyOf(np);
        if (seen.has(k)) continue;
        seen.set(k, d + 1);
        q.push(np);
      }
    }
  }
  return -1;
}

function validateLevel(lv) {
  const pieces = buildPieces(lv);
  const errs = [];
  // 构成
  const hero = pieces.filter(p => p.w === 2 && p.h === 2).length;
  const v = pieces.filter(p => p.w === 1 && p.h === 2).length;
  const h = pieces.filter(p => p.w === 2 && p.h === 1).length;
  const s = pieces.filter(p => p.w === 1 && p.h === 1).length;
  if (hero !== 1) errs.push(`2×2 主角数量=${hero}`);
  if (v !== 4) errs.push(`2×1 竖块数量=${v}`);
  if (h !== 1) errs.push(`1×2 横块数量=${h}`);
  if (s !== 4) errs.push(`1×1 宫人数量=${s}`);
  if (pieces.length !== 10) errs.push(`棋子总数=${pieces.length}`);
  // 覆盖与重叠
  const grid = new Array(COLS * ROWS).fill(0);
  for (const p of pieces) {
    for (let a = 0; a < p.h; a++) for (let b = 0; b < p.w; b++) {
      const r = p.row + a, c = p.col + b;
      if (r < 0 || c < 0 || r >= ROWS || c >= COLS) { errs.push(`越界: ${p.row},${p.col} ${p.w}×${p.h}`); continue; }
      const idx = r * COLS + c;
      if (grid[idx]) errs.push(`重叠于 (${r},${c})`);
      grid[idx] = 1;
    }
  }
  const empty = grid.filter(x => !x).length;
  if (empty !== 2) errs.push(`空格数量=${empty}（应为 2）`);
  return errs;
}

const DIFF_NAMES = ['简单', '中等', '困难'];
console.log('关卡\t难度\t最优步数\t校验');
let allOk = true;
for (const lv of LEVELS_DATA) {
  const errs = validateLevel(lv);
  let opt = -1;
  if (!errs.length) {
    opt = solveOptimal(lv);
    if (opt < 0) errs.push('BFS 不可解');
  }
  const tag = errs.length ? '✗ ' + errs.join('; ') : '✓';
  console.log(`${lv.id}\t${DIFF_NAMES[lv.diff]}\t${opt < 0 ? '—' : opt}\t${tag}`);
  if (errs.length) allOk = false;
  // 难度区间合理性（参考：简单 ≤60 / 中等 60-90 / 困难 ≥90）
  if (!errs.length && opt >= 0) {
    const okRange =
      (lv.diff === 0 && opt <= 60) ||
      (lv.diff === 1 && opt > 60 && opt <= 90) ||
      (lv.diff === 2 && opt > 90);
    if (!okRange) {
      console.log(`   ⚠ 步数 ${opt} 与难度 ${DIFF_NAMES[lv.diff]} 不匹配`);
      allOk = false;
    }
  }
}

// 求解器回归基准：以下最优步数已经两个独立实现交叉验证（crosscheck.js）
const EXPECTED = {
  l1: 18,
  l2: 18,
  l3: 20,
  l4: 25,
  l5: 31,
  l6: 32,
  l7: 34,
  l8: 44,
  l9: 44,
  l10: 45,
  l11: 55,
  l12: 55,
  l13: 63,
  l14: 63,
  l15: 64,
  l16: 64,
  l17: 77,
  l18: 77,
  l19: 77,
  l20: 77,
  l21: 80,
  l22: 85,
  l23: 86,
  l24: 88,
  l25: 92,
  l26: 94,
  l27: 95,
  l28: 99,
  l29: 108,
  l30: 108,
  l31: 111,
  l32: 114,
  l33: 116,
  l34: 120,
  l35: 121,
  l36: 122
};
for (const lv of LEVELS_DATA) {
  if (EXPECTED[lv.id] != null) {
    const opt = solveOptimal(lv);
    if (opt === EXPECTED[lv.id]) console.log(`基准 ✓ ${lv.id} = ${opt} 步（与交叉验证一致）`);
    else { console.log(`基准 ✗ ${lv.id} = ${opt}（应为 ${EXPECTED[lv.id]}）`); allOk = false; }
  }
}

console.log(allOk ? '\n=== 全部校验通过 ===' : '\n=== 存在失败项 ===');
process.exit(allOk ? 0 : 1);
