"use client";
import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";
import { TopicProvider } from "@/context/TopicContext";
import SplashCursor from "../components/SplashCursor";
// import TextCursor from "../components/TextCursor";
export default function Home() {
  return (
    <TopicProvider>
      <div className="min-h-screen flex  flex-col items-center justify-center">
        <SplashCursor />
        {/* <TextCursor
          text="Hello!"
          delay={0.01}
          spacing={80}
          followMouseDirection={true}
          randomFloat={true}
          exitDuration={0.3}
          removalInterval={20}
          maxPoints={10}
        /> */}
        <Hero />
        <Chatbox />
      </div>
    </TopicProvider>
  );
}
