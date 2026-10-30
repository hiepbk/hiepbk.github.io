// Build-time helpers for walkthrough figures: real LiDAR points taken from the home-page PandaSet scan.
import fs from 'node:fs';

export type P = [number, number, number];

const SCENE = 'public/data/pandaset-044-14';

/**
 * All non-ground LiDAR points of the best-observed car in the scene (the box with the most points),
 * in the box frame: u along the car, v across it, z up from the bottom of the box. Metres, rounded to cm.
 */
export function loadCar(): P[] {
  const meta = JSON.parse(fs.readFileSync(`${SCENE}.json`, 'utf8'));
  const buf = fs.readFileSync(`${SCENE}.bin`);
  const xyz = new Int16Array(buf.buffer, buf.byteOffset, meta.count * 3);
  const flags = buf.subarray(meta.count * 6);
  let car: P[] = [];
  for (const b of meta.boxes) {
    const [cx, cy, cz] = b.center, [w, l, h] = b.size, c = Math.cos(-b.yaw), s = Math.sin(-b.yaw);
    const pts: P[] = [];
    for (let i = 0; i < meta.count; i++) {
      if (flags[i] & 1) continue;
      const dx = xyz[3 * i] / 100 - cx, dy = xyz[3 * i + 1] / 100 - cy, z = xyz[3 * i + 2] / 100;
      const v = dx * c - dy * s, u = dx * s + dy * c;
      if (Math.abs(v) < w / 2 + 0.1 && Math.abs(u) < l / 2 + 0.1 && z > cz - h / 2 + 0.05 && z < cz + h / 2 + 0.1) {
        pts.push([u, v, z - (cz - h / 2)]);
      }
    }
    if (pts.length > car.length) car = pts;
  }
  return car.map((p) => p.map((v) => Math.round(v * 100) / 100) as P);
}

/** Farthest point sampling: n well-spread points; any prefix of the result still covers the shape. */
export function farthestPointSample(pts: P[], n: number): P[] {
  const picked: P[] = [pts[0]];
  const dist = pts.map(() => Infinity);
  for (let k = 1; k < n; k++) {
    const last = picked[k - 1];
    let best = 0;
    pts.forEach((p, i) => {
      dist[i] = Math.min(dist[i], (p[0] - last[0]) ** 2 + (p[1] - last[1]) ** 2 + (p[2] - last[2]) ** 2);
      if (dist[i] > dist[best]) best = i;
    });
    picked.push(pts[best]);
  }
  return picked;
}
