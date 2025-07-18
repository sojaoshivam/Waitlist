"use client";

import { useState, useRef, useEffect } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { WaitlistForm } from "@/components/waitlist-form";
import { SuccessMessage } from "@/components/success-message";
import { Bot, Sparkles, ArrowRight, Crown, MessageSquareQuoteIcon, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/ui/gradient-card";
import { useInView, motion as m } from "framer-motion";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import FAQSection from "@/components/ui/faq-section"; // Assuming this is the fixed component
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [successData, setSuccessData] = useState<{
    email: string;
    name: string;
    id: number;
    position: number;
  } | null>(null);
  const [showOtherContent, setShowOtherContent] = useState(false);
  // Ref for the full name input
  const nameInputRef = useRef<HTMLInputElement>(null);
  // Refs for in-view animations
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });
  const footerInView = useInView(footerRef, { once: true });

  const handleSuccess = (data: { email: string; name: string; id: number; position: number }) => {
    setSuccessData(data);
  };

  const handleReset = () => {
    setSuccessData(null);
  };

  // Scroll to top and focus the full name field
  const scrollToTopAndFocus = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      // Try to focus the input by ref or fallback to querySelector
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      } else {
        const input = document.querySelector('input[placeholder="Full name..."]') as HTMLInputElement;
        if (input) input.focus();
      }
    }, 500);
  };

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const navType = (window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type;
      if (event.persisted || navType === "back_forward") {
        document.querySelectorAll('.other-content').forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
        const hero = document.getElementById('hero-section');
        if (hero) (hero as HTMLElement).style.display = 'block';
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowOtherContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTopOnMount />
      <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
        <BackgroundBeams />
        <div className="main-content flex flex-col items-center w-full">
          <div id="hero-section" className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-16">
            <div className="text-center flex flex-col gap-6 sm:gap-10 md:gap-14">
              {/* Header */}
              <m.div
                ref={headerRef}
                initial={{ opacity: 0, y: 40 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6 sm:space-y-8"
              >
                <m.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="mb-4 sm:mb-6 flex justify-center"
                >
                  <motion.button
                    type="button"
                    className="flex items-center gap-2 px-5 py-1.5 rounded-2xl bg-[#101010] border border-[#232323] shadow-sm text-[#E0E0E0] font-medium text-base font-urbanist transition-all duration-200 focus:outline-none"
                    style={{ minWidth: 'min(70vw, 200px)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span
                      className="mr-1 flex"
                      animate={{ rotate: [ -15, 15, -15 ] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    >
                      <Crown style={{ color: '#E0E0E0', width: '1.1em', height: '1.1em', transition: 'color 0.2s' }} />
                    </motion.span>
                    <span>Beyond Artificial</span>
                  </motion.button>
                </m.div>
                <m.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className="relative z-10 text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-urbanist font-extrabold tracking-tight leading-tight drop-shadow-lg"
                >
                  TARS AI
                </m.h1>
                <m.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-base xs:text-lg sm:text-xl md:text-2xl text-neutral-300 font-semibold mt-2"
                >
                  AI Chatbot for PDFs · Document Intelligence Platform
                </m.h2>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="text-neutral-400 max-w-xs xs:max-w-sm sm:max-w-xl mx-auto text-sm xs:text-base sm:text-lg leading-relaxed relative z-10"
                >
                  Join the waitlist for TARS AI – the smart, multilingual document assistant.
                </m.p>
              </m.div>

              {/* Waitlist Form or Success Message */}
              <m.div
                ref={formRef}
                initial={{ opacity: 0, y: 40 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative z-10 mt-4 mb-4 sm:mt-6 sm:mb-6"
              >
                {successData ? (
                  <SuccessMessage data={successData} onReset={handleReset} />
                ) : (
                  <WaitlistForm onSuccess={handleSuccess} />
                )}
                {/* Trusted by row - moved here */}
                <div className="flex flex-col items-center mt-6 mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex -space-x-2">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" className="w-5 h-5 rounded-full border border-black" />
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" className="w-5 h-5 rounded-full border border-black" />
                      <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="user3" className="w-5 h-5 rounded-full border border-black" />
                    </div>
                    <m.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={formInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                      className="ml-2 text-[10px] text-neutral-400 font-medium tracking-wide"
                    >
                      Trusted by 1,000+ early adopters
                    </m.span>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
          {/* Other content, hidden until timer elapses */}
          <div style={{ transition: 'opacity 0.7s', opacity: showOtherContent ? 1 : 0, pointerEvents: showOtherContent ? 'auto' : 'none', height: showOtherContent ? 'auto' : 0, overflow: showOtherContent ? 'visible' : 'hidden' }}>
            {/* Feature cards row */}
            <div className="feature-cards-row flex flex-col sm:flex-row justify-center items-stretch gap-6 sm:gap-8 w-full max-w-4xl mx-auto mt-0 mb-8 sm:mb-8">
              {[
                { icon: <Bot className="h-6 w-6 text-neutral-700" />, title: "Semantic Search" },
                { icon: <Sparkles className="h-6 w-6 text-neutral-700" />, title: "Prediction" },
                { icon: <ArrowRight className="h-6 w-6 text-neutral-700" />, title: "Integration" }
              ].map((feature, idx) => (
                <div key={idx} className="w-full flex justify-center">
                  <FeatureCard icon={feature.icon} title={feature.title} delay={0.15 * idx + 0.2} />
                </div>
              ))}
            </div>
            {/* FAQ Section */}
            <div
              ref={faqRef}
              className="mt-8 mb-8 sm:mt-16 sm:mb-16 px-2 sm:px-0"
            >
              <FAQSection />
            </div>
            {/* Contact & Social Card Section */}
            <m.div
              ref={contactRef}
              initial={{ opacity: 0, y: 40 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center mt-8 mb-0 sm:mt-16 sm:mb-0 px-2 sm:px-0"
            >
              <m.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative bg-[#101010]/80 border-2 border-white/20 rounded-[2.5rem] shadow-2xl max-w-2xl w-full px-12 py-16 flex flex-col items-center"
                style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 2px 32px 0 rgba(0,0,0,0.25)' }}
              >
                {/* Top icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-neutral-200 mb-6">
                  <MessageSquareQuoteIcon className="h-7 w-7 text-black" />
                </div>
                {/* Heading */}
                <m.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                  className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1"
                >
                  Stay Connected!<br />Message Us &amp; Follow
                </m.h2>
                {/* Subtext */}
                <p className="text-neutral-300 text-center mb-7 max-w-md">Send us a message and follow us for the latest updates, news, and exclusive insights!</p>
                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                  <motion.a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=teammurph@tarsai.live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black font-medium shadow hover:scale-105 transition-all border border-white/20"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.795l-7.5 5.625a2.25 2.25 0 01-2.748 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                    Write Us
                  </motion.a>
                  <motion.button
                    type="button"
                    onClick={scrollToTopAndFocus}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#18181f] text-white font-medium shadow hover:scale-105 transition-all border border-white/10"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Join Waitlist
                  </motion.button>
                </div>
                {/* Social icons */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-neutral-400 text-sm mb-1">Follow Us</span>
                  <div className="flex gap-4">
                    {/* Twitter - white icon */}
                    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#18181f] border border-white/10 text-white hover:bg-blue-400 hover:text-white transition-all" title="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="h-6 w-6 text-white group-hover:text-white transition">
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                      </svg>
                    </a>
                    {/* LinkedIn - Lucide icon */}
                    <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#18181f] border border-white/10 text-white hover:bg-blue-500 hover:text-white transition-all" title="LinkedIn">
                      <Linkedin className="h-6 w-6" />
                    </a>
                    {/* Instagram - Lucide icon */}
                    <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#18181f] border border-white/10 text-white hover:bg-pink-500 hover:text-white transition-all" title="Instagram">
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </m.div>
            </m.div>
            {/* Footer - moved to appear right after Stay Connected card */}
            <m.footer
              ref={footerRef}
              initial={{ opacity: 0, y: 40 }}
              animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="w-full border-t border-white/10 mt-4 px-2 sm:px-4 py-4 sm:py-6 flex flex-row items-center justify-center gap-4 sm:gap-[60rem] text-neutral-400 text-xs sm:text-sm z-10 transition-all duration-300"
              style={{ minHeight: '64px' }}
            >
              <span className="font-normal">© 2025 TARS AI. All rights reserved.</span>
              <button
                onClick={scrollToTopAndFocus}
                className="px-3 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors duration-300 text-xs sm:text-sm font-medium focus:outline-none mt-2 sm:mt-0"
              >
                Back to Top
              </button>
            </m.footer>
            {/* Features/Benefits Section for SEO (condensed) */}
            {/* <div className="mt-10 text-left max-w-2xl mx-auto space-y-4">
              <ul className="list-disc list-inside text-neutral-300 space-y-1">
                <li>AI chatbot for PDFs and documents</li>
                <li>Smart, multilingual document search</li>
                <li>RAG-based, source-cited answers</li>
                <li>Secure, private, and team-ready</li>
                <li>Boost productivity and accessibility</li>
              </ul>
            </div> */}
          </div> {/* end of .other-content */}
        </div> {/* end of main container */}
      </div>
    </>
  );
}
