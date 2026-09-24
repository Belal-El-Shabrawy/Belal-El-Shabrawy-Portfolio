'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

const NavBar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Close on navigation, so a link tap (or a back button) doesn't leave the
    // panel hanging open over the page you just landed on. Adjusted during
    // render rather than in an effect: React re-runs this component before
    // committing, so the menu never paints open on the new route.
    const [lastPath, setLastPath] = useState(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setOpen(false);
    }

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    // Lazy on purpose: NavBar renders in the root layout, so a static drei
    // import would pull three.js into every page's first-load bundle and
    // undo the ssr:false split on the 3D routes.
    const prefetchFox = () => {
        import("@react-three/drei").then(({ useGLTF }) => useGLTF.preload("/3d/fox.glb"));
    };

    return (
        <header className="header">
            <Link
                href="/"
                className="w-16 h-10 rounded-lg bg-white dark:bg-slate-800 items-center justify-center font-bold flex shadow-md"
            >
                <p className="blue-gradient_text">Home</p>
            </Link>

            <div className="flex items-center gap-3">
                <nav className="hidden sm:flex gap-7 text-lg font-medium">
                    {LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            prefetch={false}
                            onMouseEnter={href === "/contact" ? prefetchFox : undefined}
                            onTouchStart={href === "/contact" ? prefetchFox : undefined}
                            className={`nav-link ${pathname === href ? "text-blue-500" : "text-black dark:text-slate-200"}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <ThemeToggle />

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    className="sm:hidden grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/70 text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                >
                    {/* Three bars folding into an X. Transform/opacity only, so
                        it animates on the compositor and never re-lays out. */}
                    <span className="relative block h-4 w-5" aria-hidden="true">
                        <span
                            className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 ${open ? "top-[7px] rotate-45" : "top-0"}`}
                        />
                        <span
                            className={`absolute left-0 top-[7px] block h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
                        />
                        <span
                            className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200 ${open ? "top-[7px] -rotate-45" : "top-[14px]"}`}
                        />
                    </span>
                </button>
            </div>

            <nav
                id="mobile-nav"
                hidden={!open}
                className="sm:hidden absolute left-0 right-0 top-full mx-4 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
            >
                {LINKS.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        prefetch={false}
                        onTouchStart={href === "/contact" ? prefetchFox : undefined}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-4 py-3 text-lg font-medium ${pathname === href
                            ? "bg-blue-50 text-blue-500 dark:bg-slate-700"
                            : "text-black dark:text-slate-200"}`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default NavBar;
