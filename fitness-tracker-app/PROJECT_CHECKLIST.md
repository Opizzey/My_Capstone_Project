# 🏋️ Fitness Tracker Capstone – Execution Checklist

## 1. Project Setup & Foundation
- [*] Initialize React project with Vite
- [*] Set up Git & create initial commit
- [*] Install Tailwind CSS and configure
- [*] Set up React Router DOM
- [*] Create base folder structure (`src/components`, `src/pages`, etc.)
- [*] Build Navbar component
- [*] Build Footer component
- [*] Create initial page structure (Home, Log Workout, History, Progress)

---

## 2. Core Features – Part 1
- [*] Build WorkoutForm component (inputs: exercise, sets, reps, weight, date)
- [*] Create ExerciseSelector component (fetches from WGER API)
- [*] Integrate WGER API (fetch exercises, categories)
- [*] Display exercise options in WorkoutForm
- [*] Implement loading and error states for API calls

---

## 3. Core Features – Part 2
- [*] Implement localStorage for workout saving
- [*] Build WorkoutList component (lists all logged workouts)
- [*] Build WorkoutItem component (shows workout details)
- [*] Add delete/edit functionality for workouts
- [*] Handle form validation and submission

---

## 4. Progress Tracking
- [*] Choose and install chart library (Recharts or Chart.js)
- [*] Build ProgressChart component (visualize progress)
- [*] Add progress stats to Dashboard/Home page
- [*] Polish UI with Tailwind (spacing, colors, responsiveness)

---

## 5. Stretch Features (Optional)
- [*] Workout templates
	- [*] Design workout template data structure
	- [*] Add UI to create and name a new template from a workout
	- [*] Save templates to localStorage
	- [*] List and select templates when logging a new workout
	- [*] Allow editing and deleting templates
- [*] Dark mode toggle
- [*] Social sharing features
- [*] Workout reminders/notifications

---

## 6. General/Best Practices
- [*] Use React Hooks for state management (`useState`, `useEffect`)
- [*] Ensure mobile responsiveness (Tailwind breakpoints)
- [*] Handle API/network errors gracefully
- [*] Cache API results to reduce calls
- [*] Use version control (frequent commits, clear messages)
- [*] Keep code modular and reusable

---

## 7. Finalization & Deployment
- [ ] Test all features thoroughly (manual/automated)
- [ ] Fix bugs and edge cases
- [ ] Clean up codebase (remove unused code, comments)
- [ ] Write/Update documentation (README, screenshots)
- [ ] Deploy to Netlify or Vercel
- [ ] Share deployment link

