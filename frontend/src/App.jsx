/* App.jsx */
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/favoritesContext";
import EventDetails from "./pages/EventDetails";
import EventsList from "./pages/EventsList";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import TransportPage from "./pages/TransportPage";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import AIPage from "./pages/AIPage";

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
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Use relative paths (no leading /) */}
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/events" element={<EventsList isDarkMode={isDarkMode} />} />
          <Route path="/ai" element={<AIPage isDarkMode={isDarkMode}/>} />
          <Route path="/events/:id" element={<EventDetails isDarkMode={isDarkMode} />} />
          <Route path="/transportation" element={<TransportPage isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} />} />
          <Route path="/signup" element={<SignupPage isDarkMode={isDarkMode} />} />
          <Route path="/user-panel" element={<UserPanel isDarkMode={isDarkMode} />} />
          <Route path="/admin" element={<AdminPanel isDarkMode={isDarkMode} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </BrowserRouter>
    </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
