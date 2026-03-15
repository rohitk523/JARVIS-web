import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { RoomEvent, Track } from "livekit-client";
import { VoiceOrb } from "../components/VoiceOrb";
import { PTTButton } from "../components/PTTButton";
import { TranscriptBubble } from "../components/TranscriptBubble";
import { ResponseCard } from "../components/ResponseCard";
import { StatusIndicator } from "../components/StatusIndicator";
import { useJarvisStore } from "../stores/jarvis-store";
import { useJarvis } from "../hooks/useJarvis";
import { useLiveKit } from "../hooks/useLiveKit";

export function HomePage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useJarvisStore((s) => s.messages);
  const setListening = useJarvisStore((s) => s.setListening);

  const { isConnected, agentState, connect, disconnect } = useJarvis();
  const { room, toggleMicrophone, isMicEnabled } = useLiveKit();

  const connectionState = isConnected
    ? "connected"
    : agentState !== "idle"
      ? "connecting"
      : "disconnected";

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Subscribe to agent audio tracks
  useEffect(() => {
    if (!room) return;

    const handleTrackSubscribed = (track: { kind: Track.Kind; attach: () => HTMLMediaElement }) => {
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        audioElement.style.display = "none";
        document.body.appendChild(audioElement);
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [room]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartListening = useCallback(() => {
    setListening(true);
    if (!isMicEnabled) {
      toggleMicrophone();
    }
  }, [setListening, isMicEnabled, toggleMicrophone]);

  const handleStopListening = useCallback(() => {
    setListening(false);
    if (isMicEnabled) {
      toggleMicrophone();
    }
  }, [setListening, isMicEnabled, toggleMicrophone]);

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0, 212, 255, 0.04), transparent)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold tracking-wider text-[#e2e8f0]">
          <span className="text-[#00d4ff]">J</span>ARVIS
        </h1>
        <div className="flex items-center gap-3">
          <StatusIndicator state={connectionState} />
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1a1a2e]/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-8">
        {/* Message history (scrollable) */}
        {messages.length > 0 && (
          <div className="absolute top-0 left-0 right-0 bottom-80 overflow-y-auto flex flex-col items-center gap-3 px-4 pt-4 pb-8">
            {messages.map((msg) => (
              <ResponseCard key={`${msg.role}-${msg.timestamp}`} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Voice interface (centered) */}
        <div className="flex flex-col items-center gap-10 mt-auto">
          <VoiceOrb />

          <TranscriptBubble />

          <PTTButton
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            toggleMode={false}
            disabled={!isConnected}
          />

          <p className="text-xs text-[#64748b] text-center max-w-xs">
            {isConnected
              ? "Hold the microphone button to speak"
              : "Connecting to JARVIS..."}
          </p>
        </div>
      </main>
    </div>
  );
}
