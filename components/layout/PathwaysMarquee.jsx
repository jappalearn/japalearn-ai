import React from 'react'
import { motion } from 'framer-motion'

const pathways = [
  { name: 'Canada Study Permit', code: 'ca' },
  { name: 'UK Student Visa', code: 'gb' },
  { name: 'USA F-1 Student Visa', code: 'us' },
  { name: 'Ireland Study Visa', code: 'ie' },
  { name: 'Australia Student Visa', code: 'au' },
  { name: 'Fully Funded Scholarships', code: 'un' },
  { name: 'Health & Care Worker (UK)', code: 'gb' },
  { name: 'Healthcare Express Entry', code: 'ca' },
  { name: 'Skilled Worker Pathway', code: 'gb' },
  { name: 'Opportunity Card (Germany)', code: 'de' },
  { name: 'Critical Skills (Ireland)', code: 'ie' },
  { name: 'EB-2 NIW (USA)', code: 'us' },
  { name: 'Global Talent Pathway', code: 'gb' },
  { name: 'EU Blue Card (Germany)', code: 'de' },
  { name: 'Merit-Based Scholarships', code: 'eu' },
  { name: 'Study-to-PR Pathway', code: 'ca' },
  { name: 'Chevening Scholarship', code: 'gb' },
  { name: 'Erasmus Mundus (Europe)', code: 'eu' },
]

export const PathwaysMarquee = () => {
  // Multiply the array to create a seamless loop
  const marqueeItems = [...pathways, ...pathways, ...pathways]

  return (
    <section id="pathways" className="py-20 bg-white overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
        >
          Destinations & Routes
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight"
        >
          Pathways <span className="text-secondary text-[#000000]">We Cover</span>
        </motion.h2>
      </div>

      <div className="relative flex whitespace-nowrap overflow-hidden py-4">
        <motion.div
          animate={{ x: [0, -1035] }} // Adjust based on content width
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 group"
        >
          {marqueeItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-[#f8faff] border border-blue-50/50 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default group"
            >
              <img 
                src={`https://flagcdn.com/w80/${item.code === 'un' ? 'un' : item.code}.png`} 
                alt={item.name}
                className="w-8 h-auto rounded-sm shadow-sm opacity-60 grayscale-[0.2] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-[17px] font-bold text-gray-800 font-heading">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Reverse Marquee for depth */}
      <div className="relative flex whitespace-nowrap overflow-hidden py-4 mt-2">
        <motion.div
          animate={{ x: [-1035, 0] }}
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 group"
        >
          {[...marqueeItems].reverse().map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default group"
            >
              <img 
                src={`https://flagcdn.com/w80/${item.code === 'un' ? 'un' : item.code}.png`} 
                alt={item.name}
                className="w-8 h-auto rounded-sm shadow-sm opacity-60 grayscale-[0.2] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-[17px] font-bold text-gray-800 font-heading">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
