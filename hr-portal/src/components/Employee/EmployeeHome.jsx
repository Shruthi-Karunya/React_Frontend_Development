import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import Profile from "./Profile";
import RequestLeave from "./RequestLeave";
import EmployeeLeaveReport from "./EmployeeLeaveReport";

export default function EmployeeHome() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("request");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "report" || tab === "request" || tab === "profile") {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
        <div>
          <strong style={{ display: "block", marginBottom: "4px" }}>
            {user ? `Welcome, ${user.fname} ${user.lname}` : "Welcome"}
          </strong>
          <h1 style={{ margin: 0 }}>Employee Home</h1>
        </div>
        <div>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              backgroundColor: "#2f80ed",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "8px",
              width: "90px"
            }}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#eb5757",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              width: "80px"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("request")} style={{ padding: "8px 12px", backgroundColor: activeTab === "request" ? "#2f80ed" : "#f0f0f0", color: activeTab === "request" ? "#fff" : "#000", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Request Leave
        </button>
        <button onClick={() => setActiveTab("report")} style={{ padding: "8px 12px", backgroundColor: activeTab === "report" ? "#2f80ed" : "#f0f0f0", color: activeTab === "report" ? "#fff" : "#000", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          My Leave Report
        </button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {activeTab === "profile" && <Profile />}
        {activeTab === "request" && <RequestLeave />}
        {activeTab === "report" && <EmployeeLeaveReport />}
      </div>
    </div>
  );
}
