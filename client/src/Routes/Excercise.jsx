import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WebCam from "../Components/WebCam";
import "../css/Exercise.css";
import APICaller from "../APICaller";
const Exercise = () => {
    const location = useLocation();
    const { workout } = location.state || {};
    const navigate = useNavigate();
    const onFinishExercise = (repInfo) => {
        navigate("/workout");
    };
    return (
        <div className='exercise-container'>
            <h1>{workout.name}</h1>
            <WebCam exercise={workout.exercise} callback = {onFinishExercise}/>
        </div>
    );
};

export default Exercise;