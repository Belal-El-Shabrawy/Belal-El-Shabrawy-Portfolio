import Theatre from '@/components/Theatre';

export const metadata = {
  title: 'Theatre',
  description:
    'Belal Alaa El-Shabrawy (بلال الشبراوي) on stage: more than ten plays with the Cairo University Faculty of Computers and AI theatre team and three Best Supporting Actor awards at Cairo University theatre festivals.',
  alternates: {
    canonical: '/theatre',
    languages: { en: '/theatre', ar: '/ar/theatre', 'x-default': '/theatre' },
  },
};

export default function TheatrePage() {
  return <Theatre lang="en" />;
}
