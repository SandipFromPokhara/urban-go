import { motion } from "framer-motion";

function HeroSection() {
  return (
    <section //className="relative bg-gradient-to-b from-cyan-400 via-blue-400 to-indigo-500 text-white py-20 overflow-hidden"
      className="relative mt-20 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 text-white py-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl/25"
        >
          Find Your Event. Plan Your Ride.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 drop-shadow-lg"
        >
          Discover the most efficient public transport routes across capital
          region — powered by real-time HSL data.
        </motion.p>

      </div>
    </section>
  );
}

export default HeroSection;
