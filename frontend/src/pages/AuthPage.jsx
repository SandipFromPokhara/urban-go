import { useState } from "react";
import Login from "../components/signup/Login.jsx";
import Signup from "../components/signup/Signup.jsx";

const AuthPage = () => {
  const [page, setPage] = useState("login");

  return (
    <section className="bg-slate-50 text-slate-800 pt-24 pb-8 relative md:pt-20 md:pb-6 min-h-screen">

      <div className="relative z-10 px-5 py-5">
        {page === "login" ? <Login /> : <Signup />}
        
        {/* Switch links */}
        <div className="flex justify-center mt-5 text-base px-5 text-center font-inter text-slate-700 md:text-sm">
          {page === "login" ? (
            <span>
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer underline font-semibold hover:text-blue-700 transition-colors duration-200"
                onClick={() => setPage("signup")}
              >
                Press here to register
              </span>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer underline font-semibold hover:text-blue-700 transition-colors duration-200"
                onClick={() => setPage("login")}
              >
                Press here to login
              </span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
