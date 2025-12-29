
import { useEffect, useState } from "react";

import React from "react";

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // {date, exercise, sets}
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
    // Fetch exercise names from WGER API
    async function fetchExercises() {
      let allExercises = [];
      let url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&status=2";
      try {
        while (url) {
          const res = await fetch(url);
          const data = await res.json();
          allExercises = allExercises.concat(data.results);
          url = data.next;
        }
        // Map id to name
        const map = {};
        allExercises.forEach(ex => {
          let name = "";
          if (Array.isArray(ex.translations) && ex.translations.length > 0) {
            const en = ex.translations.find(t => t.language_short_name === "en");
            name = en ? en.name : ex.translations[0].name;
          }
          map[ex.id] = name || `Exercise #${ex.id}`;
        });
        setExerciseMap(map);
      } catch (err) {
        setExerciseMap({});
      }
    }
    fetchExercises();
  }, []);

  // Placeholder values for stats
  const weeklyGoal = 4;
  const weeklyGoalTarget = 5;
  const peakPower = 610;
  const totalVolume = 13700;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header and stats cards */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Performance Hub</h1>
            <p className="text-gray-600">Track your volume, power output, and consistency.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-between">
            {/* Weekly Goal */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[180px]">
              <div className="font-bold text-gray-700 mb-1">WEEKLY GOAL</div>
              <svg width="48" height="48" className="mb-1">
                <circle cx="24" cy="24" r="20" fill="#f3f4f6" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray={`${(weeklyGoal/weeklyGoalTarget)*125},125`} strokeLinecap="round" />
              </svg>
              <div className="text-2xl font-bold">{weeklyGoal}/{weeklyGoalTarget}</div>
              <div className="text-green-500 text-sm">On Track</div>
            </div>
            {/* Peak Power */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[180px]">
              <div className="font-bold text-gray-700 mb-1 flex items-center gap-1">PEAK POWER <span className="text-yellow-400">⚡</span></div>
              <div className="text-3xl font-extrabold">{peakPower} <span className="text-lg font-bold text-gray-500">Watts</span></div>
              <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-1">
                <div className="h-2 bg-yellow-400 rounded" style={{ width: '80%' }}></div>
              </div>
              <div className="text-xs text-yellow-500">High Voltage</div>
            </div>
            {/* Total Volume */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[180px] border-2 border-blue-400">
              <div className="font-bold text-gray-700 mb-1 flex items-center gap-1">TOTAL VOLUME <span className="text-blue-400">📈</span></div>
              <div className="text-3xl font-extrabold">{totalVolume.toLocaleString()} <span className="text-lg font-bold text-gray-500">lbs</span></div>
              <div className="text-xs text-blue-500 mt-1">Last 5 Sessions</div>
            </div>
          </div>
        </div>
        {/* Search bar and filter button */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search Logs.."
            className="flex-1 px-4 py-2 rounded shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Filter dropdown for exercise */}
          <select
            className="px-4 py-2 rounded shadow border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 font-semibold"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All Exercises</option>
            {Array.from(new Set(workouts.map(w => w.exercise || (w.exercises && w.exercises[0]?.exercise))))
              .filter(Boolean)
              .map((ex, i) => (
                <option key={i} value={ex}>{exerciseMap[ex] || ex}</option>
              ))}
          </select>
        </div>
        {/* Grouped workout logs by date/session */}
        <div className="flex flex-col gap-6">
          {workouts.length === 0 ? (
            <p className="text-gray-400">No workouts logged yet.</p>
          ) : (
            Object.entries(
              workouts.reduce((acc, w) => {
                const key = `${w.date}__${w.exercise || (w.exercises && w.exercises[0]?.exercise)}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(w);
                return acc;
              }, {})
            )
              .filter(([key, logs]) => {
                const [date, exercise] = key.split("__");
                const exerciseName = exerciseMap[exercise] || exercise || "";
                return (
                  exerciseName.toLowerCase().includes(search.toLowerCase()) ||
                  date.toLowerCase().includes(search.toLowerCase())
                );
              })
              .reverse()
              .map(([key, logs], idx) => {
                const [date, exercise] = key.split("__");
                const d = new Date(date);
                const day = d.toLocaleString('en-US', { weekday: 'long' });
                const month = d.toLocaleString('en-US', { month: 'short' });
                return (
                  <div key={key} className="bg-green-50 border-l-4 border-green-400 rounded-xl shadow p-4 mb-4">
                    <div className="font-bold text-lg mb-2 text-green-700 flex items-center gap-2">
                      {exerciseMap[exercise] || exercise}
                      <span className="text-gray-400 text-base font-normal">
                        {month} {d.getDate()}, {d.getFullYear()} ({day})
                      </span>
                    </div>
                    <table className="table-auto w-full text-left mt-2">
                      <thead>
                        <tr className="border-b">
                          <th className="pr-4">SET</th>
                          <th className="pr-4">REPS</th>
                          <th className="pr-4">WEIGHT (LBS)</th>
                          <th className="pr-4">NOTES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, i) => (
                          <tr key={i} className="border-b last:border-b-0">
                            <td className="pr-4">#{i + 1}</td>
                            <td className="pr-4">{log.reps}</td>
                            <td className="pr-4">{log.weight}</td>
                            <td className="pr-4">{log.notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="mt-2 text-green-600 font-semibold hover:underline flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutHistory;

