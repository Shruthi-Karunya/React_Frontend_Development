// src/components/Auth/Signup.jsx
import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ fname:"", lname:"", age:"", email:"", password:"", role:"employee" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    alert("Signup successful!");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Sign Up</h2>
      <input name="fname" placeholder="First Name" onChange={handleChange} />
      <input name="lname" placeholder="Last Name" onChange={handleChange} />
      <input name="age" type="number" placeholder="Age" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
}
