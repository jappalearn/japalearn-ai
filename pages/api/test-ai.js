import { generateAIResponse } from '../../lib/ai';
import { SKILLS } from '../../lib/skills';

export default async function handler(req, res) {
  try {
    const { message = "What are the requirements for a UK Skilled Worker visa?" } = req.body;

    // Use the Switchboard to get a response
    // Pass { enrich: true } to trigger RAG + Search
    const response = await generateAIResponse(
      [{ role: 'user', content: message }],
      SKILLS.QA_ASSISTANT,
      { enrich: true }
    );

    res.status(200).json({ 
      success: true, 
      provider: process.env.GEMINI_API_KEY ? 'Gemini 3.1 Pro (via Flash)' : 'OpenAI (gpt-4o-mini)',
      response 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
