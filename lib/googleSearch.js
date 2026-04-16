/**
 * JapaLearn AI Search Engine - Section 3 of Architecture v2.0
 * 
 * Hits Google Custom Search for real-time policy updates, fees, and processing times.
 */

export async function searchMigrationInfo(query) {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    console.warn('Google Search API Key or CX missing. Skipping real-time layer.');
    return [];
  }

  const url = `https://www.googleapis.com/customsearch/v1` +
    `?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
    }));
  } catch (error) {
    console.error('Google Search Error:', error);
    return [];
  }
}

/**
 * Formats search results into a readable string for the AI context.
 */
export function formatSearchResults(results) {
  if (!results || !results.length) return '';
  return results
    .map((r, i) => `[External Source ${i + 1}] ${r.title}\n${r.snippet}\nURL: ${r.url}`)
    .join('\n\n');
}
