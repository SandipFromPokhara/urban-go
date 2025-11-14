import { motion, useScroll, useTransform } from "framer-motion";
import heroVideo from "/Users/olga/Documents/GitHub/urban-go/frontend/src/assets/vids/Hero2.mp4";

export default function Hero() {
  const { scrollY } = useScroll();

  const fadeEnd = 600;
  const opacity = useTransform(scrollY, [0, fadeEnd], [1, 0]);
  const translateY = useTransform(scrollY, [0, fadeEnd], [0, -50]);

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <motion.div
        className="relative z-10 flex flex-col justify-center items-start h-full px-[5vw] 
                   bg-black/30 backdrop-blur-sm"
        style={{ opacity, y: translateY }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        <motion.h1
          className="font-bold mb-[2vh] abril-fatface-regular bg-linear-to-r from-gradient-start via-gradient-via to-gradient-end bg-clip-text text-transparent w-[70%]"
          style={{
            fontSize: "clamp(2rem, 8vw, 100px)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Discover What's Happening In Your City.
        </motion.h1>

        <motion.p
          className="text-textSecondary"
          style={{
            fontSize: "clamp(1rem, 3vw, 24px)",
            maxWidth: "clamp(60%, 40vw, 20%)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        >
          Find events,<br /> Plan your route,<br /> Explore your city.
        </motion.p>
      </motion.div>
    </section>
  );
}
