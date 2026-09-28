import { plays, awardPhoto } from '@/constants/theatre';

const siteUrl = 'https://www.belalalaa.com';

// Image sitemap entries for the theatre pages, so Google Images finds the
// stage and award photos without waiting to discover them by crawling.
const theatreImages = [awardPhoto.image, ...plays.map((p) => p.image).filter(Boolean)].map(
  (src) => `${siteUrl}${src}`,
);

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${siteUrl}/images/belal-portrait.jpeg`],
    },
    { url: `${siteUrl}/projects`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    ...['/theatre', '/ar/theatre'].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: theatreImages,
      alternates: {
        languages: { en: `${siteUrl}/theatre`, ar: `${siteUrl}/ar/theatre` },
      },
    })),
  ];
}
