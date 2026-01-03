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
    const [heroSrc, setHeroSrc] = useState(null);
    const [heroAvailable, setHeroAvailable] = useState(false);
    const arcStroke = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("workouts");
        if (saved) {
            const workouts = JSON.parse(saved);
            setStats(getStats(workouts));
        }
    }, []);

    useEffect(() => {
        const heroCandidates = ["/home-hero.jpg", "/home-hero.png", "/home-hero.jpeg", "/images/home-hero.jpg"];
        let i = 0;
        const tryNextHero = () => {
            if (i >= heroCandidates.length) { setHeroAvailable(false); return; }
            const img = new Image();
            img.onload = () => { setHeroSrc(heroCandidates[i]); setHeroAvailable(true); };
            img.onerror = () => { i += 1; tryNextHero(); };
            img.src = heroCandidates[i];
        };
        tryNextHero();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 px-4 md:px-8 py-8">
            <div className="container-app grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
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
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-teal-400" />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-gray-900 mb-1">
                                                    {w.exercises ? (w.exercises[0]?.exercise ? `Exercise #${w.exercises[0].exercise}` : 'Exercise') : (w.exercise || 'Exercise')}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-200">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        {new Date(w.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})} |
                                                        {w.exercises ? (
                                                            <> {w.exercises[0]?.sets || '-'} sets × {w.exercises[0]?.reps || '-'} reps @ {w.exercises[0]?.weight || '-'} lbs</>
                                                        ) : (
                                                            <> {w.sets} sets × {w.reps} reps @ {w.weight} lbs</>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50">View</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                <main className="flex flex-col items-center justify-center gap-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
                            Let's <span className="text-green-500">Transform Your Body</span> Now
                        </h1>
                        <p className="text-gray-700 text-sm md:text-base font-medium">
                            Track, train and crush your goals - all in one<br />app.
                        </p>
                    </div>

                    <div className="relative flex items-center justify-center w-full">
                        <div className="relative w-72 h-72 md:w-[22rem] md:h-[22rem]">
                            <svg className="absolute inset-0 z-20" width="100%" height="100%" viewBox="0 0 100 100" aria-hidden="true">
                                <circle cx="50" cy="50" r={50 - arcStroke/2} stroke="#e3f7e6" strokeWidth={arcStroke} fill="none" />
                                <circle
                                    cx="50" cy="50" r={50 - arcStroke/2}
                                    stroke="#22c55e" strokeWidth={arcStroke} fill="none" strokeLinecap="round"
                                    pathLength="100" strokeDasharray="70 100"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            {heroAvailable && heroSrc ? (
                                <img
                                    src={heroSrc}
                                    alt="Fitness hero"
                                    className="relative z-10 w-full h-full object-cover rounded-full overflow-hidden bg-transparent"
                                />
                            ) : (
                                <div className="relative z-10 w-full h-full rounded-full bg-transparent flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-900">Upload a hero image</p>
                                        <p className="text-xs text-green-500">public/home-hero.jpg</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-green-400 font-bold rounded-lg shadow-lg transition text-base"
                        onClick={() => navigate("/log-workout")}
                    >
                        +Log New Workout
                    </button>
                </main>

                <aside className="flex flex-col gap-8 items-center justify-center">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-3 border-blue-500" />
                        <div className="absolute inset-3 rounded-full border-2 border-blue-200" />
                        <div className="relative z-10 w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center">
                            <p className="text-[11px] font-semibold text-gray-900">Best</p>
                            <p className="text-[11px] text-gray-900">Lift</p>
                            <p className="text-xl font-black text-gray-900 mt-1">{stats.bestLift}</p>
                            <p className="text-[11px] text-gray-700">lbs</p>
                        </div>
                    </div>

                    <div className="relative w-56 h-56">
                        <div className="absolute inset-0 rounded-full border-2 border-green-300" />
                        <div className="absolute inset-6 rounded-full border-2 border-green-200" />
                        <div className="relative z-10 w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center">
                            <p className="text-base font-semibold text-gray-900">Total</p>
                            <p className="text-base text-green-600 font-semibold">Workouts</p>
                            <p className="text-5xl font-black text-gray-900 mt-2">{stats.total}</p>
                        </div>
                    </div>

                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-2 border-green-500" />
                        <div className="relative z-10 w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center">
                            <p className="text-[11px] text-gray-900">This</p>
                            <p className="text-[11px] text-gray-900">Week</p>
                            <p className="text-xl font-black text-gray-900 mt-1">{stats.thisWeek}</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Home;
