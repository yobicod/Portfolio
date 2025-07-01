"use client";
import Link from "next/link";
import React from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/const/link";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { JOB_DESCRIPTION } from "@/const/information";
import { useTopic } from "@/context/TopicContext";

const Hero = () => {
  const { topic, isTyping } = useTopic();

  const mapImageByTopic = (topic: string, isTyping: boolean): string => {
    if (isTyping) return "/dev_thinking.png";
    switch (topic) {
      case "":
        return "/dev_smile.png";
      case "About me":
        return "/dev_smile.png";
      case "Experience":
        return "/dev_interest.png";
      case "Project":
        return "/dev_two_fingers.png";
      case "Contact":
        return "/dev_u_got_it.png";
      case "Tech stack":
        return "/coding.png";

      default:
        return "/coding.png";
    }
  };

  return (
    <section className="min-h-8/12 flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.img
          src={mapImageByTopic(topic, isTyping)}
          alt="Hero image"
          className="mx-auto"
          width={250}
          height={250}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
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
          Hello, I’m Visal🇹🇭
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <Link href={`${GITHUB_URL}`} className="text-primary underline">
            Github
          </Link>
          <Link href={`${LINKEDIN_URL}`} className="text-primary underline">
            Linkedin
          </Link>
          <a
            href={`/visal_suwanarat_cv.pdf`}
            download={true}
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
        {/* <p className="text-base sm:text-lg md:text-xl mt-4">
          Fullstack Engineer AI Specialist from 🇹🇭
        </p> */}
      </motion.div>
    </section>
  );
};

export default Hero;
