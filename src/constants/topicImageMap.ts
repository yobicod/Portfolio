/**
 * Maps topic strings to corresponding avatar images
 * Used by Hero component to display contextual images
 */

export const TOPIC_IMAGE_MAP: Record<string, string> = {
  "": "/dev_smile.png",
  "About me": "/dev_smile.png",
  Experience: "/dev_interest.png",
  Project: "/dev_two_fingers.png",
  Contact: "/dev_u_got_it.png",
  "Tech stack": "/coding.png",
} as const;

export const DEFAULT_IMAGE = "/coding.png";
export const TYPING_IMAGE = "/dev_thinking.png";

/**
 * Get the appropriate image based on topic and typing state
 */
export const getTopicImage = (topic: string, isTyping: boolean): string => {
  if (isTyping) return TYPING_IMAGE;
  return TOPIC_IMAGE_MAP[topic] ?? DEFAULT_IMAGE;
};
