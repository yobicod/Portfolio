import {
  ABOUT_ME_ANSWER,
  CONTACT_ITEMS,
  EXPERIENCE_TIMELINE,
  TECH_STACK_CATEGORIES,
} from "@/constants/answer";
import type {
  CelebrateMessage,
  ContactMessage,
  RichBotResponse,
  TechStackMessage,
  TimelineMessage,
} from "@/types/chat.types";

const ERROR_MESSAGE = "Sorry, I can’t answer right now. Please try again.";
const DEFAULT_RESPONSE =
  "I’m best at answering questions about Visal’s experience, projects, tools, and background. Try one of the conversation topics — or reach out directly for anything more specific.";

const EXPERIENCE_RESPONSE: TimelineMessage = {
  role: "bot",
  type: "timeline",
  entries: EXPERIENCE_TIMELINE,
};

const CONTACT_RESPONSE: ContactMessage = {
  role: "bot",
  type: "contact",
  entries: CONTACT_ITEMS,
};

const TECH_STACK_RESPONSE: TechStackMessage = {
  role: "bot",
  type: "tech-stack",
  entries: TECH_STACK_CATEGORIES,
};

const CELEBRATE_RESPONSE: CelebrateMessage = {
  role: "bot",
  type: "celebrate",
};

const TOPIC_RESPONSES: Record<string, RichBotResponse> = {
  "About me": ABOUT_ME_ANSWER,
  Experience: EXPERIENCE_RESPONSE,
  Contact: CONTACT_RESPONSE,
  Project:
    "My public project archive is being curated. In the meantime, ask about my experience or tech stack — they show the kinds of systems I enjoy building.",
  "Tech stack": TECH_STACK_RESPONSE,
};

const handleBotAnswer = (message: string): RichBotResponse => {
  try {
    const normalized = message.trim();
    const lower = normalized.toLowerCase();

    if (lower.includes("celebrate") || lower.includes("congrats")) {
      return CELEBRATE_RESPONSE;
    }

    const matchedTopic = Object.keys(TOPIC_RESPONSES).find(
      (topic) => topic.toLowerCase() === lower,
    );
    return matchedTopic ? TOPIC_RESPONSES[matchedTopic] : DEFAULT_RESPONSE;
  } catch {
    return ERROR_MESSAGE;
  }
};

export const botService = {
  answer: handleBotAnswer,
};
