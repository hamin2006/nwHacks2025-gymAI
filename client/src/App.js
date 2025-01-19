import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import "./css/App.css";
import LoginPage from "./Routes/LoginPage";
import Workout from "./Routes/Workout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Workout />} />
      </Routes>
    </Router>
  );
}

export default App;
