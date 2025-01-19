import React from "react";
import "../css/HomePage.css";

const Homepage = () => {
    return (
        <div className="homepage-container">
            {/* Left Column: Previous Workouts */}
            <div className="previous-workouts">
                <div className="workout-card">
                    <h2 className="workout-title">Workout 1</h2>
                </div>
                <div className="workout-card">
                    <h2 className="workout-title">Workout 2</h2>
                </div>
                <div className="workout-card">
                    <h2 className="workout-title">Workout 3</h2>
                </div>
                <button className="add-workout">
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
