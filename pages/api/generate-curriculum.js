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

// Map the quiz categories to the new Persona system
function getPersona(category) {
  const map = {
    'Student / Graduate': 'Student / Graduate',
    'Tech Professional': 'Tech Professional',
    'Medical Professional': 'Medical Professional',
    'Skilled Worker': 'Skilled Worker',
    'Business Owner': 'Business Owner',
    'Freelancer / Remote Worker': 'Freelancer / Remote Worker',
    'Parent / Family': 'Parent / Family'
  }
  return map[category] || 'Others'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { answers, ai_data } = req.body
  if (!answers?.destination || !answers?.segment) {
    return res.status(400).json({ error: 'Missing destination or segment' })
  }

  const persona = getPersona(answers.category || answers.segment)
  const profileDescription = buildProfileDescription(answers)
  const readiness = ai_data?.overall >= 70 ? 'advanced' : ai_data?.overall >= 40 ? 'intermediate' : 'beginner'

  try {
    const responseText = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Build a persona-specific migration curriculum following these exact instructions.

═══════════════════════════════════════════
USER PROFILE:
Persona: ${persona}
Destination: ${answers.destination}
Readiness Level: ${readiness}
Current Overall Score: ${ai_data?.overall || 'N/A'}
Recommended Route: ${ai_data?.recommendedRoute || 'N/A'}

FULL CONTEXT:
${profileDescription}

GAPS IDENTIFIED:
${ai_data?.topGaps?.join(', ') || 'N/A'}
═══════════════════════════════════════════

GENERATION RULES:
1. RULE 1 (IDENTITY): Use the ${persona} module structure as your base.
2. RULE 2 (OBJECTIVE): Prioritise the user's professional objective (${answers.segment}).
3. RULE 3 (BLOCKER): Solve the biggest gap first. If gaps include "Financial" or "Savings", prioritize funding modules.
4. RULE 4 (DEPTH): Match complexity to ${readiness} readiness.
5. RULE 5 (OUTCOME): Every lesson must help the user decide, prepare, compare, or apply.

REQUIRED JSON OUTPUT FORMAT:
{
  "persona": "${persona}",
  "goal": "Clarify their specific migration goal based on their profile",
  "route": "${ai_data?.recommendedRoute || 'Search for best fit'}",
  "readiness_level": "${readiness}",
  "curriculum_title": "Actionable, role-specific title",
  "module_order_reason": "Explanation of why this sequence solves their blockers",
  "modules": [
    {
      "module_id": "m1",
      "title": "Module Title",
      "purpose": "What this stage accomplishes",
      "priority": 1,
      "lessons": [
        {
          "title": "Specific Lesson Title",
          "goal": "One sentence outcome",
          "difficulty": "beginner|advanced",
          "estimated_time_minutes": number
        }
      ]
    }
  ],
  "gaps": ["List critical gaps seen in profile"],
  "next_best_action": "The single most important next step"
}`,
        },
      ],
      SKILLS.CURRICULUM_BUILDER,
      { enrich: true } // Trigger RAG + Search for verified current facts
    )

    const curriculum = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim())
    return res.status(200).json({ curriculum })
  } catch (error) {
    console.error('AI CURRICULUM ERROR:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
