import { normaliseSegment } from './quizData'

/**
 * Logic-based visa route recommendation.
 * Uses destination + segment + quiz answers to pick the best-fit route.
 * This is the fast, deterministic recommendation — shown immediately from quiz data.
 * The AI immigration officer (calculate-readiness) then validates and enriches it.
 */
export function getRecommendedRoute(destination, rawSegment, answers = {}) {
  const segment = normaliseSegment(rawSegment)
  const hasOffer     = answers.job_offer === 'Yes — confirmed offer' || answers.job_offer === 'Yes — confirmed'
  const inInterviews = answers.job_offer?.startsWith('In active')
  const isSenior     = ['7 – 10 years', '10+ years'].includes(answers.experience)
  const isStudent    = segment === 'Student or Post-Grad'
  const isFreelancer = segment === 'Freelancer or Remote Worker'
  const isHealthcare = segment === 'Healthcare Worker'
  const isTech       = segment === 'Tech Professional'
  const isFamily     = rawSegment === 'Moving to join family abroad'

  switch (destination) {
    case 'UK':
      if (isStudent)                                       return 'UK Student Visa (Tier 4)'
      if (isHealthcare)                                    return 'UK Health and Care Worker Visa'
      if (isFamily)                                        return 'UK Family Visa'
      if ((isTech || isFreelancer) && isSenior && !hasOffer && !inInterviews) return 'UK Global Talent Visa'
      return 'UK Skilled Worker Visa'

    case 'Canada':
      if (isStudent)    return 'Canada Study Permit → Post-Graduation Work Permit → PR'
      if (isFamily)     return 'Canada Spousal and Family Sponsorship'
      if (isHealthcare) return 'Canada Express Entry — Federal Skilled Worker'
      return 'Canada Express Entry — Federal Skilled Worker'

    case 'USA':
      if (isStudent)                       return 'USA F-1 Student Visa'
      if (isFamily)                        return 'USA Family-Based Immigrant Visa'
      if (isHealthcare)                    return 'USA EB-3 Immigrant Worker Visa'
      if (isTech && isSenior && !hasOffer) return 'USA O-1A Extraordinary Ability Visa'
      return 'USA H-1B Specialty Occupation Visa'

    case 'Germany':
      if (isStudent)                        return 'Germany Student Visa'
      if (isFreelancer)                     return 'Germany Freelance Visa'
      if (isFamily)                         return 'Germany Family Reunion Visa'
      if (hasOffer || inInterviews)         return 'Germany EU Blue Card'
      return 'Germany Job Seeker Visa'

    case 'Australia':
      if (isStudent)              return 'Australia Student Visa (Subclass 500)'
      if (isHealthcare)           return 'Australia Employer Sponsored Visa (Subclass 482)'
      if (hasOffer || inInterviews) return 'Australia Employer Sponsored Visa (Subclass 482)'
      return 'Australia Skilled Nominated Visa (Subclass 190)'

    case 'Ireland':
      if (isStudent) return 'Ireland Student Visa → 2-Year Graduate Stay Back'
      if (isFamily)  return 'Ireland Family Reunification Visa'
      return 'Ireland Critical Skills Employment Permit'

    case 'Netherlands':
      if (isStudent)    return 'Netherlands Student Visa (MVV)'
      if (isFreelancer) return 'Netherlands Self-Employment Visa (Zelfstandige)'
      if (isFamily)     return 'Netherlands Family Reunification Visa'
      return 'Netherlands Highly Skilled Migrant Visa (Kennismigrant)'

    case 'Portugal':
      if (isFreelancer) return 'Portugal D8 Digital Nomad Visa'
      if (isStudent)    return 'Portugal Student Visa (D4)'
      if (isFamily)     return 'Portugal Family Reunification Visa'
      return 'Portugal D3 Highly Qualified Activity Visa'

    case 'France':
      if (isStudent)    return 'France Long-Stay Student Visa (VLS-TS)'
      if (isFreelancer) return 'France Talent Passport — Innovative Project'
      if (isFamily)     return 'France Family Reunification Visa'
      return 'France Passeport Talent (Highly Skilled Professionals)'

    case 'New Zealand':
      if (isStudent)              return 'New Zealand Student Visa'
      if (isFamily)               return 'New Zealand Partnership / Family Visa'
      if (hasOffer || inInterviews) return 'New Zealand Accredited Employer Work Visa (AEWV)'
      return 'New Zealand Skilled Migrant Category Visa'

    case 'Sweden':
      if (isStudent)    return 'Sweden Student Residence Permit'
      if (isFreelancer) return 'Sweden Self-Employment Permit'
      if (isFamily)     return 'Sweden Family Reunification Permit'
      return 'Sweden Work Permit (Employer Sponsored)'

    case 'Norway':
      if (isStudent)    return 'Norway Student Residence Permit'
      if (isFreelancer) return 'Norway Self-Employed Permit'
      if (isFamily)     return 'Norway Family Immigration Permit'
      return 'Norway Skilled Worker Permit'

    case 'UAE':
      if (isStudent)             return 'UAE Student Visa'
      if (isFreelancer)          return 'UAE Freelance Permit'
      if (isTech && isSenior)    return 'UAE Golden Visa (Talent Category)'
      if (isHealthcare)          return 'UAE Employment Visa (Healthcare Stream)'
      if (isFamily)              return 'UAE Residence Visa (Family Sponsorship)'
      return 'UAE Employment Visa'

    case 'Singapore':
      if (isStudent)           return "Singapore Student's Pass"
      if (isFamily)            return "Singapore Dependant's Pass"
      if (isTech && isSenior)  return 'Singapore Tech.Pass'
      return 'Singapore Employment Pass (EP)'

    default:
      return 'Skilled Worker / Employment Visa'
  }
}
