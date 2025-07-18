"use client";

import { useState, useRef, useEffect } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { WaitlistForm } from "@/components/waitlist-form";
import { SuccessMessage } from "@/components/success-message";
import { Bot, Sparkles, ArrowRight, Crown, MessageSquareQuoteIcon, FileSearch, Brain, Shield, Users, Check, TrendingUp, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/ui/gradient-card";
import { useInView, motion as m } from "framer-motion";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import FAQSection from "@/components/ui/faq-section";
import { Container } from "@/components/ui/container";

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
        <Container>
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
                      className="flex items-center gap-1 px-3 py-0.5 rounded-2xl bg-[#101010] border border-[#232323] shadow-sm text-[#E0E0E0] font-normal text-xs sm:text-sm font-urbanist transition-all duration-200 focus:outline-none"
                      style={{ minWidth: 'min(40vw, 120px)' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.span
                        className="mr-1 flex"
                        animate={{ rotate: [ -15, 15, -15 ] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      >
                        <Crown style={{ color: '#E0E0E0', width: '0.9em', height: '0.9em', transition: 'color 0.2s' }} />
                      </motion.span>
                      <span>Beyond Artificial</span>
                    </motion.button>
                  </m.div>
                  <m.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="relative z-10 text-3xl xs:text-5xl sm:text-8xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-urbanist font-extrabold tracking-tight leading-tight drop-shadow-lg"
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
                    className="text-neutral-400 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed relative z-10 whitespace-nowrap overflow-hidden"
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
                  <div className="flex flex-col items-center mt-12 mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex -space-x-3">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" className="w-8 h-8 rounded-full border-2 border-black" />
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" className="w-8 h-8 rounded-full border-2 border-black" />
                        <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="user3" className="w-8 h-8 rounded-full border-2 border-black" />
                      </div>
                      <m.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={formInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                        className="ml-3 text-xs sm:text-sm text-neutral-400 font-semibold tracking-wide"
                      >
                        Join others on the waitlist
                      </m.span>
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
            
            {/* Other content, hidden until timer elapses */}
            <div 
              style={{ 
                transition: 'opacity 0.7s', 
                opacity: showOtherContent ? 1 : 0, 
                pointerEvents: showOtherContent ? 'auto' : 'none', 
                height: showOtherContent ? 'auto' : 0, 
                overflow: showOtherContent ? 'visible' : 'hidden'
                
              }}
              className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 other-content gap-8 flex flex-col"
            >
              {/* Feature cards row */}
              <div ref={featuresRef} className="feature-cards-row w-full mt-20 sm:mt-16 md:mt-24 mb-8 sm:mb-12 md:mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                  {[
                    {
                      icon: <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />,
                      title: "Intelligent Document Analysis",
                      description: "TARS AI analyzes your documents with advanced natural language processing, extracting key insights, summarizing content, and identifying important patterns automatically."
                    },
                    {
                      icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />,
                      title: "Smart Q&A System",
                      description: "Ask questions in natural language and get precise answers from your documents. TARS AI understands context and provides relevant information with source citations."
                    },
                    {
                      icon: <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />,
                      title: "Multi-Format Support",
                      description: "Works with PDFs, Word documents, presentations, spreadsheets, and more. Upload any document type and let TARS AI extract actionable intelligence."
                    }
                  ].map((feature, idx) => (
                    <m.div 
                      key={idx} 
                      className="w-full"
                      initial={{ opacity: 0, y: 40 }}
                      animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.15 * idx + 0.2, ease: "easeOut" }}
                    >
                      <FeatureCard 
                        icon={feature.icon} 
                        title={feature.title} 
                        description={feature.description} 
                        delay={0.15 * idx + 0.2} 
                      />
                    </m.div>
                  ))}
                </div>
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
                  className="relative bg-[#101010]/80 rounded-[2.5rem] shadow-2xl max-w-2xl w-full px-2 sm:px-6 py-4 sm:py-8 flex flex-col items-center gap-8 font-urbanist"
                  style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 2px 32px 0 rgba(0,0,0,0.25)' }}
                >
                  {/* Top icon */}
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-neutral-200 mb-6 relative group transition-all duration-300">
                    <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-60 group-hover:blur-2xl" style={{ zIndex: 0 }} />
                    <span className="relative z-10 flex items-center justify-center w-full h-full">
                      <MessageSquareQuoteIcon className="h-10 w-10 text-black transition-all duration-300 group-hover:scale-110" />
                    </span>
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
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                      onClick={() => {
                        // Try to focus and scroll to the name input by ref or fallback to querySelector
                        let input: HTMLInputElement | null = null;
                        if (nameInputRef && nameInputRef.current) {
                          input = nameInputRef.current;
                        } else {
                          input = document.querySelector('input[placeholder="Your Name"]') as HTMLInputElement;
                        }
                        if (input) {
                          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setTimeout(() => input && input.focus(), 1000);
                        }
                      }}
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
                      <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#18181f] border border-white/10 text-white hover:bg-neutral-400 hover:text-white transition-all" title="Twitter">
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
                className="w-full border-t border-white/10 mt-4 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-400 text-xs sm:text-sm z-10 transition-all duration-300"
                style={{ minHeight: '64px' }}
              >
                <span className="font-normal text-center sm:text-left">© 2025 TARS AI. All rights reserved.</span>
                <button
                  onClick={scrollToTopAndFocus}
                  className="px-3 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors duration-300 text-xs sm:text-sm font-medium focus:outline-none"
                >
                  Back to Top
                </button>
              </m.footer>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}