import { Bot } from "lucide-react";
import type { Message } from "../stores/jarvis-store";

interface ResponseCardProps {
  message: Message;
}

export function ResponseCard({ message }: ResponseCardProps) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`animate-fade-in-up max-w-md w-full px-4 ${
        isAssistant ? "self-start" : "self-end"
      }`}
    >
      <div className="glass glass-hover rounded-2xl px-5 py-4 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          {isAssistant && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00d4ff]/10">
              <Bot className="w-3 h-3 text-[#00d4ff]" />
            </div>
          )}
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isAssistant ? "text-[#00d4ff]" : "text-[#7c3aed]"
            }`}
          >
            {isAssistant ? "JARVIS" : "You"}
          </span>
          <span className="text-[10px] text-[#64748b] ml-auto">{time}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-[#e2e8f0] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
