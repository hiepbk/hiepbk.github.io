// Client-side engine for the "main architecture" figures of PointRCNN, PV-RCNN, CenterPoint and Voxel R-CNN.
// One node per row of the walkthrough's tensor-shape table (same stage name, same shape), placed on a small grid
// laid out like the paper's own architecture figure. Data flows from the raw input to the final boxes: one step per
// table row, the active block lights up, packets run along its incoming arrows, and the status line repeats the
// table row (operation → shape). Learned layers use the figureIcons blocks; fixed operations are dashed boxes.
import { FIGURE_SPEED } from './figureClock';
import { iconPalette, drawBlock, drawArrow, type BlockKind } from './figureIcons';

export type Glyph = 'points' | 'boxes' | 'tracks';
export type ArchNode = {
  stage: string;        // table "Stage" column
  shape: string;        // table "Shape" column
  shapeN?: string;      // shorter shape for narrow screens
  opText: string;       // table "Operation" column
  head: string;         // red headline while this row runs
  headN?: string;
  block?: BlockKind;    // learned layer …
  shared?: boolean;
  op?: string;          // … or a fixed operation (word drawn inside a dashed box)
  glyph?: Glyph;        // … or a data glyph (input / output)
  pos: [number, number];   // column, row on the wide layout
  posN?: [number, number]; // column, row on the narrow layout
  from?: number[];      // incoming nodes (default: the previous node)
};
export type ArchSpec = { cols: number; rows: number; colsN?: number; rowsN?: number; nodes: ArchNode[] };

export function runArchFigure(canvas: HTMLCanvasElement, spec: ArchSpec) {
  const ctx = canvas.getContext('2d')!;
  const nodes = spec.nodes;
  const D = 3.2; // authored seconds per table row
  const END = (nodes.length + 1) * D; // one extra step: hold the full result
  const ramp = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const ease = (x: number) => x * x * (3 - 2 * x);
  const inputs = (i: number) => nodes[i].from ?? (i > 0 ? [i - 1] : []);

  let W = 0, H = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  function glyph(g: Glyph, x: number, y: number, w: number, h: number, ink: string, acc: string, dark: boolean, on: number) {
    const dotc = dark ? '#8b97ab' : '#64748b';
    const teal = getComputedStyle(document.documentElement).getPropertyValue('--accent-3').trim() || '#0ea5a0';
    ctx.save();
    ctx.strokeStyle = on > 0.5 ? acc : ink; ctx.lineWidth = 1 + Math.min(1, on);
    ctx.fillStyle = dark ? '#121826' : '#ffffff';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(x + 2, y + 2, w - 4, h - 4); ctx.clip();
    const R = (k: number) => ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1;
    ctx.fillStyle = dotc;
    for (let k = 0; k < (g === 'points' ? 55 : 22); k++) {
      ctx.beginPath(); ctx.arc(x + 4 + R(k) * (w - 8), y + 4 + R(k + 99) * (h - 8), 1.1, 0, Math.PI * 2); ctx.fill();
    }
    if (g !== 'points') {
      [[0.32, 0.38, 200], [0.68, 0.66, 28]].forEach(([cx, cy, hue]) => {
        ctx.strokeStyle = g === 'tracks' ? `hsl(${hue} 75% 50%)` : teal; ctx.lineWidth = 1.8;
        ctx.strokeRect(x + cx * w - w * 0.18, y + cy * h - h * 0.13, w * 0.36, h * 0.26);
      });
    }
    ctx.restore();
  }

  function frame(time: number) {
    const t = time % END;
    const css = getComputedStyle(document.documentElement);
    const text = css.getPropertyValue('--muted').trim() || '#555';
    const heading = css.getPropertyValue('--heading').trim() || '#34496f';
    const accent = css.getPropertyValue('--accent-2').trim() || '#7c3aed';
    const dark = css.getPropertyValue('color-scheme').includes('dark');
    const red = dark ? '#ff6b6b' : '#dc2626';
    const pal = iconPalette();
    ctx.clearRect(0, 0, W, H);

    const step = Math.min(nodes.length - 1, Math.floor(t / D));
    const tb = t - step * D;
    const done = t >= nodes.length * D; // final hold: everything lit
    const fadeAll = 1 - ramp(t, END - 0.5, END);
    const narrow = W < 520;
    const cols = narrow ? spec.colsN ?? spec.cols : spec.cols, rows = narrow ? spec.rowsN ?? spec.rows : spec.rows;
    const top = 72, bottom = 4;
    const cw = W / cols, rh = (H - top - bottom) / rows;
    const lab = narrow ? 24 : 30; // two label lines under a node
    const bw = Math.min(narrow ? 44 : 62, cw - 20), bh = Math.min(narrow ? 30 : 44, rh - lab - 8);
    const P = (i: number) => {
      const [c, r] = narrow ? nodes[i].posN ?? nodes[i].pos : nodes[i].pos;
      return [cw * (c + 0.5), top + rh * r + (rh - lab - bh) / 2 + bh / 2] as const;
    };
    const halfW = (i: number) => (nodes[i].glyph ? bw * 0.62 : bw / 2);

    // Headline, the table row and its operation → shape
    const n = nodes[step];
    ctx.globalAlpha = fadeAll * ease(ramp(tb, 0.05, 0.45));
    ctx.textAlign = 'center';
    ctx.font = `600 ${narrow ? 12 : 15}px Sora, sans-serif`;
    ctx.fillStyle = red;
    ctx.fillText(done ? (narrow ? 'Raw points in, 3D boxes out' : 'The whole pipeline: raw points in, 3D boxes out') : narrow ? n.headN ?? n.head : n.head, W / 2, 16, W - 8);
    ctx.globalAlpha = fadeAll;
    ctx.font = `600 ${narrow ? 12 : 14}px Sora, sans-serif`;
    ctx.fillStyle = heading;
    ctx.fillText(done ? 'Every row of the table, in order' : `Table row: ${n.stage}`, W / 2, 38, W - 8);
    ctx.font = `500 ${narrow ? 10 : 12}px "IBM Plex Sans", sans-serif`;
    ctx.fillStyle = step === 0 && !done ? text : accent;
    if (!done) ctx.fillText(`${n.opText}  →  ${n.shape}`, W / 2, 56, W - 8);

    // Arrows (incoming edges); a packet runs along the active node's inputs
    nodes.forEach((_, i) => {
      for (const j of inputs(i)) {
        const [x0, y0] = P(j), [x1, y1] = P(i);
        const lit = done || i <= step;
        let sx: number, sy: number, ex: number, ey: number;
        if (Math.abs(y1 - y0) < 1) {
          sx = x0 + Math.sign(x1 - x0) * (halfW(j) + 3); sy = y0; ex = x1 - Math.sign(x1 - x0) * (halfW(i) + 3); ey = y1;
        } else if (Math.abs(x1 - x0) < 1) {
          const down = y1 > y0;
          sx = x0; sy = down ? y0 + bh / 2 + lab : y0 - bh / 2 - 2; ex = x1; ey = down ? y1 - bh / 2 - 3 : y1 + bh / 2 + lab;
        } else {
          // Diagonal: leave from the side, enter from the side
          sx = x0 + Math.sign(x1 - x0) * (halfW(j) + 3); sy = y0; ex = x1 - Math.sign(x1 - x0) * (halfW(i) + 3); ey = y1;
        }
        drawArrow(ctx, sx, sy, ex, ey, pal, undefined, fadeAll * (lit ? 0.9 : 0.3));
        if (!done && i === step && tb > 0.4 && tb < 1.4) {
          const p = ease(ramp(tb, 0.4, 1.3));
          ctx.globalAlpha = fadeAll;
          ctx.fillStyle = accent;
          ctx.beginPath(); ctx.arc(sx + (ex - sx) * p, sy + (ey - sy) * p, 4, 0, Math.PI * 2); ctx.fill();
        }
      }
    });

    // Nodes: label = table stage, sub = table shape
    nodes.forEach((nd, i) => {
      const [x, y] = P(i);
      const reached = done || i <= step;
      const act = !done && i === step ? ease(ramp(tb, 1.1, 1.7)) : 0;
      const alpha = fadeAll * (reached ? 1 : 0.35);
      const shape = narrow ? nd.shapeN ?? nd.shape : nd.shape;
      if (nd.block) {
        drawBlock(ctx, nd.block, x - bw / 2, y - bh / 2, bw, bh, pal, { shared: nd.shared, active: act, alpha, compact: narrow });
      } else if (nd.glyph) {
        ctx.globalAlpha = alpha;
        glyph(nd.glyph, x - halfW(i), y - bh / 2, 2 * halfW(i), bh, heading, accent, dark, act + (done && i === nodes.length - 1 ? 1 : 0));
      } else {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = dark ? '#121826' : '#ffffff';
        ctx.strokeStyle = act > 0.3 ? accent : heading; ctx.lineWidth = 1.2 + act;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 7); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.textAlign = 'center';
        ctx.font = `600 ${narrow ? 8 : 10}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = act > 0.3 ? accent : text;
        ctx.fillText(nd.op ?? '', x, y + 4, bw - 4);
      }
      // Labels (drawn here, not by drawBlock, so they can be clamped to the cell width)
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.font = `600 ${narrow ? 9 : 11}px "IBM Plex Sans", sans-serif`;
      ctx.fillStyle = act > 0.3 ? accent : heading;
      ctx.fillText(nd.stage, x, y + bh / 2 + (narrow ? 11 : 14), cw - 4);
      ctx.font = `500 ${narrow ? 8 : 10}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = act > 0.3 ? accent : text;
      ctx.fillText(shape, x, y + bh / 2 + (narrow ? 21 : 26), cw - 4);
    });
    ctx.globalAlpha = 1;
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', () => { resize(); if (still) frame(END - 1); });
  if (still) { frame(END - 1); return; }
  // The loop starts at the first table row when the figure first scrolls into view
  let visible = false, raf: number | null = null, t0: number | null = null;
  const loop = (ms: number) => {
    t0 ??= ms;
    frame(((ms - t0) / 1000) * FIGURE_SPEED);
    raf = visible ? requestAnimationFrame(loop) : null;
  };
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && raf === null) raf = requestAnimationFrame(loop);
  }).observe(canvas);
}
