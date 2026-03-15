import { useState, useCallback, useRef } from "react";
import { Room, RoomEvent, ConnectionState } from "livekit-client";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL ?? "";

export function useLiveKit() {
  const [room, setRoom] = useState<Room | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected,
  );
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const roomRef = useRef<Room | null>(null);

  const connect = useCallback(
    async (token: string) => {
      // Disconnect existing room if any
      if (roomRef.current) {
        await roomRef.current.disconnect();
      }

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Track connection state changes
      newRoom.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        setConnectionState(state);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        setConnectionState(ConnectionState.Disconnected);
        setIsMicEnabled(false);
      });

      try {
        await newRoom.connect(LIVEKIT_URL, token);

        // Start with microphone muted (PTT pattern)
        await newRoom.localParticipant.setMicrophoneEnabled(false);
        setIsMicEnabled(false);

        roomRef.current = newRoom;
        setRoom(newRoom);
        setConnectionState(ConnectionState.Connected);
      } catch (err) {
        console.error("Failed to connect to LiveKit room:", err);
        setConnectionState(ConnectionState.Disconnected);
        throw err;
      }
    },
    [],
  );

  const disconnect = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
      setRoom(null);
      setConnectionState(ConnectionState.Disconnected);
      setIsMicEnabled(false);
    }
  }, []);

  const toggleMicrophone = useCallback(async () => {
    if (!roomRef.current) return;

    const newState = !isMicEnabled;
    await roomRef.current.localParticipant.setMicrophoneEnabled(newState);
    setIsMicEnabled(newState);
  }, [isMicEnabled]);

  return {
    room,
    connectionState,
    connect,
    disconnect,
    toggleMicrophone,
    isMicEnabled,
  };
}
