import React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Dr. Chinedu Okafor",
    role: "Medical Professional",
    rating: 4,
    text: "The platform broke down medical migration requirements in a way that actually made sense. It saved me time and costly mistakes.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Aisha Bello",
    role: "Student",
    rating: 5,
    text: "Japalearn AI helped me understand my migration options as a student without feeling overwhelmed.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Zainab Yusuf",
    role: "Content Creator",
    rating: 3,
    text: "I didn't think my creative skills could count. Japalearn AI showed me how my experience fits into real migration pathways.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Tunde Adebayo",
    role: "Software Engineer",
    rating: 3,
    text: "As a tech professional, I needed clarity, not guesses. Japalearn AI gave me a realistic, step-by-step plan.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-1 mb-5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
      />
    ))}
  </div>
)

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
          >
            OUR TESTIMONIALS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight"
          >
            Check out what <br />
            our customers <span className="text-primary">have to say</span>
          </motion.h2>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <StarRating rating={t.rating} />
                <p className="text-sm text-foreground/80 leading-relaxed italic mb-8">
                  &quot;{t.text}&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-border shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none mb-1">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
