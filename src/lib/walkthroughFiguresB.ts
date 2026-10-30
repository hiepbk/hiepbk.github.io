// Build-time helpers for the PointRCNN / PV-RCNN / CenterPoint / Voxel R-CNN figures: the real PandaSet scan
// of the home page, read once, in metres (x, y on the ground plane, z up).
import fs from 'node:fs';

export type Pt = [number, number, number];
export type Box = { center: Pt; size: Pt; yaw: number; label: string };

const SCENE = 'public/data/pandaset-044-14';
let cache: { pts: Pt[]; ground: boolean[]; boxes: Box[] } | null = null;

/** Every point of the scan (with its ground flag) and the labelled boxes (size = [w, l, h]). */
export function loadScene() {
  if (cache) return cache;
  const meta = JSON.parse(fs.readFileSync(`${SCENE}.json`, 'utf8'));
  const buf = fs.readFileSync(`${SCENE}.bin`);
  const xyz = new Int16Array(buf.buffer, buf.byteOffset, meta.count * 3);
  const flags = buf.subarray(meta.count * 6);
  const pts: Pt[] = [], ground: boolean[] = [];
  for (let i = 0; i < meta.count; i++) {
    pts.push([xyz[3 * i] / 100, xyz[3 * i + 1] / 100, xyz[3 * i + 2] / 100]);
    ground.push((flags[i] & 1) === 1);
  }
  cache = { pts, ground, boxes: meta.boxes };
  return cache;
}

/** Deterministic pseudo-random numbers in [0, 1). */
export function seeded(seed = 7) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Direction of the box's length in the x–y plane (PandaSet yaw is measured from the y axis). */
export const heading = (b: Box) => b.yaw + Math.PI / 2;

/** BEV form of a box: centre, length, width, heading, height of the centre and box height. */
export const bevBox = (b: Box) => {
  const r = (v: number) => Math.round(v * 100) / 100;
  return { x: b.center[0], y: b.center[1], l: b.size[1], w: b.size[0], h: r(heading(b)), z: b.center[2], hz: b.size[2] };
};

/** Is the point inside the box (in BEV, plus a height check), with an optional margin in metres? */
export function inBox(p: Pt, b: Box, margin = 0) {
  const h = heading(b), c = Math.cos(h), s = Math.sin(h);
  const dx = p[0] - b.center[0], dy = p[1] - b.center[1];
  // Box frame: length along the heading (yaw), width across it
  const along = dx * c + dy * s, across = -dx * s + dy * c;
  return Math.abs(along) <= b.size[1] / 2 + margin && Math.abs(across) <= b.size[0] / 2 + margin &&
    Math.abs(p[2] - b.center[2]) <= b.size[2] / 2 + margin + 0.1;
}

/**
 * Points of the scan inside an x–y window, randomly thinned to at most n, rounded to cm.
 * Returns [x, y, z, ground (0/1), box index or -1].
 */
export function cropScene(x0: number, x1: number, y0: number, y1: number, n: number, opts: { ground?: boolean; seed?: number } = {}) {
  const { pts, ground, boxes } = loadScene();
  const rand = seeded(opts.seed ?? 11);
  let idx: number[] = [];
  pts.forEach((p, i) => {
    if (p[0] < x0 || p[0] > x1 || p[1] < y0 || p[1] > y1 || p[2] > 3) return;
    if (opts.ground === false && ground[i]) return;
    idx.push(i);
  });
  // Partial Fisher–Yates shuffle → n random points
  for (let k = 0; k < Math.min(n, idx.length); k++) {
    const j = k + Math.floor(rand() * (idx.length - k));
    [idx[k], idx[j]] = [idx[j], idx[k]];
  }
  idx = idx.slice(0, n);
  const r = (v: number) => Math.round(v * 100) / 100;
  return idx.map((i) => {
    const p = pts[i];
    const b = ground[i] ? -1 : boxes.findIndex((bx) => inBox(p, bx));
    return [r(p[0]), r(p[1]), r(p[2]), ground[i] ? 1 : 0, b] as [number, number, number, number, number];
  });
}

/** Farthest point sampling on the first two (or three) coordinates; returns indices in pick order. */
export function fpsIndices(pts: number[][], n: number, dims = 3): number[] {
  const picked = [0];
  const dist = pts.map(() => Infinity);
  for (let k = 1; k < Math.min(n, pts.length); k++) {
    const last = pts[picked[k - 1]];
    let best = 0;
    pts.forEach((p, i) => {
      let d = 0;
      for (let a = 0; a < dims; a++) d += (p[a] - last[a]) ** 2;
      dist[i] = Math.min(dist[i], d);
      if (dist[i] > dist[best]) best = i;
    });
    picked.push(best);
  }
  return picked;
}
