import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WebCam from "../Components/WebCam";
import "../css/Exercise.css";
import APICaller from "../APICaller";
const Exercise = () => {
    const location = useLocation();
    const { workout } = location.state || {};
    const navigate = useNavigate();
    const [done, setDone] = React.useState(false);
    const [feedback, setFeedback] = React.useState("");

    const onFinishExercise = async (repInfo) => {
        const res = await APICaller.post("/feedback", {data : repInfo});
        setFeedback(res.data.feedback);
        setDone(true);
        //navigate("/workout");
    };

    return (
        <div className={`exercise-container ${done ? 'feedback' : ''}`}>
            <h1>{workout.name}</h1>
            {!done ? (
                <WebCam exercise={workout.exercise} callback={onFinishExercise} time={workout.progress} />
            ) : (
                <h3>{feedback}</h3>
            )}
            {done && <button className = "back" onClick={() => navigate("/workout")}>Go back</button>}
        </div>
    );
};

export default Exercise;