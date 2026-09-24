'use client';

import {useState, useRef, Suspense} from "react";
import emailJs from '@emailjs/browser'
import { Canvas } from "@react-three/fiber";
import Alert from "./Alert";
import Fox from "./models/Fox";
import Loader from "./Loader";
import { useAlert } from "../hooks/useAlert";


const Contact = () => {
    const formRef = useRef();
    const [form,setform] = useState({name:"",email:"",message:""});
    const [isLoading,setIsLoading] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState("idle");
    const {alert, showAlert, hideAlert} = useAlert();

    const handleChange = (e) => {
        setform({...form,[e.target.name]:e.target.value});
    }
    const handleFocus = () => setCurrentAnimation("walk");
    const handleBlur = () => setCurrentAnimation("idle"); 
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setCurrentAnimation("hit");

        emailJs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            {
                from_name: form.name,
                to_name: "Belal",
                from_email: form.email,
                to_email: 'eng.belalalaa@gmail.com',
                message: form.message,
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY 
        ).then(() => {
            setIsLoading(false);
            showAlert({text:"Message Sent Successfully",type:"Success"});
            setTimeout(() => {
                hideAlert();
                setCurrentAnimation("idle");
                setform({name:"",email:"",message:""});
            }, 3000);
        }, (error) => {
            setIsLoading(false);
            setCurrentAnimation("idle");
            showAlert({text:"Failed to send message",type:"Danger"});
            console.error(error);
        });
    }
    return (
        <section className="relative flex lg:flex-row flex-col
        max-container h-[100vh]">
                {alert.show && <Alert {...alert}/>}
            <div className="flex-1 min-w-[50%] flex flex-col">
                <h1 className="head-text">Get In Touch!</h1>
                <form className="w-full flex flex-col gap-7 mt-14" 
                    onSubmit={handleSubmit}>
                    <label className="text-black-500 font-semibold flex flex-col gap-3">
                        Name
                        <input type="text" 
                        name="name" 
                        placeholder="Your Name" 
                        className="input-field"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required value={form.name} 
                        onChange={handleChange}/>
                    </label>
                     <label className="text-black-500 font-semibold flex flex-col gap-3">
                        Email
                        <input 
                        type="email" 
                        name="email" 
                        placeholder="email@example.com" 
                        className="input-field"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required value={form.email} 
                        onChange={handleChange}/>
                    </label>
                    <label className="text-black-500 font-semibold flex flex-col gap-3">
                        Message
                        <textarea 
                        name="message" 
                        placeholder="Let Me Know How I Can Help" 
                        className="textarea"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required value={form.message} 
                        onChange={handleChange}/>
                    </label>
                    <button type="submit" 
                    className="btn"
                    disabled={isLoading}
                    onFocus={handleFocus}
                    onBlur={handleBlur}>
                        {isLoading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
            <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350]">
                <Canvas camera={
                    {position:[0,0,5],
                        fov:75, near:0.1,far:1000
                }}>
                    <directionalLight intensity={2.5} position={[0,0,1]}/>
                    <ambientLight intensity={0.5}/>
                    <Suspense fallback={<Loader/>}>
                        <Fox 
                        currentAnimation={currentAnimation}
                        scale={[0.5,0.5,0.5]} 
                        position={[0.5,0.35,0]} 
                        rotation={[12.6,-0.6,0]}/>
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
}
export default Contact;
