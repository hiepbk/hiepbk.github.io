// Build-time helpers for the MV3D / VoxelNet / SECOND / PointPillars walkthrough figures:
// the full PandaSet scan used on the home page, read once and cached.
import fs from 'node:fs';

const SCENE = 'public/data/pandaset-044-14';

export type ScenePoint = { x: number; y: number; z: number; ground: boolean };
export type Box = { center: [number, number, number]; size: [number, number, number]; yaw: number; label: string };

let cache: { points: ScenePoint[]; boxes: Box[] } | null = null;

/** Every point of the scan (metres, ego frame, z up from the road) and the labelled boxes (size = [w, l, h]). */
export function loadScene() {
  if (cache) return cache;
  const meta = JSON.parse(fs.readFileSync(`${SCENE}.json`, 'utf8'));
  const buf = fs.readFileSync(`${SCENE}.bin`);
  const xyz = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + meta.count * 6));
  const flags = buf.subarray(meta.count * 6);
  const points: ScenePoint[] = [];
  for (let i = 0; i < meta.count; i++) {
    points.push({ x: xyz[3 * i] / 100, y: xyz[3 * i + 1] / 100, z: xyz[3 * i + 2] / 100, ground: (flags[i] & 1) === 1 });
  }
  cache = { points, boxes: meta.boxes as Box[] };
  return cache;
}

/** Points of the scene inside a box (with a small margin), as offsets in the box frame: u along the car, v across, z up. */
export function pointsInBox(b: Box, margin = 0.1) {
  const [cx, cy, cz] = b.center, [w, l, h] = b.size, c = Math.cos(-b.yaw), s = Math.sin(-b.yaw);
  const out: ScenePoint[] = [];
  for (const p of loadScene().points) {
    if (p.ground) continue;
    const dx = p.x - cx, dy = p.y - cy;
    const v = dx * c - dy * s, u = dx * s + dy * c;
    if (Math.abs(v) < w / 2 + margin && Math.abs(u) < l / 2 + margin && p.z > cz - h / 2 + 0.05 && p.z < cz + h / 2 + margin) out.push(p);
  }
  return out;
}

/** Deterministic pseudo-random numbers in [0, 1). */
export const rng = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** Every k-th element (a light, evenly spread subsample). */
export const every = <T>(a: T[], k: number) => a.filter((_, i) => i % k === 0);

/** Round to centimetres, so the JSON embedded in the page stays short. */
export const cm = (v: number) => Math.round(v * 100) / 100;

/** Pack small integers (0–255) into a base64 string; the figure decodes it with atob. */
export const packBytes = (a: number[]) => Buffer.from(Uint8Array.from(a.map((v) => Math.max(0, Math.min(255, Math.round(v)))))).toString('base64');
