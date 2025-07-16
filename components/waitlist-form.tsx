"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  onSuccess: (data: { email: string; name: string; id: number; position: number }) => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "User"
    }
  });

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join waitlist");
      }

      const result = await response.json();
      onSuccess({
        email: result.email,
        name: data.name,
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
      className="w-full max-w-lg mx-auto space-y-4"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-urbanist w-full">
        {/* Hidden name field with default value */}
        <input type="hidden" {...register("name" )} />
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="rounded-full border border-transparent focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-2 sm:mt-4 bg-neutral-950 placeholder:text-neutral-700 h-12 px-6 text-white outline-none transition-all duration-300 font-urbanist text-base sm:text-lg"
          {...register("email")}
        />
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-2 sm:mt-4 w-full sm:w-auto"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-base font-medium text-white backdrop-blur-3xl space-x-2 relative z-10">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Join</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </span>
        </button>
      </form>
      {/* Error Message */}
      <AnimatePresence>
        {(error || errors.email) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm text-center relative z-10"
          >
            {error || errors.email?.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}