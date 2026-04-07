import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import JobDetails from "./pages/JobDetails";
import EmployerProfile from "./pages/EmployerProfile";
import WhyUsPage from "./pages/Whyus";
import AIRoadmapPage from "./pages/AiRoadmapPage";

function App() {
  return (
    <AppProvider>
      {/* Toast notifications */}
      <Toaster position="top-center" />

      {/* Navbar */}
      <Navbar />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/why-us" element={<WhyUsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
        <Route path="/ai-roadmap" element={<AIRoadmapPage />} />

        <Route path="/employer-profile" element={<EmployerProfile />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
