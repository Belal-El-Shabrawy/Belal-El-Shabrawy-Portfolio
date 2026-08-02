# 3D Portfolio: Vite → Next.js Migration — Handoff Summary

## Context
Migrating a React Three Fiber 3D portfolio site from Vite to Next.js (App Router, JavaScript, Tailwind v3, no `src/` dir assumption). Original guide followed: `nextjs-migration-guide.md` (11 phases). This document summarizes everything already done so another agent/session can continue without re-deriving it.

## Project structure (confirmed from screenshots)
```
3d-portfolio-next/
  app/
    page.jsx
    about/page.jsx
    projects/page.jsx
    contact/page.jsx
  components/
    Home.jsx
    NavBar.jsx
    HomeInfo.jsx
    Loader.jsx
    Contact.jsx
    About.jsx
    Projects.jsx
    CTA.jsx
    Alert.jsx
    models/
      Island.jsx
      Sky.jsx
      Bird.jsx
      Plane.jsx
      Fox.jsx
  constants/
    index.js
  hooks/
    useAlert.js
  public/
    3d/            ← bird.glb, fox.glb, island.glb, plane.glb, sky.glb
    icons/         ← arrow.svg, car.svg, contact.svg, css.svg, estate.svg,
                      express.svg, FireBase.svg, git.svg, github.svg, html.svg,
                      javascript.svg, linkedin.svg, nextjs.svg, nodejs.svg,
                      pricewise.svg, react.svg, snapgram.svg, soundoff.png,
                      soundon.png, summiz.svg, tailwindcss.svg, threads.svg,
                      Three.png, twitter.svg, typescript.svg
    images/        ← Depi.png, scale.png, hero.jpg (unused), logo.svg (unused)
    audio/         ← sakura.mp3 (needs to be moved by user)
```

**Important:** models are in `public/3d/`, NOT `public/models/`.

## Code changes made (all files below already delivered as a zip)

### `app/page.jsx`
```jsx
'use client';

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('@/components/Home'), { ssr: false });

export default function HomePage() {
  return <Home />;
}
```
Note: `'use client'` is REQUIRED here — Next.js App Router disallows `dynamic(..., { ssr: false })` inside a Server Component. This was a real error hit and fixed during migration.

### `app/about/page.jsx`
```jsx
import About from '@/components/About';

export default function AboutPage() {
  return <About />;
}
```

### `app/projects/page.jsx`
```jsx
import Projects from '@/components/Projects';

export default function ProjectsPage() {
  return <Projects />;
}
```

### `app/contact/page.jsx`
```jsx
'use client';

import dynamic from 'next/dynamic';

// Contact also renders a <Canvas> (the Fox model), so it needs the same
// ssr: false treatment as Home to avoid WebGL SSR errors.
const Contact = dynamic(() => import('@/components/Contact'), { ssr: false });

export default function ContactPage() {
  return <Contact />;
}
```

### `app/layout.jsx` — NOT YET DONE (still needed)
Should import global CSS and wrap children:
```jsx
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### `components/Home.jsx`
- Added `'use client'`
- Imports fixed to relative paths: `./Loader`, `./models/Island`, `./models/Sky`, `./models/Bird`, `./models/Plane`, `./HomeInfo`
- Removed old `import {soundoff,soundon} from "../../assets/icons"` and `import sakura from "../../assets/sakura.mp3"` — replaced with string paths: `/icons/soundoff.png`, `/icons/soundon.png` (confirmed as `.png`, not `.svg`), and `/audio/sakura.mp3`
- `audioRef` initialization moved into a `useEffect` (`new Audio(...)` needs to happen client-side; original did it inline in the component body which also works since this component only renders client-side via `dynamic(ssr:false)`, but the effect version is safer)

### `components/models/Island.jsx`, `Sky.jsx`, `Bird.jsx`, `Plane.jsx`, `Fox.jsx`
- All got `'use client'` added (they use hooks / `useFrame` / `useGLTF` / browser APIs)
- All `useGLTF(...)` calls changed from local `.glb` imports to string paths under `/3d/`:
  - Island: `useGLTF("/3d/island.glb")`
  - Sky: `useGLTF("/3d/sky.glb")`
  - Bird: `useGLTF("/3d/bird.glb")`
  - Plane: `useGLTF("/3d/plane.glb")`
  - Fox: `useGLTF("/3d/fox.glb")`
  - **(Initially these were written as `/models/xxx.glb` — corrected to `/3d/xxx.glb` after confirming the actual public folder structure.)**

### `components/Loader.jsx`
- Added `'use client'` (uses `<Html>` from drei, which touches the DOM) — otherwise unchanged.

### `components/NavBar.jsx`
- Added `'use client'`
- Replaced `react-router-dom`'s `NavLink` with `next/link`'s `Link` + `usePathname()` from `next/navigation` for active-link styling.

### `components/HomeInfo.jsx`
- Added `'use client'`
- Replaced `react-router-dom`'s `Link`(`to=`) with `next/link`'s `Link` (`href=`)
- Removed `import {arrow} from '../../assets/icons'` → replaced with string path `/icons/arrow.svg`

### `components/Contact.jsx`
- Added `'use client'`
- Fixed imports: `./Alert`, `./models/Fox`, `./Loader`, `../hooks/useAlert`
- Changed `import.meta.env.VITE_APP_EMAILJS_*` → `process.env.NEXT_PUBLIC_EMAILJS_*` (three vars: `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`)

### `components/About.jsx`
- Fixed imports: `./CTA`, `../constants` (no `'use client'` added — not required unless `react-vertical-timeline-component` throws an SSR error, in which case add it)

### `components/Projects.jsx`
- Removed `react-router-dom`'s `Link` → replaced with `next/link`'s `Link` (`href=` instead of `to=`)
- Removed `import {arrow} from '../../assets/icons'` → `/icons/arrow.svg`
- Fixed `../constants`, `./CTA` imports

### `components/CTA.jsx`
- Replaced `react-router-dom`'s `Link` with `next/link`'s `Link`

### `components/Alert.jsx`
- No changes needed, just relocated.

### `hooks/useAlert.js`
- No changes needed, just relocated (was originally imported as `../hooks/useAlert.js` from `Contact.jsx`, kept consistent).

### `constants/index.js`
Rewrote every icon/image import from Vite's `import x from './x.svg'` bundler-object style to Next.js public-folder string paths, VERIFIED against the user's actual `assets/icons/index.js` and `assets/images/index.js` files:
- All icons `.svg` EXCEPT:
  - `soundon.png`, `soundoff.png` (confirmed `.png`)
  - `Three.png` (confirmed `.png`, capital T — used for the "Three.js" skill icon)
  - `FireBase.svg` (confirmed capital F and B — NOT lowercase `firebase.svg`; this was a real casing bug caught from the user's screenshot of `public/icons/`)
- Images: `/images/scale.png`, `/images/Depi.png` (both confirmed correct)
- `skills` array: each `imageUrl` now a string path like `/icons/nextjs.svg`
- `experiences` array: `icon` fields point to `/images/scale.png`, `/images/Depi.png`, `/icons/github.svg`
- `socialLinks` and `projects` arrays: `iconUrl` fields converted similarly (`/icons/contact.svg`, `/icons/github.svg`, `/icons/linkedin.svg`, `/icons/summiz.svg`, `/icons/snapgram.svg`, `/icons/car.svg`)
- Dropped unused dead imports that existed in the original Vite file but were never referenced in the exported arrays (`estate`, `pricewise`, `threads`, `twitter`, `hero`, `logo`)

## Known real errors hit and fixed during this migration
1. **`ssr: false is not allowed with next/dynamic in Server Components`** — Next.js App Router requires the file calling `dynamic(..., {ssr:false})` to itself be a Client Component. Fixed by adding `'use client'` to `app/page.jsx` and `app/contact/page.jsx`.
2. **Icon/model path assumptions were initially wrong** and had to be corrected against the user's real files:
   - Models are under `public/3d/`, not `public/models/`
   - `Three.png` not `three.svg`
   - `soundon.png`/`soundoff.png` not `.svg`
   - `FireBase.svg` not `firebase.svg` (case-sensitivity risk on Vercel/Linux even though it "works" on Windows locally)

## Still outstanding (not yet done)
1. **`app/layout.jsx`** — needs to import `globals.css` and wrap `<html>`/`<body>`. Not yet confirmed done.
2. **`app/globals.css`** — user's old `index.css` content (Google Fonts `@import`, Tailwind `@layer utilities` classes like `.max-container`, `.head-text`, `.neo-brutalism-blue`, etc.) needs to be pasted in as-is.
3. **`tailwind.config.js`** — `content` paths need updating to:
   ```js
   content: [
     "./app/**/*.{js,jsx}",
     "./components/**/*.{js,jsx}",
   ],
   ```
   `theme.extend` (colors, fontFamily, boxShadow.card) carries over unchanged.
4. **`.env.local`** — needs real EmailJS values:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```
5. **`public/audio/sakura.mp3`** — needs to be confirmed moved (referenced as `/audio/sakura.mp3` in `Home.jsx`).
6. **Full `npm run dev` smoke test** across all 4 routes (`/`, `/about`, `/projects`, `/contact`) — not yet confirmed clean. Watch for:
   - Any remaining `window is not defined`/`document is not defined` (would mean another file needs `'use client'` — `About.jsx` with `react-vertical-timeline-component` is the most likely remaining suspect if this occurs)
   - 404s on any icon/image/model paths — usually a filename casing mismatch; do a full manual diff between `constants/index.js` paths and actual filenames in `public/icons/` and `public/images/` (Windows dev won't catch these, Vercel will)
   - There is also a stray `components/app` folder visible in one screenshot that may be a leftover empty folder — should be deleted since Next.js route folders must live under the top-level `app/`, not `components/app`.
7. **Deploy to Vercel** — push to GitHub, import repo, no `vercel.json` needed.

## Files not modified (verify these are just moved/copied as-is)
- `Alert.jsx`
- `useAlert.js`
