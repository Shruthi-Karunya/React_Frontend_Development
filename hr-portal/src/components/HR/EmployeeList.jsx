// src/components/HR/EmployeeList.jsx
import { useEffect, useState } from "react";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  const deleteEmployee = async (id) => {
    await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
    setEmployees(employees.filter(e => e.id !== id));
  };

  const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f4f4f4", textAlign: "left" };
  const tdStyle = { border: "1px solid #ccc", padding: "8px", whiteSpace: "normal" };

  return (
    <div className="card" style={{ width: "100%" }}>
      <h2>Employee Records</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Age</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td style={tdStyle}>{emp.id}</td>
                <td style={tdStyle}>{emp.fname} {emp.lname}</td>
                <td style={tdStyle}>{emp.age ?? "-"}</td>
                <td style={tdStyle}>{emp.email}</td>
                <td style={tdStyle}>
                  <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
