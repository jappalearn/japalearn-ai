import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  ArrowRight,
  Compass,
  Zap,
  Wallet,
  Award,
  Newspaper,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BLOG_POSTS } from '@/constants/blogData';

// ─── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',               label: 'All',               icon: Newspaper },
  { id: 'visa-guides',       label: 'Visa Guides',        icon: Compass },
  { id: 'financial-planning',label: 'Financial Planning', icon: Wallet },
  { id: 'success-stories',   label: 'Success Stories',   icon: Award },
  { id: 'ai-insights',       label: 'AI & Japa',          icon: Zap },
];

const POSTS = BLOG_POSTS;

// ─── Category label lookup ────────────────────────────────────────────────────
function getCategoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label ?? id;
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col bg-white border border-border rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category pill over image */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {getCategoryLabel(post.category)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            {post.date}
            <span className="w-1 h-1 rounded-full bg-border inline-block" />
            <Clock className="w-3 h-3" /> {post.readTime} read
          </p>
          <h3 className="text-base font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{post.author || "JapaLearn"}</span>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-14"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex flex-col lg:flex-row bg-white border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Featured
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider">
              {getCategoryLabel(post.category)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            {post.date} <span className="w-1 h-1 rounded-full bg-border inline-block" />
            <Clock className="w-3 h-3" /> {post.readTime} read
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary group-hover:underline">Read article</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');

  const featured       = POSTS.find(p => p.featured);
  const filteredOthers = POSTS.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchQuery
      || p.title.toLowerCase().includes(searchQuery.toLowerCase())
      || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && !p.featured;
  });

  const showFeatured = activeCategory === 'all' && !searchQuery && featured;

  return (
    <>
      <Head>
        <title>Blog · JapaLearn AI — Migration Insights for Nigerians</title>
        <meta name="description" content="Visa guides, relocation insights, financial strategies, migration stories and first hand updates published weekly to help Nigerians relocate smarter." />
      </Head>

      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <main className="grow">

          {/* ── Hero ──────────────────────────────────────────────── */}
          <section className="relative pt-36 pb-20 overflow-hidden">
            {/* Background glow — matches landing page */}
            <div
              className="absolute inset-0 -z-10 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 400px at 50% 0%, #c8d9ff 0%, #deeaff 25%, #eef3ff 50%, transparent 75%)',
              }}
            />

            <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
              >
                THE JAPALEARN JOURNAL
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6"
              >
                Migration insights <span className="text-primary">written for you</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed mb-10"
              >
                Visa guides, relocation insights, financial strategies, migration stories and first hand updates published weekly to help Nigerians relocate smarter.
              </motion.p>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative max-w-md mx-auto"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-full border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </motion.div>
            </div>
          </section>

          {/* ── Category Tabs ─────────────────────────────────────── */}
          <section className="pb-14">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {CATEGORIES.map((cat, i) => {
                  const Icon    = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-white text-gray-600 border-border hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Articles ──────────────────────────────────────────── */}
          <section className="pb-28">
            <div className="max-w-6xl mx-auto px-4 md:px-6">

              {/* Featured post */}
              {showFeatured && <FeaturedCard post={featured} />}

              {/* Results count when filtering */}
              {(activeCategory !== 'all' || searchQuery) && (
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
                  {filteredOthers.length === 0 ? 'No' : filteredOthers.length} article{filteredOthers.length !== 1 ? 's' : ''} found
                </p>
              )}

              {/* Post grid */}
              {filteredOthers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOthers.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                !showFeatured && (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-border">
                      <Search className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">No articles found</h3>
                    <p className="text-muted-foreground text-sm">Try a different search or category.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                      className="mt-6 px-6 py-2.5 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
