import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, BarChart3 } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative pt-48 pb-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 117, 255, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground mb-10">
            The <span className="text-primary italic">Google</span> Map For Your{" "}
            <br className="hidden md:block" />
            Migration <span className="text-primary">Journey</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-14 leading-relaxed">
            Your AI assistant for personalized migration insights, structured learning, document reviews, and step-by-step guidance to help you achieve your relocation goals before spending a dime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-8 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/quiz">Take The Free AI Quiz</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-8 text-xl border-2 border-primary text-primary hover:bg-primary/5 transition-all hover:scale-105 active:scale-95"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow behind image */}
          <div
            className="absolute -z-10 pointer-events-none"
            style={{
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "130%",
              height: "100%",
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, #c8d9ff 0%, #deeaff 30%, #eef4ff 55%, transparent 75%)",
              filter: "blur(32px)",
            }}
          />

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl bg-white p-2">
            <img
              src="/images/system-ui.png"
              alt="Real JapaLearn Dashboard"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Top-right floating card */}
          <div className="absolute top-12 -right-12 hidden lg:block z-20">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-blue-100 flex items-start gap-4 max-w-[280px] text-left"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-900 leading-none">Score Updated</p>
                <p className="text-xs text-muted-foreground leading-snug">
                  Your readiness score increased to 72%
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom-left floating card */}
          <div className="absolute bottom-12 -left-12 hidden lg:block z-20">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-green-100 flex items-start gap-4 max-w-[280px] text-left"
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-900 leading-none">3 courses enrolled</p>
                <p className="text-xs text-muted-foreground leading-snug">
                  IELTS, Documents, Visa Guide
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
