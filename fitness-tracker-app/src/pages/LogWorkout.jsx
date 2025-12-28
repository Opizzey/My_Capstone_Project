import React, { useState, useEffect } from "react";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import WorkoutTemplates from "../components/WorkoutTemplates";


function LogWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [templateValues, setTemplateValues] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const handleWorkoutSubmit = (workout) => {
    if (editIndex !== null) {
      setWorkouts((prev) => prev.map((w, i) => (i === editIndex ? workout : w)));
      setEditIndex(null);
    } else {
      setWorkouts((prev) => [...prev, workout]);
    }
  };

  const handleDelete = (index) => {
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

    // Stats for left column
    const userName = "Emily";
    const bestBench = Math.max(0, ...workouts.filter(w => w.exercise === 'Bench Press').map(w => Number(w.weight) || 0));
    const bestDeadlift = Math.max(0, ...workouts.filter(w => w.exercise === 'Deadlift').map(w => Number(w.weight) || 0));
    const totalWorkouts = workouts.length;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const workoutsThisWeek = workouts.filter(w => {
      const d = new Date(w.date);
      return d >= weekStart && d <= now;
    }).length;
    const weeklyGoal = 5;
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-8">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="h-16 w-16 rounded-full border-2 border-green-400" />
              <div>
                <div className="font-bold text-lg">Hello {userName}!</div>
                <div className="text-gray-500 text-sm">Stay Fit &amp; Healthy</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl shadow p-4">
              <div className="font-semibold mb-1">Today's Work Out Plan</div>
              <div className="text-gray-500">4 sets of Bench Press, 3 sets of Squats.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <div className="font-semibold">Weekly Goal Check</div>
              <div className="my-2">
                <svg width="64" height="64">
                  <circle cx="32" cy="32" r="28" fill="#f3f4f6" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${(workoutsThisWeek/weeklyGoal)*175},175`} strokeLinecap="round" />
                  <text x="32" y="38" textAnchor="middle" fontSize="18" fill="#22c55e">{workoutsThisWeek}/{weeklyGoal}</text>
                </svg>
              </div>
              <div className="text-xs text-gray-500">Great progress this week!</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold mb-1">Personal Records (PRs)</div>
              <div className="flex flex-col gap-1 text-sm">
                <div>Bench Press 1RM: <span className="text-green-500 font-bold">{bestBench} lbs</span></div>
                <div>Deadlift 5x5: <span className="text-green-500 font-bold">{bestDeadlift} lbs</span></div>
                <div>Total Workouts Logged: <span className="text-green-500 font-bold">{totalWorkouts}</span></div>
                <a href="/statistics" className="text-green-600 text-xs mt-1 hover:underline">View Full Stats &rarr;</a>
              </div>
            </div>
          </div>
          {/* Center column: Log New Set and Trainer Spotlight */}
          <div className="flex flex-col gap-6">
            <div className="bg-green-500 rounded-t-xl p-4 text-white font-bold text-lg">Log New Set
              <div className="text-sm font-normal mt-1">Capture the details of your latest effort.</div>
            </div>
            <div className="bg-white rounded-b-xl shadow p-4">
              <WorkoutTemplates
                onSelectTemplate={template => {
                  if (template.exercises && template.exercises.length > 0) {
                    const ex = template.exercises[0];
                    setTemplateValues({
                      exercise: ex.name || "",
                      sets: ex.sets || "",
                      reps: ex.reps || "",
                      weight: ex.weight || "",
                      date: ""
                    });
                    if (template.exercises.length > 1) {
                      alert("Note: Only the first exercise is loaded into the form. You can add the rest manually or expand the form to support multiple exercises.");
                    }
                  }
                }}
              />
              <WorkoutForm
                onSubmit={handleWorkoutSubmit}
                initialValues={editIndex !== null ? workouts[editIndex] : templateValues}
                isEditing={editIndex !== null}
              />
            </div>
            <div className="bg-white rounded-xl shadow p-4 mt-4">
              <div className="font-semibold mb-1">Trainer Spotlight</div>
              <div className="italic text-gray-600 mb-2">"Focus on perfect form, and the numbers will follow. Great work logging those reps!"</div>
              <div className="text-xs text-right text-gray-500">Jake Taggart<br/>Certified Strength Coach</div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Logged Workouts</h2>
              <WorkoutList
                workouts={workouts}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
        <footer className="w-full bg-green-100 text-center py-4 text-gray-600 text-sm mt-8">
          &copy; 2025 FitVerse | Built for Progress
        </footer>
      </div>
    );
}

export default LogWorkout;