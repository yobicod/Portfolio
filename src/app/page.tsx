"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TechnologyEcosystem from "@/components/TechnologyEcosystem";
import { GITHUB_URL, LINKEDIN_URL } from "@/constants/link";

const WebGLAtmosphere = dynamic(() => import("@/components/WebGLAtmosphere"), {
  ssr: false,
});

const chapters = ["hero", "approach", "stack", "work", "experience", "contact"] as const;

const projects = [
  {
    number: "01",
    title: "Gen-AI Knowledge System",
    category: "INTELLIGENT SYSTEM",
    statement: "Turning fragmented knowledge into dependable answers.",
    description: "A production knowledge engine designed for accurate, real-time customer and internal support.",
    contribution: "Product architecture · Full-stack delivery · AI integration",
    outcome: "Faster access to trusted operational knowledge",
    stack: ["LLM", "RAG", "TypeScript", "Python"],
    visual: "knowledge",
  },
  {
    number: "02",
    title: "Operations Platform",
    category: "PRODUCT ENGINEERING",
    statement: "Making complex workflows feel calm and obvious.",
    description: "A microservice-based workspace that connects internal management and operational workflows.",
    contribution: "System design · Frontend engineering · Backend services",
    outcome: "One clearer workflow across operational teams",
    stack: ["Next.js", "Node.js", "PostgreSQL"],
    visual: "operations",
  },
  {
    number: "03",
    title: "Cloud Maintenance Suite",
    category: "CLOUD PLATFORM",
    statement: "Connecting teams, assets, and field work.",
    description: "A cloud-native product that brings maintenance data and field operations into one system.",
    contribution: "Interface design · Cloud architecture · Infrastructure",
    outcome: "A shared source of truth for maintenance work",
    stack: ["React", "AWS", "Terraform"],
    visual: "cloud",
  },
];

const experience = [
  ["2025 — NOW", "Full Stack Engineer", "Amity Solutions", "Building production AI products and high-trust software systems."],
  ["2024 — 2025", "Junior Full Stack Engineer", "Amity Solutions", "Shipped a Gen-AI knowledge base for customer and internal support."],
  ["2023", "Full Stack Engineer · Intern", "Amity Solutions", "Built product features, chatbot integrations, and cloud infrastructure."],
  ["2020 — 2023", "Freelance Software Engineer", "KMITL Projects", "Created maintenance, ride-sharing, and booking platforms."],
];

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

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const focusTimer = open
      ? window.setTimeout(() => headerRef.current?.querySelector<HTMLAnchorElement>(".nav-links a")?.focus(), 50)
      : 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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
  }, [open]);

  return (
    <header className="nav-shell" ref={headerRef}>
      <a className="brand" href="#hero" aria-label="Visal Suwanarat, home" onClick={() => setOpen(false)}>
        <b>V</b><span>VISAL<br />SUWANARAT</span>
      </a>
      <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
        {chapters.slice(1).map((chapter, index) => (
          <a key={chapter} href={`#${chapter}`} aria-current={active === chapter ? "location" : undefined} onClick={() => setOpen(false)}>
            <span>0{index + 2}</span>{chapter}
          </a>
        ))}
      </nav>
      <div className="nav-status"><i /> AVAILABLE FOR SELECT PROJECTS</div>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setOpen((value) => !value)}
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

  return (
    <main className="experience" data-chapter={active}>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <WebGLAtmosphere />
      <div className="noise" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Navigation active={active} />

      <aside className="journey-progress" ref={progressRef} aria-hidden="true">
        <span>01</span><div><i /></div><span>06</span>
      </aside>

      <section id="hero" className="scene hero-scene is-visible">
        <div className="hero-copy reveal">
          <SceneLabel index="01">CREATIVE ENGINEER · BANGKOK</SceneLabel>
          <h1>Software<br /><em>Engineer.</em></h1>
          <p>I design and build intelligent products where complex technology feels clear, useful, and quietly powerful.</p>
          <div className="hero-actions">
            <a className="primary-cta" href="#work"><span>Explore selected work</span><Arrow down /></a>
            <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank">Résumé <Arrow /></a>
          </div>
          <dl className="hero-facts">
            <div><dt>Focus</dt><dd>AI products</dd></div>
            <div><dt>Craft</dt><dd>Full stack</dd></div>
            <div><dt>Base</dt><dd>Bangkok · TH</dd></div>
          </dl>
        </div>

        <div className="world-note reveal reveal--late" aria-hidden="true">
          <span>ATELIER / 01</span>
          <b>Systems in motion</b>
          <i>Scroll drives the camera</i>
        </div>
        <p className="scroll-cue">SCROLL TO BEGIN <span>↓</span></p>
      </section>

      <section id="approach" className="scene about-scene">
        <div className="about-heading reveal">
          <SceneLabel index="02">THE PRACTICE / FULL SYSTEM VIEW</SceneLabel>
          <h2>Clarity in<br />every <em>layer.</em></h2>
        </div>
        <div className="about-copy reveal reveal--late">
          <p className="about-lead">I turn complex problems into calm, useful software—balancing rigorous engineering with a sharp eye for how a product should <em>feel.</em></p>
          <p>I&apos;m Visal, a full-stack engineer working across intelligent interfaces, reliable backends, and AI-powered automation. I care about the details users notice and the architecture they never have to.</p>
          <dl>
            <div><dt>Principle</dt><dd>Less, but better</dd></div>
            <div><dt>Approach</dt><dd>Product thinking · Engineering depth</dd></div>
          </dl>
        </div>
      </section>

      <section id="stack" className="scene technology-scene">
        <TechnologyEcosystem />
      </section>

      <section id="work" className="scene work-scene">
        <div className="work-intro reveal">
          <SceneLabel index="04">SELECTED SYSTEMS / 2023—2026</SceneLabel>
          <h2>Work with<br /><em>purpose.</em></h2>
          <p>Selected work spanning intelligent products, operational software, and cloud platforms.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card reveal" key={project.number}>
              <div className={`project-visual project-visual--${project.visual}`} aria-hidden="true">
                <div className="visual-top"><span>{project.category}</span><span>/{project.number}</span></div>
                <div className="system-map"><i /><i /><i /><i /><b>{project.title.split(" ")[0]}</b><span /><span /><span /></div>
                <span className="visual-caption">SYSTEM VIEW · {project.number}</span>
              </div>
              <div className="project-copy">
                <span className="project-index">CASE {project.number}</span>
                <h3>{project.title}</h3>
                <p className="project-statement">{project.statement}</p>
                <p>{project.description}</p>
                <dl>
                  <div><dt>Contribution</dt><dd>{project.contribution}</dd></div>
                  <div><dt>Outcome</dt><dd>{project.outcome}</dd></div>
                </dl>
                <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
        <a className="work-link" href={GITHUB_URL} target="_blank" rel="noreferrer"><span>Explore the code archive</span><Arrow /></a>
      </section>

      <section id="experience" className="scene experience-scene">
        <div className="experience-heading reveal">
          <SceneLabel index="05">EXPERIENCE / MILESTONES</SceneLabel>
          <h2>A path of<br /><em>making.</em></h2>
          <a className="text-link" href="/visal_suwanarat_cv.pdf" target="_blank">Download résumé <Arrow down /></a>
        </div>
        <div className="timeline reveal reveal--late">
          {experience.map(([date, role, company, description], index) => (
            <article className="timeline-item" key={`${date}-${role}`}>
              <span className="timeline-number">0{index + 1}</span>
              <time>{date}</time>
              <div><h3>{role}</h3><span>{company}</span><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="scene contact-scene">
        <div className="contact-copy reveal">
          <SceneLabel index="06">THE NEXT CHAPTER</SceneLabel>
          <p className="contact-kicker">HAVE A COMPLEX IDEA?</p>
          <h2>Let&apos;s build<br /><em>something</em> together.</h2>
          <a className="primary-cta primary-cta--light" href="mailto:yobicod.4u@gmail.com"><span>Start a conversation</span><Arrow /></a>
        </div>
        <footer>
          <div><span>VISAL SUWANARAT © 2026</span><span>DESIGNED &amp; ENGINEERED WITH INTENT</span></div>
          <nav aria-label="Social links"><a href={GITHUB_URL} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="#hero">BACK TO TOP ↑</a></nav>
        </footer>
      </section>
    </main>
  );
}
