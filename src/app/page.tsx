"use client";
import Chatbox from "@/components/Chatbox";
import CursorBox from "@/components/CursorBox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";

export default function Home() {
  return (
    <TopicProvider>
      <div className="relative min-h-screen w-full overflow-hidden">
        <CursorBox />
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
          <Hero />
          <Chatbox />
        </div>
      </div>
    </TopicProvider>
  );
}
