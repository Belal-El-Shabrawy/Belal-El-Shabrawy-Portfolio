import { Depi, scale} from "../../assets/images";
import {
    car,
    contact,
    css,
    estate,
    express,
    firebase,
    git,
    github,
    html,
    javascript,
    linkedin,
    nextjs,
    nodejs,
    pricewise,
    react,
    three,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript
} from "../../assets/icons";

export const skills = [
    {
        imageUrl: nextjs,
        name: "Next.js",
        type: "Frontend",
    },
    {
        imageUrl: three,
        name: "Three.js",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: firebase,
        name: "Firebase",
        type: "Backend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    },
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    }
];

export const experiences = [
    {
        title: "AI Expert",
        company_name: "Scale AI",
        icon: scale,
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
        icon: Depi,
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
        icon: github,
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
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/YourGitHubUsername',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/YourLinkedInUsername',
    }
];

export const projects = [
    {
        iconUrl: summiz,
        theme: 'btn-back-yellow',
        name: 'PortfolioGenie',
        description: 'An AI-powered developer portfolio generator built with React.js and component-driven architecture, as the DEPI graduation team project. Implements dynamic routing and prompt-engineering techniques to turn user input into personalized portfolio pages.',
        link: 'https://github.com/Belal-El-Shabrawy',
    },
    {
        iconUrl: contact,
        theme: 'btn-back-green',
        name: 'Hospital WhatsApp Bot',
        description: 'A live WhatsApp bot built with Node.js/Express that lets patients book medications and doctor appointments through conversational flows. Integrates the Groq AI API to read prescriptions and insurance cards, with Firebase and AWS Textract handling data storage and extraction.',
        link: 'https://github.com/Belal-El-Shabrawy',
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Firebase Social Media App',
        description: 'A full social media web app built with React, TypeScript, and Vite, using Firebase (Firestore & Authentication) as the backend. Features real-time posts, user authentication, and a responsive, mobile-first UI with type-safe state management.',
        link: 'https://github.com/Belal-El-Shabrawy',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Movie Viewer Application',
        description: 'A full-stack app built with a team using PHP/Laravel and JavaScript, handling async CRUD actions and integrating external movie APIs for dynamic search and feeds. Includes XSS-safe input sanitization and a responsive, cross-browser layout.',
        link: 'https://github.com/Belal-El-Shabrawy',
    },
];