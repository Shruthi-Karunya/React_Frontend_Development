// src/components/HR/LeaveRequests.jsx
import { useEffect, useState } from "react";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaves")
      .then(res => res.json())
      .then(setLeaves);
  }, []);

  const updateStatus = async (leave, status, reason) => {
    try {
      if (status === "approved") {
        const empRes = await fetch(`http://localhost:5000/employees/${leave.employeeId}`);
        if (!empRes.ok) throw new Error("Failed to fetch employee data");

        const employee = await empRes.json();
        const availableSL = Number(employee.availableSL ?? 12);
        const availableCL = Number(employee.availableCL ?? 12);
        const availableBL = Number(employee.availableBL ?? 5);

        let updatedEmp = null;
        if (leave.leaveType === "SL") {
          if (availableSL <= 0) {
            alert("Insufficient SL balance.");
            return;
          }
          updatedEmp = { availableSL: availableSL - 1 };
        } else if (leave.leaveType === "CL") {
          if (availableCL <= 0) {
            alert("Insufficient CL balance.");
            return;
          }
          updatedEmp = { availableCL: availableCL - 1 };
        } else if (leave.leaveType === "BL") {
          if (availableBL <= 0) {
            alert("Insufficient BL balance.");
            return;
          }
          updatedEmp = { availableBL: availableBL - 1 };
        } else {
          alert("Leave type is not set; cannot approve.");
          return;
        }

        const empUpdateRes = await fetch(`http://localhost:5000/employees/${leave.employeeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEmp)
        });

        if (!empUpdateRes.ok) throw new Error("Failed to update employee leave balance");
      }

      const res = await fetch(`http://localhost:5000/leaves/${leave.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason })
      });

      if (!res.ok) throw new Error("Failed to update leave status");

      // Remove from pending list
      setLeaves((prev) => prev.filter((l) => l.id !== leave.id));
    } catch (error) {
      console.error(error);
      alert("Unable to update leave status. Please try again.");
    }
  };

  const pendingLeaves = leaves.filter((leave) => leave.status === "pending");

  return (
    <div className="card">
      <h2>Leave Requests</h2>
      {pendingLeaves.length === 0 ? (
        <p>No pending leave requests.</p>
      ) : (
        <div style={{ width: "100%", minWidth: "800px", backgroundColor: "#fff", padding: "8px", borderRadius: "6px" }}>
          <table className="leave-requests-table" style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse", tableLayout: "fixed", wordWrap: "break-word", backgroundColor: "#fff" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "normal", width: "110px", backgroundColor: "#fff" }}>Employee ID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Leave Type</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Days</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Reason</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date Applied</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{l.employeeId}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{l.leaveType || "N/A"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{l.days ?? "Not specified"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{l.reason || "N/A"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{l.dateApplied || "N/A"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <button
                      style={{ marginRight: "6px" }}
                      onClick={() => updateStatus(l, "approved", "Approved by HR")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const rejectReason = prompt("Please enter rejection reason:");
                        if (rejectReason === null) return;
                        if (!rejectReason.trim()) {
                          alert("Rejection reason cannot be blank.");
                          return;
                        }
                        updateStatus(l, "rejected", rejectReason.trim());
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
