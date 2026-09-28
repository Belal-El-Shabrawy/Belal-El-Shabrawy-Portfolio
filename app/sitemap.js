const siteUrl = 'https://www.belalalaa.com';

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    ...['/theatre', '/ar/theatre'].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: { en: `${siteUrl}/theatre`, ar: `${siteUrl}/ar/theatre` },
      },
    })),
  ];
}
