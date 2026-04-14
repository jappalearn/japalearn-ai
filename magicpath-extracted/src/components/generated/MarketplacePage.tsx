import React, { useState } from 'react';
import { IconCheckCircle, IconArrowRight, IconBell, IconCalendar } from './Icons';
function IconStarFill({
  size = 14,
  color = '#F59A0A'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>;
}
function IconShield({
  size = 16,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>;
}
function IconSearch({
  size = 16,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>;
}
function IconClock({
  size = 14,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>;
}
function IconMessageCircle({
  size = 14,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>;
}
function IconAward({
  size = 14,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>;
}
function IconVideo({
  size = 14,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>;
}
function IconBriefcase({
  size = 14,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>;
}
interface ConsultantData {
  id: string;
  name: string;
  initials: string;
  title: string;
  org: string;
  rating: number;
  reviews: number;
  priceFrom: string;
  priceHr: string;
  tags: string[];
  specialties: string[];
  verified: boolean;
  bg: string;
  responseTime: string;
  successRate: string;
  casesHandled: number;
  available: boolean;
  featured: boolean;
  languages: string[];
  badge: string;
  badgeColor: string;
  badgeBg: string;
}
const CONSULTANTS: ConsultantData[] = [{
  id: 'mc1',
  name: 'Solicitor James Okafor',
  initials: 'JO',
  title: 'Immigration Barrister',
  org: "OISC Level 3 · Lincoln's Inn Chambers",
  rating: 4.9,
  reviews: 142,
  priceFrom: '₦120,000',
  priceHr: '₦85,000/hr',
  tags: ['Skilled Worker', 'Family Visa', 'Appeals'],
  specialties: ['UK Skilled Worker', 'Visa Appeals', 'Judicial Review', 'Family Reunification'],
  verified: true,
  bg: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
  responseTime: '< 2 hrs',
  successRate: '97%',
  casesHandled: 340,
  available: true,
  featured: true,
  languages: ['English', 'Yoruba', 'Igbo'],
  badge: 'Top Rated',
  badgeColor: '#D97706',
  badgeBg: '#FFF7E6'
}, {
  id: 'mc2',
  name: 'Amaka Consulting Ltd',
  initials: 'AC',
  title: 'Senior Immigration Advisor',
  org: 'OISC Registered · 12 yrs experience',
  rating: 4.7,
  reviews: 98,
  priceFrom: '₦70,000',
  priceHr: '₦55,000/hr',
  tags: ['Student Visa', 'Skilled Worker', 'NHS'],
  specialties: ['NHS Recruitment', 'Student Visa', 'Skilled Worker Visa', 'Dependant Visas'],
  verified: true,
  bg: 'linear-gradient(135deg, #059669, #10B981)',
  responseTime: '< 4 hrs',
  successRate: '94%',
  casesHandled: 210,
  available: true,
  featured: false,
  languages: ['English', 'Igbo'],
  badge: 'NHS Specialist',
  badgeColor: '#059669',
  badgeBg: '#E8F9EE'
}, {
  id: 'mc3',
  name: 'UK Path Advisors',
  initials: 'UP',
  title: 'Principal Immigration Consultant',
  org: 'FCA Authorised · ILPA Member',
  rating: 4.8,
  reviews: 203,
  priceFrom: '₦90,000',
  priceHr: '₦70,000/hr',
  tags: ['Entrepreneur Visa', 'Spouse Visa', 'EU Settlement'],
  specialties: ['Innovator Founder Visa', 'Spouse & Partner Visas', 'EU Settlement Scheme', 'Indefinite Leave'],
  verified: true,
  bg: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  responseTime: '< 3 hrs',
  successRate: '96%',
  casesHandled: 415,
  available: false,
  featured: false,
  languages: ['English', 'French'],
  badge: 'ILPA Member',
  badgeColor: '#7C3AED',
  badgeBg: '#F0EEFF'
}, {
  id: 'mc4',
  name: 'Chioma Eze-Williams',
  initials: 'CE',
  title: 'Healthcare Immigration Specialist',
  org: 'OISC Level 2 · Registered Nurse (UK)',
  rating: 4.9,
  reviews: 67,
  priceFrom: '₦65,000',
  priceHr: '₦50,000/hr',
  tags: ['Skilled Worker', 'NHS', 'Care Sector'],
  specialties: ['NMC Registration', 'Tier 2 Health & Care', 'UK Nurse Pathway', 'OET Preparation'],
  verified: true,
  bg: 'linear-gradient(135deg, #EC4899, #F43F5E)',
  responseTime: '< 1 hr',
  successRate: '99%',
  casesHandled: 89,
  available: true,
  featured: false,
  languages: ['English', 'Igbo', 'Pidgin'],
  badge: 'Healthcare Pro',
  badgeColor: '#EC4899',
  badgeBg: '#FFF0F6'
}];
const TRUST_STATS: {
  val: string;
  label: string;
}[] = [{
  val: '100%',
  label: 'OISC Verified'
}, {
  val: '96%',
  label: 'Avg. Success Rate'
}, {
  val: '1,200+',
  label: 'Visas Secured'
}, {
  val: '< 3 hrs',
  label: 'Avg. Response'
}];
const CATEGORY_FILTERS: {
  id: string;
  label: string;
}[] = [{
  id: 'all',
  label: 'All'
}, {
  id: 'skilled',
  label: 'Skilled Worker'
}, {
  id: 'healthcare',
  label: 'Healthcare'
}, {
  id: 'family',
  label: 'Family Visa'
}, {
  id: 'student',
  label: 'Student Visa'
}, {
  id: 'entrepreneur',
  label: 'Entrepreneur'
}];
function StarRating({
  rating,
  size = 13
}: {
  rating: number;
  size?: number;
}) {
  return <span style={{
    display: 'inline-flex',
    gap: '1px',
    alignItems: 'center'
  }}>
      {[1, 2, 3, 4, 5].map(i => <IconStarFill key={i} size={size} color={i <= Math.floor(rating) ? '#F59A0A' : '#E5E7EB'} />)}
    </span>;
}
export function MarketplacePage({
  isMobile
}: {
  isMobile: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const filteredConsultants = CONSULTANTS.filter(c => {
    const matchesSearch = searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) || c.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || activeCategory === 'skilled' && c.tags.some(t => t.toLowerCase().includes('skilled')) || activeCategory === 'healthcare' && c.tags.some(t => t.toLowerCase().includes('nhs') || t.toLowerCase().includes('health') || t.toLowerCase().includes('care')) || activeCategory === 'family' && c.tags.some(t => t.toLowerCase().includes('family') || t.toLowerCase().includes('spouse')) || activeCategory === 'student' && c.tags.some(t => t.toLowerCase().includes('student')) || activeCategory === 'entrepreneur' && c.tags.some(t => t.toLowerCase().includes('entrepreneur'));
    return matchesSearch && matchesCategory;
  });

  // ── MOBILE ─────────────────────────────────────────────────────────────────
  if (isMobile) {
    return <div>
        {/* Header */}
        <div style={{
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
          <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 700,
          color: '#18181B',
          letterSpacing: '-0.4px',
          fontFamily: '"DM Sans", sans-serif'
        }}>
            Marketplace
          </h1>
          <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#7C6AF7',
          background: '#F0EEFF',
          border: '1px solid #DDD6FE',
          padding: '2px 8px',
          borderRadius: '20px'
        }}>
            MVP 2
          </span>
        </div>

        {/* Hero Banner */}
        <div style={{
        background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 55%, #3B75FF 100%)',
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '14px',
        boxShadow: '0px 12px 40px rgba(30,77,215,0.3)'
      }}>
          <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 9px',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: '7px',
          fontSize: '10px',
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
            <IconShield size={9} color="#FFFFFF" />
            <span>OISC-Verified Only</span>
          </span>
          <p style={{
          margin: '0 0 4px',
          fontSize: '17px',
          fontWeight: 800,
          color: '#FFFFFF',
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.4px',
          lineHeight: 1.25
        }}>
            Find a trusted immigration consultant
          </p>
          <p style={{
          margin: '0 0 12px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.5'
        }}>
            Licence-checked, rated, and scam-protected.
          </p>
          <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px'
        }}>
            {TRUST_STATS.map(s => <div key={s.val} style={{
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
                <p style={{
              margin: '0 0 1px',
              fontSize: '15px',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '"DM Sans", sans-serif'
            }}>{s.val}</p>
                <p style={{
              margin: 0,
              fontSize: '10px',
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500
            }}>{s.label}</p>
              </div>)}
          </div>
        </div>

        {/* Search */}
        <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #E4E8FF',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
      }}>
          <IconSearch size={14} color="#B0B4C4" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, visa type..." style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: '13px',
          color: '#18181B',
          background: 'transparent',
          fontFamily: '"Inter", sans-serif'
        }} />
        </div>

        {/* Category Filters */}
        <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        marginBottom: '14px'
      }}>
          {CATEGORY_FILTERS.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
          padding: '6px 13px',
          background: activeCategory === cat.id ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#FFFFFF',
          border: `1.5px solid ${activeCategory === cat.id ? 'transparent' : '#E4E8FF'}`,
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: activeCategory === cat.id ? 700 : 500,
          color: activeCategory === cat.id ? '#FFFFFF' : '#6B7280',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: '"Inter", sans-serif'
        }}>
              {cat.label}
            </button>)}
        </div>

        {/* Consultant Cards — compact mobile */}
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
          {filteredConsultants.map(c => <div key={c.id} style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px',
          border: `1.5px solid ${c.featured ? '#B3C5FF' : '#F0F2FF'}`,
          boxShadow: c.featured ? '0px 4px 18px rgba(30,77,215,0.08)' : '0px 1px 6px rgba(30,77,215,0.04)'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            marginBottom: '10px'
          }}>
                <div style={{
              position: 'relative',
              flexShrink: 0
            }}>
                  <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: c.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif'
              }}>
                    {c.initials}
                  </div>
                  {c.available && <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#21C474',
                border: '2px solid #FFFFFF'
              }} />}
                </div>
                <div style={{
              flex: 1,
              minWidth: 0
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '1px',
                flexWrap: 'wrap'
              }}>
                    <p style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#18181B'
                }}>{c.name}</p>
                    {c.verified && <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '1px 5px',
                  background: '#E8F9EE',
                  borderRadius: '20px',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#21C474'
                }}>
                        <IconCheckCircle size={8} color="#21C474" strokeWidth={2.5} />
                        <span>OISC</span>
                      </span>}
                  </div>
                  <p style={{
                margin: 0,
                fontSize: '11px',
                color: '#82858A'
              }}>{c.title}</p>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px'
              }}>
                    <StarRating rating={c.rating} size={10} />
                    <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#18181B'
                }}>{c.rating}</span>
                    <span style={{
                  fontSize: '10px',
                  color: '#82858A'
                }}>({c.reviews})</span>
                  </div>
                </div>
                <div style={{
              textAlign: 'right',
              flexShrink: 0
            }}>
                  <p style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 800,
                color: '#1E4DD7',
                fontFamily: '"DM Sans", sans-serif'
              }}>{c.priceFrom}</p>
                  <p style={{
                margin: 0,
                fontSize: '10px',
                color: '#82858A'
              }}>{c.priceHr}</p>
                </div>
              </div>

              {/* Tags */}
              <div style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}>
                {c.tags.map(tag => <span key={tag} style={{
              padding: '2px 7px',
              background: '#F4F6FF',
              border: '1px solid #E0E4F5',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 500,
              color: '#4D4D56'
            }}>{tag}</span>)}
              </div>

              {/* Actions */}
              <div style={{
            display: 'flex',
            gap: '6px'
          }}>
                <button style={{
              flex: 1,
              padding: '7px',
              background: '#F4F6FF',
              color: '#4D4D56',
              border: '1px solid #E0E4F5',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
                  <IconMessageCircle size={11} color="#4D4D56" />
                  <span>Message</span>
                </button>
                <button style={{
              flex: 1,
              padding: '7px',
              background: c.available ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F4F6FF',
              color: c.available ? '#FFFFFF' : '#82858A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif'
            }}>
                  {c.available ? 'Book' : 'Waitlist'}
                </button>
              </div>
            </div>)}

          {filteredConsultants.length === 0 && <div style={{
          textAlign: 'center',
          padding: '36px 20px',
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #F0F2FF'
        }}>
              <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#82858A'
          }}>No consultants match your search.</p>
            </div>}
        </div>
      </div>;
  }

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  return <div style={{
    maxWidth: '900px'
  }}>

      {/* Page header */}
      <div style={{
      marginBottom: '24px'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '4px'
      }}>
          <h1 style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: 800,
          color: '#18181B',
          letterSpacing: '-0.6px',
          fontFamily: '"DM Sans", sans-serif'
        }}>
            Consultant Marketplace
          </h1>
          <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#7C6AF7',
          background: '#F0EEFF',
          border: '1px solid #DDD6FE',
          padding: '3px 10px',
          borderRadius: '20px'
        }}>
            Coming Soon
          </span>
        </div>
        <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#82858A',
        lineHeight: '1.6'
      }}>
          Every consultant is OISC-registered, licence-verified, and rated by Nigerian applicants — zero scam risk.
        </p>
      </div>

      {/* Hero trust banner */}
      <div style={{
      background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)',
      borderRadius: '22px',
      padding: '24px 28px',
      marginBottom: '20px',
      boxShadow: '0px 16px 50px rgba(30,77,215,0.28)',
      overflow: 'hidden'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '28px',
        flexWrap: 'wrap'
      }}>
          {/* Left */}
          <div style={{
          flex: 1,
          minWidth: '200px'
        }}>
            <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
              <IconShield size={10} color="#FFFFFF" />
              <span>Scam-Protected · OISC Verified Only</span>
            </span>
            <p style={{
            margin: '0 0 4px',
            fontSize: '20px',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: '-0.4px',
            lineHeight: 1.25
          }}>
              Find the right immigration expert — without the risk
            </p>
            <p style={{
            margin: '0 0 16px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.6'
          }}>
              All consultants are verified against the OISC register. Pay via escrow — your money stays protected.
            </p>
            <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
              <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              background: '#FFFFFF',
              color: '#1E4DD7',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              boxShadow: '0px 4px 14px rgba(0,0,0,0.15)'
            }}>
                <IconBriefcase size={13} color="#1E4DD7" />
                <span>Browse Consultants</span>
              </button>
              <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif'
            }}>
                <IconVideo size={13} color="#FFFFFF" />
                <span>How it works</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
          width: '1px',
          background: 'rgba(255,255,255,0.12)',
          flexShrink: 0,
          alignSelf: 'stretch'
        }} aria-hidden="true" />

          {/* Stats */}
          <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          alignContent: 'center',
          minWidth: '190px'
        }}>
            {TRUST_STATS.map(s => <div key={s.val} style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
                <p style={{
              margin: '0 0 1px',
              fontSize: '20px',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.5px'
            }}>{s.val}</p>
                <p style={{
              margin: 0,
              fontSize: '10px',
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500
            }}>{s.label}</p>
              </div>)}
          </div>
        </div>
      </div>

      {/* Search + filter row */}
      <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap'
    }}>
        <div style={{
        flex: 1,
        minWidth: '200px',
        background: '#FFFFFF',
        border: '1.5px solid #E4E8FF',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
      }}>
          <IconSearch size={15} color="#B0B4C4" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, visa type, speciality..." style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: '13px',
          color: '#18181B',
          background: 'transparent',
          fontFamily: '"Inter", sans-serif'
        }} />
          {searchQuery && <button onClick={() => setSearchQuery('')} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#B0B4C4',
          fontSize: '18px',
          lineHeight: 1,
          padding: 0
        }}>×</button>}
        </div>

        <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      }}>
          {CATEGORY_FILTERS.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
          padding: '7px 14px',
          background: activeCategory === cat.id ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#FFFFFF',
          border: `1.5px solid ${activeCategory === cat.id ? 'transparent' : '#E4E8FF'}`,
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: activeCategory === cat.id ? 700 : 500,
          color: activeCategory === cat.id ? '#FFFFFF' : '#6B7280',
          cursor: 'pointer',
          fontFamily: '"Inter", sans-serif',
          boxShadow: activeCategory === cat.id ? '0px 3px 10px rgba(30,77,215,0.22)' : 'none',
          whiteSpace: 'nowrap'
        }}>
              {cat.label}
            </button>)}
        </div>
      </div>

      {/* Results count */}
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    }}>
        <p style={{
        margin: 0,
        fontSize: '13px',
        color: '#82858A',
        fontWeight: 500
      }}>
          <span style={{
          fontWeight: 700,
          color: '#18181B'
        }}>{filteredConsultants.length}</span>
          <span> consultant{filteredConsultants.length !== 1 ? 's' : ''} found</span>
          {activeCategory !== 'all' && <span style={{
          color: '#3B75FF',
          fontWeight: 600
        }}>
              {' '}· {CATEGORY_FILTERS.find(c => c.id === activeCategory)?.label}
            </span>}
        </p>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
          <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#21C474'
        }} />
          <span style={{
          fontSize: '12px',
          color: '#21C474',
          fontWeight: 600
        }}>3 available now</span>
        </div>
      </div>

      {/* Consultant list — compact cards */}
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
        {filteredConsultants.map(c => <div key={c.id} style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 20px',
        border: `1.5px solid ${c.featured ? '#B3C5FF' : '#F0F2FF'}`,
        boxShadow: c.featured ? '0px 6px 24px rgba(30,77,215,0.09)' : '0px 2px 10px rgba(30,77,215,0.04)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s'
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#B3C5FF';
        e.currentTarget.style.boxShadow = '0px 8px 28px rgba(30,77,215,0.12)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = c.featured ? '#B3C5FF' : '#F0F2FF';
        e.currentTarget.style.boxShadow = c.featured ? '0px 6px 24px rgba(30,77,215,0.09)' : '0px 2px 10px rgba(30,77,215,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
            <div style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center'
        }}>
              {/* Avatar */}
              <div style={{
            position: 'relative',
            flexShrink: 0
          }}>
                <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: c.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: '"DM Sans", sans-serif'
            }}>
                  {c.initials}
                </div>
                {c.available && <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: '#21C474',
              border: '2px solid #FFFFFF'
            }} />}
                {!c.available && <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: '#F59A0A',
              border: '2px solid #FFFFFF'
            }} />}
              </div>

              {/* Main info */}
              <div style={{
            flex: 1,
            minWidth: 0
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              marginBottom: '2px',
              flexWrap: 'wrap'
            }}>
                  <p style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B'
              }}>{c.name}</p>
                  {c.verified && <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 7px',
                background: '#E8F9EE',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#21C474'
              }}>
                      <IconCheckCircle size={9} color="#21C474" strokeWidth={2.5} />
                      <span>OISC Verified</span>
                    </span>}
                  <span style={{
                padding: '1px 7px',
                background: c.badgeBg,
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: 700,
                color: c.badgeColor
              }}>
                    {c.badge}
                  </span>
                  <span style={{
                marginLeft: 'auto',
                padding: '2px 9px',
                background: c.available ? '#E8F9EE' : '#FFF7E6',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: 700,
                color: c.available ? '#21C474' : '#F59A0A'
              }}>
                    {c.available ? '● Available' : '● Waitlist'}
                  </span>
                </div>
                <p style={{
              margin: '0 0 6px',
              fontSize: '12px',
              color: '#4D4D56'
            }}>
                  <span style={{
                fontWeight: 600
              }}>{c.title}</span>
                  <span style={{
                color: '#B0B4C4',
                margin: '0 5px'
              }}>·</span>
                  <span style={{
                color: '#82858A'
              }}>{c.org}</span>
                </p>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                    <StarRating rating={c.rating} size={12} />
                    <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#18181B'
                }}>{c.rating}</span>
                    <span style={{
                  fontSize: '11px',
                  color: '#82858A'
                }}>({c.reviews})</span>
                  </div>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#82858A'
              }}>
                    <IconClock size={11} color="#82858A" />
                    <span>{c.responseTime}</span>
                  </div>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#21C474',
                fontWeight: 600
              }}>
                    <IconAward size={11} color="#21C474" />
                    <span>{c.successRate} success</span>
                  </div>
                  <div style={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap'
              }}>
                    {c.tags.map(tag => <span key={tag} style={{
                  padding: '2px 7px',
                  background: '#F4F6FF',
                  border: '1px solid #E0E4F5',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#3B75FF'
                }}>{tag}</span>)}
                  </div>
                </div>
              </div>

              {/* Right: price + CTA */}
              <div style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            minWidth: '130px'
          }}>
                <div style={{
              textAlign: 'right'
            }}>
                  <p style={{
                margin: '0 0 1px',
                fontSize: '10px',
                color: '#82858A'
              }}>Starting from</p>
                  <p style={{
                margin: '0 0 1px',
                fontSize: '18px',
                fontWeight: 800,
                color: '#1E4DD7',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px'
              }}>{c.priceFrom}</p>
                  <p style={{
                margin: 0,
                fontSize: '10px',
                color: '#82858A'
              }}>{c.priceHr}</p>
                </div>
                <button style={{
              width: '100%',
              padding: '9px 14px',
              background: c.available ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F4F6FF',
              color: c.available ? '#FFFFFF' : '#82858A',
              border: 'none',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              boxShadow: c.available ? '0px 3px 12px rgba(30,77,215,0.22)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}>
                  <IconCalendar size={12} color={c.available ? '#FFFFFF' : '#82858A'} strokeWidth={1.75} />
                  <span>{c.available ? 'Book Session' : 'Join Waitlist'}</span>
                </button>
                <button style={{
              width: '100%',
              padding: '7px 14px',
              background: '#FFFFFF',
              color: '#4D4D56',
              border: '1.5px solid #E0E4F5',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}>
                  <IconMessageCircle size={12} color="#4D4D56" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>)}

        {filteredConsultants.length === 0 && <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #F0F2FF'
      }}>
            <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: '#F4F6FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
              <IconSearch size={20} color="#B0B4C4" />
            </div>
            <p style={{
          margin: '0 0 4px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#18181B'
        }}>No consultants found</p>
            <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#82858A'
        }}>Try adjusting your search or filters.</p>
          </div>}
      </div>

      {/* Bottom notice */}
      <div style={{
      marginTop: '16px',
      padding: '14px 18px',
      background: '#F9FAFF',
      borderRadius: '14px',
      border: '1px dashed #D4DCFF',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
        <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        background: '#EBF1FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
          <IconBell size={14} color="#3B75FF" strokeWidth={1.75} />
        </div>
        <div style={{
        flex: 1
      }}>
          <p style={{
          margin: '0 0 1px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#18181B'
        }}>More consultants joining soon</p>
          <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#82858A'
        }}>We're onboarding additional OISC-verified consultants specialising in healthcare, IT, and finance sectors.</p>
        </div>
      </div>
    </div>;
}