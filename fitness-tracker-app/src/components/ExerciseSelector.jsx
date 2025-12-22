import { useEffect, useState } from "react";

function ExerciseSelector({ onSelect }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://wger.de/api/v2/exercise/?language=2&limit=50");
        const data = await res.json();
        setExercises(data.results);
      } catch (err) {
        setError("Failed to fetch exercises.");
      }
      setLoading(false);
    }
    fetchExercises();
  }, []);

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select onChange={e => onSelect && onSelect(e.target.value)}>
      <option value="">Select an exercise</option>
      {exercises.map(ex => (
        <option key={ex.id} value={ex.name}>{ex.name}</option>
      ))}
    </select>
  );
}

export default ExerciseSelector;