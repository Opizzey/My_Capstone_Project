import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <div>
                <img src="../assets/logo.png" alt="FitVerse Logo" />
                <span>FitVerse</span>
            </div>
            <div>
                <Link to="/">Home</Link>
                <Link to="/log-workout">Log Workouts</Link>
                <Link to="/statistics">Statistics</Link>
                <Link to="/workout-history">History</Link>
                <Link to="/about">About</Link>
            </div>
            <div>
                <button>Login / Sign Up</button>
            </div>
        </nav>
    );
}

export default Navbar;