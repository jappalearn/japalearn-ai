import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/router';

export function NewsletterModal() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Show only on blog routes (/blog, /blog/[slug])
  const isBlogPage = router.pathname.startsWith('/blog');

  useEffect(() => {
    // Hide if navigating away from blog
    if (!isBlogPage) {
      setVisible(false);
      return;
    }

    // Don't show if already dismissed in this session
    if (sessionStorage.getItem('newsletter_dismissed')) return;

    // Show after 6 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [isBlogPage]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('newsletter_dismissed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // In production, POST to your newsletter API here
    setTimeout(() => {
      handleDismiss();
    }, 2500);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)]"
          role="dialog"
          aria-label="Subscribe to JapaLearn newsletter"
        >
          <div className="relative bg-white rounded-[28px] shadow-2xl shadow-black/15 border border-border overflow-hidden">
            {/* Gradient accent top bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #5B6AF4, #7C8DF8, #a78bfa)' }} />

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>

            <div className="p-7 pt-5">
              {!submitted ? (
                <>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1.5 leading-snug pr-6">
                    Weekly Japa insights, free.
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                    Every Monday, Taiwo sends one high-value migration tip — visa updates, proof of funds strategies, real community stories. No spam.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full h-11 px-4 rounded-2xl border border-border bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary/20"
                    >
                      Subscribe — It&apos;s Free <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <p className="text-center text-[10px] text-muted-foreground mt-3">
                    Unsubscribe anytime · No spam, ever
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">You&apos;re in! 🎉</h3>
                  <p className="text-muted-foreground text-sm">
                    Watch your inbox this Monday for your first Japa insight from Taiwo.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
