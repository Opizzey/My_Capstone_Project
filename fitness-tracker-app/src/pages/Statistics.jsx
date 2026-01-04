import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';

function getWeeklyData(workouts) {
  if (!workouts || workouts.length === 0) return [];
  const weekMap = {};
  workouts.forEach(w => {
    const d = new Date(w.date);
    if (isNaN(d)) return;
    const year = d.getFullYear();
    const week = Math.ceil((((d - new Date(year,0,1)) / 86400000) + new Date(year,0,1).getDay()+1)/7);
    const key = `${year}-W${week}`;
    weekMap[key] = (weekMap[key] || 0) + 1;
  });
  const sorted = Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-6).map(([week, count]) => ({ week, count }));
}

function getStats(workouts) {
  if (!workouts || workouts.length === 0) {
    return { bestLift: 0, total: 0, thisWeek: 0 };
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
  return { bestLift, total, thisWeek };
}

function Statistics() {
  const [stats, setStats] = useState({ bestLift: 0, total: 0, thisWeek: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      const ws = JSON.parse(saved);
      setWorkouts(ws);
      setStats(getStats(ws));
      setWeeklyData(getWeeklyData(ws));
    }
    // fetch exercise names for numeric IDs
    async function fetchExercises() {
      let all = [];
      let url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&status=2";
      try {
        while (url) {
          const res = await fetch(url);
          const data = await res.json();
          all = all.concat(data.results);
          url = data.next;
        }
        const map = {};
        all.forEach(ex => {
          let name = "";
          if (Array.isArray(ex.translations) && ex.translations.length > 0) {
            const en = ex.translations.find(t => t.language_short_name === "en");
            name = en ? en.name : ex.translations[0].name;
          }
          map[ex.id] = name || `Exercise #${ex.id}`;
        });
        setExerciseMap(map);
      } catch { /* ignore network issues */ }
    }
    fetchExercises();
  }, []);

  const bestExercises = useMemo(() => {
    if (!workouts || workouts.length === 0) return [];
    const entries = [];
    workouts.forEach(w => {
      const list = Array.isArray(w.exercises) && w.exercises.length ? w.exercises : [{ exercise: w.exercise, reps: w.reps, weight: w.weight }];
      list.forEach(ex => {
        if (!ex) return;
        entries.push({ exercise: ex.exercise, reps: Number(ex.reps) || 0, weight: Number(ex.weight) || 0 });
      });
    });
    const map = {};
    for (const e of entries) {
      const key = String(e.exercise);
      const vol = e.reps * e.weight;
      const item = map[key] || { exercise: key, volume: 0, pr: 0 };
      item.volume += vol;
      if (e.weight > item.pr) item.pr = e.weight;
      map[key] = item;
    }
    const list = Object.values(map)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 3)
      .map(it => ({
        name: exerciseMap[it.exercise] || (isNaN(Number(it.exercise)) ? it.exercise : `Exercise #${it.exercise}`),
        volume: Math.round(it.volume),
        pr: it.pr
      }));
    return list;
  }, [workouts, exerciseMap]);

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-black mb-8">Your Statistics</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Best Lift</p>
              <p className="text-4xl font-black text-green-600 mt-2">{stats.bestLift}</p>
              <p className="text-sm text-gray-600 mt-1">lbs</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Workouts</p>
              <p className="text-4xl font-black text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">This Week</p>
              <p className="text-4xl font-black text-gray-900 mt-2">{stats.thisWeek}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Weekly Workout Activity</h2>
          <div className="bg-gray-50 rounded-lg h-80 flex items-center justify-center border border-gray-200">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Best Exercises</h2>
          {bestExercises.length === 0 ? (
            <div className="text-gray-500">Log workouts to see your top exercises.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestExercises.map((ex, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500">#{i + 1}</div>
                  <div className="text-lg font-black text-gray-900">{ex.name}</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <div className="text-gray-600">Volume</div>
                    <div className="font-semibold text-green-600">{ex.volume.toLocaleString()} lbs</div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm">
                    <div className="text-gray-600">PR</div>
                    <div className="font-semibold text-gray-900">{ex.pr} lbs</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Statistics;