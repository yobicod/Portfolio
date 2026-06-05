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
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 border-b border-white/[0.03] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent)]" />

        <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-3 sm:px-6 md:grid md:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] md:gap-x-8 md:py-0 lg:px-10">
          <div className="md:sticky md:top-0 md:flex md:h-screen md:items-start md:py-6">
            <Hero />
          </div>
          <div className="flex min-h-0 flex-1 flex-col pb-4 md:h-screen md:py-8">
            <Chatbox />
          </div>
        </main>
      </div>
    </TopicProvider>
  );
}
