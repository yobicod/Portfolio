import type { QuickReplyItem } from "@/types/chat.types";

export const QUICK_REPLY: readonly QuickReplyItem[] = [
  { label: "About me", color: "primary" },
  { label: "Experience", color: "secondary" },
  { label: "Project", color: "success" },
  { label: "Contact", color: "info" },
  { label: "Tech stack", color: "warning" },
] as const;
