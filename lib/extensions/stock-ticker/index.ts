import type { EnrichmentField, EnrichmentResult, RowEnrichmentResult } from '../../types';
import { resolveStockTicker } from './resolver';

function isStockTickerField(field: EnrichmentField): boolean {
  const text = `${field.name} ${field.description}`.toLowerCase();
  return text.includes('ticker') || text.includes('stock symbol');
}

export async function enrichStockTickerFields(
  fields: EnrichmentField[],
  rowResult: RowEnrichmentResult,
  firecrawlApiKey: string,
  openaiApiKey: string,
  tickerOverrides?: Record<string, string>,
  openaiBaseUrl?: string,
): Promise<Record<string, EnrichmentResult>> {
  const tickerFields = fields.filter(isStockTickerField);
  if (tickerFields.length === 0) return {};

  const enrichments = rowResult.enrichments;

  // Try common company name field keys from orchestrator output
  const companyName =
    (enrichments.companyName?.value as string | undefined) ||
    (enrichments.company_name?.value as string | undefined) ||
    (enrichments.company?.value as string | undefined);

  // Derive domain from any email-shaped value in originalData
  const emailValue = Object.values(rowResult.originalData ?? {}).find(
    v => typeof v === 'string' && v.includes('@'),
  );
  const domain = emailValue ? emailValue.split('@')[1] : undefined;

  // Check ticker overrides before calling the resolver
  if (tickerOverrides && Object.keys(tickerOverrides).length > 0) {
    const companyKey = companyName?.toLowerCase().trim();
    const domainKey = domain?.toLowerCase().trim();
    const overrideTicker =
      (companyKey && tickerOverrides[companyKey]) ||
      (domainKey && tickerOverrides[domainKey]);

    if (overrideTicker) {
      const output: Record<string, EnrichmentResult> = {};
      for (const field of tickerFields) {
        output[field.name] = {
          field: field.name,
          value: overrideTicker.toUpperCase(),
          confidence: 1,
          source: 'user-override',
        };
      }
      return output;
    }
  }

  const resolved = await resolveStockTicker(
    { companyName, domain },
    firecrawlApiKey,
    openaiApiKey,
    openaiBaseUrl,
  );

  if (!resolved) return {};

  const output: Record<string, EnrichmentResult> = {};
  for (const field of tickerFields) {
    output[field.name] = { field: field.name, ...resolved };
  }
  return output;
}
