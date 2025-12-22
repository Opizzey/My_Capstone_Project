import { useState } from "react";
import ExerciseSelector from "./ExerciseSelector";

function WorkoutForm({ onSubmit }) {
  const [form, setForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    date: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    setForm({ exercise: "", sets: "", reps: "", weight: "", date: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Exercise:</label>
        <ExerciseSelector
        onSelect={exercise => setForm({ ...form, exercise })}
        />
      </div>
      <div>
        <label>Sets:</label>
        <input
          name="sets"
          type="number"
          min="1"
          value={form.sets}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Reps:</label>
        <input
          name="reps"
          type="number"
          min="1"
          value={form.reps}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Weight (lbs):</label>
        <input
          name="weight"
          type="number"
          min="0"
          value={form.weight}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Log Workout</button>
    </form>
  );
}

export default WorkoutForm;
