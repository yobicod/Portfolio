"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type TopicContextType = {
  topic: string;
  setTopic: (topic: string) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
};

const TopicContext = createContext<TopicContextType | undefined>(undefined); // Create context

export const useTopic = () => {
  const context = useContext(TopicContext);
  if (!context) throw new Error("useTopic must be used within a TopicProvider");
  return context;
};

export const TopicProvider = ({ children }: { children: ReactNode }) => {
  const [topic, setTopic] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const ctxValue = {
    topic,
    setTopic,
    isTyping,
    setIsTyping,
  };

  return (
    <TopicContext.Provider value={ctxValue}>{children}</TopicContext.Provider>
  );
};
