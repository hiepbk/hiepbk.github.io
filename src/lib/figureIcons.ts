// Signature icons for deep-learning blocks in the walkthrough figures (canvas 2D).
// Every layer that computes something in a figure is drawn as one of these blocks, so readers see
// "input → block → output". Colours follow the page theme (CSS variables).
//
//   const pal = iconPalette();                     // once per frame
//   drawBlock(ctx, 'mlp', x, y, w, h, pal, { label: 'shared MLP', sub: '(64, 128, 1024)', shared: true, active: 0.8 });
//   drawArrow(ctx, x0, y0, x1, y1, pal);

// One icon per kind of block, shared by every figure: 'mlp' (alias 'fc') for any MLP / fully connected layer,
// 'backbone' for a whole feature extractor, 'rpn' for a proposal network, 'roi' for RoI pooling / refinement.
export type BlockKind = 'mlp' | 'fc' | 'conv2d' | 'conv3d' | 'maxpool' | 'attention' | 'concat' | 'backbone' | 'rpn' | 'roi';

export interface IconPalette {
  ink: string;      // strokes and text
  muted: string;    // secondary text
  fill: string;     // block background
  accent: string;   // highlight when active
  neuron: string;   // neuron / cell fill
  dark: boolean;
}

/** Colours of the current theme, read from the CSS variables (call once per frame). */
export function iconPalette(): IconPalette {
  const css = getComputedStyle(document.documentElement);
  const dark = css.getPropertyValue('color-scheme').includes('dark');
  return {
    ink: css.getPropertyValue('--heading').trim() || '#34496f',
    muted: css.getPropertyValue('--muted').trim() || '#555',
    fill: dark ? 'rgba(124, 92, 246, 0.10)' : 'rgba(124, 58, 237, 0.06)',
    accent: css.getPropertyValue('--accent-2').trim() || '#7c3aed',
    neuron: dark ? '#1a2232' : '#ffffff',
    dark,
  };
}

export interface BlockOptions {
  label?: string;   // name under the icon, e.g. "shared MLP"
  sub?: string;     // sizes, e.g. "(64, 128, 1024)"
  shared?: boolean; // draw ghost copies behind: the same block applied to many inputs
  active?: number;  // 0..1: data is flowing through the block → accent glow
  alpha?: number;   // overall opacity
  compact?: boolean;// smaller text for narrow screens
}

/** Draws a block icon inside the box (x, y, w, h) — the label and sub-label go below the box. */
export function drawBlock(ctx: CanvasRenderingContext2D, kind: BlockKind, x: number, y: number, w: number, h: number,
  pal: IconPalette, opt: BlockOptions = {}) {
  const alpha = opt.alpha ?? 1, active = opt.active ?? 0;
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha *= alpha;
  const base = ctx.globalAlpha; // keeps the caller's alpha too

  if (opt.shared) {
    // Two ghost copies behind, offset up-right: "the same block, applied to every input"
    const step = Math.min(4, h / 10);
    for (const d of [2 * step, step]) {
      ctx.globalAlpha = base * 0.35;
      roundRect(ctx, x + d, y - d, w, h, 7);
      ctx.fillStyle = pal.neuron; ctx.fill();
      ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.globalAlpha = base;
  }

  // Frame of the block
  roundRect(ctx, x, y, w, h, 7);
  ctx.fillStyle = pal.neuron; ctx.fill();
  ctx.fillStyle = pal.fill; ctx.fill();
  ctx.lineWidth = 1.2 + active * 1.2;
  ctx.strokeStyle = active > 0.01 ? mix(pal.ink, pal.accent, active) : pal.ink;
  ctx.stroke();
  if (active > 0.01) {
    ctx.save();
    ctx.globalAlpha = base * 0.25 * active;
    ctx.shadowColor = pal.accent; ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.restore();
  }

  const ix = x + 6, iy = y + 6, iw = w - 12, ih = h - 12;
  const line = active > 0.01 ? mix(pal.muted, pal.accent, active) : pal.muted;
  switch (kind) {
    case 'mlp': case 'fc': drawMlp(ctx, ix, iy, iw, ih, pal, line); break;
    case 'conv2d': drawConv2d(ctx, ix, iy, iw, ih, pal, line); break;
    case 'conv3d': drawConv3d(ctx, ix, iy, iw, ih, pal, line); break;
    case 'maxpool': drawMaxPool(ctx, ix, iy, iw, ih, pal, line); break;
    case 'attention': drawAttention(ctx, ix, iy, iw, ih, pal, line); break;
    case 'concat': drawConcat(ctx, ix, iy, iw, ih, pal, line); break;
    case 'backbone': drawBackbone(ctx, ix, iy, iw, ih, pal, line); break;
    case 'rpn': drawRpn(ctx, ix, iy, iw, ih, pal, line); break;
    case 'roi': drawRoi(ctx, ix, iy, iw, ih, pal, line); break;
  }

  // Labels under the block
  ctx.textAlign = 'center';
  if (opt.label) {
    ctx.font = `600 ${opt.compact ? 9 : 11}px "IBM Plex Sans", sans-serif`;
    ctx.fillStyle = pal.ink;
    ctx.fillText(opt.label, x + w / 2, y + h + (opt.compact ? 11 : 13));
  }
  if (opt.sub) {
    ctx.font = `500 ${opt.compact ? 8 : 10}px "IBM Plex Mono", monospace`;
    ctx.fillStyle = pal.muted;
    ctx.fillText(opt.sub, x + w / 2, y + h + (opt.compact ? 21 : 25));
  }
  ctx.restore();
}

/** Arrow from (x0, y0) to (x1, y1), optionally with a label above its middle. */
export function drawArrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number,
  pal: IconPalette, label?: string, alpha = 1) {
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = pal.ink; ctx.fillStyle = pal.ink; ctx.lineWidth = 1.4;
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 5 * Math.cos(a), y1 - 5 * Math.sin(a)); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - 8 * Math.cos(a - 0.42), y1 - 8 * Math.sin(a - 0.42));
  ctx.lineTo(x1 - 8 * Math.cos(a + 0.42), y1 - 8 * Math.sin(a + 0.42));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = `500 10px "IBM Plex Mono", monospace`;
    ctx.fillStyle = pal.muted; ctx.textAlign = 'center';
    ctx.fillText(label, (x0 + x1) / 2, (y0 + y1) / 2 - 6);
  }
  ctx.restore();
}

// ---------- icon bodies ----------

// Fully connected layers: columns of neurons, every neuron linked to every neuron of the next column
function drawMlp(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  // Fewer neurons in small boxes, so they never touch
  const cols = h >= 34 ? [3, 5, 5, 3] : h >= 22 ? [3, 4, 4, 3] : [2, 3, 3, 2];
  const big = Math.max(...cols);
  const r = Math.max(1.2, Math.min(h / (big * 2.8), w / 22));
  const pos = cols.map((n, c) => Array.from({ length: n }, (_, k) => [
    x + r + ((w - 2 * r) * c) / (cols.length - 1),
    y + h / 2 + (k - (n - 1) / 2) * Math.min((h - 2 * r) / (big - 1), r * 3.2),
  ] as const));
  const a0 = ctx.globalAlpha;
  ctx.strokeStyle = line; ctx.lineWidth = 0.6; ctx.globalAlpha = a0 * 0.9;
  ctx.beginPath();
  for (let c = 0; c + 1 < pos.length; c++) {
    for (const [ax, ay] of pos[c]) for (const [bx, by] of pos[c + 1]) { ctx.moveTo(ax, ay); ctx.lineTo(bx, by); }
  }
  ctx.stroke();
  ctx.globalAlpha = a0;
  for (const col of pos) for (const [px, py] of col) {
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = pal.neuron; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = pal.ink; ctx.stroke();
  }
}

// Stacked feature maps with a kernel window projecting into the next map
function drawConv2d(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const maps = 3, sk = Math.min(w, h) * 0.18;
  const mw = w - sk * (maps - 1) - 2, mh = h - sk * (maps - 1) - 2;
  for (let m = 0; m < maps; m++) {
    const mx = x + m * sk, my = y + (maps - 1 - m) * sk;
    ctx.fillStyle = pal.neuron; ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(mx, my, mw, mh);
    if (m === maps - 1) {
      // Kernel window and its output cell on the front map
      const kx = mx + mw * 0.15, ky = my + mh * 0.2, ks = Math.min(mw, mh) * 0.32;
      ctx.strokeStyle = line; ctx.lineWidth = 1.4; ctx.strokeRect(kx, ky, ks, ks);
      ctx.beginPath(); ctx.moveTo(kx + ks, ky); ctx.lineTo(mx + mw * 0.82, my + mh * 0.6); ctx.moveTo(kx + ks, ky + ks); ctx.lineTo(mx + mw * 0.82, my + mh * 0.6); ctx.stroke();
      ctx.fillStyle = line; ctx.fillRect(mx + mw * 0.8, my + mh * 0.58, 4, 4);
    }
  }
}

// A voxel cube with a 3×3×3 kernel cube inside
function drawConv3d(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const s = Math.min(w, h) * 0.62, d = s * 0.38;
  const ox = x + (w - s - d) / 2, oy = y + d + (h - s - d) / 2;
  const cube = (cx: number, cy: number, cs: number, cd: number, stroke: string, lw: number, fill?: string) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx + cs, cy); ctx.lineTo(cx + cs, cy + cs); ctx.lineTo(cx, cy + cs); ctx.closePath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx + cd, cy - cd); ctx.lineTo(cx + cs + cd, cy - cd); ctx.lineTo(cx + cs, cy);
    ctx.moveTo(cx + cs + cd, cy - cd); ctx.lineTo(cx + cs + cd, cy + cs - cd); ctx.lineTo(cx + cs, cy + cs);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
  };
  cube(ox, oy, s, d, pal.ink, 1, pal.neuron);
  // inner grid lines on the front face
  ctx.strokeStyle = pal.muted; ctx.lineWidth = 0.5; ctx.beginPath();
  for (let k = 1; k < 3; k++) { ctx.moveTo(ox + (s * k) / 3, oy); ctx.lineTo(ox + (s * k) / 3, oy + s); ctx.moveTo(ox, oy + (s * k) / 3); ctx.lineTo(ox + s, oy + (s * k) / 3); }
  ctx.stroke();
  cube(ox + s * 0.12, oy + s * 0.5, s * 0.36, d * 0.36, line, 1.4);
}

// A funnel: many values in, the max out
function drawMaxPool(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const neck = 0.62, nl = 0.38, nr = 0.62;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w * nr, y + h * neck); ctx.lineTo(x + w * nr, y + h);
  ctx.lineTo(x + w * nl, y + h); ctx.lineTo(x + w * nl, y + h * neck); ctx.closePath();
  ctx.fillStyle = pal.neuron; ctx.fill();
  ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.stroke();
  // Bars of different heights entering (kept inside the funnel walls), the tallest one leaving through the neck
  const bars = [0.5, 0.9, 0.3, 0.7, 0.45], bh = h * 0.24, by = y + h * 0.04;
  const span = w * 0.56, bw = (span / bars.length) * 0.6;
  bars.forEach((b, k) => {
    ctx.fillStyle = b === 0.9 ? line : pal.muted;
    const bx = x + (w - span) / 2 + (k + 0.2) * (span / bars.length);
    ctx.fillRect(bx, by + (1 - b) * bh, bw, b * bh);
  });
  ctx.fillStyle = line;
  ctx.fillRect(x + w / 2 - bw / 2, y + h * (neck + 0.08), bw, h * (0.9 - neck));
  // "max" label between the bars and the neck, only where the funnel is wide enough for it
  const ty = y + h * 0.5, fs = Math.min(12, h * 0.2);
  const room = w * (1 - 2 * nl * (0.5 / neck)) - 4;
  ctx.font = `600 ${fs}px "IBM Plex Mono", monospace`;
  if (fs >= 7 && ctx.measureText('max').width <= room) {
    ctx.fillStyle = line; ctx.textAlign = 'center';
    ctx.fillText('max', x + w / 2, ty + fs * 0.25);
  }
}

// Q, K, V blocks and the softmax attention matrix
function drawAttention(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const bw = w * 0.2, bh = h * 0.26;
  ['Q', 'K', 'V'].forEach((n, k) => {
    const bx = x, by = y + k * (bh + h * 0.11);
    ctx.fillStyle = pal.neuron; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
    const fs = Math.min(bh * 0.75, bw * 0.85);
    if (fs >= 5) {
      ctx.font = `600 ${fs}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = pal.ink; ctx.textAlign = 'center'; ctx.fillText(n, bx + bw / 2, by + bh / 2 + fs * 0.36);
    }
  });
  const mx = x + w * 0.42, ms = Math.min(w * 0.55, h * 0.8), my = y + (h - ms) / 2, n = 4, a0 = ctx.globalAlpha;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = i === j ? 0.9 : 0.15 + 0.35 * (((i * 7 + j * 3) % 5) / 5);
    ctx.globalAlpha = a0 * Math.min(1, 0.25 + v);
    ctx.fillStyle = line; ctx.fillRect(mx + (j * ms) / n, my + (i * ms) / n, ms / n - 1, ms / n - 1);
  }
  ctx.globalAlpha = a0;
  ctx.strokeStyle = pal.ink; ctx.strokeRect(mx, my, ms, ms);
}

// Two blocks side by side joined into one
function drawConcat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const a = w * 0.3;
  ctx.fillStyle = pal.neuron;
  ctx.fillRect(x, y + h * 0.15, a, h * 0.7); ctx.strokeStyle = pal.ink; ctx.strokeRect(x, y + h * 0.15, a, h * 0.7);
  ctx.fillStyle = line; ctx.globalAlpha *= 0.35;
  ctx.fillRect(x + a, y + h * 0.15, w - a, h * 0.7);
  ctx.globalAlpha /= 0.35;
  ctx.strokeStyle = pal.ink; ctx.strokeRect(x + a, y + h * 0.15, w - a, h * 0.7);
  ctx.font = `600 ${Math.max(8, h * 0.3)}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = pal.ink; ctx.textAlign = 'center'; ctx.fillText('‖', x + a, y + h * 0.62);
}

// Backbone: feature maps shrinking stage by stage (an encoder), the last one highlighted
function drawBackbone(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const sizes = [1, 0.74, 0.5], gap = w * 0.06;
  const unit = (w - gap * (sizes.length - 1)) / sizes.reduce((a, b) => a + b * 0.42, 0);
  let cx = x;
  sizes.forEach((f, k) => {
    const mw = unit * f * 0.42, mh = h * f, my = y + (h - mh) / 2, sk = mw * 0.35;
    // a thin slab seen at an angle: front face plus depth
    ctx.beginPath();
    ctx.moveTo(cx, my + sk); ctx.lineTo(cx + mw, my); ctx.lineTo(cx + mw, my + mh - sk); ctx.lineTo(cx, my + mh); ctx.closePath();
    ctx.fillStyle = k === sizes.length - 1 ? line : pal.neuron;
    const a0 = ctx.globalAlpha;
    if (k === sizes.length - 1) ctx.globalAlpha = a0 * 0.35;
    ctx.fill();
    ctx.globalAlpha = a0;
    ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.stroke();
    cx += mw + gap;
  });
}

// RPN: a feature map with dashed anchors and one proposal box picked out
function drawRpn(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  ctx.fillStyle = pal.neuron; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = pal.muted; ctx.lineWidth = 0.5; ctx.beginPath();
  for (let k = 1; k < 4; k++) { ctx.moveTo(x + (w * k) / 4, y); ctx.lineTo(x + (w * k) / 4, y + h); ctx.moveTo(x, y + (h * k) / 4); ctx.lineTo(x + w, y + (h * k) / 4); }
  ctx.stroke();
  ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([2.5, 2]); ctx.lineWidth = 1;
  ctx.strokeRect(x + w * 0.08, y + h * 0.12, w * 0.34, h * 0.3);
  ctx.strokeRect(x + w * 0.5, y + h * 0.58, w * 0.3, h * 0.3);
  ctx.setLineDash([]);
  ctx.strokeStyle = line; ctx.lineWidth = 1.8;
  ctx.strokeRect(x + w * 0.42, y + h * 0.16, w * 0.46, h * 0.36);
}

// RoI: a proposal box with a grid of pooling points, pooled into a small fixed-size feature tile
function drawRoi(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: IconPalette, line: string) {
  const bw = w * 0.56, bh = h * 0.8, by = y + (h - bh) / 2;
  ctx.fillStyle = pal.neuron; ctx.fillRect(x, by, bw, bh);
  ctx.strokeStyle = line; ctx.lineWidth = 1.6; ctx.strokeRect(x, by, bw, bh);
  ctx.fillStyle = line;
  const r = Math.max(1, Math.min(bw, bh) * 0.045);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    ctx.beginPath(); ctx.arc(x + bw * (i + 0.5) / 3, by + bh * (j + 0.5) / 3, r, 0, Math.PI * 2); ctx.fill();
  }
  const ts = Math.min(w * 0.3, h * 0.5), tx = x + w - ts, ty = y + (h - ts) / 2;
  ctx.strokeStyle = pal.ink; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(x + bw + 2, y + h / 2); ctx.lineTo(tx - 2, y + h / 2); ctx.stroke();
  const a0 = ctx.globalAlpha;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    ctx.globalAlpha = a0 * (0.3 + 0.5 * (((i * 5 + j * 3) % 4) / 4));
    ctx.fillStyle = line; ctx.fillRect(tx + (ts * i) / 3, ty + (ts * j) / 3, ts / 3 - 1, ts / 3 - 1);
  }
  ctx.globalAlpha = a0;
  ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(tx, ty, ts, ts);
}

// ---------- helpers ----------

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// Linear mix of two colours given as #rrggbb or hsl()/rgb() strings (falls back to the second colour)
function mix(a: string, b: string, t: number) {
  const pa = toRgb(a), pb = toRgb(b);
  if (!pa || !pb) return t > 0.5 ? b : a;
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c.join(',')})`;
}
function toRgb(c: string): number[] | null {
  const hex = c.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
  const rgb = c.match(/rgba?\(([^)]+)\)/);
  if (rgb) return rgb[1].split(',').slice(0, 3).map((v) => parseFloat(v));
  return null;
}
