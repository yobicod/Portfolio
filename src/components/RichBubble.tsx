import React from "react";
import type {
  RichMessage,
  TimelineEntry,
  ContactEntry,
  TechCategory,
  TechItem,
} from "@/types/chat.types";

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="border-l-2 border-[var(--color-brand)] pl-3 py-1">
      <span className="inline-block text-xs font-mono bg-[rgba(70,233,255,0.1)] text-[var(--color-brand)] border border-[rgba(70,233,255,0.28)] rounded-full px-2 py-0.5 mb-1.5">
        {entry.dateRange}
      </span>
      <div className="text-sm font-semibold text-[var(--foreground)] leading-tight">
        {entry.role}
        <span className="text-[var(--foreground-muted)] font-normal">
          {" "}
          — {entry.company}
        </span>
      </div>
      <ul className="mt-1.5 space-y-1">
        {entry.bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-xs text-[var(--foreground-muted)] leading-relaxed flex gap-2"
          >
            <span className="text-[var(--color-brand)] mt-0.5 shrink-0">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ entry }: { entry: ContactEntry }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
      <span className="text-base">{entry.icon}</span>
      <span>{entry.value}</span>
    </div>
  );
}

function TechStackSection({
  category,
  index,
}: {
  category: TechCategory;
  index: number;
}) {
  const isBrand = index % 2 === 0;
  const accentColor = isBrand ? "var(--color-brand)" : "var(--color-signal)";
  const bgClass = isBrand
    ? "bg-[rgba(70,233,255,0.08)] border-[rgba(70,233,255,0.3)] text-[var(--color-brand)]"
    : "bg-[rgba(183,255,90,0.08)] border-[rgba(183,255,90,0.3)] text-[var(--color-signal)]";

  return (
    <div>
      <p
        className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: accentColor }}
      >
        {category.label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {category.items.map((item: TechItem) => (
          <span
            key={item.name}
            className={`inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded-full border ${bgClass} leading-tight`}
          >
            {item.icon && (
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 shrink-0 mr-1"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={item.icon} />
              </svg>
            )}
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RichBubble({ message }: { message: RichMessage }) {
  if (message.type === "text") return null;

  // Typing indicator — rendered outside the standard bubble wrapper
  if (message.type === "typing") {
    return (
      <div className="rounded-2xl px-4 py-3 border border-[rgba(147,167,202,0.28)] bg-[rgba(8,16,31,0.9)]">
        <div className="flex gap-1 items-center h-4">
          <span className="dot-pulse" style={{ animationDelay: "0ms" }} />
          <span className="dot-pulse" style={{ animationDelay: "160ms" }} />
          <span className="dot-pulse" style={{ animationDelay: "320ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl px-4 py-3 max-w-[90%] sm:max-w-[80%] border border-[rgba(147,167,202,0.28)] bg-[rgba(8,16,31,0.9)] text-[var(--foreground)]">
      {message.type === "timeline" && (
        <div className="space-y-4">
          {message.entries.map((entry, i) => (
            <TimelineCard key={i} entry={entry} />
          ))}
        </div>
      )}
      {message.type === "contact" && (
        <div className="space-y-2">
          {message.entries.map((entry, i) => (
            <ContactRow key={i} entry={entry} />
          ))}
        </div>
      )}
      {message.type === "tech-stack" && (
        <div className="space-y-4">
          {message.entries.map((category, i) => (
            <TechStackSection
              key={category.label}
              category={category}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
