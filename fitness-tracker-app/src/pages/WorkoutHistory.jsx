
import { useEffect, useState } from "react";

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});
  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
    // Fetch exercise names from WGER API
    async function fetchExercises() {
      let allExercises = [];
      let url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&status=2";
      try {
        while (url) {
          const res = await fetch(url);
          const data = await res.json();
          allExercises = allExercises.concat(data.results);
          url = data.next;
        }
        // Map id to name
        const map = {};
        allExercises.forEach(ex => {
          let name = "";
          if (Array.isArray(ex.translations) && ex.translations.length > 0) {
            const en = ex.translations.find(t => t.language_short_name === "en");
            name = en ? en.name : ex.translations[0].name;
          }
          map[ex.id] = name || `Exercise #${ex.id}`;
        });
        setExerciseMap(map);
      } catch (err) {
        setExerciseMap({});
      }
    }
    fetchExercises();
  }, []);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Workout History</h1>
      {workouts.length === 0 ? (
        <p className="text-gray-400">No workouts logged yet.</p>
      ) : (
        <ul className="space-y-4">
          {[...workouts].reverse().map((w, idx) => (
            <li key={idx} className="border-b pb-2">
              <div className="font-semibold text-green-600">{w.date}</div>
              {w.exercises ? (
                <ul className="ml-4 list-disc">
                  {w.exercises.map((ex, i) => (
                    <li key={i}>
                      {exerciseMap[ex.exercise] || ex.exercise || "Exercise"} - {ex.sets} sets × {ex.reps} reps @ {ex.weight} lbs
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  {exerciseMap[w.exercise] || w.exercise} - {w.sets} sets × {w.reps} reps @ {w.weight} lbs
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkoutHistory;