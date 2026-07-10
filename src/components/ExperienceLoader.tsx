"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/I18nProvider";

/** A short, non-blocking entrance while the visual layer settles. */
export default function ExperienceLoader() {
  const [complete, setComplete] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => setComplete(true);

    if (reducedMotion) {
      finish();
      return;
    }

    const minimumReveal = window.setTimeout(finish, 720);
    const safetyReveal = window.setTimeout(finish, 1800);
    window.addEventListener("load", finish, { once: true });

    return () => {
      window.clearTimeout(minimumReveal);
      window.clearTimeout(safetyReveal);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <div className={complete ? "experience-loader is-complete" : "experience-loader"} aria-hidden="true">
      <div className="experience-loader__mark">V</div>
      <div className="experience-loader__line"><i /></div>
      <p>{t.loader.preparing} <span>01—06</span></p>
    </div>
  );
}
