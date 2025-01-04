import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        credentials
      );

      // Check if there's an error in the response
      if (response.data && response.data.error) {
        alert(response.data.error);
      } else if (response.data && response.data.token) {
        // If login is successful
        const { token, username, id } = response.data;
        localStorage.setItem("accessToken", token);
        setAuthState({ username, id, status: true });
        navigate("/");
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
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
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
