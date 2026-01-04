
import { useEffect, useState } from "react";
import ExerciseSelector from "./ExerciseSelector";
import DateInput from "./DateInput";

function WorkoutForm({ onSubmit, initialValues, isEditing }) {
  const [date, setDate] = useState(initialValues?.date || "");
  const [exercises, setExercises] = useState(initialValues?.exercises || [
    {
      exercise: initialValues?.exercise || "",
      sets: initialValues?.sets || "",
      reps: initialValues?.reps || "",
      weight: initialValues?.weight || "",
    },
  ]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setDate(initialValues.date || "");
      if (initialValues.exercises) {
        setExercises(initialValues.exercises.map(ex => ({
          ...ex,
          exercise: ex.exercise || ""
        })));
      } else if (initialValues.exercise) {
        setExercises([
          {
            exercise: initialValues.exercise,
            sets: initialValues.sets || "",
            reps: initialValues.reps || "",
            weight: initialValues.weight || "",
          },
        ]);
      }
    }
  }, [initialValues]);

  function validate() {
    const errs = {};
    if (!date) errs.date = "Date is required.";
    if (!exercises.length) errs.exercises = "At least one exercise required.";
    exercises.forEach((ex, idx) => {
      const exVal = typeof ex.exercise === "number" ? String(ex.exercise) : (ex.exercise || "");
      if (exVal.trim() === "") {
        errs[`exercise_${idx}`] = "Exercise is required.";
      }
      if (ex.sets === undefined || ex.sets === null || isNaN(Number(ex.sets)) || Number(ex.sets) < 1) {
        errs[`sets_${idx}`] = "Sets must be at least 1.";
      }
      if (ex.reps === undefined || ex.reps === null || isNaN(Number(ex.reps)) || Number(ex.reps) < 1) {
        errs[`reps_${idx}`] = "Reps must be at least 1.";
      }
    });
    return errs;
  }

  function handleExerciseChange(idx, field, value) {
    setExercises(exs => exs.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
    setErrors(errs => ({ ...errs, [`${field}_${idx}`]: undefined }));
  }

  function handleAddExercise() {
    setExercises(exs => [...exs, { exercise: "", sets: "", reps: "", weight: "" }]);
  }

  function handleRemoveExercise(idx) {
    setExercises(exs => exs.filter((_, i) => i !== idx));
  }

  function handleDateChange(e) {
    setDate(e.target.value);
    setErrors(errs => ({ ...errs, date: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (onSubmit) onSubmit({ date, exercises });
    setDate("");
    setExercises([{ exercise: "", sets: "", reps: "", weight: "" }]);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-gray-800/70 glass rounded-2xl shadow-lg p-6 max-w-lg mx-auto flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-2">
        <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Date</label>
        <DateInput
          value={date}
          onChange={(val) => { setDate(val); setErrors(errs => ({ ...errs, date: undefined })); }}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Exercises</label>
        {exercises.map((ex, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 items-end mb-2">
            <div className="min-w-[180px] flex-1">
              <ExerciseSelector
                onSelect={exerciseId => handleExerciseChange(idx, "exercise", exerciseId)}
                value={ex.exercise}
              />
              {errors[`exercise_${idx}`] && <div className="text-red-500 text-sm">{errors[`exercise_${idx}`]}</div>}
            </div>
            <input
              name="sets"
              placeholder="Sets"
              className="border rounded px-2 py-1 w-20 text-gray-900"
              value={ex.sets}
              onChange={e => handleExerciseChange(idx, "sets", e.target.value)}
            />
            {errors[`sets_${idx}`] && <div className="text-red-500 text-sm">{errors[`sets_${idx}`]}</div>}
            <input
              name="reps"
              placeholder="Reps"
              className="border rounded px-2 py-1 w-20 text-gray-900"
              value={ex.reps}
              onChange={e => handleExerciseChange(idx, "reps", e.target.value)}
            />
            {errors[`reps_${idx}`] && <div className="text-red-500 text-sm">{errors[`reps_${idx}`]}</div>}
            <input
              name="weight"
              placeholder="Weight"
              className="border rounded px-2 py-1 w-24 text-gray-900"
              value={ex.weight}
              onChange={e => handleExerciseChange(idx, "weight", e.target.value)}
            />
            <button type="button" className="text-red-500 ml-2" onClick={() => handleRemoveExercise(idx)} disabled={exercises.length === 1}>Remove</button>
          </div>
        ))}
        <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-fit font-semibold transition" onClick={handleAddExercise}>+ Add Exercise</button>
        {errors.exercises && <div className="text-red-500 text-sm mt-1">{errors.exercises}</div>}
      </div>
      <button type="submit" className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition text-base sm:text-lg">{isEditing ? "Save Workout" : "Add Workout"}</button>
    </form>
  );
}

export default WorkoutForm;

