import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useScroll } from "framer-motion";
import Navbar from "./Navbar";
import { CircleUserRound, Menu, X } from "lucide-react";
import logo2 from "../assets/images/Logo2.png";
import { Link } from "react-router-dom";

function Header() {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((currentScrollY) => {
      const diff = currentScrollY - lastScrollY.current;

      // Only react if scrolled more than 20px
      if (diff > 20 && currentScrollY > 100) {
        controls.start({ y: "-100%", transition: { duration: 0.3, ease: "easeInOut" } });
      } else if (diff < -20 || currentScrollY <= 100) {
        controls.start({ y: "0%", transition: { duration: 0.3, ease: "easeInOut" } });
      }

      lastScrollY.current = currentScrollY;
    });
  }, [controls, scrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-[#2c1f5e] via-[#3b2a7a] to-[#1b1f55] backdrop-blur-sm"
      animate={controls}
    >
      <div className="flex items-center justify-between h-20 px-6 py-4 text-white rounded-b-2xl">
        <img src={logo2} alt="Logo" className="h-auto w-50 select-none ml-6" />

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Navbar />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="login">
            <motion.button
              whileHover={{ scale: 1.05, opacity: 0.9 }}
              whileTap={{ scale: 0.95 }}
              className="text-white border border-white w-24 px-2 py-2 rounded-md transition duration-100"
            >
              <CircleUserRound className="w-5 h-5 inline-block mr-2" />
              Log in
            </motion.button>
          </Link>
        </div>

        <button
          className="md:hidden text-white focus:outline-none"
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
        className="md:hidden absolute top-20 left-0 w-full bg-linear-to-t from-gradient-start via-gradient-via to-gradient-end backdrop-blur-sm text-white flex flex-col items-center gap-6 py-8 shadow-lg rounded-b-2xl z-40"
      >
        <Navbar />
        <Link to="login" onClick={() => setMenuOpen(false)}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white border border-white w-32 px-3 py-2 rounded-md"
          >
            <CircleUserRound className="w-5 h-5 inline-block mr-2" />
            Log in
          </motion.button>
        </Link>
      </motion.div>
    </motion.header>
  );
}

export default Header;
