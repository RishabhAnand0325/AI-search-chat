import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MessageBubble({ message }: { message: any }) {
  const setActivePdf = useStore((state) => state.setActivePdf);

  // Simple parser to replace [1] with clickable buttons
  const renderContent = () => {
    const parts = message.content.split(/(\[\d+\])/g);
    return parts.map((part: string, i: number) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationId = match[1];
        const citation = message.citations?.find((c: any) => c.id === citationId);
        
        if (citation) {
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(56, 189, 248, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePdf(citation)}
              className="inline-flex items-center justify-center w-6 h-6 mx-1 text-xs font-bold text-sky-300 bg-sky-500/20 border border-sky-500/50 rounded-full cursor-pointer hover:border-sky-400 transition-colors"
            >
              {citationId}
            </motion.button>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl glass mb-6 max-w-3xl ${
        message.role === 'user' ? 'bg-white/5 ml-auto w-fit' : 'w-full'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${message.role === 'ai' ? 'bg-sky-500/20 text-sky-300' : 'bg-purple-500/20 text-purple-300'}`}>
           {message.role === 'ai' ? "AI" : "You"}
        </div>
        <div className="text-gray-200 leading-7 pt-1">
          {renderContent()}
        </div>
      </div>

      {/* Source Cards at bottom */}
      {message.citations && message.citations.length > 0 && (
        <div className="mt-4 flex gap-3 flex-wrap">
            {message.citations.map((c: any) => (
                <motion.div 
                    key={c.id}
                    onClick={() => setActivePdf(c)}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/10 cursor-pointer hover:bg-white/5 transition-all"
                >
                    <FileText size={14} className="text-sky-400" />
                    <span className="text-xs text-gray-400 truncate max-w-[150px]">{c.title}</span>
                </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
}