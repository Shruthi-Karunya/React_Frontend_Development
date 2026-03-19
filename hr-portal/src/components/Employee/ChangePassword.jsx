import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ChangePassword() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword !== user.password) {
      alert("Current password is incorrect.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      alert("Please enter new password and confirm it.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword, firstLogin: false })
      });

      if (!res.ok) throw new Error("Failed to update password.");

      const updatedUser = { ...user, password: newPassword, firstLogin: false };
      login(updatedUser);
      alert("Password updated successfully!");
      navigate("/employee/home");
    } catch (err) {
      console.error(err);
      alert("Unable to update password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Change Password</h2>
      <p>First-time password change is required.</p>
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Save new password</button>
    </form>
  );
}
