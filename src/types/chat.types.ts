/**
 * Chat-related type definitions
 */

export type MessageRole = "user" | "bot";

export type QuickReplyColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "default";

export interface QuickReplyItem {
  label: string;
  color: QuickReplyColor;
}

// ── Rich message content types ──────────────────────────────────────────────

export interface TimelineEntry {
  dateRange: string;
  role: string;
  company: string;
  bullets: string[];
}

export interface ContactEntry {
  icon: string;
  value: string;
}

export interface PlainMessage {
  role: MessageRole;
  type: "text";
  text: string;
}

export interface TimelineMessage {
  role: MessageRole;
  type: "timeline";
  entries: TimelineEntry[];
}

export interface ContactMessage {
  role: MessageRole;
  type: "contact";
  entries: ContactEntry[];
}

export interface TechItem {
  name: string;
  icon?: string;
}

export interface TechCategory {
  label: string;
  items: TechItem[];
}

export interface TechStackMessage {
  role: MessageRole;
  type: "tech-stack";
  entries: TechCategory[];
}

export interface TypingMessage {
  role: MessageRole;
  type: "typing";
}

export interface CelebrateMessage {
  role: MessageRole;
  type: "celebrate";
}

export type RichMessage =
  | PlainMessage
  | TimelineMessage
  | ContactMessage
  | TechStackMessage
  | TypingMessage
  | CelebrateMessage;

export type RichBotResponse = RichMessage | string | string[];
