---
name: Add Documentation Page
overview: "Add a dedicated Documentation page at `/docs` that guides users through all app features (CSV upload, API keys, setup, enrichment, results, export). Changes are strictly additive: one new route and optional header link; no modifications to core enrichment logic, API routes, or existing components."
todos: []
isProject: false
---

# Add Documentation Page

## Scope and constraints

- **Additive only**: New route + optional link in the header. No edits to API routes, strategies, extensions, types, or to the behavior of `CSVUploader`, `UnifiedEnrichmentView`, `EnrichmentTable`, or `detail-modal`.
- **Safe for PR**: Core flow (upload → setup → enrichment → results) and all existing files under `lib/`, `app/api/`, and the fire-enrich component logic remain untouched except for adding a single link in the main page header.

## 1. New route: Documentation page

**Path:** [app/docs/page.tsx](app/docs/page.tsx) (new file)

- Next.js App Router: create `app/docs/page.tsx` so the page is available at `/docs`.
- Use existing UI primitives for consistency: `Card`, `Label`, typography classes from the codebase (e.g. `text-body-large`, `text-title-`*), and shared `Button`/link styles where appropriate. Do not import any enrichment logic or fire-enrich components.
- Optional: Reuse the same header area (e.g. logo + “Back to app” link to `/`) so the docs feel part of the app; keep the header minimal so we don’t depend on `HeaderProvider`/dropdown if that would require passing props or touching core layout.

**Content sections to cover (based on current codebase):**


| Section                     | What to document                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview**                | What Fire Enrich does (email list → enriched dataset via Firecrawl + OpenAI), and the high-level flow: Upload CSV → Configure → Run enrichment → View/export results.                                                                                                                                                                                                                                                                                                                                                                         |
| **API keys**                | Firecrawl and OpenAI keys; setting via `.env.local` (FIRECRAWL_API_KEY, OPENAI_API_KEY) or via the in-app “API Keys Required” modal (BYOK stored in localStorage). Link to Firecrawl and OpenAI key pages.                                                                                                                                                                                                                                                                                                                                    |
| **CSV upload**              | Drag-and-drop or file picker; CSV must have headers and at least one column that can be used as the email column; mention limits (e.g. 15 rows / 5 columns in demo mode, unlimited when self-hosted with `FIRE_ENRICH_UNLIMITED`), per [app/fire-enrich/config.ts](app/fire-enrich/config.ts).                                                                                                                                                                                                                                                |
| **Configure enrichment**    | Step 1: Confirm or change the email column (auto-detected). Step 2: Select up to 10 fields (or 50 in unlimited mode). Preset fields (company name, description, industry, employee count, year founded, headquarters, funding raised, funding stage, stock ticker); adding custom fields (name, description, type); natural-language field generation (“Describe what you want” → AI suggests fields). Optional **stock ticker overrides**: map company name or domain to a ticker symbol so the app uses that instead of resolving via APIs. |
| **Running enrichment**      | Table view with per-row status (pending, processing, completed, error, skipped). Optional agent-activity/chat panel; expanding a row for more detail.                                                                                                                                                                                                                                                                                                                                                                                         |
| **Results**                 | Row detail modal (company info, sources, evidence). Export: **Download CSV**, **Download JSON**, and **Download skipped emails** (from [app/fire-enrich/enrichment-table.tsx](app/fire-enrich/enrichment-table.tsx)). Copy row.                                                                                                                                                                                                                                                                                                               |
| **Limits and self-hosting** | `FIRE_ENRICH_UNLIMITED` and `NODE_ENV=development` enable unlimited rows/columns and higher field/body limits; link to README for clone/run instructions.                                                                                                                                                                                                                                                                                                                                                                                     |


Use clear headings, short paragraphs, and optional bullet lists so the page is scannable. You can add a minimal table of contents at the top (anchor links) if the page gets long.

## 2. Link from the main page header (minimal change)

**File:** [app/page.tsx](app/page.tsx)

- In both header blocks (the one used during the enrichment step and the one used on the upload/setup steps), add a “Documentation” link next to the existing “Use this Template” button.
- Implementation: Add one more link (e.g. `<Link href="/docs">Documentation</Link>` or an `<a href="/docs">`) inside the same `flex gap-8` div that already contains the GitHub button. Use the same visual style (e.g. `ButtonUI variant="tertiary"` or a text link) so the header stays consistent.
- No state, no new handlers, no changes to `step`, `csvData`, or any enrichment logic.

## 3. What not to change

- **Do not modify:** `app/api/`*, `lib/`*, `app/fire-enrich/*` (except the optional header link lives in `app/page.tsx`, which only contains the header and layout for the main flow).
- **Do not move or refactor** existing components or hooks. The docs page should be a standalone page that only imports shared UI (e.g. `@/components/ui/`*, `@/components/shared/button`) and does not import `CSVUploader`, `UnifiedEnrichmentView`, `EnrichmentTable`, or any strategy/API code.
- **Optional:** If you prefer zero changes to the main page, the Documentation page can still be added and users can reach it via direct URL (`/docs`) or a link from the README; the plan above still applies for the docs content and route.

## Summary


| Item       | Action                                                                                                                                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New page   | Create `app/docs/page.tsx` with sections: Overview, API keys, CSV upload, Configure enrichment (email, fields, presets, custom, NL, ticker overrides), Running enrichment, Results (modal, export CSV/JSON/skipped), Limits/self-hosting. |
| Header     | In `app/page.tsx`, add a “Documentation” link to `/docs` in both header `div`s (enrichment + default).                                                                                                                                    |
| Core logic | No changes to enrichment, API, strategies, extensions, or fire-enrich components.                                                                                                                                                         |


This keeps the PR focused on documentation and navigation only, without touching core functions.