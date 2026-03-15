import { create } from "zustand";

export type AgentState = "idle" | "listening" | "thinking" | "speaking";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface JarvisState {
  agentState: AgentState;
  isListening: boolean;
  transcript: string;
  messages: Message[];
  currentResponse: string | null;

  setAgentState: (state: AgentState) => void;
  setListening: (listening: boolean) => void;
  addMessage: (message: Message) => void;
  setTranscript: (transcript: string) => void;
  clearTranscript: () => void;
  setCurrentResponse: (response: string | null) => void;
}

export const useJarvisStore = create<JarvisState>((set) => ({
  agentState: "idle",
  isListening: false,
  transcript: "",
  messages: [],
  currentResponse: null,

  setAgentState: (agentState) => set({ agentState }),

  setListening: (isListening) => set({ isListening }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setTranscript: (transcript) => set({ transcript }),

  clearTranscript: () => set({ transcript: "" }),

  setCurrentResponse: (currentResponse) => set({ currentResponse }),
}));
