'use client';

import Link from 'next/link';

const InfoBox = ({text,link,btnText}) => {
    return (
        <div className="info-box">
            <p className="font-medium sm:text-xl text-center">{text}</p>
            <Link href={link} className="neo-brutalism-white neo-btn">
                {btnText}
                <img src="/icons/arrow.svg" className="w-4 h-4 object-contain"/>
            </Link>
        </div>
    );
}

const renderContent = {
    1: (
        <h1 className="sm:text-xl sm:leading-snug text-center neo-brutalism-blue
        py-4 px-8 text-white mx-5">
            Hi, I'm <span className="font-semibold">Belal El-Shabrawy 👋</span><br/>
            A Full-Stack Developer From Egypt.
        </h1>
    ),
    2: (
        <InfoBox
            text="I build with Next, React, TypeScript, Node.js, and Firebase, and I've shipped multiple full-stack apps, including a live AI-integrated WhatsApp bot."
            link="/about"
            btnText="Learn More"
        />
    ),
     3: (
        <InfoBox
            text="A Computer Science & AI student who loves building end-to-end, from responsive UIs to backends and AI-powered integrations."
            link="/projects"
            btnText="View My Work"
        />
    ),
     4: (
        <InfoBox
            text="I'm currently open to new opportunities as a Software Engineer. Let's connect and talk about how I can contribute to your team."
            link="/contact"
            btnText="Get In Touch"
        />
    ),
}

const HomeInfo = ({ currentStage }) => {
    if(!currentStage) return null;
    return (
        <div className="home-info" onPointerDown={(e) => e.stopPropagation()}>
            {renderContent[currentStage]}
        </div>
    );
}

export default HomeInfo;
