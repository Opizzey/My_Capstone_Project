
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { getCurrentUser } from './lib/localAuth';
import Home from './pages/Home';
import LogWorkout from './pages/LogWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import Statistics from './pages/Statistics';
import About from './pages/About';
import AuthPage from './pages/AuthPage';

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <BrowserRouter>
        <Navbar />
        <div className="flex justify-end p-2 sm:p-4">
          <button
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 font-semibold hover:shadow-md transition text-sm sm:text-base"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
            title="Toggle dark/light mode"
          >
            {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log-workout" element={<LogWorkout />} />
            <Route path="/workout-history" element={<WorkoutHistory />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<AuthPage onAuth={u => { setUser(u); }} />} />
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;