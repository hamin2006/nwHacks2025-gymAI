import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

const Homepage = () => {
    const navigate = useNavigate();

    const handleAddWorkout = () => {
        navigate("/workout");
    };

    return (
        <div className="homepage-container">
            {/* Left Column: Previous Workouts */}
            <div className="previous-workouts">
                <div className="workout-card">
                    <h2 className="workout-title">Push-Ups</h2>
                </div>
                <div className="workout-card">
                    <h2 className="workout-title">Plank</h2>
                </div>
                <div className="workout-card">
                    <h2 className="workout-title">Sit-Ups</h2>
                </div>
                <button className="add-workout" onClick={handleAddWorkout}>
                    + Add Workout
                </button>
            </div>

            {/* Right Column: Welcome Message */}
            <div className="welcome-section">
                <h1 className="welcome-title">Welcome Back, Harsh!</h1>
                <p className="welcome-message">
                    Choose From your previous workouts
                </p>
            </div>
        </div>
    );
};

export default Homepage;
