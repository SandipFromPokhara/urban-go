import { useState, useEffect } from "react";
import useSignup from "../../hooks/useSignup";
import useField from "../../hooks/useField";
import useFormValidation from "../../hooks/useFormValidation";
import "./auth.css";

const Signup = ({ isDarkMode }) => {
  const firstNameField = useField("text");
  const lastNameField = useField("text");
  const emailField = useField("email");
  const passwordField = useField("password");
  const confirmPasswordField = useField("password");
  const dateOfBirthField = useField("date");
  const streetField = useField("text");
  const cityField = useField("text");
  const postalCodeField = useField("text");
  const [showStrongPassword, setShowStrongPassword] = useState(false);

  const formData = {
    firstName: firstNameField.value,
    lastName: lastNameField.value,
    email: emailField.value,
    password: passwordField.value,
    confirmPassword: confirmPasswordField.value,
    dateOfBirth: dateOfBirthField.value,
    street: streetField.value,
    city: cityField.value,
    postalCode: postalCodeField.value,
  };

  const { error, loading, handleSignup } = useSignup(formData);

  // Use form validation hook
  const {
    validatePasswordStrength,
    validatePostalCode,
    validateStreet,
    validateCity,
    passwordsMatch,
    validationMessages,
    validationColors,
  } = useFormValidation();

  // Get validation states
  const passwordStrength = validatePasswordStrength(passwordField.value);
  const postalValidation = validatePostalCode(postalCodeField.value);
  const streetValidation = validateStreet(streetField.value);
  const cityValidation = validateCity(cityField.value);
  const doPasswordsMatch = passwordsMatch(passwordField.value, confirmPasswordField.value);

  // Show "Strong Password" message briefly when password becomes strong
  useEffect(() => {
    if (passwordStrength === "strong") {
      setShowStrongPassword(true);
      const timer = setTimeout(() => {
        setShowStrongPassword(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    } else {
      setShowStrongPassword(false);
    }
  }, [passwordStrength]);

  const inputClass = `flex items-center w-full border-2 rounded-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] focus-within:-translate-y-px ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 focus-within:bg-gray-700"
      : "bg-slate-50 border-slate-200 focus-within:bg-white"
  }`;
  const inputFieldClass = `h-12 w-full bg-transparent border-none outline-none text-base font-inter px-4 ${
    isDarkMode
      ? "text-white placeholder:text-gray-400"
      : "text-slate-800 placeholder:text-slate-400"
  }`;

  return (
    <div
      className={`animate-fadeInUp relative z-10 mx-auto flex w-[440px] max-w-full flex-col rounded-3xl p-9 transition-colors duration-300 md:w-[90%] md:max-w-[420px] md:p-7 ${
        isDarkMode
          ? "bg-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_30px_rgba(59,130,246,0.1)]"
          : "bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_10px_30px_rgba(59,130,246,0.06),0_0_0_1px_rgba(148,163,184,0.1)]"
      }`}
    >
      <div className="mb-6 flex w-full flex-col items-center">
        <h1
          className={`font-inter mt-3 text-[2.5rem] leading-none font-bold tracking-tight md:mt-1 md:text-[2rem] ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Sign Up
        </h1>
        <div className="mt-2 h-1 w-[60px] rounded bg-linear-to-r from-blue-500 to-purple-600"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={inputClass}>
          <input
            {...firstNameField}
            name="firstName"
            placeholder="First Name"
            className={inputFieldClass}
          />
        </div>

        <div className={inputClass}>
          <input
            {...lastNameField}
            name="lastName"
            placeholder="Last Name"
            className={inputFieldClass}
          />
        </div>

        <div className={inputClass}>
          <input {...emailField} name="email" placeholder="Email" className={inputFieldClass} />
        </div>

        <div className={inputClass}>
          <input
            {...passwordField}
            name="password"
            placeholder="Password"
            className={inputFieldClass}
          />
        </div>

        {/* Password Strength - Only show weak/too-weak warnings, or strong briefly */}
        {passwordField.value &&
          (passwordStrength === "too-weak" || passwordStrength === "weak") && (
            <div
              className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors[passwordStrength]}`}
            >
              {validationMessages.password[passwordStrength]}
            </div>
          )}
        {showStrongPassword && (
          <div
            className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors["strong"]}`}
          >
            {validationMessages.password["strong"]}
          </div>
        )}

        <div className={inputClass}>
          <input
            {...confirmPasswordField}
            name="confirmPassword"
            placeholder="Retype Password"
            className={inputFieldClass}
          />
        </div>

        {/* Password mismatch warning */}
        {confirmPasswordField.value && !doPasswordsMatch && (
          <div
            className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors["no-match"]}`}
          >
            {validationMessages.passwordMatch["no-match"]}
          </div>
        )}

        <div className={`${inputClass} relative`}>
          <input
            type="date"
            value={dateOfBirthField.value}
            onChange={dateOfBirthField.onChange}
            name="dateOfBirth"
            max={new Date().toISOString().split('T')[0]}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            className={`${inputFieldClass} cursor-pointer ${
              !dateOfBirthField.value ? "opacity-0" : ""
            }`}
            style={{ colorScheme: isDarkMode ? "dark" : "light" }}
          />
          {!dateOfBirthField.value && (
            <span
              className={`font-inter pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base ${
                isDarkMode ? "text-gray-400" : "text-slate-400"
              }`}
            >
              Date of Birth
            </span>
          )}
        </div>

        {/* Address fields */}
        <div className={inputClass}>
          <input
            {...streetField}
            name="street"
            placeholder="Street address"
            className={inputFieldClass}
          />
        </div>

        {/* Street validation warning */}
        {streetField.value && streetValidation === "invalid" && (
          <div
            className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors[streetValidation]}`}
          >
            {validationMessages.street[streetValidation]}
          </div>
        )}

        <div className={inputClass}>
          <input {...cityField} name="city" placeholder="City" className={inputFieldClass} />
        </div>

        {/* City validation warning */}
        {cityField.value && cityValidation === "invalid" && (
          <div
            className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors[cityValidation]}`}
          >
            {validationMessages.city[cityValidation]}
          </div>
        )}

        <div className={inputClass}>
          <input
            {...postalCodeField}
            name="postalCode"
            placeholder="Postal Code"
            className={inputFieldClass}
            maxLength={5}
          />
        </div>

        {/* Postal code validation warning */}
        {postalCodeField.value &&
          (postalValidation === "numbers-only" || postalValidation === "invalid-length") && (
            <div
              className={`font-inter -mt-1 text-center text-[0.875rem] font-semibold md:text-xs ${validationColors[postalValidation]}`}
            >
              {validationMessages.postalCode[postalValidation]}
            </div>
          )}

        {error && (
          <div className="font-inter -mt-1 text-center text-sm font-semibold text-red-600 sm:text-xs">
            {error}
          </div>
        )}

        <div className="mt-6 mb-3 flex w-full gap-4 md:mt-4 md:mb-2">
          <button
            className="font-inter flex h-[52px] w-full cursor-pointer items-center justify-center rounded-xl border-none bg-linear-to-br from-blue-500 to-purple-600 text-base font-semibold text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-linear-to-br hover:from-blue-600 hover:to-purple-700 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
