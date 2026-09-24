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
    },
    {
        imageUrl: "/icons/php.svg",
        name: "PHP",
        type: "Backend",
    },
    {
        imageUrl: "/icons/wordpress.svg",
        name: "WordPress",
        type: "Backend",
    },
    {
        imageUrl: "/icons/java.svg",
        name: "Java",
        type: "Backend",
    }
];

export const experiences = [
    {
        title: "Software Engineer (Full-time)",
        company_name: "Clinica Joelle",
        icon: "/icons/clinic.svg",
        iconBg: "#e6d3a3",
        date: "2026 - Present",
        points: [
            "Built two custom WordPress themes from scratch for a live aesthetic-medicine clinic, using PHP templates and template parts, block patterns, theme.json design tokens and self-hosted fonts rather than a page builder.",
            "Implemented treatment pages, doctor profiles, before-and-after result galleries and a consultation enquiry flow.",
            "Own and extend the production site at clinicajoelleegypt.com day to day, from new treatment pages to performance and front-end fixes.",
        ],
    },
    {
        title: "Software Engineer (Part-time)",
        company_name: "CSDS - Cairo University",
        icon: "/icons/cms.svg",
        iconBg: "#ffd8a8",
        date: "2026 - Present",
        points: [
            "Built and shipped the university's Q&A CMS in Next.js 16 and TypeScript, now used by 27 faculties to author the content behind the university's AI assistant.",
            "Designed the authentication chain end to end: bcrypt-hashed PIN login, signed session cookies exchanged for scoped Firebase custom tokens, with Firestore security rules as the enforced boundary.",
            "Added fail-closed rate limiting on Upstash Redis, so a degraded Redis blocks logins instead of silently disabling the brute-force guard.",
            "Helped build the Arabic RAG pipeline behind the assistant - LangChain over per-faculty ChromaDB vector stores, multilingual MPNet embeddings, Arabic normalisation and a reranking stage - and acted as the model's tester, checking retrieval quality and answer grounding across all 27 faculty knowledge bases.",
            "Delivered the entire interface in Arabic, right to left, and worked with a team on the student-facing Java JSP chat portal that ingests the CMS exports.",
        ],
    },
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
        imageUrl: "/projects/UniversityCMS.png",
        name: 'University Q&A CMS',
        description: "A production Next.js 16 and TypeScript CMS that 27 Cairo University faculties use to author the Q&A behind the university's AI assistant. Each faculty logs in with its own bcrypt-hashed PIN; the signed session cookie is exchanged for a scoped Firebase custom token, and Firestore security rules enforce that a faculty can only ever write into its own line. Rate limiting runs on Upstash Redis, and the whole interface is Arabic, right to left.",
        link: 'https://university-form-chatbox.vercel.app/login',
    },
    {
        imageUrl: "/projects/UniAssistant.png",
        name: 'Cairo University AI Assistant',
        description: "The student-facing half of the same pipeline: an Arabic RTL chat portal for postgraduate enquiries, served by Java JSP and Servlets on the university's own machines and proxied to a Python retrieval service. I helped build its Arabic RAG pipeline - LangChain over per-faculty ChromaDB stores, multilingual MPNet embeddings, Arabic text normalisation and a reranking stage - and was the tester for the model, checking answer grounding across 27 faculty knowledge bases built from regulations, course specifications and FAQs.",
        link: 'http://193.227.14.14:8080/uni_chatbox/',
    },
    {
        imageUrl: "/projects/ClinicaJoelle.png",
        name: 'Clinica Joelle',
        description: 'A live aesthetic-medicine clinic site, built as two custom WordPress themes from scratch rather than a page builder: PHP templates and template parts, block patterns, theme.json design tokens and self-hosted fonts. Covers treatment pages, doctor profiles, before-and-after galleries and a consultation enquiry flow.',
        link: 'https://clinicajoelleegypt.com/',
    },
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
        linkLabel: 'View Source',
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