'use client';

import Image from 'next/image';
import Link from 'next/link';
import IntroCard from './IntroCard';

const InfoBox = ({ text, link, btnText, gradient }) => {
    return (
        <div className={`text-sm sm:text-xl sm:leading-snug text-center py-3 px-4 sm:py-4 sm:px-8 text-white mx-4 sm:mx-5 max-w-md sm:max-w-none rounded-xl transition-transform hover:-translate-y-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black ${gradient}`}>
            <p className="font-medium text-sm sm:text-xl text-center mb-3 sm:mb-5">{text}</p>
            <Link 
                href={link} 
                className="bg-white text-black flex justify-center items-center gap-2 sm:gap-3 w-max mx-auto px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
            >
                {btnText}
                <Image src="/icons/arrow.svg" width={16} height={16} className="w-4 h-4 object-contain invert hover:invert-0 transition-all" alt="arrow" />
            </Link>
        </div>
    );
}

const renderContent = {
    // Grade 1 is the same introduction the static hero shows before anyone
    // touches the island - same component, so rotating back here lands on
    // exactly what they first saw rather than a different blue card.
    1: <IntroCard as="p" />,

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
        <div className="home-info absolute top-20 sm:top-28 left-0 right-0 z-10 flex items-center justify-center" onPointerDown={(e) => e.stopPropagation()}>
            {renderContent[currentStage]}
        </div>
    );
}

export default HomeInfo;