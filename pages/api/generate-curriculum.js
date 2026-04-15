import { generateAIResponse } from '../../lib/ai'
import { SKILLS } from '../../lib/skills'

function buildProfileDescription(answers) {
  const lines = []
  const a = answers

  lines.push(`PROFESSIONAL ROLE: ${a.segment}`)
  lines.push(`DESTINATION: ${a.destination}`)

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
  if (a.dev_specialisation)        lines.push(`ENGINEERING SPECIALISATION: ${a.dev_specialisation}`)
  if (a.tech_certs)                lines.push(`TECH CERTIFICATIONS: ${a.tech_certs}`)
  if (a.current_work_setup)        lines.push(`CURRENT WORK SETUP: ${a.current_work_setup}`)
  if (a.data_role)                 lines.push(`DATA ROLE: ${a.data_role}`)
  if (a.data_stack)                lines.push(`DATA STACK: ${a.data_stack}`)
  if (a.data_certs)                lines.push(`DATA CERTIFICATIONS: ${a.data_certs}`)
  if (a.pm_design_role)            lines.push(`PRODUCT/DESIGN ROLE: ${a.pm_design_role}`)
  if (a.product_domain)            lines.push(`PRODUCT DOMAIN: ${a.product_domain}`)
  if (a.portfolio_status)          lines.push(`PORTFOLIO STATUS: ${a.portfolio_status}`)
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
  if (a.freelance_field)           lines.push(`FREELANCE FIELD: ${a.freelance_field}`)
  if (a.freelance_income)          lines.push(`MONTHLY FREELANCE INCOME (USD): ${a.freelance_income}`)
  if (a.international_clients)     lines.push(`INTERNATIONAL CLIENTS: ${a.international_clients}`)
  if (a.business_registration)     lines.push(`BUSINESS REGISTRATION: ${a.business_registration}`)
  if (a.nomad_route)               lines.push(`PREFERRED RELOCATION MODEL: ${a.nomad_route}`)
  if (a.study_stage)               lines.push(`STUDY STAGE: ${a.study_stage}`)
  if (a.study_level)               lines.push(`STUDY LEVEL: ${a.study_level}`)
  if (a.study_field)               lines.push(`STUDY FIELD: ${a.study_field}`)
  if (a.funding_status)            lines.push(`FUNDING STATUS: ${a.funding_status}`)
  if (a.sponsor_relation)          lines.push(`JOINING: ${a.sponsor_relation}`)
  if (a.sponsor_status)            lines.push(`SPONSOR'S IMMIGRATION STATUS: ${a.sponsor_status}`)
  if (a.sponsor_duration)          lines.push(`SPONSOR TIME ABROAD: ${a.sponsor_duration}`)
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
  if (!a.language || a.language === 'Not taken')
    gaps.push('- URGENT: Language test not taken. A dedicated language preparation module is essential.')
  if (a.savings === 'Less than ₦1M' || a.savings === '< ₦1M')
    gaps.push('- URGENT: Savings below ₦1M. Financial preparation module is urgent.')
  if (a.licensing_progress === 'Not started at all' || a.licensing_progress === 'Not started')
    gaps.push('- URGENT: Overseas licensing not started. This is the critical blocker and must be addressed early.')
  if (a.job_offer === 'No' || a.job_offer === 'No — still searching' || a.job_offer === 'Not at this stage yet')
    gaps.push('- High priority: No job offer yet. Include a dedicated module on securing employment or sponsorship.')
  return gaps.length > 0 ? `\nGAPS TO ADDRESS:\n${gaps.join('\n')}` : ''
}

function buildRoleSpecificInstructions(answers) {
  const segment = answers.segment || ''
  const destination = answers.destination || ''

  if (segment === 'Medical Doctor') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN MEDICAL DOCTOR GOING TO ${destination}:
- Everything must be written from a doctor's perspective, not a generic migrant.
- UK: Cover PLAB 1, PLAB 2, GMC registration, OET vs IELTS for doctors, NHS Certificate of Sponsorship, Health & Care Worker Visa.
- Canada: Cover MCCQE Part 1, NAC OSCE, provincial licensing (CPSO etc.), CaRMS if applicable.
- Australia: Cover AMC Part 1 (MCQ), AMC Part 2 (clinical), AHPRA registration, Area of Need positions.
- USA: Cover USMLE Step 1, Step 2 CK, Step 3, ECFMG certification, residency matching.
- MDCN certificate verification letter is required for all international licensing — include in documents module.
- Specialty (${answers.doctor_specialty || 'general'}) should shape which pathways and fellowships are discussed.`

  if (segment === 'Nurse / Midwife') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN NURSE/MIDWIFE GOING TO ${destination}:
- UK: NMC registration — CBT, OSCE, IELTS 7.0 or OET B, NHS trust sponsorship, Health & Care Worker Visa.
- Canada: NCLEX-RN, provincial nursing bodies (CNO, CRNBC), CELBAN or IELTS.
- Australia: AHPRA registration, NCLEX or local competency assessment.
- NMCN verification letter required — must be in documents module.
- Nursing environment (${answers.nursing_environment || 'general'}) affects competitiveness — address this.`

  if (segment === 'Pharmacist') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN PHARMACIST GOING TO ${destination}:
- UK: GPhC registration, overseas pharmacist assessment, pre-registration intern year.
- Canada: PEBC Evaluating Exam and Qualifying Exam Parts 1 and 2.
- Australia: AHPRA registration, OCPAS, intern year requirements.
- PCN verification and transcript required — in documents module.
- Their sector (${answers.pharmacy_sector || 'general'}) affects recognition pathway.`

  if (segment === 'Software Engineer / Developer') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN SOFTWARE ENGINEER GOING TO ${destination}:
- Specialisation: ${answers.dev_specialisation || 'software development'}.
- Cover tech-specific visa routes: UK Global Talent Visa, Canada Global Talent Stream, Germany ICT Card.
- Cover international job hunting: LinkedIn, remote-first companies, tech company sponsorship.
- If no certifications: include a module on building cloud credentials.
- Cover GitHub/portfolio optimisation for international applications.`

  if (segment === 'Finance / Accounting Professional') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN FINANCE PROFESSIONAL GOING TO ${destination}:
- Qualifications: ${answers.finance_quals || 'finance qualifications'}, Seniority: ${answers.finance_seniority || 'professional level'}.
- Cover mutual recognition of ICAN, ACCA, CFA, CIMA in target country.
- Cover finance-specific job portals, recruitment agencies, and networks in ${destination}.
- Cover Skilled Worker Visa for finance professionals — role codes and salary thresholds.`

  if (segment === 'Legal Professional') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN LEGAL PROFESSIONAL GOING TO ${destination}:
- Area of law: ${answers.legal_area || 'law'}.
- UK: SQE, QLTS (legacy), Bar Transfer Test for barristers, SRA/Bar Standards Board.
- Cover Nigerian law degree attestation and Law School certificate verification.`

  if (segment === 'Freelancer / Remote Worker') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN FREELANCER GOING TO ${destination}:
- Freelance field: ${answers.freelance_field || 'freelance work'}.
- Cover Digital Nomad Visa for ${destination} or most suitable self-employment route.
- Cover proof of income: bank statements, PayPal/Payoneer/Wise history, contracts, invoices.
- Cover tax implications, double taxation agreements, VAT.
- Do NOT frame this as an employment visa journey.`

  if (segment === 'Student (seeking to study abroad)') return `
ROLE-SPECIFIC REQUIREMENTS — NIGERIAN STUDENT GOING TO ${destination}:
- Study level: ${answers.study_level || 'degree'}, Field: ${answers.study_field || 'their field'}.
- Cover university application process for ${destination}.
- Cover scholarships: Chevening, Commonwealth, DAAD, etc.
- Cover Student Visa: maintenance funds, CAS, bank statement, tuition evidence.
- Cover post-study work rights: UK Graduate Route, Canadian PGWP, German Job Seeker Visa.`

  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { answers, ai_data } = req.body
  if (!answers?.destination || !answers?.segment) {
    return res.status(400).json({ error: 'Missing destination or segment' })
  }

  const profileDescription = buildProfileDescription(answers)
  const gapInstructions = buildGapInstructions(answers)
  const roleInstructions = buildRoleSpecificInstructions(answers)

  try {
    const responseText = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Design a complete, deeply personalised migration curriculum for this specific person.

═══════════════════════════════════════════
FULL PROFILE:
${profileDescription}
═══════════════════════════════════════════
${gapInstructions}
${roleInstructions}

${ai_data ? `═══════════════════════════════════════════
PHASE 1 AI ANALYSIS RESULTS:
- Recommended Route: ${ai_data.recommendedRoute}
- Estimated Timeline: ${ai_data.estimatedTimelineMonths} months
- Key Strengths: ${ai_data.topStrengths?.join(', ') || 'N/A'}
- Critical Gaps: ${ai_data.topGaps?.join(', ') || 'N/A'}
- Expert Note: ${ai_data.expertNote}
═══════════════════════════════════════════` : ''}

CURRICULUM RULES:
1. ROLE FIRST — build entirely around who this person IS professionally and their exact visa route
2. START WHERE THEY ARE — address their current blockers and gaps first, not from zero
3. PROGRESSIVE ORDER — understanding → eligibility → preparation → application → pre-departure → arrival
4. FLAG CRITICAL BLOCKERS — urgent=true for any module addressing a critical gap or blocker
5. HYPER-SPECIFIC TITLES — every module and lesson title must be concrete, role-specific, and actionable. Never vague.
6. NO REDUNDANCY — each lesson covers unique ground. No overlaps between modules.
7. EXACTLY 5–8 MODULES, 3–5 LESSONS EACH
8. LESSON SUMMARY — each lesson summary must say exactly what it teaches AND why it matters to this specific person (1 sentence)
9. OUTCOME FOCUS — every module links to a real migration milestone

Return ONLY valid JSON:
{
  "title": "Specific curriculum title mentioning their role, destination, and intended outcome",
  "modules": [
    {
      "title": "Module title — role-specific, outcome-linked, never generic",
      "urgent": false,
      "lessons": [
        {
          "title": "Lesson title — concrete, specific, never vague",
          "summary": "One sentence: what this teaches and exactly why it matters to THIS person's migration journey."
        }
      ]
    }
  ]
}`,
        },
      ],
      SKILLS.CURRICULUM_BUILDER,
      { enrich: true } // 🚀 This triggers RAG + Search grounding
    )

    const curriculum = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''))
    return res.status(200).json({ curriculum })
  } catch (error) {
    console.error('AI CURRICULUM ERROR:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
