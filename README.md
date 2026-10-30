# hiepbk.github.io

Personal academic website, built with [Astro](https://astro.build) and deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Local preview

```bash
npm install        # first time only
npm run dev        # http://localhost:4321, updates live as you edit
npm run build      # production build into dist/ (same as CI)
```

## Where the content lives

| What | File |
|---|---|
| Name, profile lines, avatar, social links, nav | `src/config.ts` |
| Short bio in the profile sidebar | `src/data/about.md` |
| Publications (`selected: 1, 2, 3` → shown on home in that order) | `src/data/publications.yaml` |
| Experience & education timeline | `src/data/experience.yaml` |
| Projects, one file each (`featured: true` → shown on home) | `src/content/projects/*.md(x)` |
| Home-page LiDAR scene (PandaSet frame) | `public/data/pandaset-044-14.*` |
| Images, PDFs and other static files | `public/` |

Every project gets its own page at `/projects/<file-name>/` showing its image large; any text
below the frontmatter is added to that page. Use `.mdx` to embed components (e.g. future demos).

The home-page animation (`src/components/VoxelHero.astro`) plays a real PandaSet frame (surround view,
CC BY 4.0 — keep the credit in the footer). To use another frame, re-export it with the hiepdet3d conda
env (needs numpy and the PandaSet infos) and update `SCENE` in the component. The last argument is the
rotation in degrees that puts the street along +Y:

```bash
python3 scripts/export_pandaset_scene.py <pandaset root> <infos .pkl> 044_14 -88.9 public/data/pandaset-044-14
```

`scripts/export_kitti_scene.py` exports a KITTI frame in the same format (the animation then also draws
the camera field of view, since KITTI is labelled only inside it).
