// AuthPage.jsx
import React, { useState } from "react";
import Login from "../components/signup/Login.jsx";
import Signup from "../components/signup/Signup.jsx";

const AuthPage = () => {
  const [page, setPage] = useState("login");

  return (
    <section className="hero-section">
      <div className="auth-outer-wrapper">
        <div className="auth-inner-content scroll-wrapper">
          {page === "login" ? <Login /> : <Signup />}
          {/* Switch links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              fontSize: "16px",
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
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
