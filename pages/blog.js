import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Clock, Calendar, ArrowRight, User, TrendingUp, BookOpen, Zap, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const CATEGORIES = [
  { id: 'all', name: 'All Articles', icon: BookOpen },
  { id: 'visa-guides', name: 'Visa Guides', icon: TrendingUp, color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'success-stories', name: 'Success Stories', icon: Zap, color: '#10B981', bg: '#F0FDF4' },
  { id: 'financial-planning', name: 'Financial Planning', icon: DollarSign, color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'ai-insights', name: 'AI & Future of Japa', icon: Zap, color: '#8B5CF6', bg: '#F5F3FF' },
];

const ALL_POSTS = [
  {
    id: 1,
    title: "The 2024 UK Visa Changes: What Nigerians Need to Know",
    slug: "uk-visa-changes-2024",
    excerpt: "New salary thresholds, dependent restrictions, and route closures are reshaping UK immigration. Here is everything you need to know as a Nigerian applicant.",
    category: "visa-guides",
    categoryName: "Visa Guides",
    date: "April 12, 2024",
    readTime: "8 min",
    author: "Taiwo from JapaLearn",
    featured: true,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    title: "How to Build a Proof of Funds Strategy that Actually Works",
    slug: "proof-of-funds-strategy",
    excerpt: "Naira volatility makes proof of funds a moving target. We break down the best strategies for Nigerian applicants.",
    category: "financial-planning",
    categoryName: "Financial Planning",
    date: "April 10, 2024",
    readTime: "8 min",
    author: "Taiwo from JapaLearn",
    featured: false,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "AI in Migration: How JapaLearn AI Predicts Your Success",
    slug: "ai-migration-predictions",
    excerpt: "Discover the technology behind our readiness scores and how it's helping thousands avoid preventable rejections.",
    category: "ai-insights",
    categoryName: "AI & Future of Japa",
    date: "April 08, 2024",
    readTime: "5 min",
    author: "Taiwo from JapaLearn",
    featured: false,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "The NHS Skilled Worker Visa: A Complete Guide for Nigerian Nurses",
    slug: "nhs-skilled-worker-guide-nurses",
    excerpt: "From NMC registration to your first day on the ward — everything a Nigerian nurse needs to prepare for UK migration.",
    category: "visa-guides",
    categoryName: "Visa Guides",
    date: "April 05, 2024",
    readTime: "11 min",
    author: "Taiwo from JapaLearn",
    featured: false,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "From Lagos to London: My First 30 Days and What Nobody Told Me",
    slug: "lagos-to-london-first-30-days",
    excerpt: "A real, honest account of the first month after landing in the UK. The good, the hard, and the unexpected.",
    category: "success-stories",
    categoryName: "Success Stories",
    date: "April 03, 2024",
    readTime: "7 min",
    author: "Taiwo from JapaLearn",
    featured: false,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Canada Express Entry vs UK Skilled Worker: Which is Right for You?",
    slug: "canada-vs-uk-route-comparison",
    excerpt: "A side-by-side comparison of the two most popular Japa routes for Nigerians — salary requirements, processing times, and PR pathways.",
    category: "visa-guides",
    categoryName: "Visa Guides",
    date: "April 01, 2024",
    readTime: "10 min",
    author: "Taiwo from JapaLearn",
    featured: false,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
  },
];

function CategoryBadge({ category, small = false }) {
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat || cat.id === 'all') return null;
  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-widest rounded-full ${small ? 'text-[9px] px-3 py-1' : 'text-[10px] px-4 py-1.5'}`}
      style={{ color: cat.color, background: cat.bg }}
    >
      {cat.name}
    </span>
  );
}

function PostCard({ post, index, large = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`group block bg-white rounded-[28px] overflow-hidden border border-border hover:shadow-2xl hover:shadow-primary/8 transition-all duration-300 hover:-translate-y-1 ${large ? 'flex flex-col md:flex-row' : ''}`}
      >
        <div className={`relative overflow-hidden ${large ? 'md:w-1/2 h-64 md:h-auto' : 'h-52'}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <CategoryBadge category={post.category} small />
          </div>
        </div>
        <div className={`p-7 flex flex-col justify-between ${large ? 'md:w-1/2 md:p-10' : ''}`}>
          <div>
            <div className="flex items-center gap-3 mb-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} read</span>
            </div>
            <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3 ${large ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
              {post.title}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${large ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">{post.author}</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const featuredPost = ALL_POSTS.find(p => p.featured);
  const filteredPosts = ALL_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
      || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory && !post.featured;
  });

  const showFeatured = searchQuery === '' && activeCategory === 'all';

  return (
    <>
      <Head>
        <title>Blog · JapaLearn AI — Expert Migration Insights</title>
        <meta name="description" content="Expert migration advice, visa updates, and success stories written for the Nigerian community by Taiwo from JapaLearn." />
      </Head>

      <div className="flex flex-col min-h-screen bg-[#FAFBFF]">
        <Navbar />

        <main className="grow">
          {/* ── Editorial Hero Header ─────────────────────────────── */}
          <div className="pt-32 pb-16 bg-white border-b border-border">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">THE JAPALEARN JOURNAL</p>
                  <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
                    Real insights for <br />
                    <span className="text-primary">real Nigerians</span>{' '}
                    <span className="text-muted-foreground/40">relocating.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                    Deep dives into visa routes, financial strategy, and AI-powered migration tools — written by Taiwo from JapaLearn, updated every week.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {[{ label: '24 articles', icon: '📝' }, { label: 'Updated weekly', icon: '🔄' }, { label: 'Free to read', icon: '🎯' }].map(stat => (
                      <div key={stat.label} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-muted-foreground font-medium border border-border">
                        <span>{stat.icon}</span> {stat.label}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Featured post preview in the hero */}
                {featuredPost && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <Link href={`/blog/${featuredPost.slug}`} className="group block">
                      <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-primary/10">
                        <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                              Featured
                            </span>
                            <CategoryBadge category={featuredPost.category} small />
                          </div>
                          <h2 className="text-xl font-bold text-white leading-snug mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
                            {featuredPost.title}
                          </h2>
                          <div className="flex items-center gap-3 text-white/60 text-[10px]">
                            <span>{featuredPost.date}</span>
                            <div className="w-1 h-1 rounded-full bg-white/40" />
                            <span>{featuredPost.readTime} read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* ── Filter & Search Bar ───────────────────────────────── */}
          <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Category pills */}
                <div className="flex items-center gap-2 overflow-x-auto flex-1 pb-1 no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap border ${
                        activeCategory === cat.id
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'text-muted-foreground border-border hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative shrink-0 w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Content Grid ─────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">

            {/* Featured full-width card */}
            {showFeatured && featuredPost && (
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Latest Article</p>
                <PostCard post={featuredPost} index={0} large />
              </div>
            )}

            {/* Grid */}
            {filteredPosts.length > 0 ? (
              <>
                {(searchQuery || activeCategory !== 'all') && (
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    {filteredPosts.length} Article{filteredPosts.length !== 1 ? 's' : ''} Found
                  </p>
                )}
                {searchQuery === '' && activeCategory === 'all' && (
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">More from the Journal</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">No articles found</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Try a different search keyword or category filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-6 px-6 py-2.5 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Newsletter inline CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 p-10 md:p-14 rounded-[40px] bg-gradient-to-br from-[#EEF2FF] via-[#F5F7FF] to-white border border-primary/10 text-center"
            >
              <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Get weekly migration insights</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm leading-relaxed">
                Every Monday, Taiwo sends one high-value insight on UK, Canada, or EU migration — directly relevant to Nigerians. No fluff.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm"
                />
                <button className="h-12 px-7 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shrink-0 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                  Subscribe
                </button>
              </div>
              <p className="text-muted-foreground text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
