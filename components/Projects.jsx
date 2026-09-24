import {projects} from "../constants";
import Link from "next/link";
import CTA from "./CTA";
import Image from "next/image";

const Projects = () => {
    return (
        <section className="max-container">
            <h1 className="head-text">
                My <span className="blue-gradient_text
                font-semibold drop-shadow">Projects</span> <br />
            </h1>
            <div className="mt-5 flex flex-col gap-3 text-slate-500">
                <p>A few things I&apos;ve built and shipped - from an AI-integrated
                WhatsApp bot handling real patient bookings, to a real-time
                social app with type-safe state management. Each one taught
                me something different about taking a product from idea to
                production.</p>
            </div>
            <div className="my-20 flex flex-wrap gap-16">
                {projects.map((project) => (
                    <div className="lg:w-[400px] w-full" key={project.name}>
                        {project.imageUrl && (
                            <Image
                                src={project.imageUrl}
                                alt={`${project.name} screenshot`}
                                width={400}
                                height={220}
                                className="w-full h-48 object-cover rounded-xl mb-4 border-2 border-black"
                            />
                        )}
                        <div className="mt-5 flex flex-col">
                            <h4 className="text-2xl font-poppins font-semibold">
                                {project.name}
                            </h4>
                            <p className="mt-2 text-slate-500">
                                {project.description}
                            </p>
                            <div className="mt-5 flex items-center gap-2 font-poppins">
                                <Link 
                                href={project.link} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-500 hover:text-blue-700"
                                >
                                {project.linkLabel || 'Live Demo'}
                                </Link>
                                <Image src="/icons/arrow.svg" alt="Arrow"
                                width={16} height={16}
                                className="w-4 h-4 object-contain" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <hr className="border-slate-200" />
            <CTA/>
        </section>
    );
}
export default Projects;