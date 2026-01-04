import { useEffect, useMemo, useState } from "react";
import React from "react";
import Modal from "../components/Modal";

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
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

  const weeklyGoal = 4;
  const weeklyGoalTarget = 5;
  const peakPower = 610;
  const totalVolume = 13700;

  const rows = workouts.flatMap(w => {
    if (Array.isArray(w.exercises) && w.exercises.length) {
      return w.exercises.map(ex => ({
        date: w.date,
        exercise: ex.exercise,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        notes: ex.notes,
      }));
    }
    return [{
      date: w.date,
      exercise: w.exercise,
      sets: w.sets,
      reps: w.reps,
      weight: w.weight,
      notes: w.notes,
    }];
  });

  const uniqueExercises = Array.from(new Set(rows.map(r => r.exercise))).filter(Boolean);

  const [openKey, setOpenKey] = useState(null);
  const openLogs = useMemo(() => {
    if (!openKey) return [];
    const [d, ex] = openKey.split("__");
    return rows.filter(r => r.date === d && String(r.exercise) === String(ex));
  }, [openKey, rows]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between relative">

      <div className="container-app py-8 relative z-10">
        <div className="border-l-4 border-green-500 pl-4 mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">History</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Performance Hub</h2>
          <p className="text-gray-700 text-sm mb-6">Track your volume, power output, and consistency.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center">
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">Weekly Goal</div>
              <svg width="64" height="64" className="mb-3">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="5" 
                  strokeDasharray={`${(weeklyGoal/weeklyGoalTarget)*176},176`} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-3xl font-black text-gray-900 mb-1">{weeklyGoal}/{weeklyGoalTarget}</div>
              <div className="text-green-600 font-semibold text-xs">On Track</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center">
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4 flex items-center gap-1">Peak Power ⚡</div>
              <div className="text-3xl font-black text-gray-900 mb-2">{peakPower} <span className="text-lg font-bold text-gray-500">Watts</span></div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="text-xs font-semibold text-yellow-500">High Voltage</div>
            </div>

            <div className="bg-white border-2 border-green-500 rounded-lg p-6 flex flex-col items-center">
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4 flex items-center gap-1">Total Volume 💪</div>
              <div className="text-3xl font-black text-gray-900 mb-1">{totalVolume.toLocaleString()} <span className="text-lg font-bold text-gray-500">lbs</span></div>
              <div className="text-xs font-semibold text-green-600">Last 5 Sessions</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <input
            type="text"
            placeholder="Search Logs.."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
            ⊕ Filter Logs
          </button>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          {rows.length === 0 ? (
            <p className="text-gray-400">No workouts logged yet.</p>
          ) : (
            Object.entries(rows.reduce((acc, r) => {
              const key = `${r.date}__${r.exercise}`;
              if (!acc[key]) acc[key] = [];
              acc[key].push(r);
              return acc;
            }, {}))
              .filter(([key, logs]) => {
                const [date, exercise] = key.split("__");
                const exerciseName = exerciseMap[exercise] || exercise || "";
                const matchesSearch = (
                  exerciseName.toLowerCase().includes(search.toLowerCase()) ||
                  date.toLowerCase().includes(search.toLowerCase())
                );
                const matchesFilter = !filter || exercise === filter;
                return matchesSearch && matchesFilter;
              })
              .reverse()
              .map(([key, logs]) => {
                const [date, exercise] = key.split("__");
                const d = new Date(date);
                const day = d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
                const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const dayNum = d.getDate();

                return (
                  <div key={key} className="bg-white border-l-4 border-green-500 rounded-lg p-6 hover:shadow-md transition">
                    <div className="grid grid-cols-[80px_1fr] gap-6 mb-4">
                      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                        <div className="text-xs font-bold text-gray-500 uppercase">{month}</div>
                        <div className="text-xl font-black text-gray-900">{dayNum}</div>
                        <div className="text-xs text-gray-600 uppercase">{day}</div>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-gray-900 mb-4">
                          {(() => {
                            if (!exercise) return 'Unknown';
                            const mapped = exerciseMap[exercise];
                            if (mapped) return mapped;
                            if (typeof exercise === 'string' && isNaN(Number(exercise))) return exercise;
                            return 'Unknown';
                          })()}
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="pb-2 font-semibold text-gray-700 uppercase text-xs">Set</th>
                                <th className="pb-2 font-semibold text-gray-700 uppercase text-xs">Reps</th>
                                <th className="pb-2 font-semibold text-gray-700 uppercase text-xs">Weight (lbs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logs.map((log, i) => (
                                <tr key={i} className="border-b border-gray-100 last:border-b-0">
                                  <td className="py-2 text-gray-700">#{i + 1}</td>
                                  <td className="py-2 text-gray-700">{log.reps || '-'}</td>
                                  <td className="py-2 text-gray-700">{log.weight || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <button onClick={() => setOpenKey(key)} className="mt-4 px-4 py-2 text-green-600 font-semibold text-sm hover:text-green-700 flex items-center gap-1">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
      <Modal
        open={!!openKey}
        onClose={() => setOpenKey(null)}
        title={(() => {
          if (!openKey) return '';
          const [date, exercise] = openKey.split("__");
          const name = exerciseMap[exercise] || (isNaN(Number(exercise)) ? exercise : `Exercise #${exercise}`);
          return `${name} · ${date}`;
        })()}
      >
        {openLogs.length === 0 ? (
          <div className="text-gray-500">No details found.</div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Total sets: <span className="font-semibold text-gray-900">{openLogs.length}</span></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 font-semibold text-gray-700 uppercase text-xs">Set</th>
                    <th className="py-2 font-semibold text-gray-700 uppercase text-xs">Reps</th>
                    <th className="py-2 font-semibold text-gray-700 uppercase text-xs">Weight</th>
                    <th className="py-2 font-semibold text-gray-700 uppercase text-xs">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {openLogs.map((log, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-2">#{i + 1}</td>
                      <td className="py-2">{log.reps || '-'}</td>
                      <td className="py-2">{log.weight || '-'}</td>
                      <td className="py-2 text-gray-600">{log.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WorkoutHistory;
