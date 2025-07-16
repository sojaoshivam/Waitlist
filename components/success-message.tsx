"use client";

import { CheckCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

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
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${url}`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto font-urbanist"
    >
      <div className="bg-black/70 border border-neutral-800 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-lg flex flex-col items-center space-y-6 font-urbanist">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-full p-3 shadow-lg mb-2">
            <CheckCircle className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight text-center font-urbanist">Welcome to Tars AI!</h2>
          <p className="text-neutral-400 text-lg text-center">You&apos;re successfully on the waitlist</p>
        </div>
        <div className="text-center space-y-1">
          <div className="text-xl font-semibold text-white font-urbanist">Hi <span className="inline-block animate-wave">👋</span></div>
          <div className="text-lg text-neutral-300 font-urbanist">You&apos;re number <span className="text-teal-400 font-bold">#{data.position}</span> in line</div>
          <div className="text-neutral-400 text-base font-urbanist">Your ID: <span className="text-blue-400 font-medium">{data.id}</span></div>
          <div className="text-neutral-400 text-base font-urbanist">We&apos;ll send updates to <span className="text-blue-400 font-medium">{data.email}</span></div>
        </div>
        {/* <div className="w-full bg-black/60 border border-neutral-800 rounded-xl p-4 mt-4">
          <h3 className="text-lg font-bold text-white mb-2 font-urbanist">What&apos;s next?</h3>
          <ul className="text-neutral-300 text-base space-y-1 list-disc list-inside">
            <li>We&apos;ll email you when we&apos;re ready to launch</li>
            <li>You&apos;ll get early access to all features</li>
            <li>Special pricing for early supporters</li>
          </ul>
        </div> */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={() => handleShare('twitter')}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center font-urbanist"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Tweet
          </Button>
          <Button
            onClick={() => handleShare('linkedin')}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold rounded-lg shadow-md flex items-center justify-center font-urbanist"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Share on LinkedIn
          </Button>
          <Button
            onClick={() => handleShare('generic')}
            className="w-full bg-neutral-800 text-white font-semibold rounded-lg shadow-md flex items-center justify-center font-urbanist"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        <Button
          onClick={onReset}
          variant="ghost"
          className="w-full text-neutral-400 hover:text-blue-500 hover:bg-blue-100/30 mt-2 font-urbanist transition-colors duration-200"
        >
          Add another email
        </Button>
      </div>
    </motion.div>
  );
}