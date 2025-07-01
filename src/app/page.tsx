"use client";
import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";
import SplashCursor from "../components/SplashCursor";

export default function Home() {
  return (
    <TopicProvider>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <SplashCursor />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
          <Hero />
          <Chatbox />
        </div>
      </div>
    </TopicProvider>
  );
}
