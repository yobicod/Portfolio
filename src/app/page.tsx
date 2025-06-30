import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex  flex-col items-center justify-center">
      <Hero />
      <Chatbox />
    </div>
  );
}
