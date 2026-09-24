'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    // Lazy on purpose: NavBar renders in the root layout, so a static drei
    // import would pull three.js into every page's first-load bundle and
    // undo the ssr:false split on the 3D routes.
    const prefetchFox = () => {
        import("@react-three/drei").then(({ useGLTF }) => useGLTF.preload("/3d/fox.glb"));
    };

    return (
        <header className="header">
                <Link href="/" className="w-16 h-10 rounded-lg bg-white 
                items-center justify-center font-bold flex shadow-md">
                <p className="blue-gradient_text">Home</p></Link>
                <nav className="flex gap-7 text-lg font-medium">
                    <Link href="/about" prefetch={false} className={`nav-link ${pathname === "/about" ? 'text-blue-500' : 'text-black'}`}>About</Link>
                    <Link href="/projects" prefetch={false} className={`nav-link ${pathname === "/projects" ? 'text-blue-500' : 'text-black'}`}>Projects</Link>
                    <Link href="/contact" prefetch={false} onMouseEnter={prefetchFox} onTouchStart={prefetchFox} className={`nav-link ${pathname === "/contact" ? 'text-blue-500' : 'text-black'}`}>Contact</Link>
                </nav>
        </header>
    );
}       
export default NavBar;