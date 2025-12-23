"use client";

import dynamic from 'next/dynamic';
import ChatInterface from '@/components/ChatInterface';
import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

// Dynamically import PDFViewer to avoid "DOMMatrix" server-side error
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="h-full w-[50%] glass flex items-center justify-center text-sky-300">Loading PDF Engine...</div>
});

export default function Home() {
  const activePdf = useStore((state) => state.activePdf);

  return (
    <main className="h-screen w-full relative overflow-hidden flex">
      {/* Left Side: Chat Area */}
      <motion.div 
        layout 
        className={`h-full transition-all duration-500 ease-in-out ${
            activePdf ? 'w-[50%]' : 'w-full mx-auto'
        }`}
      >
        {/* FIX STARTS HERE: Changed to flex-col so children split the height correctly */}
        <div className="flex flex-col h-full pt-10">
            
            {/* Title: Set to shrink-0 so it doesn't get squashed */}
            <h1 className="shrink-0 text-4xl font-bold text-center mb-8 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                InsightStream
            </h1>
            
            {/* Chat Container: flex-1 makes it fill ONLY the remaining space */}
            <div className="flex-1 min-h-0 relative">
                <ChatInterface />
            </div>
        </div>
      </motion.div>

      {/* Right Side: PDF Viewer Slide-In */}
      <AnimatePresence>
        {activePdf && <PDFViewer key="pdf-viewer" />}
      </AnimatePresence>
    </main>
  );
}