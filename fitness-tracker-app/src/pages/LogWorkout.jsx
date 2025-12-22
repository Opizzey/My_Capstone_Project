import WorkoutForm from "../components/WorkoutForm";

function LogWorkout() {
  const handleWorkoutSubmit = (formData) => {
    console.log("Workout logged:", formData);
  };

  return (
    <div>
      <h1>Log Workout</h1>
      <WorkoutForm onSubmit={handleWorkoutSubmit} />
    </div>
  );
}

export default LogWorkout;