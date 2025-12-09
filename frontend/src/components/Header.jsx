import { motion, useAnimation, useScroll } from "framer-motion";
import { CircleUserRound, LogOut, Menu, X, ChevronDown, User, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../assets/images/Logo2.png";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import Navbar from "./Navbar";

function Header() {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return scrollY.onChange((currentScrollY) => {
      const diff = currentScrollY - lastScrollY.current;

      // Only react if scrolled more than 20px
      if (diff > 20 && currentScrollY > 100) {
        controls.start({
          y: "-100%",
          transition: { duration: 0.3, ease: "easeInOut" },
        });
      } else if (diff < -20 || currentScrollY <= 100) {
        controls.start({
          y: "0%",
          transition: { duration: 0.3, ease: "easeInOut" },
        });
      }

      lastScrollY.current = currentScrollY;
    });
  }, [controls, scrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 z-50 w-full bg-linear-to-b from-[#2c1f5e] via-[#3b2a7a] to-[#1b1f55] backdrop-blur-sm"
      animate={controls}
    >
      <div className="flex h-20 items-center justify-between rounded-b-2xl px-6 py-4 text-white">
        <img src={logo2} alt="Logo" className="ml-6 h-auto w-50 select-none" />

        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
          <Navbar />
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
              <span className="font-semibold text-white">Welcome, {user?.firstName}</span>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
              >
                <CircleUserRound className="h-6 w-6 text-white" />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-48 rounded-lg bg-white shadow-xl overflow-hidden z-50 border border-gray-200"
                >
                  <Link
                    to="user-panel"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Link
                      to="admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 transition-colors"
                    >
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="login">
              <motion.button
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 rounded-md border border-white px-2 py-2 text-white transition duration-100"
              >
                <CircleUserRound className="mr-2 inline-block h-5 w-5" />
                Log in
              </motion.button>
            </Link>
          )}
        </div>

        <button
          className="text-white focus:outline-none md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, y: 0, pointerEvents: "auto" },
          closed: { opacity: 0, y: "-100%", pointerEvents: "none" },
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="from-[#2c1f5e] via-[#3b2a7a] to-[#1b1f55] absolute top-20 left-0 z-40 flex w-full flex-col items-center gap-6 rounded-b-2xl bg-linear-to-t py-8 text-white shadow-lg backdrop-blur-sm md:hidden"
      >
        <Navbar />
        {isAuthenticated ? (
          <>
            <Link
              to="user-panel"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-white hover:text-indigo-200 transition-colors"
            >
              Welcome, {user?.firstName}
            </Link>

            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Link
                to="admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                Admin Panel
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 rounded-md border border-white px-6 py-2 text-white"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </motion.button>
          </>
        ) : (
          <Link to="login" onClick={() => setMenuOpen(false)}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 rounded-md border border-white px-3 py-2 text-white"
            >
              <CircleUserRound className="mr-2 inline-block h-5 w-5" />
              Log in
            </motion.button>
          </Link>
        )}
      </motion.div>
    </motion.header>
  );
}

export default Header;
