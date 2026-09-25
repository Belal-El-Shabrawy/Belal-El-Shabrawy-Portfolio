import Link from 'next/link';

// The one introduction, used in two places: as the static hero over the scene
// (components/HomeHero.jsx) and as the island's first rotation stop
// (components/HomeInfo.jsx). Shared rather than copied so the two can never
// drift apart.
//
// `as` exists because both are in the DOM at once - the hero is only faded out,
// not unmounted - and two <h1> elements on one page is a duplicate heading. The
// hero keeps the real h1; the rotation card renders a <p> that looks identical.
const IntroCard = ({ as: Heading = 'h1' }) => {
    return (
        <div className="pointer-events-auto w-full max-w-xl rounded-2xl border-2 sm:border-4 border-black bg-white/90 dark:bg-slate-900/85 backdrop-blur-md px-5 py-4 sm:px-8 sm:py-6 text-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Heading className="font-poppins text-xl sm:text-3xl font-semibold text-black dark:text-white">
                Belal El-Shabrawy
            </Heading>

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
    );
};

export default IntroCard;
