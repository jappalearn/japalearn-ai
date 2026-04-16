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
    answer: "You answer a short set of questions about your background — such as your education, work experience, finances, and goals. The AI then analyzes your profile and matches you with the most suitable migration pathways, highlighting what you qualify for and what you need to improve."
  },
  {
    question: "Is JapaLearn AI a visa agency?",
    answer: "No. JapaLearn AI is not a visa agency and does not process applications. We provide educational guidance, structured information, and tools to help you understand your options and prepare correctly."
  },
  {
    question: "How much does it cost?",
    answer: "For now, using JapaLearn AI is completely free. In the future, we may introduce subscriptions or a credit-based system as we expand features based on user needs."
  },
  {
    question: "How long does it take to get my roadmap?",
    answer: "Your personalized roadmap is generated instantly after you complete the quiz and create your account."
  },
  {
    question: "What countries does JapaLearn AI support?",
    answer: "We currently support major migration destinations including Canada, the United Kingdom, the United States, Australia, New Zealand, and selected European countries, with more being added over time."
  },
  {
    question: "Who is JapaLearn AI for?",
    answer: "JapaLearn AI is designed for students and graduates, tech professionals, healthcare workers, skilled workers, freelancers and remote workers, business owners, and families planning relocation."
  },
  {
    question: "What do I get after my roadmap is generated?",
    answer: "You will receive recommended migration pathways, a step-by-step action plan, required document checklists, cost estimates, timeline guidance, and learning resources tailored to your path."
  },
  {
    question: "Can I update my answers later?",
    answer: "Yes. You can retake the quiz as many times as possible, and your new profile will reflect your updated answers. Your roadmap will automatically adjust based on your latest information."
  },
  {
    question: "Is the information accurate and up to date?",
    answer: "Yes. JapaLearn AI uses official government sources and trusted data providers to ensure your roadmap reflects the latest requirements and policies."
  },
  {
    question: "Do I still need an agent or consultant?",
    answer: "Not always. Many users can complete their journey using the guidance provided. However, for complex cases, you may still choose to work with a licensed professional."
  },
  {
    question: "Is my data safe?",
    answer: "Yes. Your data is securely stored and used only to improve your experience and generate accurate recommendations."
  },
  {
    question: "Can I use JapaLearn AI on my phone?",
    answer: "Yes. The platform is designed to work smoothly on both mobile and desktop devices."
  },
  {
    question: "What makes JapaLearn AI different?",
    answer: "Unlike random online searches, JapaLearn AI gives you a personalized roadmap, structured learning instead of scattered information, and clear next steps."
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
