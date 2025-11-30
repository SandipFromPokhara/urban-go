import useSignup from "../../hooks/useSignup";
import useField from "../../hooks/useField";
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

  const strengthColors = {
    "too-weak": "text-red-600",
    "weak": "text-red-600",
    "medium": "text-amber-500",
    "strong": "text-emerald-500"
  };

  const strengthText = {
    "too-weak": "Too weak ( min 6 chars )",
    "weak": "Weak Password",
    "strong": "Strong Password"
  };

  const inputClass = `flex items-center w-full border-2 rounded-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] focus-within:-translate-y-px ${isDarkMode ? 'bg-gray-700 border-gray-600 focus-within:bg-gray-700' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`;
  const inputFieldClass = `h-12 w-full bg-transparent border-none outline-none text-base font-inter px-4 ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-slate-800 placeholder:text-slate-400'}`;

  return (
    <div className={`flex flex-col mx-auto w-[440px] max-w-full rounded-3xl p-9 animate-fadeInUp relative z-10 md:w-[90%] md:max-w-[420px] md:p-7 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_30px_rgba(59,130,246,0.1)]' : 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_10px_30px_rgba(59,130,246,0.06),0_0_0_1px_rgba(148,163,184,0.1)]'}`}>
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className={`font-inter mt-3 text-[2.5rem] font-bold tracking-tight leading-none md:text-[2rem] md:mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sign Up</h1>
        <div className="w-[60px] h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded mt-2"></div>
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
          <input
            {...emailField}
            name="email"
            placeholder="Email"
            className={inputFieldClass}
          />
        </div>

        <div className={inputClass}>
          <input
            {...passwordField}
            name="password"
            placeholder="Password"
            className={inputFieldClass}
          />
        </div>

        {/* Password Strength */}
        {passwordField.value && (
          <div className={`text-center font-semibold text-[0.875rem] font-inter -mt-1 md:text-xs ${strengthColors[strength]}`}>
            {strengthText[strength]}
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
        {confirmPasswordField.value &&
          passwordField.value !== confirmPasswordField.value && (
            <div className="text-center text-red-600 text-[0.875rem] font-inter font-semibold -mt-1 md:text-xs">Passwords do not match</div>
          )}

        <div className={`${inputClass} relative`}>
          <input
            type="date"
            value={dateOfBirthField.value}
            onChange={dateOfBirthField.onChange}
            name="dateOfBirth"
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            className={`${inputFieldClass} cursor-pointer ${!dateOfBirthField.value ? 'text-transparent' : ''}`}
            style={{ colorScheme: 'light' }}
          />
          {!dateOfBirthField.value && (
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none font-inter text-base ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}>
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

        <div className={inputClass}>
          <input
            {...cityField}
            name="city"
            placeholder="City"
            className={inputFieldClass}
          />
        </div>

        <div className={inputClass}>
          <input
            {...postalCodeField}
            name="postalCode"
            placeholder="Postal Code"
            className={inputFieldClass}
          />
        </div>

        {error && <div className="text-center text-red-600 text-sm font-inter font-semibold -mt-1 sm:text-xs">{error}</div>}

        <div className="flex gap-4 mt-6 mb-3 w-full md:mt-4 md:mb-2">
          <button 
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] w-full h-[52px] flex justify-center items-center rounded-xl text-base font-semibold font-inter cursor-pointer transition-all duration-300 border-none hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-700 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed sm:h-12"
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
