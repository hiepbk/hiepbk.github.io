"""Export one KITTI 3D-object frame for the home-page animation.

Usage: python3 scripts/export_kitti_scene.py <kitti/training dir> <frame id> <out prefix>
Writes <out>.bin (int16 xyz in cm, then a uint8 flag per point: bit 0 = ground, bit 1 = inside the
camera field of view) and <out>.json (boxes and the camera FOV).
Output frame: X right, Y forward, Z up, road surface at Z = 0. KITTI only labels objects inside the
front camera's field of view, so the animation voxelizes only points inside it.
"""
import json, sys
import numpy as np

root, fid, out = sys.argv[1:4]
pts = np.fromfile(f'{root}/velodyne/{fid}.bin', dtype=np.float32).reshape(-1, 4)[:, :3]
cal = {}
for line in open(f'{root}/calib/{fid}.txt'):
    if ':' in line:
        k, v = line.split(':', 1)
        cal[k] = np.array([float(x) for x in v.split()])
R0 = np.eye(4); R0[:3, :3] = cal['R0_rect'].reshape(3, 3)
V2C = np.eye(4); V2C[:3, :4] = cal['Tr_velo_to_cam'].reshape(3, 4)
C2V = np.linalg.inv(R0 @ V2C)
P2 = cal['P2'].reshape(3, 4)

# Camera FOV: project points into image 2 (1242 px wide) and keep those in front of the camera
IMG_W = 1242
cam = (P2 @ (R0 @ V2C) @ np.c_[pts, np.ones(len(pts))].T).T
in_fov = (cam[:, 2] > 0.5) & (cam[:, 0] / cam[:, 2] >= 0) & (cam[:, 0] / cam[:, 2] < IMG_W)
half_fov = float(np.arctan((IMG_W / 2) / P2[0, 0]))

# Ground plane z = a*x + b*y + c, fitted with RANSAC on low points
rng = np.random.default_rng(0)
low = pts[(pts[:, 2] < -1.2) & (np.abs(pts[:, 1]) < 20) & (pts[:, 0] > -10) & (pts[:, 0] < 50)]
best, best_n = None, 0
for _ in range(300):
    s = low[rng.choice(len(low), 3, replace=False)]
    try:
        coef = np.linalg.solve(np.c_[s[:, :2], np.ones(3)], s[:, 2])
    except np.linalg.LinAlgError:
        continue
    n = (np.abs(low[:, :2] @ coef[:2] + coef[2] - low[:, 2]) < 0.12).sum()
    if n > best_n:
        best, best_n = coef, n
height = lambda xy, z: z - (xy @ best[:2] + best[2])

# Lidar (x forward, y left) -> scene (X right, Y forward)
X, Y, Z = -pts[:, 1], pts[:, 0], height(pts[:, :2], pts[:, 2])
ground = np.abs(Z) < 0.2
sel = (np.abs(X) < 34) & (Y > -24) & (Y < 62) & (Z > -0.5) & (Z < 10)
sel &= ~ground | (rng.random(len(Z)) < np.where(in_fov, 0.7, 0.4))  # thin out the ground
xyz = np.round(np.c_[X[sel], Y[sel], Z[sel]] * 100).astype(np.int16)
flags = ground[sel].astype(np.uint8) | (in_fov[sel].astype(np.uint8) << 1)
with open(f'{out}.bin', 'wb') as f:
    f.write(xyz.tobytes())
    f.write(flags.tobytes())

boxes = []
for line in open(f'{root}/label_2/{fid}.txt'):
    p = line.split()
    if p[0] not in ('Car', 'Van', 'Truck', 'Pedestrian', 'Cyclist'):
        continue
    h, w, l = map(float, p[8:11])
    c = (C2V @ np.array([*map(float, p[11:14]), 1.0]))[:3]  # bottom centre, lidar frame
    yaw = -float(p[14]) - np.pi / 2                          # heading about z in the lidar frame
    boxes.append({
        'center': [round(-c[1], 2), round(c[0], 2), round(float(height(c[:2], c[2])) + h / 2, 2)],
        'size': [round(w, 2), round(l, 2), round(h, 2)],
        'yaw': round(yaw, 3),  # lidar heading equals our yaw (length along +Y at yaw 0)
        'label': p[0].lower(),
        'kind': 0 if p[0] in ('Car', 'Van', 'Truck') else 1,
    })
meta = {'source': f'KITTI 3D object, training frame {fid}', 'count': int(sel.sum()), 'halfFov': round(half_fov, 4),
        'grid': {'min': [-22.4, 0.0, 0.0], 'size': [44.8, 48.0, 3.2]}, 'boxes': boxes}
json.dump(meta, open(f'{out}.json', 'w'), indent=1)
print(meta['source'], '|', meta['count'], 'points,', len(boxes), 'boxes | FOV', round(np.degrees(2 * half_fov), 1), 'deg')
