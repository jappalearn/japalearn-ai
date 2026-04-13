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
          <p className="text-white mb-8 sm:mb-10 max-w-md mx-auto text-sm leading-relaxed px-2">
            Join thousands of Nigerians who have transformed their migration
            dreams into reality with JapaLearn AI.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-white/95 rounded-full px-8 sm:px-12 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto" style={{ color: '#3b75ff' }}
          >
            <Link href="/quiz">Take The Free AI Quiz</Link>
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-10 sm:mt-14 text-xs sm:text-sm text-white">
            {["AI-Powered Analysis", "Expert Curated Content", "87% Success Rate"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
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

      {/* Main Footer Content */}
      <div className="border-t border-border bg-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1 border-r-0 md:border-r border-border pr-0 md:pr-8">
              <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-heading font-bold text-primary">JapaLearn</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Your smart companion for navigating the path to global opportunities. We simplify the relocation process with AI-driven insights.
              </p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors"><span className="sr-only">Twitter</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                <a href="#" className="hover:text-primary transition-colors"><span className="sr-only">LinkedIn</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              </div>
            </div>
            
            <div className="md:col-span-1 md:pl-4">
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/quiz" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Assessment</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1 md:pl-4">
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">Destination Guides</Link></li>
                <li><Link href="/success-stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1 md:pl-4">
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} JapaLearn. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Disclaimer: Not a visa agency · Not legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
