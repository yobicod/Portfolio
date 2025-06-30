import { ABOUT_ME_ANSWER, EXPERIENCE_LIST } from "@/const/answer";

const handleBotAnswer = (message: string): string | string[] => {
  console.log("🚀 ~ handleBotAnswer ~ message:", message);
  try {
    if (message === "About me") {
      return ABOUT_ME_ANSWER;
    }

    if (message === "Experience") {
      return EXPERIENCE_LIST;
    }

    return "sssw";
  } catch (err) {
    console.log(err);
    return "Sorry I can't answer now 😢";
  }
};

export const botService = {
  answer: handleBotAnswer,
};
