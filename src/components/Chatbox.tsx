"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Chip, TextField, Paper, Button } from "@mui/material";
import { QUICK_REPLY } from "@/constants/quickReply";
import { botService } from "@/services/bot.service";
import { motion } from "framer-motion";
import { GREETING_MESSAGE } from "@/constants/answer";
import { useTopic } from "@/context/TopicContext";
import type { RichMessage, RichBotResponse } from "@/types/chat.types";
import { RichBubble } from "@/components/RichBubble";
import Celebrate from "@/components/Celebrate";
import { fadeOutSound } from "@/utils/utils";

/** Typing animation speed in ms (lower = faster) */
const TYPING_SPEED_MS = 30;

/** Initial message shown when chat loads */
const INITIAL_MESSAGES: RichMessage[] = [
  { role: "bot", type: "text", text: GREETING_MESSAGE },
];

const Chatbox = memo(function Chatbox() {
  const { setTopic, setIsTyping } = useTopic();
  const [messages, setMessages] = useState<RichMessage[]>(INITIAL_MESSAGES);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [isClickQuickReply, setIsClickQuickReply] = useState(false);
  const [isCelebrate, setIsCelebrate] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingAudioRef = useRef<HTMLAudioElement>(null);

  const triggerCelebrate = useCallback(() => {
    setIsCelebrate(true);
    const lofiAudio = new Audio("/everyone_celebrate_lofi.mp3");
    lofiAudio.currentTime = 0;
    lofiAudio.play();
    fadeOutSound(lofiAudio);
  }, []);

  const playTypingSound = useCallback(() => {
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio("/typing_loop.mp3");
      typingAudioRef.current.loop = true;
    }
    typingAudioRef.current.currentTime = 0;
    typingAudioRef.current.play().catch(() => {
      // Autoplay blocked - silent fail
    });
  }, []);

  const stopTypingSound = useCallback(() => {
    if (typingAudioRef.current) {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
    }
  }, []);

  const stopTyping = useCallback(() => {
    setIsDisableInput(false);
    setIsTyping(false);
    stopTypingSound();
  }, [setIsTyping, stopTypingSound]);

  /** Remove the pending typing bubble before inserting a real response */
  const removeTypingBubble = useCallback(() => {
    setMessages((prev) => {
      const last = prev.at(-1);
      return last?.type === "typing" ? prev.slice(0, -1) : prev;
    });
  }, []);

  const appendBotText = useCallback(
    (text: string) => {
      let index = 0;

      // Replace typing bubble with an empty text message in one update
      setMessages((prev) => {
        const filtered =
          prev.at(-1)?.type === "typing" ? prev.slice(0, -1) : prev;
        return [...filtered, { role: "bot", type: "text" as const, text: "" }];
      });

      const interval = setInterval(() => {
        const char = text[index];
        if (!char) {
          clearInterval(interval);
          stopTyping();
          return;
        }

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.type === "text") {
            updated[updated.length - 1] = { ...last, text: last.text + char };
          }
          return updated;
        });

        index++;
      }, TYPING_SPEED_MS);
    },
    [stopTyping],
  );

  const processBotReply = useCallback(
    (answer: RichBotResponse) => {
      // Rich structured message
      if (typeof answer !== "string" && !Array.isArray(answer)) {
        // Celebrate easter egg
        if (answer.type === "celebrate") {
          removeTypingBubble();
          triggerCelebrate();
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              type: "text" as const,
              text: "Woooo! Here's to more great things ahead!",
            },
          ]);
          stopTyping();
          return;
        }
        removeTypingBubble();
        setMessages((prev) => [...prev, answer]);
        stopTyping();
        return;
      }

      if (Array.isArray(answer)) {
        removeTypingBubble();
        answer.forEach((item, idx) => {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { role: "bot", type: "text" as const, text: item },
            ]);
            if (idx === answer.length - 1) stopTyping();
          }, idx * 1000);
        });
      } else {
        appendBotText(answer);
      }
    },
    [appendBotText, removeTypingBubble, stopTyping, triggerCelebrate],
  );

  const sendMessage = useCallback(
    (value: string) => {
      if (!value.trim()) return;

      setMessages((prev) => [
        ...prev,
        { role: "user", type: "text" as const, text: value },
        { role: "bot", type: "typing" as const },
      ]);
      setInput("");
      setIsDisableInput(true);
      setIsTyping(true);
      playTypingSound();

      const answer = botService.answer(value);

      setTimeout(() => {
        processBotReply(answer);
      }, 500);
    },
    [playTypingSound, processBotReply, setIsTyping],
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleQuickReply = useCallback(
    (label: string) => {
      setInput(label);
      setTopic(label);
      setIsClickQuickReply(true);
    },
    [setTopic],
  );

  const handleNewChat = useCallback(() => {
    if (!isDisableInput) {
      setMessages(INITIAL_MESSAGES);
      setIsCelebrate(false);
    }
  }, [isDisableInput]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (input.trim()) {
      const isWhitelisted = QUICK_REPLY.some(
        (chip) =>
          chip.label.trim().toLowerCase() === input.trim().toLowerCase(),
      );
      if (isWhitelisted && isClickQuickReply) {
        sendMessage(input);
        setIsClickQuickReply(false);
      }
    }
  }, [input, isClickQuickReply, sendMessage]);

  if (!mounted) return null;

  return (
    <section className="flex flex-col flex-1 min-h-0 w-full">
      {isCelebrate && <Celebrate />}

      <Paper
        className="ai-panel flex flex-col flex-1 min-h-0 p-4 sm:p-5"
        sx={{
          backgroundImage:
            "linear-gradient(160deg, rgba(14, 28, 49, 0.82), rgba(8, 15, 28, 0.95))",
        }}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(124,211,255,0.14)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-brand)] shadow-[0_0_6px_var(--color-brand)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] tracking-wide">
              Visal&apos;s Bot
            </span>
          </div>
          <button
            onClick={handleNewChat}
            disabled={isDisableInput}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(147,167,202,0.3)] bg-[rgba(6,12,24,0.65)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M20 20v-5h-.581m0 0A7.963 7.963 0 0112 20a7.963 7.963 0 01-7.419-5H4m16-6a7.963 7.963 0 00-7.419-5A7.963 7.963 0 004 9h.581"
              />
            </svg>
            New chat
          </button>
        </div>

        {/* Quick replies — prioritized actions shown before long chat content */}
        <div className="mb-3 shrink-0 flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible">
          {QUICK_REPLY.map((chip, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
              className="shrink-0"
            >
              <Chip
                label={chip.label}
                variant="outlined"
                clickable
                disabled={isDisableInput}
                onClick={() => handleQuickReply(chip.label)}
                sx={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-brand)",
                  borderColor: "rgba(70, 233, 255, 0.42)",
                  backgroundColor: "rgba(8, 16, 31, 0.55)",
                  "&:hover": {
                    borderColor: "var(--color-brand)",
                    backgroundColor: "rgba(17, 207, 231, 0.18)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(147, 167, 202, 0.58)",
                    borderColor: "rgba(147, 167, 202, 0.25)",
                  },
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Chat scroll area — follows the prioritized quick actions */}
        <div className="flex-1 min-h-[200px] overflow-y-auto space-y-3 pr-1">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "typing" ? (
                <div className="rounded-2xl px-4 py-3 border border-[rgba(147,167,202,0.28)] bg-[rgba(8,16,31,0.9)]">
                  <div className="flex gap-1 items-center h-4">
                    <span className="dot-pulse" style={{ animationDelay: "0ms" }} />
                    <span className="dot-pulse" style={{ animationDelay: "160ms" }} />
                    <span className="dot-pulse" style={{ animationDelay: "320ms" }} />
                  </div>
                </div>
              ) : msg.type !== "text" ? (
                <RichBubble message={msg} />
              ) : (
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[linear-gradient(120deg,#1a8d9c,#0f4f73)] text-[#f2fbff] shadow-[0_8px_22px_rgba(6,18,40,0.42)]"
                      : "border border-[rgba(147,167,202,0.28)] bg-[rgba(8,16,31,0.9)] text-[var(--foreground)]"
                  }`}
                >
                  {msg.text}
                </div>
              )}
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
          className="mt-3 shrink-0 flex gap-2 sm:gap-3"
        >
          <TextField
            size="small"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDisableInput}
            className="flex-1"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.85rem",
                backgroundColor: "rgba(10, 20, 36, 0.86)",
                color: "var(--color-foreground)",
                "& fieldset": {
                  borderColor: "rgba(147, 167, 202, 0.32)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(70, 233, 255, 0.52)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-brand)",
                },
                "&.Mui-disabled": { opacity: 0.5 },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(147, 167, 202, 0.88)",
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isDisableInput}
            sx={{
              minHeight: "40px",
              minWidth: "100px",
              borderRadius: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#062031",
              backgroundImage:
                "linear-gradient(120deg, var(--color-brand), var(--color-signal))",
              boxShadow: "var(--shadow-glow)",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(120deg, var(--color-brand-strong), var(--color-signal))",
              },
            }}
          >
            Send
          </Button>
        </form>
      </Paper>
    </section>
  );
});

export default Chatbox;
