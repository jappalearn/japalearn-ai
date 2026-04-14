import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What exactly is JapaLearn AI?",
    answer: "JapaLearn AI is an educational intelligence platform designed to simplify the complex process of migration. We combine AI-driven assessments with structured e-learning to give you a clear, step-by-step roadmap to your international goals."
  },
  {
    question: "How does the AI readiness assessment work?",
    answer: "Our AI analyzes your unique profile—including education, work experience, age, and savings—against over 40 immigration routes globally. It then calculates your readiness score and identifies the highest-probability pathway for you."
  },
  {
    question: "Is JapaLearn AI a visa agency?",
    answer: "No. We are an educational platform. We provide the information, curriculum, and tools you need to succeed, but we do not submit visa applications on your behalf or provide legal representation."
  },
  {
    question: "How much does it cost?",
    answer: "The initial AI assessment is free. For those who want more depth, we offer premium curriculum access and mentor-led support at various price points. Check our Pricing section for more details."
  },
  {
    question: "How long does it take to get my roadmap?",
    answer: "Your initial digital report is generated instantly after you complete the 2-minute assessment. Detailed e-learning roadmaps are available immediately upon enrollment."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "We offer a satisfaction guarantee for our premium curriculum. If you feel the information provided didn't help you gain clarity on your migration journey within the first 7 days, we'll provide a full refund."
  }
]

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors focus:outline-none group"
      >
        <span className="text-base md:text-lg font-bold text-gray-800 font-heading">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400 group-hover:text-primary"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-24 bg-[#fcfdff]">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
          >
            QUESTIONS & ANSWERS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            Frequently Asked <span className="text-primary italic">Questions</span>
          </motion.h2>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              toggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
