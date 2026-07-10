import type { ContactEntry, RichMessage, TechCategory, TimelineEntry } from "@/types/chat.types";

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  return (
    <article className="timeline-card">
      <span className="timeline-date">{entry.dateRange}</span>
      <div className="timeline-title">
        {entry.role} <span className="timeline-company">— {entry.company}</span>
      </div>
      <ul>{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
    </article>
  );
}

function ContactRow({ entry }: { entry: ContactEntry }) {
  return <div className="contact-row"><span aria-hidden="true">{entry.icon}</span><span>{entry.value}</span></div>;
}

function TechSection({ category }: { category: TechCategory }) {
  return (
    <div>
      <h3 className="tech-title">{category.label}</h3>
      <div className="tech-items">
        {category.items.map((item) => (
          <span className="tech-pill" key={item.name}>
            {item.icon && <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={item.icon} /></svg>}
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RichBubble({ message }: { message: RichMessage }) {
  if (message.type === "text" || message.type === "typing" || message.type === "celebrate") return null;

  return (
    <div className="rich-bubble">
      {message.type === "timeline" && <div className="timeline-list">{message.entries.map((entry) => <TimelineCard key={`${entry.company}-${entry.dateRange}`} entry={entry} />)}</div>}
      {message.type === "contact" && <div className="contact-list">{message.entries.map((entry) => <ContactRow key={entry.value} entry={entry} />)}</div>}
      {message.type === "tech-stack" && <div className="tech-list">{message.entries.map((category) => <TechSection key={category.label} category={category} />)}</div>}
    </div>
  );
}
