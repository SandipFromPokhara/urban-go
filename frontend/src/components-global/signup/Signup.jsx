import React, { useState } from "react";
import "./Login.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Returns strength key strings for class and display text
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return "";
    if (pass.length < 6) return "too-weak";
    if (pass.length < 8) return "weak";
    if (/[A-Z]/.test(pass) && /\d/.test(pass)) return "strong";
    return "weak";
  };

  const strength = getPasswordStrength();

  const handleSubmit = () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup:", formData);
    alert("Signup success (demo)");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

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

        {/* Password Strength Text and Class */}
        {formData.password && (
          <div
            className={`password-strength ${
              strength === "strong"
                ? "strength-strong"
                : strength === "weak" || strength === "too-weak"
                ? "strength-weak"
                : "strength-medium"
            }`}
          >
            {strength === "too-weak"
              ? "Too weak ( min 6 chars )"
              : strength === "weak"
              ? "Weak Password"
              : strength === "strong"
              ? "Strong Password"
              : ""}
          </div>
        )}

        <div className="input">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Retype Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Password mismatch warning */}
        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <div className="error-text">Passwords do not match</div>
          )}

        <div className="input">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="submit-container">
          <div className="submit" onClick={handleSubmit}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
