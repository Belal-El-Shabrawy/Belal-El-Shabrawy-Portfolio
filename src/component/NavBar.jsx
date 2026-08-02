import {NavLink} from "react-router-dom";

const NavBar = () => {
    return (
        <header className="header">
                <NavLink to="/" className="w-16 h-10 rounded-lg bg-white 
                items-center justify-center font-bold flex shadow-md">
                <p className="blue-gradient_text">Home</p></NavLink>
                <nav className="flex gap-7 text-lg font-medium">
                    <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'text-blue-500' : 'text-black'}`}>About</NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'text-blue-500' : 'text-black'}`}>Projects</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'text-blue-500' : 'text-black'}`}>Contact</NavLink>
                </nav>
        </header>
    );
}       
export default NavBar;