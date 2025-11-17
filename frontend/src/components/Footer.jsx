import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import footer from "../assets/images/footer.jpg";

function Footer({ isDarkMode, setIsDarkMode }) {
  const [activeSection, setActiveSection] = useState(null);
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const footerInfo = {
    about:
      "City Event & Transport connects you with Helsinki’s most exciting events, from culture and festivals to smart travel updates — making it easier to explore the city.",
    contact:
      "Reach us at contact@metropolia.fi or visit our office at Myllypurontie 1, Helsinki. We're happy to hear from you!",
    privacy:
      "We respect your privacy. Data collected on this site is used only to enhance your browsing experience and never shared with third parties.",
    terms:
      "By using this platform, you agree to our terms of service, which ensure a safe, fair, and transparent experience for all users.",
    theme:
      "Switch between Light and Dark modes to suit your preference.",
  };

  return (
    <footer
      className="text-white mb-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${footer})` }}
    >
      <div className="flex flex-col items-center px-6 py-6 space-y-6 sm:space-y-8">
        <ul className="flex flex-wrap justify-center items-center gap-6 text-sm sm:text-base">
          {Object.keys(footerInfo).map((key) => (
            <li key={key}>
              <button
                onClick={() => toggleSection(key)}
                className="hover:underline capitalize focus:outline-none"
              >
                {key}
              </button>
            </li>
          ))}
        </ul>

        {/* Expandable Section */}
        <AnimatePresence mode="wait">
          {activeSection && (
            <motion.div
              key={activeSection}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="max-w-2xl text-center text-sm sm:text-base bg-black/50 rounded-2xl px-4 py-3"
            >
              {activeSection === "theme" ? (
                <div className="flex flex-col items-center space-y-3">
                  <p>{footerInfo.theme}</p>

                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="px-4 py-2 bg-linear-to-r from-gradient-start via-gradient-via to-gradient-end rounded-xl transition"
                  >
                    Switch to {isDarkMode ? "Light" : "Dark"} Mode
                  </button>
                </div>
              ) : (
                footerInfo[activeSection]
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-sm sm:text-base opacity-90">
          © 2025 City Event & Transport
        </div>
      </div>
    </footer>
  );
}

export default Footer;
