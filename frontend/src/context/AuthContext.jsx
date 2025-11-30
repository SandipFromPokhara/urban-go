import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const [signupMessage, setSignupMessage] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoginMessage(userData.firstName);

    // Hide message after 3 seconds
    setTimeout(() => {
      setLoginMessage(null);
    }, 3000);
  };

  const showSignupSuccess = () => {
    setSignupMessage(true);

    // Hide message after 3 seconds
    setTimeout(() => {
      setSignupMessage(false);
    }, 3000);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setLogoutMessage(true);

    // Hide message after 3 seconds
    setTimeout(() => {
      setLogoutMessage(false);
    }, 3000);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    logoutMessage,
    loginMessage,
    signupMessage,
    showSignupSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
