import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        credentials
      );
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="loginContainer">
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        placeholder="Enter your username"
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
