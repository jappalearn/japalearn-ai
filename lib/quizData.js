// ─── SCREEN 1: 7 broad categories ────────────────────────────────────────────
export const categoryQuestion = {
  id: 'category',
  question: 'What best describes you?',
  subtitle: 'This helps us tailor your assessment',
  options: [
    'Student / Graduate',
    'Tech Professional',
    'Medical Professional',
    'Skilled Worker',
    'Business Owner',
    'Parent / Family',
    'Others',
  ],
}

// ─── SCREEN 2: Sub-options per category ──────────────────────────────────────
// The selected value becomes the 'segment' answer used downstream
export const subCategoryQuestions = {
  'Student / Graduate': {
    id: 'segment',
    question: 'What stage are you at?',
    subtitle: 'We\'ll tailor your roadmap to your exact situation',
    options: [
      'Student (seeking to study abroad)',
      'Explorer / Not sure yet',
      'Others',
    ],
  },
  'Tech Professional': {
    id: 'segment',
    question: 'What is your tech role?',
    subtitle: 'Different roles have different visa pathways',
    options: [
      'Software Engineer / Developer',
      'Data / AI / Analytics Professional',
      'Product Manager / Designer',
      'Explorer / Not sure yet',
      'Others',
    ],
  },
  'Medical Professional': {
    id: 'segment',
    question: 'What is your medical role?',
    subtitle: 'Each role has a completely different licensing path',
    options: [
      'Medical Doctor',
      'Nurse / Midwife',
      'Pharmacist',
      'Other Healthcare Professional',
      'Others',
    ],
  },
  'Skilled Worker': {
    id: 'segment',
    question: 'What is your profession?',
    subtitle: 'We\'ll match you to the right skilled worker visa route',
    options: [
      'Finance / Accounting Professional',
      'Legal Professional',
      'HR / Marketing / Comms Professional',
      'Explorer / Not sure yet',
      'Others',
    ],
  },
  'Business Owner': {
    id: 'segment',
    question: 'How do you earn income?',
    subtitle: 'This shapes your visa options significantly',
    options: [
      'Freelancer / Remote Worker',
      'Explorer / Not sure yet',
      'Others',
    ],
  },
  'Parent / Family': {
    id: 'segment',
    question: 'How are you planning to relocate?',
    subtitle: 'Family visa routes depend on your sponsor\'s status',
    options: [
      'Moving to join family abroad',
      'Explorer / Not sure yet',
      'Others',
    ],
  },
  'Others': {
    id: 'segment',
    question: 'What best describes your situation?',
    subtitle: 'We can still build a personalised roadmap for you',
    options: [
      'Explorer / Not sure yet',
      'Freelancer / Remote Worker',
      'Student (seeking to study abroad)',
      'Moving to join family abroad',
    ],
  },
}

// ─── Q1: The branch point (legacy — kept for backwards compat) ────────────────
export const segmentQuestion = {
  id: 'segment',
  question: 'What best describes your professional background?',
  options: [
    'Medical Doctor',
    'Nurse / Midwife',
    'Pharmacist',
    'Other Healthcare Professional',
    'Software Engineer / Developer',
    'Data / AI / Analytics Professional',
    'Product Manager / Designer',
    'Finance / Accounting Professional',
    'Legal Professional',
    'HR / Marketing / Comms Professional',
    'Freelancer / Remote Worker',
    'Student (seeking to study abroad)',
    'Moving to join family abroad',
    'Explorer / Not sure yet',
  ],
}

// ─── Q2: Destination (universal, shown to everyone after Q1) ──────────────────
export const destinationQuestion = {
  id: 'destination',
  question: 'Which country are you most interested in moving to?',
  options: [
    'Canada', 'UK', 'USA', 'Germany', 'Ireland', 'Australia',
    'Netherlands', 'Portugal', 'France', 'New Zealand',
    'Sweden', 'Norway', 'UAE', 'Singapore', 'Other',
  ],
}

// ─── Segment-specific questions ───────────────────────────────────────────────
// Each path is designed exclusively for that role — no overlap, no generic filler.
export const segmentSpecificQuestions = {

  'Medical Doctor': [
    {
      id: 'doctor_specialty',
      question: 'What is your medical specialty?',
      options: [
        'General Practice / General Medicine',
        'Surgery (General, Orthopaedic, etc.)',
        'Internal Medicine',
        'Paediatrics / Neonatology',
        'Obstetrics & Gynaecology',
        'Psychiatry',
        'Radiology / Imaging',
        'Anaesthesiology',
        'Other specialty',
      ],
    },
    {
      id: 'postgrad_qual',
      question: 'What postgraduate medical qualification have you completed?',
      options: [
        'None yet — MBBS / MBChB only',
        'Residency currently in progress',
        'Fellowship completed — FMCP / FWACS / FWACP',
        'West African College of Surgeons cert',
        'Other international postgrad qualification',
      ],
    },
    {
      id: 'mdcn_status',
      question: 'What is your MDCN (Medical & Dental Council of Nigeria) registration status?',
      options: [
        'Active and fully current',
        'Expired — needs renewal',
        'Not yet registered',
      ],
    },
    {
      id: 'licensing_progress',
      question: 'How far have you gone with the medical licensing process for your target country?',
      options: [
        'Not started at all',
        'Researching requirements (PLAB / AMC / MCCQE / USMLE)',
        'Registered for exam — currently studying',
        'Part 1 passed (PLAB 1 / AMC CAT 1 / MCCQE 1)',
        'All licensing exams passed',
        'Already registered with target country medical board (GMC, AMC, etc.)',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer, NHS trust sponsorship, or hospital placement lined up?',
      options: [
        'Yes — confirmed offer',
        'In active negotiation',
        'No — still searching',
        'Not at this stage yet',
      ],
    },
  ],

  'Nurse / Midwife': [
    {
      id: 'nursing_qual',
      question: 'What is your primary nursing or midwifery qualification?',
      options: [
        'RN — General Nursing',
        'BSc Nursing',
        'Midwifery Certificate (RM)',
        'Both RN and Midwifery',
        'Nursing + Postgrad specialty',
        'Other',
      ],
    },
    {
      id: 'nursing_environment',
      question: 'What type of nursing environment have you primarily worked in?',
      options: [
        'General ward / medical-surgical',
        'ICU / Critical care / HDU',
        'Theatre / perioperative',
        'Community / primary care',
        'Paediatrics',
        'Mental health / psychiatric',
        'Maternal and newborn care',
        'Other',
      ],
    },
    {
      id: 'nmcn_status',
      question: 'What is your NMCN (Nursing & Midwifery Council of Nigeria) registration status?',
      options: [
        'Active and fully current',
        'Expired — needs renewal',
        'Not yet registered',
      ],
    },
    {
      id: 'licensing_progress',
      question: 'How far have you gone with the overseas nursing licensing process?',
      options: [
        'Not started',
        'Researching requirements (NMC, NCLEX, AHPRA, etc.)',
        'CBT / Computer-based test passed',
        'OSCE / Clinical skills exam in progress or booked',
        'Fully licensed in target country',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a hospital job offer or NHS / healthcare trust sponsorship?',
      options: [
        'Yes — confirmed',
        'In active negotiation',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Pharmacist': [
    {
      id: 'pharmacy_sector',
      question: 'What pharmacy sector do you currently work in?',
      options: [
        'Retail / Community pharmacy',
        'Hospital / Clinical pharmacy',
        'Industrial / Manufacturing / QA',
        'Academic / Research',
        'Regulatory / Government / NAFDAC',
        'Other',
      ],
    },
    {
      id: 'pcn_status',
      question: 'What is your PCN (Pharmacists Council of Nigeria) registration status?',
      options: [
        'Active and fully current',
        'Expired — needs renewal',
        'Not yet registered',
      ],
    },
    {
      id: 'additional_certs',
      question: 'Do you hold any additional pharmacy certifications or specialist qualifications?',
      options: [
        'Clinical pharmacy specialist',
        'Pharmaceutical care certification',
        'Regulatory affairs certificate',
        'None beyond my BPharm/PharmD',
        'Other',
      ],
    },
    {
      id: 'licensing_progress',
      question: 'How far have you gone with the overseas pharmacy licensing process?',
      options: [
        'Not started',
        'Researching requirements (GPhC, PEBC, AHPRA, etc.)',
        'Application submitted to licensing body',
        'Exam registered and studying',
        'Exam passed / licensed in target country',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a pharmacy job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active negotiation',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Other Healthcare Professional': [
    {
      id: 'allied_health_role',
      question: 'What is your specific healthcare role?',
      options: [
        'Physiotherapist',
        'Radiographer / Radiological Scientist',
        'Medical Laboratory Scientist',
        'Dentist',
        'Optometrist',
        'Occupational Therapist',
        'Speech & Language Therapist',
        'Dietitian / Nutritionist',
        'Biomedical Engineer',
        'Other allied health',
      ],
    },
    {
      id: 'professional_body_status',
      question: 'Are you currently registered with the relevant Nigerian professional body (MLSCN, MRTBN, etc.)?',
      options: [
        'Yes — active registration',
        'Expired — needs renewal',
        'No',
      ],
    },
    {
      id: 'licensing_progress',
      question: 'How far have you gone with the overseas licensing process for your role?',
      options: [
        'Not started',
        'Researching requirements',
        'Application submitted to licensing body',
        'Exam studying / registered',
        'Fully licensed in target country',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active negotiation',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Software Engineer / Developer': [
    {
      id: 'dev_specialisation',
      question: 'What is your primary engineering specialisation?',
      options: [
        'Frontend (React, Vue, Angular, etc.)',
        'Backend (Node, Python, Java, Go, etc.)',
        'Full-stack',
        'Mobile (iOS / Android / React Native / Flutter)',
        'DevOps / Cloud / Infrastructure',
        'Embedded / Systems / C++',
        'Blockchain / Web3',
        'Other',
      ],
    },
    {
      id: 'tech_certs',
      question: 'Do you have any cloud or technical certifications?',
      options: [
        'AWS Certified (any level)',
        'Google Cloud Certified',
        'Microsoft Azure Certified',
        'Multiple cloud certifications',
        'Other tech certs (Kubernetes, Terraform, etc.)',
        'No certifications yet',
      ],
    },
    {
      id: 'current_work_setup',
      question: 'What is your current work arrangement?',
      options: [
        'Employed full-time in Nigeria',
        'Remote for an international company (working from Nigeria)',
        'Fully freelance / contractor',
        'Employed + doing freelance on the side',
        'Startup founder / co-founder',
        'Currently unemployed / job searching',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or visa sponsorship from an employer abroad?',
      options: [
        'Yes — confirmed offer',
        'In active interviews / late stage',
        'No',
        'Planning to apply once ready to move',
      ],
    },
  ],

  'Data / AI / Analytics Professional': [
    {
      id: 'data_role',
      question: 'What is your specific role?',
      options: [
        'Data Analyst',
        'Data Scientist',
        'Machine Learning / AI Engineer',
        'Data Engineer / Pipeline Engineer',
        'BI Developer / Analyst (Power BI, Tableau)',
        'AI Product Manager / AI Researcher',
        'Other',
      ],
    },
    {
      id: 'data_stack',
      question: 'What tools and stack do you primarily work with?',
      options: [
        'Python (pandas, scikit-learn, TensorFlow, etc.)',
        'SQL + BI tools (Power BI, Tableau, Looker)',
        'Cloud platforms (AWS, GCP, Azure)',
        'R / statistical tools',
        'Multiple stacks',
        'Other',
      ],
    },
    {
      id: 'data_certs',
      question: 'Do you hold any relevant certifications?',
      options: [
        'Google Data Analytics / Cloud Professional',
        'AWS Data / ML Specialty',
        'Microsoft Fabric / Azure Data',
        'Tableau / Power BI certified',
        'No certifications yet',
        'Other',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active interviews',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Product Manager / Designer': [
    {
      id: 'pm_design_role',
      question: 'What is your specific role?',
      options: [
        'Product Manager / Owner',
        'UX Designer',
        'UI Designer',
        'UX / UI (both)',
        'Product Designer',
        'Design Lead / Creative Director',
        'Design Systems / Motion',
        'Other',
      ],
    },
    {
      id: 'product_domain',
      question: 'What industry domain have you primarily worked in?',
      options: [
        'Fintech / Banking',
        'Health tech',
        'E-commerce / Consumer apps',
        'B2B / SaaS',
        'Agency / design studio',
        'Government / public sector',
        'Other',
      ],
    },
    {
      id: 'portfolio_status',
      question: 'What is the state of your professional portfolio?',
      options: [
        'Strong portfolio — international standard, published online',
        'Decent portfolio — needs some work before applying',
        'Basic — only internal work, not shareable yet',
        'No formal portfolio yet',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active interviews',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Finance / Accounting Professional': [
    {
      id: 'finance_role',
      question: 'What is your specific finance or accounting role?',
      options: [
        'Financial / Management Accountant',
        'External or Internal Auditor',
        'Financial Analyst',
        'Investment / Portfolio Analyst',
        'Tax Specialist',
        'Treasury / Risk Management',
        'CFO / Finance Director',
        'Other',
      ],
    },
    {
      id: 'finance_quals',
      question: 'What professional qualifications do you hold?',
      options: [
        'ICAN — full member',
        'ACCA — fully qualified',
        'CFA — Level 1, 2, or charter complete',
        'CIMA — fully qualified',
        'CPA (USA)',
        'None yet — currently studying',
        'Multiple qualifications',
      ],
    },
    {
      id: 'finance_seniority',
      question: 'What is your current seniority level?',
      options: [
        'Entry level (0–2 years)',
        'Mid-level (3–5 years)',
        'Senior (6–9 years)',
        'Manager / Team lead',
        'Director / Head of Finance',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active interviews',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Legal Professional': [
    {
      id: 'legal_role',
      question: 'What is your specific legal role?',
      options: [
        'Barrister (called to the Nigerian Bar)',
        'Solicitor / Corporate Lawyer',
        'In-house Counsel',
        'Legal Researcher / Academic',
        'Paralegal / Legal Executive',
        'Notary / Commissioner for Oaths',
        'Other',
      ],
    },
    {
      id: 'legal_area',
      question: 'What area of law do you primarily practise?',
      options: [
        'Corporate / Commercial',
        'Finance / Banking / Capital Markets',
        'Real Estate / Property',
        'Litigation / Dispute Resolution',
        'Employment / Labour',
        'Immigration / Human Rights',
        'Criminal',
        'Tech / IP / Data',
        'Other',
      ],
    },
    {
      id: 'nba_status',
      question: 'What is your NBA (Nigerian Bar Association) standing?',
      options: [
        'Active member in good standing',
        'Inactive — not renewed',
        'Not yet called to bar',
      ],
    },
    {
      id: 'requalification_awareness',
      question: 'Have you researched the requalification process for your target country?',
      options: [
        'Yes — I know exactly what is required (SQE, QLTS, Bar Transfer Test, etc.)',
        'Partially — still researching',
        'No — I need full guidance on this',
      ],
    },
  ],

  'HR / Marketing / Comms Professional': [
    {
      id: 'hrmkt_role',
      question: 'What is your specific function?',
      options: [
        'HR / People Operations',
        'Talent Acquisition / Recruitment',
        'Learning & Development',
        'Marketing / Brand Management',
        'Digital Marketing / Growth / SEO',
        'PR / Corporate Communications',
        'Content / Copywriting / Editorial',
        'Sales / Business Development',
        'Other',
      ],
    },
    {
      id: 'hrmkt_certs',
      question: 'What professional certifications do you hold?',
      options: [
        'CIPM (Chartered Institute of Personnel Management, Nigeria)',
        'CIPD (UK — Level 3, 5, or 7)',
        'SHRM (USA)',
        'CIM (Chartered Institute of Marketing)',
        'Google / Meta / HubSpot certified',
        'No formal certs yet',
        'Other',
      ],
    },
    {
      id: 'hrmkt_seniority',
      question: 'What is your current seniority level?',
      options: [
        'Entry level (0–2 years)',
        'Mid-level (3–5 years)',
        'Senior (6–9 years)',
        'Manager / Head of department',
        'Director / VP / C-suite',
      ],
    },
    {
      id: 'job_offer',
      question: 'Do you have a job offer or employer sponsorship abroad?',
      options: [
        'Yes — confirmed',
        'In active interviews',
        'No',
        'Not at this stage yet',
      ],
    },
  ],

  'Freelancer / Remote Worker': [
    {
      id: 'freelance_field',
      question: 'What is your primary freelance field?',
      options: [
        'Software / Tech development',
        'Design (UI/UX, graphics, motion, brand)',
        'Writing / Content / Copywriting',
        'Consulting / Strategy / Advisory',
        'Online teaching / tutoring',
        'Digital marketing / Social media',
        'Video / Film / Photography',
        'Finance / Bookkeeping',
        'Other',
      ],
    },
    {
      id: 'freelance_income',
      question: 'What is your approximate monthly freelance income in USD?',
      options: ['Less than $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000 – $5,000', '$5,000+'],
    },
    {
      id: 'international_clients',
      question: 'Do you currently have international (non-Nigerian) clients?',
      options: [
        'Yes — multiple active international clients',
        'Yes — one or two',
        'No — mostly Nigerian clients',
        'Just starting out',
      ],
    },
    {
      id: 'business_registration',
      question: 'Is your freelance work formally registered?',
      options: [
        'Yes — registered as a business (CAC)',
        'No — operating informally',
        'In progress',
      ],
    },
    {
      id: 'nomad_route',
      question: 'What relocation model interests you most?',
      options: [
        'Digital Nomad Visa — live in one place, stay mobile',
        'Settle permanently in one country',
        'Work visa with employer (contract or full-time)',
        'Not sure yet',
      ],
    },
  ],

  'Student (seeking to study abroad)': [
    {
      id: 'study_stage',
      question: 'Where are you in the study abroad process?',
      options: [
        'Just starting research',
        'Shortlisted universities',
        'Applications submitted',
        'Received conditional offer',
        'Received unconditional offer',
        'Currently enrolled / deferred entry',
      ],
    },
    {
      id: 'study_level',
      question: 'What level are you planning to study?',
      options: [
        "Bachelor's Degree",
        "Master's Degree",
        'PhD / Doctorate',
        'Diploma or HND',
        'Short course / Bootcamp',
        'Foundation year',
      ],
    },
    {
      id: 'study_field',
      question: 'What field are you planning to study?',
      options: [
        'STEM (Science, Engineering, Maths, Computing)',
        'Medicine / Healthcare / Nursing',
        'Business / Management / Finance / MBA',
        'Law',
        'Arts / Humanities / Social Sciences',
        'Education',
        'Other',
      ],
    },
    {
      id: 'funding_status',
      question: 'What is your funding situation?',
      options: [
        'Fully self-funded',
        'Seeking a full scholarship',
        'Seeking partial funding / bursary',
        'Partial funding secured',
        'Fully funded — scholarship confirmed',
      ],
    },
  ],

  'Moving to join family abroad': [
    {
      id: 'sponsor_relation',
      question: 'Who is already abroad that you will be joining?',
      options: [
        'Spouse / Partner',
        'Parent(s)',
        'Child (you are the parent joining)',
        'Sibling',
        'Other close relative',
      ],
    },
    {
      id: 'sponsor_status',
      question: 'What immigration status does your family member currently hold?',
      options: [
        'Citizen of that country (born or naturalised)',
        'Permanent Resident (PR / ILR / Settled Status)',
        'On a Skilled Worker / Employment Visa',
        'On a Student Visa',
        'Not sure of their exact status',
      ],
    },
    {
      id: 'sponsor_duration',
      question: 'How long has your family member been living in that country?',
      options: [
        'Less than 1 year',
        '1 – 2 years',
        '3 – 5 years',
        '5+ years',
        'They were born there / are a citizen by birth',
      ],
    },
  ],

  'Explorer / Not sure yet': [
    {
      id: 'explorer_employment',
      question: 'What is your current employment situation?',
      options: [
        'Employed full-time at a company',
        'Self-employed / business owner',
        'Freelancer / contractor',
        'Unemployed / between roles',
        'Student',
      ],
    },
    {
      id: 'explorer_motivation',
      question: 'What is your primary motivation for considering relocation?',
      options: [
        'Better career opportunities and higher salary',
        'Quality of life, security, and stability',
        'Education — studying or sending children abroad',
        'Family reasons',
        'Business expansion',
        'A combination of all of the above',
      ],
    },
    {
      id: 'explorer_timeline',
      question: 'What is your approximate target timeline for relocating?',
      options: [
        'Within 6 months',
        'Within 1 year',
        '1 – 2 years',
        '2 – 5 years',
        'Just exploring — no fixed timeline',
      ],
    },
  ],
}

// ─── Universal follow-up questions (shown to ALL segments after segment-specific) ─
export const universalFollowUps = [
  {
    id: 'experience',
    question: 'How many years of professional work experience do you have in total?',
    options: ['0 – 1 year', '2 – 3 years', '4 – 6 years', '7 – 10 years', '10+ years'],
  },
  {
    id: 'education',
    question: 'What is your highest level of education?',
    options: [
      'High School / WAEC / NECO',
      'Diploma / OND / NCE',
      "Bachelor's Degree (BSc / BA / MBBS / BPharm / LLB etc.)",
      "Master's Degree (MSc / MBA / MA / LLM etc.)",
      'PhD / Doctorate',
    ],
  },
  {
    id: 'language',
    question: 'What is your English language test status?',
    options: [
      'Not taken',
      'Registered / scheduled',
      'IELTS Academic — below 6.0',
      'IELTS Academic — 6.0 to 6.5',
      'IELTS Academic — 7.0 to 7.5',
      'IELTS Academic — 8.0+',
      'OET (Occupational English Test) — for healthcare',
      'TOEFL iBT',
      'CELPIP — for Canada',
    ],
  },
  {
    id: 'savings',
    question: 'How much do you currently have in accessible savings?',
    options: ['Less than ₦1M', '₦1M – ₦5M', '₦5M – ₦10M', '₦10M – ₦20M', '₦20M+'],
  },
  {
    id: 'age',
    question: 'What is your current age range?',
    options: ['Under 20', '20 – 24', '25 – 30', '31 – 35', '36 – 40', '41 – 45', '46+'],
  },
  {
    id: 'family_situation',
    question: 'Who will be relocating with you?',
    options: [
      'Just me — moving alone',
      'My partner / spouse only',
      'Partner + children',
      'Children only (single parent)',
      'Other family members',
    ],
  },
]

// ─── Scoring maps (single source of truth — used by both calculateScore and calculateScoreBreakdown) ──
const EXP_MAP = {
  '0 – 1 year': 4, '2 – 3 years': 10, '4 – 6 years': 18,
  '7 – 10 years': 25, '10+ years': 30,
  '0–1': 4, '2–3': 10, '4–6': 18, '7–10': 25, '10+': 30,
}
const EDU_MAP = {
  'High School / WAEC / NECO': 4,
  'Diploma / OND / NCE': 8,
  "Bachelor's Degree (BSc / BA / MBBS / BPharm / LLB etc.)": 14,
  "Master's Degree (MSc / MBA / MA / LLM etc.)": 18,
  'PhD / Doctorate': 20,
  'High School': 4, 'Diploma': 8, "Bachelor's": 14, "Master's": 18, 'PhD': 20,
}
const LANG_MAP = {
  'Not taken': 0, 'Registered / scheduled': 2,
  'IELTS Academic — below 6.0': 4,
  'IELTS Academic — 6.0 to 6.5': 10,
  'IELTS Academic — 7.0 to 7.5': 16,
  'IELTS Academic — 8.0+': 20,
  'OET (Occupational English Test) — for healthcare': 18,
  'TOEFL iBT': 14, 'CELPIP — for Canada': 16,
  'Scheduled': 2, 'IELTS <6.0': 4, 'IELTS 6.0–6.5': 10,
  'IELTS 7.0–8.0': 16, 'IELTS 8.0+': 20, 'CELPIP': 16, 'TOEFL': 14,
  'German B1+': 14, 'French B1+': 14,
}
const AGE_MAP = {
  'Under 20': 2, '20 – 24': 6, '25 – 30': 10, '31 – 35': 10,
  '36 – 40': 7, '41 – 45': 4, '46+': 2,
  '20–24': 6, '25–30': 10, '31–35': 10, '36–40': 7, '41–45': 4,
}
const SAVINGS_MAP = {
  'Less than ₦1M': 0, '₦1M – ₦5M': 3, '₦5M – ₦10M': 6,
  '₦10M – ₦20M': 8, '₦20M+': 10,
  '< ₦1M': 0, '₦1M–5M': 3, '₦5M–10M': 6, '₦10M–20M': 8,
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
export function calculateScore(answers) {
  let score = 0
  score += EXP_MAP[answers.experience] || 0
  score += EDU_MAP[answers.education] || 0
  score += LANG_MAP[answers.language] || 0
  score += AGE_MAP[answers.age] || 0
  score += SAVINGS_MAP[answers.savings] || 0
  score += calculateBonus(answers)
  return Math.min(score, 100)
}

// ─── Score breakdown (exact same maps — guaranteed to match calculateScore) ───
export function calculateScoreBreakdown(answers) {
  const exp  = EXP_MAP[answers.experience] || 0
  const edu  = EDU_MAP[answers.education] || 0
  const lang = LANG_MAP[answers.language] || 0
  const age  = AGE_MAP[answers.age] || 0
  const sav  = SAVINGS_MAP[answers.savings] || 0
  const bonus = calculateBonus(answers)
  return [
    { label: 'Experience', score: exp,   max: 30 },
    { label: 'Education',  score: edu,   max: 20 },
    { label: 'Language',   score: lang,  max: 20 },
    { label: 'Age',        score: age,   max: 10 },
    { label: 'Savings',    score: sav,   max: 10 },
    { label: 'Profile',    score: bonus, max: 10 },
  ]
}

function calculateBonus(answers) {
  let bonus = 0

  // Job offer bonus (all segments)
  if (answers.job_offer === 'Yes — confirmed offer' || answers.job_offer === 'Yes — confirmed') bonus += 7
  else if (answers.job_offer?.startsWith('In active')) bonus += 3

  // Licensing bonus (healthcare)
  if (answers.licensing_progress === 'All licensing exams passed') bonus += 5
  else if (answers.licensing_progress === 'Already registered with target country medical board (GMC, AMC, etc.)') bonus += 8
  else if (answers.licensing_progress?.includes('Part 1 passed')) bonus += 2
  else if (answers.licensing_progress === 'Fully licensed in target country') bonus += 6
  else if (answers.licensing_progress === 'CBT / Computer-based test passed') bonus += 2

  // Tech certifications bonus
  if (answers.tech_certs && answers.tech_certs !== 'No certifications yet') bonus += 4
  if (answers.data_certs && answers.data_certs !== 'No certifications yet') bonus += 3

  // Finance qualifications bonus
  if (answers.finance_quals && !answers.finance_quals.startsWith('None')) bonus += 4

  // Freelancer: international clients
  if (answers.international_clients === 'Yes — multiple active international clients') bonus += 4
  else if (answers.international_clients === 'Yes — one or two') bonus += 2

  // Freelancer: income level
  if (answers.freelance_income === '$3,000 – $5,000' || answers.freelance_income === '$5,000+') bonus += 3
  else if (answers.freelance_income === '$1,500 – $3,000') bonus += 1

  // Portfolio (product/design)
  if (answers.portfolio_status === 'Strong portfolio — international standard, published online') bonus += 3

  // Legal requalification awareness
  if (answers.requalification_awareness?.startsWith('Yes')) bonus += 3

  // Study: offer received (student)
  if (answers.study_stage === 'Received unconditional offer' || answers.study_stage === 'Currently enrolled / deferred entry') bonus += 5
  else if (answers.study_stage === 'Received conditional offer') bonus += 3

  // Funding confirmed (student)
  if (answers.funding_status === 'Fully funded — scholarship confirmed') bonus += 4

  return Math.min(bonus, 10)
}

export function getScoreFlag(score) {
  if (score >= 70) return 'green'
  if (score >= 40) return 'yellow'
  return 'red'
}

// ─── Segment normaliser (for report page route lookups) ───────────────────────
export function normaliseSegment(segment) {
  const healthcareRoles = ['Medical Doctor', 'Nurse / Midwife', 'Pharmacist', 'Other Healthcare Professional']
  const techRoles = ['Software Engineer / Developer', 'Data / AI / Analytics Professional', 'Product Manager / Designer']
  const careerRoles = ['Finance / Accounting Professional', 'Legal Professional', 'HR / Marketing / Comms Professional']

  if (healthcareRoles.includes(segment)) return 'Healthcare Worker'
  if (techRoles.includes(segment)) return 'Tech Professional'
  if (careerRoles.includes(segment)) return 'Career Professional'
  if (segment === 'Freelancer / Remote Worker') return 'Freelancer or Remote Worker'
  if (segment === 'Student (seeking to study abroad)') return 'Student or Post-Grad'
  if (segment === 'Moving to join family abroad') return 'Parent'
  return segment
}
