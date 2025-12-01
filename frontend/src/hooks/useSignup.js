import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useSignup = (formData) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSignupSuccess } = useAuth();

  const handleSignup = async () => {
    // Validation - Check each field individually for specific error messages
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Please provide your date of birth");
      return;
    }

    if (!formData.street || !formData.city || !formData.postalCode) {
      setError("Please provide your full address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Assemble payload matching backend User model
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
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

      // Show success message via context
      setLoading(false);
      setError(null);
      showSignupSuccess();
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { error, loading, handleSignup };
};

export default useSignup;
