import { Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import PatientIntake from "./components/PatientIntake";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PatientIntake />} />
      </Routes>
    </>
  );
}

export default App;
