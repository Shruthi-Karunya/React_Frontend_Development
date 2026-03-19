// src/components/HR/HRDashboard.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import EmployeeList from "./EmployeeList";
import LeaveRequests from "./LeaveRequests";
import LeaveReport from "./LeaveReport";

function AddEmployeeForm({ onAdded, onCancel }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fname || !lname || !age || !email || !password) {
      alert("Please fill in all fields including password.");
      return;
    }

    setSaving(true);
    try {
      const empRes = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname,
          lname,
          age: Number(age),
          email,
          availableSL: 12,
          availableCL: 12,
          availableBL: 5
        })
      });

      if (!empRes.ok) throw new Error("Failed to add employee");

      const newEmployee = await empRes.json();

      const userRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newEmployee.id,
          fname,
          lname,
          email,
          password,
          role: "employee",
          firstLogin: true
        })
      });

      if (!userRes.ok) throw new Error("Failed to create login credentials");

      onAdded();
    } catch (err) {
      console.error(err);
      alert("Unable to add employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <h3>Add Employee</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="First name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />
        <input
          placeholder="Last name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />
        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Initial password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function HRDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleEmployeeAdded = () => {
    setShowForm(false);
    setRefreshKey((k) => k + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {showForm && (
              <AddEmployeeForm onAdded={handleEmployeeAdded} onCancel={() => setShowForm(false)} />
            )}

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "10px" }}>
                  <button
                    onClick={() => setShowForm((s) => !s)}
                    style={{
                      backgroundColor: "#c8a2ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 18px",
                      cursor: "pointer",
                    }}
                  >
                    {showForm ? "Cancel" : "Add employee"}
                  </button>
                </div>
                <EmployeeList key={refreshKey} />
              </div>
              <div style={{ flex: 1 }}>
                <LeaveRequests />
              </div>
            </div>
          </>
        );
      case "reports":
        return <LeaveReport />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          position: "relative"
        }}
      >
        <div>
          <strong style={{ display: "block", marginBottom: "4px" }}>
            {user ? `Welcome, ${user.fname} ${user.lname}` : "Welcome"}
          </strong>
          <h1 style={{ margin: 0 }}>HR Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            margin: "8px",
            backgroundColor: "#eb5757",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.75rem",
            cursor: "pointer",
            width: "80px",
            height: "28px"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={{
            backgroundColor: activeTab === "dashboard" ? "#2f80ed" : "#f0f0f0",
            color: activeTab === "dashboard" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            padding: "10px 18px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          style={{
            backgroundColor: activeTab === "reports" ? "#2f80ed" : "#f0f0f0",
            color: activeTab === "reports" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Leave Reports
        </button>
      </div>

      {renderContent()}
    </div>
  );
}