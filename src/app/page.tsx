"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import BuilderDesk from "@/components/BuilderDesk";
import Hero3D from "@/components/Hero3D";
import HeroPortrait from "@/components/HeroPortrait";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LiquidText from "@/components/LiquidText";
import MagneticLink from "@/components/MagneticLink";
import CopyConfetti from "@/components/CopyConfetti";
import MotionReveal from "@/components/MotionReveal";
import ProjectChapter from "@/components/ProjectChapter";
import ScrollWords from "@/components/ScrollWords";
import TechnologyEcosystem from "@/components/TechnologyEcosystem";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { I18nProvider, useTranslation } from "@/i18n/I18nProvider";

const chapters = ["hero", "work", "approach", "stack", "experience", "contact"] as const;
const navigationChapters = ["work", "approach", "stack", "experience", "contact"] as const;

const CONTACT_EMAIL = "yobicod.4u@gmail.com";
const ease = [0.22, 1, 0.36, 1] as const;

/** Headline words that rise out of a blur one after another when the page opens. */
function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <>
      {text.split(" ").map((word, index) => (
        <motion.span
          className={className ? `word ${className}` : "word"}
          key={`${word}-${index}`}
          initial={reducedMotion ? false : { opacity: 0, y: "0.45em", filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: delay + index * 0.09, ease }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </>
  );
}

/** Tracks which chapter sits at the reading line, for the navigation's current state. */
function useActiveChapter() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = chapters.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      const focusLine = window.innerHeight * 0.42;
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= focusLine && bounds.bottom > focusLine;
      });
      if (current) setActive(current.id);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

function Navigation({ active }: { active: string }) {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  const closeMenu = useCallback((restoreFocus = false) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const focusTimer = open
      ? window.setTimeout(() => headerRef.current?.querySelector<HTMLAnchorElement>(".nav-links a")?.focus(), 50)
      : 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) closeMenu(true);
      if (event.key !== "Tab" || !open || !headerRef.current) return;
      const focusable = Array.from(headerRef.current.querySelectorAll<HTMLElement>("a, button"))
        .filter((item) => item.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      window.setTimeout(() => toggleRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <header className={active === "hero" ? "nav-shell" : "nav-shell is-scrolled"} ref={headerRef}>
      <div className="nav-inner">
        <a className="brand" href="#hero" aria-label={t.nav.brandLabel} onClick={() => closeMenu()}>visal<span>.</span></a>
        <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label={t.nav.primaryLabel}>
          {navigationChapters.map((chapter) => (
            <a key={chapter} href={`#${chapter}`} aria-current={active === chapter ? "location" : undefined} onClick={() => closeMenu()}>
              {t.nav[chapter]}
            </a>
          ))}
          <div className="language-switcher--mobile"><LanguageSwitcher /></div>
        </nav>
        <div className="language-switcher--desktop"><LanguageSwitcher /></div>
        <button
          type="button"
          className="menu-toggle"
          ref={toggleRef}
          onClick={() => open ? closeMenu(true) : setOpen(true)}
          aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          aria-controls="primary-navigation"
          aria-expanded={open}
        >
          <span /><span />
        </button>
      </div>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    </header>
  );
}

function PortfolioContent() {
  const { t } = useTranslation();
  const active = useActiveChapter();
  const [copyStatus, setCopyStatus] = useState("");
  const [celebration, setCelebration] = useState(0);
  const copyStatusTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyStatusTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyStatus(t.contact.copied);
      setCelebration((count) => count + 1);
    } catch {
      setCopyStatus(t.contact.copyUnavailable);
    }
    window.clearTimeout(copyStatusTimer.current);
    copyStatusTimer.current = window.setTimeout(() => setCopyStatus(""), 2600);
  };

  return (
    <main className="page">
      <div className="skip-links">
        <a className="skip-link" href="#approach">{t.utility.skipContent}</a>
        <a className="skip-link" href="#work">{t.utility.skipWork}</a>
      </div>
      <Navigation active={active} />
      <CopyConfetti celebration={celebration} />

      <section id="hero" className="hero" aria-labelledby="hero-title">
        <Hero3D />
        <div className="hero-copy container">
          <MotionReveal y={12}><a className="status-pill" href="#contact"><i />{t.nav.availability}</a></MotionReveal>
          <p className="eyebrow"><Words text={t.hero.introduction} /></p>
          <LiquidText id="hero-title"><Words text={t.hero.title} delay={0.15} /><br /><Words text={t.hero.titleEmphasis} className="gradient-text" delay={0.35} /></LiquidText>
          <MotionReveal delay={0.55}><p className="hero-lead">{t.hero.description}</p></MotionReveal>
          <MotionReveal className="actions" delay={0.7}>
            <MagneticLink className="button" href="#work">{t.hero.explore}</MagneticLink>
            <a className="link-arrow" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">{t.hero.resume}</a>
          </MotionReveal>
        </div>
        <HeroPortrait />
        <div className="container"><BuilderDesk /></div>
      </section>

      <section id="work" className="section section--alt" aria-labelledby="work-title">
        <MotionReveal className="section-head container">
          <p className="eyebrow">{t.work.label}</p>
          <h2 id="work-title">{t.work.title} <em>{t.work.titleEmphasis}</em></h2>
          <p>{t.work.description}</p>
        </MotionReveal>
        <div className="project-list container">
          {t.work.projects.map((project) => <ProjectChapter project={project} key={project.id} />)}
        </div>
        <p className="section-foot"><a className="link-arrow" href={GITHUB_URL} target="_blank" rel="noreferrer">{t.work.archive}</a></p>
      </section>

      <section id="approach" className="section section--dark" aria-labelledby="approach-title">
        <MotionReveal className="section-head container">
          <p className="eyebrow">{t.approach.label}</p>
          <h2 id="approach-title">{t.approach.title} <em>{t.approach.titleEmphasis}</em></h2>
        </MotionReveal>
        <div className="container">
          <ScrollWords className="scroll-statement" text={t.approach.lead} emphasis={t.approach.leadEmphasis} />
          <ol className="practice-steps">
            {t.approach.steps.map((step, index) => (
              <MotionReveal as="li" key={step.title} delay={index * 0.1}>
                <span>0{index + 1}</span><strong>{step.title}</strong><p>{step.description}</p>
              </MotionReveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="stack" className="section" aria-labelledby="stack-title">
        <TechnologyEcosystem />
      </section>

      <section id="experience" className="section section--alt" aria-labelledby="experience-title">
        <MotionReveal className="section-head container">
          <p className="eyebrow">{t.experience.label}</p>
          <h2 id="experience-title">{t.experience.title} <em>{t.experience.titleEmphasis}</em></h2>
        </MotionReveal>
        <div className="timeline container">
          {t.experience.entries.map(({ date, role, company, description }, index) => (
            <MotionReveal as="article" className="timeline-item" key={`${date}-${role}`} delay={index * 0.08}>
              <time>{date}</time>
              <div>
                <h3>{role}{index === 0 && <span className="timeline-current-badge"><i />{t.experience.current}</span>}</h3>
                <span className="timeline-company">{company}</span>
                <p>{description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
        <p className="section-foot"><a className="link-arrow" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">{t.experience.resume}</a></p>
      </section>

      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <span className="contact-glow" aria-hidden="true" />
        <MotionReveal className="contact-copy container" y={40}>
          <p className="eyebrow">{t.contact.kicker}</p>
          <LiquidText as="h2" id="contact-title">{t.contact.title} <span className="gradient-text">{t.contact.titleEmphasis}</span> {t.contact.titleEnd}</LiquidText>
          <div className="actions">
            <MagneticLink className="button button--large" href={`mailto:${CONTACT_EMAIL}`}>{t.contact.start}</MagneticLink>
          </div>
          <div className="contact-options">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button type="button" onClick={copyEmail}>{t.contact.copy}</button>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">{t.contact.linkedIn}</a>
          </div>
          <p className="copy-status" aria-live="polite">{copyStatus}</p>
        </MotionReveal>
      </section>

      <footer className="footer">
        <div className="container">
          <p><span>{t.footer.copyright}</span><span>{t.footer.intent}</span></p>
          <nav aria-label={t.utility.social}><a href={GITHUB_URL} target="_blank" rel="noreferrer">{t.footer.github}</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">{t.footer.linkedIn}</a><a href="#hero">{t.footer.top}</a></nav>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return <I18nProvider><PortfolioContent /></I18nProvider>;
}
