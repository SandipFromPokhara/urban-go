const useFormValidation = () => {
  const validatePasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "too-weak";
    if (password.length < 8) return "weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "strong";
    return "weak";
  };

  const validatePostalCode = (postalCode) => {
    if (!postalCode) return "";
    if (!/^\d+$/.test(postalCode)) return "numbers-only";
    if (postalCode.length !== 5) return "invalid-length";
    return "valid";
  };

  const validateStreet = (street) => {
    if (!street) return "";
    const addressValidator = /^[a-zA-ZäöåÄÖÅ0-9.,'/#() -]+$/;
    if (!addressValidator.test(street)) return "invalid";
    return "valid";
  };

  const validateCity = (city) => {
    if (!city) return "";
    const cityValidator = /^[a-zA-ZäöåÄÖÅ\s-]+$/;
    if (!cityValidator.test(city)) return "invalid";
    return "valid";
  };

  const validateEmail = (email) => {
    if (!email) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "invalid";
    return "valid";
  };
  const validateName = (name) => {
    if (!name) return "";
    const nameValidator = /^[a-zA-ZäöåÄÖÅ]+(?:[ '-][a-zA-ZäöåÄÖÅ]+)*$/;
    if (!nameValidator.test(name)) return "invalid";
    return "valid";
  };

  const passwordsMatch = (password, confirmPassword) => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  };

  // Validation message mappings
  const validationMessages = {
    password: {
      "too-weak": "Too weak ( min 6 chars )",
      weak: "Weak Password",
      strong: "Strong Password",
    },
    postalCode: {
      "numbers-only": "Postal code must contain only numbers",
      "invalid-length": "Postal code must be exactly 5 digits",
      valid: "✓ Valid postal code",
    },
    street: {
      invalid: "Invalid street format (only letters, numbers, and .,'/#() - allowed)",
      valid: "✓ Valid street address",
    },
    city: {
      invalid: "City must contain only letters and spaces",
      valid: "✓ Valid city name",
    },
    email: {
      invalid: "Invalid email format",
      valid: "✓ Valid email",
    },
    name: {
      invalid: "Invalid name format (only letters, spaces, hyphens, and apostrophes allowed)",
      valid: "✓ Valid name",
    },
    passwordMatch: {
      "no-match": "Passwords do not match",
    },
  };

  // Color classes for different validation states
  const validationColors = {
    "too-weak": "text-red-600",
    weak: "text-red-600",
    medium: "text-amber-500",
    strong: "text-emerald-500",
    invalid: "text-red-600",
    "invalid-length": "text-red-600",
    "numbers-only": "text-red-600",
    valid: "text-emerald-500",
    "no-match": "text-red-600",
  };

  return {
    validatePasswordStrength,
    validatePostalCode,
    validateStreet,
    validateCity,
    validateEmail,
    validateName,
    passwordsMatch,
    validationMessages,
    validationColors,
  };
};

export default useFormValidation;
