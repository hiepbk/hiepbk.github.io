"""Export one PandaSet frame (surround view) for the home-page animation.

Usage: python3 scripts/export_pandaset_scene.py <pandaset root> <info pkl> <lidar token, e.g. 069_53> <rotation deg> <out prefix>
The info pkl (hiepdet3d format) provides lidar_path (x, y, z, i, t float32), official_segment_path
(uint8 PandaSet semseg classes) and gt_boxes [x, y, z, dx, dy, dz, yaw] in the same frame.
<rotation deg> turns the scan so the street runs along +Y.
Writes <out>.bin (int16 xyz in cm, then a uint8 flag per point: bit 0 = ground, bit 1 = labelled area,
always set because PandaSet is labelled all around) and <out>.json (grid, boxes).
Output frame: X right, Y forward, Z up, road surface at Z = 0. Outside the voxel grid only static context
(buildings, vegetation, poles, signs, ...) is kept, so every visible object has a box.
PandaSet is released under CC BY 4.0 by Hesai and Scale AI.
"""
import json, pickle, sys
import numpy as np

root, pkl, token, rot_deg, out = sys.argv[1:6]
info = next(x for x in pickle.load(open(pkl, 'rb')) if x['lidar_token'] == token)
GRID_MIN, GRID_SIZE = [-16.0, -20.0, 0.0], [32.0, 40.0, 3.2]

pts = np.fromfile(f"{root}/{info['lidar_path']}", dtype=np.float32).reshape(-1, 5)[:, :3]
seg = np.fromfile(f"{root}/{info['official_segment_path']}", dtype=np.uint8)
ground = np.isin(seg, range(6, 13))  # ground, road, lane/stop/road markings, sidewalk, driveway
dynamic = (seg >= 13) & (seg <= 33)  # vehicles, riders, pedestrians, animals

rot = np.radians(float(rot_deg))
R = np.array([[np.cos(rot), -np.sin(rot)], [np.sin(rot), np.cos(rot)]])
xy = pts[:, :2] @ R.T

# Road plane z = a*x + b*y + c, least squares on nearby ground points
g = ground & (np.hypot(xy[:, 0], xy[:, 1]) < 30)
plane = np.linalg.lstsq(np.c_[xy[g], np.ones(g.sum())], pts[g, 2], rcond=None)[0]
height = lambda p, z: z - (p @ plane[:2] + plane[2])
Z = height(xy, pts[:, 2])

def in_grid(p):
    return ((p[:, 0] > GRID_MIN[0]) & (p[:, 0] < GRID_MIN[0] + GRID_SIZE[0]) &
            (p[:, 1] > GRID_MIN[1]) & (p[:, 1] < GRID_MIN[1] + GRID_SIZE[1]))
inside = in_grid(xy)
view = (np.abs(xy[:, 0]) < 34) & (np.abs(xy[:, 1]) < 38) & (Z > -0.5) & (Z < 12)
rng = np.random.default_rng(0)
sel = view & (inside | ~dynamic)
sel &= ~ground | (rng.random(len(Z)) < np.where(inside, 0.6, 0.35))  # thin out the ground
xyz = np.round(np.c_[xy[sel], Z[sel]] * 100).astype(np.int16)
flags = ground[sel].astype(np.uint8) | 2
with open(f'{out}.bin', 'wb') as f:
    f.write(xyz.tobytes())
    f.write(flags.tobytes())

boxes = []
for b, name, n in zip(info['gt_boxes'], info['gt_names'], info['num_lidar_pts']):
    cxy = b[:2] @ R.T
    if name != 'Car' or n < 5 or not in_grid(cxy[None])[0]:
        continue
    boxes.append({
        'center': [round(float(cxy[0]), 2), round(float(cxy[1]), 2), round(float(height(cxy, b[2])), 2)],
        'size': [round(float(b[4]), 2), round(float(b[3]), 2), round(float(b[5]), 2)],
        'yaw': round(float(b[6] + rot - np.pi / 2), 3),  # our boxes have their length along +Y at yaw 0
        'label': 'car',
        'kind': 0,
    })
meta = {
    'source': f"PandaSet sequence {info['scene']}, frame {info['frame']}",
    'count': int(sel.sum()),
    'grid': {'min': GRID_MIN, 'size': GRID_SIZE},
    'boxes': boxes,
}
json.dump(meta, open(f'{out}.json', 'w'), indent=1)
print(meta['source'], '|', meta['count'], 'points,', len(boxes), 'cars')
