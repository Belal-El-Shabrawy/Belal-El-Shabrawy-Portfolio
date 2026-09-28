import { Cairo } from 'next/font/google';
import Theatre from '@/components/Theatre';

// Poppins and Work Sans have no Arabic glyphs. Loaded here rather than in the
// root layout so only the Arabic page downloads it.
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata = {
  // absolute: the root layout's English "%s | Belal Alaa El-Shabrawy" template
  // would otherwise be appended to an Arabic title.
  title: { absolute: 'بلال علاء الشبراوي | بلال الشبراوي على المسرح' },
  description:
    'بلال علاء الشبراوي (بلال الشبراوي): ممثل مسرحي مع فريق مسرح كلية الحاسبات والذكاء الاصطناعي بجامعة القاهرة، شارك في أكثر من عشرة عروض وحصل على المركز الثالث لأفضل ممثل دور ثانٍ ثلاث مرات، ومهندس برمجيات.',
  alternates: {
    canonical: '/ar/theatre',
    languages: { en: '/theatre', ar: '/ar/theatre', 'x-default': '/theatre' },
  },
  openGraph: {
    locale: 'ar_EG',
    title: 'بلال علاء الشبراوي على المسرح',
    description:
      'أكثر من عشرة عروض مسرحية وثلاث جوائز أفضل ممثل دور ثانٍ في مهرجانات جامعة القاهرة.',
  },
};

export default function ArabicTheatrePage() {
  return <Theatre lang="ar" className={cairo.variable} />;
}
