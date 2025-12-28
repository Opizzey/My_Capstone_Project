
import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/log-workout", label: "Log Workouts" },
        { to: "/statistics", label: "Statistics" },
        { to: "/workout-history", label: "History" },
    ];
    return (
        <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-md rounded-b-2xl sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <img src="/src/assets/images/Logo.png" alt="FitVerse Logo" className="h-12 w-12 object-contain" />
                <span className="text-2xl font-extrabold text-green-600 tracking-tight">FitVerse</span>
            </div>
            <div className="flex gap-2 md:gap-4">
                {navLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`px-5 py-2 rounded-full font-semibold transition border-2 ${location.pathname === link.to ? 'bg-green-50 border-green-500 text-green-600' : 'text-gray-700 hover:text-green-600 hover:bg-green-50 border-transparent'}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="flex gap-2">
                <Link to="/auth">
                    <button className="border border-green-500 text-green-600 font-bold py-1 px-6 rounded-full hover:bg-green-50 transition">Log In</button>
                </Link>
                <Link to="/auth">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-6 rounded-full transition">Sign up</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;