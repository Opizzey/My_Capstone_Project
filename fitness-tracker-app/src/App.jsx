
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import LogWorkout from './pages/LogWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import Statistics from './pages/Statistics';
import About from './pages/About';
import AuthPage from './pages/AuthPage';

function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen transition-colors">
      <BrowserRouter>
        <Navbar />
        <div className="flex justify-end p-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border dark:border-gray-600"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log-workout" element={<LogWorkout />} />
            <Route path="/workout-history" element={<WorkoutHistory />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<AuthPage onAuth={user => alert('Signed in as: ' + user.email)} />} />
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;