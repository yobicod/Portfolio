"use client";

import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { getTopicImage } from "@/constants/topicImageMap";
import { useTopic } from "@/context/TopicContext";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { memo, type MouseEvent } from "react";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 13 13 3M5 3h8v8" />
  </svg>
);

const Hero = memo(function Hero() {
  const { topic, isTyping } = useTopic();
  const avatarSrc = getTopicImage(topic, isTyping);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 90, damping: 18 });
  const springY = useSpring(y, { stiffness: 90, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero__copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">
          <span>01</span> ENGINEER / CREATIVE TECHNOLOGIST
        </p>
        <h1 id="hero-title">
          I build digital
          <span className="display-accent"> experiences</span>
          <br />
          with a pulse.
        </h1>
        <p className="hero__intro">
          I&apos;m Visal, a full-stack engineer crafting intelligent products at
          the intersection of <strong>human intuition</strong> and
          <strong> emerging technology</strong>.
        </p>

        <div className="hero__actions">
          <a className="primary-action" href="#conversation">
            Explore my work <ArrowIcon />
          </a>
          <a className="text-action" href="/visal_suwanarat_cv.pdf" download>
            Download résumé <span>↓</span>
          </a>
        </div>

        <nav className="social-links" aria-label="Social links">
          <Link href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub <ArrowIcon />
          </Link>
          <Link href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn <ArrowIcon />
          </Link>
          <a href="mailto:yobicod.4u@gmail.com">
            Email <ArrowIcon />
          </a>
        </nav>
      </motion.div>

      <motion.div
        className="portrait-stage"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`Interactive portrait${topic ? ` reacting to ${topic}` : ""}`}
      >
        <div className="orbit orbit--outer" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="orbit orbit--inner" aria-hidden="true" />
        <div className="portrait-stage__halo" aria-hidden="true" />
        <div className="portrait-stage__disc">
          <motion.img
            key={avatarSrc}
            src={avatarSrc}
            alt="Illustrated portrait of Visal"
            width={460}
            height={460}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="floating-label floating-label--top">
          <span>STATUS</span>
          <strong>{isTyping ? "Thinking..." : "Online"}</strong>
        </div>
        <div className="floating-label floating-label--bottom">
          <span>FOCUS</span>
          <strong>{topic || "AI products"}</strong>
        </div>
        <span className="stage-index" aria-hidden="true">
          V / 01
        </span>
      </motion.div>
    </section>
  );
});

export default Hero;
