import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function getStats(workouts) {
    if (!workouts || workouts.length === 0) {
        return { bestLift: 0, total: 0, thisWeek: 0, recent: [] };
    }
    const bestLift = Math.max(
        ...workouts.flatMap(w => (w.exercises ? w.exercises.map(e => Number(e.weight) || 0) : [Number(w.weight) || 0]))
    );
    const total = workouts.length;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const thisWeek = workouts.filter(w => {
        const d = new Date(w.date);
        return d >= weekStart && d <= now;
    }).length;
    const recent = [...workouts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    return { bestLift, total, thisWeek, recent };
}

function Home() {
    const [stats, setStats] = useState({ bestLift: 0, total: 0, thisWeek: 0, recent: [] });
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("workouts");
        if (saved) {
            const workouts = JSON.parse(saved);
            setStats(getStats(workouts));
        }
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 px-4 md:px-8 py-8">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
                {/* LEFT: Recent Workouts */}
                <aside className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-black mb-1">SHAPE IS A</h2>
                        <h2 className="text-xl font-black mb-4">HEALTHY</h2>
                        <h2 className="text-xl font-black text-green-500">WORKOUT</h2>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold mb-4">Recent Workouts.</h3>
                        <div className="flex flex-col gap-3">
                            {stats.recent.length === 0 ? (
                                <p className="text-gray-500 text-sm">No workouts yet. Log your first!</p>
                            ) : (
                                stats.recent.map((w, i) => (
                                    <div key={i} className="bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition">
                                        <div className="font-semibold text-gray-900 mb-1">
                                            {w.exercises ? (w.exercises[0]?.exercise ? `Exercise #${w.exercises[0].exercise}` : 'Exercise') : (w.exercise || 'Exercise')}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                {new Date(w.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})} | 
                                                {w.exercises ? (
                                                    <> {w.exercises[0]?.sets || '-'} sets × {w.exercises[0]?.reps || '-'} reps @ {w.exercises[0]?.weight || '-'} lbs</>
                                                ) : (
                                                    <> {w.sets} sets × {w.reps} reps @ {w.weight} lbs</>
                                                )}
                                            </span>
                                        </div>
                                        <button className="mt-2 text-teal-500 text-xs font-semibold hover:text-teal-600">View</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* CENTER: Hero Section */}
                <main className="flex flex-col items-center justify-center gap-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
                            Let's <span className="text-green-500">Transform Your Body</span> Now
                        </h1>
                        <p className="text-gray-700 text-sm md:text-base font-medium">
                            Track, train and crush your goals - all in one<br />app.
                        </p>
                    </div>

                    {/* Hero Ring */}
                    <div className="relative flex items-center justify-center w-full" style={{ minHeight: '200px', height: '200px' }}>
                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0" width="300" height="300" viewBox="0 0 400 400">
                            <circle cx="200" cy="200" r="170" stroke="#d1fae5" strokeWidth="24" fill="none" />
                            <path d="M60,200 a140,140 0 1,1 280,0" stroke="#22c55e" strokeWidth="24" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* CTA Button */}
                    <button
                        className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-green-400 font-bold rounded-lg shadow-lg transition text-base"
                        onClick={() => navigate("/log-workout")}
                    >
                        +Log New Workout
                    </button>
                </main>

                {/* RIGHT: Stat Circles */}
                <aside className="flex flex-col gap-8 items-center justify-center">
                    <div className="flex flex-col items-center justify-center border-2 border-green-500 rounded-full w-32 h-32 bg-white text-center">
                        <p className="text-xs font-semibold text-gray-900">Best</p>
                        <p className="text-xs text-green-500 font-semibold">Lift</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stats.bestLift}</p>
                        <p className="text-xs text-gray-600">lbs</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-green-500 rounded-full w-48 h-48 bg-white text-center">
                        <p className="text-sm font-semibold text-gray-900">Total</p>
                        <p className="text-sm text-green-500 font-semibold">Workouts</p>
                        <p className="text-5xl font-black text-gray-900 mt-2">{stats.total}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-green-500 rounded-full w-28 h-28 bg-white text-center">
                        <p className="text-xs font-semibold text-gray-900">This</p>
                        <p className="text-xs text-green-500 font-semibold">Week</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stats.thisWeek}</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Home;
