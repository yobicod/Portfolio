"use client";
import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";

import {
  Chip,
  Stack,
  TextField,
  Paper,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { QUICK_REPLY } from "@/const/quickReply";
import { TypeAnimation } from "react-type-animation";
import { botService } from "@/services/bot.service";
import { motion } from "framer-motion";
import { GREETING_MESSAGE, TYPING_ON } from "@/const/answer";
import { useTopic } from "@/context/TopicContext";
type Message = {
  role: "user" | "bot";
  text: string;
};

const Chatbox = () => {
  const { setTopic, setIsTyping } = useTopic(); // topic context
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: GREETING_MESSAGE },
  ]);

  const [mounted, setMounted] = useState(false);
  const [isClickQuickReply, setIsClickQuickReply] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isDisableInput, setIsDisableInput] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const streamTextResponse = (text: string) => {
    let index = 0;
    const speed = 30 + Math.random() * 70; // smoother typing (30-100ms)

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.role !== "bot") {
        // Start with empty message
        return [...prev, { role: "bot", text: "" }];
      }
      return prev;
    });

    const interval = setInterval(() => {
      // Character to add at this step
      const char = text[index];

      if (!char) {
        clearInterval(interval);
        setIsDisableInput(false);
        setIsTyping(false);
        return;
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...last,
          text: last.text + char,
        };
        return newMessages;
      });

      index++;
    }, speed);
  };

  const handleSend = () => {
    setIsDisableInput(true);
    setIsTyping(true);

    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);

    setInput("");

    // Fake response
    setTimeout(() => {
      const answer = botService.answer(input);

      if (Array.isArray(answer)) {
        answer.forEach((item, idx) => {
          setTimeout(() => {
            setMessages((prev) => [...prev, { role: "bot", text: item }]);

            // ✅ Only enable input after the LAST item is sent
            if (idx === answer.length - 1) {
              setIsDisableInput(false);
              setIsTyping(false);
              setIsClickQuickReply(false);
            }
          }, idx * 500); // delay per message
        });
      } else {
        streamTextResponse(answer); // this will re-enable input when done
      }
      setIsClickQuickReply(false);
      setIsDisableInput(false);
      setIsTyping(false);
    }, 5000);
  };

  const handleRefresh = () => {
    if (!isDisableInput) {
      setMessages([{ role: "bot", text: GREETING_MESSAGE }]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!input.trim()) return;

    const whileListInput = QUICK_REPLY.map((chip) =>
      chip.label.trim().toLowerCase()
    );

    if (whileListInput.includes(input.toLowerCase()) && isClickQuickReply) {
      setIsDisableInput(true);
      setIsTyping(true);

      setMessages((prev) => [...prev, { role: "user", text: input }]);
      const answer = botService.answer(input);
      setInput("");

      setTimeout(() => {
        if (Array.isArray(answer)) {
          answer.forEach((item, idx) => {
            setTimeout(() => {
              setMessages((prev) => [...prev, { role: "bot", text: item }]);

              // ✅ Only enable input after the LAST item is sent
              if (idx === answer.length - 1) {
                setIsDisableInput(false);
                setIsTyping(false);
                setIsClickQuickReply(false);
              }
            }, idx * 500); // delay per message
          });
        } else {
          streamTextResponse(answer); // this will re-enable input when done
          setIsClickQuickReply(false);
        }
        setIsClickQuickReply(false);
      }, 500);
    }
  }, [input, isClickQuickReply]);

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
              clickable={true}
              disabled={isDisableInput}
              onClick={() => {
                setInput(chip.label);
                setTopic(chip.label);
                setIsClickQuickReply(true);
              }}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            />
          </motion.div>
        ))}
      </Stack>
      {/* Chat Container */}
      <Paper className="rounded-xl p-4 bg-red-50">
        <div className="w-full flex justify-end mb-4">
          <Tooltip title="Refresh Conversation">
            <IconButton onClick={handleRefresh}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </IconButton>
          </Tooltip>
        </div>
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
          className="mt-4 flex items-center gap-4 justify-center"
        >
          {isDisableInput ? (
            <div className="w-full max-w-md bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-600 flex items-center">
              <TypeAnimation
                sequence={TYPING_ON}
                speed={50}
                repeat={Infinity}
              />
            </div>
          ) : (
            <TextField
              size="small"
              placeholder="Type something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-gray-100 rounded-md w-full max-w-md"
              disabled={isDisableInput}
            />
          )}

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            className="py-2 px-6 normal-case"
            onClick={handleSend}
            disabled={isDisableInput}
          >
            Send
          </Button>
        </form>
      </Paper>
    </section>
  );
};

export default Chatbox;
