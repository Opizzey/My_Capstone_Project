
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function getWeeklyData(workouts) {
  // Returns array of { week: 'YYYY-WW', count: n }
  if (!workouts || workouts.length === 0) return [];
  const weekMap = {};
  workouts.forEach(w => {
    const d = new Date(w.date);
    if (isNaN(d)) return;
    // Get ISO week string
    const year = d.getFullYear();
    const week = Math.ceil((((d - new Date(year,0,1)) / 86400000) + new Date(year,0,1).getDay()+1)/7);
    const key = `${year}-W${week}`;
    weekMap[key] = (weekMap[key] || 0) + 1;
  });
  // Sort by week, get last 6
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
  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      const workouts = JSON.parse(saved);
      setStats(getStats(workouts));
      setWeeklyData(getWeeklyData(workouts));
    }
  }, []);
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <ul className="mb-6 space-y-2">
        <li><span className="font-semibold">Best Lift:</span> {stats.bestLift} lbs</li>
        <li><span className="font-semibold">Total Workouts:</span> {stats.total}</li>
        <li><span className="font-semibold">This Week:</span> {stats.thisWeek}</li>
      </ul>
      <div className="bg-gray-100 rounded h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Statistics;