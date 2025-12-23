import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import MessageBubble from './MessageBubble';
import { Citation } from '@/lib/types';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { messages, addMessage, updateLastMessage, toolStatus, setToolStatus } = useStore();
  
  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, toolStatus]); // Scroll whenever messages or status change

  const handleSend = async () => {
    if (!input.trim()) return;
    
    addMessage({ role: 'user', content: input });
    setInput('');
    addMessage({ role: 'ai', content: '', citations: [] });
    setIsStreaming(true);

    const eventSource = new EventSource(`http://localhost:8000/stream?query=${encodeURIComponent(input)}`);
    let accumulatedText = "";
    let accumulatedCitations: Citation[] = []; 

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setIsStreaming(false);
        setToolStatus(null);
        return;
      }

      const parsed = JSON.parse(event.data);

      if (parsed.type === 'text') {
        accumulatedText += parsed.content;
        updateLastMessage(accumulatedText, accumulatedCitations);
      } else if (parsed.type === 'tool') {
        setToolStatus(parsed.content);
      } else if (parsed.type === 'citation') {
        if (!accumulatedCitations.find(c => c.id === parsed.data.id)) {
            accumulatedCitations.push(parsed.data);
            updateLastMessage(accumulatedText, accumulatedCitations);
        }
      }
    };
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* 1. Messages Area: Flex-1 ensures it fills available height above input */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        
        {/* Tool Status Indicator */}
        {toolStatus && (
            <div className="flex items-center gap-2 text-sky-400 text-sm animate-pulse ml-4">
                <Sparkles size={16} />
                <span>{toolStatus}</span>
            </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. Input Area: Static block at the bottom (Not Absolute) */}
      <div className="p-4 pt-2 shrink-0 z-10">
        <div className="glass p-2 rounded-2xl flex items-center gap-2 relative group transition-all duration-300 focus-within:ring-2 ring-sky-500/50">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-gray-500"
          />
          <button 
            onClick={handleSend}
            disabled={isStreaming}
            className="p-3 bg-sky-600 rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50"
          >
            {isStreaming ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}