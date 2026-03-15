type ConnectionState = "connected" | "connecting" | "disconnected";

interface StatusIndicatorProps {
  state: ConnectionState;
}

const stateConfig: Record<ConnectionState, { color: string; bgColor: string; label: string }> = {
  connected: {
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    label: "Connected",
  },
  connecting: {
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    label: "Connecting...",
  },
  disconnected: {
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    label: "Disconnected",
  },
};

export function StatusIndicator({ state }: StatusIndicatorProps) {
  const config = stateConfig[state];

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      <span
        className="relative flex h-2 w-2"
        aria-hidden="true"
      >
        {state === "connecting" && (
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{
              backgroundColor: config.color,
              animation: "orb-idle-pulse 1.5s ease-in-out infinite",
            }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: config.color }}
        />
      </span>
      {config.label}
    </div>
  );
}
