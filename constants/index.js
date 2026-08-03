// NOTE: In the Vite version these icons/images were imported from
// ../../assets/icons and ../../assets/images (resolving to objects/URLs
// via the bundler). In Next.js, files referenced from the public/ folder
// are plain string paths, so this file now just points at
// public/icons/<name>.<ext> and public/images/<name>.<ext>.
//
// Move each source file into public/icons/ or public/images/ and adjust
// the extension below (.svg vs .png) to match your actual asset files.

export const skills = [
    {
        imageUrl: "/icons/nextjs.svg",
        name: "Next.js",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/Three.png",
        name: "Three.js",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/nodejs.svg",
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: "/icons/react.svg",
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/express.svg",
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: "/icons/FireBase.svg",
        name: "Firebase",
        type: "Backend",
    },
    {
        imageUrl: "/icons/javascript.svg",
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/tailwindcss.svg",
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/typescript.svg",
        name: "TypeScript",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/css.svg",
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: "/icons/git.svg",
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: "/icons/github.svg",
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: "/icons/html.svg",
        name: "HTML",
        type: "Frontend",
    }
];

export const experiences = [
    {
        title: "AI Expert",
        company_name: "Scale AI",
        icon: "/images/scale.png",
        iconBg: "#accbe1",
        date: "Feb 2026 - May 2026",
        points: [
            "Conducted detailed video-quality comparisons for 500+ generative AI outputs, establishing accuracy benchmarks across multi-modal models.",
            "Performed high-volume text transcriptions with a sustained 98%+ accuracy rating to support dataset alignment for language model training pipelines.",
        ],
    },
    {
        title: "Web Development Scholar",
        company_name: "Digital Egypt Pioneers Initiative (DEPI) - MCIT",
        icon: "/images/Depi.png",
        iconBg: "#fbc3bc",
        date: "Jan 2026 - Jun 2026",
        points: [
            "Completed a competitive MCIT scholarship specializing in advanced web development, with intensive training in React.js and component-driven architecture.",
            "Collaborated on PortfolioGenie, an AI-powered developer portfolio generator, as the program's graduation project.",
            "Applied prompt-engineering techniques to integrate AI-generated content into a real product workflow.",
        ],
    },
    {
        title: "Full-Stack Developer",
        company_name: "Independent Projects",
        icon: "/icons/github.svg",
        iconBg: "#b7e4c7",
        date: "2026 - Present",
        points: [
            "Built and deployed a Hospital WhatsApp Bot (Node.js/Express) integrating the Groq AI API and AWS Textract to parse prescriptions and insurance cards.",
            "Developed a real-time social media app using React, TypeScript, and Firebase (Firestore & Authentication).",
            "Collaborated on a full-stack movie viewer app with PHP/Laravel, integrating external REST APIs and handling XSS-safe data sanitization.",
        ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: "/icons/contact.svg",
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: "/icons/github.svg",
        link: 'https://github.com/Belal-El-Shabrawy',
    },
    {
        name: 'LinkedIn',
        iconUrl: "/icons/linkedin.svg",
        link: 'https://www.linkedin.com/in/belal-el-shabrawy-26b406291/',
    }
];

export const projects = [
    {
        imageUrl: "/projects/PortfolioGenie.png",
        name: 'PortfolioGenie',
        description: 'An AI-powered developer portfolio generator built with React.js and component-driven architecture, as the DEPI graduation team project. Implements dynamic routing and prompt-engineering techniques to turn user input into personalized portfolio pages.',
        link: 'https://github.com/Basel-Ahmed-TECH/DEPI-React-GP',
        linkLabel: 'View Source',
    },
    {
        imageUrl: "/projects/Hospital.png",
        name: 'Hospital WhatsApp Bot',
        description: 'A live WhatsApp bot built with Node.js/Express that lets patients book medications and doctor appointments through conversational flows. Integrates the Groq AI API to read prescriptions and insurance cards, with Firebase and AWS Textract handling data storage and extraction.',
        link: 'https://github.com/Belal-El-Shabrawy/Hospital-Whatsapp-Bot',
    },
    {
        imageUrl: "/projects/SocialMedia.png",
        name: 'Firebase Social Media App',
        description: 'A full social media web app built with React, TypeScript, and Vite, using Firebase (Firestore & Authentication) as the backend. Features real-time posts, user authentication, and a responsive, mobile-first UI with type-safe state management.',
        link: 'https://socialmedia-fe-lbeet.web.app/',
    },
    {
        imageUrl: "/projects/MovieViewer.png",
        name: 'Movie Viewer Application',
        description: 'A full-stack app built with a team using PHP/Laravel and JavaScript, handling async CRUD actions and integrating external movie APIs for dynamic search and feeds. Includes XSS-safe input sanitization and a responsive, cross-browser layout.',
        link: 'https://movieviewer.infinityfreeapp.com/?i=3',
    },
];