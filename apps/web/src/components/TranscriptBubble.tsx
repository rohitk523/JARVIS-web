import { useJarvisStore } from "../stores/jarvis-store";

export function TranscriptBubble() {
  const transcript = useJarvisStore((s) => s.transcript);
  const isListening = useJarvisStore((s) => s.isListening);

  if (!transcript && !isListening) return null;

  return (
    <div className="animate-fade-in-up max-w-md w-full px-4">
      <div
        className="glass rounded-2xl px-5 py-3 text-sm"
        style={{
          borderColor: isListening ? "rgba(0, 212, 255, 0.3)" : "rgba(0, 212, 255, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00d4ff]">
            You
          </span>
          {isListening && (
            <span className="flex gap-0.5">
              <span
                className="w-1 h-1 rounded-full bg-[#00d4ff]"
                style={{ animation: "orb-idle-pulse 1s ease-in-out infinite" }}
              />
              <span
                className="w-1 h-1 rounded-full bg-[#00d4ff]"
                style={{ animation: "orb-idle-pulse 1s ease-in-out 0.2s infinite" }}
              />
              <span
                className="w-1 h-1 rounded-full bg-[#00d4ff]"
                style={{ animation: "orb-idle-pulse 1s ease-in-out 0.4s infinite" }}
              />
            </span>
          )}
        </div>
        <p className="text-[#e2e8f0] leading-relaxed">
          {transcript || (
            <span className="text-[#94a3b8] italic">Listening...</span>
          )}
        </p>
      </div>
    </div>
  );
}
