"use client";
import Chatbox from "@/components/Chatbox";
import CursorBox from "@/components/CursorBox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";

export default function Home() {
  return (
    <TopicProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <CursorBox />
        {/* Mobile: flex-col stack. Desktop (md+): two-column grid */}
        <div className="relative z-20 mx-auto flex flex-col md:grid md:grid-cols-[38%_1fr] md:gap-x-6 min-h-screen max-w-6xl px-4 sm:px-6 lg:px-10">
          {/* Left column — sticky on desktop */}
          <div className="md:sticky md:top-0 md:h-screen md:flex md:items-center py-4 md:py-0">
            <Hero />
          </div>
          {/* Right column — chat fills viewport height */}
          <div className="flex flex-col flex-1 md:h-screen md:py-6 pb-6">
            <Chatbox />
          </div>
        </div>
      </div>
    </TopicProvider>
  );
}
