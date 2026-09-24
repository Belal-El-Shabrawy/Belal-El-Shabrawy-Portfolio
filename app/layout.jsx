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
  metadataBase: new URL('https://belal-elshabrawy-portfolio.vercel.app'),
  title: {
    default: "Belal El-Shabrawy - Full-Stack Developer",
    template: "%s | Belal El-Shabrawy",
  },
  description:
    "Full-stack developer and Computer Science & AI student at Cairo University. I build production web apps with Next.js, TypeScript, Firebase and Node.js.",
  keywords: [
    "Belal El-Shabrawy",
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
    url: "https://belal-elshabrawy-portfolio.vercel.app",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${workSans.variable}`}>
      <body>
        <NavBar />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}