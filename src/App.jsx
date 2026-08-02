import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import NavBar from "./component/NavBar.jsx";
import { Home, About, Projects, Contact } from "./pages/index.js";
const App = () => {
    return (
        <main className="bg-slate-300/20 min-h-screen">
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Router>
        </main>
    );
}
export default App;