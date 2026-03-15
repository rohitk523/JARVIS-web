import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { useJarvisStore } from "../stores/jarvis-store";

interface PTTButtonProps {
  /** Called when the user starts speaking (pointer down or toggle on). */
  onStartListening: () => void;
  /** Called when the user stops speaking (pointer up or toggle off). */
  onStopListening: () => void;
  /** If true, the button works as a toggle instead of push-to-talk. */
  toggleMode?: boolean;
  /** Whether the button is disabled (e.g., not connected). */
  disabled?: boolean;
}

export function PTTButton({
  onStartListening,
  onStopListening,
  toggleMode = false,
  disabled = false,
}: PTTButtonProps) {
  const isListening = useJarvisStore((s) => s.isListening);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = useCallback(() => {
    if (disabled || toggleMode) return;
    setIsPressed(true);
    onStartListening();
  }, [disabled, toggleMode, onStartListening]);

  const handlePointerUp = useCallback(() => {
    if (disabled || toggleMode) return;
    setIsPressed(false);
    onStopListening();
  }, [disabled, toggleMode, onStopListening]);

  const handleClick = useCallback(() => {
    if (disabled || !toggleMode) return;
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  }, [disabled, toggleMode, isListening, onStartListening, onStopListening]);

  const active = isListening || isPressed;

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center
        w-16 h-16 rounded-full
        transition-all duration-300 ease-out
        select-none touch-none
        ${
          disabled
            ? "bg-[#1a1a2e]/50 text-[#4a5568] cursor-not-allowed"
            : active
              ? "bg-[#00d4ff]/20 text-[#00d4ff] scale-110"
              : "bg-[#1a1a2e] text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1a1a2e]/80"
        }
        ${active ? "animate-glow-pulse" : ""}
      `}
      style={
        active
          ? {
              boxShadow:
                "0 0 24px rgba(0, 212, 255, 0.4), 0 0 48px rgba(0, 212, 255, 0.15), inset 0 0 12px rgba(0, 212, 255, 0.1)",
              border: "1.5px solid rgba(0, 212, 255, 0.5)",
            }
          : {
              border: "1.5px solid rgba(0, 212, 255, 0.15)",
            }
      }
    >
      {active ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}

      {/* Active ring */}
      {active && (
        <span
          className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/30"
          style={{ animation: "orb-listening-ring 2s ease-out infinite" }}
        />
      )}
    </button>
  );
}
