"use client";
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-8/12 flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.img
          src="/coding.png"
          alt="coding picture"
          className="mx-auto"
          width={250}
          height={250}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            rotate: 0,
            opacity: 1,
            y: [0, -10, 0], // 👈 float up then back
          }}
          transition={{
            rotate: { duration: 1, ease: "easeOut" },
            opacity: { duration: 1 },
            y: {
              delay: 1, // after rotation
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Hello, I’m Visal
        </h1>
        <p className="text-base sm:text-lg md:text-xl mt-4">
          Fullstack Engineer AI Specialist from 🇹🇭
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
