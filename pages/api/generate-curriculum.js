import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildProfileDescription(answers) {
  const lines = []
  const a = answers

  // Core identity
  lines.push(`PROFESSIONAL ROLE: ${a.segment}`)
  lines.push(`DESTINATION: ${a.destination}`)

  // Healthcare-specific
  if (a.doctor_specialty)          lines.push(`MEDICAL SPECIALTY: ${a.doctor_specialty}`)
  if (a.postgrad_qual)             lines.push(`POSTGRADUATE QUALIFICATION: ${a.postgrad_qual}`)
  if (a.mdcn_status)               lines.push(`MDCN REGISTRATION: ${a.mdcn_status}`)
  if (a.nursing_qual)              lines.push(`NURSING QUALIFICATION: ${a.nursing_qual}`)
  if (a.nursing_environment)       lines.push(`NURSING ENVIRONMENT: ${a.nursing_environment}`)
  if (a.nmcn_status)               lines.push(`NMCN REGISTRATION: ${a.nmcn_status}`)
  if (a.pharmacy_sector)           lines.push(`PHARMACY SECTOR: ${a.pharmacy_sector}`)
  if (a.pcn_status)                lines.push(`PCN REGISTRATION: ${a.pcn_status}`)
  if (a.additional_certs)          lines.push(`ADDITIONAL PHARMACY CERTS: ${a.additional_certs}`)
  if (a.allied_health_role)        lines.push(`ALLIED HEALTH ROLE: ${a.allied_health_role}`)
  if (a.professional_body_status)  lines.push(`PROFESSIONAL BODY STATUS: ${a.professional_body_status}`)
  if (a.licensing_progress)        lines.push(`OVERSEAS LICENSING PROGRESS: ${a.licensing_progress}`)

  // Tech-specific
  if (a.dev_specialisation)        lines.push(`ENGINEERING SPECIALISATION: ${a.dev_specialisation}`)
  if (a.tech_certs)                lines.push(`TECH CERTIFICATIONS: ${a.tech_certs}`)
  if (a.current_work_setup)        lines.push(`CURRENT WORK SETUP: ${a.current_work_setup}`)
  if (a.data_role)                 lines.push(`DATA ROLE: ${a.data_role}`)
  if (a.data_stack)                lines.push(`DATA STACK: ${a.data_stack}`)
  if (a.data_certs)                lines.push(`DATA CERTIFICATIONS: ${a.data_certs}`)
  if (a.pm_design_role)            lines.push(`PRODUCT/DESIGN ROLE: ${a.pm_design_role}`)
  if (a.product_domain)            lines.push(`PRODUCT DOMAIN: ${a.product_domain}`)
  if (a.portfolio_status)          lines.push(`PORTFOLIO STATUS: ${a.portfolio_status}`)

  // Career-specific
  if (a.finance_role)              lines.push(`FINANCE ROLE: ${a.finance_role}`)
  if (a.finance_quals)             lines.push(`FINANCE QUALIFICATIONS: ${a.finance_quals}`)
  if (a.finance_seniority)         lines.push(`SENIORITY: ${a.finance_seniority}`)
  if (a.legal_role)                lines.push(`LEGAL ROLE: ${a.legal_role}`)
  if (a.legal_area)                lines.push(`LEGAL AREA: ${a.legal_area}`)
  if (a.nba_status)                lines.push(`NBA STATUS: ${a.nba_status}`)
  if (a.requalification_awareness) lines.push(`REQUALIFICATION AWARENESS: ${a.requalification_awareness}`)
  if (a.hrmkt_role)                lines.push(`HR/MARKETING ROLE: ${a.hrmkt_role}`)
  if (a.hrmkt_certs)               lines.push(`HR/MARKETING CERTIFICATIONS: ${a.hrmkt_certs}`)
  if (a.hrmkt_seniority)           lines.push(`SENIORITY: ${a.hrmkt_seniority}`)

  // Freelancer-specific
  if (a.freelance_field)           lines.push(`FREELANCE FIELD: ${a.freelance_field}`)
  if (a.freelance_income)          lines.push(`MONTHLY FREELANCE INCOME (USD): ${a.freelance_income}`)
  if (a.international_clients)     lines.push(`INTERNATIONAL CLIENTS: ${a.international_clients}`)
  if (a.business_registration)     lines.push(`BUSINESS REGISTRATION: ${a.business_registration}`)
  if (a.nomad_route)               lines.push(`PREFERRED RELOCATION MODEL: ${a.nomad_route}`)

  // Student-specific
  if (a.study_stage)               lines.push(`STUDY STAGE: ${a.study_stage}`)
  if (a.study_level)               lines.push(`STUDY LEVEL: ${a.study_level}`)
  if (a.study_field)               lines.push(`STUDY FIELD: ${a.study_field}`)
  if (a.funding_status)            lines.push(`FUNDING STATUS: ${a.funding_status}`)

  // Family-specific
  if (a.sponsor_relation)          lines.push(`JOINING: ${a.sponsor_relation}`)
  if (a.sponsor_status)            lines.push(`SPONSOR'S IMMIGRATION STATUS: ${a.sponsor_status}`)
  if (a.sponsor_duration)          lines.push(`SPONSOR TIME ABROAD: ${a.sponsor_duration}`)

  // Universal
  if (a.job_offer)                 lines.push(`JOB OFFER / SPONSORSHIP: ${a.job_offer}`)
  if (a.experience)                lines.push(`TOTAL WORK EXPERIENCE: ${a.experience}`)
  if (a.education)                 lines.push(`HIGHEST EDUCATION: ${a.education}`)
  if (a.language)                  lines.push(`LANGUAGE TEST STATUS: ${a.language}`)
  if (a.savings)                   lines.push(`SAVINGS: ${a.savings}`)
  if (a.age)                       lines.push(`AGE RANGE: ${a.age}`)
  if (a.family_situation)          lines.push(`RELOCATING WITH: ${a.family_situation}`)

  return lines.join('\n')
}

function buildGapInstructions(answers) {
  const gaps = []
  const a = answers

  if (!a.language || a.language === 'Not taken') {
    gaps.push('- URGENT: Language test not taken. A dedicated language preparation module is essential.')
  }
  if (a.savings === 'Less than ₦1M' || a.savings === '< ₦1M') {
    gaps.push('- URGENT: Savings below ₦1M. Financial preparation module is urgent.')
  }
  if (a.licensing_progress === 'Not started at all' || a.licensing_progress === 'Not started') {
    gaps.push('- URGENT: Overseas licensing not started. This is the critical blocker for this person and must be addressed early.')
  }
  if (a.job_offer === 'No' || a.job_offer === 'No — still searching' || a.job_offer === 'Not at this stage yet') {
    gaps.push('- High priority: No job offer yet. Include a dedicated module on securing employment or sponsorship.')
  }
  if (a.portfolio_status && a.portfolio_status !== 'Strong portfolio — international standard, published online') {
    gaps.push('- Gap: Portfolio needs strengthening before applying for roles abroad.')
  }
  if (a.requalification_awareness && a.requalification_awareness.includes('No')) {
    gaps.push('- URGENT: This person does not yet know the requalification requirements. This must be Module 2.')
  }
  if (a.study_stage === 'Just starting research') {
    gaps.push('- Gap: Student is at the very beginning. University selection and application process must be covered thoroughly.')
  }

  return gaps.length > 0 ? `\nGAPS TO ADDRESS:\n${gaps.join('\n')}` : ''
}

function buildRoleSpecificInstructions(answers) {
  const segment = answers.segment || ''
  const destination = answers.destination || ''

  if (segment === 'Medical Doctor') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN MEDICAL DOCTOR GOING TO ${destination}:
- This person is a DOCTOR. Every module must be written from the perspective of a medical professional, not a generic migrant.
- If going to UK: Cover PLAB 1, PLAB 2, GMC registration, NHS structure, Certificate of Sponsorship, Skilled Worker Visa (Health & Care route), OET vs IELTS for doctors.
- If going to Canada: Cover MCCQE Part 1, NAC OSCE, provincial licensing (CPSO, CPSBC etc.), Canadian Resident Matching Service (CaRMS) if applicable.
- If going to Australia: Cover AMC Part 1 (MCQ) and Part 2 (clinical), AHPRA registration, Area of Need positions.
- If going to USA: Cover USMLE Step 1, Step 2 CK, Step 3, ECFMG certification, residency matching.
- Their MDCN certificate verification letter is REQUIRED for all international licensing — this must be in the documents module.
- If their specialty is Surgery: note that surgical fellowships abroad may have different requirements than GPs.
- Do NOT include generic career or job search advice that would apply to non-doctors. Every lesson must be doctor-specific.`
  }

  if (segment === 'Nurse / Midwife') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN NURSE/MIDWIFE GOING TO ${destination}:
- This person is a NURSE or MIDWIFE. Everything must be written from a nursing professional's perspective.
- If going to UK: Cover NMC registration process — CBT (Computer-Based Test), OSCE (Objective Structured Clinical Examination), English language requirements (IELTS 7.0 or OET B), NHS trust sponsorship, Health & Care Worker Visa.
- If going to Canada: Cover NCLEX-RN, provincial nursing regulatory bodies (CNO, CRNBC, etc.), English language test (CELBAN or IELTS).
- If going to Australia: Cover AHPRA registration for nurses, NCLEX or local competency assessment.
- NMCN verification letter and transcript are required — must be in documents module.
- Midwifery has separate registration requirements from nursing — address both if applicable.
- Their nursing environment (ICU, theatre, etc.) affects their competitiveness — mention this explicitly.`
  }

  if (segment === 'Pharmacist') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN PHARMACIST GOING TO ${destination}:
- This person is a PHARMACIST. All content must be specific to pharmacy licensing and practice.
- If going to UK: Cover GPhC (General Pharmaceutical Council) registration, overseas pharmacist assessment, language requirements, working as a pre-registration pharmacist.
- If going to Canada: Cover PEBC (Pharmacy Examining Board of Canada) — Evaluating Exam and Qualifying Exam Parts 1 and 2.
- If going to Australia: Cover AHPRA registration, OCPAS (Overseas Pharmacist Assessment), intern year requirements.
- PCN verification and transcript are required — must be in documents module.
- Hospital/clinical vs. retail pharmacy have different recognition pathways — address their specific sector.`
  }

  if (segment === 'Software Engineer / Developer') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN SOFTWARE ENGINEER GOING TO ${destination}:
- This person is a SOFTWARE ENGINEER. No generic career advice. Everything must be tailored to the tech industry.
- Their engineering specialisation (${answers.dev_specialisation || 'software'}) should inform which platforms, tools, and job portals to focus on.
- Cover tech-specific visa routes: UK Global Talent Visa (Tech Nation endorsement), Canada Global Talent Stream (fast track for tech), Germany ICT Card.
- Cover international job hunting for engineers: LinkedIn, remote-first companies, tech company sponsorship processes.
- If they have no certifications: include a module on building cloud credentials to strengthen the visa application.
- Cover portfolio/GitHub profile optimisation for international job applications.
- Do NOT include anything about IELTS for healthcare, nursing licensing, or non-tech professional bodies.`
  }

  if (segment === 'Finance / Accounting Professional') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN FINANCE PROFESSIONAL GOING TO ${destination}:
- This person works in FINANCE or ACCOUNTING. All content must be specific to this profession.
- Their qualifications (${answers.finance_quals || 'finance quals'}) and seniority (${answers.finance_seniority || 'level'}) should shape the curriculum.
- Cover mutual recognition of ICAN, ACCA, CFA, CIMA in the target country.
- Cover finance-specific job portals, recruitment agencies, and professional networks in ${destination}.
- ACCA and CIMA are internationally recognised — build on existing qualifications.
- Cover the Skilled Worker Visa route for finance professionals — what role codes and salary thresholds apply.
- Do NOT include anything about medical licensing, tech certifications, or unrelated professional content.`
  }

  if (segment === 'Freelancer / Remote Worker') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN FREELANCER GOING TO ${destination}:
- This person is a FREELANCER or REMOTE WORKER. The curriculum must address digital nomad and remote work migration specifically.
- Their freelance field is: ${answers.freelance_field || 'freelance work'}.
- Cover the Digital Nomad Visa for ${destination} if it exists, or the most suitable long-stay/self-employment route.
- Cover proof of income documentation: bank statements, PayPal/Payoneer/Wise history, contracts, invoices.
- Cover tax implications and double taxation agreements — a freelancer moving abroad has unique tax considerations.
- Cover business bank account setup abroad, invoicing from a foreign country, and VAT implications.
- Do NOT frame this as an employment visa journey. This person is self-employed and the curriculum must respect that.`
  }

  if (segment === 'Legal Professional') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN LEGAL PROFESSIONAL GOING TO ${destination}:
- This person is a LAWYER. Everything must be specific to legal practice and requalification.
- Their area of law is: ${answers.legal_area || 'law'}.
- If going to UK: Cover the SQE (Solicitors Qualifying Examination), QLTS (if legacy route), the Bar Transfer Test for barristers, and which Nigerian qualifications are recognised.
- Cover the role of the Solicitors Regulation Authority (SRA) or Bar Standards Board.
- Cover whether their area of law (corporate, litigation, etc.) has strong demand in ${destination}.
- Cover the Nigerian law degree attestation process and Law School certificate verification.`
  }

  if (segment === 'Student (seeking to study abroad)') {
    return `
ROLE-SPECIFIC CURRICULUM REQUIREMENTS FOR A NIGERIAN STUDENT GOING TO ${destination}:
- This person wants to STUDY ABROAD at ${answers.study_level || 'degree'} level in ${answers.study_field || 'their field'}.
- Cover UCAS/university application process specific to ${destination}.
- Cover scholarship options relevant to their field and level — Nigerian students, Commonwealth scholarships, Chevening, DAAD, etc.
- Cover Student Visa requirements: financial requirements (maintenance funds), CAS statement, bank statement, tuition evidence.
- Cover IELTS/TOEFL requirements for admission — minimum scores by university tier.
- Cover post-study work rights in ${destination}: UK Graduate Route, Canadian PGWP, German Job Seeker Visa.
- Do NOT include content about work visas or employment sponsorship — this person is going to study first.`
  }

  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { answers } = req.body
  if (!answers?.destination || !answers?.segment) {
    return res.status(400).json({ error: 'Missing destination or segment' })
  }

  const profileDescription = buildProfileDescription(answers)
  const gapInstructions = buildGapInstructions(answers)
  const roleInstructions = buildRoleSpecificInstructions(answers)

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a world-class migration curriculum designer who specialises in building deeply personalised learning paths for Nigerians relocating abroad. You have helped thousands of people across every profession — doctors, nurses, engineers, lawyers, freelancers, students.

Your most important rule: NO GENERIC CONTENT. Every lesson title, every module, every word must be written as if it was designed exclusively for this specific person. Two people going to the same country on the same visa route will get completely different curricula if their roles and profiles are different.

A Medical Doctor going to the UK does NOT get the same curriculum as a Software Engineer going to the UK. A Pharmacist going to Canada does NOT get the same first module as a Freelance Designer going to Canada. The profession shapes EVERYTHING.

You write in plain English. You explain what things are before you tell people what to do. You structure the curriculum the way a brilliant, patient friend would guide someone — not the way a government website would.`,
        },
        {
          role: 'user',
          content: `Design a complete, deeply personalised migration curriculum for this specific person.

═══════════════════════════════════════════
FULL PROFILE:
${profileDescription}
═══════════════════════════════════════════
${gapInstructions}
${roleInstructions}

═══════════════════════════════════════════
CURRICULUM DESIGN RULES:
═══════════════════════════════════════════

RULE 1 — ROLE FIRST, ALWAYS
The curriculum must be built around who this person IS professionally. A doctor's first module is about understanding the medical licensing system in ${answers.destination}, not generic immigration. A software engineer's first module is about what visa routes exist for tech workers. Never open with a generic "what is migration" module.

RULE 2 — START WHERE THEY ARE
Based on their licensing progress, job offer status, and specific gaps, start the curriculum at the right point in their journey — not from zero if they're already advanced, not from advanced if they haven't started.

RULE 3 — CHRONOLOGICAL JOURNEY
Modules must follow the real lived order of this person's specific journey:
1. Understanding your specific route (from this person's professional angle)
2. Eligibility & self-assessment (do I qualify right now, given my specific role and credentials?)
3. Preparation — closing the gaps specific to this person's profile
4. Application process — step by step, document by document
5. After approval: pre-departure
6. Arrival & first 30 days in ${answers.destination}

RULE 4 — FLAG URGENT GAPS
If this person has specific gaps (no licensing started, no language test, no job offer), flag those modules as urgent=true.

RULE 5 — HYPER-SPECIFIC LESSON TITLES
Never write a vague lesson like "Understanding Visas". Write: "What is the NHS Health & Care Worker Visa and Why It Was Created for Professionals Like You" or "The PLAB 1 Exam: What it Tests, Who Must Take It, and How Nigerian Doctors Have Passed It".

RULE 6 — EXACTLY 5–8 MODULES, 3–5 LESSONS EACH.

Return ONLY valid JSON in this format:
{
  "title": "Hyper-specific curriculum title that mentions their role, destination, and what they'll achieve",
  "modules": [
    {
      "title": "Module title — specific to this person's role and stage",
      "urgent": true or false,
      "lessons": [
        {
          "title": "Lesson title — never vague, always role-specific and concrete",
          "summary": "One sentence: what this lesson teaches and why it matters to THIS person at THIS stage."
        }
      ]
    }
  ]
}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const curriculum = JSON.parse(completion.choices[0]?.message?.content)
    return res.status(200).json({ curriculum })
  } catch (error) {
    console.error('GROQ ERROR:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
