import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // mode based on system preference
  useEffect(() => {
    const darkModePref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(darkModePref);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <Router>
        <Header />
        <Routes className="grow">
          {/* add routes to your pages here */}
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </Router>
  );
}

export default App;
