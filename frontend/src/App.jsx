/* App.jsx */
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import TransportPage from "./pages/TransportPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { FavoritesProvider } from "./context/favoritesContext";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system dark mode
  useEffect(() => {
    const darkModePref = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(darkModePref);
  }, []);

  // Toggle dark mode class
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <AuthProvider>
    <FavoritesProvider>
      <HashRouter>
        <Header />
        <Routes>
          {/* Use relative paths (no leading /) */}
          <Route path="" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="events" element={<EventsList isDarkMode={isDarkMode} />} />
          <Route path="events/:id" element={<EventDetails isDarkMode={isDarkMode} />} />
          <Route path="transportation" element={<TransportPage isDarkMode={isDarkMode} />} />
          <Route path="login" element={<LoginPage isDarkMode={isDarkMode} />} />
          <Route path="signup" element={<SignupPage isDarkMode={isDarkMode} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </HashRouter>
    </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
