import OpenAI from 'openai';
import { retrieveContext } from './rag';
import { searchMigrationInfo, formatSearchResults } from './googleSearch';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default models
const OPENAI_MODEL = 'gpt-4o-mini'; // Changed to mini for cost efficiency during dev
const GEMINI_MODEL = 'gemini-1.5-pro'; // Ready for when key is added

/**
 * The Master AI Switchboard - Section 0 / 1 / 3 Wiring
 * Handles model selection, context enrichment (RAG + Search), and error fallbacks.
 */
export async function generateAIResponse(messages, skillPrompt = '', options = {}) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const lastUserMessage = messages[messages.length - 1].content;
  
  // 🔍 ENRICHMENT: RAG + Search (The Master Wiring)
  // options.searchQuery: override the query used for RAG/Search (defaults to the raw user message)
  let enrichedContent = lastUserMessage;
  if (options.enrich) {
    const searchQuery = options.searchQuery || lastUserMessage;
    // Perform parallel lookups
    const [ragContext, searchResults] = await Promise.all([
      retrieveContext(searchQuery),
      searchMigrationInfo(searchQuery)
    ]);

    if (ragContext || searchResults.length > 0) {
      enrichedContent = `
        QUESTION: ${lastUserMessage}

        ${ragContext ? `\nKNOWLEDGE BASE CONTEXT:\n${ragContext}` : ''}
        ${searchResults.length > 0 ? `\nREAL-TIME SEARCH RESULTS:\n${formatSearchResults(searchResults)}` : ''}

        INSTRUCTION: Answer the user's question precisely using the context provided above.
      `;
    }
  }

  // Swap enriched message
  const finalMessages = messages.map((m, i) => 
    i === messages.length - 1 ? { ...m, content: enrichedContent } : m
  );

  const systemMessage = skillPrompt ? { role: 'system', content: skillPrompt } : null;
  const fullMessages = systemMessage ? [systemMessage, ...finalMessages] : finalMessages;

  // 🔵 IF GEMINI KEY EXISTS: Use Gemini 1.5 Pro
  if (geminiKey) {
    try {
      // Use standard fetch to keep it library-agnostic
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`;
      
      const contents = finalMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          system_instruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
          generationConfig: { maxOutputTokens: 2000, temperature: 0.3 }
        })
      });

      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn('Gemini failed, falling back to OpenAI...', err);
    }
  }

  // 🟢 FALLBACK: Use OpenAI (gpt-4o-mini)
  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: fullMessages,
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}

export { openai };
