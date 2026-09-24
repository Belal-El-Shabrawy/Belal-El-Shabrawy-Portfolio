'use client';

import Image from 'next/image';
import Link from 'next/link';

const InfoBox = ({ text, link, btnText, gradient }) => {
    return (
        <div className={`sm:text-xl sm:leading-snug text-center py-4 px-8 text-white mx-5 rounded-xl transition-transform hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black ${gradient}`}>
            <p className="font-medium sm:text-xl text-center mb-5">{text}</p>
            <Link 
                href={link} 
                className="bg-white text-black flex justify-center items-center gap-3 w-max mx-auto px-6 py-2.5 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
            >
                {btnText}
                <Image src="/icons/arrow.svg" width={16} height={16} className="w-4 h-4 object-contain invert hover:invert-0 transition-all" alt="arrow" />
            </Link>
        </div>
    );
}

const renderContent = {
    // Grade 1: Light & welcoming (Sky to Blue)
    1: (
        <h1 className="sm:text-xl sm:leading-snug text-center bg-gradient-to-br from-sky-400 to-blue-500 py-4 px-8 text-white mx-5 rounded-xl transition-transform hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            Hi, I&apos;m <span className="font-semibold">Belal El-Shabrawy 👋</span><br/>
            A Full-Stack Developer From Egypt.
        </h1>
    ),
    // Grade 2: Solid & professional (Blue to Indigo)
    2: (
        <InfoBox
            gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
            text="I build with Next, React, TypeScript, Node.js, and Firebase, and I've shipped multiple full-stack apps, including a live AI-integrated WhatsApp bot."
            link="/about"
            btnText="Learn More"
        />
    ),
    // Grade 3: Deep & creative (Indigo to Violet)
    3: (
        <InfoBox
            gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
            text="A Computer Science & AI student who loves building end-to-end, from responsive UIs to backends and AI-powered integrations."
            link="/projects"
            btnText="View My Work"
        />
    ),
    // Grade 4: Dark & bold (Deep Blue to Navy)
    4: (
        <InfoBox
            gradient="bg-gradient-to-br from-blue-600 to-slate-900"
            text="I'm currently open to new opportunities as a Software Engineer. Let's connect and talk about how I can contribute to your team."
            link="/contact"
            btnText="Get In Touch"
        />
    ),
}

const HomeInfo = ({ currentStage }) => {
    if(!currentStage) return null;
    return (
        <div className="home-info absolute top-28 left-0 right-0 z-10 flex items-center justify-center" onPointerDown={(e) => e.stopPropagation()}>
            {renderContent[currentStage]}
        </div>
    );
}

export default HomeInfo;