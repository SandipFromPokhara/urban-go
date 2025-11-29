import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSignup = (formData) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    if (!formData.dateOfBirth || !formData.street || !formData.city || !formData.postalCode) {
      setError("Please provide your date of birth and full address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Assemble payload matching backend User model
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setLoading(false);
      alert(`Registration successful! Welcome ${data.username}`);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { error, loading, handleSignup };
};

export default useSignup;
