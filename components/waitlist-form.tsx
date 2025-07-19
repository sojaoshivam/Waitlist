
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight, User, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// The validation schema requires both name and a specific email format
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address").refine((val: string) => val.endsWith("@gmail.com"), {
    message: "Only @gmail.com emails are allowed",
  }),
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ''\- ]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  onSuccess: (data: { email: string; name: string; id: number; position: number }) => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const nameValue = watch("name");
  const emailValue = watch("email");

  // This function is called by handleSubmit only after successful validation
  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to join waitlist");
      }

      onSuccess({
        email: result.email,
        name: result.name,
        id: result.id,
        position: result.position,
      });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xs sm:max-w-sm mx-auto space-y-3"
    >
      {/* The form uses `handleSubmit` which handles validation before calling `onSubmit` */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-3 font-urbanist w-full max-w-xs sm:max-w-sm mx-auto">
        
        {/* Name Input Field */}
        <div className="relative w-full">
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200
              ${nameFocused || nameValue ? 'scale-125 text-[#E0E0E0] drop-shadow-[0_0_6px_#E0E0E0]' : 'text-neutral-500 scale-100'}`}
            style={{ zIndex: 2 }}
          >
            <User className="h-5 w-5" style={{ background: 'none' }} />
          </span>
          <input
            type="text"
            placeholder="Your Name"
            className="bg-neutral-950 placeholder:text-neutral-400 placeholder:font-light placeholder:opacity-40 text-white h-10 pl-12 pr-3 transition-all duration-200 font-urbanist text-sm sm:text-base rounded-lg w-full border-none focus:border-none focus:ring-0 focus:outline-none shadow-md"
            style={{ WebkitBoxShadow: '0 0 0 1000px #101010 inset', boxShadow: '0 0 0 1000px #101010 inset', WebkitTextFillColor: 'white' }}
            {...register("name")}
            autoComplete="off"
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </div>

        {/* Email Input Field */}
        <div className="relative w-full">
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200
              ${emailFocused || emailValue ? 'scale-125 text-[#E0E0E0] drop-shadow-[0_0_6px_#E0E0E0]' : 'text-neutral-500 scale-100'}`}
            style={{ zIndex: 2 }}
          >
            <Mail className="h-5 w-5" style={{ background: 'none' }} />
          </span>
          <input
            type="email"
            placeholder="Email Address"
            className="bg-neutral-950 placeholder:text-neutral-400 placeholder:font-light placeholder:opacity-40 text-white h-10 pl-12 pr-3 transition-all duration-200 font-urbanist text-sm sm:text-base rounded-lg w-full border-none focus:border-none focus:ring-0 focus:outline-none shadow-md"
            style={{ WebkitBoxShadow: '0 0 0 1000px #101010 inset', boxShadow: '0 0 0 1000px #101010 inset', WebkitTextFillColor: 'white' }}
            {...register("email")}
            autoComplete="off"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-[#23232b] to-[#18181f] px-3 py-1 text-white font-medium font-urbanist text-sm sm:text-base transition-all duration-200 border-none focus:outline-none w-full shadow-md mt-2"
        >
          <span className="inline-flex items-center justify-center h-full w-full cursor-pointer space-x-2 relative z-10 transition-all duration-200">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="transition-all duration-150 group-active:scale-105 group-active:text-[#E0E0E0]">Join the waitlist</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-all duration-150 group-active:scale-125 group-active:text-[#E0E0E0]" />
              </>
            )}
          </span>
        </button>
      </form>
      
      {/* Error Message Display */}
      <AnimatePresence>
        {(error || errors.name || errors.email) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm text-center relative z-10"
          >
            {error || errors.name?.message || errors.email?.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
