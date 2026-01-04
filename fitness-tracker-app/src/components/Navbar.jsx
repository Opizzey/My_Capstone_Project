import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, signOutUser } from "../lib/localAuth";

function Navbar() {
    const location = useLocation();
    const [logoSrc, setLogoSrc] = useState(null);
    const [logoAvailable, setLogoAvailable] = useState(false);
    const [user, setUser] = useState(null);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/log-workout", label: "Log Workouts" },
        { to: "/statistics", label: "Statistics" },
        { to: "/workout-history", label: "History" },
    ];

    const borderClass = location.pathname === "/" ? "" : "border-b border-gray-200";

    useEffect(() => {
        const candidates = ["/logo.png", "/logo.jpg", "/logo.jpeg", "/images/logo.png", "/images/logo.jpg"];
        let i = 0;
        const tryNext = () => {
            if (i >= candidates.length) { setLogoAvailable(false); return; }
            const img = new Image();
            img.onload = () => { setLogoSrc(candidates[i]); setLogoAvailable(true); };
            img.onerror = () => { i += 1; tryNext(); };
            img.src = candidates[i];
        };
        tryNext();
    }, []);

    useEffect(() => {
        setUser(getCurrentUser());
    }, [location.pathname]);

    return (
        <nav className={`bg-white ${borderClass} sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {logoAvailable && logoSrc ? (
                        <img src={logoSrc} alt="FitVerse logo" className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-green-500 object-cover" />
                    ) : (
                        <span className="inline-flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-100 border border-green-300">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h2v4H4zM18 10h2v4h-2zM8 9h8v6H8z" />
                            </svg>
                        </span>
                    )}
                    <span className="text-xl md:text-2xl font-black text-green-600 tracking-tight">FitVerse</span>
                </div>

                <div className="flex items-center rounded-full border border-green-300 bg-white shadow-sm px-2 py-2 overflow-x-auto whitespace-nowrap gap-2 sm:gap-3 flex-1 mx-3 md:mx-0 max-w-[85vw] sm:max-w-none">
                    {navLinks.map(link => (
                        <div key={link.to} className="px-3 sm:px-4 md:px-5 py-0.5 sm:py-1 text-center">
                            <Link
                                to={link.to}
                                className={`${location.pathname === link.to ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-600'} transition text-[15px] sm:text-base`}
                            >
                                <span className="sm:hidden">
                                    {link.label === 'Log Workouts' ? 'Log' : link.label === 'Statistics' ? 'Stats' : link.label}
                                </span>
                                <span className="hidden sm:inline">{link.label}</span>
                            </Link>
                            <div className={location.pathname === link.to ? 'h-0.5 bg-green-500 rounded w-6 sm:w-8 mx-auto mt-1' : 'h-0.5 w-6 sm:w-8 mx-auto mt-1'}></div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                                {user.displayName || user.email || 'User'}
                            </span>
                            <button
                                onClick={() => { signOutUser(); setUser(null); }}
                                className="px-3 md:px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth" className="hidden sm:block">
                                <button className="px-3 sm:px-4 py-1.5 rounded-full border border-green-400 text-gray-700 hover:bg-green-50 text-sm sm:text-base">Log In</button>
                            </Link>
                            <Link to="/auth">
                                <button className="px-3 sm:px-4 py-1.5 rounded-full bg-gray-900 text-green-100 hover:bg-gray-800 shadow-sm text-sm sm:text-base">Sign up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;