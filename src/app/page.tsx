"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import ProjectChapter from "@/components/ProjectChapter";
import MagneticLink from "@/components/MagneticLink";
import MotionReveal from "@/components/MotionReveal";
import SignaturePortrait from "@/components/SignaturePortrait";
import TechnologyEcosystem from "@/components/TechnologyEcosystem";
import ExperienceLoader from "@/components/ExperienceLoader";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SoundProvider, { useSound } from "@/components/SoundProvider";
import SoundToggle from "@/components/SoundToggle";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { I18nProvider, useTranslation } from "@/i18n/I18nProvider";

const WebGLAtmosphere = dynamic(() => import("@/components/WebGLAtmosphere"), {
  ssr: false,
});

const chapters = ["hero", "approach", "stack", "work", "experience", "contact"] as const;
const navigationChapters = ["approach", "stack", "work", "experience", "contact"] as const;

const CONTACT_EMAIL = "yobicod.4u@gmail.com";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow--down" : "arrow"} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M6 3h9v9" />
    </svg>
  );
}

function SceneLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="scene-label"><span>{index}</span>{children}</p>;
}

function useJourney() {
  const [active, setActive] = useState("hero");
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = chapters.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
      },
      { rootMargin: "-28% 0px -48%", threshold: [0, 0.2, 0.5, 0.8] },
    );
    sections.forEach((section) => observer.observe(section));

    let frame = 0;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      progressRef.current?.style.setProperty("--journey-progress", `${progress}`);
      document.documentElement.style.setProperty("--scroll-progress", `${progress}`);
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const local = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (bounds.height + window.innerHeight)));
        section.style.setProperty("--scene-progress", `${local}`);
      });
      const focusLine = window.innerHeight * .42;
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= focusLine && bounds.bottom > focusLine;
      });
      if (current) setActive(current.id);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    frame = requestAnimationFrame(updateProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { active, progressRef };
}

function Navigation({ active }: { active: string }) {
  const { t } = useTranslation();
  const { playEffect } = useSound();
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
      <a className="brand" href="#hero" aria-label={t.nav.brandLabel} onClick={() => { playEffect("navigation"); closeMenu(); }}>
        <b>V</b><span>VISAL<br />SUWANARAT</span>
      </a>
      <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label={t.nav.primaryLabel}>
        {navigationChapters.map((chapter, index) => (
          <a key={chapter} href={`#${chapter}`} aria-current={active === chapter ? "location" : undefined} onClick={() => { playEffect("navigation"); closeMenu(); }}>
            <span>0{index + 2}</span>{t.nav[chapter]}
          </a>
        ))}
      </nav>
      <a className="nav-status" href="#contact" onClick={() => { playEffect("navigation"); closeMenu(); }}><i /> {t.nav.availability}</a>
      <LanguageSwitcher />
      <SoundToggle />
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
    </header>
  );
}

function PortfolioContent() {
  const { t } = useTranslation();
  const { playEffect } = useSound();
  const { active, progressRef } = useJourney();
  const [copyStatus, setCopyStatus] = useState("");
  const copyStatusTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyStatusTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyStatus(t.contact.copied);
      playEffect("success");
    } catch {
      setCopyStatus(t.contact.copyUnavailable);
    }
    window.clearTimeout(copyStatusTimer.current);
    copyStatusTimer.current = window.setTimeout(() => setCopyStatus(""), 2600);
  };

  return (
    <main className="experience" data-chapter={active}>
      <ExperienceLoader />
      <div className="skip-links">
        <a className="skip-link" href="#approach">{t.utility.skipContent}</a>
        <a className="skip-link" href="#work">{t.utility.skipWork}</a>
      </div>
      <WebGLAtmosphere />
      <div className="noise" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Navigation active={active} />

      <nav className="journey-progress" ref={progressRef} aria-label={t.utility.journey}>
        <span aria-hidden="true">01</span><div aria-hidden="true"><i /></div><span aria-hidden="true">06</span>
        <a className="journey-progress__target journey-progress__target--start" href="#hero"><span className="sr-only">{t.utility.journeyStart}</span></a>
        <a className="journey-progress__target journey-progress__target--end" href="#contact"><span className="sr-only">{t.utility.journeyEnd}</span></a>
      </nav>

      <section id="hero" className="scene hero-scene is-visible" aria-labelledby="hero-title">
        <MotionReveal className="hero-copy" y={34}>
          <SceneLabel index="01">{t.hero.label}</SceneLabel>
          <h1 id="hero-title">{t.hero.title}<br /><em>{t.hero.titleEmphasis}</em></h1>
          <p>{t.hero.description}</p>
          <div className="hero-actions">
            <MagneticLink className="primary-cta" href="#work"><span>{t.hero.explore}</span><Arrow down /></MagneticLink>
            <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">{t.hero.resume} <Arrow /></a>
          </div>
          <dl className="hero-facts">
            <div><dt>{t.hero.focus}</dt><dd>{t.hero.focusValue}</dd></div>
            <div><dt>{t.hero.craft}</dt><dd>{t.hero.craftValue}</dd></div>
            <div><dt>{t.hero.base}</dt><dd>{t.hero.baseValue}</dd></div>
          </dl>
        </MotionReveal>

        <SignaturePortrait />

        <p className="scroll-cue">{t.hero.scroll} <span>↓</span></p>
      </section>

      <section id="approach" className="scene about-scene" aria-labelledby="approach-title">
        <MotionReveal className="about-heading">
          <SceneLabel index="02">{t.approach.label}</SceneLabel>
          <h2 id="approach-title">{t.approach.title}<br /><em>{t.approach.titleEmphasis}</em></h2>
        </MotionReveal>
        <MotionReveal className="about-copy" delay={0.12}>
          <p className="about-lead">{t.approach.lead} <em>{t.approach.leadEmphasis}</em></p>
          <ol className="practice-steps">
            {t.approach.steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}
          </ol>
        </MotionReveal>
      </section>

      <section id="stack" className="scene technology-scene" aria-labelledby="stack-title">
        <TechnologyEcosystem />
      </section>

      <section id="work" className="scene work-scene" aria-labelledby="work-title">
        <MotionReveal className="work-intro">
          <SceneLabel index="04">{t.work.label}</SceneLabel>
          <h2 id="work-title">{t.work.title}<br /><em>{t.work.titleEmphasis}</em></h2>
          <p>{t.work.description}</p>
        </MotionReveal>
        <div className="project-list">
          {t.work.projects.map((project, index) => <ProjectChapter project={project} featured={index === 0} key={project.id} />)}
        </div>
        <a className="work-link" href={GITHUB_URL} target="_blank" rel="noreferrer"><span>{t.work.archive}</span><Arrow /></a>
      </section>

      <section id="experience" className="scene experience-scene" aria-labelledby="experience-title">
        <MotionReveal className="experience-heading">
          <SceneLabel index="05">{t.experience.label}</SceneLabel>
          <h2 id="experience-title">{t.experience.title}<br /><em>{t.experience.titleEmphasis}</em></h2>
          <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">{t.experience.resume} <Arrow down /></a>
        </MotionReveal>
        <MotionReveal className="timeline" delay={0.12}>
          {t.experience.entries.map(({ date, role, company, description }, index) => (
            <article className="timeline-item" key={`${date}-${role}`}>
              <span className="timeline-number">0{index + 1}</span>
              <time>{date}</time>
              <div><h3>{role}</h3><span>{company}</span><p>{description}</p></div>
            </article>
          ))}
        </MotionReveal>
      </section>

      <section id="contact" className="scene contact-scene" aria-labelledby="contact-title">
        <MotionReveal className="contact-copy" y={32}>
          <SceneLabel index="06">{t.contact.label}</SceneLabel>
          <p className="contact-kicker">{t.contact.kicker}</p>
          <h2 id="contact-title">{t.contact.title}<br /><em>{t.contact.titleEmphasis}</em> {t.contact.titleEnd}</h2>
          <MagneticLink className="primary-cta primary-cta--light" href={`mailto:${CONTACT_EMAIL}`}><span>{t.contact.start}</span><Arrow /></MagneticLink>
          <div className="contact-options">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button type="button" onClick={copyEmail}>{t.contact.copy}</button>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">{t.contact.linkedIn}</a>
          </div>
          <p className="copy-status" aria-live="polite">{copyStatus}</p>
        </MotionReveal>
        <footer>
          <div><span>{t.footer.copyright}</span><span>{t.footer.intent}</span></div>
          <nav aria-label={t.utility.social}><a href={GITHUB_URL} target="_blank" rel="noreferrer">{t.footer.github}</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">{t.footer.linkedIn}</a><a href="#hero">{t.footer.top}</a></nav>
        </footer>
      </section>
    </main>
  );
}

export default function Home() {
  return <I18nProvider><SoundProvider><PortfolioContent /></SoundProvider></I18nProvider>;
}
