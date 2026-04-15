import { generateAIResponse } from '../../lib/ai';
import { SKILLS } from '../../lib/skills';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { answers, resultId } = req.body;
  if (!answers) return res.status(400).json({ error: 'Missing answers' });

  try {
    const responseText = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Calculate the migration readiness score for this profile:
          ${JSON.stringify(answers, null, 2)}`
        }
      ],
      SKILLS.READINESS_SCORER,
      { enrich: true }
    );

    const result = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));

    // Save ai_data back to quiz_results so dashboard doesn't re-run this every load
    if (resultId) {
      await supabase
        .from('quiz_results')
        .update({ ai_data: result, score: result.overall })
        .eq('id', resultId);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('READINESS SCORER ERROR:', error);
    return res.status(500).json({ error: error.message });
  }
}
