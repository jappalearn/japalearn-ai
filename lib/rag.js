import { createClient } from '@supabase/supabase-js';
import { getEmbedding } from './embeddings';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function retrieveContext(query) {
  try {
    const embedding = await getEmbedding(query);
    if (!embedding) return '';

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5,
    });

    if (error || !data?.length) return '';
    return data.map(doc => doc.content).join('\n\n---\n\n');
  } catch (err) {
    console.error('RAG Error:', err);
    return '';
  }
}

export async function addDocument(content, metadata = {}) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminClient = serviceRoleKey 
    ? createClient(supabaseUrl, serviceRoleKey) 
    : supabase;

  const embedding = await getEmbedding(content);
  return await adminClient.from('migration_documents').insert({
    content,
    embedding,
    metadata,
    country: metadata.country,
    category: metadata.category,
    source_url: metadata.source_url,
  });
}
