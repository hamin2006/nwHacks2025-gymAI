import React from 'react';
import '../css/Workout.css'; // Importing the CSS file

const workouts = [
    { name: 'Push Up', reps: 20 },
    { name: 'Sit Up', reps: 20 },
    { name: 'Squats', reps: 20 },
    { name: 'Wall Sits', reps: 20 },
    { name: 'Plank', reps: 20 },
    { name: 'High Knees', reps: 20 }
];

const startWorkout = (workoutName) => {
    alert(`${workoutName} workout started!`);
};

const finishWorkout = () => {
    alert(`Workout finished!`);
};

const Workout = () => {
    return (
        <div className="workout-container">
            <div className="workout-columns">
                {workouts.map((workout, index) => (
                    <div key={index} className={`workout-column ${index === 1 ? 'middle-column' : ''}`}>
                        <p>{workout.name}: {workout.reps} reps</p>
                        <button className="start-workout-button" onClick={() => startWorkout(workout.name)}>Start Workout</button>
                    </div>
                ))}
            </div>
            <button className="finish-workout-button" onClick={finishWorkout}>Finish Workout</button>
        </div>
    );
};

export default Workout;