import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/lib/Logo"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Features", href: "/#how-it-works" },
  { name: "Pathways", href: "/#pathways" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Blogs", href: "/blog" },
  { name: "FAQs", href: "/#faq" },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
        scrolled ? "py-4" : "py-6",
      )}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between bg-white border border-gray-100 rounded-3xl px-4 md:px-6 lg:px-8 py-2.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size={32} />
          <span className="text-lg font-heading font-bold text-black">JapaLearn <span className="text-primary">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-10">
          {navItems.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm lg:text-[15px] font-medium text-gray-700 hover:text-primary transition-colors flex items-center gap-1"
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown className="w-4 h-4 opacity-70" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Sign in
          </Link>
          <Button
            asChild
            className="rounded-full px-6 py-5 lg:px-8 lg:py-6 bg-primary hover:bg-primary/90 text-white font-medium text-sm lg:text-[15px] transition-all shadow-sm"
          >
            <Link href="/quiz">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-white border border-border rounded-2xl p-6 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground/70 flex items-center justify-between"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-5 h-5" />}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-center text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Button
                  asChild
                  className="w-full rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Link href="/quiz" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
