// Theatre work, in both languages. The English page (/theatre) and the Arabic
// page (/ar/theatre) render from this one list, so the two can never disagree
// about a year, a role or an award.

const FESTIVALS = {
    short: {
        en: 'Cairo University Theatre Festival for Short Plays',
        ar: 'مهرجان جامعة القاهرة للعروض القصيرة',
    },
    long: {
        en: 'Cairo University Theatre Festival for Long Plays',
        ar: 'مهرجان جامعة القاهرة للعروض الطويلة',
    },
    cigut: {
        en: 'Cairo International Gathering for University Theatre',
        ar: 'ملتقى القاهرة الدولي للمسرح الجامعي',
    },
};

const AWARD = {
    en: 'Third Place, Best Supporting Actor',
    ar: 'المركز الثالث - أفضل ممثل دور ثانٍ',
};

// Newest first.
export const plays = [
    {
        slug: 'edge-of-the-world',
        year: 2026,
        title: { en: 'The Edge of the World', ar: 'حافة العالم' },
        role: { en: 'Prisoner No. 2', ar: 'السجين رقم 2' },
        festival: FESTIVALS.long,
        universityTeam: true,
        about: {
            en: 'A play about Native Americans and how leadership changes people.',
            ar: 'عرض عن السكان الأصليين لأمريكا، وكيف تغيّر القيادة البشر.',
        },
        image: '/theatre/edge-of-the-world.jpeg',
    },
    {
        slug: '40-waves-before-drowning',
        year: 2025,
        title: { en: '40 Waves Before Drowning', ar: 'أربعون موجة قبل الغرق' },
        role: { en: 'The Uncle', ar: 'العم' },
        festival: FESTIVALS.short,
        universityTeam: true,
        award: AWARD,
        about: {
            en: "An Egyptian psychological drama about a man's struggle with a hereditary mental illness and the weight of his past.",
            ar: 'دراما نفسية مصرية عن صراع رجل مع مرض نفسي وراثي وثقل ماضيه.',
        },
        image: '/theatre/40-waves.jpeg',
    },
    {
        slug: 'they-passed-from-here',
        year: 2025,
        title: { en: 'They Passed from Here', ar: 'مرّوا من هنا' },
        role: { en: 'Yuri', ar: 'يوري' },
        festival: FESTIVALS.long,
        universityTeam: true,
        award: AWARD,
        about: {
            en: 'The secrets of a house full of immigrants in the middle of World War II.',
            ar: 'أسرار بيت يسكنه المهاجرون في قلب الحرب العالمية الثانية.',
        },
        image: '/theatre/they-passed-from-here.jpeg',
    },
    {
        slug: 'maskar',
        year: 2025,
        title: { en: 'Maskar (Closed)', ar: 'مسكّر' },
        role: { en: 'The Son', ar: 'الابن' },
        festival: FESTIVALS.cigut,
        universityTeam: false,
        about: {
            en: 'A youth drama about the masks people wear and the conflicts hidden inside them.',
            ar: 'دراما شبابية عن الأقنعة التي نرتديها والصراعات المخفية داخل النفس.',
        },
        image: '/theatre/maskar-poster.jpeg',
        imageIsPoster: true,
    },
    {
        slug: 'last-days-of-autumn',
        year: 2024,
        title: { en: 'The Last Days of Autumn', ar: 'آخر أيام الخريف' },
        role: { en: 'The Laughing Clown', ar: 'المهرج الضاحك' },
        festival: FESTIVALS.short,
        universityTeam: true,
        award: AWARD,
        about: {
            en: 'A psychological play about the dark side of mental illness.',
            ar: 'عرض نفسي يكشف الجانب المظلم من المرض النفسي.',
        },
        image: '/theatre/last-days-of-autumn.jpeg',
    },
    {
        slug: 'death-of-a-salesman',
        year: 2023,
        title: { en: 'Death of a Salesman', ar: 'وفاة بائع متجول' },
        role: { en: 'Howard', ar: 'هوارد' },
        festival: FESTIVALS.short,
        universityTeam: true,
        about: {
            en: "Arthur Miller's classic about the dark side of the American Dream.",
            ar: 'كلاسيكية آرثر ميلر عن الوجه المظلم للحلم الأمريكي.',
        },
        image: '/theatre/death-of-a-salesman-poster.jpeg',
        imageIsPoster: true,
    },
];

export const press = [
    {
        outlet: { en: 'Youm7', ar: 'اليوم السابع' },
        date: '2026-02-07',
        headline: '«أربعون موجه قبل الغرق» على مسرح نهاد صليحة.. الأحد',
        url: 'https://www.youm7.com/story/2026/2/7/%D8%A3%D8%B1%D8%A8%D8%B9%D9%88%D9%86-%D9%85%D9%88%D8%AC%D9%87-%D9%82%D8%A8%D9%84-%D8%A7%D9%84%D8%BA%D8%B1%D9%82-%D8%B9%D9%84%D9%89-%D9%85%D8%B3%D8%B1%D8%AD-%D9%86%D9%87%D8%A7%D8%AF-%D8%B5%D9%84%D9%8A%D8%AD%D8%A9-%D8%A7%D9%84%D8%A3%D8%AD%D8%AF/7295643',
    },
    {
        outlet: { en: 'El Shorouk', ar: 'الشروق' },
        date: '2025-10-28',
        headline: 'العرض المسرحي «مسكر» كامل العدد بملتقى القاهرة الدولي للمسرح الجامعي',
        url: 'https://www.shorouknews.com/news/view.aspx?cdate=28102025&id=f73f6279-7bb2-48df-901b-c8284b3fe36a',
    },
    {
        outlet: { en: 'El Shorouk', ar: 'الشروق' },
        date: '2025-10-26',
        headline: 'اليوم.. العرض المسرحي «مسكر» يشارك في ملتقى القاهرة الدولي للمسرح الجامعي',
        url: 'https://www.shorouknews.com/news/view.aspx?cdate=26102025&id=0d8c3c65-4f15-478d-9afd-6f8393ea279c',
    },
];

export const awards = plays.filter((p) => p.award);
