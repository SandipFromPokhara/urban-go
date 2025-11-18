import { motion } from "framer-motion";
import "../../styles/transportation.css"; // import separate CSS for grid & vehicles

function HeroSection({ formRef, formInputRef }) {

  const handleScrollToForm = () => {
    if (formRef.current) {
      const headerOffset = 80; // height of fixed header
      const elementPosition = formRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      formInputRef.current?.focus();
    }
  };

  return (
    <section className="hero relative w-full h-[400px] md:h-[500px] text-white overflow-hidden">
      {/* Grid Background */}
      <div className="grid-background absolute inset-0"></div>

      {/* Radial Glow */}
      <div className="radial-overlay absolute inset-0 pointer-events-none"></div>

      {/* Moving Vehicles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="vehicle vehicle-1"></div>
        <div className="vehicle vehicle-2"></div>
        <div className="vehicle vehicle-3"></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-24 md:pt-24 shadow-xl/20">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4"
        >
          Find Your Event. Plan Your Ride.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm sm:text-lg md:text-xl font-light text-blue-100 mb-8 shadow-2xl"
        >
          Discover the most efficient public transport routes across the capital region — powered by real-time HSL data.
        </motion.p>
        <button
          onClick={handleScrollToForm}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-blue-600 font-bold rounded-xl shadow-2xl
                     hover:bg-gray-100 transition duration-300 transform hover:scale-105 cursor-pointer ring-indigo-700"
        >
          Plan Your Route
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
