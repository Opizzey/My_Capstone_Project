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

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading exercises...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <select value={value || ""} onChange={e => onSelect && onSelect(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full">
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