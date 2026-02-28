import OpenAI from 'openai';
import { FirecrawlService } from '../../services/firecrawl';
import type { StockTickerContext, StockTickerEnrichmentResult } from './types';

const TICKER_REGEX = /^[A-Z]{1,5}$/;

const PREFERRED_URL_PATTERNS = [
  'investor', 'wikipedia', 'finance.yahoo', 'nasdaq.com',
  'nyse.com', 'marketwatch', 'bloomberg', 'reuters', 'sec.gov',
];

function isPreferredUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return PREFERRED_URL_PATTERNS.some(p => lower.includes(p));
}

export async function resolveStockTicker(
  context: StockTickerContext,
  firecrawlApiKey: string,
  openaiApiKey: string,
): Promise<StockTickerEnrichmentResult | null> {
  const { companyName, domain } = context;
  if (!companyName && !domain) return null;

  const firecrawl = new FirecrawlService(firecrawlApiKey);
  const openai = new OpenAI({ apiKey: openaiApiKey });

  // 1. Search
  const searchTerm = companyName ? `"${companyName}"` : domain!;
  const query = `${searchTerm} stock ticker symbol NASDAQ NYSE`;

  const results = await firecrawl.search(query, { limit: 3, scrapeContent: true });
  if (results.length === 0) return null;

  // 2. Prefer investor relations / financial pages
  const preferred = results.filter(r => isPreferredUrl(r.url));
  const topTwo = (preferred.length > 0 ? preferred : results).slice(0, 2);

  const content = topTwo
    .map(r => `URL: ${r.url}\n${r.markdown || r.description || ''}`)
    .join('\n\n---\n\n')
    .slice(0, 8000);

  if (!content.trim()) return null;

  // 3. Extract via OpenAI
  const subject = companyName || domain;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a financial data extractor. Extract stock ticker symbols from web content. ' +
          'Only return a ticker if you are confident it appears explicitly in the provided content. ' +
          'Return JSON with keys: ticker (string or null), exchange (string or null), source (URL string or null).',
      },
      {
        role: 'user',
        content:
          `Extract the stock ticker symbol for "${subject}" from the content below.\n\n${content}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
    max_tokens: 100,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) return null;

  let parsed: { ticker?: string | null; exchange?: string | null; source?: string | null };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const ticker = parsed.ticker;
  if (!ticker || !TICKER_REGEX.test(ticker)) return null;

  const sourceUrl = parsed.source || topTwo[0]?.url || '';
  const exchange = parsed.exchange || '';

  return {
    value: ticker,
    confidence: 0.85,
    source: sourceUrl || undefined,
    sourceContext: sourceUrl
      ? [{ url: sourceUrl, snippet: `Stock ticker: ${ticker}${exchange ? ` (${exchange})` : ''}` }]
      : undefined,
  };
}
