"use client";

import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";

export default function Home() {
  return (
    <TopicProvider>
      <main className="portfolio-shell">
        <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
        <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Visal Suwanarat, home">
            <span>VS</span>
            <span className="wordmark__name">VISAL SUWANARAT</span>
          </a>
          <div className="site-header__meta">
            <span className="availability-dot" aria-hidden="true" />
            <span>Bangkok · Available for ambitious work</span>
          </div>
        </header>

        <div id="top" className="portfolio-grid">
          <Hero />
          <Chatbox />
        </div>

        <footer className="site-footer">
          <span>FULL-STACK × AI</span>
          <span className="site-footer__line" aria-hidden="true" />
          <span>SELECTED INTERFACE / 2026</span>
        </footer>
      </main>
    </TopicProvider>
  );
}
