import Link from "next/link";

const CTA = () => {
    return (
        <section className="cta">
            <p className="cta-text text-black text-center w-full">
                Have a project in mind? <br className="sm:block hidden" />
                Let&apos;s build something together!
            </p>
            <Link href="/contact" className="btn w-full">
                Contact
            </Link>
        </section>
    );
};

export default CTA;
