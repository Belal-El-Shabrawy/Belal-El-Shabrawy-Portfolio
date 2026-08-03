# Belal El-Shabrawy — Portfolio

An interactive 3D developer portfolio built with Next.js, React Three Fiber, and Tailwind CSS.

**Live site:** https://belal-elshabrawy-portfolio.vercel.app

## Tech stack
- Next.js 16 (App Router) · React 19
- Three.js / React Three Fiber for the 3D scene
- Tailwind CSS
- EmailJS for the contact form

## Running locally
```bash
npm install
npm run dev
```
Open http://localhost:3000. You'll need EmailJS env vars for the contact form to work — see `.env.example` (or ask, if you don't have one yet).

## Structure
- `app/` — routes (home, about, projects, contact)
- `components/` — page sections and 3D models
- `constants/` — skills, experience, and project data