import React from "react";

function WorkoutItem({ workout, onDelete, onEdit }) {
  if (!workout) return null;

  function handleCopy() {
    let summary = '';
    if (workout.exercises && Array.isArray(workout.exercises)) {
      summary += `Workout on ${workout.date}\n`;
      workout.exercises.forEach((ex, i) => {
        summary += `#${i + 1}: ${ex.exercise} - ${ex.sets} sets x ${ex.reps} reps @ ${ex.weight}\n`;
      });
    } else {
      summary = `Workout: ${workout.exercise} | Sets: ${workout.sets} | Reps: ${workout.reps} | Weight: ${workout.weight} | Date: ${workout.date}`;
    }
    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition">
      <div className="flex flex-col gap-1 text-gray-700">
        {workout.exercises && Array.isArray(workout.exercises) ? (
          <>
            <div><span className="font-semibold">Date:</span> {workout.date}</div>
            {workout.exercises.map((ex, i) => (
              <div key={i}>
                <span className="font-semibold">Exercise {i + 1}:</span> {ex.exercise} | <span className="font-semibold">Sets:</span> {ex.sets} | <span className="font-semibold">Reps:</span> {ex.reps} | <span className="font-semibold">Weight:</span> {ex.weight}
              </div>
            ))}
          </>
        ) : (
          <>
            <div><span className="font-semibold">Exercise:</span> {workout.exercise}</div>
            <div><span className="font-semibold">Sets:</span> {workout.sets}</div>
            <div><span className="font-semibold">Reps:</span> {workout.reps}</div>
            <div><span className="font-semibold">Weight:</span> {workout.weight}</div>
            <div><span className="font-semibold">Date:</span> {workout.date}</div>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button
          className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          onClick={handleCopy}
        >
          Copy Summary
        </button>
        {onEdit && (
          <button
            className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold transition"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default WorkoutItem;
