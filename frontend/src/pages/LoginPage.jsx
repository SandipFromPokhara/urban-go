import Login from "../components/signup/Login.jsx";
import { Link } from "react-router-dom";

const LoginPage = ({ isDarkMode }) => {
  return (
    <>
      <div
        className={`mt-15 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 transition-colors duration-300 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900" : "bg-slate-50"}`}
      >
        <div className="w-full max-w-md space-y-6">
          <Login isDarkMode={isDarkMode} />

          {/* Switch link */}
          <div className="text-center">
            <span
              className={`font-inter text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className={`font-semibold transition-colors duration-200 hover:underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
              >
                Press here to register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
