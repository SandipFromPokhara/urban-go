import SeeAlsoSection from "./Trending";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function WhySection({ isDarkMode }) {
  const { isAuthenticated } = useAuth();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  return (
    <div>
      <motion.div
        initial={{ boxShadow: "0 0 0px rgba(107,30,255,0)" }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(107,30,255,0.3)",
            "0 0 40px rgba(107,30,255,0.6)",
            "0 0 20px rgba(107,30,255,0.3)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="mt-24 max-w-6xl mx-auto rounded-2xl p-0.5 bg-[#1B1036]/80"
      >
        {isAuthenticated && (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="flex flex-col justify-center text-center rounded-2xl px-6 py-8 bg-[#1B1036]/80 backdrop-blur-md text-gray-100 shadow-inner">
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-extrabold mb-6 bg-linear-to-r from-[#00AEEF] via-[#C084FC] to-[#00E5C2] bg-clip-text text-transparent drop-shadow-lg"
          >
            what’s next?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg mb-10 max-w-2xl text-white mx-auto"
          >
            Ready for another adventure in your city? Check out events, live music, and new spots near you. Curated just for you.
          </motion.p>
        </motion.div>
        )} 
        {!isAuthenticated && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="flex flex-col justify-center text-center rounded-2xl px-6 py-8 bg-[#1B1036]/80 backdrop-blur-md text-gray-100 shadow-inner">
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-extrabold mb-6 bg-linear-to-r from-[#00AEEF] via-[#C084FC] to-[#00E5C2] bg-clip-text text-transparent drop-shadow-lg"
          >
            Why Use City Companion?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg mb-10 max-w-2xl text-white mx-auto"
          >
            City Companion connects you with the pulse of your city — from live
            music to art fairs, from cozy food spots to exciting sports events.
            Discover what’s happening, effortlessly.
          </motion.p>
        </motion.div>
        )}
      </motion.div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-20 px-6"
      >
        <SeeAlsoSection isDarkMode={isDarkMode} />
      </motion.div>
    </div>
  );
}
