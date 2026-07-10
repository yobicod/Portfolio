"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import ProjectChapter from "@/components/ProjectChapter";
import MagneticLink from "@/components/MagneticLink";
import MotionReveal from "@/components/MotionReveal";
import SignaturePortrait from "@/components/SignaturePortrait";
import TechnologyEcosystem from "@/components/TechnologyEcosystem";
import ExperienceLoader from "@/components/ExperienceLoader";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";
import { experience, projects } from "@/data/portfolio";

const WebGLAtmosphere = dynamic(() => import("@/components/WebGLAtmosphere"), {
  ssr: false,
});

const chapters = ["hero", "approach", "stack", "work", "experience", "contact"] as const;

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
      <a className="brand" href="#hero" aria-label="Visal Suwanarat, home" onClick={() => closeMenu()}>
        <b>V</b><span>VISAL<br />SUWANARAT</span>
      </a>
      <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
        {chapters.slice(1).map((chapter, index) => (
          <a key={chapter} href={`#${chapter}`} aria-current={active === chapter ? "location" : undefined} onClick={() => closeMenu()}>
            <span>0{index + 2}</span>{chapter}
          </a>
        ))}
      </nav>
      <a className="nav-status" href="#contact" onClick={() => closeMenu()}><i /> AVAILABLE FOR SELECT PROJECTS</a>
      <button
        type="button"
        className="menu-toggle"
        ref={toggleRef}
        onClick={() => open ? closeMenu(true) : setOpen(true)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls="primary-navigation"
        aria-expanded={open}
      >
        <span /><span />
      </button>
    </header>
  );
}

export default function Home() {
  const { active, progressRef } = useJourney();
  const [copyStatus, setCopyStatus] = useState("");
  const copyStatusTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyStatusTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus("Copy unavailable — select the email address");
    }
    window.clearTimeout(copyStatusTimer.current);
    copyStatusTimer.current = window.setTimeout(() => setCopyStatus(""), 2600);
  };

  return (
    <main className="experience" data-chapter={active}>
      <ExperienceLoader />
      <div className="skip-links">
        <a className="skip-link" href="#approach">Skip to content</a>
        <a className="skip-link" href="#work">Skip to selected work</a>
      </div>
      <WebGLAtmosphere />
      <div className="noise" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Navigation active={active} />

      <nav className="journey-progress" ref={progressRef} aria-label="Page journey">
        <span aria-hidden="true">01</span><div aria-hidden="true"><i /></div><span aria-hidden="true">06</span>
        <a className="journey-progress__target journey-progress__target--start" href="#hero"><span className="sr-only">Back to introduction</span></a>
        <a className="journey-progress__target journey-progress__target--end" href="#contact"><span className="sr-only">Jump to contact</span></a>
      </nav>

      <section id="hero" className="scene hero-scene is-visible" aria-labelledby="hero-title">
        <MotionReveal className="hero-copy" y={34}>
          <SceneLabel index="01">FULL-STACK ENGINEER · AI &amp; AUTOMATION</SceneLabel>
          <h1 id="hero-title">Software<br /><em>Engineer.</em></h1>
          <p>I build intelligent products, scalable systems, and thoughtful automation with production craftsmanship from interface to infrastructure.</p>
          <div className="hero-actions">
            <MagneticLink className="primary-cta" href="#work"><span>Explore selected work</span><Arrow down /></MagneticLink>
            <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">Résumé <Arrow /></a>
          </div>
          <dl className="hero-facts">
            <div><dt>Focus</dt><dd>AI products</dd></div>
            <div><dt>Craft</dt><dd>Full stack</dd></div>
            <div><dt>Base</dt><dd>Bangkok · TH</dd></div>
          </dl>
        </MotionReveal>

        <SignaturePortrait />

        <p className="scroll-cue">SCROLL TO BEGIN <span>↓</span></p>
      </section>

      <section id="approach" className="scene about-scene" aria-labelledby="approach-title">
        <MotionReveal className="about-heading">
          <SceneLabel index="02">THE PRACTICE / FULL SYSTEM VIEW</SceneLabel>
          <h2 id="approach-title">Clarity in<br />every <em>layer.</em></h2>
        </MotionReveal>
        <MotionReveal className="about-copy" delay={0.12}>
          <p className="about-lead">A practical process for turning complexity into calm, useful software—always guided by <em>less, but better.</em></p>
          <ol className="practice-steps">
            <li><span>01</span><div><strong>Frame</strong><p>Define the real problem and the outcome that matters.</p></div></li>
            <li><span>02</span><div><strong>Architect</strong><p>Shape a system that remains clear as it scales.</p></div></li>
            <li><span>03</span><div><strong>Ship</strong><p>Build the full experience with production discipline.</p></div></li>
            <li><span>04</span><div><strong>Measure</strong><p>Learn from real use and refine what creates value.</p></div></li>
          </ol>
        </MotionReveal>
      </section>

      <section id="stack" className="scene technology-scene" aria-labelledby="stack-title">
        <TechnologyEcosystem />
      </section>

      <section id="work" className="scene work-scene" aria-labelledby="work-title">
        <MotionReveal className="work-intro">
          <SceneLabel index="04">SELECTED SYSTEMS / 2023—2026</SceneLabel>
          <h2 id="work-title">Work with<br /><em>purpose.</em></h2>
          <p>Selected work spanning intelligent products, operational software, and cloud platforms.</p>
        </MotionReveal>
        <div className="project-list">
          {projects.map((project, index) => <ProjectChapter project={project} featured={index === 0} key={project.id} />)}
        </div>
        <a className="work-link" href={GITHUB_URL} target="_blank" rel="noreferrer"><span>Explore the code archive</span><Arrow /></a>
      </section>

      <section id="experience" className="scene experience-scene" aria-labelledby="experience-title">
        <MotionReveal className="experience-heading">
          <SceneLabel index="05">EXPERIENCE / MILESTONES</SceneLabel>
          <h2 id="experience-title">A path of<br /><em>making.</em></h2>
          <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank" rel="noreferrer">Download résumé <Arrow down /></a>
        </MotionReveal>
        <MotionReveal className="timeline" delay={0.12}>
          {experience.map(({ date, role, company, description }, index) => (
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
          <SceneLabel index="06">THE NEXT CHAPTER</SceneLabel>
          <p className="contact-kicker">HAVE A COMPLEX IDEA?</p>
          <h2 id="contact-title">Let&apos;s build<br /><em>something</em> together.</h2>
          <MagneticLink className="primary-cta primary-cta--light" href={`mailto:${CONTACT_EMAIL}`}><span>Start a conversation</span><Arrow /></MagneticLink>
          <div className="contact-options">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button type="button" onClick={copyEmail}>Copy email</button>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <p className="copy-status" aria-live="polite">{copyStatus}</p>
        </MotionReveal>
        <footer>
          <div><span>VISAL SUWANARAT © 2026</span><span>DESIGNED &amp; ENGINEERED WITH INTENT</span></div>
          <nav aria-label="Social links"><a href={GITHUB_URL} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="#hero">BACK TO TOP ↑</a></nav>
        </footer>
      </section>
    </main>
  );
}
