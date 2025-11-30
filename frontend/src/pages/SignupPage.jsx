import Signup from "../components/signup/Signup.jsx";

const SignupPage = ({ isDarkMode }) => {
  return (
    <section className={`py-6 mt-20 relative min-h-[calc(100vh-80px)] flex items-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <div className="relative z-10 px-4 w-full max-w-7xl mx-auto">
        <Signup isDarkMode={isDarkMode} />
        
        {/* Switch link */}
        <div className={`flex justify-center mt-4 text-base px-5 text-center font-inter md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
          <span>
            Already have an account?{" "}
            <a
              href="#/login"
              className={`cursor-pointer underline font-semibold transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Press here to login
            </a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
