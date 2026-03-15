import { api } from "./api";

/**
 * Requests a LiveKit access token from the backend API.
 * The backend verifies the Supabase auth token and returns a
 * scoped LiveKit JWT for joining the voice room.
 */
export async function getLiveKitToken(): Promise<string> {
  const response = await api.post<{ token: string }>("/livekit/token");
  return response.data.token;
}
