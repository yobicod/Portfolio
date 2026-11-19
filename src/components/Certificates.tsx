"use client";

import MotionReveal from "@/components/MotionReveal";
import { useTranslation } from "@/i18n/I18nProvider";

/** Licences and certifications. Cards with a public credential link open it; the newest is featured. */
export default function Certificates() {
  const { t } = useTranslation();
  const c = t.certificates;

  return (
    <>
      <MotionReveal className="section-head container">
        <p className="eyebrow">{c.label}</p>
        <h2 id="certificates-title">{c.title} <em>{c.titleEmphasis}</em></h2>
        <p>{c.description}</p>
      </MotionReveal>
      <ul className="certificate-grid container">
        {c.entries.map((entry, index) => {
          const body = (
            <>
              <span className="certificate-issuer">{entry.issuer}</span>
              <h3>{entry.name}</h3>
              <p className="certificate-dates">
                {c.issued} {entry.issued}{entry.expires && <> · {c.expires} {entry.expires}</>}
              </p>
              {entry.credentialId && <p className="certificate-id">{c.credentialId} <code>{entry.credentialId}</code></p>}
              {entry.url && <span className="link-arrow">{c.view}</span>}
            </>
          );
          return (
            <MotionReveal as="li" className={index === 0 ? "certificate certificate--featured" : "certificate"} key={entry.name} delay={(index % 3) * 0.08}>
              {entry.url
                ? <a className="certificate-card" href={entry.url} target="_blank" rel="noreferrer">{body}</a>
                : <div className="certificate-card">{body}</div>}
            </MotionReveal>
          );
        })}
      </ul>
    </>
  );
}
