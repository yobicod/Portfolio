"use client";

import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import { useTranslation } from "@/i18n/I18nProvider";

const portraits = ["/dev_smile.png", "/dev_thinking.png", "/dev_u_got_it.png"];
const destinations = ["gen-ai-knowledge-system", "operations-platform", "cloud-maintenance-suite"];

/** Three tiles, one per layer of the work, each linked to its case study. */
export default function BuilderDesk() {
  const { t } = useTranslation();

  return (
    <nav className="modes" aria-label={t.desk.choose}>
      {t.desk.modes.map((mode, index) => (
        <MotionReveal key={mode.file} delay={index * 0.1}>
          <a className="mode" href={`#${destinations[index]}`}>
            <small>{mode.file}</small>
            <h2>{mode.name}</h2>
            <p>{mode.description}</p>
            <span className="link-arrow">{t.desk.explore}</span>
            <Image src={portraits[index]} alt="" width={256} height={256} sizes="160px" />
          </a>
        </MotionReveal>
      ))}
    </nav>
  );
}
