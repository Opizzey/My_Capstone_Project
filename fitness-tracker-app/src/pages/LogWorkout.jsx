function LogWorkout() {
  return (
    <div>
      <h1>Log Workout</h1>
      <form>
        <div>
          <label>Exercise Name:</label>
          <input type="text" placeholder="e.g. Bench Press" />
        </div>
        <div>
          <label>Sets:</label>
          <input type="number" min="1" />
        </div>
        <div>
          <label>Reps:</label>
          <input type="number" min="1" />
        </div>
        <div>
          <label>Weight (lbs):</label>
          <input type="number" min="0" />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" />
        </div>
        <button type="submit">Log Workout</button>
      </form>
    </div>
  );
}

export default LogWorkout;