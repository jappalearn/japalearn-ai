import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Container, Theme } from './settings/types';
import { LoginDashboard } from './components/generated/LoginDashboard';
import { JapaLearnSignUp } from './components/generated/JapaLearnSignUp';
import { AdaezeReferralProfile } from './components/generated/AdaezeReferralProfile';
import { RoadmapPaymentPage } from './components/generated/RoadmapPaymentPage';

let theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'none';

type AppView = 'referral' | 'signup' | 'dashboard' | 'payment';

const OLD_NUDGE_TEXT = 'Get a detailed roadmap for ₦5,000. This is the basic roadmap.';
const NEW_NUDGE_TEXT = 'Get a detailed roadmap. This is a more personalised step-by-step plan that moves you from your current situation to relocating abroad.';

const CREDITS_LEFT = 20;
const IS_LOW_CREDITS = CREDITS_LEFT <= 5;

// ─── CSS KEYFRAMES ─────────────────────────────────────────────────────────
const DASHBOARD_CSS = `
@keyframes creditsPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,67,105,0.55); }
  50%       { box-shadow: 0 0 0 8px rgba(239,67,105,0); }
}
@keyframes creditsShake {
  0%,100%  { transform: translateX(0); }
  15%      { transform: translateX(-4px); }
  30%      { transform: translateX(4px); }
  45%      { transform: translateX(-3px); }
  60%      { transform: translateX(3px); }
  75%      { transform: translateX(-2px); }
  90%      { transform: translateX(2px); }
}
@keyframes tooltipIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes buyModalIn {
  from { opacity: 0; transform: scale(0.95) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

let cssInjected = false;
function injectDashboardCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const style = document.createElement('style');
  style.textContent = DASHBOARD_CSS;
  document.head.appendChild(style);
}

// ─── CREDIT PACKAGES DATA ──────────────────────────────────────────────────
const CREDIT_PACKAGES = [
  { id: 'pkg10',  credits: 10,  price: '₦1,500',  tag: 'Starter',     tagColor: '#6B7280', tagBg: '#F4F4F6', popular: false, bonus: 'Good for 2 AI conversations' },
  { id: 'pkg50',  credits: 50,  price: '₦6,000',  tag: 'Most Popular', tagColor: '#1E4DD7', tagBg: '#EBF1FF', popular: true,  bonus: '+5 bonus credits included' },
  { id: 'pkg100', credits: 100, price: '₦10,000', tag: 'Best Value',   tagColor: '#21C474', tagBg: '#E8F9EE', popular: false, bonus: '+20 bonus credits included' },
];

// ─── BUY CREDITS MODAL (React portal, rendered at root) ──────────────────
function BuyCreditsModal({ onClose }: { onClose: () => void }) {
  const [selectedPkg, setSelectedPkg] = useState('pkg50');
  const [purchased, setPurchased] = useState(false);

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const selectedPkgData = CREDIT_PACKAGES.find(p => p.id === selectedPkg)!;

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%', maxWidth: '480px',
          boxShadow: '0px 32px 80px rgba(30,77,215,0.18), 0px 0px 0px 1px rgba(30,77,215,0.06)',
          overflow: 'hidden',
          animation: 'buyModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Buy Credits"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)', padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#FFFFFF', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.4px' }}>Buy Credits</h2>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>Power your AI conversations &amp; document analysis</p>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          {/* Balance bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={IS_LOW_CREDITS ? '#FCD34D' : '#A5F3C5'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 700, color: IS_LOW_CREDITS ? '#FCD34D' : '#A5F3C5' }}>{CREDITS_LEFT} credits</span>
              <span> remaining in your account</span>
            </span>
            {IS_LOW_CREDITS && <span style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(239,67,105,0.3)', border: '1px solid rgba(239,67,105,0.5)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: '#F87171' }}>Low</span>}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {purchased ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #21C474, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 8px 24px rgba(33,196,116,0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>Credits Added!</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#82858A' }}>Your credits have been topped up successfully.</p>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 700, color: '#82858A', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Choose a package</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {CREDIT_PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px',
                      background: selectedPkg === pkg.id ? 'linear-gradient(135deg, #EBF1FF 0%, #E0EAFF 100%)' : '#FAFBFF',
                      border: `2px solid ${selectedPkg === pkg.id ? '#1E4DD7' : '#F0F2FF'}`,
                      borderRadius: '14px', cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all 0.15s ease', fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: selectedPkg === pkg.id ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F0F2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPkg === pkg.id ? '#FCD34D' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#18181B' }}>{pkg.credits} credits</p>
                        <span style={{ padding: '2px 8px', background: selectedPkg === pkg.id ? pkg.tagBg : '#F4F4F6', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: selectedPkg === pkg.id ? pkg.tagColor : '#82858A' }}>{pkg.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#82858A', lineHeight: '1.3' }}>{pkg.bonus}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: selectedPkg === pkg.id ? '#1E4DD7' : '#18181B', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.4px' }}>{pkg.price}</p>
                    </div>
                    {selectedPkg === pkg.id && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {/* Usage guide */}
              <div style={{ background: '#F9FAFF', borderRadius: '12px', padding: '12px 14px', border: '1px solid #E8EDFF', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits are used for</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {[{ label: 'AI Conversations', cost: '1 credit each' }, { label: 'Document Parsing', cost: '2 credits each' }, { label: 'Personalised Roadmap', cost: '5 credits' }].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3B75FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        <span style={{ fontSize: '12px', color: '#4D4D56' }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E4DD7' }}>{item.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* CTA */}
              <button onClick={handlePurchase} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', color: '#FFFFFF', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0px 8px 24px rgba(30,77,215,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                <span>Buy {selectedPkgData.credits} Credits — {selectedPkgData.price}</span>
              </button>
              <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '11px', color: '#B0B4C4' }}>Secure payment · Credits never expire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function DashboardWrapper({ onPayment }: { onPayment: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  useEffect(() => {
    injectDashboardCSS();

    const patch = () => {
      if (!wrapperRef.current) return;
      const root = wrapperRef.current;

      // 1. Nudge text
      root.querySelectorAll('p').forEach(p => {
        if (p.textContent?.trim() === OLD_NUDGE_TEXT) {
          p.textContent = NEW_NUDGE_TEXT;
        }
      });

      // 2. "Document Upload" → "Documents" in nav
      root.querySelectorAll('span, button').forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
          if (el.textContent?.trim() === 'Document Upload') {
            el.textContent = 'Documents';
          }
        }
      });

      // 3. Replace ALL top-right "A" avatar elements in headers with credits pill
      const headers = root.querySelectorAll('header');
      headers.forEach(header => {
        // Find any round element (button or div) with "A" text that acts as profile avatar in header
        const avatarCandidates = header.querySelectorAll('button, div');
        avatarCandidates.forEach(el => {
          const htmlEl = el as HTMLElement;
          // Check if it's the avatar: has a span child with exactly "A" text, has circular styling
          const directSpan = Array.from(htmlEl.children).find(
            c => c.tagName === 'SPAN' && c.textContent?.trim() === 'A'
          ) as HTMLElement | undefined;
          if (!directSpan) return;
          // Must have gradient background (avatar styling)
          const bg = htmlEl.style.background || htmlEl.style.backgroundImage || '';
          if (!bg.includes('9BB3FF') && !bg.includes('3B75FF')) return;
          // Must not already be replaced
          const parent = htmlEl.parentElement;
          if (!parent) return;
          if (parent.querySelector('.credits-pill-wrapper')) return;

          // Hide the original avatar
          htmlEl.style.display = 'none';

          // Create credits pill wrapper
          const pillWrapper = document.createElement('div');
          pillWrapper.className = 'credits-pill-wrapper';
          pillWrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center;';

          const pill = document.createElement('button');
          pill.className = 'credits-pill';
          const pillBg = IS_LOW_CREDITS
            ? 'linear-gradient(135deg,#EF4369,#FF5E5E)'
            : 'linear-gradient(135deg,#1E4DD7,#3B75FF)';
          const pillAnim = IS_LOW_CREDITS
            ? 'creditsPulse 1.8s ease-in-out infinite, creditsShake 4s ease-in-out 0s infinite'
            : 'none';
          pill.style.cssText = `display:flex;align-items:center;gap:6px;background:${pillBg};border-radius:20px;padding:6px 14px;cursor:pointer;border:none;animation:${pillAnim};box-shadow:0 2px 10px rgba(30,77,215,0.28);`;
          const lowDot = IS_LOW_CREDITS
            ? '<span style="width:6px;height:6px;border-radius:50%;background:#FCD34D;flex-shrink:0;" aria-hidden="true"></span>'
            : '';
          pill.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span style="font-size:12px;font-weight:700;color:#fff;font-family:Inter,sans-serif;white-space:nowrap;">${CREDITS_LEFT} credits left</span>${lowDot}`;

          // Tooltip
          const tooltip = document.createElement('div');
          tooltip.style.cssText = `
            position:absolute;top:calc(100% + 8px);right:0;
            background:#18181B;border-radius:12px;padding:10px 14px;
            box-shadow:0px 8px 28px rgba(0,0,0,0.2);z-index:9000;min-width:200px;
            display:none;pointer-events:none;
          `;
          const lowMsg = IS_LOW_CREDITS
            ? `<p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#FFFFFF;">⚠️ Credits running low!</p><p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);line-height:1.4;">Only ${CREDITS_LEFT} credits left. Top up to keep using AI features.</p>`
            : `<p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#FFFFFF;">⚡ AI Credits</p><p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);line-height:1.4;">You have ${CREDITS_LEFT} credits. Each AI conversation uses 1 credit.</p>`;
          tooltip.innerHTML = `${lowMsg}<p style="margin:0;font-size:11px;color:#3B75FF;font-weight:600;">Tap to view plans →</p><div style="position:absolute;top:-5px;right:20px;width:10px;height:10px;background:#18181B;transform:rotate(45deg);border-radius:2px;" aria-hidden="true"></div>`;

          pill.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.style.animation = 'tooltipIn 0.18s ease forwards';
          });
          pill.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            // Navigate to Subscription Plans
            const navBtns = root.querySelectorAll('button[role="menuitem"]');
            let found = false;
            navBtns.forEach(btn => {
              const s = btn.querySelector('span');
              if (s && s.textContent?.trim() === 'Subscription Plans') {
                (btn as HTMLElement).click();
                found = true;
              }
            });
            if (!found) {
              // Try bottom nav or any visible subscription button
              root.querySelectorAll('button').forEach(btn => {
                const txt = btn.textContent?.trim() ?? '';
                if (txt === 'Subscription Plans' || txt.includes('Plans')) {
                  (btn as HTMLElement).click();
                }
              });
            }
          });

          pillWrapper.appendChild(pill);
          pillWrapper.appendChild(tooltip);
          parent.insertBefore(pillWrapper, htmlEl.nextSibling);
        });
      });

      // 4. "Current Location" label → "Educational Level" and value "Lagos, Nigeria" → "BSc Nursing"
      root.querySelectorAll('span').forEach(span => {
        if (span.textContent?.trim() === 'Current Location') {
          span.textContent = 'Educational Level';
        }
        if (span.textContent?.trim() === 'Lagos, Nigeria') {
          span.textContent = 'BSc Nursing';
        }
      });

      // 5. "Lagos, Nigeria → UK (Skilled Worker Visa)" → "🇬🇧 UK (Skilled Worker Visa)"
      root.querySelectorAll('span, p').forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
          const t = el.textContent?.trim() ?? '';
          if (t === 'Lagos, Nigeria → UK (Skilled Worker Visa)') {
            el.textContent = '🇬🇧 UK (Skilled Worker Visa)';
          }
          if (t === 'Lagos → UK Skilled Worker') {
            el.textContent = '🇬🇧 UK Skilled Worker';
          }
        }
      });

      // 6. Remove "Edit Profile" button
      root.querySelectorAll('button').forEach(btn => {
        const spanChild = btn.querySelector('span');
        if (spanChild?.textContent?.trim() === 'Edit Profile') {
          btn.style.display = 'none';
        }
      });

      // 7. Lock Subscription Plans
      const plansSection = (() => {
        const h1s = Array.from(root.querySelectorAll('h1'));
        return h1s.find(h => h.textContent?.trim() === 'Subscription Plans')?.closest('div[style]') ?? null;
      })();
      if (plansSection && !plansSection.querySelector('.plans-locked')) {
        const grid = plansSection.querySelector('div[style*="grid"]') as HTMLElement | null;
        if (grid) {
          grid.style.pointerEvents = 'none';
          grid.style.opacity = '0.45';
          grid.style.filter = 'blur(1px)';
          const lockBanner = document.createElement('div');
          lockBanner.className = 'plans-locked';
          lockBanner.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:28px 20px;background:rgba(255,255,255,0.92);border:1.5px solid #E0E8FF;border-radius:16px;margin-top:16px;';
          lockBanner.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E4DD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><p style="margin:0;font-size:15px;font-weight:700;color:#18181B;font-family:DM Sans,sans-serif;">Plans are currently locked</p><p style="margin:0;font-size:13px;color:#82858A;text-align:center;line-height:1.5;max-width:280px;">Subscription plan selection will be available soon. You\'re on the Free Plan.</p>';
          plansSection.appendChild(lockBanner);
        }
      }
    };

    patch();
    const observer = new MutationObserver(patch);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button');
    if (!btn) return;
    const btnText = btn.textContent?.trim();
    if (btnText === 'Download Roadmap') {
      e.preventDefault();
      e.stopPropagation();
      onPayment();
    }
  }, [onPayment]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }} onClick={handleClick}>
      <LoginDashboard />
      {buyModalOpen && <BuyCreditsModal onClose={() => setBuyModalOpen(false)} />}
    </div>
  );
}

function App() {
  const [appView, setAppView] = useState<AppView>('referral');

  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const handleGoToSignUp = useCallback(() => {
    setAppView('signup');
  }, []);

  const handleAuthComplete = useCallback(() => {
    setAppView('dashboard');
  }, []);

  const handleGoToPayment = useCallback(() => {
    setAppView('payment');
  }, []);

  const generatedComponent = useMemo(() => {
    if (appView === 'referral') {
      return <AdaezeReferralProfile onSignUp={handleGoToSignUp} />;
    }
    if (appView === 'signup') {
      return <JapaLearnSignUp onComplete={handleAuthComplete} />;
    }
    if (appView === 'payment') {
      return <RoadmapPaymentPage onBack={() => setAppView('dashboard')} />;
    }
    return <DashboardWrapper onPayment={handleGoToPayment} />; // %EXPORT_STATEMENT%
  }, [appView, handleGoToSignUp, handleAuthComplete, handleGoToPayment]);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;