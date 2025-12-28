
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getStats(workouts) {
    if (!workouts || workouts.length === 0) {
        return { bestLift: 0, total: 0, thisWeek: 0, recent: [] };
    }
    // Best lift (max weight)
    const bestLift = Math.max(...workouts.map(w => Number(w.weight) || 0));
    // Total workouts
    const total = workouts.length;
    // Workouts this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    const thisWeek = workouts.filter(w => {
        const d = new Date(w.date);
        return d >= weekStart && d <= now;
    }).length;
    // Recent 3 workouts
    const recent = [...workouts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    return { bestLift, total, thisWeek, recent };
}

function Home() {
    const [stats, setStats] = useState({ bestLift: 0, total: 0, thisWeek: 0, recent: [] });
    const [showReminder, setShowReminder] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("workouts");
        if (saved) {
            const workouts = JSON.parse(saved);
            setStats(getStats(workouts));
            // Check if a workout was logged today
            const today = new Date().toISOString().slice(0, 10);
            const hasToday = workouts.some(w => w.date === today);
            setShowReminder(!hasToday);
        } else {
            setShowReminder(true);
        }
    }, []);

    return (
        <div className="home-container min-h-screen flex flex-col items-center justify-center bg-white px-2 md:px-8 py-8">
            {showReminder && (
                <div className="w-full max-w-2xl mx-auto mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow text-center font-semibold">
                    Don’t forget to log your workout today!
                    <button
                        className="ml-4 px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-bold transition"
                        onClick={() => navigate("/log-workout")}
                    >
                        Log Now
                    </button>
                </div>
            )}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-center min-h-[700px]">
                {/* Left: Motivational text and recents */}
                <aside className="flex flex-col gap-8 items-start justify-center h-full pt-8">
                    <h2 className="text-2xl font-extrabold mb-2 text-black">SHAPE IS A HEALTHY <span className="text-green-500">WORKOUT</span></h2>
                    <h2 className="text-2xl font-bold mb-2">SHAPE IS A HEALTHY <span className="text-green-500">WORKOUT</span></h2>
                    <section className="w-full flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-1 text-black">Recent Workouts.</h3>
                        {stats.recent.length === 0 ? (
                            <div className="text-gray-400">No recent workouts.</div>
                        ) : (
                            stats.recent.map((w, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white border-2 border-green-400 rounded-xl px-4 py-3 shadow-sm">
                                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-100 rounded-full">
                                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-green-600">{w.exercise}</div>
                                        <div className="text-xs text-gray-500">{w.date} | {w.sets} sets × {w.reps} reps @ {w.weight} lbs</div>
                                    </div>
                                    <button className="ml-4 px-4 py-1 border border-green-400 text-green-600 rounded-lg hover:bg-green-50 text-sm font-semibold">View</button>
                                </div>
                            ))
                        )}
                    </section>
                </aside>

                {/* Center: Main image, text, and button */}
                <main className="flex flex-col items-center text-center gap-4 justify-center h-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-black">
                        Let’s <span className="text-green-500">Transform Your Body</span> Now
                    </h1>
                    <p className="text-gray-700 mb-2 font-medium">Track, train and crush your goals - all in one app.</p>
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="relative flex items-center justify-center w-full" style={{ minHeight: '350px', height: '350px' }}>
                            {/* Green progress circle using SVG */}
                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none" width="400" height="400" viewBox="0 0 400 400">
                                <circle cx="200" cy="200" r="170" stroke="#b6f2c1" strokeWidth="24" fill="none" />
                                <path d="M60,200 a140,140 0 1,1 280,0" stroke="#22c55e" strokeWidth="24" fill="none" strokeLinecap="round" />
                            </svg>
                            <img src="/src/assets/images/pexels-jonathanborba-3076513.jpg" alt="Workout" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[340px] w-full h-auto z-10 object-contain" style={{ maxHeight: '340px' }} />
                        </div>
                        <button
                            className="mt-8 px-8 py-2 bg-black hover:bg-gray-800 text-green-400 font-bold rounded-lg shadow transition text-lg max-w-xs w-full mx-auto border border-black"
                            onClick={() => navigate("/log-workout")}
                        >
                            +Log New Workout
                        </button>
                    </div>
                </main>

                {/* Right: Circular stat cards */}
                <section className="flex flex-col gap-8 items-end w-full justify-center h-full">
                    <div className="flex flex-col items-center justify-center border-2 border-blue-400 rounded-full w-32 h-32 md:w-44 md:h-44 bg-white shadow text-center">
                        <h4 className="text-md font-semibold text-black">Best<br/><span className="text-green-500">Lift</span></h4>
                        <p className="text-2xl font-bold text-black mt-2">{stats.bestLift} <span className="text-green-500">lbs</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-green-400 rounded-full w-48 h-48 md:w-64 md:h-64 bg-white shadow text-center">
                        <h4 className="text-2xl font-bold text-black">Total<br/><span className="text-green-500">Workouts</span></h4>
                        <p className="text-4xl font-extrabold text-green-500 mt-2">{stats.total}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-green-400 rounded-full w-20 h-20 md:w-28 md:h-28 bg-white shadow text-center">
                        <h4 className="text-xs font-semibold text-black">This<br/><span className="text-green-500">Week</span></h4>
                        <p className="text-lg font-bold text-green-500 mt-1">{stats.thisWeek}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-green-400 rounded-full w-32 h-32 md:w-40 md:h-40 bg-white shadow">
                        <h4 className="text-md font-semibold text-gray-700">Best<br/>Lift</h4>
                        <p className="text-2xl font-bold text-green-500 mt-2">{stats.bestLift} {stats.bestLift > 0 ? 'lbs' : ''}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-green-400 rounded-full w-32 h-32 md:w-40 md:h-40 bg-white shadow">
                        <h4 className="text-md font-semibold text-gray-700">Total<br/>Workouts</h4>
                        <p className="text-2xl font-bold text-green-500 mt-2">{stats.total}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-green-400 rounded-full w-32 h-32 md:w-40 md:h-40 bg-white shadow">
                        <h4 className="text-md font-semibold text-gray-700">This<br/>Week</h4>
                        <p className="text-2xl font-bold text-green-500 mt-2">{stats.thisWeek}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;