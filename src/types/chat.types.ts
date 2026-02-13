/**
 * Chat-related type definitions
 */

export type MessageRole = "user" | "bot";

export interface Message {
  role: MessageRole;
  text: string;
}

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
