// src/components/Auth/Login.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();   // ✅ define navigate here


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
//     const data = await res.json();
//     if (data.length > 0) login(data[0]);
//     else alert("Invalid credentials");
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch(`http://localhost:5000/users?email=${email}`);
  const data = await res.json();

  if (data.length > 0 && data[0].password === password) {
    login(data[0]);   // from AuthContext
    if (data[0].role === "hr") {
      navigate("/hr/dashboard");
    } else if (data[0].firstLogin) {
      navigate("/employee/change-password");
    } else {
      navigate("/employee/home?tab=request");
    }
  } else {
    alert("Invalid credentials");
  }
};

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Leave Portal Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
