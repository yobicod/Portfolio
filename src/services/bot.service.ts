import {
  ABOUT_ME_ANSWER,
  CONTACT_LIST,
  EXPERIENCE_LIST,
} from "@/constants/answer";

/** Response type that can be a single message or array of messages */
export type BotResponse = string | string[];

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

/** Mapping of topics to their responses */
const TOPIC_RESPONSES: Record<string, BotResponse> = {
  "About me": ABOUT_ME_ANSWER,
  Experience: [...EXPERIENCE_LIST],
  Contact: [...CONTACT_LIST],
  Project: "Project information, Coming soon...",
  "Tech stack": "Tech stack information, Coming soon...",
};

/**
 * Handles bot responses based on user message
 * @param message - User's input message
 * @returns Bot response as single string or array of strings
 */
const handleBotAnswer = (message: string): BotResponse => {
  try {
    return TOPIC_RESPONSES[message] ?? DEFAULT_RESPONSE;
  } catch {
    return ERROR_MESSAGE;
  }
};

export const botService = {
  answer: handleBotAnswer,
};
