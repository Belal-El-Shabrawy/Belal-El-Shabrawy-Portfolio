# Migrating Your 3D Portfolio: Vite → Next.js

Congrats on finishing the Vite version! Before touching anything: **commit and push what you have now**, and consider tagging it (`git tag vite-version`) or keeping it on a `main`/`vite` branch. That way you always have a working fallback while you migrate.

Do the migration on a new branch or a fresh folder — don't edit the working Vite project in place.

---

## Phase 0: Scaffold the new project

```bash
npx create-next-app@latest 3d-portfolio-next
```
When prompted: App Router = **Yes**, Tailwind = **No** (you'll set up v3 manually to match your existing config), `src/` directory = your call, TypeScript = your call (your current project is plain JS, so "No" keeps things consistent).

---

## Phase 1: Install dependencies

Match what your Vite project already uses:

```bash
npm install three @react-three/fiber @react-three/drei @react-spring/three react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

(Drop `react-router-dom` once routing is fully converted in Phase 4 — you won't need it in Next.)

If `Contact.jsx` uses EmailJS, also install:
```bash
npm install @emailjs/browser
```

---

## Phase 2: Move your assets

- **3D models** (`island.glb`, and fox/bird/plane/sky if you added them): move into `public/models/`
- **Icons** (the `arrow` icon `InfoBox` uses, and anything else from `assets/icons`): move into `public/icons/`
- Any other images: `public/images/`

⚠️ **Specific gotcha in your code:** `InfoBox.jsx` does this:
```jsx
import {arrow} from '../../assets/icons'
...
<img src={arrow} className="w-4 h-4 object-contain"/>
```
In Next.js, local image imports resolve to an **object** (with a `.src` property), not a plain string — so `src={arrow}` would silently break. Simplest fix: move `arrow.svg` to `public/icons/arrow.svg` and reference it as a string path instead:
```jsx
<img src="/icons/arrow.svg" className="w-4 h-4 object-contain"/>
```

Same logic applies to `Island.jsx`'s model import:
```jsx
// Old (Vite):
import islandScene from "../../assets/3d/island.glb";
const { nodes, materials } = useGLTF(islandScene);

// New (Next.js) — after moving island.glb to public/models/:
const { nodes, materials } = useGLTF("/models/island.glb");
```

---

## Phase 3: Copy your components over

Copy these into the new project (e.g. `components/`):
- `NavBar.jsx`
- `Home.jsx`
- `Island.jsx`
- `Loader.jsx`
- `HomeInfo.jsx` (includes your `InfoBox` component)
- Any Fox/other model components
- `Contact.jsx`, `About.jsx`, `Projects.jsx`

---

## Phase 4: Convert routing

Delete `App.jsx`'s `BrowserRouter`/`Routes`/`Route` setup entirely. Next's App Router uses **folders**, not a router component:

```
app/
  page.jsx          ← Home (was "/")
  about/
    page.jsx        ← About (was "/about")
  projects/
    page.jsx        ← Projects (was "/projects")
  contact/
    page.jsx        ← Contact (was "/contact")
  layout.jsx         ← replaces main.jsx + wraps every page
```

Each `page.jsx` just renders what that page component used to render, e.g. `app/about/page.jsx`:
```jsx
import About from '@/components/About';
export default function AboutPage() {
  return <About />;
}
```

**`NavBar.jsx`** and **`InfoBox` (inside `HomeInfo.jsx`)** both use `react-router-dom`'s `Link`/`NavLink` — replace with Next's:

```jsx
// Old:
import { NavLink } from "react-router-dom";
<NavLink to="/about" className={({isActive}) => ...}>

// New:
import Link from "next/link";
import { usePathname } from "next/navigation";

const pathname = usePathname();
<Link href="/about" className={pathname === "/about" ? "text-blue-500" : "text-black"}>
```
Same swap in `InfoBox.jsx`: `import {Link} from 'react-router-dom'` → `import Link from 'next/link'`, and `to={link}` → `href={link}`.

---

## Phase 5: Add `'use client'` everywhere it's needed

Add this as the **very first line** of every file that uses hooks, `<Canvas>`, or browser APIs:

- `Home.jsx`
- `Island.jsx`
- `Loader.jsx`
- `NavBar.jsx` (uses `usePathname`)
- `HomeInfo.jsx` / `InfoBox`
- `Contact.jsx` (if it has form state or EmailJS calls)

```jsx
'use client';

import { Canvas } from "@react-three/fiber";
...
```

---

## Phase 6: Disable SSR for the Canvas scene

Even with `'use client'`, Next may attempt an initial server render pass and choke on WebGL. In `app/page.jsx`, load `Home` (which contains the `<Canvas>`) via `next/dynamic`:

```jsx
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('@/components/Home'), { ssr: false });

export default function HomePage() {
  return <Home />;
}
```

---

## Phase 7: Fonts and global CSS

Move your `index.css` content into `app/globals.css`, import it once in `app/layout.jsx`:

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
Your Google Fonts `@import` and all the `@layer utilities` classes (`.max-container`, `.head-text`, `.neo-brutalism-blue`, etc.) can be pasted in as-is — no changes needed there since you're staying on Tailwind v3 syntax.

---

## Phase 8: Update `tailwind.config.js`

Change the `content` paths to match Next's structure:
```js
content: [
  "./app/**/*.{js,jsx}",
  "./components/**/*.{js,jsx}",
],
```
Keep your existing `theme.extend` (colors, `fontFamily`, `boxShadow.card`) exactly as-is — that part doesn't change.

---

## Phase 9: Environment variables

If `Contact.jsx` uses EmailJS keys, rename them with the `NEXT_PUBLIC_` prefix in a `.env.local` file:
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
```
Update references in code from `import.meta.env.VITE_...` to `process.env.NEXT_PUBLIC_...`.

---

## Phase 10: Run it and fix SSR errors as they appear

```bash
npm run dev
```
Any `window is not defined` / `document is not defined` errors mean something still needs `'use client'` or a `dynamic(..., { ssr: false })` wrapper. Work through them one at a time.

---

## Phase 11: Deploy

Push to GitHub, import the repo into Vercel. No `vercel.json` needed this time — Next.js is natively understood by Vercel with zero config.

---

## Quick checklist

- [ ] New Next.js app scaffolded
- [ ] Dependencies installed
- [ ] Models moved to `public/models/`, imports updated to string paths
- [ ] Icons moved to `public/icons/`, `InfoBox` image src fixed
- [ ] Routes converted to `app/` folder structure
- [ ] `NavLink`/`Link` → `next/link` + `usePathname` in `NavBar.jsx` and `InfoBox`
- [ ] `'use client'` added to all interactive/3D components
- [ ] `Home` loaded via `next/dynamic` with `ssr: false`
- [ ] Global CSS moved into `app/globals.css`, imported in `layout.jsx`
- [ ] `tailwind.config.js` content paths updated
- [ ] Env vars renamed to `NEXT_PUBLIC_*`
- [ ] Dev server runs with no SSR errors
- [ ] Deployed to Vercel
