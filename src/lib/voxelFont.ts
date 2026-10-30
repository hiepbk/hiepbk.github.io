// 5×7 pixel font for the voxel site name, shared by the SVG fallback and the three.js logo.
const FONT: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
};

export const ROWS = 7;

/** Occupied cells (x = column, y = row from the top) and the total column count. */
export function layoutText(text: string) {
  const cells: { x: number; y: number }[] = [];
  let col = 0;
  for (const ch of text) {
    if (ch === ' ') { col += 3; continue; }
    const g = FONT[ch];
    g.forEach((row, r) => [...row].forEach((v, c) => v === '#' && cells.push({ x: col + c, y: r })));
    col += g[0].length + 1;
  }
  return { cells, cols: col - 1 };
}

/** Navy → blue gradient along x with a small deterministic per-voxel variation, as RGB 0–255. */
export function voxelColor(x: number, y: number, cols: number): [number, number, number] {
  const A = [23, 47, 110], B = [52, 104, 222];
  const t = x / cols;
  const jitter = 0.88 + 0.24 * ((((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) + 1) % 1);
  return A.map((a, i) => Math.min(255, (a + (B[i] - a) * t) * jitter)) as [number, number, number];
}
