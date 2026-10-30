// Client-side helper for the "main architecture" figures of the MV3D / VoxelNet / SECOND / PointPillars walkthroughs.
// The figure follows the paper's own architecture figure (groups such as "Feature Learning Network") and the
// walkthrough's tensor-shape table: one stage per table row, lit up row by row from the raw input to the 3D boxes,
// with the row's name and output shape under the node and repeated in the status line. Network layers are drawn
// with the figureIcons blocks (several icons side by side for a compound layer such as VFE = MLP + max + concat).
// Runs its own loop with the usual conventions (starts at stage 1 when scrolled into view, pauses off-screen,
// one static frame for reduced motion, FIGURE_SPEED).
import { FIGURE_SPEED } from './figureClock';
import { drawBlock, drawArrow, iconPalette, type BlockKind } from './figureIcons';

export type DataKind = 'points' | 'image' | 'bev' | 'fv' | 'voxels' | 'tensor' | 'map' | 'vector' | 'boxes' | 'proposals';
export type PipeNode = {
  id: string; col: number; row: number; step: number;
  kind: DataKind | BlockKind | BlockKind[]; // an array draws a compound layer (icons side by side)
  label: string; sub?: string; shared?: boolean; span?: number;
};
/** One stage = one row of the tensor-shape table: `row` and `shape` are shown in the status line. */
export type PipeStep = { say: string; short: string; row: string; shape: string };
export type PipeGroup = { label: string; col0: number; col1: number; row0: number; row1: number; steps: number[] };
export type PipeSpec = { cols: number; rows: number; nodes: PipeNode[]; edges: [string, string][]; steps: PipeStep[]; groups?: PipeGroup[] };

const BLOCKS = new Set(['mlp', 'fc', 'conv2d', 'conv3d', 'maxpool', 'attention', 'concat', 'backbone', 'rpn', 'roi']);

export function runPipeline(canvas: HTMLCanvasElement, spec: PipeSpec) {
  const ctx = canvas.getContext('2d')!;
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const nSteps = spec.steps.length;
  const STEP = 2.4; // authored seconds per stage (×2 on screen with FIGURE_SPEED = 0.5)
  const T_END = nSteps * STEP + 3;
  const ramp = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const ease = (x: number) => x * x * (3 - 2 * x);

  let W = 0, H = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  function frame(time: number) {
    const t = time % T_END;
    const pal = iconPalette();
    const css = getComputedStyle(document.documentElement);
    const faint = css.getPropertyValue('--faint').trim() || '#999';
    const heading = css.getPropertyValue('--heading').trim() || '#34496f';
    const accent = css.getPropertyValue('--accent-2').trim() || '#7c3aed';
    const dark = pal.dark;
    const red = dark ? '#ff6b6b' : '#dc2626';
    const teal = dark ? '#3fd6cc' : '#0d9488';
    const cellBg = dark ? '#1f2737' : '#eef1f6';
    ctx.clearRect(0, 0, W, H);

    const step = Math.min(nSteps - 1, Math.floor(t / STEP));
    const st = t - step * STEP; // time inside the stage
    const done = t >= nSteps * STEP; // final hold: everything lit
    const fadeAll = 1 - ramp(t, T_END - 0.5, T_END);
    const narrow = W < 520;
    const small = W < 700;
    const hasGroups = !!spec.groups?.length;

    // Grid layout: rows (bands or lanes) of equal height; a group title sits at the top of its row
    const top = narrow ? 82 : 92;
    const colW = (W - 8) / spec.cols, rowH = (H - top - 2) / spec.rows;
    const gT = hasGroups ? (narrow ? 14 : 18) : 0;
    const nw = Math.min(narrow ? colW - 12 : colW - 22, 80);
    const nh = Math.min(rowH - gT - (narrow ? 12 : 40), narrow ? 34 : 46);
    const rowTop = (r: number) => top + rowH * r;
    const box = (n: PipeNode) => {
      const span = n.span ?? 1, w = nw + colW * (span - 1);
      const cx = 4 + colW * (n.col + span / 2);
      return { x: cx - w / 2, y: rowTop(n.row) + gT + (narrow ? 4 : 6), w, cx };
    };

    // Headline, stage title (table row) and its shape
    const s = spec.steps[step];
    ctx.globalAlpha = fadeAll * ease(ramp(st, 0.05, 0.45));
    ctx.textAlign = 'center';
    ctx.font = `600 ${narrow ? 12 : 15}px Sora, sans-serif`;
    ctx.fillStyle = red;
    ctx.fillText(narrow ? s.short : s.say, W / 2, 16, W - 8);
    ctx.globalAlpha = fadeAll;
    ctx.font = `600 ${narrow ? 12 : 14}px Sora, sans-serif`;
    ctx.fillStyle = heading;
    ctx.fillText(`Table row ${step + 1} / ${nSteps}: ${s.row}`, W / 2, 44, W - 8);
    ctx.font = `500 ${narrow ? 10 : 12}px "IBM Plex Mono", monospace`;
    ctx.fillStyle = accent;
    ctx.fillText(s.shape, W / 2, 62, W - 8);

    // Group frames, as in the paper's figure
    for (const g of spec.groups ?? []) {
      const on = !done && g.steps.includes(step);
      const x0 = 4 + colW * g.col0 + 2, x1 = 4 + colW * (g.col1 + 1) - 2;
      const y0 = rowTop(g.row0) + 2, y1 = rowTop(g.row1 + 1) - 4;
      ctx.globalAlpha = fadeAll * (on ? 0.9 : 0.45);
      ctx.strokeStyle = on ? accent : faint;
      ctx.lineWidth = on ? 1.5 : 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 8); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = on ? accent : faint;
      ctx.font = `600 ${narrow ? 9 : 11}px Sora, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(g.label, x0 + 8, y0 + (narrow ? 11 : 13), x1 - x0 - 12);
    }

    // Edges: elbow lines left → right; a jump back to the start of the next band runs through the gap between bands
    for (const [a, b] of spec.edges) {
      const A = byId.get(a)!, B = byId.get(b)!;
      const ba = box(A), bb = box(B);
      const y0 = ba.y + nh / 2, y1 = bb.y + nh / 2;
      const x0 = ba.x + ba.w + 2, x1 = bb.x - 3;
      let path: number[][];
      if (bb.x > ba.x) {
        const mid = (x0 + x1) / 2;
        path = y0 === y1 ? [[x0, y0], [x1, y1]] : [[x0, y0], [mid, y0], [mid, y1], [x1, y1]];
      } else {
        const gap = rowTop(B.row) + (hasGroups ? 1 : -2), xr = Math.min(W - 3, x0 + 8), xl = Math.max(3, x1 - 9);
        path = [[x0, y0], [xr, y0], [xr, gap], [xl, gap], [xl, y1], [x1, y1]];
      }
      const lit = done || B.step <= step;
      ctx.globalAlpha = fadeAll * (lit ? 0.9 : 0.25);
      ctx.strokeStyle = lit ? pal.ink : faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      path.slice(0, -1).forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      const [px, py] = path[path.length - 2];
      if (lit) drawArrow(ctx, px, py, x1, y1, pal); else { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x1, y1); ctx.stroke(); }
      if (!done && B.step === step && st < 1.3) {
        // A dot carries the data along the edge
        const f = ease(ramp(st, 0.1, 1.2));
        const lens = path.slice(1).map(([x, y], k) => Math.hypot(x - path[k][0], y - path[k][1]));
        let dist = f * lens.reduce((q, v) => q + v, 0), k = 0;
        while (k < lens.length - 1 && dist > lens[k]) { dist -= lens[k]; k++; }
        const r = lens[k] ? dist / lens[k] : 0;
        ctx.globalAlpha = fadeAll;
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(path[k][0] + (path[k + 1][0] - path[k][0]) * r, path[k][1] + (path[k + 1][1] - path[k][1]) * r, 4, 0, 2 * Math.PI); ctx.fill();
      }
    }

    // Nodes: icon or data pictogram, then the table-row name and shape underneath (wide screens)
    for (const n of spec.nodes) {
      const { x, y, w, cx } = box(n);
      const reached = done || n.step <= step;
      const isNow = !done && n.step === step;
      const active = isNow ? ease(ramp(st, 0.9, 1.5)) : 0;
      const a = fadeAll * (reached ? (isNow ? 0.3 + 0.7 * active : 1) : 0.22);
      const kinds = Array.isArray(n.kind) ? n.kind : [n.kind];
      if (BLOCKS.has(kinds[0])) {
        const gap = 4, bw = (w - gap * (kinds.length - 1)) / kinds.length;
        kinds.forEach((k, i) => drawBlock(ctx, k as BlockKind, x + i * (bw + gap), y, bw, nh, pal, { shared: n.shared && k === 'mlp', active, alpha: a, compact: small }));
      } else {
        ctx.save();
        ctx.globalAlpha = a;
        drawData(kinds[0] as DataKind, x, y, w, nh);
        if (active > 0) { ctx.globalAlpha = a * active; ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.strokeRect(x - 2, y - 2, w + 4, nh + 4); }
        ctx.restore();
      }
      if (!narrow) {
        ctx.save();
        ctx.globalAlpha = fadeAll * (reached ? 1 : 0.35);
        ctx.textAlign = 'center';
        ctx.font = `600 ${small ? 9 : 11}px "IBM Plex Sans", sans-serif`;
        ctx.fillStyle = isNow ? accent : pal.ink;
        ctx.fillText(n.label, cx, y + nh + (small ? 11 : 13), w + colW - nw - 2);
        if (n.sub) {
          ctx.font = `500 ${small ? 8 : 10}px "IBM Plex Mono", monospace`;
          ctx.fillStyle = pal.muted;
          ctx.fillText(n.sub, cx, y + nh + (small ? 21 : 25), w + colW - nw - 2);
        }
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;

    // Small pictograms for the data nodes, drawn in the box (x, y, w, h)
    function drawData(kind: DataKind, x: number, y: number, w: number, h: number) {
      const dot = (px: number, py: number, r = 1.2) => { ctx.beginPath(); ctx.arc(px, py, r, 0, 2 * Math.PI); ctx.fill(); };
      const frameBox = () => { ctx.fillStyle = pal.neuron; ctx.fillRect(x, y, w, h); ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h); };
      switch (kind) {
        case 'points': {
          // Lidar points on the ground and two car-like clusters
          ctx.fillStyle = faint;
          for (let k = 0; k < 70; k++) dot(x + (((k * 37) % 97) / 97) * w, y + h * (0.55 + 0.4 * (((k * 53) % 89) / 89)), 0.9);
          ctx.fillStyle = accent;
          for (let k = 0; k < 24; k++) { dot(x + w * (0.15 + (0.25 * ((k * 7) % 11)) / 11), y + h * (0.35 + (0.3 * ((k * 5) % 7)) / 7)); dot(x + w * (0.6 + (0.25 * ((k * 3) % 11)) / 11), y + h * (0.25 + (0.3 * ((k * 9) % 7)) / 7)); }
          break;
        }
        case 'image': {
          frameBox();
          ctx.fillStyle = dark ? '#24324d' : '#dbeafe'; ctx.fillRect(x + 1, y + 1, w - 2, h * 0.5);
          ctx.fillStyle = dark ? '#2a3445' : '#d1d5db'; ctx.fillRect(x + 1, y + h * 0.5, w - 2, h * 0.5 - 1);
          ctx.fillStyle = teal; ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.22, h * 0.18); ctx.fillRect(x + w * 0.6, y + h * 0.48, w * 0.14, h * 0.12);
          break;
        }
        case 'bev': case 'map': case 'fv': {
          frameBox();
          const nx = kind === 'fv' ? 14 : 10, ny = kind === 'fv' ? 4 : 8;
          for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
            const v = ((i * 7 + j * 13) % 10) / 10;
            const on = kind === 'fv' ? v > 0.15 : kind === 'map' ? true : v > 0.72 || (j === 3 && i > 2 && i < 6);
            if (!on) continue;
            ctx.fillStyle = kind === 'map' ? (dark ? `hsl(265 45% ${20 + v * 35}%)` : `hsl(265 70% ${92 - v * 30}%)`) : kind === 'fv' ? (dark ? `hsl(${200 - v * 150} 60% 45%)` : `hsl(${200 - v * 150} 70% 55%)`) : red;
            ctx.fillRect(x + 1 + (i * (w - 2)) / nx, y + 1 + (j * (h - 2)) / ny, (w - 2) / nx - 0.5, (h - 2) / ny - 0.5);
          }
          break;
        }
        case 'voxels': {
          // An isometric slab of voxels, a few occupied
          const n = 5, s = Math.min(w / (n + 2), h / (n * 0.6 + 2));
          const P = (i: number, j: number, k: number) => [x + w / 2 + (i - j) * s * 0.75, y + h * 0.45 + (i + j) * s * 0.35 - k * s] as const;
          ctx.strokeStyle = faint; ctx.lineWidth = 0.6;
          ctx.beginPath();
          for (let i = 0; i <= n; i++) { let p = P(i, 0, 0); ctx.moveTo(p[0], p[1]); p = P(i, n, 0); ctx.lineTo(p[0], p[1]); p = P(0, i, 0); ctx.moveTo(p[0], p[1]); p = P(n, i, 0); ctx.lineTo(p[0], p[1]); }
          ctx.stroke();
          for (const [i, j] of [[1, 1], [1, 2], [2, 2], [3, 1], [3, 3], [4, 3]]) {
            const q = [P(i, j, 0), P(i + 1, j, 0), P(i + 1, j + 1, 0), P(i, j + 1, 0)];
            ctx.fillStyle = red;
            ctx.beginPath(); q.forEach(([px, py], k) => (k ? ctx.lineTo(px, py - s * 0.5) : ctx.moveTo(px, py - s * 0.5))); ctx.closePath(); ctx.fill();
          }
          break;
        }
        case 'tensor': {
          // A stack of feature maps
          const o = Math.min(5, w * 0.06);
          for (let m = 2; m >= 0; m--) {
            ctx.fillStyle = cellBg; ctx.fillRect(x + m * o, y + (2 - m) * 4 + 2, w - 12, h - 12);
            ctx.strokeStyle = pal.ink; ctx.lineWidth = 1; ctx.strokeRect(x + m * o, y + (2 - m) * 4 + 2, w - 12, h - 12);
          }
          ctx.fillStyle = red;
          for (let k = 0; k < 9; k++) ctx.fillRect(x + 4 + (((k * 23) % 37) / 37) * (w - 22), y + 14 + (((k * 17) % 29) / 29) * (h - 28), 3, 3);
          break;
        }
        case 'vector': {
          // One row of cells per item (e.g. K voxels × C channels)
          const rows = 4, bw = Math.min(w, 70), bh = Math.min(7, (h - 6) / rows);
          for (let r = 0; r < rows; r++) for (let k = 0; k < 8; k++) {
            ctx.fillStyle = dark ? `hsl(265 45% ${25 + (((k + r) * 37) % 10) * 4}%)` : `hsl(265 70% ${88 - (((k + r) * 37) % 10) * 4}%)`;
            ctx.fillRect(x + (w - bw) / 2 + (k * bw) / 8, y + h / 2 - (rows * bh) / 2 + r * bh, bw / 8 - 1, bh - 1);
          }
          break;
        }
        case 'boxes': case 'proposals': {
          frameBox();
          ctx.fillStyle = faint;
          for (let k = 0; k < 40; k++) dot(x + 3 + (((k * 37) % 97) / 97) * (w - 6), y + 3 + (((k * 53) % 89) / 89) * (h - 6), 0.8);
          const rects = kind === 'boxes' ? [[0.15, 0.3, 0.3, 0.16, 0.1], [0.55, 0.55, 0.28, 0.15, -0.2]] : [[0.12, 0.25, 0.32, 0.2, 0], [0.18, 0.32, 0.3, 0.18, 0.1], [0.5, 0.5, 0.3, 0.18, -0.1], [0.55, 0.6, 0.26, 0.16, 0], [0.3, 0.1, 0.2, 0.12, 0]];
          ctx.strokeStyle = kind === 'boxes' ? teal : accent;
          ctx.lineWidth = kind === 'boxes' ? 1.8 : 1;
          for (const [rx, ry, rw, rh, a] of rects) {
            ctx.save();
            ctx.translate(x + (rx + rw / 2) * w, y + (ry + rh / 2) * h); ctx.rotate(a);
            ctx.strokeRect((-rw * w) / 2, (-rh * h) / 2, rw * w, rh * h);
            ctx.restore();
          }
          break;
        }
      }
    }
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', () => { resize(); if (still) frame(nSteps * STEP + 1); });
  if (still) { frame(nSteps * STEP + 1); return; }
  // The loop starts at stage 1 when the figure first scrolls into view
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
