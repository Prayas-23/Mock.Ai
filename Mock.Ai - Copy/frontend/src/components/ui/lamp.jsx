import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils.js";

export function LampContainer({ children, className }) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black w-full",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            repeatDelay: 1,
          }}
          className="absolute inset-x-0 top-0 z-[2] h-40 w-[30rem] bg-[conic-gradient(from_90deg_at_50%_50%,#0EA5E9_0%,#8B5CF6_50%,#0EA5E9_100%)] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            repeatDelay: 1,
          }}
          className="absolute inset-x-0 top-0 z-[3] h-40 w-[30rem] bg-[conic-gradient(from_90deg_at_50%_50%,#0EA5E9_0%,#8B5CF6_50%,#0EA5E9_100%)] blur-3xl"
        />
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-black opacity-30 blur-3xl" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-blue-500 opacity-30 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            repeatDelay: 1,
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-blue-400 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            repeatDelay: 1,
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-blue-400"
        />

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black" />
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}