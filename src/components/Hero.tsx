"use client";
import Link from "next/link";
import React, { memo } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { TypeAnimation } from "react-type-animation";
import { motion, type Easing } from "framer-motion";
import { JOB_DESCRIPTION } from "@/constants/information";
import { useTopic } from "@/context/TopicContext";
import { getTopicImage } from "@/constants/topicImageMap";

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
  const avatarSrc = getTopicImage(topic, isTyping);

  return (
    <>
      {/* Mobile: compact horizontal strip */}
      <section className="flex md:hidden items-center gap-3 px-2 py-3 border-b border-[rgba(124,211,255,0.14)] w-full">
        <img
          src={avatarSrc}
          alt="Visal"
          className="h-12 w-12 shrink-0 rounded-xl border border-[rgba(70,233,255,0.42)] bg-[rgba(8,16,31,0.72)] object-cover p-0.5"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.26em] text-[var(--foreground-muted)] leading-none mb-0.5">
            Fullstack · AI
          </p>
          <h1 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
            Hello, I&apos;m Visal 🇹🇭
          </h1>
          <div className="mt-1.5 flex gap-2">
            <Link
              href={GITHUB_URL}
              className="ai-link"
              style={{ fontSize: "0.62rem", padding: "0.2rem 0.55rem" }}
            >
              Github
            </Link>
            <Link
              href={LINKEDIN_URL}
              className="ai-link"
              style={{ fontSize: "0.62rem", padding: "0.2rem 0.55rem" }}
            >
              Linkedin
            </Link>
            <a
              href="/visal_suwanarat_cv.pdf"
              download
              className="ai-link"
              style={{ fontSize: "0.62rem", padding: "0.2rem 0.55rem" }}
            >
              CV
            </a>
          </div>
        </div>
      </section>

      {/* Desktop: vertical column (no ai-panel card) */}
      <section className="hidden md:flex flex-col items-center justify-center text-center w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center w-full"
        >
          <motion.img
            src={avatarSrc}
            alt="Hero image"
            className="h-[160px] w-[160px] rounded-3xl border border-[rgba(70,233,255,0.42)] bg-[rgba(8,16,31,0.72)] object-cover p-2 shadow-glow lg:h-[190px] lg:w-[190px]"
            width={200}
            height={200}
            {...AVATAR_ANIMATION}
          />

          <p className="mt-5 text-[0.64rem] font-medium uppercase tracking-[0.32em] text-[var(--foreground-muted)]">
            Fullstack Engineer • AI Product Crafter
          </p>

          <h1 className="mt-2 text-2xl font-semibold leading-tight text-[var(--foreground)] lg:text-3xl xl:text-4xl">
            Hello, I&apos;m Visal 🇹🇭
          </h1>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link href={GITHUB_URL} className="ai-link">
              Github
            </Link>
            <Link href={LINKEDIN_URL} className="ai-link">
              Linkedin
            </Link>
            <a href="/visal_suwanarat_cv.pdf" download className="ai-link">
              CV
            </a>
          </div>

          <div className="mx-auto mt-6 w-full max-w-[260px] rounded-2xl border border-[rgba(147,167,202,0.22)] bg-[rgba(7,14,27,0.68)] px-4 py-3 text-sm text-[var(--foreground-muted)]">
            <TypeAnimation
              sequence={JOB_DESCRIPTION}
              speed={50}
              repeat={Infinity}
            />
          </div>
        </motion.div>
      </section>
    </>
  );
});

export default Hero;
