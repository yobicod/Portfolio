"use client";
import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";
import SplashCursor from "../components/SplashCursor";
export default function Home() {
  return (
    <TopicProvider>
      <div className="min-h-screen flex  flex-col items-center justify-center">
        <SplashCursor />
        <Hero />
        <Chatbox />
      </div>
    </TopicProvider>
  );
}
