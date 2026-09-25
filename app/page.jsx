import HomeClient from '@/components/HomeClient';
import HomeHero from '@/components/HomeHero';
import FeaturedWork from '@/components/FeaturedWork';

export const metadata = {
  alternates: { canonical: '/' },
  description:
    "Full-stack developer and Computer Science & AI student at Cairo University. Software Engineer at Clinica Joelle and CSDS, building production web apps with Next.js, TypeScript and Firebase.",
};

export default function HomePage() {
  return (
    <>
      {/* The scene stays exactly one viewport tall - that is what keeps the
          island fully framed on a phone - but the page no longer ends there. */}
      <section className="relative w-full h-screen-safe overflow-hidden">
        <HomeClient />
        <HomeHero />

        {/* Dragging the canvas rotates the island rather than scrolling, so a
            phone needs an explicit way down. This is a real anchor, not a cue. */}
        <a
          href="#featured"
          className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-max items-center gap-2 rounded-full border-2 border-black bg-white/90 px-4 py-2 text-sm font-bold text-black backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:bg-slate-900/85 dark:text-white"
        >
          Featured work
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      <FeaturedWork />
    </>
  );
}
