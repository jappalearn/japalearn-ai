import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const steps = [
  {
    id: "01",
    title: "Take AI Pathway Quiz",
    description:
      "Answer a few questions about your goals, background, and resources. Our AI analyzes 100+ pathways to find your best matches.",
    highlight: "60 seconds",
  },
  {
    id: "02",
    title: "Get Your Personalized Roadmap",
    description:
      "Receive a clear, step-by-step roadmap tailored to your situation. No generic advice, just actionable guidance.",
    highlight: "Instant results",
  },
  {
    id: "03",
    title: "Learn with Structured Courses",
    description:
      "Access bite-sized lessons and document templates from seasoned migration experts. Everything you need to prepare properly.",
    highlight: "Self-paced",
  },
  {
    id: "04",
    title: "Apply with Confidence",
    description:
      "Submit your application knowing you've done everything right. No guesswork, no anxiety, no preventable mistakes.",
    highlight: "Higher success rate",
  },
]

const StepItem = ({ step, index, direction }) => (
  <motion.div
    key={step.id}
    initial={{ opacity: 0, x: direction === "left" ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="text-left"
  >
    <span className="text-5xl font-normal text-primary block mb-3 leading-none">
      {step.id}
    </span>
    <h3 className="text-xl font-bold text-foreground mb-2 leading-snug">{step.title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{step.description}</p>
    <span className="text-sm font-medium text-primary">{step.highlight}</span>
  </motion.div>
)

export const Roadmap = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight"
          >
            Your pathway to <span className="text-primary">success</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto text-muted-foreground text-sm mt-4 leading-relaxed"
          >
            Clear steps, AI-powered guidance, and expert-curated content — everything
            you need to relocate with confidence.
          </motion.p>
        </div>

        {/* 3-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left steps */}
          <div className="space-y-14">
            {[steps[0], steps[1]].map((step, index) => (
              <StepItem key={step.id} step={step} index={index} direction="left" />
            ))}
          </div>

          {/* Center — browser mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div
              className="absolute pointer-events-none -z-10"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "150%",
                height: "150%",
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, #c8d9ff 0%, #deeaff 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="w-full rounded-2xl border border-border shadow-xl overflow-hidden">
              <Image
                src="/images/system-ui2.png"
                alt="JapaLearn AI Dashboard"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Right steps */}
          <div className="space-y-14">
            {[steps[2], steps[3]].map((step, index) => (
              <StepItem key={step.id} step={step} index={index} direction="right" />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-14 py-7 bg-primary hover:bg-primary/90 shadow-lg transition-all hover:scale-105 active:scale-95 text-base font-medium"
          >
            <Link href="/quiz">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
