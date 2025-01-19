import React from 'react';
import { useLocation } from 'react-router-dom';
import WebCam from "../Components/WebCam";
import "../css/Exercise.css";
const Exercise = () => {
    const location = useLocation();
    const { workout } = location.state || {};
    return (
        <div className='exercise-container'>
            <h1>{workout.name}</h1>
            <WebCam exercise={workout.exercise} />
            <div className="button-group">
                <button className="finish-exercise">Finish Exercise</button>
            </div>
        </div>
    );
};

export default Exercise;