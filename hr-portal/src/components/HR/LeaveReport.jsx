// src/components/HR/LeaveReport.jsx
import { useEffect, useState } from "react";

export default function LeaveReport() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [employeesRes, leavesRes] = await Promise.all([
          fetch("http://localhost:5000/employees"),
          fetch("http://localhost:5000/leaves")
        ]);

        const employees = await employeesRes.json();
        const leaves = await leavesRes.json();

        // Group leaves by employeeId (coerce types since IDs may be strings/numbers)
        const reportData = employees.map(emp => ({
          ...emp,
          leaves: leaves.filter(
            (leave) => String(leave.employeeId) === String(emp.id)
          )
        }));

        setReport(reportData);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="card">
      <h2>Leave Reports by Employee</h2>
      {report.length === 0 ? (
        <p>Loading report...</p>
      ) : (
        report.map(emp => (
          <div key={emp.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <h3>{emp.fname} {emp.lname} (ID: {emp.id})</h3>
            <p>Email: {emp.email}</p>
            <p>Age: {emp.age}</p>
            <h4>Leave History:</h4>
            {emp.leaves.length === 0 ? (
              <p>No leaves recorded.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Leave ID</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Reason</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emp.leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{leave.id}</td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{leave.reason}</td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{leave.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
}