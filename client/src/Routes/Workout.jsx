import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Workout.css';




const Workout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { intensity } = location.state || {};

    const getReps = (intensity) => {
        switch (intensity) {
            case "beginner":
                return {pushups : 5, situps: 5, squats : 5, wallsits : 30, plank : 30, highknees : 5};
            case "intermediate":
                return {pushups : 10, situps : 10, squats : 10, wallsits : 60, plank : 60, highknees : 10};
            case "advanced":
                return {pushups : 15, situps : 15, squats : 15, wallsits : 90, plank : 90, highknees : 15};
            default:
                return 0;
        }
    };

    const reps = getReps(intensity);

    const workouts = [
        { name: 'Push Ups', exercise: "pushups", reps: reps.pushups, progress: 0 },
        { name: 'Sit Ups', exercise: "situps", reps: reps.situps, progress: 0 },
        { name: 'Squats', exercise: "squats", reps: reps.squats, progress: 0 },
        { name: 'Wall Sits', exercise: "wallsits", time: reps.wallsits, progress: 0 },
        { name: 'Plank', exercise: "plank", time: reps.plank, progress: 0 },
        { name: 'High Knees', exercise: "highknees", reps: reps.highknees, progress: 0 }

    ];


    const startWorkout = (workoutName) => {
        navigate('/exercise', { state: { workout: workouts.find(workout => workout.name === workoutName) } });
    };

    const goBack = () => {
        navigate('/homepage');
    };

    return (
        <div className="workout-container">
            <div className="workout-columns">
                {workouts.map((workout, index) => (
                    <div key={index} className="workout-card">
                        <h2>{workout.name}</h2>
                        {workout.reps ? <p>Reps: {workout.reps}</p> : <p>Time: {workout.time} seconds</p>}
                        {workout.reps ? <p>Progress: {workout.progress}/{workout.reps}</p> : <p>Progress: {workout.progress}/{workout.time} seconds</p>}
                        <button className="start" onClick={() => startWorkout(workout.name)}>Start</button>
                    </div>
                ))}
            </div>
            <div className="bottom_buttons">
            <button className="finish" onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
};

export default Workout;