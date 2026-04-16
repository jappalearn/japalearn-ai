import { generateAIResponse } from '../../lib/ai'
import { SKILLS } from '../../lib/skills'
import { searchMigrationInfo, formatSearchResults } from '../../lib/googleSearch'
import { retrieveContext } from '../../lib/rag'

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

/**
 * Build targeted, persona-specific Google search queries.
 * These are concise, high-signal queries that return real policy pages.
 */
function buildSearchQueries(persona, answers, recommendedRoute, gaps) {
  const dest = answers.destination || ''
  const year = new Date().getFullYear()
  const queries = []

  // Always search the main visa route
  if (recommendedRoute && recommendedRoute !== 'N/A') {
    queries.push(`${recommendedRoute} requirements ${year} Nigeria`)
  }

  // Persona-specific targeted queries
  switch (persona) {
    case 'Student / Graduate': {
      const field = answers.study_field || 'international students'
      const level = answers.study_level || 'postgraduate'
      queries.push(`${dest} scholarships ${level} Nigerian students ${year}`)
      queries.push(`${dest} student visa application requirements ${year}`)
      queries.push(`fully funded scholarships ${dest} ${field} ${year}`)
      if (answers.funding_status === 'No funding yet') {
        queries.push(`scholarship funding options Nigerian students ${dest} ${year}`)
      }
      break
    }

    case 'Tech Professional': {
      const spec = answers.dev_specialisation || answers.data_role || answers.pm_design_role || 'software engineer'
      queries.push(`${dest} tech jobs ${spec} visa sponsorship ${year}`)
      queries.push(`${dest} skilled worker visa tech ${year} salary threshold`)
      queries.push(`${dest} employer sponsored work visa requirements Nigeria ${year}`)
      break
    }

    case 'Medical Professional': {
      const role = answers.doctor_specialty || answers.nursing_qual || answers.allied_health_role || 'medical professional'
      queries.push(`${dest} ${role} registration licensing requirements ${year}`)
      queries.push(`${dest} NHS HPCSA medical licensing Nigerian doctors ${year}`)
      queries.push(`${dest} health care worker visa requirements ${year}`)
      if (gaps?.some(g => /exam|language|IELTS|OET/i.test(g))) {
        queries.push(`${dest} medical licensing exam OET IELTS requirements ${year}`)
      }
      break
    }

    case 'Skilled Worker': {
      queries.push(`${dest} skilled worker visa occupation list ${year}`)
      queries.push(`${dest} work permit sponsorship Nigerian skilled workers ${year}`)
      queries.push(`${dest} points based immigration skilled worker ${year}`)
      break
    }

    case 'Business Owner': {
      queries.push(`${dest} business visa investor requirements ${year}`)
      queries.push(`${dest} start up visa entrepreneur requirements ${year}`)
      queries.push(`${dest} business immigration routes Nigerian ${year}`)
      break
    }

    case 'Freelancer / Remote Worker': {
      queries.push(`${dest} digital nomad visa freelancer requirements ${year}`)
      queries.push(`${dest} remote work visa income requirements ${year}`)
      queries.push(`${dest} freelance permit self employed Nigerian ${year}`)
      break
    }

    case 'Parent / Family': {
      queries.push(`${dest} family visa dependent requirements ${year}`)
      queries.push(`${dest} spouse dependent visa application ${year}`)
      queries.push(`${dest} family reunification visa requirements Nigeria ${year}`)
      break
    }

    default:
      queries.push(`${dest} immigration routes options Nigerian ${year}`)
      queries.push(`${dest} work permit visa categories ${year}`)
  }

  // If gaps mention finances/savings, always add a cost query
  if (gaps?.some(g => /financ|saving|fund|cost|money/i.test(g))) {
    queries.push(`${dest} visa application total cost Nigerian ${year}`)
  }

  return queries.slice(0, 4) // Cap at 4 searches to stay within quota
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
  const gaps = ai_data?.topGaps || []

  try {
    // ── Step 1: Build targeted search queries ─────────────────────────────────
    const searchQueries = buildSearchQueries(persona, answers, ai_data?.recommendedRoute, gaps)

    // ── Step 2: Run searches + RAG in parallel ────────────────────────────────
    const ragQuery = `${persona} migration ${answers.destination} visa requirements`
    const [ragContext, ...searchResultSets] = await Promise.all([
      retrieveContext(ragQuery),
      ...searchQueries.map(q => searchMigrationInfo(q))
    ])

    // ── Step 3: Merge and deduplicate search results ──────────────────────────
    const allResults = searchResultSets.flat()
    const seen = new Set()
    const uniqueResults = allResults.filter(r => {
      if (seen.has(r.url)) return false
      seen.add(r.url)
      return true
    })

    const formattedSearch = formatSearchResults(uniqueResults.slice(0, 10))

    // ── Step 4: Build enriched context block ─────────────────────────────────
    let contextBlock = ''
    if (ragContext) {
      contextBlock += `\nKNOWLEDGE BASE (RAG):\n${ragContext}\n`
    }
    if (formattedSearch) {
      contextBlock += `\nREAL-TIME SEARCH RESULTS (Google):\n${formattedSearch}\n`
    }

    // ── Step 5: Build the AI prompt ───────────────────────────────────────────
    const prompt = `Build a persona-specific migration curriculum following these exact instructions.

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
${gaps.join(', ') || 'N/A'}
═══════════════════════════════════════════
${contextBlock ? `\nVERIFIED REAL-WORLD CONTEXT (use this to ground your modules and lessons):\n${contextBlock}\n` : ''}
═══════════════════════════════════════════

GENERATION RULES:
1. PERSONA FIRST: Use the ${persona} module structure as your base template.
2. OBJECTIVE: Prioritise the user's professional goal (${answers.segment}).
3. BLOCKER FIRST: The biggest identified gap goes in Module 1. Gaps: ${gaps.join(', ') || 'none detected'}.
4. DEPTH: Match lesson complexity to ${readiness} readiness level.
5. OUTCOME: Every lesson must end with a concrete next action.
6. GROUND IN SEARCH: Use the verified real-world context above for visa names, fees, timelines, exam names, and official bodies. Never invent these.
7. MODULE COUNT: Generate between 5 and 10 modules. Add more modules if the user has complex needs (multiple blockers, advanced persona, unfamiliar destination). Do not cap at 5–8.
8. LESSONS PER MODULE: Each module should have 2–5 lessons depending on complexity.

REQUIRED JSON OUTPUT FORMAT:
{
  "persona": "${persona}",
  "goal": "Clarify their specific migration goal based on their profile",
  "route": "${ai_data?.recommendedRoute || 'Best fit route'}",
  "readiness_level": "${readiness}",
  "curriculum_title": "Actionable, role-specific title",
  "module_order_reason": "Explain why this sequence solves their biggest blockers first",
  "modules": [
    {
      "module_id": "m1",
      "title": "Module Title",
      "purpose": "What this stage accomplishes",
      "priority": 1,
      "lessons": [
        {
          "title": "Specific Lesson Title",
          "goal": "One sentence outcome for this lesson",
          "difficulty": "beginner|intermediate|advanced",
          "estimated_time_minutes": number
        }
      ]
    }
  ],
  "gaps": ["List critical gaps found in their profile"],
  "next_best_action": "The single most important next step for this person right now"
}`

    // ── Step 6: Call AI (no enrich flag — we already injected the context) ────
    const responseText = await generateAIResponse(
      [{ role: 'user', content: prompt }],
      SKILLS.CURRICULUM_BUILDER,
      { enrich: false }
    )

    const curriculum = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim())
    return res.status(200).json({ curriculum })
  } catch (error) {
    console.error('AI CURRICULUM ERROR:', error.message)
    return res.status(500).json({ error: error.message })
  }
}
