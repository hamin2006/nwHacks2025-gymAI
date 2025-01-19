import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Routes/Home";
import "./css/App.css";
import LoginPage from "./Routes/LoginPage";
import Homepage from "./Routes/homepage";
import Workout from "./Routes/Workout";
import Exercise from "./Routes/Excercise";
import WebCam from "./Components/WebCam";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/exercise" element={<Exercise />} />
      </Routes>
    </Router>
  );
}

export default App;
