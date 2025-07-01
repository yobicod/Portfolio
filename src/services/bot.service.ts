import { ABOUT_ME_ANSWER, CONTACT_LIST, EXPERIENCE_LIST } from "@/const/answer";

const handleBotAnswer = (message: string): string | string[] => {
  console.log("🚀 ~ handleBotAnswer ~ message:", message);
  try {
    if (message === "About me") {
      return ABOUT_ME_ANSWER;
    }

    if (message === "Experience") {
      return EXPERIENCE_LIST;
    }

    if (message === "Contact") {
      return CONTACT_LIST;
    }

    if (message === "Project") {
      return "Project information, Coming soon...";
    }

    if (message === "Tech stack") {
      return "Tech stack information, Coming soon...";
    }

    // Handle gen ai response here
    return "Generative AI🤖 response coming soon~";
  } catch (err) {
    console.log(err);
    return "Sorry I can't answer now 😢";
  }
};

export const botService = {
  answer: handleBotAnswer,
};
