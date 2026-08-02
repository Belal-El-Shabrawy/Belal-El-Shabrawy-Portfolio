import {projects} from "../constants";
import Link from "next/link";
import CTA from "./CTA";

const Projects = () => {
    return (
        <section className="max-container">
            <h1 className="head-text">
                My <span className="blue-gradient_text
                font-semibold drop-shadow">Projects</span> <br />
            </h1>
            <div className="mt-5 flex flex-col gap-3 text-slate-500">
                <p> I'm a full-stack developer and Computer Science & Artificial
                    Intelligence student at Cairo University, based in Giza, Egypt.
                    I enjoy working across the whole stack, from building responsive,
                    intuitive interfaces to wiring up backends, databases, and AI-powered
                    integrations.</p>
            </div>
            <div className="my-20 flex flex-wrap gap-16">
                {projects.map((project) => (
                    <div className="lg:w-[400px] w-full" key={project.name}>
                        <div className="block-container w-12 h-12">
                            <div className={`btn-back rounded-xl ${project.theme}`}/>
                            <div className="btn-front rounded-xl flex items-center justify-center">
                                <img 
                                src={project.iconUrl}
                                alt = "Project Icon"
                                className="w-1/2 h-1/2 object-contain"/>

                            </div>
                        </div>
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
                                    Live Demo
                                </Link>
                                <img src="/icons/arrow.svg" alt="Arrow" 
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
