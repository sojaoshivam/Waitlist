"use client";

import React, { useRef, useState } from "react";
import { CheckCircle, Share2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SuccessMessageProps {
  data: {
    email: string;
    name: string;
    id: number;
    position: number;
  };
  onReset: () => void;
}

export function SuccessMessage({ data, onReset }: SuccessMessageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Social share logic
  const shareText = `I just joined the waitlist for @TarsAI! 🤖 Can't wait to experience the future of AI. Join me at ${typeof window !== 'undefined' ? window.location.origin : ''}`;
  const linkedInText = `I just joined the waitlist for Tars AI! 🚀 Can't wait to experience the future of AI. Join me: ${typeof window !== 'undefined' ? window.location.origin : ''}`;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'generic') => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(linkedInText)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Join Tars AI Waitlist',
          text: shareText,
          url: url,
        });
      } else {
        navigator.clipboard.writeText(`${shareText} ${url}`);
      }
    }
  };

  // 3D hover effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
      const rotateX = -(y / rect.height) * 5;
      const rotateY = (x / rect.width) * 5;
      setRotation({ x: rotateX, y: rotateY });
    }
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.div
        ref={cardRef}
        className="relative rounded-[32px] overflow-hidden"
        style={{
          width: "360px",
          minHeight: "480px",
          transformStyle: "preserve-3d",
          backgroundColor: "#0e131f",
          boxShadow:
            "0 -10px 100px 10px rgba(78, 99, 255, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
          perspective: 1000,
        }}
        initial={{ y: 0 }}
        animate={{
          y: isHovered ? -5 : 0,
          rotateX: rotation.x,
          rotateY: rotation.y
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Close button */}
        <button
          onClick={onReset}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black text-xl font-bold shadow transition"
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        {/* Green checkmark with glow */}
        <div className="flex flex-col items-center justify-center pt-12 pb-6">
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 blur-xl" style={{ width: 64, height: 64 }} />
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 shadow-lg z-10">
              <CheckCircle className="h-10 w-10 text-white" />
            </span>
          </div>
        </div>
        {/* Main message */}
        <div className="flex flex-col items-center justify-center px-6 pb-2">
          <h2 className="text-2xl font-extrabold text-center text-black dark:text-white mb-2">
            You have been added to our <span className="text-green-500">waitlist!</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-center text-base mb-4">
            Thank you for joining, you&apos;ll be the first to know when we are ready!
          </p>
        </div>
        {/* Tell your friends section (unchanged) */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="text-neutral-200 text-base font-urbanist mb-3 text-center tracking-wide font-semibold">Tell your friends</div>
          <div className="flex flex-row gap-5 justify-center">
            <Button
              onClick={() => handleShare('twitter')}
              className="bg-white/20 hover:bg-teal-500/30 transition-all duration-200 rounded-full p-3 shadow-lg backdrop-blur-md flex items-center justify-center"
              title="Share on X"
              aria-label="Share on X"
              style={{ boxShadow: '0 2px 8px 0 rgba(56,189,248,0.15)' }}
            >
              {/* Custom X (Twitter) SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="h-6 w-6 text-blue-400 group-hover:text-white transition">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </Button>
            <Button
              onClick={() => handleShare('linkedin')}
              className="bg-white/20 hover:bg-blue-500/30 transition-all duration-200 rounded-full p-3 shadow-lg backdrop-blur-md flex items-center justify-center"
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
              style={{ boxShadow: '0 2px 8px 0 rgba(59,130,246,0.15)' }}
            >
              {/* Custom filled LinkedIn SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="h-6 w-6 text-blue-500 group-hover:text-white transition">
                <path d="M1.146 1.146C.417 1.875.417 3.042 1.146 3.77c.729.729 1.896.729 2.625 0 .729-.728.729-1.895 0-2.624-.729-.729-1.896-.729-2.625 0zM.5 5.5h3V15h-3V5.5zm4.5 0h2.857v1.303h.041c.398-.755 1.37-1.553 2.822-1.553C14.5 5.25 15 7.042 15 9.25V15h-3V9.75c0-1.25-.022-2.857-1.75-2.857-1.75 0-2.021 1.367-2.021 2.778V15h-3V5.5z"/>
              </svg>
            </Button>
            <Button
              onClick={() => handleShare('generic')}
              className="bg-white/20 hover:bg-neutral-300/30 transition-all duration-200 rounded-full p-3 shadow-lg backdrop-blur-md flex items-center justify-center"
              title="Share"
              aria-label="Share"
              style={{ boxShadow: '0 2px 8px 0 rgba(156,163,175,0.15)' }}
            >
              <Share2 className="h-6 w-6 fill-current text-neutral-400 group-hover:text-white transition" fill="currentColor" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}