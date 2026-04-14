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
import { useRouter } from 'next/router';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BLOG_POSTS } from '@/constants/blogData';

// Post Data is now dynamic via BLOG_POSTS

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
  const router = useRouter();
  const { slug } = router.query;
  const [shareOpen, setShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find the post based on the slug
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  
  // Find related posts (exclude current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  if (!mounted || !slug) return <div className="min-h-screen bg-white" />;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-gray-50">
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The Japa insight you're looking for seems to have moved or doesn't exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all">
            <ArrowRight className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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
                {relatedPosts.map((related, index) => (
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
