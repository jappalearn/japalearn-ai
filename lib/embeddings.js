import { openai } from './ai';

const EMBEDDING_MODEL = 'text-embedding-3-small';

export async function getEmbedding(text) {
  if (!text) return null;
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}
