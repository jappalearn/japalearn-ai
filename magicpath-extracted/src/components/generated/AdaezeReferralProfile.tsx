import React, { useState, useEffect } from 'react';
interface AdaezeReferralProfileProps {
  onSignUp: () => void;
}

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
// #0F2E99 deep · #1E4DD7 primary · #3B75FF light
// BG: #F7F9FF · Surface: #FFFFFF · Text: #18181B
// Heading: DM Sans · Body: Inter

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TOTAL_SCORE = 56;
const TOTAL_MAX = 100;
const SCORE_BREAKDOWN: {
  id: string;
  label: string;
  score: number;
  max: number;
  status: 'strong' | 'moderate' | 'weak';
  insight: string;
  color: string;
}[] = [{
  id: 'education',
  label: 'Education',
  score: 14,
  max: 20,
  status: 'strong',
  insight: 'BSc Nursing qualifies directly for NHS Skilled Worker pathway — one of the most in-demand roles in the UK.',
  color: '#10B981'
}, {
  id: 'language',
  label: 'Language Test',
  score: 16,
  max: 20,
  status: 'moderate',
  insight: 'IELTS Academic 6.5 clears the minimum. Hitting 7.0+ would significantly widen Adaeze\'s route options.',
  color: '#3B75FF'
}, {
  id: 'age',
  label: 'Age Factor',
  score: 10,
  max: 10,
  status: 'strong',
  insight: 'At 27, Adaeze is in the optimal age band — full points, no deductions.',
  color: '#10B981'
}, {
  id: 'financial',
  label: 'Financial Readiness',
  score: 6,
  max: 10,
  status: 'moderate',
  insight: '₦5M–8M in savings covers application fees and maintenance funds for the Skilled Worker route.',
  color: '#F59E0B'
}, {
  id: 'workexp',
  label: 'Work Experience',
  score: 4,
  max: 20,
  status: 'weak',
  insight: '18 months at Lagos University Teaching Hospital is a solid start — 3 years total unlocks senior-tier sponsorship.',
  color: '#EF4444'
}, {
  id: 'certs',
  label: 'Skills & Registrations',
  score: 6,
  max: 20,
  status: 'moderate',
  insight: 'NMC registration pending. Completing it is the single highest-impact action Adaeze can take right now.',
  color: '#F59E0B'
}];
const STRENGTHS: {
  id: string;
  label: string;
}[] = [{
  id: 'edu',
  label: 'BSc Nursing'
}, {
  id: 'lang',
  label: 'IELTS 6.5'
}, {
  id: 'age',
  label: 'Age Factor'
}, {
  id: 'fin',
  label: 'Financial Readiness'
}];
const AREAS_TO_IMPROVE: {
  id: string;
  label: string;
}[] = [{
  id: 'work',
  label: 'Work Experience'
}, {
  id: 'certs',
  label: 'NMC Registration'
}];
const ELIGIBILITY_ROWS: {
  id: string;
  label: string;
  value: string;
}[] = [{
  id: 'lang',
  label: 'Language',
  value: 'IELTS Academic 6.5 (7.0+ recommended)'
}, {
  id: 'edu',
  label: 'Education',
  value: 'BSc Nursing — ECCTIS verification required'
}, {
  id: 'reg',
  label: 'Registration',
  value: 'NMC (UK Nursing & Midwifery Council)'
}, {
  id: 'docs',
  label: 'Documents',
  value: '9 documents identified'
}];
const TIMELINE_ROWS: {
  id: string;
  phase: string;
  period: string;
  active: boolean;
}[] = [{
  id: 't1',
  phase: 'Preparation & IELTS',
  period: 'Month 1–3',
  active: false
}, {
  id: 't2',
  phase: 'NMC Registration',
  period: 'Month 3–6',
  active: true
}, {
  id: 't3',
  phase: 'Job Offer & Visa',
  period: 'Month 6–9',
  active: false
}, {
  id: 't4',
  phase: 'Relocation & Settlement',
  period: 'Month 9–12',
  active: false
}];
const NEXT_STEPS: {
  id: string;
  text: string;
  bold: string;
}[] = [{
  id: 'ns1',
  bold: 'Apply for NMC registration —',
  text: ' this is Adaeze\'s highest-leverage action and unlocks NHS employer sponsorship.'
}, {
  id: 'ns2',
  bold: 'Verify credentials via ECCTIS —',
  text: ' required for any UK professional nursing pathway.'
}, {
  id: 'ns3',
  bold: 'Retake IELTS targeting 7.0+ —',
  text: ' opens the Global Talent Visa and reduces sponsorship barriers.'
}, {
  id: 'ns4',
  bold: 'Build a JapaLearn account —',
  text: ' get a personalised week-by-week curriculum tailored to exactly this plan.'
}];

// ─── MINI SVG ICONS ────────────────────────────────────────────────────────────

function IcoArrow({
  size = 14,
  color = '#fff'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>;
}
function IcoCamera({
  size = 14,
  color = '#fff'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>;
}
function IcoMoon({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>;
}
function IcoRefresh({
  size = 13,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
    </svg>;
}
function IcoShield({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>;
}
function IcoCoin({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v2m0 4v2M9.5 10.5c0-1.1.9-2 2.5-2s2.5 1 2.5 2-1 1.5-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-.9 2.5-2" />
    </svg>;
}
function IcoClock({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>;
}
function IcoCheck({
  size = 11,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>;
}
function IcoWarn({
  size = 11,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>;
}
function IcoBarChart({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>;
}
function IcoListCheck({
  size = 15,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6H21M10 12H21M10 18H21M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
    </svg>;
}
function IcoUser({
  size = 32,
  color = '#FFFFFF'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>;
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  size = 128
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = score / TOTAL_MAX * circumference;
  const cx = size / 2;
  const cy = size / 2;
  const fillColor = score >= 75 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444';
  const label = score >= 75 ? 'Strong' : score >= 45 ? 'Moderate' : 'Early Stage';
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Readiness score: ${score} out of ${TOTAL_MAX}`}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#EEF2FF" strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${filled} ${circumference}`} transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#18181B" fontSize="26" fontWeight="900" fontFamily="'DM Sans', sans-serif">{score}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={fillColor} fontSize="11" fontWeight="700" fontFamily="'Inter', sans-serif">{label}</text>
    </svg>;
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────

function JapaLearnLogo({
  size = 26
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="JapaLearn AI" style={{
    flexShrink: 0
  }}>
      <circle cx="50" cy="50" r="47" stroke="#1E4DD7" strokeWidth="3.5" fill="white" />
      <path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill="#1E4DD7" />
      <path d="M50 22 C50 22 47 38 34 50 C47 62 50 78 50 78 C50 78 53 62 66 50 C53 38 50 22 50 22 Z" fill="white" opacity="0.75" />
    </svg>;
}

// ─── CARD ─────────────────────────────────────────────────────────────────────

function Card({
  children,
  style
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{
    background: '#FFFFFF',
    border: '1px solid #E8EEFF',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(30,77,215,0.06)',
    ...style
  }}>
      {children}
    </div>;
}
function SectionHeading({
  icon,
  title
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '20px'
  }}>
      <div style={{
      width: '30px',
      height: '30px',
      borderRadius: '8px',
      background: '#EEF2FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
        {icon}
      </div>
      <h2 style={{
      margin: 0,
      fontSize: '14px',
      fontWeight: 700,
      color: '#18181B',
      fontFamily: '"DM Sans", sans-serif',
      letterSpacing: '-0.2px'
    }}>
        {title}
      </h2>
    </div>;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function AdaezeReferralProfile({
  onSignUp
}: AdaezeReferralProfileProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [darkRequested, setDarkRequested] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const handleDarkToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    setDarkRequested(true);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  return <div style={{
    minHeight: '100vh',
    width: '100%',
    background: '#F7F9FF',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E8EEFF',
      height: '56px',
      padding: isMobile ? '0 16px' : '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
          <JapaLearnLogo size={24} />
          <span style={{
          fontSize: '15px',
          fontWeight: 800,
          color: '#18181B',
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.4px'
        }}>
            JapaLearn<span style={{
            color: '#1E4DD7'
          }}>AI</span>
          </span>
        </div>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
          {!isMobile && <span style={{
          fontSize: '12px',
          color: '#9CA3AF',
          fontWeight: 400,
          fontFamily: '"Inter", sans-serif'
        }}>
              Not legal advice · Educational tool
            </span>}
          <button onClick={onSignUp} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          letterSpacing: '-0.1px'
        }}>
            <span>Get My Score</span>
            <IcoArrow size={12} color="#fff" />
          </button>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main style={{
      maxWidth: '760px',
      margin: '0 auto',
      padding: isMobile ? '28px 16px 120px' : '48px 24px 72px',
      boxSizing: 'border-box'
    }}>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div style={{
        textAlign: 'center',
        marginBottom: isMobile ? '28px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
          {/* Referral badge */}
          <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          background: '#EEF2FF',
          border: '1px solid #C7D7FF',
          borderRadius: '20px',
          marginBottom: '16px'
        }}>
            <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <IcoUser size={11} color="#fff" />
            </div>
            <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#1E4DD7',
            fontFamily: '"Inter", sans-serif'
          }}>
              Adaeze Okafor shared her Migration Report
            </span>
          </div>
        </div>

        {/* ── PROFILE SUMMARY ──────────────────────────────────────────────── */}
        <Card style={{
        marginBottom: '14px'
      }}>

          {/* Profile row */}
          <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '14px',
          paddingBottom: '20px',
          marginBottom: '20px',
          borderBottom: '1px solid #F0F4FF'
        }}>
            {/* Avatar */}
            <div style={{
            width: '52px',
            height: '52px',
            flexShrink: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F2E99, #3B75FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <IcoUser size={26} color="#fff" />
            </div>
            <div style={{
            flex: 1,
            minWidth: 0
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '2px'
            }}>
                <p style={{
                margin: 0,
                fontSize: '17px',
                fontWeight: 800,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px'
              }}>
                  Adaeze Okafor
                </p>
              </div>
              <p style={{
              margin: '0 0 8px',
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: '"Inter", sans-serif'
            }}>
                BSc Nursing · <span style={{
                fontWeight: 600,
                color: '#374151'
              }}>Education: Bachelor's Degree</span> · Healthcare Worker
              </p>
              {/* Status pill */}
              <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '20px'
            }}>
                <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#F59E0B'
              }} />
                <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#92400E',
                fontFamily: '"Inter", sans-serif'
              }}>Moderate Candidate</span>
              </div>
            </div>
          </div>

          {/* Score + pathway */}
          <div style={{
          display: 'flex',
          gap: isMobile ? '20px' : '32px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center'
        }}>
            {/* Ring */}
            <div style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
              <ScoreRing score={TOTAL_SCORE} size={isMobile ? 108 : 124} />
            </div>

            {/* Pathway + tags */}
            <div style={{
            flex: 1,
            minWidth: 0
          }}>
              <p style={{
              margin: '0 0 4px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: '"Inter", sans-serif'
            }}>
                Best-fit pathway
              </p>
              <h2 style={{
              margin: '0 0 6px',
              fontSize: isMobile ? '18px' : '21px',
              fontWeight: 800,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.5px',
              lineHeight: 1.2
            }}>
                UK Skilled Worker Visa<br />
                <span style={{
                color: '#1E4DD7'
              }}>NHS Healthcare Pathway</span>
              </h2>
              <p style={{
              margin: '0 0 18px',
              fontSize: '13px',
              color: '#6B7280',
              lineHeight: 1.6,
              fontFamily: '"Inter", sans-serif'
            }}>
                Adaeze's nursing background and IELTS score qualify her for NHS Skilled Worker sponsorship — one of the most accessible UK routes for Nigerian healthcare workers.
              </p>

              {/* Strengths & Improve tags */}
              <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
                <div>
                  <p style={{
                  margin: '0 0 7px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: '"Inter", sans-serif'
                }}>Strengths</p>
                  <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                    {STRENGTHS.map(s => <div key={s.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 9px',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '20px'
                  }}>
                        <IcoCheck size={10} color="#059669" />
                        <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#065F46',
                      fontFamily: '"Inter", sans-serif'
                    }}>{s.label}</span>
                      </div>)}
                  </div>
                </div>
                <div>
                  <p style={{
                  margin: '0 0 7px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: '"Inter", sans-serif'
                }}>To Improve</p>
                  <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                    {AREAS_TO_IMPROVE.map(a => <div key={a.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 9px',
                    background: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    borderRadius: '20px'
                  }}>
                        <IcoWarn size={10} color="#D97706" />
                        <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#92400E',
                      fontFamily: '"Inter", sans-serif'
                    }}>{a.label}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── THREE STAT CARDS ─────────────────────────────────────────────── */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: '12px',
        marginBottom: '14px'
      }}>

          {/* Eligibility */}
          <Card style={{
          padding: '20px'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            marginBottom: '16px'
          }}>
              <IcoShield size={14} color="#1E4DD7" />
              <h3 style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.2px'
            }}>
                Eligibility
              </h3>
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '11px'
          }}>
              {ELIGIBILITY_ROWS.map(row => <div key={row.id}>
                  <p style={{
                margin: '0 0 2px',
                fontSize: '9px',
                fontWeight: 700,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: '"Inter", sans-serif'
              }}>
                    {row.label}
                  </p>
                  <p style={{
                margin: 0,
                fontSize: '12px',
                fontWeight: 600,
                color: '#18181B',
                lineHeight: 1.4,
                fontFamily: '"Inter", sans-serif'
              }}>
                    {row.value}
                  </p>
                </div>)}
            </div>
          </Card>

          {/* Estimated Cost */}
          <Card style={{
          padding: '20px'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            marginBottom: '16px'
          }}>
              <IcoCoin size={14} color="#1E4DD7" />
              <h3 style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.2px'
            }}>
                Estimated Cost
              </h3>
            </div>
            <p style={{
            margin: '0 0 4px',
            fontSize: '26px',
            fontWeight: 900,
            color: '#18181B',
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: '-1px',
            lineHeight: 1
          }}>
              ₦5M – ₦10M
            </p>
            <p style={{
            margin: '0 0 14px',
            fontSize: '11px',
            color: '#6B7280',
            lineHeight: 1.55,
            fontFamily: '"Inter", sans-serif'
          }}>
              Visa fees, IELTS, NMC, ECCTIS, maintenance funds & first-year costs.
            </p>
            <div style={{
            padding: '8px 12px',
            background: '#F0F4FF',
            borderRadius: '8px',
            border: '1px solid #DBEAFE'
          }}>
              <p style={{
              margin: 0,
              fontSize: '11px',
              color: '#1E4DD7',
              fontWeight: 600,
              lineHeight: 1.4,
              fontFamily: '"Inter", sans-serif'
            }}>
                NHS sponsorship can offset visa costs significantly.
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <Card style={{
          padding: '20px'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            marginBottom: '16px'
          }}>
              <IcoClock size={14} color="#1E4DD7" />
              <h3 style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.2px'
            }}>
                Timeline
              </h3>
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '9px'
          }}>
              {TIMELINE_ROWS.map(row => <div key={row.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
                  <span style={{
                fontSize: '12px',
                fontWeight: row.active ? 700 : 500,
                color: row.active ? '#1E4DD7' : '#374151',
                fontFamily: '"Inter", sans-serif'
              }}>
                    {row.phase}
                  </span>
                  <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: row.active ? '#1E4DD7' : '#9CA3AF',
                background: row.active ? '#EEF2FF' : 'transparent',
                border: row.active ? '1px solid #C7D7FF' : 'none',
                padding: row.active ? '2px 8px' : '0',
                borderRadius: '20px',
                flexShrink: 0,
                fontFamily: '"Inter", sans-serif'
              }}>
                    {row.period}
                  </span>
                </div>)}
            </div>
            <div style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #F0F4FF'
          }}>
              <p style={{
              margin: 0,
              fontSize: '11px',
              color: '#6B7280',
              fontFamily: '"Inter", sans-serif'
            }}>
                Adaeze is currently in <strong style={{
                color: '#1E4DD7',
                fontFamily: '"DM Sans", sans-serif'
              }}>Phase 2</strong> — NMC Registration.
              </p>
            </div>
          </Card>
        </div>

        {/* ── SCORE BREAKDOWN ──────────────────────────────────────────────── */}
        <Card style={{
        marginBottom: '14px'
      }}>
          <SectionHeading icon={<IcoBarChart size={14} color="#1E4DD7" />} title="Full Score Breakdown" />

          {/* Total score bar */}
          <div style={{
          padding: '14px 16px',
          background: '#F7F9FF',
          border: '1px solid #E8EEFF',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
            <div>
              <p style={{
              margin: '0 0 2px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#6B7280',
              fontFamily: '"Inter", sans-serif'
            }}>Overall Readiness Score</p>
              <p style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 900,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.6px'
            }}>
                {TOTAL_SCORE} <span style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#9CA3AF',
                fontFamily: '"Inter", sans-serif'
              }}>/ {TOTAL_MAX}</span>
              </p>
            </div>
            <div style={{
            flex: 1,
            maxWidth: '180px'
          }}>
              <div style={{
              height: '8px',
              background: '#EEF2FF',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
                <div style={{
                width: `${TOTAL_SCORE}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                borderRadius: '4px'
              }} />
              </div>
              <p style={{
              margin: '4px 0 0',
              fontSize: '10px',
              color: '#9CA3AF',
              textAlign: 'right',
              fontFamily: '"Inter", sans-serif'
            }}>
                44 points to unlock strong tier
              </p>
            </div>
          </div>

          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}>
            {SCORE_BREAKDOWN.map(cat => {
            const pct = Math.round(cat.score / cat.max * 100);
            return <div key={cat.id}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '7px'
              }}>
                    <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.1px'
                }}>{cat.label}</span>
                    <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: cat.color,
                  fontFamily: '"DM Sans", sans-serif'
                }}>{cat.score}/{cat.max}</span>
                  </div>
                  <div style={{
                height: '7px',
                background: '#F0F4FF',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '6px'
              }}>
                    <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: cat.color,
                  borderRadius: '4px'
                }} />
                  </div>
                  <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#6B7280',
                lineHeight: 1.6,
                fontFamily: '"Inter", sans-serif'
              }}>
                    {cat.insight}
                  </p>
                </div>;
          })}
          </div>
        </Card>

        {/* ── NEXT STEPS ───────────────────────────────────────────────────── */}
        <Card style={{
        marginBottom: '14px'
      }}>
          <SectionHeading icon={<IcoListCheck size={14} color="#1E4DD7" />} title="Adaeze's Next Steps" />
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
            {NEXT_STEPS.map((step, idx) => <div key={step.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '13px'
          }}>
                <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                  <span style={{
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: '"DM Sans", sans-serif'
              }}>{idx + 1}</span>
                </div>
                <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#374151',
              lineHeight: 1.65,
              fontFamily: '"Inter", sans-serif'
            }}>
                  <strong style={{
                color: '#18181B',
                fontWeight: 700,
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.1px'
              }}>{step.bold}</strong>
                  <span>{step.text}</span>
                </p>
              </div>)}
          </div>
        </Card>

        {/* ── CTA BLOCK ────────────────────────────────────────────────────── */}
        <div style={{
        background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 55%, #3B75FF 100%)',
        borderRadius: '20px',
        padding: isMobile ? '28px 20px' : '36px 40px',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
          <p style={{
          margin: '0 0 6px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: '"Inter", sans-serif'
        }}>
            Want to know where YOU stand?
          </p>
          <h2 style={{
          margin: '0 0 10px',
          fontSize: isMobile ? '22px' : '28px',
          fontWeight: 800,
          color: '#FFFFFF',
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.7px',
          lineHeight: 1.15
        }}>
            Get Your Own Migration Report
          </h2>
          <p style={{
          margin: '0 0 24px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.65,
          fontFamily: '"Inter", sans-serif'
        }}>
            Answer 12 quick questions. Our AI analyses your profile and gives you a personalised readiness score, pathway recommendation, and step-by-step plan — just like Adaeze's.
          </p>
          <button onClick={onSignUp} style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
          padding: '14px 36px',
          background: '#FFFFFF',
          color: '#1E4DD7',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.3px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          width: isMobile ? '100%' : 'auto'
        }}>
            <span>Take the Free Assessment</span>
            <IcoArrow size={14} color="#1E4DD7" />
          </button>
          <p style={{
          margin: '12px 0 0',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: '"Inter", sans-serif'
        }}>
            Free · 3 minutes · No credit card
          </p>
        </div>

        {/* Footer */}
        <footer style={{
        textAlign: 'center'
      }}>
          <p style={{
          margin: 0,
          fontSize: '11px',
          color: '#C4C9D8',
          fontFamily: '"Inter", sans-serif',
          lineHeight: 1.7
        }}>
            Not legal advice · Not a visa agency · JapaLearn AI is an educational tool<br />
            © 2025 JapaLearn AI · Nigeria's leading UK migration intelligence platform
          </p>
        </footer>
      </main>

      {/* ── MOBILE STICKY CTA ────────────────────────────────────────────────── */}
      {isMobile && <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '12px 16px 22px',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #E8EEFF',
      zIndex: 50
    }}>
          <button onClick={onSignUp} style={{
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #0F2E99, #1E4DD7, #3B75FF)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: '"DM Sans", sans-serif',
        letterSpacing: '-0.2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '9px',
        boxShadow: '0 4px 16px rgba(30,77,215,0.28)'
      }}>
            <span>Take the Free Assessment</span>
            <IcoArrow size={13} color="#fff" />
          </button>
          <p style={{
        margin: '6px 0 0',
        fontSize: '11px',
        color: '#9CA3AF',
        textAlign: 'center',
        fontFamily: '"Inter", sans-serif'
      }}>
            Free · 3 minutes · No credit card required
          </p>
        </div>}
    </div>;
}