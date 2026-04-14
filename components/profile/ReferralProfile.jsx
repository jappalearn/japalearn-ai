import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  CircleDollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  ClipboardCheck,
  User,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import Logo from "@/lib/Logo";

// ─── DEFAULT DATA (ADAEZE DEMO) ────────────────────────────────────────────────

const defaultProfile = {
  fullName: "Adaeze Okafor",
  profession: "Healthcare Worker",
  education: "BSc Nursing",
  status: "Moderate Candidate",
  statusColor: '#F59E0B',
  score: 56,
  destination: "UK",
  pathwayTitle: "UK Skilled Worker Visa",
  pathwaySubtitle: "NHS Healthcare Pathway",
  summary: "Adaeze's nursing background and IELTS score qualify her for NHS Skilled Worker sponsorship — one of the most accessible UK routes for Nigerian healthcare workers.",
  strengths: [
    { id: 'edu', label: 'BSc Nursing' },
    { id: 'lang', label: 'IELTS 6.5' },
    { id: 'age', label: 'Age Factor' },
    { id: 'fin', label: 'Financial Readiness' }
  ],
  areasToImprove: [
    { id: 'work', label: 'Work Experience' },
    { id: 'certs', label: 'NMC Registration' }
  ],
  eligibility: [
    { id: 'lang', label: 'Language', value: 'IELTS Academic 6.5 (7.0+ recommended)' },
    { id: 'edu', label: 'Education', value: 'BSc Nursing — ECCTIS verification required' },
    { id: 'reg', label: 'Registration', value: 'NMC (UK Nursing & Midwifery Council)' },
    { id: 'docs', label: 'Documents', value: '9 documents identified' }
  ],
  costRange: "₦5M – ₦10M",
  costNote: "NHS sponsorship can offset visa costs significantly.",
  timeline: [
    { id: 't1', phase: 'Preparation & IELTS', period: 'Month 1–3', active: false },
    { id: 't2', phase: 'NMC Registration', period: 'Month 3–6', active: true },
    { id: 't3', phase: 'Job Offer & Visa', period: 'Month 6–9', active: false },
    { id: 't4', phase: 'Relocation & Settlement', period: 'Month 9–12', active: false }
  ],
  phaseText: "Adaeze is currently in Phase 2 — NMC Registration.",
  breakdown: [
    { id: 'education', label: 'Education', score: 14, max: 20, color: '#10B981', insight: 'BSc Nursing qualifies directly for NHS Skilled Worker pathway.' },
    { id: 'language', label: 'Language Test', score: 16, max: 20, color: '#3B75FF', insight: 'IELTS Academic 6.5 clears the minimum.' },
    { id: 'age', label: 'Age Factor', score: 10, max: 10, color: '#10B981', insight: 'Optimal age band.' },
    { id: 'financial', label: 'Financial Readiness', score: 6, max: 10, color: '#F59E0B', insight: '₦5M–8M in savings covers application fees.' },
    { id: 'workexp', label: 'Work Experience', score: 4, max: 20, color: '#EF4444', insight: '18 months at LUTH is a solid start.' },
    { id: 'certs', label: 'Skills & Registrations', score: 6, max: 20, color: '#F59E0B', insight: 'NMC registration pending.' }
  ],
  nextSteps: [
    { id: 'ns1', bold: 'Apply for NMC registration —', text: ' unlocks NHS employer sponsorship.' },
    { id: 'ns2', bold: 'Verify credentials via ECCTIS —', text: ' required for UK professional pathways.' },
    { id: 'ns3', bold: 'Retake IELTS targeting 7.0+ —', text: ' reduces sponsorship barriers.' },
    { id: 'ns4', bold: 'Build a JapaLearn account —', text: ' get a personalised week-by-week curriculum.' }
  ]
};

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

function UserAvatar({ name, url, size = 52 }) {
  if (url) {
    return (
      <img 
        src={url} 
        alt={name} 
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid #E4E8FF', padding: '1px' }} 
      />
    );
  }
  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '3px solid #E4E8FF'
    }}>
      <span style={{ fontSize: size * 0.4, fontWeight: 800, color: '#fff', fontFamily: '"DM Sans", sans-serif' }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ 
      background: '#FFFFFF', 
      border: '1px solid #E5E7EB', 
      borderRadius: '16px', 
      padding: '24px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)', 
      ...style 
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ icon, title, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', ...style }}>
      <div style={{ color: '#1E4DD7', display: 'flex', alignItems: 'center' }}>
        {icon}
      </div>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif', textTransform: 'none' }}>
        {title}
      </h2>
    </div>
  );
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 100 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  const fillColor = score >= 75 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444';
  const label = score >= 75 ? 'Strong' : score >= 45 ? 'Moderate' : 'Early';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${filled} ${circumference}`} transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#18181B', fontFamily: '"DM Sans", sans-serif', lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: '9px', fontWeight: 700, color: fillColor, textTransform: 'uppercase', marginTop: '2px' }}>{label}</span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ReferralProfile({ onSignUp, profileData }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Use dynamic data or fall back to default (Adaeze)
  const d = profileData || defaultProfile;

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8FAFF', fontFamily: '"Inter", sans-serif', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', height: '64px', padding: isMobile ? '0 16px' : '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Logo size={32} />
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#18181B', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.5px' }}>
              JapaLearn <span style={{ color: '#1E4DD7' }}>AI</span>
            </span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isMobile && <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Not legal advice · Educational tool</span>}
          <button onClick={onSignUp} style={{ padding: '10px 20px', background: '#1E4DD7', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
            Get My Score
          </button>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '24px 16px 80px' : '40px 24px 80px', boxSizing: 'border-box' }}>

        {/* ── PAGE HEADER / BADGE ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: '#EEF2FF', border: '1px solid #C7D7FF', borderRadius: '30px', marginBottom: '24px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1E4DD7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={12} color="#fff" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E4DD7' }}>
              {d.fullName} shared their Migration Report
            </span>
          </div>
        </div>

        {/* ── PROFILE HERO CARD ──────────────────────────────────────────── */}
        <Card style={{ marginBottom: '16px' }}>
          
          {/* Top profile info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
            <UserAvatar name={d.fullName} url={d.avatar_url} size={64} />
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>
                {d.fullName}
              </h1>
              <p style={{ margin: '4px 0 10px', fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
                {d.profession}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: `${d.statusColor}15`, border: `1px solid ${d.statusColor}30`, borderRadius: '30px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.statusColor }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: d.statusColor }}>{d.status}</span>
              </div>
            </div>
          </div>

          {/* Details split */}
          <div style={{ display: 'flex', gap: isMobile ? '24px' : '40px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
            {/* Score Ring */}
            <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
              <ScoreRing score={d.score} size={110} />
            </div>

            {/* Narrative Content */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Best-fit pathway</p>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800, color: '#18181B', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.2 }}>
                {d.pathwayTitle}
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>
                {d.summary}
              </p>

              {/* Factors grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strengths</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {d.strengths.slice(0, 3).map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: '20px' }}>
                        <CheckCircle2 size={10} color="#10B981" />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#065F46' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To Improve</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {d.areasToImprove.slice(0, 3).map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '20px' }}>
                        <AlertCircle size={10} color="#F59E0B" />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#9A3412' }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ── DETAILED INSIGHTS GRID ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          
          <Card style={{ padding: '24px' }}>
            <SectionHeading icon={<ShieldCheck size={18} />} title="Eligibility" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {d.eligibility.map(row => (
                <div key={row.id}>
                  <p style={{ margin: '0 0 4px', fontSize: '9px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#18181B' }}>{row.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: '24px' }}>
            <SectionHeading icon={<CircleDollarSign size={18} />} title="Estimated Cost" />
            <p style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 900, color: '#18181B', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-1.2px' }}>{d.costRange}</p>
            <p style={{ margin: '0 0 20px', fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>Visa fees, IELTS, NMC, ECCTIS, maintenance funds & first-year costs.</p>
            <div style={{ padding: '10px 14px', background: '#F5F8FF', borderRadius: '10px', border: '1px solid #D9E5FF' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#1E4DD7', fontWeight: 600, lineHeight: 1.4 }}>{d.costNote}</p>
            </div>
          </Card>

          <Card style={{ padding: '24px' }}>
            <SectionHeading icon={<Clock size={18} />} title="Timeline" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {d.timeline.map(row => (
                <div key={row.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: row.active ? 800 : 500, color: row.active ? '#1E4DD7' : '#4B5563' }}>{row.phase}</span>
                  {row.active ? (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 10px', background: '#1E4DD7', borderRadius: '12px', color: '#FFFFFF' }}>{row.period}</span>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#9CA3AF' }}>{row.period}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>
                {d.fullName.split(' ')[0]} is currently in <span style={{ color: '#1E4DD7', fontWeight: 700 }}>Phase 2</span> — NMC Registration.
              </p>
            </div>
          </Card>
        </div>

        {/* ── SCORE BREAKDOWN ────────────────────────────────────────────── */}
        <Card style={{ marginBottom: '16px' }}>
          <SectionHeading icon={<BarChart3 size={18} />} title="Full Score Breakdown" />
          
          {/* Main Score Bar Area */}
          <div style={{ padding: '24px', background: '#F9FAFF', border: '1px solid #E5E7EB', borderRadius: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Overall Readiness Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>{d.score}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#9CA3AF' }}>/ 100</span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#1E4DD7' }}>
                {d.score < 70 ? `${70 - d.score} points to unlock strong tier` : 'Strong candidate tier achieved'}
              </p>
            </div>
            <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${d.score}%`, height: '100%', background: '#1E4DD7', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Individual Category Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {d.breakdown.map(cat => (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181B', fontFamily: '"DM Sans", sans-serif' }}>{cat.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#18181B' }}>{cat.score}<span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>/{cat.max}</span></span>
                </div>
                <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', marginBottom: '8px' }}>
                  <div style={{ width: `${(cat.score / cat.max) * 100}%`, height: '100%', background: cat.color, borderRadius: '3px' }} />
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>{cat.insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── ACTION PLAN / NEXT STEPS ────────────────────────────────────── */}
        <Card style={{ marginBottom: '16px' }}>
          <SectionHeading icon={<ClipboardCheck size={18} />} title={`${d.fullName.split(' ')[0]}'s Next Steps`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {d.nextSteps.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1E4DD7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 900 }}>
                  {idx + 1}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#18181B', lineHeight: 1.6 }}>
                    <strong style={{ fontWeight: 700 }}>{step.bold}</strong> {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── FINAL CTA BLOCK ────────────────────────────────────────────── */}
        <div style={{ background: '#1E4DD7', borderRadius: '24px', padding: isMobile ? '40px 24px' : '60px 48px', textAlign: 'center', color: '#FFFFFF' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>Want to know where you stand?</p>
          <h2 style={{ margin: '0 0 16px', fontSize: isMobile ? '26px' : '32px', fontWeight: 800, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.1 }}>
            Get Your Own Migration Report
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '15px', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 32px', opacity: 0.8 }}>
            Answer 12 quick questions. Our AI analyses your profile and gives you a personalised readiness score, pathway recommendation, and step-by-step plan — just like {d.fullName.split(' ')[0]}'s.
          </p>
          <button onClick={onSignUp} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 32px', background: '#FFFFFF', color: '#1E4DD7', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            <span>Take the Free Assessment</span>
            <ArrowRight size={18} />
          </button>
          <p style={{ marginTop: '16px', fontSize: '11px', opacity: 0.7 }}>
            Free · 3 minutes · No credit card required
          </p>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '56px', textAlign: 'center', paddingBottom: '40px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF', lineHeight: 2 }}>
            Not legal advice · Not a visa agency · JapLearn AI is an educational tool<br />
            © {new Date().getFullYear()} JapaLearn AI · Nigeria's leading migration intelligence platform
          </p>
        </footer>
      </main>

      {/* ── MOBILE STICKY CTA ────────────────────────────────────────────────── */}
      {isMobile && <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px 32px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', zIndex: 1000 }}>
        <button onClick={onSignUp} style={{ width: '100%', padding: '16px', background: '#1E4DD7', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>Get My Score</span>
          <ArrowRight size={18} />
        </button>
      </div>}
    </div>
  );
}
