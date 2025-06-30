import Chatbox from "@/components/Chatbox";
import Hero from "@/components/Hero";
import Button from "@mui/material/Button";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen flex  flex-col items-center justify-center">
      <Hero />
      <Chatbox />
    </div>
  );
}
