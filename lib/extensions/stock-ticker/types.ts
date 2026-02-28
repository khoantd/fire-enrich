import type { EnrichmentResult } from '../../types';

export interface StockTickerContext {
  companyName?: string;
  domain?: string;
}

export type StockTickerEnrichmentResult = Omit<EnrichmentResult, 'field'>;
