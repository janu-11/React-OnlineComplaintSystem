
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Import Pages
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Complaint from "./pages/Complaint";
import ComplaintDetails from "./pages/ComplaintDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Welcome Page */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* Citizen Authentication */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Admin Authentication */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* Citizen Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Citizen Complaint Submission */}
        <Route
          path="/complaint"
          element={<Complaint />}
        />

        {/* Complaint Details */}
        <Route
          path="/complaint/:id"
          element={<ComplaintDetails />}
        />

        {/* Invalid Routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
