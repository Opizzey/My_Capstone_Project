import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function ProgressChart({ workouts, exerciseName }) {
  const filtered = workouts
    .filter(w => w.exercise === exerciseName)
    .sort((a, b) => new Date(a.date) - new Date(b.date));


  const data = filtered.map(w => ({
    date: w.date,
    weight: w.weight,
    reps: w.reps
  }));

  if (data.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">No data to display for this exercise.</div>;
  }

  return (
    <div className="w-full h-72 bg-white/70 dark:bg-gray-800/70 glass rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Progress: {exerciseName}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#22c55e" name="Weight (lbs)" strokeWidth={2} dot={{ fill: '#22c55e' }} />
          <Line type="monotone" dataKey="reps" stroke="#3b82f6" name="Reps" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
