import { create } from 'zustand';
import { AppState, Citation, Message } from '@/lib/types';

export const useStore = create<AppState>((set) => ({
  activePdf: null,
  setActivePdf: (citation) => set({ activePdf: citation }),

  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content, citations) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === 'ai') {
        last.content = content;
        if (citations) last.citations = citations;
      }
      return { messages: msgs };
    }),

  toolStatus: null,
  setToolStatus: (status) => set({ toolStatus: status }),
}));