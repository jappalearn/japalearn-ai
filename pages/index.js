import Head from 'next/head'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/layout/Hero'
import { Stats } from '@/components/layout/Stats'
import { ProblemSection } from '@/components/layout/ProblemSection'
import { Roadmap } from '@/components/layout/Roadmap'
import { Testimonials } from '@/components/layout/Testimonials'
import { Footer } from '@/components/layout/Footer'

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>JapaLearn AI — Your Migration Roadmap, Built by AI</title>
        <meta name="description" content="Get personalised migration guidance through AI. Know your visa route, readiness score, and step-by-step plan before spending a dime." />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          <Hero />
          <Stats />
          <ProblemSection />
          <Roadmap />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  )
}
