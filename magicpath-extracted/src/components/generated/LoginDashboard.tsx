import React, { useState, useEffect } from 'react';
import { IconHome, IconLearning, IconRoadmap, IconResources, IconConversations, IconDocuments, IconPeers, IconMarketplace, IconPlans, IconSignOut, IconTarget, IconBook, IconFlame, IconFileCheck, IconCheckCircle, IconUpload, IconMedal, IconClipboard, IconEye, IconEyeOff, IconCheck, IconAlertTriangle, IconXCircle, IconArrowRight, IconDownload, IconCalendar, IconChecklist, IconTemplate, IconGuide, IconFlag, IconBell, IconLock } from './Icons';
import { MarketplacePage } from './MarketplacePage';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type ActiveTab = 'login' | 'signup';
type DashboardView = 'home' | 'learning' | 'roadmap' | 'resources' | 'conversations' | 'documents' | 'peers' | 'marketplace' | 'plans' | 'profile';
interface StatCardData {
  id: string;
  label: string;
  value: string;
  subtext: string;
  color: string;
  bg: string;
  iconKey: 'target' | 'book' | 'flame' | 'filecheck';
}
interface LessonData {
  id: string;
  title: string;
  duration: string;
  done: boolean;
}
interface ModuleData {
  id: string;
  moduleNum: string;
  title: string;
  progress: number;
  tag: string;
  tagColor: string;
  tagBg: string;
  lessons: LessonData[];
}
interface ActivityItem {
  id: string;
  iconKey: 'clipboard' | 'upload' | 'target' | 'medal';
  title: string;
  time: string;
}
interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}
interface NavItem {
  id: DashboardView;
  label: string;
  iconKey: string;
  badge?: string;
}
interface ScoreCategory {
  id: string;
  label: string;
  score: number;
  max: number;
  color: string;
  bg: string;
  status: 'ok' | 'warn' | 'bad';
}
interface LessonContent {
  moduleTitle: string;
  lessonTitle: string;
  duration: string;
  sections: LessonSection[];
}
interface LessonSection {
  id: string;
  type: 'intro' | 'info' | 'tip' | 'checklist' | 'warning';
  heading?: string;
  body: string;
  items?: string[];
}

// ─── LOGO ────────────────────────────────────────────────────────────────────
function JapaLearnLogo({
  size = 38
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="JapaLearn AI logo" style={{
    flexShrink: 0
  }}>
      {/* Outer circle border */}
      <circle cx="50" cy="50" r="47" stroke="#2A52D4" strokeWidth="3.5" fill="white" />
      {/* Hexagon */}
      <path d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" fill="#2A52D4" />
      {/* 4-point star / diamond sparkle */}
      <path d="M50 22 C50 22 47 38 34 50 C47 62 50 78 50 78 C50 78 53 62 66 50 C53 38 50 22 50 22 Z" fill="white" />
      {/* Lower-left small lobe */}
      <path d="M50 58 C50 58 44 64 34 68 C40 72 50 78 50 78 C50 78 46 68 50 58 Z" fill="white" opacity="0.7" />
      {/* Two lines bottom-right */}
      <line x1="56" y1="70" x2="72" y2="66" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="58" y1="76" x2="70" y2="73" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>;
}
function BrandWordmark({
  size = 17
}: {
  size?: number;
}) {
  return <span style={{
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0px'
  }}>
      <span style={{
      fontSize: `${size}px`,
      fontWeight: 700,
      color: '#18181B',
      letterSpacing: '-0.4px',
      fontFamily: '"DM Sans", sans-serif'
    }}>JapaLearn</span>
      <span style={{
      fontSize: `${size * 0.82}px`,
      fontWeight: 800,
      color: '#1E4DD7',
      letterSpacing: '-0.2px',
      fontFamily: '"DM Sans", sans-serif',
      marginLeft: '4px'
    }}>AI</span>
    </span>;
}
function NavIcon({
  iconKey,
  size = 18,
  color
}: {
  iconKey: string;
  size?: number;
  color: string;
}) {
  const props = {
    size,
    color,
    strokeWidth: 1.75
  };
  if (iconKey === 'home') return <IconHome {...props} />;
  if (iconKey === 'learning') return <IconLearning {...props} />;
  if (iconKey === 'roadmap') return <IconRoadmap {...props} />;
  if (iconKey === 'resources') return <IconResources {...props} />;
  if (iconKey === 'conversations') return <IconConversations {...props} />;
  if (iconKey === 'documents') return <IconDocuments {...props} />;
  if (iconKey === 'peers') return <IconPeers {...props} />;
  if (iconKey === 'marketplace') return <IconMarketplace {...props} />;
  if (iconKey === 'plans') return <IconPlans {...props} />;
  if (iconKey === 'profile') return <IconProfileIcon {...props} />;
  return <IconHome {...props} />;
}
function IconProfileIcon({
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>;
}
function IconSearch({
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.75
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>;
}
function IconFilter({
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.75
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>;
}
function IconChevronDown({
  size = 16,
  color = 'currentColor',
  strokeWidth = 2
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>;
}
function IconChevronLeft({
  size = 16,
  color = 'currentColor',
  strokeWidth = 2
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>;
}
function IconPlay({
  size = 14,
  color = 'currentColor',
  strokeWidth = 2
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>;
}
function IconEdit({
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.75
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>;
}
function StatIcon({
  iconKey,
  color
}: {
  iconKey: StatCardData['iconKey'];
  color: string;
}) {
  const props = {
    size: 18,
    color,
    strokeWidth: 1.75
  };
  if (iconKey === 'target') return <IconTarget {...props} />;
  if (iconKey === 'book') return <IconBook {...props} />;
  if (iconKey === 'flame') return <IconFlame {...props} />;
  if (iconKey === 'filecheck') return <IconFileCheck {...props} />;
  return <IconTarget {...props} />;
}
function ActivityIcon({
  iconKey
}: {
  iconKey: ActivityItem['iconKey'];
}) {
  const props = {
    size: 15,
    color: '#3B75FF',
    strokeWidth: 1.75
  };
  if (iconKey === 'clipboard') return <IconClipboard {...props} />;
  if (iconKey === 'upload') return <IconUpload {...props} />;
  if (iconKey === 'target') return <IconTarget {...props} />;
  if (iconKey === 'medal') return <IconMedal {...props} />;
  return <IconClipboard {...props} />;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CURRICULUM_PROMISES: {
  iconKey: 'book' | 'target' | 'flame' | 'lock';
  title: string;
  desc: string;
}[] = [{
  iconKey: 'book',
  title: '4 tailored modules',
  desc: 'Covering visa, language, finances & docs'
}, {
  iconKey: 'target',
  title: 'Personalised roadmap',
  desc: 'Steps matched to your current readiness'
}, {
  iconKey: 'flame',
  title: 'Instant generation',
  desc: 'AI builds your path in under 5 seconds'
}, {
  iconKey: 'lock',
  title: 'Fully unlocked',
  desc: 'Access every lesson at your own pace'
}];
const STAT_CARDS: StatCardData[] = [{
  id: 'readiness',
  label: 'Readiness Score',
  value: '72%',
  subtext: 'Moderate',
  color: '#F59A0A',
  bg: '#FFF7E6',
  iconKey: 'target'
}, {
  id: 'courses',
  label: 'Modules Active',
  value: '3',
  subtext: 'In progress',
  color: '#3B75FF',
  bg: '#EBF1FF',
  iconKey: 'book'
}, {
  id: 'streak',
  label: 'Day Streak',
  value: '12',
  subtext: 'Keep going!',
  color: '#21C474',
  bg: '#E8F9EE',
  iconKey: 'flame'
}, {
  id: 'docs',
  label: 'Docs Ready',
  value: '5/8',
  subtext: 'In progress',
  color: '#EF4369',
  bg: '#FDECEC',
  iconKey: 'filecheck'
}];
const SCORE_CATEGORIES: ScoreCategory[] = [{
  id: 'financial',
  label: 'Financial Proof',
  score: 85,
  max: 100,
  color: '#21C474',
  bg: '#E8F9EE',
  status: 'ok'
}, {
  id: 'certs',
  label: 'Certifications',
  score: 90,
  max: 100,
  color: '#21C474',
  bg: '#E8F9EE',
  status: 'ok'
}, {
  id: 'workexp',
  label: 'Work Experience',
  score: 60,
  max: 100,
  color: '#F59A0A',
  bg: '#FFF7E6',
  status: 'warn'
}, {
  id: 'language',
  label: 'English Language',
  score: 30,
  max: 100,
  color: '#EF4369',
  bg: '#FDECEC',
  status: 'bad'
}, {
  id: 'sponsorship',
  label: 'Sponsorship',
  score: 45,
  max: 100,
  color: '#F59A0A',
  bg: '#FFF7E6',
  status: 'warn'
}, {
  id: 'documents',
  label: 'Documents',
  score: 62,
  max: 100,
  color: '#F59A0A',
  bg: '#FFF7E6',
  status: 'warn'
}];
const MODULES: ModuleData[] = [{
  id: 'm1',
  moduleNum: '01',
  title: 'UK Skilled Worker Visa — Overview',
  progress: 40,
  tag: 'In Progress',
  tagColor: '#3B75FF',
  tagBg: '#EBF1FF',
  lessons: [{
    id: 'l1-1',
    title: 'What is the Skilled Worker Visa?',
    duration: '6 min',
    done: true
  }, {
    id: 'l1-2',
    title: 'Eligibility & Point Requirements',
    duration: '8 min',
    done: true
  }, {
    id: 'l1-3',
    title: 'Salary Thresholds Explained',
    duration: '5 min',
    done: false
  }, {
    id: 'l1-4',
    title: 'Common Rejection Reasons',
    duration: '7 min',
    done: false
  }]
}, {
  id: 'm2',
  moduleNum: '02',
  title: 'IELTS Test Strategy',
  progress: 75,
  tag: 'Almost Done',
  tagColor: '#21C474',
  tagBg: '#E8F9EE',
  lessons: [{
    id: 'l2-1',
    title: 'Understanding IELTS Bands',
    duration: '5 min',
    done: true
  }, {
    id: 'l2-2',
    title: 'Speaking & Writing Tactics',
    duration: '9 min',
    done: true
  }, {
    id: 'l2-3',
    title: 'Reading & Listening Tips',
    duration: '8 min',
    done: true
  }]
}, {
  id: 'm3',
  moduleNum: '03',
  title: 'Financial Planning & Proof',
  progress: 0,
  tag: 'Not Started',
  tagColor: '#82858A',
  tagBg: '#F4F4F5',
  lessons: [{
    id: 'l3-1',
    title: 'What Financial Proof Do You Need?',
    duration: '6 min',
    done: false
  }, {
    id: 'l3-2',
    title: 'Bank Statement Requirements',
    duration: '4 min',
    done: false
  }]
}, {
  id: 'm4',
  moduleNum: '04',
  title: 'Document Preparation Guide',
  progress: 20,
  tag: 'In Progress',
  tagColor: '#3B75FF',
  tagBg: '#EBF1FF',
  lessons: [{
    id: 'l4-1',
    title: 'Core Documents Checklist',
    duration: '7 min',
    done: true
  }, {
    id: 'l4-2',
    title: 'Authenticating Your Documents',
    duration: '5 min',
    done: false
  }, {
    id: 'l4-3',
    title: 'CV for UK Employers',
    duration: '8 min',
    done: false
  }, {
    id: 'l4-4',
    title: 'Statement of Purpose Writing',
    duration: '10 min',
    done: false
  }, {
    id: 'l4-5',
    title: 'Submitting Online vs. In-Person',
    duration: '4 min',
    done: false
  }]
}];
const ACTIVITIES: ActivityItem[] = [{
  id: 'a1',
  iconKey: 'clipboard',
  title: 'Completed Module 01 – Intro',
  time: '2h ago'
}, {
  id: 'a2',
  iconKey: 'upload',
  title: 'Uploaded Passport Copy',
  time: '5h ago'
}, {
  id: 'a3',
  iconKey: 'target',
  title: 'Readiness Score Updated to 72%',
  time: 'Yesterday'
}, {
  id: 'a4',
  iconKey: 'medal',
  title: 'Completed IELTS Prep Quiz',
  time: '2 days ago'
}];
const READINESS_TAGS: {
  label: string;
  status: 'ok' | 'warn' | 'bad';
}[] = [{
  label: 'Financial',
  status: 'ok'
}, {
  label: 'Certifications',
  status: 'ok'
}, {
  label: 'Work Exp.',
  status: 'warn'
}, {
  label: 'Language',
  status: 'bad'
}];
const NAV_GROUPS: NavGroup[] = [{
  groupLabel: 'Main',
  items: [{
    id: 'home',
    label: 'Home',
    iconKey: 'home'
  }, {
    id: 'learning',
    label: 'Curriculum',
    iconKey: 'learning'
  }, {
    id: 'roadmap',
    label: 'My Roadmap',
    iconKey: 'roadmap'
  }, {
    id: 'resources',
    label: 'Resources',
    iconKey: 'resources'
  }]
}, {
  groupLabel: 'Features',
  items: [{
    id: 'conversations',
    label: 'Conversations',
    iconKey: 'conversations',
    badge: 'MVP 2'
  }, {
    id: 'documents',
    label: 'Document Upload',
    iconKey: 'documents',
    badge: 'MVP 2'
  }, {
    id: 'peers',
    label: 'Peers',
    iconKey: 'peers',
    badge: 'MVP 2'
  }, {
    id: 'marketplace',
    label: 'Marketplace',
    iconKey: 'marketplace',
    badge: 'MVP 2'
  }]
}, {
  groupLabel: 'Account',
  items: [{
    id: 'plans',
    label: 'Subscription Plans',
    iconKey: 'plans'
  }, {
    id: 'profile',
    label: 'My Profile',
    iconKey: 'profile'
  }]
}];
const ROADMAP_MILESTONES: {
  id: string;
  week: string;
  title: string;
  desc: string;
  actions: string[];
  done: boolean;
  current: boolean;
  phase: string;
}[] = [{
  id: 'mi1',
  week: 'Week 1–2',
  phase: 'Foundation',
  title: 'Complete eligibility assessment',
  desc: 'Understand exactly where you stand against UK Skilled Worker criteria.',
  actions: ['Take the JapaLearn readiness quiz', 'Review points-based system requirements', 'Identify gaps in your profile'],
  done: true,
  current: false
}, {
  id: 'mi2',
  week: 'Week 3–4',
  phase: 'Foundation',
  title: 'Gather core documents',
  desc: 'Collect and organise the primary documents needed for your application.',
  actions: ['Obtain international passport', 'Request degree certificate & transcripts', 'Gather employment reference letters'],
  done: true,
  current: false
}, {
  id: 'mi3',
  week: 'Week 5–6',
  phase: 'Language',
  title: 'Book IELTS & start prep',
  desc: 'English language is your most time-sensitive requirement — start now.',
  actions: ['Register on British Council / IDP', 'Begin 6-week IELTS study plan', 'Target Band 7.0+ in all sections'],
  done: false,
  current: true
}, {
  id: 'mi4',
  week: 'Week 7–10',
  phase: 'Employment',
  title: 'Obtain job offer & sponsorship',
  desc: 'Secure a Certificate of Sponsorship from a licensed UK employer.',
  actions: ['Search GOV.UK sponsor register', 'Apply to 10+ relevant UK employers', 'Prepare UK-format CV & SOP'],
  done: false,
  current: false
}, {
  id: 'mi5',
  week: 'Week 11–14',
  phase: 'Application',
  title: 'Submit visa application',
  desc: 'Compile every document and submit your online application to UKVI.',
  actions: ['Pay Immigration Health Surcharge', 'Complete online visa application form', 'Book biometric appointment'],
  done: false,
  current: false
}, {
  id: 'mi6',
  week: 'Week 15–18',
  phase: 'Relocation',
  title: 'Await decision & prepare relocation',
  desc: 'Use this window to plan your arrival, accommodation, and first weeks in the UK.',
  actions: ['Research housing in target city', 'Open UK bank account (Wise / Monzo)', 'Arrange medical registration (NHS)'],
  done: false,
  current: false
}];
const RESOURCES: {
  id: string;
  title: string;
  desc: string;
  type: string;
  category: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  pages: string;
}[] = [{
  id: 'r1',
  title: 'UK Skilled Worker Visa — Full Checklist',
  desc: 'Every document, requirement and step you need to prepare before submitting your visa application.',
  type: 'Checklist',
  category: 'Visa',
  tag: 'Essential',
  tagColor: '#1E4DD7',
  tagBg: '#EBF1FF',
  pages: '4 pages'
}, {
  id: 'r2',
  title: 'SOP Sample — Healthcare Professional',
  desc: 'A proven Statement of Purpose template written specifically for Nigerian healthcare workers applying for UK roles.',
  type: 'Template',
  category: 'Documents',
  tag: 'Popular',
  tagColor: '#21C474',
  tagBg: '#E8F9EE',
  pages: '3 pages'
}, {
  id: 'r3',
  title: 'CV Guide for UK Job Market',
  desc: 'How to reformat your Nigerian CV to meet UK employer expectations, with annotated examples.',
  type: 'Guide',
  category: 'Career',
  tag: 'New',
  tagColor: '#F59A0A',
  tagBg: '#FFF7E6',
  pages: '6 pages'
}, {
  id: 'r4',
  title: 'Financial Evidence — Bank Statement Template',
  desc: 'Understand exactly how much to show, for how long, and how to present your ₦ savings as £ evidence.',
  type: 'Template',
  category: 'Finance',
  tag: 'Essential',
  tagColor: '#1E4DD7',
  tagBg: '#EBF1FF',
  pages: '2 pages'
}, {
  id: 'r5',
  title: 'IELTS Preparation Roadmap',
  desc: 'A 6-week study plan with daily exercises, mock test links, and band score targets for Skilled Worker eligibility.',
  type: 'Guide',
  category: 'Language',
  tag: 'Popular',
  tagColor: '#21C474',
  tagBg: '#E8F9EE',
  pages: '8 pages'
}, {
  id: 'r6',
  title: 'Sponsor Licence Register — How to Search',
  desc: 'Step-by-step guide to using the GOV.UK sponsor register to find and target employers that can hire you.',
  type: 'Guide',
  category: 'Visa',
  tag: 'Essential',
  tagColor: '#1E4DD7',
  tagBg: '#EBF1FF',
  pages: '3 pages'
}];
const PLAN_TIERS: {
  id: string;
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  features: string[];
}[] = [{
  id: 'free',
  name: 'Free',
  price: '₦0',
  period: 'forever',
  highlight: false,
  features: ['Migration readiness score', 'Full report & checklist', 'Learning path (all modules)', 'Personalised roadmap', 'Resources & templates']
}, {
  id: 'pro',
  name: 'Pro',
  price: '₦4,999',
  period: 'per month',
  highlight: true,
  features: ['Everything in Free', 'AI Conversations (Q&A)', 'Document upload & parsing', 'Peer matching network', 'Priority support']
}, {
  id: 'elite',
  name: 'Elite',
  price: '₦12,999',
  period: 'per month',
  highlight: false,
  features: ['Everything in Pro', 'Marketplace consultant access', '1-on-1 advisor session', 'Visa application review', 'Dedicated success manager']
}];
const CHAT_MESSAGES_INITIAL: {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}[] = [{
  id: 'msg1',
  role: 'ai',
  text: "Hi Adaeze! I'm your JapaLearn AI assistant. Ask me anything about your UK migration journey — visa requirements, IELTS prep, costs, documents and more.",
  time: '9:01 AM'
}, {
  id: 'msg2',
  role: 'user',
  text: 'What documents do I need for a UK Skilled Worker visa?',
  time: '9:03 AM'
}, {
  id: 'msg3',
  role: 'ai',
  text: "For a UK Skilled Worker visa you'll typically need: a valid passport, Certificate of Sponsorship (CoS) from your employer, proof of English language (IELTS 7.0+), financial evidence (£1,270 in savings for 28 days), and your relevant qualifications.",
  time: '9:03 AM'
}, {
  id: 'msg4',
  role: 'user',
  text: 'How much money do I need to show in my bank account for the visa?',
  time: '9:05 AM'
}, {
  id: 'msg5',
  role: 'ai',
  text: "You need to show at least £1,270 in your bank account, held for a continuous 28-day period ending no more than 31 days before your application date. This is the maintenance requirement for a Skilled Worker visa. If your employer certifies your maintenance on the CoS, you won't need to provide this evidence separately — confirm this with your sponsor.",
  time: '9:05 AM'
}, {
  id: 'msg6',
  role: 'user',
  text: 'What IELTS band score do I need and which test should I take?',
  time: '9:08 AM'
}, {
  id: 'msg7',
  role: 'ai',
  text: "For the UK Skilled Worker visa you need a minimum of CEFR Level B1 in reading, writing, speaking, and listening. In IELTS terms, that's roughly Band 4.0+ in each component, but most sponsors and regulated professions (especially NHS / healthcare) require Band 7.0 or above overall. For visa purposes, both IELTS Academic and IELTS General Training are accepted — however if your profession is regulated (e.g. nursing, medicine, pharmacy), the relevant regulatory body may specify Academic. Always confirm with your employer and check the GOV.UK approved tests list.",
  time: '9:08 AM'
}];
const PEER_PROFILES: {
  id: string;
  name: string;
  initials: string;
  country: string;
  pathway: string;
  score: number;
  bg: string;
  mutual: number;
}[] = [{
  id: 'p1',
  name: 'Chukwuemeka Obi',
  initials: 'CO',
  country: 'Lagos → Manchester',
  pathway: 'UK Skilled Worker',
  score: 68,
  bg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  mutual: 3
}, {
  id: 'p2',
  name: 'Fatima Al-Hassan',
  initials: 'FA',
  country: 'Abuja → Birmingham',
  pathway: 'UK Skilled Worker',
  score: 74,
  bg: 'linear-gradient(135deg, #EC4899, #F43F5E)',
  mutual: 5
}, {
  id: 'p3',
  name: 'Tolu Adeyemi',
  initials: 'TA',
  country: 'Lagos → London',
  pathway: 'UK Skilled Worker',
  score: 81,
  bg: 'linear-gradient(135deg, #14B8A6, #0EA5E9)',
  mutual: 2
}, {
  id: 'p4',
  name: 'Blessing Nwachukwu',
  initials: 'BN',
  country: 'Port Harcourt → Leeds',
  pathway: 'UK Skilled Worker',
  score: 65,
  bg: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  mutual: 1
}];
const PEER_DISCUSSION_THREADS: {
  id: string;
  authorInitials: string;
  authorName: string;
  authorBg: string;
  title: string;
  excerpt: string;
  replies: number;
  likes: number;
  tag: string;
  tagColor: string;
  tagBg: string;
  timeAgo: string;
}[] = [{
  id: 'th1',
  authorInitials: 'TA',
  authorName: 'Tolu Adeyemi',
  authorBg: 'linear-gradient(135deg, #14B8A6, #0EA5E9)',
  title: "Just got my COS! Here's what actually helped me",
  excerpt: 'After 6 months of searching, I finally secured a Certificate of Sponsorship from an NHS Trust. The biggest unlock was using the official sponsor register and targeting community hospitals outside London...',
  replies: 14,
  likes: 31,
  tag: 'Success Story',
  tagColor: '#21C474',
  tagBg: '#E8F9EE',
  timeAgo: '2h ago'
}, {
  id: 'th2',
  authorInitials: 'CO',
  authorName: 'Chukwuemeka Obi',
  authorBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  title: 'IELTS Academic vs General — which for Skilled Worker?',
  excerpt: 'I keep seeing conflicting info online. My employer says General Training is fine but the UKVI guidance I read mentioned Academic. Has anyone been through this recently?',
  replies: 9,
  likes: 17,
  tag: 'Question',
  tagColor: '#3B75FF',
  tagBg: '#EBF1FF',
  timeAgo: '5h ago'
}, {
  id: 'th3',
  authorInitials: 'FA',
  authorName: 'Fatima Al-Hassan',
  authorBg: 'linear-gradient(135deg, #EC4899, #F43F5E)',
  title: "Bank statement — which bank accepted for ₦ to £ proof?",
  excerpt: "My GTBank statement was rejected because the officer said it wasn't an \"internationally recognised institution.\" Has anyone used Zenith or UBA and had it accepted?",
  replies: 22,
  likes: 28,
  tag: 'Documents',
  tagColor: '#F59A0A',
  tagBg: '#FFF7E6',
  timeAgo: 'Yesterday'
}];
const DOCUMENT_CATEGORIES: {
  id: string;
  label: string;
  count: number;
  done: number;
  color: string;
  bg: string;
}[] = [{
  id: 'identity',
  label: 'Identity',
  count: 2,
  done: 2,
  color: '#21C474',
  bg: '#E8F9EE'
}, {
  id: 'qualification',
  label: 'Qualifications',
  count: 1,
  done: 1,
  color: '#21C474',
  bg: '#E8F9EE'
}, {
  id: 'language',
  label: 'Language',
  count: 1,
  done: 0,
  color: '#EF4369',
  bg: '#FDECEC'
}, {
  id: 'financial',
  label: 'Financial',
  count: 1,
  done: 0,
  color: '#F59A0A',
  bg: '#FFF7E6'
}, {
  id: 'employment',
  label: 'Employment',
  count: 2,
  done: 1,
  color: '#F59A0A',
  bg: '#FFF7E6'
}, {
  id: 'medical',
  label: 'Medical',
  count: 1,
  done: 0,
  color: '#EF4369',
  bg: '#FDECEC'
}];
const MARKETPLACE_CONSULTANTS: {
  id: string;
  name: string;
  initials: string;
  title: string;
  rating: number;
  reviews: number;
  price: string;
  tags: string[];
  verified: boolean;
  bg: string;
}[] = [{
  id: 'mc1',
  name: 'Solicitor James Okafor',
  initials: 'JO',
  title: 'OISC Level 3 · Immigration Barrister',
  rating: 4.9,
  reviews: 142,
  price: '₦85,000/hr',
  tags: ['Skilled Worker', 'Family Visa', 'Appeals'],
  verified: true,
  bg: 'linear-gradient(135deg, #1E4DD7, #3B75FF)'
}, {
  id: 'mc2',
  name: 'Amaka Consulting Ltd',
  initials: 'AC',
  title: 'OISC Registered · 12 yrs experience',
  rating: 4.7,
  reviews: 98,
  price: '₦55,000/hr',
  tags: ['Student Visa', 'Skilled Worker', 'NHS'],
  verified: true,
  bg: 'linear-gradient(135deg, #059669, #10B981)'
}, {
  id: 'mc3',
  name: 'UK Path Advisors',
  initials: 'UP',
  title: 'FCA Authorised · ILPA Member',
  rating: 4.8,
  reviews: 203,
  price: '₦70,000/hr',
  tags: ['Entrepreneur Visa', 'Spouse Visa', 'EU Settlement'],
  verified: true,
  bg: 'linear-gradient(135deg, #7C3AED, #A855F7)'
}];
const DOCUMENTS_LIST: {
  id: string;
  name: string;
  status: 'uploaded' | 'missing' | 'processing';
  category: string;
  required: boolean;
}[] = [{
  id: 'd1',
  name: 'International Passport',
  status: 'uploaded',
  category: 'Identity',
  required: true
}, {
  id: 'd2',
  name: 'Birth Certificate',
  status: 'uploaded',
  category: 'Identity',
  required: true
}, {
  id: 'd3',
  name: 'University Degree Certificate',
  status: 'uploaded',
  category: 'Qualification',
  required: true
}, {
  id: 'd4',
  name: 'IELTS Certificate',
  status: 'missing',
  category: 'Language',
  required: true
}, {
  id: 'd5',
  name: 'Bank Statement (28 days)',
  status: 'processing',
  category: 'Financial',
  required: true
}, {
  id: 'd6',
  name: 'Certificate of Sponsorship',
  status: 'missing',
  category: 'Employment',
  required: true
}, {
  id: 'd7',
  name: 'Employment Reference Letter',
  status: 'uploaded',
  category: 'Employment',
  required: false
}, {
  id: 'd8',
  name: 'Tuberculosis Test Result',
  status: 'missing',
  category: 'Medical',
  required: true
}];
const LESSON_CONTENT: LessonContent = {
  moduleTitle: 'Module 01 — UK Skilled Worker Visa',
  lessonTitle: 'What is the Skilled Worker Visa?',
  duration: '6 min read',
  sections: [{
    id: 's1',
    type: 'intro',
    body: "The UK Skilled Worker Visa replaced the Tier 2 (General) visa in December 2020. It allows eligible workers from outside the UK — including Nigeria — to live and work in the UK for up to 5 years, provided they have a job offer from a licensed sponsor."
  }, {
    id: 's2',
    type: 'info',
    heading: 'Who Can Apply?',
    body: "You can apply if you meet all three of the following core requirements:",
    items: ['Have a job offer from a Home Office-approved sponsor', 'The job is at RQF Level 3 or above (A-level equivalent)', 'Meet the minimum salary threshold (typically £26,200/year or the going rate for the role)']
  }, {
    id: 's3',
    type: 'tip',
    heading: 'The Points-Based System',
    body: "The UK uses a points-based immigration system. You need 70 points to qualify. Mandatory requirements (job offer + salary + English) give you 50 points. Tradeable points come from shortage occupation status, PhD qualifications, or new entrant salary rates."
  }, {
    id: 's4',
    type: 'checklist',
    heading: 'Key Things to Prepare Now',
    body: '',
    items: ['Identify potential UK employers with sponsor licences (check the GOV.UK sponsor register)', 'Begin IELTS preparation — you need B1 level or higher', 'Gather your academic and professional certificates for evaluation', 'Check whether your occupation is on the Shortage Occupation List (SOL)']
  }, {
    id: 's5',
    type: 'warning',
    heading: 'Common Mistake',
    body: "Many applicants apply before receiving their Certificate of Sponsorship (CoS). Your CoS must be assigned by your employer before you submit your visa application. Do not pay for a visa application without it."
  }]
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function LoginDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES_INITIAL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [curriculumRequested, setCurriculumRequested] = useState<boolean>(false);
  const [curriculumLoading, setCurriculumLoading] = useState<boolean>(false);
  const [expandedModule, setExpandedModule] = useState<string | null>('m1');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [docFilter, setDocFilter] = useState<'All' | 'Missing' | 'Uploaded'>('All');
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>('mi3');
  const [resourceFilter, setResourceFilter] = useState<string>('All');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [darkRequested, setDarkRequested] = useState<boolean>(false);
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
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setActiveView('home');
    setEmail('');
    setPassword('');
    setName('');
  };
  const handleGenerateCurriculum = () => {
    setCurriculumLoading(true);
    setTimeout(() => {
      setCurriculumLoading(false);
      setCurriculumRequested(true);
    }, 2800);
  };
  const handleToggleModule = (modId: string) => {
    setExpandedModule(prev => prev === modId ? null : modId);
  };
  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };
  const handleCloseLesson = () => {
    setActiveLessonId(null);
  };
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const aiMsg = {
      id: `msg-ai-${Date.now()}`,
      role: 'ai' as const,
      text: "That's a great question! For UK migration, this depends on your specific circumstances. I recommend checking the official GOV.UK guidance and ensuring you have all documentation ready before proceeding. Feel free to ask me more specific questions!",
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages(prev => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };
  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendChat();
  };
  const filteredDocuments = DOCUMENTS_LIST.filter(doc => {
    if (docFilter === 'All') return true;
    if (docFilter === 'Missing') return doc.status === 'missing';
    if (docFilter === 'Uploaded') return doc.status === 'uploaded';
    return true;
  });
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── AUTH ─────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F4FF 0%, #FFFFFF 50%, #EBF1FF 100%)',
      fontFamily: '"Inter", sans-serif',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
        <div aria-hidden="true" style={{
        position: 'fixed',
        width: '500px',
        height: '400px',
        background: 'linear-gradient(180deg, rgba(30,77,215,0.12) 0%, rgba(79,209,255,0.12) 100%)',
        filter: 'blur(120px)',
        top: '-100px',
        right: '-100px',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
        <div aria-hidden="true" style={{
        position: 'fixed',
        width: '400px',
        height: '300px',
        background: 'linear-gradient(180deg, rgba(59,117,255,0.1) 0%, rgba(30,77,215,0.1) 100%)',
        filter: 'blur(100px)',
        bottom: '-50px',
        left: '-80px',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
        <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '28px',
        boxShadow: '0px 32px 80px rgba(30,77,215,0.12), 0px 0px 0px 1px rgba(30,77,215,0.06)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
          <div style={{
          padding: '36px 36px 0',
          textAlign: 'center'
        }}>
            <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '28px'
          }}>
              <JapaLearnLogo size={44} />
              <BrandWordmark size={21} />
            </div>
            <div style={{
            display: 'flex',
            background: '#F4F6FF',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '32px'
          }} role="tablist" aria-label="Authentication options">
              {(['login', 'signup'] as ActiveTab[]).map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#1E4DD7' : '#82858A',
              background: activeTab === tab ? '#FFFFFF' : 'transparent',
              boxShadow: activeTab === tab ? '0px 2px 8px rgba(30,77,215,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: '"Inter", sans-serif'
            }}>
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>)}
            </div>
          </div>
          <div style={{
          padding: '0 36px 36px'
        }}>
            {activeTab === 'login' ? <form onSubmit={handleLogin} aria-label="Sign in form">
                <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#18181B',
              margin: '0 0 6px',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif'
            }}>Welcome back</h1>
                <p style={{
              fontSize: '14px',
              color: '#82858A',
              margin: '0 0 28px',
              lineHeight: '1.5'
            }}>Sign in to continue your migration journey</p>
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
                  <div>
                    <label htmlFor="login-email" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4D4D56',
                  marginBottom: '6px'
                }}>Email address</label>
                    <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1.5px solid #E4E8FF',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#18181B',
                  background: '#FAFBFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: '"Inter", sans-serif'
                }} onFocus={e => e.target.style.borderColor = '#3B75FF'} onBlur={e => e.target.style.borderColor = '#E4E8FF'} />
                  </div>
                  <div>
                    <label htmlFor="login-password" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4D4D56',
                  marginBottom: '6px'
                }}>Password</label>
                    <div style={{
                  position: 'relative'
                }}>
                      <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={{
                    width: '100%',
                    padding: '13px 48px 13px 16px',
                    border: '1.5px solid #E4E8FF',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#18181B',
                    background: '#FAFBFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: '"Inter", sans-serif'
                  }} onFocus={e => e.target.style.borderColor = '#3B75FF'} onBlur={e => e.target.style.borderColor = '#E4E8FF'} />
                      <button type="button" onClick={() => setShowPassword(p => !p)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                        {showPassword ? <IconEyeOff size={17} color="#82858A" /> : <IconEye size={17} color="#82858A" />}
                      </button>
                    </div>
                  </div>
                  <div style={{
                textAlign: 'right',
                marginTop: '-4px'
              }}>
                    <button type="button" style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  color: '#3B75FF',
                  cursor: 'pointer',
                  fontWeight: 500,
                  padding: 0,
                  fontFamily: '"Inter", sans-serif'
                }}>Forgot password?</button>
                  </div>
                </div>
                <button type="submit" style={{
              width: '100%',
              marginTop: '24px',
              padding: '15px',
              background: 'linear-gradient(135deg, #1E4DD7 0%, #3B75FF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0px 8px 24px rgba(30,77,215,0.35)',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.2px'
            }}>
                  Sign In to JapaLearn AI
                </button>
                <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '13px',
              color: '#82858A'
            }}>
                  <span>Don't have an account? </span>
                  <button type="button" onClick={() => setActiveTab('signup')} style={{
                background: 'none',
                border: 'none',
                color: '#3B75FF',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                padding: 0,
                fontFamily: '"Inter", sans-serif'
              }}>Create account</button>
                </p>
              </form> : <form onSubmit={handleSignup} aria-label="Create account form">
                <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#18181B',
              margin: '0 0 6px',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif'
            }}>Start your journey</h1>
                <p style={{
              fontSize: '14px',
              color: '#82858A',
              margin: '0 0 28px',
              lineHeight: '1.5'
            }}>Create your free account and unlock your migration report</p>
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
                  <div>
                    <label htmlFor="signup-name" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4D4D56',
                  marginBottom: '6px'
                }}>Full name</label>
                    <input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Adaeze Okafor" required style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1.5px solid #E4E8FF',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#18181B',
                  background: '#FAFBFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: '"Inter", sans-serif'
                }} onFocus={e => e.target.style.borderColor = '#3B75FF'} onBlur={e => e.target.style.borderColor = '#E4E8FF'} />
                  </div>
                  <div>
                    <label htmlFor="signup-email" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4D4D56',
                  marginBottom: '6px'
                }}>Email address</label>
                    <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1.5px solid #E4E8FF',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#18181B',
                  background: '#FAFBFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: '"Inter", sans-serif'
                }} onFocus={e => e.target.style.borderColor = '#3B75FF'} onBlur={e => e.target.style.borderColor = '#E4E8FF'} />
                  </div>
                  <div>
                    <label htmlFor="signup-password" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4D4D56',
                  marginBottom: '6px'
                }}>Create password</label>
                    <div style={{
                  position: 'relative'
                }}>
                      <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required style={{
                    width: '100%',
                    padding: '13px 48px 13px 16px',
                    border: '1.5px solid #E4E8FF',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#18181B',
                    background: '#FAFBFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: '"Inter", sans-serif'
                  }} onFocus={e => e.target.style.borderColor = '#3B75FF'} onBlur={e => e.target.style.borderColor = '#E4E8FF'} />
                      <button type="button" onClick={() => setShowPassword(p => !p)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                        {showPassword ? <IconEyeOff size={17} color="#82858A" /> : <IconEye size={17} color="#82858A" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button type="submit" style={{
              width: '100%',
              marginTop: '24px',
              padding: '15px',
              background: 'linear-gradient(135deg, #1E4DD7 0%, #3B75FF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0px 8px 24px rgba(30,77,215,0.35)',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.2px'
            }}>
                  Create Account &amp; View Report
                </button>
                <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              color: '#A0A3AB',
              lineHeight: '1.6'
            }}>
                  <span>By creating an account, you agree to our </span>
                  <button type="button" style={{
                background: 'none',
                border: 'none',
                color: '#3B75FF',
                cursor: 'pointer',
                fontSize: '12px',
                padding: 0,
                fontFamily: '"Inter", sans-serif'
              }}>Terms of Service</button>
                  <span> and </span>
                  <button type="button" style={{
                background: 'none',
                border: 'none',
                color: '#3B75FF',
                cursor: 'pointer',
                fontSize: '12px',
                padding: 0,
                fontFamily: '"Inter", sans-serif'
              }}>Privacy Policy</button>
                </p>
              </form>}
          </div>
        </div>
      </div>;
  }

  // ─── LESSON READER ───────────────────────────────────────────────────────
  if (activeLessonId !== null) {
    return <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#F7F9FF',
      fontFamily: '"Inter", sans-serif'
    }}>
        <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #ECEEFF',
        padding: isMobile ? '0 16px' : '0 28px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
          <button onClick={handleCloseLesson} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6B7280',
          fontSize: '14px',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: '10px',
          fontFamily: '"Inter", sans-serif'
        }} onMouseEnter={e => {
          e.currentTarget.style.background = '#F4F6FF';
          e.currentTarget.style.color = '#1E4DD7';
        }} onMouseLeave={e => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = '#6B7280';
        }}>
            <IconChevronLeft size={16} color="currentColor" />
            <span>Back</span>
          </button>
          {!isMobile && <div style={{
          width: '1px',
          height: '20px',
          background: '#E4E8FF'
        }} />}
          {!isMobile && <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
            <span style={{
            fontSize: '13px',
            color: '#82858A'
          }}>{LESSON_CONTENT.moduleTitle}</span>
            <span style={{
            color: '#D0D4E0'
          }}>›</span>
            <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#18181B'
          }}>{LESSON_CONTENT.lessonTitle}</span>
          </div>}
          <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            {!isMobile && <span style={{
            fontSize: '12px',
            color: '#82858A',
            background: '#F4F6FF',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>{LESSON_CONTENT.duration}</span>}
            <button onClick={handleCloseLesson} style={{
            padding: isMobile ? '8px 14px' : '8px 18px',
            background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
              <IconCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
              <span>Mark Complete</span>
            </button>
          </div>
        </header>

        <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '24px 16px 80px' : '48px 28px 80px',
        boxSizing: 'border-box'
      }}>
          <div style={{
          marginBottom: '40px'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
              <span style={{
              padding: '4px 12px',
              background: '#EBF1FF',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#1E4DD7'
            }}>MODULE 01</span>
              <span style={{
              padding: '4px 12px',
              background: '#E8F9EE',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#21C474',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                <IconPlay size={10} color="#21C474" />
                <span>Lesson 1 of 4</span>
              </span>
            </div>
            <h1 style={{
            margin: '0 0 12px',
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 800,
            color: '#18181B',
            letterSpacing: '-0.8px',
            fontFamily: '"DM Sans", sans-serif',
            lineHeight: 1.2
          }}>{LESSON_CONTENT.lessonTitle}</h1>
            <div style={{
            height: '5px',
            background: '#F0F2FF',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
              <div style={{
              width: '25%',
              height: '100%',
              background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
              borderRadius: '3px'
            }} />
            </div>
            <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#B0B4C4'
          }}>Lesson 1 of 4 · 25% complete in this module</p>
          </div>

          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
            {LESSON_CONTENT.sections.map(section => {
            if (section.type === 'intro') {
              return <div key={section.id}>
                    <p style={{
                  margin: 0,
                  fontSize: '17px',
                  color: '#2D2D35',
                  lineHeight: '1.75',
                  fontWeight: 400
                }}>{section.body}</p>
                  </div>;
            }
            if (section.type === 'info') {
              return <div key={section.id} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #ECEEFF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.04)'
              }}>
                    <h2 style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>{section.heading}</h2>
                    <p style={{
                  margin: '0 0 16px',
                  fontSize: '15px',
                  color: '#4D4D56',
                  lineHeight: '1.65'
                }}>{section.body}</p>
                    {section.items && <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                        {section.items.map((item, idx) => <li key={idx} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start'
                  }}>
                            <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#EBF1FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                              <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1E4DD7'
                      }}>{idx + 1}</span>
                            </span>
                            <span style={{
                      fontSize: '15px',
                      color: '#2D2D35',
                      lineHeight: '1.6'
                    }}>{item}</span>
                          </li>)}
                      </ul>}
                  </div>;
            }
            if (section.type === 'tip') {
              return <div key={section.id} style={{
                background: 'linear-gradient(135deg, #EBF1FF 0%, #E4EEFF 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #CDDAFF'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                      <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                        <IconTarget size={14} color="#FFFFFF" strokeWidth={2} />
                      </div>
                      <h3 style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1E4DD7',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{section.heading}</h3>
                    </div>
                    <p style={{
                  margin: 0,
                  fontSize: '15px',
                  color: '#2D3A6B',
                  lineHeight: '1.65'
                }}>{section.body}</p>
                  </div>;
            }
            if (section.type === 'checklist') {
              return <div key={section.id} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #ECEEFF'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                      <IconChecklist size={18} color="#21C474" strokeWidth={2} />
                      <h3 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#18181B',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{section.heading}</h3>
                    </div>
                    {section.items && <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                        {section.items.map((item, idx) => <li key={idx} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    padding: '10px 14px',
                    background: '#F8FFF9',
                    borderRadius: '10px',
                    border: '1px solid #D8F5E6'
                  }}>
                            <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#E8F9EE',
                      border: '2px solid #A7F3C5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                              <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#21C474'
                      }} />
                            </div>
                            <span style={{
                      fontSize: '14px',
                      color: '#2D2D35',
                      lineHeight: '1.6'
                    }}>{item}</span>
                          </li>)}
                      </ul>}
                  </div>;
            }
            if (section.type === 'warning') {
              return <div key={section.id} style={{
                background: 'linear-gradient(135deg, #FFF7E6, #FFF3CD)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #FDE68A'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                      <IconAlertTriangle size={18} color="#D97706" strokeWidth={2} />
                      <h3 style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#D97706',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{section.heading}</h3>
                    </div>
                    <p style={{
                  margin: 0,
                  fontSize: '15px',
                  color: '#78350F',
                  lineHeight: '1.65'
                }}>{section.body}</p>
                  </div>;
            }
            return null;
          })}
          </div>

          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '48px',
          paddingTop: '28px',
          borderTop: '1px solid #ECEEFF'
        }}>
            <button onClick={handleCloseLesson} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#FFFFFF',
            border: '1.5px solid #E4E8FF',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#4D4D56',
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif'
          }}>
              <IconChevronLeft size={14} color="currentColor" />
              <span>Back to Modules</span>
            </button>
            <button onClick={handleCloseLesson} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
            boxShadow: '0px 6px 20px rgba(30,77,215,0.3)'
          }}>
              <span>Next Lesson</span>
              <IconArrowRight size={14} color="#FFFFFF" />
            </button>
          </div>
        </main>
      </div>;
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  const allNavItems = NAV_GROUPS.flatMap(g => g.items);
  const currentNavItem = allNavItems.find(i => i.id === activeView);

  // Mobile bottom nav items (primary 5)
  const MOBILE_NAV_ITEMS = [{
    id: 'home' as DashboardView,
    label: 'Home',
    iconKey: 'home'
  }, {
    id: 'learning' as DashboardView,
    label: 'Learn',
    iconKey: 'learning'
  }, {
    id: 'roadmap' as DashboardView,
    label: 'Roadmap',
    iconKey: 'roadmap'
  }, {
    id: 'resources' as DashboardView,
    label: 'Resources',
    iconKey: 'resources'
  }, {
    id: 'profile' as DashboardView,
    label: 'Profile',
    iconKey: 'profile'
  }];

  // ─── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (isMobile) {
    return <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#F7F9FF',
      fontFamily: '"Inter", sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Mobile slide-out menu overlay */}
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 100,
        backdropFilter: 'blur(4px)'
      }} />}

      {/* Mobile slide-out full nav */}
      <nav aria-label="Full navigation menu" style={{
        position: 'fixed',
        top: 0,
        left: mobileMenuOpen ? 0 : '-100%',
        width: '280px',
        height: '100vh',
        background: '#FFFFFF',
        zIndex: 101,
        boxShadow: '4px 0 40px rgba(30,77,215,0.18)',
        transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderBottom: '1px solid #F0F2FF'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <JapaLearnLogo size={34} />
            <BrandWordmark size={17} />
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            color: '#82858A'
          }} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        {/* User card */}
        <div style={{
          margin: '12px 12px 4px',
          background: 'linear-gradient(135deg, #F4F7FF 0%, #EBF1FF 100%)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid #E0E8FF',
          cursor: 'pointer'
        }} onClick={() => {
          setActiveView('profile');
          setMobileMenuOpen(false);
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }} aria-hidden="true">
            <span style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700
            }}>A</span>
          </div>
          <div style={{
            minWidth: 0
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 700,
              color: '#18181B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>Adaeze Okafor</p>
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: '#3B75FF',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <IconFlag size={11} color="#3B75FF" strokeWidth={2} />
              <span>UK Pathway · Free Plan</span>
            </p>
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '8px 10px',
          overflowY: 'auto'
        }}>
          {NAV_GROUPS.map(group => <div key={group.groupLabel} style={{
            marginBottom: '4px'
          }}>
            <p style={{
              margin: '14px 0 5px 10px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#B0B4C4',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>{group.groupLabel}</p>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }} role="menu">
              {group.items.map(item => {
                const isActive = activeView === item.id;
                return <li key={item.id} role="none">
                  <button role="menuitem" aria-current={isActive ? 'page' : undefined} onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }} style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 12px',
                    borderRadius: '11px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, #EBF1FF 0%, #E0EAFF 100%)' : 'transparent',
                    color: isActive ? '#1E4DD7' : '#4D4D56',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(30,77,215,0.12)' : 'none'
                  }}>
                    <span style={{
                      width: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <NavIcon iconKey={item.iconKey} size={17} color={isActive ? '#1E4DD7' : '#6B7280'} />
                    </span>
                    <span style={{
                      flex: 1
                    }}>{item.label}</span>
                    {item.badge && <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#7C6AF7',
                      background: '#F0EEFF',
                      border: '1px solid #DDD6FE',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      flexShrink: 0
                    }}>PREVIEW</span>}
                  </button>
                </li>;
              })}
            </ul>
          </div>)}
        </div>
        <div style={{
          padding: '12px 10px 28px',
          borderTop: '1px solid #F0F2FF'
        }}>
          <button onClick={() => {
            handleSignOut();
            setMobileMenuOpen(false);
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '11px 12px',
            borderRadius: '11px',
            border: 'none',
            background: 'transparent',
            color: '#A0A3AB',
            fontSize: '14px',
            fontWeight: 400,
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            fontFamily: '"Inter", sans-serif'
          }} onMouseEnter={e => {
            e.currentTarget.style.background = '#FFF0F3';
            e.currentTarget.style.color = '#EF4369';
          }} onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#A0A3AB';
          }}>
            <span style={{
              width: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}><IconSignOut size={17} color="currentColor" /></span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile sticky top header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #ECEEFF',
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button onClick={() => setMobileMenuOpen(true)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0'
          }} aria-label="Open menu">
            <JapaLearnLogo size={32} />
            <BrandWordmark size={15} />
          </button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            background: '#EBF1FF',
            borderRadius: '20px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#1E4DD7'
            }}>72%</span>
            <div style={{
              width: '36px',
              height: '4px',
              background: 'rgba(30,77,215,0.15)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '72%',
                height: '100%',
                background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                borderRadius: '2px'
              }} />
            </div>
          </div>
          <button style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9BB3FF, #3B75FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
          }} onClick={() => setActiveView('profile')} aria-label="View profile">
            <span style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>A</span>
          </button>
        </div>
      </header>

      {/* Mobile page title bar */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #F0F2FF',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <NavIcon iconKey={currentNavItem?.iconKey ?? 'home'} size={16} color="#1E4DD7" />
        <p style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 700,
          color: '#18181B',
          fontFamily: '"DM Sans", sans-serif',
          flex: 1
        }}>
          {currentNavItem?.label ?? 'Dashboard'}
        </p>
        {currentNavItem?.badge && <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#7C6AF7',
          background: '#F0EEFF',
          border: '1px solid #DDD6FE',
          padding: '2px 8px',
          borderRadius: '6px'
        }}>PREVIEW</span>}
        <button style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          border: '1px solid #ECEEFF',
          background: '#FAFBFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }} aria-label="Notifications">
          <IconBell size={15} color="#6B7280" strokeWidth={1.75} />
        </button>
      </div>

      {/* Mobile scrollable content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 88px',
        boxSizing: 'border-box'
      }}>

        {/* ── HOME (mobile) ── */}
        {activeView === 'home' && <div>
          {/* Greeting */}
          <div style={{
            marginBottom: '16px'
          }}>
            <p style={{
              margin: '0 0 3px',
              fontSize: '11px',
              color: '#A0A3AB',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <IconCalendar size={11} color="#A0A3AB" strokeWidth={1.75} />
              <span>Monday, April 14 · UK Skilled Worker</span>
            </p>
            <h1 style={{
              margin: '0 0 4px',
              fontSize: '22px',
              fontWeight: 800,
              color: '#18181B',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif',
              lineHeight: 1.15
            }}>
              Good morning, Adaeze 👋
            </h1>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6B7280',
              lineHeight: 1.5
            }}>
              You're <strong style={{
                color: '#F59A0A'
              }}>72% ready</strong> — 4 actions need attention today.
            </p>
          </div>

          {/* Hero readiness card */}
          <div style={{
            background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '14px',
            boxShadow: '0px 12px 40px rgba(30,77,215,0.3)'
          }} role="region" aria-label="Migration readiness overview">
            <p style={{
              margin: '0 0 4px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <IconTarget size={10} color="rgba(255,255,255,0.6)" />
              <span>Migration Readiness</span>
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '48px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-3px',
                fontFamily: '"DM Sans", sans-serif',
                lineHeight: 1
              }}>72</p>
              <div style={{
                paddingBottom: '6px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.7)'
                }}>%</span>
                <p style={{
                  margin: 0,
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.55)',
                  fontWeight: 600
                }}>Moderate</p>
              </div>
              <div style={{
                marginLeft: 'auto',
                paddingBottom: '4px'
              }}>
                <button onClick={() => setActiveView('learning')} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#1E4DD7',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0px 4px 14px rgba(0,0,0,0.18)'
                }}>
                  <span>Continue</span>
                  <IconArrowRight size={12} color="#1E4DD7" />
                </button>
              </div>
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '8px'
            }} role="progressbar" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}>
              <div style={{
                width: '72%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.6), #FFFFFF)',
                borderRadius: '3px'
              }} />
            </div>
            <p style={{
              margin: '0 0 12px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)'
            }}>UK Skilled Worker Visa · Healthcare Sector</p>
            {/* Score tags */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px'
            }}>
              {READINESS_TAGS.map(tag => <div key={tag.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 10px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <span style={{
                  flexShrink: 0
                }}>
                  {tag.status === 'ok' && <IconCheckCircle size={13} color="#4ADE80" strokeWidth={2} />}
                  {tag.status === 'warn' && <IconAlertTriangle size={13} color="#FCD34D" strokeWidth={2} />}
                  {tag.status === 'bad' && <IconXCircle size={13} color="#F87171" strokeWidth={2} />}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{tag.label}</span>
                <span style={{
                  fontSize: '10px',
                  color: tag.status === 'ok' ? '#4ADE80' : tag.status === 'warn' ? '#FCD34D' : '#F87171',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {tag.status === 'ok' ? '✓' : tag.status === 'warn' ? '!' : '✗'}
                </span>
              </div>)}
            </div>
          </div>

          {/* Stat cards row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '14px'
          }}>
            {STAT_CARDS.map(card => <div key={card.id} style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px',
              border: '1px solid #F0F2FF',
              boxShadow: '0px 2px 8px rgba(30,77,215,0.04)'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '9px',
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                <StatIcon iconKey={card.iconKey} color={card.color} />
              </div>
              <p style={{
                margin: '0 0 1px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.5px',
                lineHeight: 1
              }}>{card.value}</p>
              <p style={{
                margin: 0,
                fontSize: '10px',
                color: '#82858A',
                fontWeight: 500,
                lineHeight: 1.3
              }}>{card.label}</p>
            </div>)}
          </div>

          {/* Priority actions */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 10px rgba(30,77,215,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '7px'
              }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} aria-hidden="true">
                  <IconFlame size={12} color="#FFFFFF" strokeWidth={2.5} />
                </span>
                <span>Today's Priorities</span>
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#EF4369',
                background: '#FDECEC',
                padding: '3px 8px',
                borderRadius: '20px'
              }}>4 pending</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[{
                icon: 'target' as const,
                title: 'Book IELTS Test',
                desc: 'Slots fill fast — register now',
                color: '#EF4369',
                bg: '#FDECEC',
                urgent: true,
                action: () => setActiveView('resources')
              }, {
                icon: 'filecheck' as const,
                title: 'Upload IELTS Certificate',
                desc: 'Missing required document',
                color: '#F59A0A',
                bg: '#FFF7E6',
                urgent: false,
                action: () => setActiveView('documents')
              }, {
                icon: 'book' as const,
                title: 'Continue Module 01',
                desc: 'Salary Thresholds lesson next',
                color: '#3B75FF',
                bg: '#EBF1FF',
                urgent: false,
                action: () => {
                  setActiveView('learning');
                  setCurriculumRequested(true);
                }
              }, {
                icon: 'flame' as const,
                title: 'Maintain 12-day streak',
                desc: 'Complete 1 lesson today',
                color: '#21C474',
                bg: '#E8F9EE',
                urgent: false,
                action: () => {
                  setActiveView('learning');
                  setCurriculumRequested(true);
                }
              }].map(item => <button key={item.title} onClick={item.action} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: item.urgent ? `linear-gradient(135deg, ${item.bg}, #fff)` : '#FAFBFF',
                borderRadius: '12px',
                border: `1.5px solid ${item.urgent ? item.color + '44' : '#F0F2FF'}`,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: '"Inter", sans-serif',
                width: '100%'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }} aria-hidden="true">
                  <StatIcon iconKey={item.icon} color={item.color} />
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                  <p style={{
                    margin: '0 0 1px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#18181B',
                    lineHeight: 1.3
                  }}>{item.title}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#82858A',
                    lineHeight: 1.4
                  }}>{item.desc}</p>
                </div>
                {item.urgent && <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: item.color,
                  background: item.bg,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  flexShrink: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Urgent</span>}
                <IconArrowRight size={14} color="#B0B4C4" />
              </button>)}
            </div>
          </div>

          {/* Score breakdown */}
          <section aria-label="Score breakdown" style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 10px rgba(30,77,215,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Readiness Breakdown</h2>
              <button onClick={() => setActiveView('roadmap')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#3B75FF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}>
                <span>Roadmap</span>
                <IconArrowRight size={11} color="#3B75FF" />
              </button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {SCORE_CATEGORIES.map(cat => <div key={cat.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px'
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: cat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {cat.status === 'ok' && <IconCheckCircle size={12} color={cat.color} strokeWidth={2} />}
                      {cat.status === 'warn' && <IconAlertTriangle size={12} color={cat.color} strokeWidth={2} />}
                      {cat.status === 'bad' && <IconXCircle size={12} color={cat.color} strokeWidth={2} />}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#2D2D35'
                    }}>{cat.label}</span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: cat.color
                  }}>{cat.score}%</span>
                </div>
                <div style={{
                  height: '6px',
                  background: '#F0F2FF',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${cat.score}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})`,
                    borderRadius: '3px'
                  }} />
                </div>
              </div>)}
            </div>
          </section>

          {/* Recent Activity */}
          <section aria-label="Recent activity" style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 10px rgba(30,77,215,0.05)'
          }}>
            <h2 style={{
              margin: '0 0 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif'
            }}>Recent Activity</h2>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
              {ACTIVITIES.map((activity, idx) => <li key={activity.id} style={{
                display: 'flex',
                gap: '10px',
                padding: '9px 0',
                borderBottom: idx < ACTIVITIES.length - 1 ? '1px solid #F4F6FF' : 'none',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: '#EBF1FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }} aria-hidden="true">
                  <ActivityIcon iconKey={activity.iconKey} />
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                  <p style={{
                    margin: '0 0 1px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#18181B',
                    lineHeight: '1.4'
                  }}>{activity.title}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: '#B0B4C4'
                  }}>{activity.time}</p>
                </div>
              </li>)}
            </ul>
          </section>
        </div>}

        {/* All other views on mobile — reuse existing section JSX but with mobile padding already handled by outer container */}
        {activeView !== 'home' && <div style={{
          maxWidth: '100%'
        }}>
          {/* ── CURRICULUM / LEARNING ── */}
          {activeView === 'learning' && <div>
            {curriculumLoading ? <div>
              <div style={{
                marginBottom: '20px'
              }}>
                <h1 style={{
                  margin: '0 0 4px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#18181B',
                  letterSpacing: '-0.5px',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Building your curriculum…</h1>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#82858A',
                  lineHeight: '1.6'
                }}>AI is personalising every module for you.</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0px 8px 28px rgba(30,77,215,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  animation: 'skeletonPulse 1.4s ease-in-out infinite'
                }}>
                  <IconLearning size={20} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
                </div>
                <div style={{
                  flex: 1
                }}>
                  <p style={{
                    margin: '0 0 4px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>Generating your curriculum</p>
                  <div style={{
                    height: '5px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.95), rgba(255,255,255,0.4))',
                      borderRadius: '3px',
                      animation: 'skeletonSweep 1.8s ease-in-out infinite',
                      backgroundSize: '300px 100%',
                      width: '100%'
                    }} />
                  </div>
                </div>
              </div>
            </div> : !curriculumRequested ? <div>
              <div style={{
                marginBottom: '20px'
              }}>
                <h1 style={{
                  margin: '0 0 4px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#18181B',
                  letterSpacing: '-0.5px',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Your AI Curriculum</h1>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#82858A',
                  lineHeight: '1.6'
                }}>Personalised and built for your migration profile.</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
                borderRadius: '18px',
                padding: '22px',
                marginBottom: '16px',
                boxShadow: '0px 10px 32px rgba(30,77,215,0.28)'
              }}>
                <p style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>What you'll get</p>
                <h2 style={{
                  margin: '0 0 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif',
                  lineHeight: 1.3,
                  letterSpacing: '-0.3px'
                }}>A complete UK migration path, built for you</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '18px'
                }}>
                  {CURRICULUM_PROMISES.map(item => <div key={item.title} style={{
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }} aria-hidden="true">
                      {item.iconKey === 'book' && <IconBook size={14} color="#FFFFFF" strokeWidth={2} />}
                      {item.iconKey === 'target' && <IconTarget size={14} color="#FFFFFF" strokeWidth={2} />}
                      {item.iconKey === 'flame' && <IconFlame size={14} color="#FFFFFF" strokeWidth={2} />}
                      {item.iconKey === 'lock' && <IconLock size={14} color="#FFFFFF" strokeWidth={2} />}
                    </div>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#FFFFFF'
                    }}>{item.title}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: '1.4'
                    }}>{item.desc}</p>
                  </div>)}
                </div>
                <button onClick={handleGenerateCurriculum} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: '#FFFFFF',
                  color: '#1E4DD7',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: '0px 6px 20px rgba(0,0,0,0.18)',
                  width: '100%'
                }}>
                  <IconLearning size={16} color="#1E4DD7" strokeWidth={2} />
                  <span>Generate My Curriculum</span>
                  <IconArrowRight size={14} color="#1E4DD7" />
                </button>
              </div>
            </div> : <div>
              <div style={{
                background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 100%)',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '16px',
                boxShadow: '0px 8px 28px rgba(30,77,215,0.25)'
              }}>
                <p style={{
                  margin: '0 0 3px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>Your Learning Path</p>
                <h1 style={{
                  margin: '0 0 6px',
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.3px'
                }}>UK Skilled Worker — Complete Programme</h1>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[{
                    val: '4',
                    label: 'Modules'
                  }, {
                    val: '14',
                    label: 'Lessons'
                  }, {
                    val: '34%',
                    label: 'Done'
                  }].map(s => <div key={s.label} style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <p style={{
                      margin: '0 0 1px',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 500
                    }}>{s.label}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#FFFFFF'
                    }}>{s.val}</p>
                  </div>)}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {MODULES.map(mod => {
                  const isOpen = expandedModule === mod.id;
                  return <div key={mod.id} style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: `1.5px solid ${isOpen ? '#B3C5FF' : '#F0F2FF'}`,
                    boxShadow: isOpen ? '0px 4px 16px rgba(30,77,215,0.08)' : '0px 2px 6px rgba(30,77,215,0.04)',
                    overflow: 'hidden'
                  }}>
                    <button onClick={() => handleToggleModule(mod.id)} style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: mod.progress > 0 ? 'linear-gradient(135deg, #EBF1FF, #D8E6FF)' : '#F4F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }} aria-hidden="true">
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: mod.progress > 0 ? '#1E4DD7' : '#B0B4C4',
                          fontFamily: '"DM Sans", sans-serif'
                        }}>{mod.moduleNum}</span>
                      </div>
                      <div style={{
                        flex: 1,
                        minWidth: 0
                      }}>
                        <p style={{
                          margin: '0 0 4px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#18181B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>{mod.title}</p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{
                            flex: 1,
                            height: '4px',
                            background: '#EEF0FF',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            maxWidth: '80px'
                          }}>
                            <div style={{
                              width: `${mod.progress}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                              borderRadius: '2px'
                            }} />
                          </div>
                          <span style={{
                            fontSize: '10px',
                            color: '#82858A',
                            fontWeight: 600
                          }}>{mod.progress}%</span>
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: '20px',
                            fontSize: '9px',
                            fontWeight: 700,
                            background: mod.tagBg,
                            color: mod.tagColor
                          }}>{mod.tag}</span>
                        </div>
                      </div>
                      <span style={{
                        color: '#B0B4C4',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0
                      }}>
                        <IconChevronDown size={16} color="#B0B4C4" />
                      </span>
                    </button>
                    {isOpen && <div style={{
                      borderTop: '1px solid #F4F6FF'
                    }}>
                      <ul style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: '6px 12px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        {mod.lessons.map((lesson, lessonIdx) => <li key={lesson.id}>
                          <button onClick={() => handleOpenLesson(lesson.id)} style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: '"Inter", sans-serif'
                          }} onMouseEnter={e => e.currentTarget.style.background = '#F4F6FF'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: lesson.done ? 'linear-gradient(135deg, #21C474, #10B981)' : '#F0F2FF',
                              border: lesson.done ? 'none' : '2px solid #E0E4F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {lesson.done ? <IconCheck size={12} color="#FFFFFF" strokeWidth={2.5} /> : <span style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#B0B4C4'
                              }}>{lessonIdx + 1}</span>}
                            </div>
                            <p style={{
                              margin: 0,
                              fontSize: '13px',
                              fontWeight: lesson.done ? 500 : 600,
                              color: lesson.done ? '#82858A' : '#18181B',
                              textDecoration: lesson.done ? 'line-through' : 'none',
                              flex: 1
                            }}>{lesson.title}</p>
                            <span style={{
                              fontSize: '11px',
                              color: '#B0B4C4',
                              fontWeight: 500,
                              flexShrink: 0
                            }}>{lesson.duration}</span>
                          </button>
                        </li>)}
                      </ul>
                      <div style={{
                        padding: '0 12px 12px'
                      }}>
                        <button onClick={() => handleOpenLesson(mod.lessons.find(l => !l.done)?.id ?? mod.lessons[0].id)} style={{
                          width: '100%',
                          padding: '11px',
                          background: mod.progress > 0 ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F0F2FF',
                          color: mod.progress > 0 ? '#FFFFFF' : '#82858A',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: '"Inter", sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '7px'
                        }}>
                          <span>{mod.progress === 0 ? 'Start Module' : mod.progress === 100 ? 'Review Module' : 'Continue Module'}</span>
                          <IconArrowRight size={13} color={mod.progress > 0 ? '#FFFFFF' : '#82858A'} />
                        </button>
                      </div>
                    </div>}
                  </div>;
                })}
              </div>
            </div>}
          </div>}

          {/* ── ROADMAP (mobile) ── */}
          {activeView === 'roadmap' && <div>
            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{
                margin: '0 0 3px',
                fontSize: '11px',
                color: '#82858A',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconCalendar size={11} color="#82858A" strokeWidth={1.75} />
                <span>UK Skilled Worker Visa · 18-Week Plan</span>
              </p>
              <h1 style={{
                margin: '0 0 3px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>My Roadmap</h1>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#82858A'
              }}>Tap any milestone to see action steps.</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)',
              borderRadius: '18px',
              padding: '18px',
              marginBottom: '14px',
              boxShadow: '0px 10px 32px rgba(30,77,215,0.25)'
            }}>
              <p style={{
                margin: '0 0 2px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase'
              }}>Current Phase</p>
              <p style={{
                margin: '0 0 2px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px'
              }}>Language Prep</p>
              <p style={{
                margin: '0 0 10px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.65)'
              }}>Week 5–6 · Book IELTS & start preparation</p>
              <div style={{
                height: '7px',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '6px'
              }}>
                <div style={{
                  width: '33%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)',
                  borderRadius: '4px'
                }} />
              </div>
              <p style={{
                margin: '0 0 14px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.55)'
              }}>2 of 6 milestones completed · 33% done</p>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {[{
                  val: '16',
                  label: 'Weeks left'
                }, {
                  val: '33%',
                  label: 'Complete'
                }, {
                  val: '4',
                  label: 'Due'
                }].map(stat => <div key={stat.label} style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'rgba(255,255,255,0.14)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: '0 0 1px',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{stat.val}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>{stat.label}</p>
                </div>)}
              </div>
            </div>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '16px',
              boxShadow: '0px 2px 12px rgba(30,77,215,0.06)',
              border: '1px solid #F0F2FF',
              marginBottom: '12px'
            }}>
              <h2 style={{
                margin: '0 0 16px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Milestone Timeline</h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0'
              }}>
                {ROADMAP_MILESTONES.map((milestone, idx) => {
                  const isOpen = expandedMilestone === milestone.id;
                  return <div key={milestone.id} style={{
                    display: 'flex',
                    gap: '0'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '36px',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: milestone.done ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : milestone.current ? '#FFFFFF' : '#F4F6FF',
                        border: milestone.current ? '2.5px solid #1E4DD7' : milestone.done ? 'none' : '2px solid #E0E4F5',
                        boxShadow: milestone.current ? '0 0 0 3px rgba(30,77,215,0.12)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1
                      }}>
                        {milestone.done ? <IconCheck size={12} color="#FFFFFF" strokeWidth={2.5} /> : milestone.current ? <div style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: '#1E4DD7'
                        }} /> : <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#C0C4D4'
                        }}>{idx + 1}</span>}
                      </div>
                      {idx < ROADMAP_MILESTONES.length - 1 && <div style={{
                        width: '2px',
                        flex: 1,
                        minHeight: '12px',
                        background: milestone.done ? 'linear-gradient(180deg, #3B75FF, #9BB3FF)' : milestone.current ? 'linear-gradient(180deg, #3B75FF 40%, #E8EBF8 100%)' : '#E8EBF8',
                        margin: '4px 0'
                      }} />}
                    </div>
                    <div style={{
                      flex: 1,
                      paddingLeft: '10px',
                      paddingBottom: idx < ROADMAP_MILESTONES.length - 1 ? '12px' : '0'
                    }}>
                      <button onClick={() => setExpandedMilestone(isOpen ? null : milestone.id)} style={{
                        width: '100%',
                        background: isOpen ? milestone.current ? 'linear-gradient(135deg, #EBF1FF, #E4EEFF)' : '#FAFBFF' : 'transparent',
                        border: isOpen ? '1.5px solid #D4DCFF' : '1.5px solid transparent',
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <div style={{
                            flex: 1,
                            minWidth: 0
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '3px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4',
                                textTransform: 'uppercase',
                                letterSpacing: '0.07em'
                              }}>{milestone.week}</span>
                              <span style={{
                                padding: '2px 7px',
                                background: milestone.done ? '#E8F9EE' : milestone.current ? '#EBF1FF' : '#F4F4F6',
                                borderRadius: '5px',
                                fontSize: '9px',
                                fontWeight: 700,
                                color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4'
                              }}>{milestone.phase}</span>
                              {milestone.current && <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 7px',
                                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                                borderRadius: '5px',
                                fontSize: '9px',
                                fontWeight: 700,
                                color: '#FFFFFF'
                              }}>
                                <IconFlag size={8} color="#FFFFFF" />
                                <span>You are here</span>
                              </span>}
                              {milestone.done && <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 7px',
                                background: '#E8F9EE',
                                borderRadius: '5px',
                                fontSize: '9px',
                                fontWeight: 700,
                                color: '#21C474'
                              }}>
                                <IconCheck size={8} color="#21C474" strokeWidth={2.5} />
                                <span>Done</span>
                              </span>}
                            </div>
                            <p style={{
                              margin: '0 0 2px',
                              fontSize: '13px',
                              fontWeight: milestone.current ? 700 : milestone.done ? 500 : 600,
                              color: milestone.done ? '#82858A' : '#18181B',
                              textDecoration: milestone.done ? 'line-through' : 'none',
                              lineHeight: '1.3'
                            }}>{milestone.title}</p>
                          </div>
                          <span style={{
                            color: '#B0B4C4',
                            transition: 'transform 0.2s',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            flexShrink: 0
                          }}>
                            <IconChevronDown size={14} color="#B0B4C4" />
                          </span>
                        </div>
                        {isOpen && <div style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(30,77,215,0.1)'
                        }}>
                          <p style={{
                            margin: '0 0 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#82858A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.07em'
                          }}>Action Steps</p>
                          <ul style={{
                            margin: 0,
                            padding: 0,
                            listStyle: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}>
                            {milestone.actions.map((action, ai) => <li key={ai} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              padding: '8px 10px',
                              background: milestone.done ? '#F8FFF9' : milestone.current ? '#F0F5FF' : '#FAFBFF',
                              borderRadius: '8px',
                              border: `1px solid ${milestone.done ? '#D8F5E6' : milestone.current ? '#D4DCFF' : '#ECEEFF'}`
                            }}>
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: milestone.done ? 'linear-gradient(135deg, #21C474, #10B981)' : milestone.current ? '#EBF1FF' : '#F0F2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '1px'
                              }}>
                                {milestone.done ? <IconCheck size={9} color="#FFFFFF" strokeWidth={2.5} /> : <span style={{
                                  fontSize: '8px',
                                  fontWeight: 700,
                                  color: milestone.current ? '#1E4DD7' : '#B0B4C4'
                                }}>{ai + 1}</span>}
                              </div>
                              <span style={{
                                fontSize: '12px',
                                color: milestone.done ? '#6B7280' : '#2D2D35',
                                lineHeight: '1.5',
                                textDecoration: milestone.done ? 'line-through' : 'none'
                              }}>{action}</span>
                            </li>)}
                          </ul>
                          {milestone.current && <button style={{
                            width: '100%',
                            marginTop: '10px',
                            padding: '10px',
                            background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: '"Inter", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}>
                            <span>Work on this milestone</span>
                            <IconArrowRight size={12} color="#FFFFFF" />
                          </button>}
                        </div>}
                      </button>
                    </div>
                  </div>;
                })}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid #D4DCFF',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconTarget size={16} color="#FFFFFF" strokeWidth={1.75} />
              </div>
              <div style={{
                flex: 1
              }}>
                <p style={{
                  margin: '0 0 2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1E4DD7'
                }}>Next priority action</p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#4D4D56',
                  lineHeight: '1.5'
                }}>Get a detailed roadmap for ₦5,000. This is the basic roadmap.</p>
              </div>
              <button onClick={() => setActiveView('resources')} style={{
                padding: '9px 14px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                flexShrink: 0
              }}>Download Roadmap</button>
            </div>
          </div>}

          {/* ── RESOURCES (mobile) ── */}
          {activeView === 'resources' && <div>
            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{
                margin: '0 0 3px',
                fontSize: '11px',
                color: '#82858A',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconBook size={11} color="#82858A" strokeWidth={1.75} />
                <span>Curated for UK Skilled Worker Visa</span>
              </p>
              <h1 style={{
                margin: '0 0 3px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Resources</h1>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#82858A'
              }}>Templates, checklists, SOP samples &amp; guides.</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)',
              borderRadius: '18px',
              padding: '18px',
              marginBottom: '14px',
              boxShadow: '0px 10px 28px rgba(30,77,215,0.24)'
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
                <IconTarget size={9} color="#FFFFFF" />
                <span>Featured for You</span>
              </span>
              <p style={{
                margin: '0 0 5px',
                fontSize: '17px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.3px',
                lineHeight: 1.3
              }}>IELTS Preparation Roadmap</p>
              <p style={{
                margin: '0 0 14px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.5'
              }}>Complete 6-week study plan — your most urgent resource right now.</p>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                background: '#FFFFFF',
                color: '#1E4DD7',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
              }}>
                <IconDownload size={13} color="#1E4DD7" strokeWidth={2} />
                <span>Download Free</span>
              </button>
            </div>
            <div style={{
              display: 'flex',
              gap: '7px',
              marginBottom: '14px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {['All', 'Visa', 'Documents', 'Finance', 'Language', 'Career'].map(cat => <button key={cat} onClick={() => setResourceFilter(cat)} style={{
                padding: '7px 14px',
                background: resourceFilter === cat ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#FFFFFF',
                border: `1.5px solid ${resourceFilter === cat ? 'transparent' : '#E4E8FF'}`,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: resourceFilter === cat ? 700 : 500,
                color: resourceFilter === cat ? '#FFFFFF' : '#6B7280',
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>{cat}</button>)}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {RESOURCES.filter(res => resourceFilter === 'All' || res.category === resourceFilter).map(res => <div key={res.id} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)',
                border: '1px solid #F0F2FF'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: res.tagBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1.5px solid ${res.tagColor}22`
                }}>
                  {res.type === 'Checklist' && <IconChecklist size={20} color={res.tagColor} strokeWidth={1.75} />}
                  {res.type === 'Template' && <IconTemplate size={20} color={res.tagColor} strokeWidth={1.75} />}
                  {res.type === 'Guide' && <IconGuide size={20} color={res.tagColor} strokeWidth={1.75} />}
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '3px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      background: res.tagBg,
                      borderRadius: '20px',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: res.tagColor
                    }}>{res.tag}</span>
                    <span style={{
                      padding: '2px 8px',
                      background: '#F4F4F6',
                      borderRadius: '20px',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: '#6B7280'
                    }}>{res.type}</span>
                  </div>
                  <p style={{
                    margin: '0 0 2px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#18181B',
                    lineHeight: '1.3'
                  }}>{res.title}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#82858A'
                  }}>{res.pages}</p>
                </div>
                <button style={{
                  padding: '8px 14px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  border: 'none',
                  borderRadius: '9px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <IconDownload size={12} color="#FFFFFF" strokeWidth={2} />
                  <span>Get</span>
                </button>
              </div>)}
            </div>
          </div>}

          {/* ── CONVERSATIONS (mobile) ── */}
          {activeView === 'conversations' && <div>
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
              }}>AI Conversations</h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '2px 8px',
                borderRadius: '20px'
              }}>MVP 2</span>
            </div>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              boxShadow: '0px 4px 20px rgba(30,77,215,0.08)',
              border: '1px solid #ECEEFF',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 220px)',
              minHeight: '400px'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #F0F2FF',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #FAFBFF, #F4F7FF)'
              }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <JapaLearnLogo size={20} />
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#18181B'
                  }}>JapaLearn AI Assistant</p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#21C474',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#21C474',
                      display: 'inline-block'
                    }} />
                    <span>Online · Migration specialist</span>
                  </p>
                </div>
              </div>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#FAFBFF'
              }}>
                {chatMessages.map(msg => <div key={msg.id} style={{
                  display: 'flex',
                  gap: '8px',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end'
                }}>
                  {msg.role === 'ai' && <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}><JapaLearnLogo size={16} /></div>}
                  {msg.role === 'user' && <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9BB3FF, #3B75FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff'
                  }}>A</div>}
                  <div style={{
                    maxWidth: '75%'
                  }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: msg.role === 'ai' ? '#FFFFFF' : 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                      color: msg.role === 'ai' ? '#18181B' : '#FFFFFF',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      boxShadow: msg.role === 'ai' ? '0px 2px 6px rgba(30,77,215,0.06)' : '0px 4px 12px rgba(30,77,215,0.3)',
                      border: msg.role === 'ai' ? '1px solid #ECEEFF' : 'none'
                    }}>
                      <p style={{
                        margin: 0
                      }}>{msg.text}</p>
                    </div>
                    <p style={{
                      margin: '3px 0 0',
                      fontSize: '10px',
                      color: '#B0B4C4',
                      textAlign: msg.role === 'user' ? 'right' : 'left'
                    }}>{msg.time}</p>
                  </div>
                </div>)}
              </div>
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #F0F2FF',
                background: '#FFFFFF'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  background: '#F4F6FF',
                  borderRadius: '12px',
                  padding: '9px 12px',
                  border: '1.5px solid #E4E8FF'
                }}>
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={handleChatKeyDown} placeholder="Ask about visa, IELTS, costs..." style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#18181B',
                    fontFamily: '"Inter", sans-serif'
                  }} />
                  <button onClick={handleSendChat} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }} aria-label="Send message">
                    <IconArrowRight size={14} color="#FFFFFF" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>}

          {/* ── DOCUMENTS (mobile) ── */}
          {activeView === 'documents' && <div>
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
              }}>Document Vault</h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '2px 8px',
                borderRadius: '20px'
              }}>MVP 2</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
              borderRadius: '18px',
              padding: '18px',
              marginBottom: '14px',
              boxShadow: '0px 10px 30px rgba(30,77,215,0.25)'
            }}>
              <p style={{
                margin: '0 0 3px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>Document Readiness</p>
              <p style={{
                margin: '0 0 8px',
                fontSize: '36px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-2px',
                lineHeight: 1
              }}>62%</p>
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '6px'
              }}>
                <div style={{
                  width: '62%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)',
                  borderRadius: '3px'
                }} />
              </div>
              <p style={{
                margin: '0 0 12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)'
              }}>5 of 8 required documents uploaded</p>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {[{
                  val: '4',
                  label: 'Uploaded',
                  color: '#4ADE80'
                }, {
                  val: '2',
                  label: 'Missing',
                  color: '#F87171'
                }, {
                  val: '1',
                  label: 'Processing',
                  color: '#FCD34D'
                }].map(stat => <div key={stat.label} style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'rgba(255,255,255,0.14)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: '0 0 1px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: stat.color,
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{stat.val}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 500
                  }}>{stat.label}</p>
                </div>)}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #F4F7FF, #EBF1FF)',
              border: '2px dashed #B3C5FF',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '14px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #EBF1FF, #D8E6FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0px 4px 12px rgba(30,77,215,0.12)'
              }}>
                <IconUpload size={22} color="#1E4DD7" strokeWidth={1.75} />
              </div>
              <p style={{
                margin: '0 0 4px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Drop your documents here</p>
              <p style={{
                margin: '0 0 14px',
                fontSize: '12px',
                color: '#82858A'
              }}>PDF, JPG, PNG — up to 10MB per file</p>
              <button style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                margin: '0 auto'
              }}>
                <IconUpload size={13} color="#FFFFFF" strokeWidth={2} />
                <span>Browse Files</span>
              </button>
            </div>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '16px',
              boxShadow: '0px 2px 10px rgba(30,77,215,0.05)',
              border: '1px solid #F0F2FF'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Required Documents</h2>
                <div style={{
                  display: 'flex',
                  gap: '5px'
                }}>
                  {(['All', 'Missing', 'Uploaded'] as const).map(f => <button key={f} onClick={() => setDocFilter(f)} style={{
                    padding: '4px 10px',
                    background: docFilter === f ? '#EBF1FF' : '#F4F6FF',
                    border: `1px solid ${docFilter === f ? '#B3C5FF' : '#E4E8FF'}`,
                    borderRadius: '7px',
                    fontSize: '11px',
                    fontWeight: docFilter === f ? 700 : 500,
                    color: docFilter === f ? '#1E4DD7' : '#82858A',
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>{f}</button>)}
                </div>
              </div>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0'
              }}>
                {filteredDocuments.map((doc, idx) => <li key={doc.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: idx < filteredDocuments.length - 1 ? '1px solid #F4F6FF' : 'none'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: doc.status === 'uploaded' ? '#E8F9EE' : doc.status === 'processing' ? '#FFF7E6' : '#FDECEC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `1.5px solid ${doc.status === 'uploaded' ? '#A7F3C5' : doc.status === 'processing' ? '#FDE68A' : '#FBBCC8'}`
                  }}>
                    {doc.status === 'uploaded' && <IconCheckCircle size={18} color="#21C474" strokeWidth={2} />}
                    {doc.status === 'processing' && <IconAlertTriangle size={18} color="#F59A0A" strokeWidth={2} />}
                    {doc.status === 'missing' && <IconXCircle size={18} color="#EF4369" strokeWidth={2} />}
                  </div>
                  <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#18181B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{doc.name}</p>
                    <span style={{
                      padding: '2px 7px',
                      background: '#F4F6FF',
                      borderRadius: '5px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#6B7280'
                    }}>{doc.category}</span>
                  </div>
                  <div style={{
                    flexShrink: 0
                  }}>
                    {doc.status === 'missing' && <button style={{
                      padding: '7px 12px',
                      background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <IconUpload size={11} color="#FFFFFF" strokeWidth={2} />
                      <span>Upload</span>
                    </button>}
                    {doc.status !== 'missing' && <span style={{
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: doc.status === 'uploaded' ? '#E8F9EE' : '#FFF7E6',
                      color: doc.status === 'uploaded' ? '#21C474' : '#F59A0A'
                    }}>
                      {doc.status === 'uploaded' ? 'Done' : 'Processing'}
                    </span>}
                  </div>
                </li>)}
              </ul>
            </div>
          </div>}

          {/* ── PEERS (mobile) ── */}
          {activeView === 'peers' && <div>
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
              }}>Peer Network</h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '2px 8px',
                borderRadius: '20px'
              }}>MVP 2</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
              borderRadius: '18px',
              padding: '18px',
              marginBottom: '14px',
              boxShadow: '0px 10px 30px rgba(30,77,215,0.25)'
            }}>
              <p style={{
                margin: '0 0 2px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>Your Community</p>
              <p style={{
                margin: '0 0 4px',
                fontSize: '19px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px',
                lineHeight: 1.2
              }}>2,847 Nigerians on the UK Pathway</p>
              <p style={{
                margin: '0 0 12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.65)'
              }}>412 active this week · 38 got their visa this year</p>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {[{
                  val: '412',
                  label: 'Active peers'
                }, {
                  val: '38',
                  label: 'Visas granted'
                }, {
                  val: '94%',
                  label: 'Support rate'
                }].map(stat => <div key={stat.label} style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'rgba(255,255,255,0.14)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: '0 0 1px',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{stat.val}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 500
                  }}>{stat.label}</p>
                </div>)}
              </div>
            </div>
            <h2 style={{
              margin: '0 0 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif'
            }}>Suggested Connections</h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {PEER_PROFILES.map(peer => <div key={peer.id} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: peer.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{peer.initials}</div>
                  <div style={{
                    flex: 1
                  }}>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#18181B'
                    }}>{peer.name}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#82858A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <IconFlag size={10} color="#82858A" strokeWidth={2} />
                      <span>{peer.country}</span>
                    </p>
                  </div>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <p style={{
                      margin: '0 0 1px',
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#1E4DD7',
                      fontFamily: '"DM Sans", sans-serif'
                    }}>{peer.score}%</p>
                    <p style={{
                      margin: 0,
                      fontSize: '9px',
                      color: '#82858A'
                    }}>Readiness</p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '7px'
                }}>
                  <button style={{
                    flex: 1,
                    padding: '8px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>Connect</button>
                  <button style={{
                    padding: '8px 12px',
                    background: '#F4F6FF',
                    color: '#4D4D56',
                    border: '1px solid #E0E4F5',
                    borderRadius: '9px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>View</button>
                </div>
              </div>)}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Community Discussions</h2>
              <button style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif'
              }}>+ Thread</button>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {PEER_DISCUSSION_THREADS.map(thread => <div key={thread.id} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: thread.authorBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{thread.authorInitials}</div>
                  <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#18181B'
                      }}>{thread.authorName}</span>
                      <span style={{
                        padding: '2px 7px',
                        background: thread.tagBg,
                        borderRadius: '5px',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: thread.tagColor
                      }}>{thread.tag}</span>
                      <span style={{
                        fontSize: '10px',
                        color: '#B0B4C4',
                        marginLeft: 'auto'
                      }}>{thread.timeAgo}</span>
                    </div>
                    <p style={{
                      margin: '0 0 4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#18181B',
                      lineHeight: '1.4'
                    }}>{thread.title}</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: '#82858A'
                      }}>{thread.replies} replies</span>
                      <span style={{
                        fontSize: '11px',
                        color: '#82858A'
                      }}>{thread.likes} helpful</span>
                      <button style={{
                        marginLeft: 'auto',
                        padding: '5px 12px',
                        background: '#F4F6FF',
                        border: '1px solid #E0E4F5',
                        borderRadius: '7px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#3B75FF',
                        cursor: 'pointer',
                        fontFamily: '"Inter", sans-serif'
                      }}>Read</button>
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          </div>}

          {/* ── MARKETPLACE (mobile) ── */}
          {activeView === 'marketplace' && <MarketplacePage isMobile={true} />}

          {/* ── PLANS (mobile) ── */}
          {activeView === 'plans' && <div>
            <div style={{
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h1 style={{
                margin: '0 0 4px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Subscription Plans</h1>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#82858A'
              }}>Unlock more tools as you progress your journey.</p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {PLAN_TIERS.map(plan => <div key={plan.id} style={{
                background: plan.highlight ? 'linear-gradient(155deg, #1A42C2 0%, #2F67F8 100%)' : '#FFFFFF',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: plan.highlight ? '0px 12px 36px rgba(30,77,215,0.28)' : '0px 2px 10px rgba(30,77,215,0.05)',
                border: plan.highlight ? 'none' : '1px solid #F0F2FF'
              }}>
                <p style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#82858A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em'
                }}>{plan.name}</p>
                <p style={{
                  margin: '0 0 2px',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: plan.highlight ? '#FFFFFF' : '#18181B',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.8px'
                }}>{plan.price}</p>
                <p style={{
                  margin: '0 0 16px',
                  fontSize: '12px',
                  color: plan.highlight ? 'rgba(255,255,255,0.55)' : '#A0A4B8'
                }}>{plan.period}</p>
                <ul style={{
                  listStyle: 'none',
                  margin: '0 0 16px',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {plan.features.map(feat => <li key={feat} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '13px',
                    color: plan.highlight ? 'rgba(255,255,255,0.88)' : '#4D4D56'
                  }}>
                    <span style={{
                      marginTop: '1px',
                      flexShrink: 0
                    }}><IconCheck size={13} color={plan.highlight ? 'rgba(255,255,255,0.7)' : '#21C474'} strokeWidth={2.5} /></span>
                    <span>{feat}</span>
                  </li>)}
                </ul>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: plan.highlight ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg, #1E4DD7 0%, #3B75FF 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '11px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif'
                }}>
                  {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>)}
            </div>
          </div>}

          {/* ── PROFILE (mobile) ── */}
          {activeView === 'profile' && <div>
            <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
              borderRadius: '20px',
              padding: '22px 20px 0',
              marginBottom: '0',
              boxShadow: '0px 10px 32px rgba(30,77,215,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '18px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontFamily: '"DM Sans", sans-serif'
                    }}>A</span>
                  </div>
                  <button aria-label="Change profile photo" title="Change profile photo" style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '2px solid rgba(30,77,215,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1E4DD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                  </button>
                </div>
                <div style={{
                  flex: 1
                }}>
                  <h1 style={{
                    margin: '0 0 3px',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '-0.4px'
                  }}>Adaeze Okafor</h1>
                  <p style={{
                    margin: '0 0 2px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.75)'
                  }}>adaeze.okafor@example.com</p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <IconFlag size={10} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                    <span>Lagos → UK Skilled Worker</span>
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  alignItems: 'flex-end',
                  flexShrink: 0
                }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    <IconEdit size={12} color="#FFFFFF" />
                    <span>Edit</span>
                  </button>
                  <button onClick={handleDarkToggle} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>
                    <span>Retake</span>
                  </button>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '0',
                borderTop: '1px solid rgba(255,255,255,0.12)'
              }}>
                {[{
                  val: '72%',
                  label: 'Readiness'
                }, {
                  val: '12',
                  label: 'Day Streak'
                }, {
                  val: '3',
                  label: 'Active Modules'
                }, {
                  val: '5/8',
                  label: 'Docs Ready'
                }].map((s, si) => <div key={s.label} style={{
                  flex: 1,
                  padding: '16px 0',
                  textAlign: 'center',
                  borderRight: si < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none'
                }}>
                  <p style={{
                    margin: '0 0 2px',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{s.val}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>{s.label}</p>
                </div>)}
              </div>
            </div>
            <div style={{
              marginTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <h2 style={{
                  margin: '0 0 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Migration Profile</h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {[{
                    label: 'Visa Type',
                    value: 'UK Skilled Worker'
                  }, {
                    label: 'Current Location',
                    value: 'Lagos, Nigeria'
                  }, {
                    label: 'Target Destination',
                    value: 'United Kingdom'
                  }, {
                    label: 'Profession',
                    value: 'Healthcare Worker'
                  }, {
                    label: 'IELTS Status',
                    value: 'Preparing'
                  }, {
                    label: 'Timeline',
                    value: '6 months'
                  }].map(field => <div key={field.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #F4F6FF'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#82858A',
                      fontWeight: 500
                    }}>{field.label}</span>
                    <span style={{
                      fontSize: '12px',
                      color: '#18181B',
                      fontWeight: 600
                    }}>{field.value}</span>
                  </div>)}
                </div>
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <h2 style={{
                  margin: '0 0 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Score Breakdown</h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {SCORE_CATEGORIES.map(cat => <div key={cat.id}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {cat.status === 'ok' && <IconCheckCircle size={11} color="#21C474" strokeWidth={2} />}
                        {cat.status === 'warn' && <IconAlertTriangle size={11} color="#F59A0A" strokeWidth={2} />}
                        {cat.status === 'bad' && <IconXCircle size={11} color="#EF4369" strokeWidth={2} />}
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#2D2D35'
                        }}>{cat.label}</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: cat.color
                      }}>{cat.score}%</span>
                    </div>
                    <div style={{
                      height: '5px',
                      background: '#F0F2FF',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${cat.score}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${cat.color}bb, ${cat.color})`,
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>)}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #D4DCFF'
              }}>
                <p style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1E4DD7'
                }}>Share Your Profile 🔗</p>
                <p style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  color: '#6B7280',
                  lineHeight: '1.5',
                  fontFamily: '"Inter", sans-serif'
                }}>japalearn.ai/u/adaeze-okafor</p>
                <p style={{
                  margin: '0 0 12px',
                  fontSize: '12px',
                  color: '#4D4D56',
                  lineHeight: '1.5'
                }}>Your profile shows your readiness score, pathway & progress. Share it and earn when friends join JapaLearn.</p>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0px 4px 14px rgba(30,77,215,0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                  <span>Share Your Profile</span>
                </button>
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <h2 style={{
                  margin: '0 0 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Account Settings</h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {['Change Password', 'Notification Preferences', 'Privacy Settings', 'Delete Account'].map((setting, si) => <button key={setting} style={{
                    padding: '11px 14px',
                    background: si === 3 ? '#FFF5F7' : '#FAFBFF',
                    border: `1px solid ${si === 3 ? '#FDD' : '#F0F2FF'}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: si === 3 ? '#EF4369' : '#4D4D56',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {setting}
                  </button>)}
                </div>
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.05)'
              }}>
                <h2 style={{
                  margin: '0 0 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Display Preferences</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#18181B',
                      fontFamily: '"DM Sans", sans-serif'
                    }}>Dark Mode</p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#6B7280',
                      lineHeight: 1.55,
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      {darkRequested ? isDarkMode ? 'Dark mode is active.' : 'Light mode active.' : 'Switch to a darker theme.'}
                    </p>
                  </div>
                  <button onClick={handleDarkToggle} aria-pressed={isDarkMode} aria-label="Toggle dark mode" style={{
                    width: '44px',
                    height: '26px',
                    borderRadius: '13px',
                    background: isDarkMode ? '#1E4DD7' : '#E5E7EB',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isDarkMode ? 'flex-end' : 'flex-start',
                    transition: 'background 0.2s ease',
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.18)'
                    }} />
                  </button>
                </div>
              </div>
              <button onClick={handleSignOut} style={{
                width: '100%',
                padding: '13px',
                background: '#FFF5F7',
                border: '1.5px solid #FBBCC8',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#EF4369',
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <IconSignOut size={15} color="#EF4369" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>}
        </div>}

      </main>

      {/* Mobile bottom nav bar */}
      <nav aria-label="Bottom navigation" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#FFFFFF',
        borderTop: '1px solid #ECEEFF',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 50,
        boxShadow: '0px -4px 20px rgba(30,77,215,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {MOBILE_NAV_ITEMS.map(item => {
          const isActive = activeView === item.id;
          return <button key={item.id} onClick={() => setActiveView(item.id)} aria-current={isActive ? 'page' : undefined} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
            padding: '6px 4px'
          }}>
            <div style={{
              width: '36px',
              height: '28px',
              borderRadius: '10px',
              background: isActive ? '#EBF1FF' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s'
            }}>
              <NavIcon iconKey={item.iconKey} size={isActive ? 19 : 17} color={isActive ? '#1E4DD7' : '#9CA3AF'} />
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 700 : 400,
              color: isActive ? '#1E4DD7' : '#9CA3AF',
              lineHeight: 1
            }}>{item.label}</span>
          </button>;
        })}
      </nav>
    </div>;
  }

  // ─── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  return <div style={{
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    background: '#F7F9FF',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box'
  }}>

      {/* ── SIDEBAR ── */}
      <nav aria-label="Main navigation" style={{
      width: '260px',
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #ECEEFF',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 50
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 20px 16px',
        borderBottom: '1px solid #F0F2FF'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            <JapaLearnLogo size={34} />
            <BrandWordmark size={17} />
          </div>
        </div>

        <div style={{
        margin: '12px 12px 4px',
        background: 'linear-gradient(135deg, #F4F7FF 0%, #EBF1FF 100%)',
        borderRadius: '14px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '1px solid #E0E8FF',
        cursor: 'pointer'
      }} onClick={() => setActiveView('profile')}>
          <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }} aria-hidden="true">
            <span style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700
          }}>A</span>
          </div>
          <div style={{
          minWidth: 0
        }}>
            <p style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 700,
            color: '#18181B',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>Adaeze Okafor</p>
            <p style={{
            margin: 0,
            fontSize: '11px',
            color: '#3B75FF',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
              <IconFlag size={11} color="#3B75FF" strokeWidth={2} />
              <span>UK Pathway · Free Plan</span>
            </p>
          </div>
        </div>

        <div style={{
        flex: 1,
        padding: '8px 10px',
        overflowY: 'auto'
      }}>
          {NAV_GROUPS.map(group => <div key={group.groupLabel} style={{
          marginBottom: '4px'
        }}>
              <p style={{
            margin: '14px 0 5px 10px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#B0B4C4',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>{group.groupLabel}</p>
              <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }} role="menu">
                {group.items.map(item => {
              const isActive = activeView === item.id;
              const iconColor = isActive ? '#1E4DD7' : '#6B7280';
              const isPreview = !!item.badge;
              return <li key={item.id} role="none">
                      <button role="menuitem" aria-current={isActive ? 'page' : undefined} onClick={() => setActiveView(item.id)} style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '11px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #EBF1FF 0%, #E0EAFF 100%)' : 'transparent',
                  color: isActive ? '#1E4DD7' : '#4D4D56',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(30,77,215,0.12)' : 'none'
                }} onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = '#F4F6FF';
                }} onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}>
                        <span style={{
                    width: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                          <NavIcon iconKey={item.iconKey} size={17} color={iconColor} />
                        </span>
                        <span style={{
                    flex: 1
                  }}>{item.label}</span>
                        {isPreview && <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#7C6AF7',
                    background: '#F0EEFF',
                    border: '1px solid #DDD6FE',
                    padding: '2px 7px',
                    borderRadius: '6px',
                    flexShrink: 0
                  }}>PREVIEW</span>}
                        {isActive && !isPreview && <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#1E4DD7',
                    flexShrink: 0
                  }} aria-hidden="true" />}
                      </button>
                    </li>;
            })}
              </ul>
            </div>)}
        </div>

        <div style={{
        padding: '12px 10px 20px',
        borderTop: '1px solid #F0F2FF'
      }}>
          <button onClick={handleSignOut} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '11px',
          border: 'none',
          background: 'transparent',
          color: '#A0A3AB',
          fontSize: '14px',
          fontWeight: 400,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          fontFamily: '"Inter", sans-serif',
          transition: 'all 0.15s'
        }} onMouseEnter={e => {
          e.currentTarget.style.background = '#FFF0F3';
          e.currentTarget.style.color = '#EF4369';
        }} onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#A0A3AB';
        }}>
            <span style={{
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
              <IconSignOut size={17} color="currentColor" />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }}>
        <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #ECEEFF',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            <NavIcon iconKey={currentNavItem?.iconKey ?? 'home'} size={18} color="#18181B" />
            <p style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: '#18181B',
            fontFamily: '"DM Sans", sans-serif'
          }}>
              {currentNavItem?.label ?? 'Dashboard'}
            </p>
            {currentNavItem?.badge && <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#7C6AF7',
            background: '#F0EEFF',
            border: '1px solid #DDD6FE',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>PREVIEW MODE</span>}
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            <button style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #ECEEFF',
            background: '#FAFBFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }} aria-label="Notifications">
              <IconBell size={16} color="#6B7280" strokeWidth={1.75} />
            </button>
            <div style={{
            background: '#EBF1FF',
            borderRadius: '20px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
              <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#1E4DD7'
            }}>72% Ready</span>
              <div style={{
              width: '48px',
              height: '5px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
                <div style={{
                width: '72%',
                height: '100%',
                background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                borderRadius: '3px'
              }} />
              </div>
            </div>
            <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9BB3FF 0%, #3B75FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }} onClick={() => setActiveView('profile')} aria-label="View profile">
              <span style={{
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700
            }}>A</span>
            </div>
          </div>
        </header>

        <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '28px 28px 40px',
        boxSizing: 'border-box'
      }}>

          {/* ── HOME ── */}
          {activeView === 'home' && <div style={{
          maxWidth: '960px'
        }}>

              {/* ── Greeting Header ── */}
              <div style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
                <div>
                  <p style={{
                margin: '0 0 5px',
                fontSize: '12px',
                color: '#A0A3AB',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.07em'
              }}>
                    <IconCalendar size={12} color="#A0A3AB" strokeWidth={1.75} />
                    <span>Monday, April 14 · UK Skilled Worker Pathway</span>
                  </p>
                  <h1 style={{
                margin: '0 0 5px',
                fontSize: '30px',
                fontWeight: 800,
                color: '#18181B',
                letterSpacing: '-0.8px',
                fontFamily: '"DM Sans", sans-serif',
                lineHeight: 1.1
              }}>
                    Good morning, Adaeze 👋
                  </h1>
                  <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: 1.5
              }}>
                    You're <strong style={{
                  color: '#F59A0A'
                }}>72% ready</strong> for UK migration — 4 actions need your attention today.
                  </p>
                </div>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}>
                  <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FFFFFF',
                border: '1.5px solid #E4E8FF',
                borderRadius: '14px',
                padding: '10px 16px',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.04)',
                minWidth: '260px'
              }}>
                    <IconSearch size={15} color="#B0B4C4" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules, visa info, resources..." style={{
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
                  padding: 0,
                  color: '#B0B4C4',
                  fontSize: '16px',
                  lineHeight: 1
                }}>×</button>}
                  </div>
                </div>
              </div>

              {/* ── Hero Readiness Banner ── */}
              <div style={{
            background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 45%, #3B75FF 80%, #6094FF 100%)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '20px',
            boxShadow: '0px 20px 60px rgba(30,77,215,0.32)',
            overflow: 'hidden'
          }} role="region" aria-label="Migration readiness overview">
                <div style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '32px',
              flexWrap: 'wrap'
            }}>
                  {/* Score column */}
                  <div style={{
                flex: 1,
                minWidth: '200px'
              }}>
                    <p style={{
                  margin: '0 0 8px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                      <IconTarget size={11} color="rgba(255,255,255,0.6)" />
                      <span>Migration Readiness</span>
                    </p>
                    <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '10px',
                  marginBottom: '14px'
                }}>
                      <p style={{
                    margin: 0,
                    fontSize: '56px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-3px',
                    fontFamily: '"DM Sans", sans-serif',
                    lineHeight: 1
                  }}>72</p>
                      <div style={{
                    paddingBottom: '8px'
                  }}>
                        <span style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)'
                    }}>%</span>
                        <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.55)',
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}>Moderate</p>
                      </div>
                    </div>
                    <div style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '10px',
                  maxWidth: '240px'
                }} role="progressbar" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}>
                      <div style={{
                    width: '72%',
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.7), #FFFFFF)',
                    borderRadius: '4px'
                  }} />
                    </div>
                    <p style={{
                  margin: '0 0 18px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)'
                }}>UK Skilled Worker Visa · Healthcare Sector</p>
                    <button onClick={() => setActiveView('learning')} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1E4DD7',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0px 6px 20px rgba(0,0,0,0.18)'
                }}>
                      <span>Continue Learning</span>
                      <IconArrowRight size={14} color="#1E4DD7" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                flexShrink: 0,
                alignSelf: 'stretch'
              }} aria-hidden="true" />

                  {/* Score tags column */}
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
                minWidth: '160px'
              }}>
                    <p style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>Score by Area</p>
                    {READINESS_TAGS.map(tag => <div key={tag.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                      <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}>
                        {tag.status === 'ok' && <IconCheckCircle size={15} color="#4ADE80" strokeWidth={2} />}
                        {tag.status === 'warn' && <IconAlertTriangle size={15} color="#FCD34D" strokeWidth={2} />}
                        {tag.status === 'bad' && <IconXCircle size={15} color="#F87171" strokeWidth={2} />}
                      </span>
                      <span style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 500
                  }}>{tag.label}</span>
                      <span style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    color: tag.status === 'ok' ? '#4ADE80' : tag.status === 'warn' ? '#FCD34D' : '#F87171',
                    fontWeight: 700
                  }}>
                        {tag.status === 'ok' ? 'Strong' : tag.status === 'warn' ? 'Needs work' : 'Urgent'}
                      </span>
                    </div>)}
                  </div>

                  {/* Divider */}
                  <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                flexShrink: 0,
                alignSelf: 'stretch'
              }} aria-hidden="true" />

                  {/* Quick stats column */}
                  <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                alignContent: 'center'
              }}>
                    {STAT_CARDS.map(card => <div key={card.id} style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  minWidth: '90px'
                }}>
                      <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }} aria-hidden="true">
                        <StatIcon iconKey={card.iconKey} color="rgba(255,255,255,0.85)" />
                      </div>
                      <p style={{
                    margin: '0 0 1px',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '-0.5px',
                    lineHeight: 1
                  }}>{card.value}</p>
                      <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.55)',
                    fontWeight: 500,
                    lineHeight: 1.3
                  }}>{card.label}</p>
                    </div>)}
                  </div>
                </div>
              </div>

              {/* ── Today's Priority Actions ── */}
              <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px 24px',
            marginBottom: '16px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 16px rgba(30,77,215,0.06)'
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
                  <h2 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                    <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} aria-hidden="true">
                      <IconFlame size={13} color="#FFFFFF" strokeWidth={2.5} />
                    </span>
                    <span>Today's Priority Actions</span>
                  </h2>
                  <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#EF4369',
                background: '#FDECEC',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>4 pending</span>
                </div>
                <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px'
            }}>
                  {[{
                icon: 'target' as const,
                title: 'Book IELTS Test',
                desc: 'Slots fill fast — register now',
                color: '#EF4369',
                bg: '#FDECEC',
                urgent: true,
                action: () => setActiveView('resources')
              }, {
                icon: 'filecheck' as const,
                title: 'Upload IELTS Certificate',
                desc: 'Missing required document',
                color: '#F59A0A',
                bg: '#FFF7E6',
                urgent: false,
                action: () => setActiveView('documents')
              }, {
                icon: 'book' as const,
                title: 'Continue Module 01',
                desc: 'Salary Thresholds lesson next',
                color: '#3B75FF',
                bg: '#EBF1FF',
                urgent: false,
                action: () => {
                  setActiveView('learning');
                  setCurriculumRequested(true);
                }
              }, {
                icon: 'flame' as const,
                title: 'Maintain 12-day streak',
                desc: 'Complete 1 lesson today',
                color: '#21C474',
                bg: '#E8F9EE',
                urgent: false,
                action: () => {
                  setActiveView('learning');
                  setCurriculumRequested(true);
                }
              }].map(item => <button key={item.title} onClick={item.action} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                background: item.urgent ? `linear-gradient(135deg, ${item.bg}, #fff)` : '#FAFBFF',
                borderRadius: '14px',
                border: `1.5px solid ${item.urgent ? item.color + '44' : '#F0F2FF'}`,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: '"Inter", sans-serif',
                transition: 'all 0.15s',
                width: '100%'
              }} onMouseEnter={e => {
                e.currentTarget.style.borderColor = item.color + '66';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0px 6px 20px ${item.color}22`;
              }} onMouseLeave={e => {
                e.currentTarget.style.borderColor = item.urgent ? item.color + '44' : '#F0F2FF';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                      <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }} aria-hidden="true">
                        <StatIcon iconKey={item.icon} color={item.color} />
                      </div>
                      <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                        <p style={{
                    margin: '0 0 2px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#18181B',
                    lineHeight: 1.3
                  }}>{item.title}</p>
                        <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#82858A',
                    lineHeight: 1.4
                  }}>{item.desc}</p>
                      </div>
                      {item.urgent && <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: item.color,
                  background: item.bg,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  flexShrink: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '1px'
                }}>Urgent</span>}
                    </button>)}
                </div>
              </div>

              {/* ── Two-column body ── */}
              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '16px',
            alignItems: 'start'
          }}>

                {/* LEFT column */}
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>

                  {/* Score Breakdown */}
                  <section aria-label="Score breakdown" style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '22px 24px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
              }}>
                    <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px'
                }}>
                      <h2 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#18181B',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>Readiness Score Breakdown</h2>
                      <button onClick={() => setActiveView('roadmap')} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#3B75FF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}>
                        <span>View Roadmap</span>
                        <IconArrowRight size={12} color="#3B75FF" />
                      </button>
                    </div>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                      {SCORE_CATEGORIES.map(cat => <div key={cat.id}>
                        <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                          <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                            <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '7px',
                          background: cat.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                              {cat.status === 'ok' && <IconCheckCircle size={13} color={cat.color} strokeWidth={2} />}
                              {cat.status === 'warn' && <IconAlertTriangle size={13} color={cat.color} strokeWidth={2} />}
                              {cat.status === 'bad' && <IconXCircle size={13} color={cat.color} strokeWidth={2} />}
                            </div>
                            <span style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#2D2D35'
                        }}>{cat.label}</span>
                          </div>
                          <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                            <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: cat.color,
                          padding: '2px 8px',
                          background: cat.bg,
                          borderRadius: '20px'
                        }}>
                              {cat.status === 'ok' ? 'Strong' : cat.status === 'warn' ? 'Improve' : 'Urgent'}
                            </span>
                            <span style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#18181B',
                          minWidth: '36px',
                          textAlign: 'right'
                        }}>{cat.score}%</span>
                          </div>
                        </div>
                        <div style={{
                      height: '7px',
                      background: '#F0F2FF',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                          <div style={{
                        width: `${cat.score}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})`,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} />
                        </div>
                      </div>)}
                    </div>
                  </section>

                </div>

                {/* RIGHT column */}
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>

                  {/* Recent Activity */}
                  <section aria-label="Recent activity" style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '18px 20px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
              }}>
                    <h2 style={{
                  margin: '0 0 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Recent Activity</h2>
                    <ul style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0'
                }}>
                      {ACTIVITIES.map((activity, idx) => <li key={activity.id} style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '9px 0',
                    borderBottom: idx < ACTIVITIES.length - 1 ? '1px solid #F4F6FF' : 'none',
                    alignItems: 'center'
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
                    }} aria-hidden="true">
                          <ActivityIcon iconKey={activity.iconKey} />
                        </div>
                        <div style={{
                      flex: 1,
                      minWidth: 0
                    }}>
                          <p style={{
                        margin: '0 0 1px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#18181B',
                        lineHeight: '1.4'
                      }}>{activity.title}</p>
                          <p style={{
                        margin: 0,
                        fontSize: '10px',
                        color: '#B0B4C4'
                      }}>{activity.time}</p>
                        </div>
                      </li>)}
                    </ul>
                  </section>

                </div>
              </div>
            </div>}

          {/* ── CURRICULUM / LEARNING ── */}
          {activeView === 'learning' && <div style={{
          maxWidth: '820px'
        }}>
              {curriculumLoading ? <div>
                  <div style={{
              marginBottom: '28px'
            }}>
                    <h1 style={{
                margin: '0 0 4px',
                fontSize: '26px',
                fontWeight: 800,
                color: '#18181B',
                letterSpacing: '-0.6px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Building your curriculum…</h1>
                    <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#82858A',
                lineHeight: '1.6'
              }}>AI is analysing your readiness score, visa type, and profile — personalising every module for you.</p>
                  </div>
                  <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
              borderRadius: '20px',
              padding: '28px 32px',
              marginBottom: '20px',
              boxShadow: '0px 12px 40px rgba(30,77,215,0.28)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
                    <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                animation: 'skeletonPulse 1.4s ease-in-out infinite'
              }}>
                      <IconLearning size={24} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
                    </div>
                    <div style={{
                flex: 1
              }}>
                      <p style={{
                  margin: '0 0 6px',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.3px'
                }}>Generating your personalised curriculum</p>
                      <p style={{
                  margin: '0 0 14px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.5'
                }}>Matching modules to your UK Skilled Worker profile, readiness gaps, and language status…</p>
                      <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                        <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.95), rgba(255,255,255,0.4))',
                    borderRadius: '3px',
                    animation: 'skeletonSweep 1.8s ease-in-out infinite',
                    backgroundSize: '300px 100%',
                    width: '100%'
                  }} />
                      </div>
                    </div>
                    <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '6px',
                flexShrink: 0
              }}>
                      {[{
                  label: 'Modules',
                  delay: '0s'
                }, {
                  label: 'Lessons',
                  delay: '0.2s'
                }, {
                  label: 'Progress',
                  delay: '0.4s'
                }].map(item => <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                          <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    animation: `skeletonPulse 1.4s ease-in-out ${item.delay} infinite`
                  }} />
                          <span style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 500
                  }}>{item.label}</span>
                        </div>)}
                    </div>
                  </div>
                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
                    {[{
                titleWidth: '55%',
                delay: '0s',
                lessons: 4
              }, {
                titleWidth: '70%',
                delay: '0.12s',
                lessons: 3
              }, {
                titleWidth: '40%',
                delay: '0.24s',
                lessons: 2
              }, {
                titleWidth: '60%',
                delay: '0.36s',
                lessons: 5
              }].map((item, idx) => <div key={idx} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #F0F2FF',
                overflow: 'hidden',
                boxShadow: '0px 2px 8px rgba(30,77,215,0.04)'
              }}>
                        <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px'
                }}>
                          <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(90deg, #EEF1FF 25%, #E0E6FF 50%, #EEF1FF 75%)',
                    backgroundSize: '400px 100%',
                    flexShrink: 0,
                    animation: `skeletonShimmer 1.6s ease-in-out ${item.delay} infinite`
                  }} />
                          <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                            <div style={{
                      width: item.titleWidth,
                      height: '17px',
                      background: 'linear-gradient(90deg, #EEF1FF 25%, #E0E6FF 50%, #EEF1FF 75%)',
                      backgroundSize: '400px 100%',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      animation: `skeletonShimmer 1.6s ease-in-out ${item.delay} infinite`
                    }} />
                            <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                              <div style={{
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #EEF1FF 25%, #E0E6FF 50%, #EEF1FF 75%)',
                        backgroundSize: '400px 100%',
                        borderRadius: '2px',
                        animation: `skeletonShimmer 1.6s ease-in-out ${item.delay} infinite`
                      }} />
                              <div style={{
                        width: '40px',
                        height: '14px',
                        background: 'linear-gradient(90deg, #EEF1FF 25%, #E0E6FF 50%, #EEF1FF 75%)',
                        backgroundSize: '400px 100%',
                        borderRadius: '20px',
                        animation: `skeletonShimmer 1.6s ease-in-out ${item.delay} infinite`
                      }} />
                            </div>
                          </div>
                          <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#EEF1FF',
                    flexShrink: 0
                  }} />
                        </div>
                      </div>)}
                  </div>
                </div> : !curriculumRequested ? <div>
                  <div style={{
              marginBottom: '32px'
            }}>
                    <h1 style={{
                margin: 0,
                fontSize: '26px',
                fontWeight: 800,
                color: '#18181B',
                letterSpacing: '-0.6px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Your AI Curriculum</h1>
                    <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#82858A',
                lineHeight: '1.6'
              }}>Personalised, structured and built specifically for your migration profile — generated in seconds.</p>
                  </div>
                  <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
              borderRadius: '22px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0px 16px 48px rgba(30,77,215,0.3)'
            }}>
                    <p style={{
                margin: '0 0 8px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>What you'll get</p>
                    <h2 style={{
                margin: '0 0 20px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                lineHeight: 1.3,
                letterSpacing: '-0.4px'
              }}>A complete UK migration learning path, built around your profile</h2>
                    <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
              }}>
                      {CURRICULUM_PROMISES.map(item => <div key={item.title} style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)'
                }}>
                          <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }} aria-hidden="true">
                            {item.iconKey === 'book' && <IconBook size={16} color="#FFFFFF" strokeWidth={2} />}
                            {item.iconKey === 'target' && <IconTarget size={16} color="#FFFFFF" strokeWidth={2} />}
                            {item.iconKey === 'flame' && <IconFlame size={16} color="#FFFFFF" strokeWidth={2} />}
                            {item.iconKey === 'lock' && <IconLock size={16} color="#FFFFFF" strokeWidth={2} />}
                          </div>
                          <p style={{
                    margin: '0 0 4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>{item.title}</p>
                          <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: '1.4'
                  }}>{item.desc}</p>
                        </div>)}
                    </div>
                    <button onClick={handleGenerateCurriculum} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                background: '#FFFFFF',
                color: '#1E4DD7',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0px 8px 24px rgba(0,0,0,0.2)'
              }}>
                      <IconLearning size={18} color="#1E4DD7" strokeWidth={2} />
                      <span>Generate My Curriculum</span>
                      <IconArrowRight size={16} color="#1E4DD7" />
                    </button>
                  </div>
                  <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #F0F2FF',
              boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
            }}>
                    <h3 style={{
                margin: '0 0 14px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Your curriculum will be based on</h3>
                    <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                      {['UK Skilled Worker Visa', 'Nigerian Applicant', 'Healthcare Sector', '72% Readiness', 'IELTS Pending', 'Financial Proof ✓'].map(tag => <span key={tag} style={{
                  padding: '6px 14px',
                  background: '#F4F6FF',
                  border: '1px solid #E0E8FF',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#3B75FF'
                }}>{tag}</span>)}
                    </div>
                  </div>
                </div> : <div>
                  <div style={{
              background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 100%)',
              borderRadius: '20px',
              padding: '24px 28px',
              marginBottom: '24px',
              boxShadow: '0px 10px 36px rgba(30,77,215,0.28)'
            }}>
                    <p style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>Your Learning Path</p>
                    <h1 style={{
                margin: '0 0 8px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px'
              }}>UK Skilled Worker Visa — Complete Programme</h1>
                    <p style={{
                margin: '0 0 18px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6'
              }}>After completing this curriculum you will be able to: confidently apply for a UK Skilled Worker Visa, understand all eligibility criteria, prepare every document, pass IELTS with a 7.0+ band, and manage your finances for the application.</p>
                    <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                      {[{
                  val: '4',
                  label: 'Modules'
                }, {
                  val: '14',
                  label: 'Lessons'
                }, {
                  val: '~90 min',
                  label: 'Total Time'
                }, {
                  val: '34%',
                  label: 'Complete'
                }].map(s => <div key={s.label} style={{
                  padding: '13px 14px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E0E8FF',
                  boxShadow: '0px 2px 8px rgba(30,77,215,0.04)'
                }}>
                          <p style={{
                    margin: '0 0 1px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1E4DD7'
                  }}>{s.label}</p>
                          <p style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#18181B'
                  }}>{s.val}</p>
                        </div>)}
                    </div>
                  </div>

                  <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '20px 24px',
              marginBottom: '20px',
              boxShadow: '0px 2px 12px rgba(30,77,215,0.05)',
              border: '1px solid #F0F2FF'
            }}>
                    <h2 style={{
                margin: '0 0 16px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Overall Progress</h2>
                    <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                      <div style={{
                  flex: 1
                }}>
                        <p style={{
                    margin: '0 0 4px',
                    fontSize: '12px',
                    color: '#82858A',
                    fontWeight: 500
                  }}>Progress</p>
                        <p style={{
                    margin: '0 0 8px',
                    fontSize: '30px',
                    fontWeight: 800,
                    color: '#18181B',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '-1px'
                  }}>34%</p>
                        <div style={{
                    height: '6px',
                    background: '#F0F2FF',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                          <div style={{
                      width: '34%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                      borderRadius: '3px'
                    }} />
                        </div>
                      </div>
                      <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '6px'
                }}>
                        <span style={{
                    padding: '6px 14px',
                    background: '#EBF1FF',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#1E4DD7'
                  }}>4 Modules · 14 Lessons</span>
                        <button onClick={() => setExpandedModule('m1')} style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                          View Modules
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
                    {MODULES.map(mod => {
                const isOpen = expandedModule === mod.id;
                return <div key={mod.id} style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1.5px solid ${isOpen ? '#B3C5FF' : '#F0F2FF'}`,
                  boxShadow: isOpen ? '0px 4px 20px rgba(30,77,215,0.08)' : '0px 2px 8px rgba(30,77,215,0.04)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}>
                          <button onClick={() => handleToggleModule(mod.id)} style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                            <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: mod.progress > 0 ? 'linear-gradient(135deg, #EBF1FF, #D8E6FF)' : '#F4F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }} aria-hidden="true">
                              <span style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: mod.progress > 0 ? '#1E4DD7' : '#B0B4C4',
                        fontFamily: '"DM Sans", sans-serif'
                      }}>{mod.moduleNum}</span>
                            </div>
                            <div style={{
                      flex: 1,
                      minWidth: 0
                    }}>
                              <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '5px'
                      }}>
                                <p style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#18181B'
                        }}>{mod.title}</p>
                                <span style={{
                          padding: '2px 9px',
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 700,
                          flexShrink: 0,
                          background: mod.tagBg,
                          color: mod.tagColor
                        }}>{mod.tag}</span>
                              </div>
                              <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                                <p style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#82858A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                                  <IconBook size={12} color="#82858A" strokeWidth={1.75} />
                                  <span>{mod.lessons.length} lessons</span>
                                </p>
                                <span style={{
                          color: '#D0D4E0',
                          fontSize: '12px'
                        }}>·</span>
                                <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flex: 1
                        }}>
                                  <div style={{
                            flex: 1,
                            height: '4px',
                            background: '#EEF0FF',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            maxWidth: '100px'
                          }}>
                                    <div style={{
                              width: `${mod.progress}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #1E4DD7, #3B75FF)',
                              borderRadius: '2px'
                            }} />
                                  </div>
                                  <span style={{
                            fontSize: '11px',
                            color: '#82858A',
                            fontWeight: 600
                          }}>{mod.progress}%</span>
                                </div>
                              </div>
                            </div>
                            <span style={{
                      color: '#B0B4C4',
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0
                    }}>
                              <IconChevronDown size={18} color="#B0B4C4" />
                            </span>
                          </button>

                          {isOpen && <div style={{
                    borderTop: '1px solid #F4F6FF'
                  }}>
                              <ul style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: '8px 16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                                {mod.lessons.map((lesson, lessonIdx) => <li key={lesson.id}>
                                    <button onClick={() => handleOpenLesson(lesson.id)} style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '11px 12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: '"Inter", sans-serif',
                          transition: 'background 0.15s'
                        }} onMouseEnter={e => e.currentTarget.style.background = '#F4F6FF'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                      <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: lesson.done ? 'linear-gradient(135deg, #21C474, #10B981)' : '#F0F2FF',
                            border: lesson.done ? 'none' : '2px solid #E0E4F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                                        {lesson.done ? <IconCheck size={14} color="#FFFFFF" strokeWidth={2.5} /> : <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#B0B4C4'
                            }}>{lessonIdx + 1}</span>}
                                      </div>
                                      <div style={{
                            flex: 1,
                            minWidth: 0
                          }}>
                                        <p style={{
                              margin: 0,
                              fontSize: '14px',
                              fontWeight: lesson.done ? 500 : 600,
                              color: lesson.done ? '#82858A' : '#18181B',
                              textDecoration: lesson.done ? 'line-through' : 'none'
                            }}>{lesson.title}</p>
                                      </div>
                                      <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0
                          }}>
                                        <span style={{
                              fontSize: '11px',
                              color: '#B0B4C4',
                              fontWeight: 500
                            }}>{lesson.duration}</span>
                                        <span style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '8px',
                              background: lesson.done ? '#E8F9EE' : '#EBF1FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                                          {lesson.done ? <IconCheck size={12} color="#21C474" strokeWidth={2.5} /> : <IconPlay size={11} color="#3B75FF" />}
                                        </span>
                                      </div>
                                    </button>
                                  </li>)}
                              </ul>
                              <div style={{
                      padding: '0 16px 16px'
                    }}>
                                <button onClick={() => handleOpenLesson(mod.lessons.find(l => !l.done)?.id ?? mod.lessons[0].id)} style={{
                        width: '100%',
                        padding: '12px',
                        background: mod.progress > 0 ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#F0F2FF',
                        color: mod.progress > 0 ? '#FFFFFF' : '#82858A',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: '"Inter", sans-serif',
                        boxShadow: mod.progress > 0 ? '0px 4px 16px rgba(30,77,215,0.28)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                                  <span>{mod.progress === 0 ? 'Start Module' : mod.progress === 100 ? 'Review Module' : 'Continue Module'}</span>
                                  <IconArrowRight size={14} color={mod.progress > 0 ? '#FFFFFF' : '#82858A'} />
                                </button>
                              </div>
                            </div>}
                        </div>;
              })}
                  </div>
                </div>}
            </div>}

          {/* ── ROADMAP ── */}
          {activeView === 'roadmap' && <div style={{
          maxWidth: '700px'
        }}>
              <div style={{
            marginBottom: '24px'
          }}>
                <p style={{
              margin: '0 0 4px',
              fontSize: '13px',
              color: '#82858A',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
                  <IconCalendar size={13} color="#82858A" strokeWidth={1.75} />
                  <span>UK Skilled Worker Visa · 18-Week Plan</span>
                </p>
                <h1 style={{
              margin: '0 0 4px',
              fontSize: '26px',
              fontWeight: 700,
              color: '#18181B',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif'
            }}>My Roadmap</h1>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A'
            }}>Your personalised week-by-week migration plan. Click any milestone to see your action steps.</p>
              </div>

              {/* Hero Progress Banner */}
              <div style={{
            background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)',
            borderRadius: '22px',
            padding: '28px 28px 0',
            marginBottom: '20px',
            boxShadow: '0px 16px 48px rgba(30,77,215,0.28)',
            overflow: 'hidden'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              paddingBottom: '24px',
              flexWrap: 'wrap'
            }}>
                  <div style={{
                flex: 1,
                minWidth: '160px'
              }}>
                    <p style={{
                  margin: '0 0 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase'
                }}>Current Phase</p>
                    <p style={{
                  margin: '0 0 2px',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.5px'
                }}>Language Prep</p>
                    <p style={{
                  margin: '0 0 18px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)'
                }}>Week 5–6 · Book IELTS & start preparation</p>
                    <div style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  maxWidth: '280px'
                }}>
                      <div style={{
                    width: '33%',
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)',
                    borderRadius: '4px'
                  }} />
                    </div>
                    <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.55)'
                }}>2 of 6 milestones completed · 33% done</p>
                  </div>
                  <div style={{
                display: 'flex',
                gap: '10px',
                flexShrink: 0,
                flexWrap: 'wrap'
              }}>
                    {[{
                  val: '16',
                  label: 'Weeks left'
                }, {
                  val: '33%',
                  label: 'Complete'
                }, {
                  val: '4',
                  label: 'Actions due'
                }].map(stat => <div key={stat.label} style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.14)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  minWidth: '72px'
                }}>
                        <p style={{
                    margin: '0 0 2px',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{stat.val}</p>
                        <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap'
                  }}>{stat.label}</p>
                      </div>)}
                  </div>
                </div>
                {/* Phase strip */}
                <div style={{
              display: 'flex',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              gap: '0'
            }}>
                  {['Foundation', 'Language', 'Employment', 'Application', 'Relocation'].map((phase, pi) => {
                const isActive = phase === 'Language';
                const isDone = pi < 1;
                return <div key={phase} style={{
                  flex: 1,
                  padding: '10px 8px',
                  textAlign: 'center',
                  borderRight: pi < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}>
                        <p style={{
                    margin: 0,
                    fontSize: '10px',
                    fontWeight: isActive ? 700 : 500,
                    color: isDone ? 'rgba(255,255,255,0.9)' : isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.04em'
                  }}>{phase}</p>
                        {isActive && <div style={{
                    width: '20px',
                    height: '3px',
                    background: '#FFFFFF',
                    borderRadius: '2px',
                    margin: '4px auto 0'
                  }} />}
                        {isDone && <p style={{
                    margin: '2px 0 0',
                    fontSize: '9px',
                    color: '#4ADE80',
                    fontWeight: 700
                  }}>✓ Done</p>}
                      </div>;
              })}
                </div>
              </div>

              {/* Timeline */}
              <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0px 2px 16px rgba(30,77,215,0.06)',
            border: '1px solid #F0F2FF'
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px'
            }}>
                  <h2 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Milestone Timeline</h2>
                  <span style={{
                fontSize: '12px',
                color: '#82858A'
              }}>Tap a milestone to expand action steps</span>
                </div>
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
                  {ROADMAP_MILESTONES.map((milestone, idx) => {
                const isOpen = expandedMilestone === milestone.id;
                return <div key={milestone.id} style={{
                  display: 'flex',
                  gap: '0'
                }}>
                        {/* Timeline spine */}
                        <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '44px',
                    flexShrink: 0
                  }}>
                          {/* Node */}
                          <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: milestone.done ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : milestone.current ? '#FFFFFF' : '#F4F6FF',
                      border: milestone.current ? '2.5px solid #1E4DD7' : milestone.done ? 'none' : '2px solid #E0E4F5',
                      boxShadow: milestone.current ? '0 0 0 4px rgba(30,77,215,0.12)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1,
                      transition: 'all 0.2s'
                    }}>
                            {milestone.done ? <IconCheck size={13} color="#FFFFFF" strokeWidth={2.5} /> : milestone.current ? <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#1E4DD7'
                      }} /> : <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#C0C4D4'
                      }}>{idx + 1}</span>}
                          </div>
                          {/* Connector line */}
                          {idx < ROADMAP_MILESTONES.length - 1 && <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '16px',
                      background: milestone.done ? 'linear-gradient(180deg, #3B75FF, #9BB3FF)' : milestone.current ? 'linear-gradient(180deg, #3B75FF 40%, #E8EBF8 100%)' : '#E8EBF8',
                      margin: '4px 0'
                    }} />}
                        </div>

                        {/* Card */}
                        <div style={{
                    flex: 1,
                    paddingLeft: '12px',
                    paddingBottom: idx < ROADMAP_MILESTONES.length - 1 ? '16px' : '0'
                  }}>
                          <button onClick={() => setExpandedMilestone(isOpen ? null : milestone.id)} style={{
                      width: '100%',
                      background: isOpen ? milestone.current ? 'linear-gradient(135deg, #EBF1FF, #E4EEFF)' : '#FAFBFF' : 'transparent',
                      border: isOpen ? '1.5px solid #D4DCFF' : '1.5px solid transparent',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: '"Inter", sans-serif',
                      transition: 'all 0.18s'
                    }}>
                            <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}>
                              <div style={{
                          flex: 1,
                          minWidth: 0
                        }}>
                                <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px',
                            flexWrap: 'wrap'
                          }}>
                                  <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em'
                            }}>{milestone.week}</span>
                                  <span style={{
                              padding: '2px 8px',
                              background: milestone.done ? '#E8F9EE' : milestone.current ? '#EBF1FF' : '#F4F4F6',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: milestone.done ? '#21C474' : milestone.current ? '#1E4DD7' : '#B0B4C4'
                            }}>{milestone.phase}</span>
                                  {milestone.current && <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 8px',
                              background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#FFFFFF'
                            }}>
                                      <IconFlag size={9} color="#FFFFFF" />
                                      <span>You are here</span>
                                    </span>}
                                  {milestone.done && <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 8px',
                              background: '#E8F9EE',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#21C474'
                            }}>
                                      <IconCheck size={9} color="#21C474" strokeWidth={2.5} />
                                      <span>Completed</span>
                                    </span>}
                                </div>
                                <p style={{
                            margin: '0 0 3px',
                            fontSize: '14px',
                            fontWeight: milestone.current ? 700 : milestone.done ? 500 : 600,
                            color: milestone.done ? '#82858A' : '#18181B',
                            textDecoration: milestone.done ? 'line-through' : 'none',
                            lineHeight: '1.3'
                          }}>{milestone.title}</p>
                                <p style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#82858A',
                            lineHeight: '1.5'
                          }}>{milestone.desc}</p>
                              </div>
                              <span style={{
                          color: '#B0B4C4',
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          flexShrink: 0
                        }}>
                                <IconChevronDown size={16} color="#B0B4C4" />
                              </span>
                            </div>

                            {isOpen && <div style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(30,77,215,0.1)'
                      }}>
                                <p style={{
                          margin: '0 0 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#82858A',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}>Action Steps</p>
                                <ul style={{
                          margin: 0,
                          padding: 0,
                          listStyle: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                                  {milestone.actions.map((action, ai) => <li key={ai} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            background: milestone.done ? '#F8FFF9' : milestone.current ? '#F0F5FF' : '#FAFBFF',
                            borderRadius: '10px',
                            border: `1px solid ${milestone.done ? '#D8F5E6' : milestone.current ? '#D4DCFF' : '#ECEEFF'}`
                          }}>
                                      <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: milestone.done ? 'linear-gradient(135deg, #21C474, #10B981)' : milestone.current ? '#EBF1FF' : '#F0F2FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '1px'
                            }}>
                                        {milestone.done ? <IconCheck size={10} color="#FFFFFF" strokeWidth={2.5} /> : <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                color: milestone.current ? '#1E4DD7' : '#B0B4C4'
                              }}>{ai + 1}</span>}
                                      </div>
                                      <span style={{
                              fontSize: '13px',
                              color: milestone.done ? '#6B7280' : '#2D2D35',
                              lineHeight: '1.5',
                              textDecoration: milestone.done ? 'line-through' : 'none'
                            }}>{action}</span>
                                    </li>)}
                                </ul>
                                {milestone.current && <button style={{
                          width: '100%',
                          marginTop: '12px',
                          padding: '11px',
                          background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: '"Inter", sans-serif',
                          boxShadow: '0px 4px 16px rgba(30,77,215,0.28)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '7px'
                        }}>
                                    <span>Work on this milestone</span>
                                    <IconArrowRight size={13} color="#FFFFFF" />
                                  </button>}
                              </div>}
                          </button>
                        </div>
                      </div>;
              })}
                </div>
              </div>

              {/* Next milestone nudge */}
              <div style={{
            background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)',
            borderRadius: '16px',
            padding: '18px 20px',
            marginTop: '14px',
            border: '1px solid #D4DCFF',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
                <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                  <IconTarget size={18} color="#FFFFFF" strokeWidth={1.75} />
                </div>
                <div style={{
              flex: 1
            }}>
                  <p style={{
                margin: '0 0 2px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#1E4DD7'
              }}>Your next priority action</p>
                  <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#4D4D56',
                lineHeight: '1.5'
              }}>Get a detailed roadmap for ₦5,000. This is the basic roadmap.</p>
                </div>
                <button onClick={() => setActiveView('resources')} style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              boxShadow: '0px 4px 14px rgba(30,77,215,0.25)'
            }}>Download Roadmap</button>
              </div>
            </div>}

          {/* ── RESOURCES ── */}
          {activeView === 'resources' && <div style={{
          maxWidth: '760px'
        }}>
              <div style={{
            marginBottom: '20px'
          }}>
                <p style={{
              margin: '0 0 4px',
              fontSize: '13px',
              color: '#82858A',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
                  <IconBook size={13} color="#82858A" strokeWidth={1.75} />
                  <span>Curated for UK Skilled Worker Visa</span>
                </p>
                <h1 style={{
              margin: '0 0 4px',
              fontSize: '26px',
              fontWeight: 700,
              color: '#18181B',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif'
            }}>Resources</h1>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A'
            }}>Templates, checklists, SOP samples &amp; guides — every file is tailored to your UK route.</p>
              </div>

              {/* Featured Banner */}
              <div style={{
            background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 60%, #5C8AFF 100%)',
            borderRadius: '22px',
            padding: '26px 28px',
            marginBottom: '20px',
            boxShadow: '0px 14px 44px rgba(30,77,215,0.26)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
                <div style={{
              flex: 1,
              minWidth: '180px'
            }}>
                  <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                    <IconTarget size={10} color="#FFFFFF" />
                    <span>Featured for You</span>
                  </span>
                  <p style={{
                margin: '0 0 6px',
                fontSize: '19px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.4px',
                lineHeight: 1.3
              }}>IELTS Preparation Roadmap</p>
                  <p style={{
                margin: '0 0 16px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.5'
              }}>A complete 6-week study plan with daily exercises and band score targets — your most urgent resource right now.</p>
                  <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                    <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 20px',
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
                      <IconDownload size={14} color="#1E4DD7" strokeWidth={2} />
                      <span>Download Free</span>
                    </button>
                    <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500
                }}>
                      <IconGuide size={13} color="rgba(255,255,255,0.65)" strokeWidth={1.75} />
                      <span>Guide · 8 pages</span>
                    </span>
                  </div>
                </div>
                <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '22px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                  <IconGuide size={44} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
                </div>
              </div>

              {/* Category filters */}
              <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
                {['All', 'Visa', 'Documents', 'Finance', 'Language', 'Career'].map(cat => <button key={cat} onClick={() => setResourceFilter(cat)} style={{
              padding: '7px 16px',
              background: resourceFilter === cat ? 'linear-gradient(135deg, #1E4DD7, #3B75FF)' : '#FFFFFF',
              border: `1.5px solid ${resourceFilter === cat ? 'transparent' : '#E4E8FF'}`,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: resourceFilter === cat ? 700 : 500,
              color: resourceFilter === cat ? '#FFFFFF' : '#6B7280',
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              boxShadow: resourceFilter === cat ? '0px 4px 12px rgba(30,77,215,0.25)' : '0px 1px 4px rgba(30,77,215,0.06)',
              transition: 'all 0.15s'
            }}>{cat}</button>)}
              </div>

              {/* Resource count */}
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
                  <span>{RESOURCES.filter(r => resourceFilter === 'All' || r.category === resourceFilter).length} resources</span>
                  {resourceFilter !== 'All' && <span style={{
                color: '#3B75FF',
                fontWeight: 600
              }}>{' '}in {resourceFilter}</span>}
                </p>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#82858A'
            }}>
                  <IconDownload size={13} color="#82858A" strokeWidth={1.75} />
                  <span>All resources are free</span>
                </div>
              </div>

              {/* Resource Cards */}
              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
                {RESOURCES.filter(res => resourceFilter === 'All' || res.category === resourceFilter).map(res => <div key={res.id} style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '20px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              boxShadow: '0px 2px 12px rgba(30,77,215,0.05)',
              border: '1px solid #F0F2FF',
              cursor: 'pointer',
              transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s'
            }} onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#B3C5FF';
              e.currentTarget.style.boxShadow = '0px 6px 24px rgba(30,77,215,0.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }} onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#F0F2FF';
              e.currentTarget.style.boxShadow = '0px 2px 12px rgba(30,77,215,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
                    {/* Icon */}
                    <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: res.tagBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1.5px solid ${res.tagColor}22`
              }}>
                      {res.type === 'Checklist' && <IconChecklist size={22} color={res.tagColor} strokeWidth={1.75} />}
                      {res.type === 'Template' && <IconTemplate size={22} color={res.tagColor} strokeWidth={1.75} />}
                      {res.type === 'Guide' && <IconGuide size={22} color={res.tagColor} strokeWidth={1.75} />}
                    </div>

                    {/* Content */}
                    <div style={{
                flex: 1,
                minWidth: 0
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
                }}>
                        <span style={{
                    padding: '3px 9px',
                    background: res.tagBg,
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: res.tagColor
                  }}>{res.tag}</span>
                        <span style={{
                    padding: '3px 9px',
                    background: '#F4F4F6',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#6B7280'
                  }}>{res.category}</span>
                        <span style={{
                    padding: '3px 9px',
                    background: '#F4F4F6',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#6B7280'
                  }}>{res.type}</span>
                      </div>
                      <p style={{
                  margin: '0 0 4px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#18181B',
                  lineHeight: '1.35'
                }}>{res.title}</p>
                      <p style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  color: '#82858A',
                  lineHeight: '1.55'
                }}>{res.desc}</p>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                        <IconDownload size={11} color="#B0B4C4" strokeWidth={2} />
                        <span style={{
                    fontSize: '11px',
                    color: '#B0B4C4',
                    fontWeight: 500
                  }}>{res.pages}</span>
                      </div>
                    </div>

                    {/* Download CTA */}
                    <div style={{
                flexShrink: 0
              }}>
                      <button style={{
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  border: 'none',
                  borderRadius: '11px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0px 4px 14px rgba(30,77,215,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}>
                        <IconDownload size={13} color="#FFFFFF" strokeWidth={2} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>)}
              </div>

              {/* Bottom nudge */}
              <div style={{
            marginTop: '16px',
            padding: '16px 20px',
            background: '#F9FAFF',
            borderRadius: '14px',
            border: '1px dashed #D4DCFF',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
                <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: '#EBF1FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                  <IconBell size={16} color="#3B75FF" strokeWidth={1.75} />
                </div>
                <div style={{
              flex: 1
            }}>
                  <p style={{
                margin: '0 0 1px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#18181B'
              }}>More resources coming soon</p>
                  <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#82858A'
              }}>We add new templates and guides every week — tailored to your pathway stage.</p>
                </div>
              </div>
            </div>}

          {/* ── CONVERSATIONS ── */}
          {activeView === 'conversations' && <div style={{
          maxWidth: '820px'
        }}>
              <div style={{
            marginBottom: '20px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px'
            }}>
                  <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>AI Conversations</h1>
                  <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>Coming in MVP 2</span>
                </div>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A'
            }}>Ask your AI migration advisor anything — visa rules, costs, documents, IELTS tips and more.</p>
              </div>
              <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0px 4px 24px rgba(30,77,215,0.08)',
            border: '1px solid #ECEEFF',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '520px'
          }}>
                <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F0F2FF',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #FAFBFF, #F4F7FF)'
            }}>
                  <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                    <JapaLearnLogo size={24} />
                  </div>
                  <div>
                    <p style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#18181B'
                }}>JapaLearn AI Assistant</p>
                    <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#21C474',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                      <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#21C474',
                    display: 'inline-block'
                  }} />
                      <span>Online · Migration specialist</span>
                    </p>
                  </div>
                  <div style={{
                marginLeft: 'auto',
                padding: '5px 12px',
                background: '#FFF7E6',
                border: '1px solid #FDE68A',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#D97706'
              }}>Demo Preview</div>
                </div>
                <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#FAFBFF'
            }}>
                  {chatMessages.map(msg => <div key={msg.id} style={{
                display: 'flex',
                gap: '10px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end'
              }}>
                      {msg.role === 'ai' && <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}><JapaLearnLogo size={18} /></div>}
                      {msg.role === 'user' && <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9BB3FF, #3B75FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff'
                }}>A</div>}
                      <div style={{
                  maxWidth: '70%'
                }}>
                        <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    background: msg.role === 'ai' ? '#FFFFFF' : 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    color: msg.role === 'ai' ? '#18181B' : '#FFFFFF',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    boxShadow: msg.role === 'ai' ? '0px 2px 8px rgba(30,77,215,0.06)' : '0px 4px 14px rgba(30,77,215,0.3)',
                    border: msg.role === 'ai' ? '1px solid #ECEEFF' : 'none'
                  }}>
                          <p style={{
                      margin: 0
                    }}>{msg.text}</p>
                        </div>
                        <p style={{
                    margin: '4px 0 0',
                    fontSize: '10px',
                    color: '#B0B4C4',
                    textAlign: msg.role === 'user' ? 'right' : 'left'
                  }}>{msg.time}</p>
                      </div>
                    </div>)}
                </div>
                <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #F0F2FF',
              background: '#FFFFFF'
            }}>
                  <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                background: '#F4F6FF',
                borderRadius: '14px',
                padding: '10px 14px',
                border: '1.5px solid #E4E8FF'
              }}>
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={handleChatKeyDown} placeholder="Ask about your visa, documents, IELTS, costs..." style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#18181B',
                  fontFamily: '"Inter", sans-serif'
                }} />
                    <button onClick={handleSendChat} style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }} aria-label="Send message">
                      <IconArrowRight size={15} color="#FFFFFF" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>}

          {/* ── DOCUMENTS ── */}
          {activeView === 'documents' && <div style={{
          maxWidth: '820px'
        }}>
              <div style={{
            marginBottom: '24px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '6px'
            }}>
                  <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Document Vault</h1>
                  <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>Coming in MVP 2</span>
                </div>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A',
              lineHeight: '1.6'
            }}>Upload your documents — AI parses, verifies and automatically updates your migration readiness score.</p>
              </div>

              <div style={{
            background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '20px',
            boxShadow: '0px 12px 40px rgba(30,77,215,0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            flexWrap: 'wrap'
          }}>
                <div style={{
              flex: 1,
              minWidth: '160px'
            }}>
                  <p style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>Document Readiness</p>
                  <p style={{
                margin: '0 0 10px',
                fontSize: '40px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-2px',
                lineHeight: 1
              }}>62%</p>
                  <div style={{
                height: '7px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                    <div style={{
                  width: '62%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.8), #FFFFFF)',
                  borderRadius: '4px'
                }} />
                  </div>
                  <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)'
              }}>5 of 8 required documents uploaded</p>
                </div>
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px'
            }}>
                  {[{
                val: '4',
                label: 'Uploaded',
                color: '#4ADE80'
              }, {
                val: '2',
                label: 'Missing',
                color: '#F87171'
              }, {
                val: '1',
                label: 'Processing',
                color: '#FCD34D'
              }].map(stat => <div key={stat.label} style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.14)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.18)',
                textAlign: 'center',
                backdropFilter: 'blur(8px)'
              }}>
                      <p style={{
                  margin: '0 0 2px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: '"DM Sans", sans-serif'
                }}>{stat.val}</p>
                      <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500
                }}>{stat.label}</p>
                    </div>)}
                </div>
              </div>

              <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
                {DOCUMENT_CATEGORIES.map(cat => <div key={cat.id} style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '14px 16px',
              border: `1px solid ${cat.done === cat.count ? '#D8F5E6' : cat.done === 0 ? '#FDDCE2' : '#F0F2FF'}`,
              boxShadow: '0px 2px 8px rgba(30,77,215,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
                    <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                      <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#82858A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>{cat.label}</span>
                      <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: cat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                        {cat.done === cat.count ? <IconCheck size={10} color={cat.color} strokeWidth={2.5} /> : <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: cat.color
                  }}>{cat.done}/{cat.count}</span>}
                      </span>
                    </div>
                    <div style={{
                height: '4px',
                background: '#F0F2FF',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                      <div style={{
                  width: `${cat.done / cat.count * 100}%`,
                  height: '100%',
                  background: cat.color,
                  borderRadius: '2px'
                }} />
                    </div>
                    <p style={{
                margin: 0,
                fontSize: '11px',
                color: cat.color,
                fontWeight: 600
              }}>{cat.done === cat.count ? 'Complete' : `${cat.count - cat.done} needed`}</p>
                  </div>)}
              </div>

              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            background: 'linear-gradient(135deg, #EBF1FF, #E8F9EE)',
            borderRadius: '14px',
            border: '1px solid #D4DCFF',
            marginBottom: '20px'
          }}>
                <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                  <IconTarget size={18} color="#FFFFFF" strokeWidth={1.75} />
                </div>
                <div style={{
              flex: 1
            }}>
                  <p style={{
                margin: '0 0 1px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#18181B'
              }}>AI-Powered Document Parsing</p>
                  <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#4D4D56',
                lineHeight: '1.5'
              }}>Upload any document and our AI will extract key details, flag issues, and update your readiness score automatically — no manual data entry needed.</p>
                </div>
              </div>

              <div style={{
            background: 'linear-gradient(135deg, #F4F7FF, #EBF1FF)',
            border: '2px dashed #B3C5FF',
            borderRadius: '18px',
            padding: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            cursor: 'pointer'
          }}>
                <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #EBF1FF, #D8E6FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0px 4px 14px rgba(30,77,215,0.12)'
            }}>
                  <IconUpload size={26} color="#1E4DD7" strokeWidth={1.75} />
                </div>
                <p style={{
              margin: '0 0 6px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif'
            }}>Drop your documents here</p>
                <p style={{
              margin: '0 0 16px',
              fontSize: '13px',
              color: '#82858A',
              lineHeight: '1.5'
            }}>PDF, JPG, PNG — up to 10MB per file. AI will auto-detect document type.</p>
                <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
                  <button style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                boxShadow: '0px 4px 14px rgba(30,77,215,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px'
              }}>
                    <IconUpload size={14} color="#FFFFFF" strokeWidth={2} />
                    <span>Browse Files</span>
                  </button>
                  <button style={{
                padding: '10px 20px',
                background: '#FFFFFF',
                color: '#3B75FF',
                border: '1.5px solid #B3C5FF',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif'
              }}>
                    <span>View Requirements</span>
                  </button>
                </div>
              </div>

              <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0px 2px 12px rgba(30,77,215,0.05)',
            border: '1px solid #F0F2FF'
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
                  <h2 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Required Documents</h2>
                  <div style={{
                display: 'flex',
                gap: '6px'
              }}>
                    {(['All', 'Missing', 'Uploaded'] as const).map(f => <button key={f} onClick={() => setDocFilter(f)} style={{
                  padding: '5px 12px',
                  background: docFilter === f ? '#EBF1FF' : '#F4F6FF',
                  border: `1px solid ${docFilter === f ? '#B3C5FF' : '#E4E8FF'}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: docFilter === f ? 700 : 500,
                  color: docFilter === f ? '#1E4DD7' : '#82858A',
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif'
                }}>{f}</button>)}
                  </div>
                </div>
                <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
                  {filteredDocuments.map((doc, idx) => <li key={doc.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 0',
                borderBottom: idx < filteredDocuments.length - 1 ? '1px solid #F4F6FF' : 'none'
              }}>
                      <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: doc.status === 'uploaded' ? '#E8F9EE' : doc.status === 'processing' ? '#FFF7E6' : '#FDECEC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1.5px solid ${doc.status === 'uploaded' ? '#A7F3C5' : doc.status === 'processing' ? '#FDE68A' : '#FBBCC8'}`
                }}>
                        {doc.status === 'uploaded' && <IconCheckCircle size={20} color="#21C474" strokeWidth={2} />}
                        {doc.status === 'processing' && <IconAlertTriangle size={20} color="#F59A0A" strokeWidth={2} />}
                        {doc.status === 'missing' && <IconXCircle size={20} color="#EF4369" strokeWidth={2} />}
                      </div>
                      <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                        <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3px'
                  }}>
                          <p style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#18181B'
                    }}>{doc.name}</p>
                          {doc.required && <span style={{
                      padding: '2px 7px',
                      background: '#F4F6FF',
                      border: '1px solid #E0E4F5',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#82858A'
                    }}>Required</span>}
                        </div>
                        <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                          <span style={{
                      padding: '2px 8px',
                      background: '#F4F6FF',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#6B7280'
                    }}>{doc.category}</span>
                          {doc.status === 'processing' && <span style={{
                      fontSize: '11px',
                      color: '#F59A0A',
                      fontWeight: 500
                    }}>AI is analysing this document…</span>}
                          {doc.status === 'uploaded' && <span style={{
                      fontSize: '11px',
                      color: '#21C474',
                      fontWeight: 500
                    }}>Verified by AI ✓</span>}
                        </div>
                      </div>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0
                }}>
                        <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: doc.status === 'uploaded' ? '#E8F9EE' : doc.status === 'processing' ? '#FFF7E6' : '#FDECEC',
                    color: doc.status === 'uploaded' ? '#21C474' : doc.status === 'processing' ? '#F59A0A' : '#EF4369'
                  }}>
                          {doc.status === 'uploaded' ? 'Uploaded' : doc.status === 'processing' ? 'Processing' : 'Missing'}
                        </span>
                        {doc.status === 'missing' && <button style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    border: 'none',
                    borderRadius: '9px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: '0px 3px 10px rgba(30,77,215,0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                            <IconUpload size={12} color="#FFFFFF" strokeWidth={2} />
                            <span>Upload</span>
                          </button>}
                        {doc.status === 'uploaded' && <button style={{
                    padding: '8px 12px',
                    background: '#F4F6FF',
                    border: '1px solid #E0E4F5',
                    borderRadius: '9px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#4D4D56',
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                            <IconDownload size={12} color="#6B7280" strokeWidth={2} />
                            <span>View</span>
                          </button>}
                      </div>
                    </li>)}
                </ul>
              </div>
            </div>}

          {/* ── PEERS ── */}
          {activeView === 'peers' && <div style={{
          maxWidth: '820px'
        }}>
              <div style={{
            marginBottom: '24px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '6px'
            }}>
                  <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#18181B',
                letterSpacing: '-0.5px',
                fontFamily: '"DM Sans", sans-serif'
              }}>Peer Network</h1>
                  <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7C6AF7',
                background: '#F0EEFF',
                border: '1px solid #DDD6FE',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>Coming in MVP 2</span>
                </div>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A',
              lineHeight: '1.6'
            }}>Connect, learn, and grow with people on the same UK migration journey — real stories, real support.</p>
              </div>

              <div style={{
            background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '20px',
            boxShadow: '0px 12px 40px rgba(30,77,215,0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            flexWrap: 'wrap'
          }}>
                <div style={{
              flex: 1,
              minWidth: '160px'
            }}>
                  <p style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>Your Community</p>
                  <p style={{
                margin: '0 0 6px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-0.5px',
                lineHeight: 1.2
              }}>2,847 Nigerians on the UK Pathway</p>
                  <p style={{
                margin: '0 0 12px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.65)'
              }}>412 active this week · 38 got their visa this year</p>
                </div>
                <div style={{
              display: 'flex',
              gap: '10px'
            }}>
                  {[{
                val: '412',
                label: 'Active peers'
              }, {
                val: '38',
                label: 'Visas granted'
              }, {
                val: '94%',
                label: 'Support rate'
              }].map(stat => <div key={stat.label} style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.14)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.18)',
                textAlign: 'center',
                backdropFilter: 'blur(8px)'
              }}>
                      <p style={{
                  margin: '0 0 2px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif'
                }}>{stat.val}</p>
                      <p style={{
                  margin: 0,
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}>{stat.label}</p>
                    </div>)}
                </div>
              </div>

              <div style={{
            marginBottom: '24px'
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
                  <h2 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Suggested Connections</h2>
                  <span style={{
                fontSize: '12px',
                color: '#3B75FF',
                fontWeight: 600,
                cursor: 'pointer'
              }}>View all</span>
                </div>
                <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '12px'
            }}>
                  {PEER_PROFILES.map(peer => <div key={peer.id} style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '20px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.05)',
                cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }} onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#B3C5FF';
                e.currentTarget.style.boxShadow = '0px 4px 20px rgba(30,77,215,0.1)';
              }} onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F0F2FF';
                e.currentTarget.style.boxShadow = '0px 2px 12px rgba(30,77,215,0.05)';
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px'
                }}>
                        <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: peer.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{peer.initials}</div>
                        <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                          <p style={{
                      margin: '0 0 2px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#18181B'
                    }}>{peer.name}</p>
                          <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#82858A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                            <IconFlag size={11} color="#82858A" strokeWidth={2} />
                            <span>{peer.country}</span>
                          </p>
                        </div>
                        <div style={{
                    textAlign: 'right',
                    flexShrink: 0
                  }}>
                          <p style={{
                      margin: '0 0 1px',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1E4DD7',
                      fontFamily: '"DM Sans", sans-serif'
                    }}>{peer.score}%</p>
                          <p style={{
                      margin: 0,
                      fontSize: '10px',
                      color: '#82858A'
                    }}>Readiness</p>
                        </div>
                      </div>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px'
                }}>
                        <span style={{
                    padding: '4px 10px',
                    background: '#EBF1FF',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#1E4DD7'
                  }}>{peer.pathway}</span>
                        <span style={{
                    padding: '4px 10px',
                    background: '#F4F6FF',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#6B7280'
                  }}>{peer.mutual} mutual connections</span>
                      </div>
                      <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                        <button style={{
                    flex: 1,
                    padding: '9px',
                    background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: '0px 3px 12px rgba(30,77,215,0.22)'
                  }}>Connect</button>
                        <button style={{
                    padding: '9px 14px',
                    background: '#F4F6FF',
                    color: '#4D4D56',
                    border: '1px solid #E0E4F5',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif'
                  }}>View Profile</button>
                      </div>
                    </div>)}
                </div>
              </div>

              <div>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
                  <h2 style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Community Discussions</h2>
                  <button style={{
                padding: '7px 14px',
                background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif'
              }}>+ Start Thread</button>
                </div>
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                  {PEER_DISCUSSION_THREADS.map(thread => <div key={thread.id} style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '20px 22px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.05)',
                cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }} onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#B3C5FF';
                e.currentTarget.style.boxShadow = '0px 4px 20px rgba(30,77,215,0.1)';
              }} onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F0F2FF';
                e.currentTarget.style.boxShadow = '0px 2px 12px rgba(30,77,215,0.05)';
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                        <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: thread.authorBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>{thread.authorInitials}</div>
                        <div style={{
                    flex: 1,
                    minWidth: 0
                  }}>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      flexWrap: 'wrap'
                    }}>
                            <span style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#18181B'
                      }}>{thread.authorName}</span>
                            <span style={{
                        padding: '2px 8px',
                        background: thread.tagBg,
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: thread.tagColor
                      }}>{thread.tag}</span>
                            <span style={{
                        fontSize: '11px',
                        color: '#B0B4C4',
                        marginLeft: 'auto'
                      }}>{thread.timeAgo}</span>
                          </div>
                          <p style={{
                      margin: '0 0 6px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#18181B',
                      lineHeight: '1.4'
                    }}>{thread.title}</p>
                          <p style={{
                      margin: '0 0 12px',
                      fontSize: '13px',
                      color: '#6B7280',
                      lineHeight: '1.6'
                    }}>{thread.excerpt}</p>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                            <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#82858A',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                              <IconConversations size={14} color="#82858A" strokeWidth={1.75} />
                              <span>{thread.replies} replies</span>
                            </button>
                            <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#82858A',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                              <IconFlame size={14} color="#82858A" strokeWidth={1.75} />
                              <span>{thread.likes} helpful</span>
                            </button>
                            <button style={{
                        marginLeft: 'auto',
                        padding: '6px 14px',
                        background: '#F4F6FF',
                        border: '1px solid #E0E4F5',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#3B75FF',
                        cursor: 'pointer',
                        fontFamily: '"Inter", sans-serif'
                      }}>Read thread</button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>}

          {/* ── MARKETPLACE ── */}
          {activeView === 'marketplace' && <MarketplacePage isMobile={false} />}

          {/* ── PLANS ── */}
          {activeView === 'plans' && <div style={{
          maxWidth: '820px'
        }}>
              <div style={{
            marginBottom: '28px',
            textAlign: 'center'
          }}>
                <h1 style={{
              margin: '0 0 6px',
              fontSize: '26px',
              fontWeight: 800,
              color: '#18181B',
              letterSpacing: '-0.6px',
              fontFamily: '"DM Sans", sans-serif'
            }}>Subscription Plans</h1>
                <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#82858A'
            }}>Unlock more tools as you progress your migration journey.</p>
              </div>
              <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '16px'
          }}>
                {PLAN_TIERS.map(plan => <div key={plan.id} style={{
              background: plan.highlight ? 'linear-gradient(155deg, #1A42C2 0%, #2F67F8 100%)' : '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: plan.highlight ? '0px 16px 48px rgba(30,77,215,0.3)' : '0px 2px 12px rgba(30,77,215,0.05)',
              border: plan.highlight ? 'none' : '1px solid #F0F2FF'
            }}>
                    <p style={{
                margin: '0 0 12px',
                fontSize: '13px',
                fontWeight: 700,
                color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#82858A',
                textTransform: 'uppercase',
                letterSpacing: '0.07em'
              }}>{plan.name}</p>
                    <p style={{
                margin: '0 0 2px',
                fontSize: '30px',
                fontWeight: 800,
                color: plan.highlight ? '#FFFFFF' : '#18181B',
                fontFamily: '"DM Sans", sans-serif',
                letterSpacing: '-1px'
              }}>{plan.price}</p>
                    <p style={{
                margin: '0 0 20px',
                fontSize: '12px',
                color: plan.highlight ? 'rgba(255,255,255,0.55)' : '#A0A4B8'
              }}>{plan.period}</p>
                    <ul style={{
                listStyle: 'none',
                margin: '0 0 20px',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '9px'
              }}>
                      {plan.features.map(feat => <li key={feat} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                  color: plan.highlight ? 'rgba(255,255,255,0.88)' : '#4D4D56'
                }}>
                          <span style={{
                    marginTop: '1px',
                    flexShrink: 0
                  }}>
                            <IconCheck size={14} color={plan.highlight ? 'rgba(255,255,255,0.7)' : '#21C474'} strokeWidth={2.5} />
                          </span>
                          <span>{feat}</span>
                        </li>)}
                    </ul>
                    <button style={{
                width: '100%',
                padding: '12px',
                background: plan.highlight ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg, #1E4DD7 0%, #3B75FF 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif'
              }}>
                      {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>)}
              </div>
            </div>}

          {/* ── PROFILE ── */}
          {activeView === 'profile' && <div style={{
          maxWidth: '820px'
        }}>
              <div style={{
            background: 'linear-gradient(135deg, #1A42C2 0%, #2F67F8 55%, #5C8AFF 100%)',
            borderRadius: '22px',
            padding: '32px 32px 0',
            marginBottom: '0',
            boxShadow: '0px 12px 40px rgba(30,77,215,0.28)',
            overflow: 'hidden'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '20px',
              paddingBottom: '28px'
            }}>
                  <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                flexShrink: 0
              }}>
                    <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                      <span style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif'
                  }}>A</span>
                    </div>
                    <button aria-label="Change profile photo" title="Change profile photo" style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid rgba(30,77,215,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1E4DD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </button>
                  </div>
                  <div style={{
                flex: 1
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '4px'
                }}>
                      <h1 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '-0.5px'
                  }}>Adaeze Okafor</h1>
                      <span style={{
                    padding: '3px 10px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>Free Plan</span>
                    </div>
                    <p style={{
                  margin: '0 0 2px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.75)'
                }}>adaeze.okafor@example.com</p>
                    <p style={{
                  margin: '0 0 10px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                      <IconFlag size={12} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                      <span>Lagos, Nigeria → UK (Skilled Worker Visa)</span>
                    </p>
                  </div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'flex-end',
                flexShrink: 0
              }}>
                    <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif'
                }}>
                      <IconEdit size={14} color="#FFFFFF" />
                      <span>Edit Profile</span>
                    </button>
                    <button onClick={() => {}} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif'
                }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>
                      <span>Retake Assessment</span>
                    </button>
                  </div>
                </div>
                <div style={{
              display: 'flex',
              gap: '0',
              borderTop: '1px solid rgba(255,255,255,0.12)'
            }}>
                  {[{
                val: '72%',
                label: 'Readiness'
              }, {
                val: '12',
                label: 'Day Streak'
              }, {
                val: '3',
                label: 'Active Modules'
              }, {
                val: '5/8',
                label: 'Docs Ready'
              }].map((s, si) => <div key={s.label} style={{
                flex: 1,
                padding: '16px 0',
                textAlign: 'center',
                borderRight: si < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none'
              }}>
                      <p style={{
                  margin: '0 0 2px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '"DM Sans", sans-serif'
                }}>{s.val}</p>
                      <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.6)'
                }}>{s.label}</p>
                    </div>)}
                </div>
              </div>

              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginTop: '16px'
          }}>
                <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #F0F2FF',
              boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
            }}>
                  <h2 style={{
                margin: '0 0 18px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#18181B',
                fontFamily: '"DM Sans", sans-serif'
              }}>Score Breakdown</h2>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '13px'
              }}>
                    {SCORE_CATEGORIES.map(cat => <div key={cat.id}>
                        <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                  }}>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                            {cat.status === 'ok' && <IconCheckCircle size={12} color="#21C474" strokeWidth={2} />}
                            {cat.status === 'warn' && <IconAlertTriangle size={12} color="#F59A0A" strokeWidth={2} />}
                            {cat.status === 'bad' && <IconXCircle size={12} color="#EF4369" strokeWidth={2} />}
                            <span style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#2D2D35'
                      }}>{cat.label}</span>
                          </div>
                          <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: cat.color
                    }}>{cat.score}%</span>
                        </div>
                        <div style={{
                    height: '6px',
                    background: '#F0F2FF',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                          <div style={{
                      width: `${cat.score}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${cat.color}bb, ${cat.color})`,
                      borderRadius: '3px'
                    }} />
                        </div>
                      </div>)}
                  </div>
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                  <div style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '22px',
                border: '1px solid #F0F2FF',
                boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
              }}>
                    <h2 style={{
                  margin: '0 0 16px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif'
                }}>Migration Profile</h2>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                      {[{
                    label: 'Visa Type',
                    value: 'UK Skilled Worker'
                  }, {
                    label: 'Current Location',
                    value: 'Lagos, Nigeria'
                  }, {
                    label: 'Target Destination',
                    value: 'United Kingdom'
                  }, {
                    label: 'Profession',
                    value: 'Healthcare Worker'
                  }, {
                    label: 'IELTS Status',
                    value: 'Preparing'
                  }, {
                    label: 'Timeline',
                    value: '6 months'
                  }].map(field => <div key={field.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #F4F6FF'
                  }}>
                          <span style={{
                      fontSize: '12px',
                      color: '#82858A',
                      fontWeight: 500
                    }}>{field.label}</span>
                          <span style={{
                      fontSize: '13px',
                      color: '#18181B',
                      fontWeight: 600
                    }}>{field.value}</span>
                        </div>)}
                    </div>
                  </div>

                  <div style={{
                background: 'linear-gradient(135deg, #EBF1FF 0%, #F2EEFF 100%)',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #D4DCFF'
              }}>
                    <p style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1E4DD7'
                }}>Share Your Profile 🔗</p>
                    <p style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  color: '#6B7280',
                  lineHeight: '1.5'
                }}>japalearn.ai/u/adaeze-okafor</p>
                    <p style={{
                  margin: '0 0 12px',
                  fontSize: '12px',
                  color: '#4D4D56',
                  lineHeight: '1.5'
                }}>Your profile shows your readiness score, pathway & progress. Share it and earn when friends join JapaLearn.</p>
                    <button style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #1E4DD7, #3B75FF)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0px 4px 14px rgba(30,77,215,0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                      <span>Share Your Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '22px',
            marginTop: '16px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
          }}>
                <h2 style={{
              margin: '0 0 16px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif'
            }}>Account &amp; Notifications</h2>
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
                  {['Change Password', 'Notification Preferences', 'Privacy Settings', 'Delete Account'].map((setting, si) => <button key={setting} style={{
                padding: '12px 16px',
                background: si === 3 ? '#FFF5F7' : '#FAFBFF',
                border: `1px solid ${si === 3 ? '#FDD' : '#F0F2FF'}`,
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 500,
                color: si === 3 ? '#EF4369' : '#4D4D56',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: '"Inter", sans-serif'
              }}>
                      {setting}
                    </button>)}
                </div>
              </div>

              <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '22px',
            marginTop: '16px',
            border: '1px solid #F0F2FF',
            boxShadow: '0px 2px 12px rgba(30,77,215,0.05)'
          }}>
                <h2 style={{
              margin: '0 0 16px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#18181B',
              fontFamily: '"DM Sans", sans-serif'
            }}>Display Preferences</h2>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
                  <div style={{
                flex: 1,
                minWidth: 0
              }}>
                    <p style={{
                  margin: '0 0 2px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#18181B',
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: '-0.2px'
                }}>Dark Mode</p>
                    <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#6B7280',
                  lineHeight: 1.55,
                  fontFamily: '"Inter", sans-serif'
                }}>
                      {darkRequested ? isDarkMode ? 'Dark mode is active.' : 'Light mode active.' : 'Switch to a darker theme.'}
                    </p>
                  </div>
                  <button onClick={handleDarkToggle} aria-pressed={isDarkMode} aria-label="Toggle dark mode" style={{
                width: '44px',
                height: '26px',
                borderRadius: '13px',
                background: isDarkMode ? '#1E4DD7' : '#E5E7EB',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isDarkMode ? 'flex-end' : 'flex-start',
                transition: 'background 0.2s ease',
                flexShrink: 0
              }}>
                    <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)'
                }} />
                  </button>
                </div>
              </div>
            </div>}

        </main>
      </div>
    </div>;
}