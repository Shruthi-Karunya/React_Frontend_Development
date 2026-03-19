// src/components/Employee/Profile.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (!res.ok) throw new Error("Unable to update profile");

      alert("Profile updated!");
      navigate("/employee/home");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2>Update Profile</h2>

      <label>First Name</label>
      <input name="fname" value={profile.fname} onChange={handleChange} />

      <label>Last Name</label>
      <input name="lname" value={profile.lname} onChange={handleChange} />

      <label>Age</label>
      <input name="age" type="number" value={profile.age} onChange={handleChange} />

      <label>Email</label>
      <input name="email" type="email" value={profile.email} onChange={handleChange} />

      <button onClick={saveProfile}>Save</button>
    </div>
  );
}
