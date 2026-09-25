import './globals.css';
import { Poppins, Work_Sans } from 'next/font/google';
import NavBar from '@/components/NavBar';
import MusicPlayer from '@/components/MusicPlayer';

// next/font downloads and self-hosts these at build time (no runtime request
// to fonts.googleapis.com, no render-blocking @import, no layout shift).
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-work-sans',
  display: 'swap',
});

// Without this the site shipped no <title> and no description at all, so every
// route showed the bare URL in search results and in link previews.
export const metadata = {
  metadataBase: new URL('https://belalalaa.com'),
  title: {
    default: "Belal El-Shabrawy - Full-Stack Developer",
    template: "%s | Belal El-Shabrawy",
  },
  description:
    "Full-stack developer and Computer Science & AI student at Cairo University. I build production web apps with Next.js, TypeScript, Firebase and Node.js.",
  keywords: [
    "Belal El-Shabrawy",
    "Belal Alaa",
    "belalalaa",
    "full-stack developer",
    "Next.js",
    "React",
    "TypeScript",
    "Firebase",
    "Egypt",
  ],
  authors: [{ name: "Belal El-Shabrawy" }],
  creator: "Belal El-Shabrawy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://belalalaa.com",
    siteName: "Belal El-Shabrawy",
    title: "Belal El-Shabrawy - Full-Stack Developer",
    description:
      "Full-stack developer and Computer Science & AI student at Cairo University. I build production web apps with Next.js, TypeScript, Firebase and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belal El-Shabrawy - Full-Stack Developer",
    description:
      "Full-stack developer and CS & AI student at Cairo University, building production web apps.",
  },
};

// Structured data (schema.org) describing who the site belongs to. The @id
// values tie the nodes together, so Google reads the site, the profile page and
// the GitHub/LinkedIn profiles as one person - what a name search matches on.
const siteUrl = 'https://belalalaa.com';
const personId = `${siteUrl}/#person`;

const identityJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Belal El-Shabrawy',
      givenName: 'Belal',
      familyName: 'El-Shabrawy',
      alternateName: ['Belal Alaa', 'Belal Alaa El-Shabrawy', 'belalalaa', 'بلال الشبراوي', 'بلال علاء'],
      url: siteUrl,
      image: {
        '@type': 'ImageObject',
        '@id': `${siteUrl}/#portrait`,
        url: `${siteUrl}/images/belal-portrait.jpeg`,
        caption: 'Belal El-Shabrawy',
      },
      jobTitle: 'Full-Stack Developer',
      description:
        'Full-stack developer and Computer Science & AI student at Cairo University, building production web apps with Next.js, TypeScript, Firebase and Node.js.',
      nationality: { '@type': 'Country', name: 'Egypt' },
      address: { '@type': 'PostalAddress', addressLocality: 'Cairo', addressCountry: 'EG' },
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Cairo University',
        sameAs: 'https://cu.edu.eg',
      },
      worksFor: [
        { '@type': 'Organization', name: 'Clinica Joelle', url: 'https://clinicajoelleegypt.com' },
        { '@type': 'Organization', name: 'CSDS - Cairo University' },
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Software Engineer',
        occupationLocation: { '@type': 'Country', name: 'Egypt' },
        skills: 'Next.js, React, TypeScript, JavaScript, Node.js, Express, Firebase, Three.js, Tailwind CSS, PHP, WordPress, Java',
      },
      knowsAbout: [
        'Full-stack web development',
        'Next.js',
        'React',
        'TypeScript',
        'Node.js',
        'Firebase',
        'Three.js',
        'WordPress',
        'Retrieval-augmented generation (RAG)',
      ],
      knowsLanguage: ['ar', 'en'],
      sameAs: [
        'https://github.com/Belal-El-Shabrawy',
        'https://www.linkedin.com/in/belal-el-shabrawy-26b406291/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Belal El-Shabrawy',
      alternateName: 'belalalaa.com',
      inLanguage: 'en',
      publisher: { '@id': personId },
      author: { '@id': personId },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: 'Belal El-Shabrawy - Full-Stack Developer',
      isPartOf: { '@id': `${siteUrl}/#website` },
      mainEntity: { '@id': personId },
      primaryImageOfPage: { '@id': `${siteUrl}/#portrait` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint so the page never flashes light then jumps
            to dark. It only sets the class; ThemeToggle reads it back after
            hydration. suppressHydrationWarning above is required because this
            makes the client's <html> class differ from the server's. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(identityJsonLd) }}
        />
      </head>
      <body className="bg-white text-black transition-colors dark:bg-slate-900 dark:text-slate-100">
        <NavBar />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}