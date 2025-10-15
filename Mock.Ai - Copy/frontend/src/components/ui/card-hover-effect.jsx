import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils.js";

export const HoverEffect = ({ items, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {items.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  );
};

const Card = ({ item }) => {
  const handleClick = () => {
    if (item.link) {
      window.location.href = item.link;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group block p-2 h-full w-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/[0.1] group-hover:border-purple-500/[0.2] transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-4 p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-neutral-400 text-sm text-center">{item.description}</p>
          <div className="mt-4">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};