"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { QUICK_REPLY } from "@/constants/quickReply";
import { botService } from "@/services/bot.service";
import { useTopic } from "@/context/TopicContext";
import type { RichMessage, RichBotResponse } from "@/types/chat.types";
import { RichBubble } from "@/components/RichBubble";
import Celebrate from "@/components/Celebrate";
import { fadeOutSound } from "@/utils/utils";

/** Typing animation speed in ms (lower = faster) */
const TYPING_SPEED_MS = 30;

/** Initial message shown when chat loads */
const INITIAL_MESSAGES: RichMessage[] = [
  {
    role: "bot",
    type: "text",
    text: "Hey — I’m Visal’s digital twin. Pick a topic or ask me about the way I work.",
  },
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
    <section id="conversation" className="conversation-section" aria-labelledby="conversation-title">
      {isCelebrate && <Celebrate />}

      <div className="conversation-intro">
        <h2 id="conversation-title">Don&apos;t scroll.<br /><em>Ask me.</em></h2>
        <p>
          Portfolios are usually one-way conversations. This one isn&apos;t.
          Choose a thread or type a question to explore my work, background,
          and the tools I use to build things.
        </p>
      </div>

      <div className="chat-studio">
        <aside className="chat-sidebar" aria-label="Suggested conversation topics">
          <span className="chat-sidebar__label">CONVERSATION INDEX</span>
          <strong className="chat-sidebar__brand">Ask Visal</strong>
          <div className="chat-sidebar__nav">
            {QUICK_REPLY.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="quick-button"
                disabled={isDisableInput}
                onClick={() => handleQuickReply(chip.label)}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <p className="chat-sidebar__note">
            HUMAN-CURATED RESPONSES<br />NO DATA LEAVES YOUR BROWSER
          </p>
        </aside>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-person">
              <span className="chat-avatar">VS</span>
              <div>
                <strong>Visal&apos;s digital twin</strong>
                <span>ONLINE · USUALLY REPLIES IN 0.5S</span>
              </div>
            </div>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isDisableInput}
            className="reset-button"
          >
            Reset ↻
          </button>
        </div>

        <div className="message-list" aria-live="polite">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row${msg.role === "user" ? " message-row--user" : ""}`}
            >
              {msg.type === "typing" ? (
                <div className="typing-bubble" aria-label="Visal is typing">
                  <span className="dot-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="dot-pulse" style={{ animationDelay: "160ms" }} />
                  <span className="dot-pulse" style={{ animationDelay: "320ms" }} />
                </div>
              ) : msg.type !== "text" ? (
                <RichBubble message={msg} />
              ) : (
                <div className="message-bubble">{msg.text}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-composer"
        >
          <label htmlFor="portfolio-question" className="sr-only">Ask Visal a question</label>
          <input
            id="portfolio-question"
            className="chat-input"
            placeholder="Ask me about my experience..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDisableInput}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isDisableInput}
            aria-label="Send message"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 16 12-12M7 4h9v9" /></svg>
          </button>
        </form>
        </div>
      </div>
    </section>
  );
});

export default Chatbox;
