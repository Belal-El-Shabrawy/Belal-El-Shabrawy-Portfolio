'use client';

import Image from "next/image";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import CTA from "./CTA";
import {skills, experiences, socialLinks} from "../constants";

// Only show GitHub/LinkedIn here — "Contact" already has its own page/CTA.
const aboutSocials = socialLinks.filter((s) => s.name === "GitHub" || s.name === "LinkedIn");

// The two current roles overlap in time, so the timeline forks for them rather
// than stacking them as if one had followed the other. Everything after the
// merge is strictly sequential and stays on the library's timeline.
const currentRoles = experiences.filter((e) => e.current);
const pastRoles = experiences.filter((e) => !e.current);

const ExperienceBody = ({ experience }) => (
    <div>
        <h3 className="text-black dark:text-slate-100 text-xl font-poppins font-semibold">
            {experience.title}
        </h3>
        <p className="text-black-500 dark:text-slate-300 text-medium font-base" style={{ margin: 0 }}>
            {experience.company_name}
        </p>
        <ul className="my-5 list-disc ml-5 space-y-2">
            {experience.points.map((point, index) => (
                <li
                    key={`experience-point-${index}`}
                    className="text-black-500/50 dark:text-slate-400 font-normal pl-1 text-sm"
                >
                    {point}
                </li>
            ))}
        </ul>
    </div>
);

const About = () => {
    return (
        <section className="max-container ">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-800">
                        <Image
                            src="/images/belal-portrait.jpeg"
                            alt="Belal Alaa El-Shabrawy"
                            width={384}
                            height={384}
                            /* portrait crop: the face sits below centre, so bias
                               the crop window down to centre it in the circle */
                            className="w-full h-full object-cover object-[center_65%]"
                            priority
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col items-center gap-4 text-center sm:w-auto sm:items-start sm:text-left">
                    <h1 className="head-text">
                        Hi, I&apos;m <span className="blue-gradient_text
                        font-semibold drop-shadow">Belal Alaa <span className="whitespace-nowrap">El-Shabrawy</span></span> <br />
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4">
                        {aboutSocials.map((social) => (
                            <a
                                key={social.name}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border border-slate-100"
                            >
                                <Image src={social.iconUrl} alt={social.name} width={20} height={20} className="w-5 h-5 object-contain" />
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">{social.name}</span>
                            </a>
                        ))}
                        <a
                            href="/Belal_Alaa_CV.pdf"
                            download
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black dark:bg-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <span className="whitespace-nowrap text-sm font-medium text-white">Download CV</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 text-slate-500 dark:text-slate-400">
                <p> I&apos;m a full-stack developer and Computer Science & Artificial
                    Intelligence student at Cairo University, based in Giza, Egypt.
                    I work as a Software Engineer at Clinica Joelle and at CSDS -
                    Cairo University, where I built the CMS that 27 faculties use to
                    run the university&apos;s AI assistant.</p>
                <p> I enjoy working across the whole stack, from building responsive,
                    intuitive interfaces to wiring up backends, databases, and AI-powered
                    integrations.</p>
            </div>
            <div className="py-10 flex flex-col">
                <h3 className="subhead-text">My Skills</h3>
                <div className="mt-16 flex flex-wrap gap-12">
                    {skills.map((skill) => (
                        <div className="block-container w-20 h-20" key={skill.name}>
                            <div className="btn-back rounded-xl"/>
                            {/* Icon over label, not beside it: the card is 80px wide with
                                overflow:hidden, so a side-by-side label was clipped
                                ("Firebas", "GitHut", "TypeScri"). */}
                            <div className="btn-front rounded-xl flex flex-col justify-center items-center gap-0.5 px-1">
                            <Image src={skill.imageUrl} alt={skill.name}
                            width={32} height={32}
                            className="w-2/5 h-2/5 object-contain"/>
                            <p className="text-slate-500 dark:text-slate-300 text-[9px] leading-tight text-center">{skill.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-16">
                <h3 className="subhead-text">My Experience</h3>
                <div className="mt-5 flex flex-col gap-3 text-slate-500 dark:text-slate-400">
                    <p> Here&apos;s a look at my experience - two current engineering roles
                        shipping production software, plus the AI evaluation work and
                        training that came before them.
                    </p>
                </div>
            </div>
            {currentRoles.length > 1 && (
                <div className="concurrent">
                    <p className="concurrent-date">{currentRoles[0].date}</p>
                    <p className="concurrent-note">Both roles, at the same time</p>
                    <div className="concurrent-fork" aria-hidden="true" />
                    <div className="concurrent-grid">
                        {currentRoles.map((experience) => (
                            <div className="concurrent-col" key={experience.company_name}>
                                <div
                                    className="concurrent-icon"
                                    style={{ background: experience.iconBg }}
                                >
                                    <Image
                                        src={experience.icon}
                                        alt={experience.company_name}
                                        width={40}
                                        height={40}
                                        className="w-[55%] h-[55%] object-contain"
                                    />
                                </div>
                                <div
                                    className="concurrent-card"
                                    style={{ borderBottom: `8px solid ${experience.iconBg}` }}
                                >
                                    <ExperienceBody experience={experience} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="concurrent-merge" aria-hidden="true" />
                </div>
            )}
            <div className="flex">
                <VerticalTimeline layout="2-columns">
                    {pastRoles.map((experience) => (
                        <VerticalTimelineElement key={experience.company_name}
                            date={experience.date}
                            icon={<div className="flex justify-center
                            items-center w-full h-full">
                                <Image src={experience.icon}
                                 alt={experience.company_name}
                                 width={40} height={40}
                                 className="w-[60%] h-[60%] object-contain"
                                />
                            </div>}
                            iconStyle={{background: experience.iconBg}}
                            contentStyle={{
                                borderBottom: '8px',
                                borderStyle: "solid",
                                borderBottomColor: experience.iconBg,
                                boxShadow: 'none',
                                }}>
                            <ExperienceBody experience={experience} />
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
            <hr className="border-slate-200 dark:border-slate-700"/>
            <CTA/>
        </section>
    );
}
export default About;
