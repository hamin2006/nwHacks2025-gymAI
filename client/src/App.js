import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import "./css/App.css";
import LoginPage from "./Routes/LoginPage";
import Homepage from "./Routes/homepage";
import Workout from "./Routes/Workout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
<<<<<<< HEAD
=======
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/workout" element={<Workout />} />
>>>>>>> 534e89a273855a1d040f10b56975091c60804dc7
      </Routes>
    </Router>
  );
}

export default App;
