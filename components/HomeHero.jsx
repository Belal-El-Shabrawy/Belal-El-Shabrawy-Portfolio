import Link from 'next/link';

// Deliberately a Server Component, and deliberately *outside* HomeClient.
// The 3D scene is a dynamic(ssr:false) import, so anything rendered inside it
// only appears after a ~900KB three.js chunk has downloaded and run. This card
// is in the initial HTML instead: it is on screen while the island is still
// loading, and it is what a crawler or a link preview sees.
const HomeHero = () => {
    return (
        <div className="home-hero absolute inset-x-0 top-20 sm:top-28 z-10 flex justify-center px-4 transition-opacity duration-500">
            <div className="pointer-events-auto w-full max-w-xl rounded-2xl border-2 sm:border-4 border-black bg-white/90 dark:bg-slate-900/85 backdrop-blur-md px-5 py-4 sm:px-8 sm:py-6 text-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="font-poppins text-xl sm:text-3xl font-semibold text-black dark:text-white">
                    Belal El-Shabrawy
                </h1>

                <p className="mt-1 text-sm sm:text-base font-medium blue-gradient_text">
                    Software Engineer at Clinica Joelle &amp; CSDS, Cairo University
                </p>

                {/* Hidden on the smallest screens on purpose: the earlier fix for
                    this page was to stop the copy covering the plane, and a third
                    line of text puts it straight back over the model. */}
                <p className="mt-3 hidden sm:block text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    I built the Arabic RAG pipeline behind Cairo University&apos;s
                    postgraduate assistant, and I ship production apps in Next.js,
                    TypeScript and Firebase.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <Link
                        href="/projects"
                        className="rounded-lg border-2 border-black bg-gradient-to-br from-sky-400 to-blue-500 px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                    >
                        View Projects
                    </Link>
                    <Link
                        href="/about"
                        className="rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
                    >
                        About Me
                    </Link>
                    <a
                        href="/Belal_Alaa_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
                    >
                        Download CV
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HomeHero;
