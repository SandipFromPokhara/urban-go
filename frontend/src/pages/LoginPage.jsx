import Login from "../components/signup/Login.jsx";

const LoginPage = ({ isDarkMode }) => {
  return (
    <>
      <div className={`min-h-[calc(100vh-80px)] mt-15 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
        <div className="w-full max-w-md space-y-6">
          <Login isDarkMode={isDarkMode} />
          
          {/* Switch link */}
          <div className="text-center">
            <span className={`text-sm font-inter ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Don't have an account?{" "}
              <a
                href="#/signup"
                className={`font-semibold hover:underline transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Press here to register
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
