export interface Citation {
  id: string;
  title: string;
  page: number; // Page number to scroll to
  file: string; // Filename of the PDF
  snippet?: string; // Optional text snippet for preview
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
  citations?: Citation[];
}

export interface AppState {
  // The currently open PDF citation (for the slide-over panel)
  activePdf: Citation | null;
  setActivePdf: (citation: Citation | null) => void;

  // Chat History
  messages: Message[];
  addMessage: (msg: Message) => void;
  
  // Handling streaming updates to the last AI message
  updateLastMessage: (content: string, citations?: Citation[]) => void;

  // Status of the "Tool Calls" (e.g. "Thinking...", "Reading PDF...")
  toolStatus: string | null;
  setToolStatus: (status: string | null) => void;
}

export interface ServerEvent {
  type: 'text' | 'tool' | 'citation';
  content?: string;
  data?: Citation;
}