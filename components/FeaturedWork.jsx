import Image from 'next/image';
import Link from 'next/link';
import { projects } from '../constants';

// The three that carry the most weight, in the order a stranger should meet
// them. Named rather than sliced so reordering the projects array - which is
// driven by the /projects page - cannot silently change what the home page
// promotes.
const FEATURED = [
    {
        name: 'Cairo University AI Assistant',
        blurb: 'Arabic RAG over 27 faculty knowledge bases. I helped build the retrieval pipeline and was the tester for the model.',
    },
    {
        name: 'University Q&A CMS',
        blurb: 'The Next.js 16 and TypeScript CMS behind it: per-faculty auth, scoped Firebase tokens, Firestore rules, Arabic RTL.',
    },
    {
        name: 'Clinica Joelle',
        blurb: 'A live clinic site built as two custom WordPress themes from scratch - PHP templates, block patterns, design tokens.',
    },
];

const FeaturedWork = () => {
    const cards = FEATURED.map((f) => ({
        ...f,
        project: projects.find((p) => p.name === f.name),
    })).filter((c) => c.project);

    return (
        <section id="featured" className="max-container scroll-mt-24 pb-16">
            <h2 className="font-poppins text-3xl sm:text-4xl font-semibold">
                Featured <span className="blue-gradient_text font-semibold drop-shadow">work</span>
            </h2>
            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                Production systems, not exercises - two of them are in daily use at
                Cairo University.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map(({ name, blurb, project }) => (
                    <article key={name} className="flex flex-col">
                        <Image
                            src={project.imageUrl}
                            alt={`${name} screenshot`}
                            width={400}
                            height={220}
                            className="h-44 w-full rounded-xl border-2 border-black object-cover dark:border-slate-600"
                        />
                        <h3 className="mt-4 font-poppins text-xl font-semibold">{name}</h3>
                        <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
                            {blurb}
                        </p>
                        <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 font-poppins font-semibold text-blue-500 hover:text-blue-700"
                        >
                            {project.linkLabel || 'Live Demo'}
                            <Image
                                src="/icons/arrow.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="h-4 w-4 object-contain"
                            />
                        </Link>
                    </article>
                ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
                <Link
                    href="/projects"
                    className="rounded-lg border-2 border-black bg-gradient-to-br from-sky-400 to-blue-500 px-5 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                    See all projects
                </Link>
                <Link
                    href="/contact"
                    className="rounded-lg border-2 border-black bg-white px-5 py-2.5 font-bold text-black transition-colors hover:bg-black hover:text-white"
                >
                    Get in touch
                </Link>
            </div>
        </section>
    );
};

export default FeaturedWork;
