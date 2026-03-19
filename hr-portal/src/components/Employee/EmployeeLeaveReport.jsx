import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function EmployeeLeaveReport() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/leaves");
      const data = await res.json();
      setLeaves(data.filter((l) => String(l.employeeId) === String(user.id)));
    } catch (error) {
      console.error(error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchLeaves();

    const handleFocus = () => {
      fetchLeaves();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchLeaves]);

  const restoreLeaveBalance = async (leave) => {
    const employeeRes = await fetch(`http://localhost:5000/employees/${user.id}`);
    if (!employeeRes.ok) return;

    const employee = await employeeRes.json();
    const currentSL = Number(employee.availableSL ?? 12);
    const currentCL = Number(employee.availableCL ?? 12);
    const currentBL = Number(employee.availableBL ?? 5);

    let body = null;

    if (leave.leaveType === "SL") {
      body = { availableSL: currentSL + 1 };
    } else if (leave.leaveType === "CL") {
      body = { availableCL: currentCL + 1 };
    } else if (leave.leaveType === "BL") {
      body = { availableBL: currentBL + 1 };
    }

    if (body) {
      await fetch(`http://localhost:5000/employees/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }
  };

  const cancelLeave = async (leave) => {
    if (leave.status === "rejected") return;

    if (!window.confirm(`Cancel this leave (${leave.status})?`)) return;

    const cancelReason = prompt("Please enter cancellation reason:");
    if (cancelReason === null) return; // user cancelled prompt
    if (!cancelReason.trim()) {
      alert("Cancellation reason cannot be blank.");
      return;
    }

    if (leave.status === "approved") {
      await restoreLeaveBalance(leave);
    }

    await fetch(`http://localhost:5000/leaves/${leave.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled", reason: cancelReason.trim() })
    });

    fetchLeaves();
  };

  return (
    <div className="card" style={{ width: "100%", margin: "0 auto" }}>
      <h2>My Leave Report</h2>
      {leaves.length === 0 ? (
        <p>No leaves found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Leave ID</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Type</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Date Applied</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Reason</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Status</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{leave.id}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{leave.leaveType || "-"}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{leave.dateApplied || "-"}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{leave.reason}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{leave.status}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                  {leave.status !== "rejected" && leave.status !== "cancelled" ? (
                    <button
                      onClick={() => cancelLeave(leave)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "none", backgroundColor: "#f0ad4e", color: "#fff", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
