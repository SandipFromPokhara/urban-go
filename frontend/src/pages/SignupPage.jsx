import Signup from "../components/signup/Signup.jsx";
import { Link } from "react-router-dom";

const SignupPage = ({ isDarkMode }) => {
  return (
    <section
      className={`relative mt-20 flex min-h-[calc(100vh-80px)] items-center py-6 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-slate-50"}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <Signup isDarkMode={isDarkMode} />

        {/* Switch link */}
        <div
          className={`font-inter mt-4 flex justify-center px-5 text-center text-base md:text-sm ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
        >
          <span>
            Already have an account?{" "}
            <Link
              to="/login"
              className={`cursor-pointer font-semibold underline transition-colors duration-200 ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
            >
              Press here to login
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
