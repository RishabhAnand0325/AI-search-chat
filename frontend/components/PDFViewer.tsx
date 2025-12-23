import { motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useCallback } from 'react';

// --- FIX: Import CSS directly here to ensure Next.js bundles it ---
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  // ... rest of your code remains exactly the same ...
  const { activePdf, setActivePdf } = useStore();
  const [scale, setScale] = useState(1.1);

  // Define keywords to highlight based on the snippet provided by backend
  const highlightKeywords = activePdf?.snippet 
    ? activePdf.snippet.split(' ').filter(word => word.length > 5) 
    : [];

  const textRenderer = useCallback(
    (textItem: any) => {
      const { str } = textItem;
      const isMatch = highlightKeywords.some(keyword => 
        str.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isMatch) {
        return (
          <span className="bg-yellow-500/40 text-transparent">
            {str}
          </span>
        );
      }
      return str;
    },
    [highlightKeywords]
  );

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-[50%] glass border-l border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-md shrink-0">
        <h3 className="text-sm font-semibold text-sky-300 truncate w-64">
           {activePdf?.title || "Document Viewer"}
        </h3>
        <div className="flex items-center gap-2">
            <button onClick={() => setScale(s => s + 0.1)} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"><ZoomIn size={16}/></button>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"><ZoomOut size={16}/></button>
            <button onClick={() => setActivePdf(null)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
            <X size={18} />
            </button>
        </div>
      </div>

      {/* PDF Canvas Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-black/40 custom-scrollbar">
        {activePdf && (
            <Document file={`/${activePdf.file}`}>
                <Page 
                    pageNumber={activePdf.page} 
                    scale={scale} 
                    renderTextLayer={true} 
                    renderAnnotationLayer={false}
                    customTextRenderer={textRenderer}
                    className="shadow-2xl border border-white/10 bg-white" 
                />
            </Document>
        )}
      </div>
    </motion.div>
  );
}