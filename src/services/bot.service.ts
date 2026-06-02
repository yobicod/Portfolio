import {
  ABOUT_ME_ANSWER,
  CONTACT_ITEMS,
  EXPERIENCE_TIMELINE,
  TECH_STACK_CATEGORIES,
} from "@/constants/answer";
import type {
  RichBotResponse,
  TimelineMessage,
  ContactMessage,
  TechStackMessage,
  CelebrateMessage,
} from "@/types/chat.types";

/** Error message shown when bot fails to respond */
const ERROR_MESSAGE = "Sorry I can't answer now 😢";

/** Default response for unrecognized inputs */
const DEFAULT_RESPONSE = `She'd take the world off my shoulders
If it was ever hard to move
She'd turn the rain to a rainbow
When I was living in the blue
Why then, if she's so perfect
Do I still wish that it was you?
Perfect don't mean that it's workin'
So what can I do? (Ooh)
`;

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

/** Mapping of topics to their responses */
const TOPIC_RESPONSES: Record<string, RichBotResponse> = {
  "About me": ABOUT_ME_ANSWER,
  Experience: EXPERIENCE_RESPONSE,
  Contact: CONTACT_RESPONSE,
  Project: "Project information, Coming soon...",
  "Tech stack": TECH_STACK_RESPONSE,
};

/**
 * Handles bot responses based on user message
 * @param message - User's input message
 * @returns Bot response (rich structured or plain string)
 */
const handleBotAnswer = (message: string): RichBotResponse => {
  try {
    const lower = message.toLowerCase();
    if (lower.includes("celebrate") || lower.includes("congrats")) {
      return CELEBRATE_RESPONSE;
    }
    return TOPIC_RESPONSES[message] ?? DEFAULT_RESPONSE;
  } catch {
    return ERROR_MESSAGE;
  }
};

export const botService = {
  answer: handleBotAnswer,
};
