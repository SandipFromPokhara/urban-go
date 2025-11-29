import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import useField from "../../hooks/useField";
import "./Login.css";

const Signup = () => {
  const usernameField = useField("text");
  const emailField = useField("email");
  const passwordField = useField("password");
  const confirmPasswordField = useField("password");
  const dateOfBirthField = useField("date");
  const streetField = useField("text");
  const cityField = useField("text");
  const postalCodeField = useField("text");

  const formData = {
    username: usernameField.value,
    email: emailField.value,
    password: passwordField.value,
    confirmPassword: confirmPasswordField.value,
    dateOfBirth: dateOfBirthField.value,
    street: streetField.value,
    city: cityField.value,
    postalCode: postalCodeField.value,
  };

  const { error, loading, handleSignup } = useSignup(formData);

  // Returns strength key strings for class and display text
  const getPasswordStrength = () => {
    const pass = passwordField.value;
    if (!pass) return "";
    if (pass.length < 6) return "too-weak";
    if (pass.length < 8) return "weak";
    if (/[A-Z]/.test(pass) && /\d/.test(pass)) return "strong";
    return "weak";
  };

  const strength = getPasswordStrength();

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <input
            {...usernameField}
            name="username"
            placeholder="Username"
          />
        </div>

        <div className="input">
          <input
            {...emailField}
            name="email"
            placeholder="Email"
          />
        </div>

        <div className="input">
          <input
            {...passwordField}
            name="password"
            placeholder="Password"
          />
        </div>

        {/* Password Strength Text and Class */}
        {passwordField.value && (
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
            {...confirmPasswordField}
            name="confirmPassword"
            placeholder="Retype Password"
          />
        </div>

        {/* Password mismatch warning */}
        {confirmPasswordField.value &&
          passwordField.value !== confirmPasswordField.value && (
            <div className="error-text">Passwords do not match</div>
          )}

        <div className="input date-input">
          <input
            type="date"
            value={dateOfBirthField.value}
            onChange={dateOfBirthField.onChange}
            name="dateOfBirth"
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
          />
          {!dateOfBirthField.value && <span className="date-placeholder">Date of Birth</span>}
        </div>

        {/* Address fields */}
        <div className="input">
          <input
            {...streetField}
            name="street"
            placeholder="Street address"
          />
        </div>

        <div className="input">
          <input
            {...cityField}
            name="city"
            placeholder="City"
          />
        </div>

        <div className="input">
          <input
            {...postalCodeField}
            name="postalCode"
            placeholder="Postal Code"
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="submit-container">
          <div 
            className="submit" 
            onClick={handleSignup}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
