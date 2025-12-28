import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Example props: workouts = [{ date: '2025-12-01', exercise: 'Bench Press', weight: 100, reps: 8 }, ...]
export default function ProgressChart({ workouts, exerciseName }) {
  // Filter and sort workouts for the selected exercise
  const filtered = workouts
    .filter(w => w.exercise === exerciseName)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare chart data: show weight lifted over time
  const data = filtered.map(w => ({
    date: w.date,
    weight: w.weight,
    reps: w.reps
  }));

  if (data.length === 0) {
    return <div className="text-center text-gray-500">No data to display for this exercise.</div>;
  }

  return (
    <div className="w-full h-72 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Progress for {exerciseName}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg/lb)" />
          <Line type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
