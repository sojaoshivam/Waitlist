'use client'; // Ensures client-side interactivity for Accordion and button

import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqData = [
    {
      question: "How does the waitlist work?",
      answer: "Sign up for early access and get updates plus exclusive entry before the public launch. We&apos;ll notify you as soon as TARS AI is ready for you to try."
    },
    {
      question: "Is there a cost to join the waitlist?",
      answer: "No, joining the waitlist is completely free. You'll get early access and updates at no cost. We believe in making AI accessible to everyone."
    },
    {
      question: "What is TARS AI exactly?",
      answer: "TARS AI is a document intelligence platform and PDF chatbot that helps you chat with your documents, search through them intelligently, and get instant answers."
    },
    {
      question: "When will the product launch?",
      answer: "We're launching soon! Join the waitlist for updates and be among the first to experience the future of document intelligence."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full py-20 lg:py-40"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex gap-10 flex-col max-w-xl self-start">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline" className="border-white/20 text-white">FAQ</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular text-white">
                  Got questions? We&apos;ve got answers
                </h4>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-neutral-400 text-left">
                   Can&apos;t find what you&apos;re looking for? Reach out to us directly.
                </p>
              </div>
              <a
                href="mailto:teammurph@tarsai.live"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black font-medium shadow transition-all border border-white/20 w-fit"
              >
                <Mail className="w-5 h-5" />
                Any questions? Reach out
              </a>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full" value={openIndex !== null ? `faq-${openIndex}` : undefined} onValueChange={val => {
            if (val && val.startsWith('faq-')) {
              setOpenIndex(Number(val.replace('faq-', '')));
            } else {
              setOpenIndex(null);
            }
          }}>
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-white/10">
                <AccordionTrigger className="text-white hover:text-neutral-300 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent asChild>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="text-neutral-400 break-words px-4 py-3 md:px-6 md:py-4 overflow-hidden"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </motion.div>
  );
}

export default FAQSection;
