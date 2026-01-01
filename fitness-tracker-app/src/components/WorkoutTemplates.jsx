import { useState, useEffect } from "react";

// Utility functions for localStorage
const TEMPLATES_KEY = "workoutTemplates";

function loadTemplates() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTemplates(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export default function WorkoutTemplates({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({ name: "", exercises: [] });
  const [showForm, setShowForm] = useState(false);
  const [exerciseInput, setExerciseInput] = useState({ name: "", sets: "", reps: "", weight: "" });

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  function handleAddExerciseToTemplate() {
    if (!exerciseInput.name) return;
    setNewTemplate(t => ({
      ...t,
      exercises: [...t.exercises, exerciseInput]
    }));
    setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
  }

  function handleRemoveExerciseFromTemplate(idx) {
    setNewTemplate(t => ({
      ...t,
      exercises: t.exercises.filter((_, i) => i !== idx)
    }));
  }

  function handleSaveTemplate() {
    if (!newTemplate.name || newTemplate.exercises.length === 0) return;
    const template = {
      ...newTemplate,
      id: Date.now().toString(),
    };
    const updated = [...templates, template];
    setTemplates(updated);
    saveTemplates(updated);
    setShowForm(false);
    setNewTemplate({ name: "", exercises: [] });
  }

  function handleDelete(id) {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 glass rounded-2xl shadow p-6 mt-4 border border-gray-200 dark:border-gray-700">
      <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Workout Templates</h2>
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "✕ Cancel" : "+ Add Template"}
      </button>
      {showForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <input
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Template Name (e.g., Chest Day)"
            value={newTemplate.name}
            onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <div className="flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <input className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Exercise" value={exerciseInput.name} onChange={e => setExerciseInput({ ...exerciseInput, name: e.target.value })} />
              <input className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Sets" value={exerciseInput.sets} onChange={e => setExerciseInput({ ...exerciseInput, sets: e.target.value })} />
              <input className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Reps" value={exerciseInput.reps} onChange={e => setExerciseInput({ ...exerciseInput, reps: e.target.value })} />
              <input className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Weight" value={exerciseInput.weight} onChange={e => setExerciseInput({ ...exerciseInput, weight: e.target.value })} />
              <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 rounded-lg font-semibold" onClick={handleAddExerciseToTemplate} type="button">Add</button>
            </div>
            <ul className="mt-3 space-y-2">
              {newTemplate.exercises.map((ex, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{ex.name} <span className="text-sm text-gray-500 dark:text-gray-400">({ex.sets}×{ex.reps} @ {ex.weight}lbs)</span></span>
                  <button className="text-red-500 hover:text-red-700 font-bold" onClick={() => handleRemoveExerciseFromTemplate(idx)} type="button">×</button>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={handleSaveTemplate}
            type="button"
          >
            Save Template
          </button>
        </div>
      )}
      <ul className="space-y-3">
        {templates.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No templates yet. Create one to get started!</p>
        ) : (
          templates.map(t => (
            <li key={t.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition">
              <span className="font-semibold text-gray-800 dark:text-gray-100">{t.name}</span>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                  onClick={() => onSelectTemplate && onSelectTemplate(t)}
                >
                  Use
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
