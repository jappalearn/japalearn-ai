import { addDocument } from '../../../lib/rag';
import { createClient } from '@supabase/supabase-js';

async function checkIsAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return false;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: { user } } = await client.auth.getUser(token);
  return user?.email === 'jappalearn@gmail.com';
}

/**
 * Admin API to ingest initial migration policy data
 * Restricted to authenticated admin users only
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  if (!(await checkIsAdmin(req))) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Initial Seed Data - Example from Architecture Section 2.4
  const seedData = [
    {
      country: 'UK',
      category: 'visa',
      source: 'gov.uk/skilled-worker-visa',
      content: `The UK Skilled Worker visa allows you to come to or stay in the UK to do an eligible job with an approved employer. It has replaced the Tier 2 (General) work visa.

      To qualify for a Skilled Worker visa, you must:
      - Work for a UK employer that's been approved by the Home Office
      - Have a 'certificate of sponsorship' from your employer with information about the role you've been offered in the UK
      - Do a job that's on the list of eligible occupations
      - Be paid a minimum salary - how much depends on the type of work you do

      The specific eligibility depends on your job.`
    },
    {
      country: 'Canada',
      category: 'visa',
      source: 'canada.ca/express-entry',
      content: `Express Entry is an online system that Canada uses to manage applications for permanent residence from skilled workers.

      It covers three immigration programs:
      1. Federal Skilled Worker Program
      2. Federal Skilled Trades Program
      3. Canadian Experience Class

      Provinces and territories can also recruit candidates from the Express Entry pool through the Provincial Nominee Program (PNP) to meet local labour market needs.`
    }
  ];

  try {
    const results = await Promise.all(
      seedData.map(doc => addDocument(doc.content, {
        country: doc.country,
        category: doc.category,
        source_url: doc.source
      }))
    );

    res.status(200).json({ success: true, count: results.length });
  } catch (error) {
    console.error('Ingestion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
