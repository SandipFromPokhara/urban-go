import useLogin from "../../hooks/useLogin";
import useField from "../../hooks/useField";
import "./auth.css";

const Login = ({ isDarkMode }) => {
  const emailField = useField("email");
  const passwordField = useField("password");

  const { error, loading, handleLogin } = useLogin(
    emailField.value,
    passwordField.value
  );

  return (
    <div className={`flex flex-col mx-auto w-[440px] max-w-full rounded-3xl p-9 animate-fadeInUp relative z-10 md:w-[90%] md:max-w-[420px] md:p-7 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_30px_rgba(59,130,246,0.1)]' : 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_10px_30px_rgba(59,130,246,0.06),0_0_0_1px_rgba(148,163,184,0.1)]'}`}>
      <div className="flex flex-col items-center w-full mb-7">
        <h1 className={`font-inter mt-3 text-[2.5rem] font-bold tracking-tight leading-none md:text-[2rem] md:mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Login
        </h1>
        <div className="w-[60px] h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded mt-2"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={`flex items-center w-full border-2 rounded-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] focus-within:-translate-y-px ${isDarkMode ? 'bg-gray-700 border-gray-600 focus-within:bg-gray-700' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`}>
          <input
            {...emailField}
            name="email"
            placeholder="Email"
            className={`h-12 w-full bg-transparent border-none outline-none text-base font-inter px-4 ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-slate-800 placeholder:text-slate-400'}`}
          />
        </div>

        <div className={`flex items-center w-full border-2 rounded-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] focus-within:-translate-y-px ${isDarkMode ? 'bg-gray-700 border-gray-600 focus-within:bg-gray-700' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`}>
          <input
            {...passwordField}
            name="password"
            placeholder="Password"
            className={`h-12 w-full bg-transparent border-none outline-none text-base font-inter px-4 ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-slate-800 placeholder:text-slate-400'}`}
          />
        </div>

        <div className={`text-center mt-2 text-[0.9rem] font-inter md:text-[0.875rem] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Forgot Password?{" "}
          <span className={`cursor-pointer font-semibold transition-colors duration-200 hover:underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}>
            Click Here!
          </span>
        </div>

        {error && (
          <div className="text-center text-red-600 text-[0.875rem] font-inter font-semibold -mt-1">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-7 mb-3 w-full md:mt-5 md:mb-2">
          <button
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] w-full h-[52px] flex justify-center items-center rounded-xl text-base font-semibold font-inter cursor-pointer transition-all duration-300 border-none hover:from-blue-600 hover:to-purple-700 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed md:h-12"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
