import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import HRDashboard from "./components/HR/HRDashboard";
import EmployeeList from "./components/HR/EmployeeList";
import LeaveRequests from "./components/HR/LeaveRequests";
import Profile from "./components/Employee/Profile";
import RequestLeave from "./components/Employee/RequestLeave";
import ChangePassword from "./components/Employee/ChangePassword";
import EmployeeHome from "./components/Employee/EmployeeHome";
import "./styles/theme.css";

function ProtectedRoute({ children, role, allowFirstLogin = false }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  if (user.role === "employee" && user.firstLogin && !allowFirstLogin) {
    return <Navigate to="/employee/change-password" />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* HR Routes */}
        <Route path="/hr/dashboard" element={
          <ProtectedRoute role="hr"><HRDashboard /></ProtectedRoute>
        } />
        <Route path="/hr/employees" element={
          <ProtectedRoute role="hr"><EmployeeList /></ProtectedRoute>
        } />
        <Route path="/hr/leaves" element={
          <ProtectedRoute role="hr"><LeaveRequests /></ProtectedRoute>
        } />

        {/* Employee Routes */}
        <Route path="/employee/home" element={
          <ProtectedRoute role="employee"><EmployeeHome /></ProtectedRoute>
        } />
        <Route path="/employee/profile" element={
          <ProtectedRoute role="employee"><Profile /></ProtectedRoute>
        } />
        <Route path="/employee/request-leave" element={
          <ProtectedRoute role="employee"><RequestLeave /></ProtectedRoute>
        } />
        <Route path="/employee/change-password" element={
          <ProtectedRoute role="employee" allowFirstLogin><ChangePassword /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
