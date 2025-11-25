import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      alert("Email and Password are required");
      return;
    }

    console.log("Login:", formData);
    alert("Login success (demo)");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <input 
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <input 
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>

        <div className="submit-container">
          <div className="submit" onClick={handleSubmit}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
