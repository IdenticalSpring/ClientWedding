import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import LandingPage from "./landing-page/LandingPage";
import DashboardLayoutBasic from "./manager/Manager";
import GuestList from "./manager/Guest-list";

function App() {
  return (
    <Router>
      <Routes>
        {/* Định nghĩa các route */}
        <Route path="*" element={<LandingPage />} />
        <Route path="/MarketingPage/" element={<LandingPage />} />
        <Route path="/sign-in/" element={<SignIn />} />
        <Route path="/sign-up/" element={<SignUp />} />
        <Route path="/manager/" element={<DashboardLayoutBasic />} />
        <Route path="/guest-list/" element={<GuestList />} />
      </Routes>
    </Router>
  );
}

export default App;
