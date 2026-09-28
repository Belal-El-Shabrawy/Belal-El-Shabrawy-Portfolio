import Image from 'next/image';
import Link from 'next/link';
import { plays, press, awards, awardPhoto } from '../constants/theatre';

const siteUrl = 'https://www.belalalaa.com';

const LANGS = [
    { code: 'en', label: 'English', href: '/theatre' },
    { code: 'ar', label: 'العربية', href: '/ar/theatre' },
];

const COPY = {
    en: {
        heading: ['On ', 'Stage'],
        lede: [
            "Alongside software, I act. I've performed in more than ten plays, most of them with the theatre team of the Faculty of Computers and Artificial Intelligence at Cairo University, and won third place for Best Supporting Actor three times at Cairo University's theatre festivals.",
        ],
        facts: ['10+ plays', '3 awards', 'On stage since 2023'],
        switchLabel: 'Page language',
        awards: 'Awards',
        plays: 'Plays',
        role: 'Role',
        noPhoto: 'No photo yet',
        poster: 'Poster',
        pressTitle: 'In the press',
        readArticle: 'Read the article',
        untitled: (outlet) => `Article on ${outlet}`,
        closing:
            'Theatre taught me to communicate clearly, work closely with a team and perform under pressure. I bring the same habits to my engineering work.',
        closingLink: 'See my software projects',
        dateLocale: 'en-GB',
    },
    ar: {
        heading: ['على ', 'المسرح'],
        lede: [
            'إلى جانب البرمجة، أنا ممثل مسرحي. شاركت في أكثر من عشرة عروض مسرحية، معظمها مع فريق مسرح كلية الحاسبات والذكاء الاصطناعي بجامعة القاهرة، وحصلت على المركز الثالث لأفضل ممثل دور ثانٍ ثلاث مرات في مهرجانات جامعة القاهرة المسرحية.',
        ],
        facts: ['أكثر من 10 عروض', '3 جوائز', 'على المسرح منذ 2023'],
        switchLabel: 'لغة الصفحة',
        awards: 'الجوائز',
        plays: 'العروض',
        role: 'الدور',
        noPhoto: 'لا توجد صورة بعد',
        poster: 'البوستر',
        pressTitle: 'في الصحافة',
        readArticle: 'اقرأ المقال',
        untitled: (outlet) => `مقال في ${outlet}`,
        closing:
            'علّمني المسرح التواصل بوضوح، والعمل ضمن فريق، والأداء تحت الضغط. وهي نفس المهارات التي أعتمد عليها في عملي كمطوّر برمجيات.',
        closingLink: 'شاهد مشاريعي البرمجية',
        dateLocale: 'ar-EG',
    },
};

// Adds the awards and press coverage to the same Person node the root layout
// declares (same @id), so Google files the actor from the Arabic articles and
// the developer on this site as one person.
const theatreJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Belal Alaa El-Shabrawy',
    alternateName: ['بلال علاء الشبراوي', 'بلال الشبراوي'],
    award: awards.map(
        (p) => `${p.award.en}, ${p.festival.en} ${p.year} (${p.title.en})`,
    ),
    subjectOf: press.map((a) => ({
        '@type': 'NewsArticle',
        url: a.url,
        ...(a.headline ? { headline: a.headline } : {}),
        datePublished: a.date,
        inLanguage: 'ar',
        publisher: { '@type': 'Organization', name: a.outlet.en },
    })),
};

const Theatre = ({ lang = 'en', className = '' }) => {
    const t = COPY[lang];
    const isAr = lang === 'ar';
    const formatDate = (iso) =>
        new Intl.DateTimeFormat(t.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
            new Date(`${iso}T12:00:00Z`),
        );

    return (
        <section
            lang={lang}
            dir={isAr ? 'rtl' : 'ltr'}
            className={`max-container ${isAr ? 'lang-ar' : ''} ${className}`}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(theatreJsonLd) }}
            />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="head-text">
                        {t.heading[0]}
                        <span className="blue-gradient_text font-semibold drop-shadow">{t.heading[1]}</span>
                    </h1>
                    <p className="mt-1 font-poppins text-lg font-medium text-slate-700 dark:text-slate-200">
                        {isAr ? (
                            <>
                                بلال علاء الشبراوي <span className="text-slate-400">·</span>{' '}
                                <span lang="en" dir="ltr">Belal Alaa El-Shabrawy</span>
                            </>
                        ) : (
                            <>
                                Belal Alaa El-Shabrawy <span className="text-slate-400">·</span>{' '}
                                <span lang="ar" dir="rtl">بلال علاء الشبراوي</span>
                            </>
                        )}
                    </p>
                </div>
                {/* Always English | العربية in that order (dir="ltr"), so the
                    control looks identical on both pages and only the
                    highlighted segment moves. Colour change only, no motion. */}
                <nav
                    aria-label={t.switchLabel}
                    dir="ltr"
                    className="inline-flex shrink-0 rounded-full border border-slate-200 bg-slate-100 p-1 text-sm font-medium dark:border-slate-700 dark:bg-slate-800"
                >
                    {LANGS.map((l) =>
                        l.code === lang ? (
                            <span
                                key={l.code}
                                lang={l.code}
                                aria-current="page"
                                className="rounded-full bg-white px-4 py-1.5 text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white"
                            >
                                {l.label}
                            </span>
                        ) : (
                            <Link
                                key={l.code}
                                href={l.href}
                                lang={l.code}
                                hrefLang={l.code}
                                className="rounded-full px-4 py-1.5 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-400 dark:hover:text-white"
                            >
                                {l.label}
                            </Link>
                        ),
                    )}
                </nav>
            </div>

            <div className="mt-5 flex max-w-3xl flex-col gap-3 text-slate-500 dark:text-slate-400">
                {t.lede.map((p) => (
                    <p key={p}>{p}</p>
                ))}
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
                {t.facts.map((f) => (
                    <li
                        key={f}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-slate-800 dark:text-blue-300"
                    >
                        {f}
                    </li>
                ))}
            </ul>

            {/* Awards */}
            <div className="py-12">
                <h2 className="subhead-text">{t.awards}</h2>
                <figure className="mx-auto mt-6 max-w-2xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-black dark:border-slate-600 sm:aspect-[16/9]">
                        {/* He stands at the right of the frame; bias the crop
                            there so the phone's narrower box keeps him in it. */}
                        <Image
                            src={awardPhoto.image}
                            alt={awardPhoto.alt[lang]}
                            fill
                            sizes="(min-width: 768px) 672px, 100vw"
                            className="object-cover object-[65%_40%]"
                        />
                    </div>
                    <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
                        {awardPhoto.caption[lang]}
                    </figcaption>
                </figure>
                <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                    {awards.map((p) => (
                        <li
                            key={p.slug}
                            className="flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-600 dark:bg-slate-800 dark:shadow-none"
                        >
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                                {p.year}
                            </span>
                            <span className="font-poppins text-lg font-semibold leading-snug text-black dark:text-slate-100">
                                {p.award[lang]}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{p.title[lang]}</span>
                            <span className="mt-auto text-xs text-slate-500 dark:text-slate-400">
                                {p.festival[lang]}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Plays */}
            <div className="pb-12">
                <h2 className="subhead-text">{t.plays}</h2>
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {plays.map((p) => (
                        <article key={p.slug} className="flex flex-col">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border-2 border-black bg-slate-900 dark:border-slate-600">
                                {p.image ? (
                                    <Image
                                        src={p.image}
                                        alt={
                                            p.imageIsPoster
                                                ? `${t.poster}: ${p.title[lang]}`
                                                : isAr
                                                    ? `بلال الشبراوي في دور ${p.role.ar} في عرض ${p.title.ar}`
                                                    : `Belal Alaa El-Shabrawy as ${p.role.en} in ${p.title.en}`
                                        }
                                        fill
                                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-blue-950 p-6 text-center">
                                        <span className="font-poppins text-4xl font-semibold text-white/90">{p.year}</span>
                                        <span className="text-sm text-blue-200/80">{t.noPhoto}</span>
                                    </div>
                                )}
                                {p.award && (
                                    <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-black shadow">
                                        {p.award[lang]}
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-4 font-poppins text-xl font-semibold">{p.title[lang]}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                                {p.year} · {t.role}: {p.role[lang]}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{p.festival[lang]}</p>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{p.about[lang]}</p>
                        </article>
                    ))}
                </div>
            </div>

            {/* Press */}
            <div className="pb-12">
                <h2 className="subhead-text">{t.pressTitle}</h2>
                <ul className="mt-6 flex flex-col divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
                    {press.map((a) => (
                        <li key={a.url} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {a.outlet[lang]} · {formatDate(a.date)}
                                </span>
                                {/* Headlines are Arabic on both pages; the fallback
                                    label is in the page's own language. */}
                                {a.headline ? (
                                    <span lang="ar" dir="rtl" className="text-start font-medium text-slate-800 dark:text-slate-100">
                                        {a.headline}
                                    </span>
                                ) : (
                                    <span className="font-medium text-slate-800 dark:text-slate-100">
                                        {t.untitled(a.outlet[lang])}
                                    </span>
                                )}
                            </div>
                            <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 font-semibold text-blue-500 hover:text-blue-700"
                            >
                                {t.readArticle} ↗
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />
            <div className="flex flex-col items-start gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-slate-600 dark:text-slate-300">{t.closing}</p>
                <Link
                    href="/projects"
                    className="shrink-0 rounded-lg border-2 border-black bg-gradient-to-br from-sky-400 to-blue-500 px-5 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                    {t.closingLink}
                </Link>
            </div>
        </section>
    );
};

export default Theatre;
