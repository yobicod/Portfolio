"use client";
import Link from "next/link";
import React, { memo } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { TypeAnimation } from "react-type-animation";
import { motion, type Easing } from "framer-motion";
import { JOB_DESCRIPTION } from "@/constants/information";
import { useTopic } from "@/context/TopicContext";
import { getTopicImage } from "@/constants/topicImageMap";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";

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
  const metrics = [
    { value: "4+", label: "Years" },
    { value: "AI", label: "Product" },
    { value: "TH", label: "Based" },
  ];

  return (
    <>
      <section className="mb-3 flex w-full items-center gap-3 border-b border-white/[0.07] px-1 py-3 md:hidden">
        <img
          src={avatarSrc}
          alt="Visal"
          className="h-13 w-13 shrink-0 rounded-2xl border border-white/15 bg-[rgba(10,18,32,0.78)] object-cover p-1 shadow-[0_12px_30px_rgba(0,0,0,0.32)]"
        />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[0.6rem] font-medium uppercase leading-none tracking-[0.22em] text-[var(--foreground-muted)]">
            Fullstack / AI
          </p>
          <h1 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
            Hello, I&apos;m Visal
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

      <section className="hidden w-full flex-col justify-center md:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.045] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--foreground-muted)] shadow-[0_14px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-[var(--signal)] shadow-[0_0_14px_rgba(196,255,104,0.7)]" />
            Available for AI product work
          </div>

          <div className="relative inline-block">
            <div className="absolute -inset-3 rounded-[2rem] border border-white/[0.06] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(70,233,255,0.04),rgba(255,183,77,0.06))]" />
            <motion.img
              src={avatarSrc}
              alt="Hero image"
              className="relative h-[150px] w-[150px] rounded-[1.75rem] border border-white/15 bg-[rgba(8,16,31,0.78)] object-cover p-2 shadow-glow lg:h-[184px] lg:w-[184px]"
              width={220}
              height={220}
              {...AVATAR_ANIMATION}
            />
          </div>

          <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-warm)]">
            Fullstack Engineer / AI Product Crafter
          </p>

          <h1 className="mt-2 max-w-[11ch] text-4xl font-semibold leading-[0.95] text-[var(--foreground)] lg:text-5xl">
            Visal Suwanarat
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--foreground-muted)]">
            I build clean web experiences, AI-assisted workflows, and practical
            product systems that feel fast, focused, and human.
          </p>

          <div className="mt-5 grid w-full max-w-sm grid-cols-3 gap-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.045] px-3 py-3 backdrop-blur-xl"
              >
                <div className="text-lg font-semibold leading-none text-[var(--foreground)]">
                  {metric.value}
                </div>
                <div className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={GITHUB_URL} className="ai-link">
              <GitHubIcon sx={{ fontSize: 16 }} />
              Github
            </Link>
            <Link href={LINKEDIN_URL} className="ai-link">
              <LinkedInIcon sx={{ fontSize: 16 }} />
              Linkedin
            </Link>
            <a href="/visal_suwanarat_cv.pdf" download className="ai-link">
              <DescriptionIcon sx={{ fontSize: 16 }} />
              CV
            </a>
          </div>

          <div className="mt-5 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[rgba(7,14,27,0.64)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)] shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
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
