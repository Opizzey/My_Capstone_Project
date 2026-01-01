import React, { useState, useEffect } from 'react';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutTemplates from '../components/WorkoutTemplates';

function LogWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [templateValues, setTemplateValues] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleWorkoutSubmit = (workout) => {
    if (editIndex !== null) {
      setWorkouts((prev) => prev.map((w, i) => (i === editIndex ? workout : w)));
      setEditIndex(null);
    } else {
      setWorkouts((prev) => [...prev, workout]);
    }
  };

  const userName = 'Emily';
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="border-l-4 border-green-500 pl-4 pt-8 mb-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold">Log Work Outs</h1>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 px-4 md:px-8 pb-8">
        <aside className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <img 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="User" 
              className="h-16 w-16 rounded-full border-2 border-green-500" 
            />
            <div>
              <div className="font-bold text-base">Hello {userName}!</div>
              <div className="text-gray-600 text-sm">Stay Fit & Healthy</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="font-semibold text-gray-900 mb-2">Today's Work Out Plan</div>
            <div className="text-gray-700 text-sm">4 sets of Bench Press, 3 sets of Squats.</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center">
            <div className="font-semibold text-gray-900 mb-2">Weekly Goal Check</div>
            <svg width="80" height="80" className="my-2">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="8" 
                strokeDasharray={String((workoutsThisWeek/weeklyGoal)*220) + ',220'} 
                strokeLinecap="round"
              />
              <text x="40" y="48" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#22c55e">
                {workoutsThisWeek}/{weeklyGoal}
              </text>
            </svg>
            <div className="text-green-600 font-semibold text-xs">Great progress this week!</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-semibold text-gray-900 mb-3">Personal Records (PRs)</div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span>Bench Press IRM:</span>
                <span className="text-green-600 font-bold">{bestBench} lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Deadlift 5x5:</span>
                <span className="text-green-600 font-bold">{bestDeadlift} lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Total Workouts Logged:</span>
                <span className="text-green-600 font-bold">{totalWorkouts}</span>
              </div>
              <a href="/statistics" className="text-green-600 text-xs mt-2 font-semibold hover:underline">View Full Stats </a>
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-green-500 text-white p-4 font-bold">
              <div className="text-lg">Log New Set</div>
              <div className="text-sm font-normal text-green-100">Capture the details of your latest effort.</div>
            </div>
            <div className="p-6">
              <WorkoutTemplates
                onSelectTemplate={template => {
                  if (template.exercises && template.exercises.length > 0) {
                    const ex = template.exercises[0];
                    setTemplateValues({
                      exercise: ex.name || '',
                      sets: ex.sets || '',
                      reps: ex.reps || '',
                      weight: ex.weight || '',
                      date: ''
                    });
                    if (template.exercises.length > 1) {
                      alert('Note: Only the first exercise is loaded into the form. You can add the rest manually.');
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
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="font-semibold text-gray-900 mb-2">Trainer Spotlight</div>
            <div className="italic text-gray-700 text-sm mb-3">
              "Focus on perfect form, and the numbers will follow. Great work logging those reps!"
            </div>
            <div className="text-xs text-gray-600 text-right">
              <div className="font-semibold">Jake Taggart</div>
              <div>Certified Strength Coach</div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-gray-200 bg-green-50 text-center py-4 text-gray-600 text-sm">
         2025 FitVerse | Built for Progress
      </footer>
    </div>
  );
}

export default LogWorkout;
