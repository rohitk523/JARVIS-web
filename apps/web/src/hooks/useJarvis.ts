import { useState, useCallback, useEffect, useRef } from "react";
import { RoomEvent, ConnectionState, type RemoteParticipant } from "livekit-client";
import { getLiveKitToken } from "../lib/livekit";
import { useLiveKit } from "./useLiveKit";
import { useJarvisStore, type AgentState } from "../stores/jarvis-store";

/**
 * High-level hook that manages the JARVIS voice agent session.
 * - Fetches a LiveKit token from the backend API
 * - Connects to the LiveKit room
 * - Listens to participant/data events to infer agent state
 * - Exposes connect/disconnect + current state
 */
export function useJarvis() {
  const [isConnected, setIsConnected] = useState(false);
  const agentState = useJarvisStore((s) => s.agentState);
  const setAgentState = useJarvisStore((s) => s.setAgentState);
  const addMessage = useJarvisStore((s) => s.addMessage);
  const setTranscript = useJarvisStore((s) => s.setTranscript);
  const clearTranscript = useJarvisStore((s) => s.clearTranscript);
  const setCurrentResponse = useJarvisStore((s) => s.setCurrentResponse);

  const livekit = useLiveKit();
  const connectingRef = useRef(false);

  const connect = useCallback(async () => {
    if (connectingRef.current || isConnected) return;
    connectingRef.current = true;

    try {
      const token = await getLiveKitToken();
      await livekit.connect(token);
      setIsConnected(true);
      setAgentState("idle");
    } catch (err) {
      console.error("Failed to connect to JARVIS:", err);
      setIsConnected(false);
      setAgentState("idle");
    } finally {
      connectingRef.current = false;
    }
  }, [isConnected, livekit, setAgentState]);

  const disconnect = useCallback(async () => {
    await livekit.disconnect();
    setIsConnected(false);
    setAgentState("idle");
    clearTranscript();
    setCurrentResponse(null);
  }, [livekit, setAgentState, clearTranscript, setCurrentResponse]);

  // Listen to room events for agent state inference
  useEffect(() => {
    const room = livekit.room;
    if (!room) return;

    const handleConnectionStateChanged = (state: ConnectionState) => {
      if (state === ConnectionState.Disconnected) {
        setIsConnected(false);
        setAgentState("idle");
      }
    };

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      // The agent sends JSON-encoded data messages for state and transcription
      if (!participant) return;

      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload)) as {
          type?: string;
          state?: AgentState;
          text?: string;
          transcript?: string;
          content?: string;
        };

        if (data.type === "agent_state" && data.state) {
          setAgentState(data.state);
        }

        if (data.type === "transcription" && data.text) {
          setTranscript(data.text);
        }

        if (data.type === "agent_response" && data.content) {
          setCurrentResponse(data.content);
          addMessage({
            role: "assistant",
            content: data.content,
            timestamp: Date.now(),
          });
        }

        if (data.type === "user_transcript" && data.transcript) {
          addMessage({
            role: "user",
            content: data.transcript,
            timestamp: Date.now(),
          });
          clearTranscript();
        }
      } catch {
        // Ignore non-JSON data
      }
    };

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [
    livekit.room,
    setAgentState,
    setTranscript,
    clearTranscript,
    setCurrentResponse,
    addMessage,
  ]);

  return {
    isConnected,
    agentState,
    connect,
    disconnect,
    room: livekit.room,
    toggleMicrophone: livekit.toggleMicrophone,
    isMicEnabled: livekit.isMicEnabled,
  };
}
