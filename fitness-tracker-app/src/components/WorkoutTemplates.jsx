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
    <div className="bg-white rounded shadow p-4 mt-4">
      <h2 className="font-bold text-lg mb-2">Workout Templates</h2>
      <button
        className="mb-2 bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Template"}
      </button>
      {showForm && (
        <div className="mb-4">
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <input className="border px-2 py-1" placeholder="Exercise Name" value={exerciseInput.name} onChange={e => setExerciseInput({ ...exerciseInput, name: e.target.value })} />
              <input className="border px-2 py-1" placeholder="Sets" value={exerciseInput.sets} onChange={e => setExerciseInput({ ...exerciseInput, sets: e.target.value })} />
              <input className="border px-2 py-1" placeholder="Reps" value={exerciseInput.reps} onChange={e => setExerciseInput({ ...exerciseInput, reps: e.target.value })} />
              <input className="border px-2 py-1" placeholder="Weight" value={exerciseInput.weight} onChange={e => setExerciseInput({ ...exerciseInput, weight: e.target.value })} />
              <button className="bg-blue-400 text-white px-2 rounded" onClick={handleAddExerciseToTemplate} type="button">Add</button>
            </div>
            <ul className="mt-2">
              {newTemplate.exercises.map((ex, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <span>{ex.name} ({ex.sets}x{ex.reps} @ {ex.weight})</span>
                  <button className="text-red-500" onClick={() => handleRemoveExerciseFromTemplate(idx)} type="button">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            onClick={handleSaveTemplate}
            type="button"
          >
            Save Template
          </button>
        </div>
      )}
      <ul>
        {templates.map(t => (
          <li key={t.id} className="flex items-center justify-between border-b py-2">
            <span>{t.name}</span>
            <div>
              <button
                className="bg-gray-200 px-2 py-1 rounded mr-2"
                onClick={() => onSelectTemplate && onSelectTemplate(t)}
              >
                Use
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(t.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
