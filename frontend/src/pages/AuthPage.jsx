// AuthPage.jsx
import React, { useState } from "react";
import Login from "../components/signup/Login.jsx";
import Signup from "../components/signup/Signup.jsx";

const AuthPage = () => {
  const [page, setPage] = useState("login");

  return (
    <div className="min-h-screen bg-gray-50" style={{ marginTop: '0', paddingTop: '0' }}>
     <section className="hero-section" style={{ padding: '20px 10px' }}>
          {page === "login" ? <Login /> : <Signup />}
          {/* Switch links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              fontSize: "16px",
              fontSize: "14px", // Reduced for mobile
              padding: "0 20px", // Add horizontal padding
              textAlign: "center",// Center text on mobile
            }}
          >
            {page === "login" ? (
              <span>
                Don't have an account?{" "}
                <span
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => setPage("signup")}
                >
                  Press here to register
                </span>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <span
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => setPage("login")}
                >
                  Press here to login
                </span>
              </span>
            )}
          </div>
    </section>
    </div>
  );
};

export default AuthPage;
