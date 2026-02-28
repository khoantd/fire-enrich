# Stock Ticker Extension — Specification

## 1. Overview

Extend Fire Enrich to resolve **stock ticker symbols** (e.g. AAPL, MSFT, WIZ) for companies identified from email/domain. The feature is implemented as a **self-contained extension** that runs after the core orchestrator. No changes are made to the orchestrator or existing agents, keeping the codebase safe for upstream pull requests.

---

## 2. Architecture

### 2.1 Principles

- **Core** = `lib/agent-architecture/orchestrator.ts`, all agents under `lib/agent-architecture/agents/`, and the enrichment flow inside them. **No edits.**
- **Strategy** = `lib/strategies/agent-enrichment-strategy.ts`. **Only file in core that is touched:** after `orchestrator.enrichRow()`, if the user requested a stock-ticker field, call the extension and merge its result into `result.enrichments`.
- **Extension** = New directory `lib/extensions/stock-ticker/` containing all stock-ticker logic. No other core code depends on it except the strategy.

### 2.2 Data Flow

```
User selects "Stock Ticker" (+ other fields) → Start enrichment
    → AgentEnrichmentStrategy.enrichRow(row, fields, ...)
        → orchestrator.enrichRow(...)  [unchanged]
        → result = { enrichments: { companyName: ..., industry: ..., ... } }
        → if any field matches "stock ticker":
            → enrichStockTickerFields(fields, result, firecrawlApiKey, openaiApiKey)
            → merge returned enrichments into result.enrichments
        → return result
```

---

## 3. Extension Module: `lib/extensions/stock-ticker/`

### 3.1 Types (`types.ts`)

**Input context** (passed from strategy):

- `companyName?: string` — from discovery/profile enrichments.
- `domain?: string` — from email (e.g. `wiz.io`).
- `existingEnrichments?: Record<string, unknown>` — optional, to read company name from orchestrator result.

**Output**: Same shape as existing `EnrichmentResult` from `lib/types/index.ts`:

- `field: string`
- `value: string | number | boolean | string[]` (ticker as string)
- `confidence: number`
- `source?: string`
- `sourceContext?: { url: string; snippet: string }[]`

### 3.2 Resolver (`resolver.ts`)

**Responsibility**: Resolve a single stock ticker for a company.

**Inputs**:

- `context: { companyName?: string; domain?: string }`
- `FirecrawlService` (or API key to construct it)
- `OpenAI` usage for extraction (or API key)

**Algorithm**:

1. **Search**: Firecrawl search with query like `"{companyName}" stock ticker symbol NASDAQ NYSE` (fallback to domain if no company name). Limit 2–3 results.
2. **Scrape**: Prefer investor relations, Wikipedia, or financial news URLs; scrape 1–2 pages for content.
3. **Extract**: Use OpenAI with a small structured prompt/schema to extract:
   - `ticker: string` (e.g. "AAPL")
   - `exchange?: string` (e.g. "NASDAQ")
   - `source?: string` (URL used)
4. **Validate**: Ticker format — uppercase letters, length 1–5, no spaces. If invalid, return `null`.
5. **Return**: Single `EnrichmentResult` (field name filled by caller) or `null` if not found/invalid.

**Dependencies**: Reuse existing `FirecrawlService` and `OpenAIService` (or equivalent); no new env vars in base spec. Optional later: `STOCK_TICKER_API_KEY` for a dedicated ticker API.

### 3.3 Public API (`index.ts`)

**Function**: `enrichStockTickerFields(fields, rowResult, firecrawlApiKey, openaiApiKey): Promise<Record<string, EnrichmentResult>>`

- **fields**: `EnrichmentField[]` — requested enrichment fields.
- **rowResult**: Result from `orchestrator.enrichRow()` (has `enrichments` and `originalData`).
- **firecrawlApiKey**, **openaiApiKey**: Strings (from strategy).

**Behavior**:

1. Determine if any requested field is a “stock ticker” field: `field.name` or `field.description` contains (case-insensitive) `"ticker"` or `"stock symbol"`.
2. If none, return `{}`.
3. Otherwise, derive context from `rowResult.enrichments` (e.g. company name) and/or `rowResult.originalData` / email domain.
4. Call resolver once with that context.
5. Map resolver result to each requested stock-ticker field name (e.g. `stockTicker`, `tickerSymbol`) so all such fields get the same value.
6. Return `{ [fieldName]: EnrichmentResult }` for each such field.

---

## 4. Strategy Hook

**File**: `lib/strategies/agent-enrichment-strategy.ts`

**Change**: After `const result = await this.orchestrator.enrichRow(...)` and before the existing “filter null values” logic:

1. Call `enrichStockTickerFields(fields, result, this.firecrawlApiKey, this.openaiApiKey)` (or equivalent; ensure strategy has access to API keys).
2. If the returned object is non-empty, merge it into `result.enrichments`:  
   `Object.assign(result.enrichments, extensionEnrichments)` (or equivalent).
3. No change to skip-list, error handling, or return type; only this additive merge.

**Field matching**: Treat a field as “stock ticker” if its `name` or `description` (case-insensitive) contains `"ticker"` or `"stock symbol"`.

---

## 5. UI Presets

### 5.1 `app/fire-enrich/unified-enrichment-view.tsx`

Add one entry to `PRESET_FIELDS`:

```ts
{
  name: "stockTicker",
  displayName: "Stock Ticker",
  description: "Stock ticker symbol for the company (e.g. AAPL, MSFT). Listed on NASDAQ, NYSE, or other exchange.",
  type: "string",
  required: false,
}
```

### 5.2 `app/fire-enrich/field-mapper.tsx`

Add one entry to `PRESET_FIELDS` (same semantics; use `Omit<EnrichmentField, "name">` shape with `displayName`, `description`, `type`, `required`).

---

## 6. Files Summary

| Action   | Path |
|----------|------|
| **New**  | `lib/extensions/stock-ticker/types.ts` |
| **New**  | `lib/extensions/stock-ticker/resolver.ts` |
| **New**  | `lib/extensions/stock-ticker/index.ts` |
| **Edit** | `lib/strategies/agent-enrichment-strategy.ts` (add extension call + merge) |
| **Edit** | `app/fire-enrich/unified-enrichment-view.tsx` (add 1 preset) |
| **Edit** | `app/fire-enrich/field-mapper.tsx` (add 1 preset) |

No other files are modified. Orchestrator, agents, API route, and services remain unchanged.

---

## 7. Optional Future Enhancements

- **Ticker API**: Optional env var (e.g. `STOCK_TICKER_API_KEY`) and try external API (e.g. Alpha Vantage) first; fallback to Firecrawl + OpenAI.
- **Exchange / company**: Include `exchange` or normalized company name in `sourceContext`.
- **Caching**: Cache ticker by company name/domain per session to reduce duplicate API calls.

---

## 8. Out of Scope (Current Spec)

- Real-time stock prices or historical data.
- Multiple tickers per company (e.g. ADR vs local).
- New environment variables (base implementation uses existing Firecrawl + OpenAI keys only).
