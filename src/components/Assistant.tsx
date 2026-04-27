"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I am your Election Process Assistant. I can help you understand voter registration, Form 6, polling rules, and the general election timeline in India. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration mismatch — only render interactive elements after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1) // Send history excluding the initial greeting
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.error || "No reply received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: "I encountered a network issue. Please check your internet connection and try again." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="assistant" className="py-20 bg-[#0A192F] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">Smart Voter Assistant</h2>
          <p className="text-gray-400 text-lg">
            Have specific questions about your voting status or the election process? Ask below.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[600px] border border-white/20 shadow-2xl">
          {/* Chat Header */}
          <div className="bg-[#112240] p-4 border-b border-white/10 flex items-center gap-3">
            <div className="bg-[#138808]/20 p-2 rounded-full">
              <Bot className="h-6 w-6 text-[#138808]" />
            </div>
            <div>
              <h3 className="text-white font-bold">Election AI Assistant</h3>
              <p className="text-xs text-[#138808] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse"></span> Online
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[#112240] border border-white/10 flex items-center justify-center shrink-0 mt-1">
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
                  {/* Basic markdown parsing for bold text */}
                  <p className="leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#112240] border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-gray-300" />
                </div>
                <div className="bg-[#112240] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <Loader2 className="h-5 w-5 text-[#138808] animate-spin" />
                  <span className="text-gray-400 text-sm">Searching election guidelines...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area — only render interactive form after hydration */}
          <div className="p-4 bg-[#112240] border-t border-white/10">
            {mounted ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Form 6, polling dates, eligibility..."
                  className="flex-1 bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#FF9933] hover:bg-[#e68a2e] disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <div className="flex gap-2">
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
