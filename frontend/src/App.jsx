import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
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
         <Route path="/" element={<Home />} />
         <Route path="/events" element={<EventsList isDarkMode={isDarkMode} />} />
         <Route path="/transportation" element={<TransportPage isDarkMode={isDarkMode} />} />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
