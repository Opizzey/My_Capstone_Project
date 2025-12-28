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

  return (
    <div>
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
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Logged Workouts</h2>
        <WorkoutList
          workouts={workouts}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}

export default LogWorkout;