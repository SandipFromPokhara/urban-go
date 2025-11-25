import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import TransportPage from "./pages/TransportPage";
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system dark mode
  useEffect(() => {
    const darkModePref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(darkModePref);
  }, []);

  // Toggle dark mode class
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <HashRouter>
      <Header />
      <Routes>
        {/* Use relative paths (no leading /) */}
        <Route path="" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="events" element={<EventsList isDarkMode={isDarkMode} />} />
        <Route path="events/:id" element={<EventDetails isDarkMode={isDarkMode} />} />
        <Route path="transportation" element={<TransportPage isDarkMode={isDarkMode} />} />
        <Route path="login" element={<AuthPage />} />
        {/* Catch-all route redirects to home */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
      <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </HashRouter>
  );
}

export default App;
