import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import TransportPage from "./components/transport/TransportPage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // mode based on system preference
  useEffect(() => {
    const darkModePref = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
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
      <div className="grow">
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/events" element={<EventsList isDarkMode={isDarkMode} />} />
          <Route path="/transportation" element={<TransportPage isDarkMode={isDarkMode} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
