import { useState } from "react";
import "./SignUpPage.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nationality, setNationality] = useState("");

  // Email validation
  const trimmedEmail = email.trim(); // Remove leading and traling spaces from the input
  const isEmailValid = trimmedEmail.includes("@") && trimmedEmail.includes(".");

  // Password strength check
  const getPasswordStrength = () => {
    if (password.length < 6) return "Too weak";
    if (password.length < 8) return "Weak";
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password))
      // Strong password: at least 8 chars, contains uppercase letter and a number
      return "Strong";
    return "Weak";
  };

  const strength = getPasswordStrength();

  const greetings = {
    nep: "Namaste",
    fi: "Moi",
    en: "Hello",
    de: "Hallo",
    fr: "Bonjour",
    jpn: "Konnichiwa",
  };

  // Input change handler
  const handleInputChange = (event) => {
    const map = {
      email: setEmail,
      password: setPassword,
      nationality: setNationality,
    };

    const { name, value } = event.target;

    const setter = map[name];
    setter(name === "email" ? value.trim() : value); // Automatically trim spaces if email input from user
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <h4>Create a free account now</h4>

      {/* Email */}
      <label>Email</label>
      <div className="input-container">
        <input
          type="text"
          name="email"
          placeholder="john.doe@fake.com"
          value={email}
          onChange={handleInputChange}
          style={{
            borderColor: email ? (isEmailValid ? "green" : "red") : "#ccc",
          }}
        ></input>
        {/* Icon indicates validity */}
        {email && <span className="icon">{isEmailValid ? "✅" : "❌"}</span>}
      </div>
      {/* Validation message */}
      {email && (
        <p className={`message show ${isEmailValid ? "valid" : "invalid"}`}>
          {isEmailValid ? "Email is valid" : "Email is invalid"}
        </p>
      )}

      {/* Password */}
      <label>Password</label>
      <div className="input-container">
        <input
          type="password"
          placeholder="**********"
          name="password"
          value={password}
          onChange={handleInputChange}
          style={{
            borderColor:
              strength === "Strong"
                ? "green"
                : strength === "Weak"
                ? "orange"
                : "red",
          }}
        ></input>
        {/* Icon indicating strength */}
        {password && (
          <span className="icon">
            {strength === "Strong" ? "✅" : strength === "Weak" ? "⚠️" : "❌"}
          </span>
        )}
      </div>
      {/* Password strength message */}
      {password && (
        <p
          className={`message show ${
            strength === "Strong"
              ? "valid"
              : strength === "Weak"
              ? "weak"
              : "too-weak"
          }`}
        >
          {strength} password
        </p>
      )}

      {/* Nationality */}
      <label>Nationality</label>
      <div className="input-container">
        <select
          name="nationality"
          value={nationality}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select your nationality
          </option>
          <option value="nep">nep</option>
          <option value="fi">fi</option>
          <option value="en">en</option>
          <option value="de">de</option>
          <option value="fr">fr</option>
          <option value="jpn">jpn</option>
        </select>
      </div>

      {/* Button */}
      <button>Sign up</button>

      <hr />

      {/* Greetings & email display */}
      <p>{greetings[nationality]}</p>
      <p>Your email address is: {email}</p>
      <p>Your email address is {isEmailValid ? "correct" : "incorrect"}</p>
    </section>
  );
}

export default SignUpPage;
