import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

const Homepage = () => {
    const [showForm, setShowForm] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [intensity, setIntensity] = useState("beginner");
    const [previousWorkouts, setPreviousWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
        setPreviousWorkouts(savedWorkouts);
    }, []);

    const handleAddWorkout = () => {
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newWorkout = {
            workoutName,
            intensity,
            timestamp: new Date().toLocaleString(),
        };

        const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
        savedWorkouts.push(newWorkout);
        localStorage.setItem("workouts", JSON.stringify(savedWorkouts));
        setPreviousWorkouts(savedWorkouts);

        navigate("/workout", { state: { workoutName, intensity } });
    };

    return (
        <div className="homepage-container">
            {/* Left Column: Previous Workouts */}
            <div className="previous-workouts">
                <h3>Previous Workouts</h3>
                <div className="workouts-container">
                    {previousWorkouts.map((workout, index) => (
                        <div key={index} className="workout-card" onClick={() => navigate("/workout", { state: workout })}>
                            <div className="workout-title">{workout.workoutName}</div>
                            <div className="workout-details">
                                Intensity: {workout.intensity} <br />
                                Date: {workout.timestamp}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="add-workout" onClick={handleAddWorkout}>
                    + Add Workout
                </button>
            </div>

            {/* Right Column: Welcome Message or Form */}
            <div className="welcome-section">
                {showForm ? (
                    <form className="workout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="workoutName">Workout Name</label>
                            <input
                                type="text"
                                id="workoutName"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="intensity">Intensity</label>
                            <select
                                id="intensity"
                                value={intensity}
                                onChange={(e) => setIntensity(e.target.value)}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                ) : (
                    <>
                        <h1 className="welcome-title">Welcome Back, Harsh!</h1>
                        <p className="welcome-message">
                            Choose From your previous workouts
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Homepage;