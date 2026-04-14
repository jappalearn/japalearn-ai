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
  title: "The 2024 UK Visa Changes: What Nigerians Need to Know",
  date: "April 12, 2024",
  category: "Visa Guides",
  author: "Taiwo from JapaLearn",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1400",
  excerpt: "New salary thresholds, dependent restrictions, and route closures are reshaping the UK immigration landscape for 2024. Here is everything you need to know as a Nigerian applicant.",
  content: `
## Why This Update Matters to You

In April 2024, the UK Home Office introduced sweeping changes to immigration rules. For Nigerians — one of the largest groups of international applicants — these changes are significant and require immediate action if you are planning to relocate.

This is not just bureaucratic noise. If you have a pending job offer, an active Certificate of Sponsorship (CoS), or are planning your Japa journey in the next 12 months, **these changes directly affect your timeline, your finances, and your family's eligibility.**

---

## The Skilled Worker Salary Threshold Increase

The most impactful change is the salary threshold increase for the Skilled Worker visa.

| Category | Old Threshold | New Threshold (April 2024) |
|---|---|---|
| General skilled roles | £26,200 | £38,700 |
| New entrants (graduate shortage) | £20,960 | £30,960 |
| Health & Care Workers (NHS-banded) | £20,960 | Exempt |
| National pay scale roles | Varies | Exempt |

**What this means in Naira terms:** At current exchange rates, the new £38,700 threshold represents approximately ₦72M per year — a figure that illustrates just how critical it is to secure a role with a competitive salary before your Certificate of Sponsorship is issued.

### Who is Exempt from the Threshold Increase?

The Home Office has carved out exemptions specifically for:
- **NHS-banded Health & Care Workers** (Nurses, Doctors, Allied Health Professionals)
- Workers on national pay agreements (teachers, social workers in specific grades)
- Those extending or switching a visa already in the UK (subject to conditions)

If you are a nurse or doctor, your path remains viable — but there are new dependent rules you must understand (covered below).

---

## The Dependent Restriction for Health & Care Workers

This is perhaps the most emotionally complex change in the 2024 reforms.

**From March 2024**, overseas Health & Care Workers on the **new** Skilled Worker visa (Health & Care route) are **no longer permitted to bring dependants (spouses, children)** to the UK unless they were already in the country.

This affects:
- Nurses joining NHS Trusts for the first time
- Care workers coming under new CoS arrangements
- Allied Health Professionals on fresh applications

> "This rule has blindsided thousands of Nigerian healthcare workers who had planned to bring their families. It is critical to verify your visa category and understand your rights." — Taiwo, JapaLearn AI

**What you should do:** If you are a healthcare worker and family unity is essential, explore roles on the **General Skilled Worker route** (not the Health & Care sub-route). Some NHS-adjacent roles and private sector healthcare employers sponsor under the General route, which does not carry this restriction.

---

## Your 4-Step Action Plan For 2024

### Step 1: Verify Your Role's New Threshold
Use the [Skilled Occupation List](https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations) to check your occupation code and confirm your applicable salary threshold. Do not rely on your employer alone — verify independently.

### Step 2: Get Your Certificate of Sponsorship Reviewed
If you have already received a CoS, confirm the salary on it meets the **new** April 2024 thresholds. If your CoS was issued before April but you have not yet applied, you may still be subject to the new rules.

### Step 3: Plan Your Proof of Funds
With higher salaries required, your employer offer letter now needs to clearly state a compliant figure. Prepare your bank statements and financial documents to support your application. Aim for 3–6 months of bank statements showing consistent income.

### Step 4: Run Your JapaLearn AI Assessment
The fastest way to understand your personal situation is to run your AI readiness assessment. Our system accounts for all 2024 rule changes and gives you a personalised roadmap within minutes.

---

## Impact on the Nigerian Migration Community

Nigeria provides the UK with the largest cohort of overseas-trained nurses in the NHS. The 2024 changes create a paradox: the UK urgently needs healthcare workers, yet restrictions on dependents may deter highly qualified Nigerians from accepting offers.

Early intelligence from the JapaLearn community shows:
- **23% of active applicants** had to renegotiate salary terms with their UK sponsors
- **41% of healthcare workers** are reconsidering their route in light of the dependent restriction
- Lawyers are recommending a **General Skilled Worker route switch** for those where family unity is a priority

---

## Looking Ahead: What to Watch in Q3 2024

The immigration landscape continues to shift. Watch out for:
- **Further salary threshold reviews** — the Migration Advisory Committee (MAC) meets in Q3
- **Student visa dependent restrictions** — further tightening expected
- **Points-Based System review** — the Government has commissioned a full MAC review

Stay subscribed to the JapaLearn Journal for weekly updates as these changes develop.
`,
  faqs: [
    {
      question: "Does the new salary threshold apply to all Skilled Worker visa applicants?",
      answer: "Not all. Workers on national pay agreements (such as NHS Agenda for Change bands), teachers, and social workers in specific grades are generally exempt. However, the majority of private sector and self-employment-sponsored roles are now subject to the £38,700 minimum."
    },
    {
      question: "I already have a CoS issued before April 2024. Am I affected?",
      answer: "It depends on when you submit your application. If your CoS was issued before the April 4, 2024 rules change but you have not yet submitted your visa application, you should submit as soon as possible. UKVI guidance suggests applications made with a pre-change CoS may still be assessed under the old thresholds, but this is subject to change."
    },
    {
      question: "Can I still bring my spouse if I'm a nurse going to the UK?",
      answer: "From March 2024, new overseas Health & Care visa applicants cannot bring dependants who are not already in the UK. If bringing your spouse is a priority, speak to a registered immigration adviser about switching to the General Skilled Worker route, which remains open to dependants."
    },
    {
      question: "What is the best way to check if my role qualifies under the new thresholds?",
      answer: "Visit the UK Government's Skilled Occupation List and find your SOC code. The list will show the minimum salary for your occupation under both the going rate and the general threshold. Use whichever is higher."
    },
    {
      question: "How does the JapaLearn AI help with these changes?",
      answer: "Our AI assessment has been updated with all 2024 rule changes. When you complete the quiz, you get a personalised readiness score, an updated visa route recommendation, and a step-by-step curriculum that accounts for your exact circumstances — including the new salary and dependent rules."
    }
  ],
  relatedPosts: [
    {
      id: 2,
      title: "How to Build a Proof of Funds Strategy that Actually Works",
      slug: "proof-of-funds-strategy",
      excerpt: "Naira volatility makes proof of funds a moving target. We break down the best strategies.",
      category: "Financial Planning",
      date: "April 10, 2024",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "AI in Migration: How JapaLearn AI Predicts Your Success",
      slug: "ai-migration-predictions",
      excerpt: "Discover the technology behind our readiness scores and how it's helping thousands.",
      category: "AI Insights",
      date: "April 08, 2024",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "The NHS Skilled Worker Visa: A Complete 2024 Guide for Nigerian Nurses",
      slug: "nhs-skilled-worker-guide-nurses",
      excerpt: "From NMC registration to your first day on the ward — a complete guide for Nigerian nurses.",
      category: "Visa Guides",
      date: "April 05, 2024",
      readTime: "11 min",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600"
    }
  ]
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
            <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm mb-16">
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
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">QUICK ANSWERS</p>
                  <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-10 ml-14 text-sm">
                The most common questions from Nigerians asking about this topic.
              </p>
              <div className="space-y-3">
                {post.faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </div>
            </section>

            {/* ── CTA Banner ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 p-8 md:p-14 rounded-[40px] text-white relative overflow-hidden border border-white/5"
              style={{ background: '#0f172a' }}
            >
              <div 
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(59, 117, 255, 0.15) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#6094FF] mb-6">
                  YOUR NEXT STEP
                </span>
                
                <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6 leading-tight max-w-2xl">
                  Find out exactly where you stand on your Japa journey
                </h3>
                
                <p className="text-gray-400 mb-10 max-w-xl text-base md:text-lg leading-relaxed">
                  In 60 seconds, our AI will assess your profile against the latest 2024 UK immigration rules and give you a personalised readiness score.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1E4DD7] text-white font-bold text-base hover:bg-[#1E4DD7]/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#1E4DD7]/20"
                  >
                    Take the Free AI Assessment <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" /> Share Article
                  </button>
                </div>
              </div>
            </motion.div>

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
