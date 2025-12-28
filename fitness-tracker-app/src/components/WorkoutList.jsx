import React from "react";
import WorkoutItem from "./WorkoutItem";

function WorkoutList({ workouts, onDelete, onEdit }) {
  if (!workouts || workouts.length === 0) {
    return <p className="text-gray-400 italic text-center mt-4">No workouts logged yet.</p>;
  }

  return (
    <ul className="space-y-4 mt-4">
      {workouts.map((workout, idx) => (
        <li key={idx}>
          <WorkoutItem
            workout={workout}
            onDelete={() => onDelete && onDelete(idx)}
            onEdit={() => onEdit && onEdit(idx)}
          />
        </li>
      ))}
    </ul>
  );
}

export default WorkoutList;