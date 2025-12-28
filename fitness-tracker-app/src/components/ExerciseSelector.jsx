import { useEffect, useState } from "react";

function ExerciseSelector({ onSelect, value }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllExercises() {
      setLoading(true);
      setError(null);
      let allExercises = [];
      let url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&status=2";
      try {
        while (url) {
          const res = await fetch(url);
          const data = await res.json();
          allExercises = allExercises.concat(data.results);
          url = data.next; // API provides next page URL or null
        }
        setExercises(allExercises);
      } catch (err) {
        setError("Failed to fetch exercises.");
        console.error("Exercise fetch error:", err);
      }
      setLoading(false);
    }
    fetchAllExercises();
  }, []);

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  // Debug: log the first exercise object
  if (exercises.length > 0) {
    console.log("Sample exercise object:", exercises[0]);
  }

  return (
    <select value={value || ""} onChange={e => onSelect && onSelect(e.target.value)}>
      <option value="">Select an exercise</option>
      {exercises.map(ex => {
        let exerciseName = "";
        if (Array.isArray(ex.translations) && ex.translations.length > 0) {
          const en = ex.translations.find(t => t.language_short_name === "en");
          exerciseName = en ? en.name : ex.translations[0].name;
        }
        return (
          <option key={ex.id} value={ex.id}>
            {exerciseName || `Exercise #${ex.id}`}
          </option>
        );
      })}
    </select>
  );
}

export default ExerciseSelector;