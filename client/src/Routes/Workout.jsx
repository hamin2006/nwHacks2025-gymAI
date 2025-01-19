import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Workout.css';

const startWorkout = (workoutName) => {
    alert(`${workoutName} workout started!`);
};

const finishWorkout = () => {
    alert(`Workout finished!`);
};

const Workout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { intensity } = location.state || {};

    const getReps = (intensity) => {
        switch (intensity) {
            case "beginner":
                return 8;
            case "intermediate":
                return 12;
            case "advanced":
                return 20;
            default:
                return 0;
        }
    };

    const reps = getReps(intensity);

    const workouts = [
        { name: 'Push Up', reps },
        { name: 'Sit Up', reps },
        { name: 'Squats', reps },

    ];

    const workoutsTwo = [
        { name: 'Wall Sits', reps },
        { name: 'Plank', reps },
        { name: 'High Knees', reps }
    ];

    const goBack = () => {
        navigate('/homepage'); // Navigate to the Homepage route
    };

    return (
        <div className="workout-container">
            <div className="workout-columns">
                {workouts.map((workout, index) => (
                    <div key={index} className="workout-card">
                        <h2>{workout.name}</h2>
                        <p>Reps: {workout.reps}</p>
                        <button className="start" onClick={() => startWorkout(workout.name)}>Start</button>
                    </div>
                ))}
            </div>
            <div className="workout-columns">
                {workoutsTwo.map((workout, index) => (
                    <div key={index} className="workout-card">
                        <h2>{workout.name}</h2>
                        <p>Reps: {workout.reps}</p>
                        <button className="start" onClick={() => startWorkout(workout.name)}>Start</button>
                    </div>
                ))}
            </div>
            <div className="bottom_buttons">
            <button className="finish" onClick={finishWorkout}>Finish Workout</button>
            <button className="finish" onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
};

export default Workout;