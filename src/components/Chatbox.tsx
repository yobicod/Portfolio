"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
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
    <section className="flex min-h-0 w-full flex-1 flex-col">
      {isCelebrate && <Celebrate />}

      <Paper
        className="ai-panel flex min-h-0 flex-1 flex-col p-3 sm:p-5"
        sx={{
          backgroundImage:
            "linear-gradient(160deg, rgba(16, 29, 48, 0.84), rgba(7, 13, 24, 0.97))",
        }}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/[0.07] pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(70,233,255,0.28)] bg-[rgba(70,233,255,0.09)] text-sm font-semibold text-[var(--brand)] shadow-[0_0_24px_rgba(70,233,255,0.14)]">
              VS
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-[var(--foreground)]">
                Visal&apos;s Portfolio Bot
              </p>
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Interactive profile
              </p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            disabled={isDisableInput}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.09] bg-white/[0.045] px-3 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[rgba(70,233,255,0.5)] hover:text-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
            New chat
          </button>
        </div>

        <div className="chat-scroll min-h-[240px] flex-1 space-y-3 overflow-y-auto pr-1 sm:pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "typing" ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(8,16,31,0.86)] px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
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
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-[0_10px_24px_rgba(0,0,0,0.18)] sm:max-w-[76%] ${
                    msg.role === "user"
                      ? "bg-[linear-gradient(135deg,#20b7c7,#256a91)] text-[#f7fdff]"
                      : "border border-white/[0.08] bg-[rgba(8,16,31,0.86)] text-[var(--foreground)]"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-scroll mt-3 flex shrink-0 gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible">
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
                  borderColor: "rgba(70, 233, 255, 0.34)",
                  backgroundColor: "rgba(255, 255, 255, 0.045)",
                  backdropFilter: "blur(14px)",
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex shrink-0 gap-2 sm:gap-3"
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
                backgroundColor: "rgba(255, 255, 255, 0.055)",
                color: "var(--color-foreground)",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
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
              minWidth: { xs: "48px", sm: "104px" },
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
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </Paper>
    </section>
  );
});

export default Chatbox;
