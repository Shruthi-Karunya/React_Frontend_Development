// src/components/Employee/RequestLeave.jsx
import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function RequestLeave() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("SL");
  const [days, setDays] = useState(1);
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().slice(0, 10));
  const [balance, setBalance] = useState({ availableSL: 12, availableCL: 12, availableBL: 3 });

  const loadBalance = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${user.id}`);
      if (!res.ok) return;
      const emp = await res.json();
      setBalance({
        availableSL: Number(emp.availableSL ?? 12),
        availableCL: Number(emp.availableCL ?? 12),
        availableBL: Number(emp.availableBL ?? 3)
      });
    } catch (err) {
      console.error(err);
    }
  }, [user.id]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const submitLeave = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please enter a reason for leave.");
      return;
    }

    const payload = {
      employeeId: user.id,
      status: "pending",
      reason,
      leaveType,
      days,
      dateApplied
    };

    await fetch("http://localhost:5000/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    alert("Leave request submitted!");
    setReason("");
    setLeaveType("SL");
    setDays(1);
    setDateApplied(new Date().toISOString().slice(0, 10));
    navigate("/employee/home?tab=report");
  };

  return (
    <form onSubmit={submitLeave} className="card">
      <h2>Request Leave</h2>

      <div style={{ marginBottom: "12px" }}>
        <strong>Leave Balance:</strong>
        <div>SL: {balance.availableSL}</div>
        <div>CL: {balance.availableCL}</div>
        <div>BL: {balance.availableBL}</div>
      </div>

      <label>Leave Type</label>
      <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
        <option value="SL">SL</option>
        <option value="CL">CL</option>
        <option value="BL">BL</option>
      </select>

      <label>Days</label>
      <input
        type="number"
        min="1"
        value={days}
        onChange={(e) => setDays(Number(e.target.value) || 1)}
        style={{ width: "80px", marginBottom: "12px" }}
      />

      <label>Date</label>
      <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} />

      <label>Reason</label>
      <textarea
        placeholder="Reason for leave"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
