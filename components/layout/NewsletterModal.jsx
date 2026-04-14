import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export function NewsletterModal() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Show only on blog routes (/blog, /blog/[slug])
  const isBlogPage = router.pathname.startsWith('/blog');

  useEffect(() => {
    if (!isBlogPage) {
      setVisible(false);
      return;
    }

    if (sessionStorage.getItem('newsletter_dismissed')) return;

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
    setTimeout(() => {
      handleDismiss();
    }, 2500);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed z-[100] bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px] w-auto max-w-full sm:max-w-[calc(100vw-48px)]"
          role="dialog"
          aria-label="Subscribe to newsletter"
        >
          {/* Main Card - Adapting styles from Landing Page Footer */}
          <div className="relative bg-[#f6f9ff] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border overflow-hidden">
            
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>

            <div className="p-8 pb-10">
              {!submitted ? (
                <>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 leading-tight pr-6">
                    Dreaming of relocating but don&apos;t know where to start?
                  </h3>
                  
                  <p className="text-muted-foreground text-[13px] leading-relaxed mb-8">
                    Sign up to get real relocation stories, guides, and expert tips straight to your inbox.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-12 px-5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm transition-all"
                    />
                    <Button 
                      type="submit"
                      className="h-12 w-full rounded-full bg-primary hover:bg-primary/90 font-semibold text-sm transition-all active:scale-[0.98]"
                    >
                      Subscribe Now
                    </Button>
                  </form>

                  <p className="text-center text-[10px] text-muted-foreground/60 mt-4">
                    Join thousands of Nigerians relocating smarter.
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                    <Send className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">You&apos;re in! 🎉</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed px-4">
                    Get ready for real relocation stories and expert tips in your inbox soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
