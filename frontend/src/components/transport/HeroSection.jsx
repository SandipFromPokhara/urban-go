// src/components/transport/HeroSection.jsx
import { motion } from "framer-motion";
import "../../styles/transportation.css"; // grid & vehicles CSS

function HeroSection({ formRef, formInputRef }) {
  const handleScrollToForm = () => {
    if (formInputRef.current) {
      const yOffset = -80; // sticky header offset
      const y = formInputRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      formInputRef.current.focus();
    }
  };

  return (
    <section className="hero relative w-full py-16 sm:py-30 text-white overflow-hidden">
      {/* Background layers */}
      <div className="grid-background absolute inset-0"></div>
      <div className="radial-overlay absolute inset-0 pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="vehicle vehicle-1"></div>
        <div className="vehicle vehicle-2"></div>
        <div className="vehicle vehicle-3"></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
        >
          Find Your Event. Plan Your Ride.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm sm:text-lg md:text-xl font-light text-blue-100 mb-8"
        >
          Discover the most efficient public transport routes across the
          capital region — powered by real-time HSL data.
        </motion.p>
        <button
          onClick={handleScrollToForm}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:bg-gray-100 transition transform hover:scale-105 cursor-pointer"
        >
          Plan Your Route
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
