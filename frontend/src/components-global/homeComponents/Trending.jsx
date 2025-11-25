import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./TrendingCard";
import { seeAlsoData } from "../../data";

const SeeAlsoSection = ({ isDarkMode }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;

      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative px-8 py-10">
      <h2 className="text-2xl font-bold mb-6" style={{color: isDarkMode ? 'white' : 'black' }}>See also</h2>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md rounded-full p-2 hover:bg-gray-100 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <motion.div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        whileTap={{ cursor: "pointer" }}
      >
        {seeAlsoData.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <Card
                image={item.image}
                title={item.title}
                description={item.description}
                date={item.date}
              />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SeeAlsoSection;
