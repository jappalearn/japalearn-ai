'use client';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  MessageCircle,
  User,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  X,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Post Data (mock — will be replaced by gray-matter + fs in production) ──────
const POST_DATA = {
  title: "10 Affordable Countries Nigerian Students Can Study Medicine in 2026",
  date: "April 14, 2026",
  category: "Visa Guides",
  author: "Victory from JapaLearn",
  readTime: "12 min",
  image: "https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=1400",
  excerpt: "Many Nigerian students grow up with the dream of becoming a doctor. We researched the top 10 destinations where you can get a globally recognised medical degree without breaking the bank.",
  content: `
Many Nigerian students grow up with the dream of becoming a doctor. You spend years studying, writing JAMB, trying UTME again, watching cut-off marks, and praying for a miracle at the end of each admission cycle. And when the Nigerian system does not cooperate, the next logical question becomes: what if I study medicine abroad?

It is a valid question, but the moment you start researching, you hit another wall: medical education abroad sounds expensive. And honestly, in many countries it is. A single year of medical school in the United States can cost more than $60,000. The UK is not far behind, and Canada is similar. For most Nigerian families, those numbers are simply not realistic.

But there's something we want you to know before you give up on the dream entirely. There are countries in the world where you can get a solid, internationally recognised medical degree, without breaking a bank or taking a loan that will follow you for the next decade. We researched the options, looked at tuition fees, living costs, visa processes, and degree recognition, and put together this guide specifically for Nigerian medical students planning ahead for 2026.

Let us walk you through all 10 of them.

---

### 1. Poland
Poland does not always come up in conversations about studying medicine abroad, but it should. It is a full European Union member state, its universities are accredited and globally recognised, and the tuition fees are significantly lower than what you would pay in Western Europe.

**Quick Facts:**
*   **Tuition**: $7,000 – $13,400 per year
*   **Living Costs**: $400 – $800 per month
*   **Duration**: 6 years (English-taught)

Polish medical degrees are listed in the World Directory of Medical Schools (WDOMS), and graduates are eligible to sit for licensing exams like PLAB and USMLE. For your student visa, you will apply for a Polish national visa (Type D). Processing generally takes between four and eight weeks.

### 2. Hungary
Hungary is an EU member state with a long track record of training international doctors. It has universities that are respected globally, including Semmelweis University, the University of Debrecen, and the University of Pecs.

**Quick Facts:**
*   **Tuition**: $10,000 – $20,000 per year
*   **Living Costs**: $600 – $900 per month
*   **Scholarship**: Stipendium Hungaricum (Covers tuition, accommodation, and stipend)

A degree from Hungary is recognised across the EU and accepted for licensing exams including PLAB and USMLE. Nigerian students are eligible for the Stipendium Hungaricum scholarship, which can drop your costs to near zero.

### 3. Russia
Russia has one of the longest histories of training African medical students. Affordability is a significant part of why.

**Quick Facts:**
*   **Tuition**: $2,800 – $4,300 per year
*   **Living Costs**: $425 – $685 per month
*   **Total Program Cost**: Approximately $17,000 – $26,000

While highly affordable, the current geopolitical situation allows for practical complications, including international banking challenges. Before you commit, speak to current Nigerian students who are already there to get firsthand accounts of the experience.

### 4. India
India is a destination that Nigerian medical students often overlook. With over 700 medical colleges and enormous clinical exposure, India offers training competitive with many Western institutions.

**Quick Facts:**
*   **Tuition (Private)**: $5,000 – $15,000 per year
*   **Living Costs**: $300 – $500 per month
*   **Language**: English-medium across all major colleges

Indian medical degrees can qualify graduates to sit for licensing exams in Nigeria, the UK, and the US. One major advantage is that English is widely used for both education and daily life.

### 5. Philippines
The Philippines has a very specific advantage: the curriculum is American-patterned. If your long-term plan involves the USMLE, this alignment can be a significant benefit.

**Quick Facts:**
*   **Tuition**: $3,000 – $6,000 per year
*   **Living Costs**: $400 – $600 per month
*   **Focus**: Success in USMLE-driven preparation

The Philippines is an English-speaking country, removing the adjustment most other countries require. Filipino medical graduates have a strong track record when it comes to passing international licensing exams.

### 6. Germany
If you are willing to learn the German language (B2/C1 level), Germany might be the best deal on medical education anywhere in the world.

**Quick Facts:**
*   **Tuition**: Near zero (Public Universities)
*   **Semester Fee**: $250 – $350
*   **Requirements**: German proficiency is mandatory

If you commit to the language and get admitted to a public university, you can graduate from a world-class program with almost no tuition debt.

### 7. Turkey
Turkey has grown significantly as a medical education destination. It sits at the intersection of Europe and Asia and offers English-taught programs at many well-regarded universities.

**Quick Facts:**
*   **Tuition (Public)**: $2,000 – $5,000 per year
*   **Living Costs**: $400 – $700 per month
*   **Hospital Exposure**: Modern healthcare systems with diverse clinical cases

Before you commit, confirm the MDCN recognition status for your specific university, as not all Turkish institutions are on the approved list for Nigeria.

### 8. Romania
As a full EU member state, medical degrees from Romanian public universities carry EU recognition, opening doors for practice across Europe and Nigeria.

**Quick Facts:**
*   **Tuition (English-medium)**: $4,500 – $11,000 per year
*   **Living Costs**: $400 – $700 per month
*   **Community**: Significant local community of Nigerian and African students

Romanian living costs are among the lowest in the EU, balancing high-quality education with financial reality.

### 9. Georgia
Georgia has become one of the fastest-growing destinations due to its affordable fees and English-taught programs.

**Quick Facts:**
*   **Tuition**: $4,500 – $7,000 per year
*   **Living Costs**: $300 – $600 per month
*   **Admission**: Often does not require UCAT or complex entrance exams

If you have a strong academic record, the path to admission in Georgia is more straightforward than in most European countries.

### 10. Cyprus
Cyprus offers EU-standard education with a warm Mediterranean climate. English is widely spoken, making the transition from Nigeria smoother than most Eastern European options.

**Quick Facts:**
*   **Tuition**: $5,000 – $10,000 per year
*   **Living Costs**: $600 – $900 per month
*   **Location**: Always choose the Republic of Cyprus (EU) over Northern Cyprus for international recognition

---

### Before You Apply: The 4 Critical Checkpoints
None of these destinations will work for you if you skip the due diligence.

1.  **MDCN & WDOMS Recognition**: Make sure your chosen university is recognized by the Medical and Dental Council of Nigeria and listed in the World Directory of Medical Schools.
2.  **Calculate Your Real Budget**: Add visa fees, flights, health insurance, and setup costs (first 3 months).
3.  **Language Barriers**: Even in English-taught programs, you will need conversational local language skills for clinical hospital rotations.
4.  **Scholarship Hunting**: Investigate the Stipendium Hungaricum (Hungary) or DAAD (Germany) before paying full price.

Studying medicine abroad is possible. It requires research, realistic planning, and honesty about your budget. JapaLearn AI exists to help you figure out which option actually makes sense for your specific situation.

*Victory from JapaLearn · April 14, 2026*
`,
  faqs: [
    {
      question: "Are medical degrees from these countries recognized in Nigeria?",
      answer: "Most are, but you must verify each specific university on the MDCN (Medical and Dental Council of Nigeria) approved list before applying. Listing in the World Directory of Medical Schools (WDOMS) is also a critical requirement."
    },
    {
      question: "Is there a language barrier in these non-English speaking countries?",
      answer: "Most universities on this list offer medicine in English. However, you will still need to learn the local language for clinical rotations to communicate with patients during your 4th, 5th, and 6th years."
    },
    {
      question: "Can I work while studying medicine abroad?",
      answer: "Medicine is a demanding full-time course. While some countries allow part-time student work, it is highly recommended to have your full financial backing secured so you can focus on your studies."
    },
    {
      question: "What is the Stipendium Hungaricum scholarship?",
      answer: "It is a Hungarian government scholarship that covers full tuition and accommodation, and provides a monthly stipend. It is one of the best ways for Nigerian students to study medicine for free in the EU."
    }
  ],
  relatedPosts: [],
  authorImage: "/images/victory.png"
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'shadow-md shadow-primary/5' : ''}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-gray-50/60 transition-colors"
      >
        <span className="font-semibold text-foreground text-base leading-snug pr-4">{faq.question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${open ? 'bg-primary text-white' : 'bg-gray-100 text-muted-foreground'}`}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm border-t border-border/40 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Share Modal ─────────────────────────────────────────────────────────────
function ShareModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Share this article</h3>
            <p className="text-xs text-muted-foreground mt-1">Help a fellow Nigerian on their Japa journey</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {/* WhatsApp */}
          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + '\n\n' + shareUrl)}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Share with your network</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
          </button>

          {/* Twitter / X */}
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-black hover:bg-black/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25h6.634l4.717 6.237L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">X (Twitter)</p>
              <p className="text-xs text-muted-foreground">Post to your followers</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-black group-hover:translate-x-1 transition-all" />
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[#0077b5] hover:bg-[#0077b5]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">LinkedIn</p>
              <p className="text-xs text-muted-foreground">Share professionally</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-[#0077b5] group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 transition-all font-semibold text-sm ${copied ? 'border-green-500 bg-green-50 text-green-600' : 'border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          {copied ? 'Link Copied!' : 'Copy Link'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <motion.div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BlogPost() {
  const post = POST_DATA;
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{post.title} · JapaLearn AI</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Head>

      <ReadingProgress />

      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <main className="grow pt-28">
          {/* ── Hero Header ─────────────────────────────────────────── */}
          <div className="relative w-full h-[55vh] min-h-[400px] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-4xl mx-auto px-4 md:px-6 pb-12 w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20">
                      {post.category}
                    </span>
                    <span className="text-white/60 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime} read
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 leading-tight max-w-3xl">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{post.author}</p>
                        <p className="text-white/60 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShareOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/25 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── Back Link ───────────────────────────────────────────── */}
          <div className="max-w-4xl mx-auto px-4 md:px-6 mt-8 mb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to The JapaLearn Journal
            </Link>
          </div>

          {/* ── Article Content ─────────────────────────────────────── */}
          <article className="max-w-4xl mx-auto px-4 md:px-6 pb-16">

            {/* Excerpt callout */}
            <div className="my-8 p-6 rounded-2xl bg-primary/5 border-l-4 border-primary">
              <p className="text-base text-foreground/80 leading-relaxed font-medium italic">{post.excerpt}</p>
            </div>

            {/* Main content - Protected Section Style */}
            <div className="bg-gray-50 border border-gray-100 rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-12 shadow-sm mb-16">
              <div className="blog-content prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* ── FAQ Section ──────────────────────────────────────── */}
            <section className="mt-20 pt-16 border-t border-border">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-10 text-sm">
                The most common questions from Nigerians asking about this topic.
              </p>
              <div className="space-y-3">
                {post.faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-border bg-white text-muted-foreground font-semibold text-sm hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <Share2 className="w-4 h-4" /> Share This Article
                </button>
              </div>
            </section>

            {/* ── Related Posts ────────────────────────────────────── */}
            <section className="mt-20 pt-16 border-t border-border">
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">KEEP READING</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Related Articles</h2>
                <p className="text-muted-foreground text-sm mt-2">More expert migration insights for Nigerians</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.relatedPosts.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${related.slug}`} className="group block bg-[#FAFBFF] rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all">
                      <div className="h-44 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-wider">{related.category}</span>
                        <h3 className="font-bold text-foreground mt-2 mb-3 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{related.excerpt}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{related.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {related.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

          </article>
        </main>

        <Footer />
      </div>

      {/* ── Share Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {shareOpen && <ShareModal post={post} onClose={() => setShareOpen(false)} />}
      </AnimatePresence>

      <style jsx global>{`
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.2;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blog-content p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 1.25rem;
          font-size: 1.05rem;
        }
        .blog-content ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        .blog-content ul li {
          position: relative;
          padding-left: 1.5rem;
          color: #4b5563;
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        .blog-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #3b82f6;
        }
        .blog-content ol {
          counter-reset: list-counter;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        .blog-content ol li {
          counter-increment: list-counter;
          position: relative;
          padding-left: 2rem;
          color: #4b5563;
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .blog-content ol li::before {
          content: counter(list-counter);
          position: absolute;
          left: 0;
          top: 0;
          width: 1.5rem;
          height: 1.5rem;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .blog-content strong {
          color: #111827;
          font-weight: 700;
        }
        .blog-content blockquote {
          margin: 2.5rem 0;
          padding: 1.75rem 2.25rem;
          border-left: 4px solid #3b82f6;
          background: #f8faff;
          border-radius: 0 24px 24px 0;
          font-style: italic;
          color: #1e40af;
          font-size: 1.1rem;
          line-height: 1.75;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 3rem 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          font-size: 0.95rem;
        }
        .blog-content th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .blog-content td {
          padding: 14px 18px;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
        }
        .blog-content tr:last-child td {
          border-bottom: none;
        }
        .blog-content tr:hover td {
          background: #f8fafc;
        }
      `}</style>
    </>
  );
}
