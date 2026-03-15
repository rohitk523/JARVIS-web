import { useJarvisStore, type AgentState } from "../stores/jarvis-store";

function getOrbStyles(state: AgentState) {
  const base =
    "relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500";

  switch (state) {
    case "idle":
      return {
        className: `${base}`,
        style: {
          background: "radial-gradient(circle at 40% 40%, #0e4d5c, #0a2a33, #050e10)",
          animation: "orb-idle-pulse 3s ease-in-out infinite",
          boxShadow: "0 0 20px rgba(0, 212, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.05)",
        },
      };
    case "listening":
      return {
        className: `${base}`,
        style: {
          background: "radial-gradient(circle at 40% 40%, #00d4ff, #0077aa, #003d55)",
          boxShadow:
            "0 0 40px rgba(0, 212, 255, 0.5), 0 0 100px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(0, 212, 255, 0.1)",
        },
      };
    case "thinking":
      return {
        className: `${base}`,
        style: {
          background: "conic-gradient(from 0deg, #7c3aed, #0066ff, #00d4ff, #7c3aed)",
          animation: "orb-thinking-rotate 2s linear infinite",
          boxShadow:
            "0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(0, 102, 255, 0.15)",
        },
      };
    case "speaking":
      return {
        className: `${base}`,
        style: {
          background: "radial-gradient(circle at 40% 40%, #0088ff, #0055cc, #002266)",
          animation: "orb-speaking-wave 1.5s ease-in-out infinite",
        },
      };
  }
}

export function VoiceOrb() {
  const agentState = useJarvisStore((s) => s.agentState);
  const orb = getOrbStyles(agentState);

  return (
    <div className="relative flex items-center justify-center">
      {/* Listening expanding rings */}
      {agentState === "listening" && (
        <>
          <span
            className="absolute w-40 h-40 rounded-full border border-[#00d4ff]/30"
            style={{ animation: "orb-listening-ring 1.5s ease-out infinite" }}
          />
          <span
            className="absolute w-40 h-40 rounded-full border border-[#00d4ff]/20"
            style={{ animation: "orb-listening-ring 1.5s ease-out 0.5s infinite" }}
          />
          <span
            className="absolute w-40 h-40 rounded-full border border-[#00d4ff]/10"
            style={{ animation: "orb-listening-ring 1.5s ease-out 1s infinite" }}
          />
        </>
      )}

      {/* Thinking outer ring */}
      {agentState === "thinking" && (
        <div
          className="absolute w-48 h-48 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#7c3aed",
            borderRightColor: "#0066ff",
            animation: "orb-thinking-rotate 3s linear infinite reverse",
          }}
        />
      )}

      {/* Main orb */}
      <div className={orb.className} style={orb.style}>
        {/* Inner glow */}
        <div
          className="absolute w-20 h-20 rounded-full"
          style={{
            background:
              agentState === "thinking"
                ? "radial-gradient(circle, rgba(124,58,237,0.3), transparent)"
                : "radial-gradient(circle, rgba(0,212,255,0.2), transparent)",
          }}
        />
      </div>

      {/* State label */}
      <span className="absolute -bottom-8 text-xs font-medium tracking-widest uppercase text-[#94a3b8]">
        {agentState}
      </span>
    </div>
  );
}
