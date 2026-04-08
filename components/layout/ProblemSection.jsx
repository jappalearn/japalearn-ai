import React from "react"
import { motion } from "framer-motion"
import { HelpCircle, Users, XCircle, TriangleAlert } from "lucide-react"

const problems = [
  {
    icon: <HelpCircle className="w-5 h-5 text-red-400" />,
    value: "67%",
    valueLabel: "Feel lost at the start",
    title: "Overwhelming Confusion",
    description:
      "Hundreds of visa types, changing rules, contradictory advice. Where do you even start?",
  },
  {
    icon: <Users className="w-5 h-5 text-red-400" />,
    value: "₦50B+",
    valueLabel: "lost annually to scams",
    title: "Predatory Agents",
    description:
      "Fake agents, inflated fees, broken promises. Millions lost to scams every year.",
  },
  {
    icon: <XCircle className="w-5 h-5 text-red-400" />,
    value: "40%",
    valueLabel: "rejection rate (avoidable)",
    title: "Preventable Rejections",
    description:
      "Wrong pathway, incomplete documents, poor preparation. Rejections that didn't have to happen.",
  },
  {
    icon: <TriangleAlert className="w-5 h-5 text-red-400" />,
    value: "3+ years",
    valueLabel: "average time wasted",
    title: "Misaligned Goals",
    description:
      "Wrong courses, unsuitable countries, misaligned goals. Years and money spent on the wrong path.",
  },
]

export const ProblemSection = () => {
  return (
    <section className="pt-24 pb-48 relative overflow-hidden bg-white">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 400px at 50% 520px, #c8d9ff 0%, #deeaff 25%, #eef3ff 50%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-primary mb-3"
          >
            THE PROBLEM
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-5 leading-tight"
          >
            Why most Japa journeys <span className="text-primary">fail</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed"
          >
            The current system is broken. Information is scattered, agents are
            unreliable, and too many dreams end in rejection emails.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-7 rounded-3xl border border-border hover:shadow-lg transition-shadow flex flex-col gap-4"
            >
              <div className="w-9 h-9 rounded-full border border-red-200 bg-red-50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-3xl font-normal text-foreground leading-none mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground font-normal">
                  {item.valueLabel}
                </p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm font-bold text-foreground mb-2">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
