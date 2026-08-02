import './globals.css';
import { Poppins, Work_Sans } from 'next/font/google';
import NavBar from '@/components/NavBar';

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${workSans.variable}`}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
