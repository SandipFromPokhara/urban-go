import useLogin from "../../hooks/useLogin";
import useField from "../../hooks/useField";
import "./auth.css";

const Login = ({ isDarkMode }) => {
  const emailField = useField("email");
  const passwordField = useField("password");

  const { error, loading, handleLogin } = useLogin(emailField.value, passwordField.value);

  return (
    <div
      className={`animate-fadeInUp relative z-10 mx-auto flex w-[440px] max-w-full flex-col rounded-3xl p-9 transition-colors duration-300 md:w-[90%] md:max-w-[420px] md:p-7 ${isDarkMode ? "bg-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_30px_rgba(59,130,246,0.1)]" : "bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),0_10px_30px_rgba(59,130,246,0.06),0_0_0_1px_rgba(148,163,184,0.1)]"}`}
    >
      <div className="mb-7 flex w-full flex-col items-center">
        <h1
          className={`font-inter mt-3 text-[2.5rem] leading-none font-bold tracking-tight md:mt-1 md:text-[2rem] ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Login
        </h1>
        <div className="mt-2 h-1 w-[60px] rounded bg-gradient-to-r from-blue-500 to-purple-600"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div
          className={`flex w-full items-center rounded-[14px] border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:-translate-y-px focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] ${isDarkMode ? "border-gray-600 bg-gray-700 focus-within:bg-gray-700" : "border-slate-200 bg-slate-50 focus-within:bg-white"}`}
        >
          <input
            {...emailField}
            name="email"
            placeholder="Email"
            className={`font-inter h-12 w-full border-none bg-transparent px-4 text-base outline-none ${isDarkMode ? "text-white placeholder:text-gray-400" : "text-slate-800 placeholder:text-slate-400"}`}
          />
        </div>

        <div
          className={`flex w-full items-center rounded-[14px] border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:-translate-y-px focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_4px_12px_rgba(59,130,246,0.08)] ${isDarkMode ? "border-gray-600 bg-gray-700 focus-within:bg-gray-700" : "border-slate-200 bg-slate-50 focus-within:bg-white"}`}
        >
          <input
            {...passwordField}
            name="password"
            placeholder="Password"
            className={`font-inter h-12 w-full border-none bg-transparent px-4 text-base outline-none ${isDarkMode ? "text-white placeholder:text-gray-400" : "text-slate-800 placeholder:text-slate-400"}`}
          />
        </div>

        <div
          className={`font-inter mt-2 text-center text-[0.9rem] md:text-[0.875rem] ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}
        >
          Forgot Password?{" "}
          <span
            className={`cursor-pointer font-semibold transition-colors duration-200 hover:underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"}`}
          >
            Click Here!
          </span>
        </div>

        {error && (
          <div className="font-inter -mt-1 text-center text-[0.875rem] font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-7 mb-3 flex w-full gap-4 md:mt-5 md:mb-2">
          <button
            className="font-inter flex h-[52px] w-full cursor-pointer items-center justify-center rounded-xl border-none bg-gradient-to-br from-blue-500 to-purple-600 text-base font-semibold text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-60 md:h-12"
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
