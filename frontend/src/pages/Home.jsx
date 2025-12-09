import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/homeComponents/Hero";
import CategoryGrid from "../components/homeComponents/CategoryGrid";
import WhySection from "../components/homeComponents/WhySection";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function Home({ isDarkMode }) {
  const { logoutMessage, loginMessage } = useAuth();

  return (
    <div
      className="josefin-sans-regular relative min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundColor: isDarkMode ? "var(--color-background-color)" : "white" }}
    >
      {/* Success Messages */}
      <AnimatePresence>
        {logoutMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg"
          >
            You have been logged out successfully!
          </motion.div>
        )}
        {loginMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg"
          >
            Welcome back, {loginMessage}!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Hero />
        <CategoryGrid isDarkMode={isDarkMode} />
        <div className="mb-10 p-10">
        <WhySection isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
