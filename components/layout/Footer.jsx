import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const Footer = () => {
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-white">
      {/* CTA Section */}
      <section className="cta-grid py-16 sm:py-20 md:py-24 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-5 leading-tight"
          >
            Ready To Start Your Journey <br className="hidden sm:block" /> the Right Way?
          </motion.h2>
          <p className="text-white/70 mb-8 sm:mb-10 max-w-md mx-auto text-sm leading-relaxed px-2">
            Join thousands of Nigerians who have transformed their migration
            dreams into reality with JapaLearn AI.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/95 rounded-full px-8 sm:px-12 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          >
            <Link href="/quiz">Take The Free AI Quiz</Link>
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-10 sm:mt-14 text-xs sm:text-sm text-white/70">
            {["AI-Powered Analysis", "Expert Curated Content", "87% Success Rate"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email subscription */}
      <div className="bg-[#f6f9ff] py-12 sm:py-16 text-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-3 leading-snug">
            Dreaming of relocating but don&apos;t <br className="hidden sm:block" /> know where to start?
          </h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Sign up to get real relocation stories, guides, and expert tips straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-12 px-5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm transition-all"
            />
            <Button className="h-12 px-7 rounded-full bg-primary hover:bg-primary/90 font-semibold text-sm shrink-0 w-full sm:w-auto">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-5 text-center px-4">
        <p className="text-xs text-muted-foreground">
          Copyright © {new Date().getFullYear()} JapaLearn. Not a visa agency · Not legal advice.
        </p>
      </div>

      {/* Watermark */}
      <div className="overflow-hidden bg-white">
        <motion.p
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[18vw] font-heading font-bold text-primary/10 leading-none select-none text-center whitespace-nowrap"
        >
          JapaLearn
        </motion.p>
      </div>
    </footer>
  )
}
