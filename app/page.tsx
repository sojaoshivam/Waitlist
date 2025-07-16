"use client";

import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { WaitlistForm } from "@/components/waitlist-form";
import { SuccessMessage } from "@/components/success-message";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SparklesText from "@/components/SparklesText";

export default function Home() {
  const [successData, setSuccessData] = useState<{
    email: string;
    name: string;
    id: number;
    position: number;
  } | null>(null);

  const handleSuccess = (data: { email: string; name: string; id: number; position: number }) => {
    setSuccessData(data);
  };

  const handleReset = () => {
    setSuccessData(null);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
      <BackgroundBeams />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="text-center space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <SparklesText text="Coming Soon" colors={{ first: '#A07CFE', second: '#FE8FB5' }} className="mb-2 animate-fade-up text-base md:text-lg lg:text-xl" sparkleSize={10} />
            <h2 className="relative z-10 text-4xl sm:text-5xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-urbanist font-extrabold tracking-tight">
             TARS AI
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed relative z-10">
              {/* AI-powered document intelligence that makes complex content searchable, accessible, and insightful.<br/><br/> */}
               Join the waitlist and be the first to experience the future of knowledge access.
            </p>
          </motion.div>

          {/* Waitlist Form or Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10"
          >
            {successData ? (
              <SuccessMessage data={successData} onReset={handleReset} />
            ) : (
              <WaitlistForm onSuccess={handleSuccess} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-2 sm:px-0 absolute bottom-2 left-0 right-0 text-center text-neutral-600 text-xs sm:text-sm z-10">
        <p>© 2025 TARS AI. All rights reserved.</p>
      </div>
    </div>
  );
}