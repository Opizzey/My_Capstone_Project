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
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 border border-green-300">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h2v4H4zM18 10h2v4h-2zM8 9h8v6H8z" />
                        </svg>
                    </span>
                    <span className="text-2xl font-black text-green-600 tracking-tight">FitVerse</span>
                </div>
                <div className="flex gap-2 md:gap-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${location.pathname === link.to ? 'text-green-700 bg-green-50 border border-green-500' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Link to="/auth">
                        <button className="border border-green-500 text-green-600 font-semibold py-1 px-4 rounded-lg hover:bg-green-50 transition">Log In</button>
                    </Link>
                    <Link to="/auth">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-lg transition">Sign Up</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;