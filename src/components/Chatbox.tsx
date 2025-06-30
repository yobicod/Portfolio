"use client";
import React, { useState, useRef, useEffect } from "react";
import { Chip, Stack, TextField, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { QUICK_REPLY } from "@/const/quickReply";
import { botService } from "@/services/bot.service";

type Message = {
  role: "user" | "bot";
  text: string;
};

const Chatbox = () => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const streamTextResponse = (text: string) => {
    let index = 0;
    const speeds = [300, 400];
    const random = Math.floor(Math.random() * speeds.length);
    const interval = setInterval(() => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.role !== "bot") {
          // Start streaming with empty string
          return [...prev, { role: "bot", text: text.charAt(0) }];
        }

        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...last,
          text: last.text + text.charAt(index),
        };
        return newMessages;
      });

      index++;
      if (index >= text.length) clearInterval(interval);
    }, random); // speed (ms per char)
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    // Fake response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "This is a demo response." },
      ]);
    }, 500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log(input);
    if (!input.trim()) return;

    const whileListInput = QUICK_REPLY.map((chip) =>
      chip.label.trim().toLowerCase()
    );

    if (whileListInput.includes(input.toLowerCase())) {
      setMessages((prev) => [...prev, { role: "user", text: input }]);
      const answer = botService.answer(input);
      setInput("");

      setTimeout(() => {
        if (Array.isArray(answer)) {
          answer.forEach((item, idx) => {
            setTimeout(() => {
              setMessages((prev) => [...prev, { role: "bot", text: item }]);
            }, idx * 500); // slight stagger for each
          });
        } else {
          streamTextResponse(answer); // ✨ streaming effect here
        }
      }, 500);
    }
  }, [input]);

  if (!mounted) return null;

  return (
    <section className="w-full max-w-xl mx-auto mt-8">
      {/* Quick Prompts */}
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        justifyContent="center"
        className="mb-4"
      >
        {QUICK_REPLY.map((chip, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Chip
              label={chip.label}
              color={chip.color}
              clickable
              onClick={() => setInput(chip.label)}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            />
          </motion.div>
        ))}
      </Stack>

      {/* Chat Container */}
      <Paper className="rounded-xl p-4 bg-red-50">
        {/* Chat Scroll Area */}
        <div className="h-64 overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-100 rounded-md"
            InputProps={{
              sx: { borderRadius: "12px", paddingX: 1 },
            }}
          />
        </form>
      </Paper>
    </section>
  );
};

export default Chatbox;
