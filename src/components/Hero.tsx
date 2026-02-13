"use client";
import Link from "next/link";
import React, { useState, useCallback, memo } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { TypeAnimation } from "react-type-animation";
import { motion, type Easing } from "framer-motion";
import { JOB_DESCRIPTION } from "@/constants/information";
import { useTopic } from "@/context/TopicContext";
import { getTopicImage } from "@/constants/topicImageMap";
import Celebrate from "./Celebrate";
import { fadeOutSound } from "@/utils/utils";

/** Animation configuration for the floating avatar */
const AVATAR_ANIMATION = {
  initial: { opacity: 0, y: 0, rotate: 0 },
  animate: {
    opacity: 1,
    y: [0, -10, 0],
    rotate: [-2, 2, -2],
  },
  transition: {
    opacity: { duration: 1 },
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as Easing,
    },
    rotate: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as Easing,
    },
  },
};

const Hero = memo(function Hero() {
  const { topic, isTyping } = useTopic();
  const [isCelebrate, setIsCelebrate] = useState(false);

  const handleCelebrate = useCallback(() => {
    setIsCelebrate(true);
    const lofiAudio = new Audio("/everyone_celebrate_lofi.mp3");
    lofiAudio.currentTime = 0;
    lofiAudio.play();
    fadeOutSound(lofiAudio);
  }, []);

  const avatarSrc = getTopicImage(topic, isTyping);

  return (
    <section className="min-h-8/12 flex items-center justify-center ">
      {isCelebrate && <Celebrate />}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.img
          src={avatarSrc}
          alt="Hero image"
          className="mx-auto"
          width={250}
          height={250}
          {...AVATAR_ANIMATION}
        />

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Hello, I’m Visal🇹🇭
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <Link href={GITHUB_URL} className="text-primary underline">
            Github
          </Link>
          <Link href={LINKEDIN_URL} className="text-primary underline">
            Linkedin
          </Link>
          <a
            href="/visal_suwanarat_cv.pdf"
            download
            className="text-primary underline"
          >
            CV
          </a>
        </div>

        <div className="text-base sm:text-lg md:text-xl mt-4">
          <TypeAnimation
            sequence={JOB_DESCRIPTION}
            speed={50}
            repeat={Infinity}
          />
        </div>

        {!isCelebrate && (
          <div
            className="flex justify-center gap-4 mt-4 cursor-pointer"
            onClick={handleCelebrate}
          >
            <p className="text-lg font-medium px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-md hover:scale-105 transition-transform duration-300">
              🥳 Celebrate on my promotion 🎉
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
});

export default Hero;
