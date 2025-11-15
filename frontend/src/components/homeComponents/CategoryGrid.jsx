import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { events } from "../../data";
import sports from "../../assets/images/Sports.avif";
import music from "../../assets/images/Music.jpg";
import family from "../../assets/images/Family.avif";
import art from "../../assets/images/Art.jpg";
import food from "../../assets/images/Food.jpg";

export default function CategoryGrid() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % events.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      name: "Sports",
      image: sports,
      size: "col-span-1 row-span-2",
      label: "Sports",
    },
    {
      name: "Music",
      image: music,
      size: "col-span-1 row-span-1",
      label: "Music",
    },
    {
      name: "Art & Culture",
      image: art,
      size: "col-span-1 row-span-1",
      label: "Art & Culture",
    },
    {
      name: "Family",
      image: family,
      size: "col-span-1 row-span-2",
      label: "Family",
    },
    {
      name: "Food",
      image: food,
      size: "col-span-2 row-span-1",
      label: "Food",
    },
  ];

  return (
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
      className="mt-24 max-w-6xl mx-auto rounded-3xl p-0.5 bg-transparent"
    >
      <div className="w-full flex flex-col justify-center bg-white/5 rounded-3xl p-6 gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-12">
          {/* LEFT SIDE TEXT */}
          <div className="flex flex-col text-left lg:w-1/2 w-full">
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-bold mb-6 bg-linear-to-r from-[#00AEEF] via-[#C084FC] to-[#00E5C2] 
      bg-clip-text text-transparent drop-shadow-lg"
            >
              Getting Started
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg mb-20 text-secondary max-w-xl mx-auto lg:mx-0"
            >
              Explore events tailored to your interests. Choose from a variety
              of categories to find what excites you most!
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-linear-to-r from-gradient-start via-gradient-via to-gradient-end 
      text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-xl 
      transition duration-300"
            >
              Explore Categories
            </motion.button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={events[index].image}
                alt={events[index].title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent 
      flex flex-col justify-end p-4 text-white"
              >
                <h3 className="text-xl font-semibold">{events[index].title}</h3>
                <p className="text-sm opacity-80">{events[index].city}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] gap-4 grid-auto-flow-dense">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/events?category=${cat.name}`)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group ${cat.size}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-all duration-300"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4">
                <div
                  className="bg-linear-to-r from-gradient-start via-gradient-via to-gradient-end 
      text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-xl 
      transition duration-300"
                >
                  {cat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
