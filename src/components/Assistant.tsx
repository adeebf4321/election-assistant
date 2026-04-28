/**
 * Assistant component.
 *
 * Renders a real-time chat interface powered by the Google Gemini API
 * (with offline fallback). Users can ask questions about the Indian
 * election process and receive detailed, non-partisan answers.
 * Implements full accessibility with ARIA live regions for dynamic
 * message updates, keyboard navigation, and focus management.
 * When signed in, chat history is persisted to Cloud Firestore
 * and can be emailed via the Gmail API.
 */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, Mail, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { saveChatHistory, loadChatHistory } from "@/lib/firestore";
import { sendChatHistoryEmail } from "@/lib/google-apis";
import { sendMessage } from "@/lib/gemini-client";

/** Represents a single chat message */
interface Message {
  /** The sender of the message */
  role: "user" | "assistant";
  /** The text content of the message */
  content: string;
}

/** The default welcome message shown when starting a new chat */
const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Namaste! I am your Election Process Assistant. I can help you understand voter registration, Form 6, polling rules, and the general election timeline in India. How can I assist you today?",
};

/**
 * Formats message content by converting markdown-style bold
 * syntax (**text**) into HTML <strong> tags.
 */
function formatMessageContent(content: string): string {
  return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

/** Converts messages array into plain text for email */
function formatChatForEmail(messages: Message[]): string {
  return messages
    .map((msg) => {
      const sender = msg.role === "user" ? "You" : "Election AI Assistant";
      const content = msg.content.replace(/\*\*(.*?)\*\*/g, "$1");
      return `[${sender}]\n${content}`;
    })
    .join("\n\n");
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Load chat history from Firestore when user signs in */
  useEffect(() => {
    if (!user?.uid) {
      setHistoryLoaded(false);
      return;
    }

    let cancelled = false;
    loadChatHistory(user.uid).then((saved) => {
      if (cancelled) return;
      if (saved.length > 0) {
        setMessages(saved);
      }
      setHistoryLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  /** Save chat history to Firestore whenever messages change */
  const persistMessages = useCallback(
    (msgs: Message[]) => {
      if (user?.uid && historyLoaded && msgs.length > 1) {
        saveChatHistory(user.uid, msgs);
      }
    },
    [user?.uid, historyLoaded]
  );

  /** Sends the chat history to the user's email via Gmail API */
  const handleEmailChat = useCallback(async () => {
    if (!accessToken || !user?.email) return;
    setEmailStatus("sending");
    try {
      const chatText = formatChatForEmail(messages);
      const success = await sendChatHistoryEmail(accessToken, user.email, chatText);
      setEmailStatus(success ? "sent" : "error");
    } catch {
      setEmailStatus("error");
    }
    // Reset status after 3 seconds
    setTimeout(() => setEmailStatus("idle"), 3000);
  }, [accessToken, user?.email, messages]);

  /** Scrolls the chat window to the latest message */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handles form submission: sends the user's message to the
   * /api/chat endpoint and appends the response to the chat.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reply = await sendMessage(userMessage, messages.slice(1));
      const updatedMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: reply },
      ];
      setMessages(updatedMessages);
      persistMessages(updatedMessages);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessages: Message[] = [
        ...newMessages,
        {
          role: "assistant",
          content:
            "I encountered a network issue. Please check your internet connection and try again.",
        },
      ];
      setMessages(errorMessages);
      persistMessages(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="assistant"
      className="py-20 bg-[#0A192F] relative overflow-hidden"
      aria-labelledby="assistant-heading"
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2
            id="assistant-heading"
            className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
          >
            Smart Voter Assistant
          </h2>
          <p className="text-gray-400 text-lg">
            Have specific questions about your voting status or the election
            process? Ask below.
          </p>
        </div>

        <div
          className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[600px] border border-white/20 shadow-2xl"
          role="region"
          aria-label="Election assistant chat"
        >
          {/* Chat Header */}
          <div className="bg-[#112240] p-4 border-b border-white/10 flex items-center gap-3">
            <div
              className="bg-[#138808]/20 p-2 rounded-full"
              aria-hidden="true"
            >
              <Bot className="h-6 w-6 text-[#138808]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">Election AI Assistant</h3>
              <p className="text-xs text-[#138808] flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"
                  aria-hidden="true"
                />
                <span>Online</span>
              </p>
            </div>
            {/* Email Chat Button — visible when signed in */}
            {user && accessToken && messages.length > 1 && (
              <button
                onClick={handleEmailChat}
                disabled={emailStatus === "sending"}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] disabled:opacity-50"
                style={{
                  borderColor:
                    emailStatus === "sent"
                      ? "#138808"
                      : emailStatus === "error"
                      ? "#ef4444"
                      : "rgba(255,255,255,0.2)",
                  color:
                    emailStatus === "sent"
                      ? "#138808"
                      : emailStatus === "error"
                      ? "#ef4444"
                      : "#9ca3af",
                }}
                aria-label="Email chat history to yourself"
              >
                {emailStatus === "sending" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                )}
                {emailStatus === "sent" && (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {emailStatus === "error" && (
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {emailStatus === "idle" && (
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>
                  {emailStatus === "sending"
                    ? "Sending..."
                    : emailStatus === "sent"
                    ? "Sent!"
                    : emailStatus === "error"
                    ? "Failed"
                    : "Email Chat"}
                </span>
              </button>
            )}
            {user && !accessToken && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF9933]" aria-hidden="true" />
                Chat synced
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-full bg-[#112240] border border-white/10 flex items-center justify-center shrink-0 mt-1"
                    aria-hidden="true"
                  >
                    <Bot className="h-4 w-4 text-gray-300" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#138808] to-[#0e6306] text-white rounded-tr-sm"
                      : "bg-[#112240] text-gray-200 border border-white/5 rounded-tl-sm"
                  }`}
                >
                  <p
                    className="leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(msg.content),
                    }}
                  />
                </div>

                {msg.role === "user" && (
                  <div
                    className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center shrink-0 mt-1"
                    aria-hidden="true"
                  >
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                className="flex gap-4 justify-start"
                role="status"
                aria-label="Assistant is typing"
              >
                <div
                  className="w-8 h-8 rounded-full bg-[#112240] border border-white/10 flex items-center justify-center shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <Bot className="h-4 w-4 text-gray-300" />
                </div>
                <div className="bg-[#112240] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <Loader2
                    className="h-5 w-5 text-[#138808] animate-spin"
                    aria-hidden="true"
                  />
                  <span className="text-gray-400 text-sm">
                    Searching election guidelines...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#112240] border-t border-white/10">
            {mounted ? (
              <form
                onSubmit={handleSubmit}
                className="flex gap-2"
                aria-label="Send a message to the election assistant"
              >
                <label htmlFor="chat-input" className="sr-only">
                  Type your question about the Indian election process
                </label>
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Form 6, polling dates, eligibility..."
                  className="flex-1 bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] focus:border-[#FF9933] transition-all"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#FF9933] hover:bg-[#e68a2e] disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div className="flex gap-2" aria-hidden="true">
                <div className="flex-1 bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-gray-500">
                  Ask about Form 6, polling dates, eligibility...
                </div>
                <div className="bg-[#FF9933] opacity-50 text-white p-3 rounded-xl flex items-center justify-center">
                  <Send className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
