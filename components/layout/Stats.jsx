import React, { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"

const Counter = ({ value, duration = 2 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const numericValue = parseInt(value.replace(/[^0-9]/g, ""))
  const suffix = value.replace(/[0-9]/g, "")

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => `${latest}${suffix}`)

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { duration, ease: "easeOut" })
      return controls.stop
    }
  }, [isInView, count, numericValue, duration])

  return <motion.span ref={ref}>{displayText}</motion.span>
}

export const Stats = () => {
  return (
    <section className="py-10 border-y border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Left Side */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:max-w-xs">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-foreground leading-snug tracking-tight">
              <Counter value="100+" duration={2.5} /> happy customers.
            </h2>
            <p className="mt-2 text-sm font-normal text-muted-foreground">
              Using JapaLearn AI and loving it!
            </p>
          </div>

          {/* Divider — only on lg */}
          <div className="hidden lg:block w-px h-12 bg-border" />

          {/* Right Side — stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 w-full lg:w-auto">
            {[
              { value: "100+", label: "LEARNERS" },
              { value: "87%", label: "SUCCESS RATE" },
              { value: "10+", label: "COUNTRIES" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-normal text-blue-500 leading-none">
                  <Counter value={value} />
                </span>
                <span className="mt-2 text-[9px] sm:text-[10px] font-light text-muted-foreground uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
