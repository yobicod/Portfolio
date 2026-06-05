import type { QuickReplyItem } from "@/types/chat.types";

export const QUICK_REPLY: readonly QuickReplyItem[] = [
  { label: "Contact", color: "info" },
  { label: "Experience", color: "secondary" },
  { label: "Project", color: "success" },
  { label: "About me", color: "primary" },
  { label: "Tech stack", color: "warning" },
] as const;
