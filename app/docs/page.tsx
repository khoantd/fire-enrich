import Link from "next/link";
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/shared/button/button";

export const metadata = {
  title: "Documentation – Fire Enrich",
  description: "Learn how to use Fire Enrich to enrich your leads with clean data.",
};

export default function DocsPage() {
  return (
    <HeaderProvider>
    <div className="min-h-screen bg-background-base">
      {/* Minimal header */}
      <div className="sticky top-0 left-0 w-full z-40 bg-background-base border-b border-black-alpha-4">
        <div className="max-w-[900px] mx-auto w-full flex justify-between items-center py-20 px-16">
          <div className="flex gap-24 items-center">
            <HeaderBrandKit />
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/">
              <ButtonUI variant="tertiary">← Back to app</ButtonUI>
            </Link>
            <a
              className="contents"
              href="https://github.com/firecrawl/fire-enrich"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ButtonUI variant="tertiary">
                <GithubIcon />
                Use this Template
              </ButtonUI>
            </a>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-[900px] mx-auto px-16 py-40">
        {/* Title */}
        <div className="mb-32">
          <h1 className="text-title-h1 text-zinc-900 mb-8">Documentation</h1>
          <p className="text-body-large text-zinc-600">
            Everything you need to know about using Fire Enrich to turn an email list into a fully enriched dataset.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-40 p-16 bg-black-alpha-4 rounded-12">
          <p className="text-label-medium text-zinc-500 uppercase tracking-wide mb-8">Contents</p>
          <ul className="flex flex-col gap-4">
            {[
              ["#overview", "Overview"],
              ["#api-keys", "API Keys"],
              ["#csv-upload", "CSV Upload"],
              ["#configure-enrichment", "Configure Enrichment"],
              ["#running-enrichment", "Running Enrichment"],
              ["#results", "Results & Export"],
              ["#limits-self-hosting", "Limits & Self-Hosting"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-body-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <div className="flex flex-col gap-48">

          {/* Overview */}
          <section id="overview">
            <h2 className="text-title-h2 text-zinc-900 mb-12">Overview</h2>
            <p className="text-body-large text-zinc-700 mb-8">
              Fire Enrich turns a plain CSV of email addresses into a rich dataset of company information.
              It uses <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">Firecrawl</a> to crawl the web and OpenAI to extract structured fields.
            </p>
            <p className="text-body-medium text-zinc-600 mb-12">High-level flow:</p>
            <ol className="list-decimal list-inside flex flex-col gap-6 text-body-medium text-zinc-700">
              <li><strong>Upload CSV</strong> — drag-and-drop or file picker</li>
              <li><strong>Configure</strong> — select the email column and choose the fields to enrich</li>
              <li><strong>Run enrichment</strong> — Fire Enrich processes each row in the background</li>
              <li><strong>View &amp; export results</strong> — inspect details per row and download CSV or JSON</li>
            </ol>
          </section>

          {/* API Keys */}
          <section id="api-keys">
            <h2 className="text-title-h2 text-zinc-900 mb-12">API Keys</h2>
            <p className="text-body-large text-zinc-700 mb-12">
              Fire Enrich requires two API keys to operate.
            </p>

            <div className="flex flex-col gap-16">
              <div className="p-16 bg-black-alpha-4 rounded-12">
                <p className="text-label-large text-zinc-900 mb-4">Firecrawl API Key</p>
                <p className="text-body-medium text-zinc-600 mb-8">
                  Used to crawl company websites and extract raw content.
                  Environment variable: <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">FIRECRAWL_API_KEY</code>
                </p>
                <a
                  href="https://firecrawl.dev/app/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-small underline text-zinc-700"
                >
                  Get a Firecrawl API key →
                </a>
              </div>

              <div className="p-16 bg-black-alpha-4 rounded-12">
                <p className="text-label-large text-zinc-900 mb-4">OpenAI API Key</p>
                <p className="text-body-medium text-zinc-600 mb-8">
                  Used to orchestrate enrichment agents and extract structured fields from crawled pages.
                  Environment variable: <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">OPENAI_API_KEY</code>
                </p>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-small underline text-zinc-700"
                >
                  Get an OpenAI API key →
                </a>
                <p className="text-body-small text-zinc-600 mt-4">
                  <strong>Alternative:</strong> You can use an OpenAI-compatible proxy (e.g.{" "}
                  <a href="https://docs.litellm.ai/docs/proxy/intro" target="_blank" rel="noopener noreferrer" className="underline">LiteLLM</a>
                  ) by setting <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">OPENAI_BASE_URL</code> or{" "}
                  <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">LITELLM_PROXY_URL</code> to your proxy URL (e.g. <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">http://localhost:4000</code>).
                </p>
                <p className="text-body-small text-zinc-600 mt-4">
                  <strong>Model:</strong> Set <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">OPENAI_MODEL</code> (main tasks, default <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">gpt-5</code>) and/or <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">OPENAI_MODEL_MINI</code> (lighter tasks, default <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">gpt-5-mini</code>) in <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">.env</code> to choose the AI model.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <p className="text-body-medium text-zinc-700 mb-4">
                <strong>Two ways to provide keys:</strong>
              </p>
              <ul className="list-disc list-inside flex flex-col gap-4 text-body-medium text-zinc-600">
                <li>
                  <strong>Environment variables</strong> — add them to a <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">.env.local</code> file at the project root (self-hosted only).
                </li>
                <li>
                  <strong>In-app modal (BYOK)</strong> — when keys are not set in the environment, the app shows an "API Keys Required" dialog when you upload a CSV.
                  Keys are stored in <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">localStorage</code> and never sent to any server other than Firecrawl/OpenAI.
                </li>
              </ul>
            </div>
          </section>

          {/* CSV Upload */}
          <section id="csv-upload">
            <h2 className="text-title-h2 text-zinc-900 mb-12">CSV Upload</h2>
            <p className="text-body-large text-zinc-700 mb-12">
              Drag and drop a CSV file onto the upload area or click to open a file picker.
            </p>
            <ul className="list-disc list-inside flex flex-col gap-6 text-body-medium text-zinc-700">
              <li>The file must be a valid CSV with a header row.</li>
              <li>At least one column should contain email addresses — the app auto-detects it.</li>
              <li>
                <strong>Demo mode limits</strong> (hosted version): up to <strong>15 rows</strong> and <strong>5 columns</strong>.
              </li>
              <li>
                <strong>Unlimited mode</strong> (self-hosted with <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">FIRE_ENRICH_UNLIMITED=true</code> or <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">NODE_ENV=development</code>): no row or column limits.
              </li>
            </ul>
          </section>

          {/* Configure Enrichment */}
          <section id="configure-enrichment">
            <h2 className="text-title-h2 text-zinc-900 mb-12">Configure Enrichment</h2>
            <p className="text-body-large text-zinc-700 mb-16">
              After uploading, a two-step configuration panel appears before enrichment starts.
            </p>

            <div className="flex flex-col gap-24">
              <div>
                <h3 className="text-title-h3 text-zinc-900 mb-8">Step 1 — Email column</h3>
                <p className="text-body-medium text-zinc-700">
                  Fire Enrich automatically detects which CSV column contains email addresses.
                  You can confirm the selection or change it using the dropdown.
                </p>
              </div>

              <div>
                <h3 className="text-title-h3 text-zinc-900 mb-8">Step 2 — Fields to enrich</h3>
                <p className="text-body-medium text-zinc-700 mb-8">
                  Select the data points you want extracted for each company. You can choose up to <strong>10 fields</strong> (or <strong>50</strong> in unlimited mode).
                </p>

                <p className="text-label-medium text-zinc-500 mb-6">Preset fields:</p>
                <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-medium text-zinc-700 mb-12">
                  {[
                    "Company name",
                    "Company description",
                    "Industry",
                    "Employee count",
                    "Year founded",
                    "Headquarters",
                    "Funding raised",
                    "Funding stage",
                    "Stock ticker",
                  ].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <p className="text-label-medium text-zinc-500 mb-6">Custom fields:</p>
                <p className="text-body-medium text-zinc-700 mb-12">
                  Click <strong>Add custom field</strong> and provide a name, description, and output type (text, number, boolean, etc.) to extract any other piece of information.
                </p>

                <p className="text-label-medium text-zinc-500 mb-6">Natural-language field generation:</p>
                <p className="text-body-medium text-zinc-700">
                  Use the <strong>"Describe what you want"</strong> input to tell the AI what information you need in plain English.
                  The app will suggest a set of matching fields that you can add with one click.
                </p>
              </div>

              <div>
                <h3 className="text-title-h3 text-zinc-900 mb-8">Stock ticker overrides (optional)</h3>
                <p className="text-body-medium text-zinc-700 mb-8">
                  When the <strong>Stock ticker</strong> field is selected, Fire Enrich normally resolves ticker symbols automatically via APIs.
                  If the auto-detection is wrong, you can supply manual overrides: map a company name or domain to the correct ticker symbol.
                  These overrides take precedence over the automatic lookup.
                </p>
                <ul className="list-disc list-inside flex flex-col gap-4 text-body-medium text-zinc-600">
                  <li>Open the <strong>Ticker overrides</strong> panel in the configuration step.</li>
                  <li>Enter one mapping per line in the format <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">company name or domain → TICKER</code>.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Running Enrichment */}
          <section id="running-enrichment">
            <h2 className="text-title-h2 text-zinc-900 mb-12">Running Enrichment</h2>
            <p className="text-body-large text-zinc-700 mb-12">
              Click <strong>Start enrichment</strong> to begin. Each row is processed independently so the table updates in real time.
            </p>

            <p className="text-label-medium text-zinc-500 mb-6">Row statuses:</p>
            <ul className="list-disc list-inside flex flex-col gap-4 text-body-medium text-zinc-700 mb-12">
              <li><strong>Pending</strong> — waiting to be processed</li>
              <li><strong>Processing</strong> — currently being enriched</li>
              <li><strong>Completed</strong> — enrichment succeeded</li>
              <li><strong>Error</strong> — enrichment failed (hover the row to see the reason)</li>
              <li><strong>Skipped</strong> — row was skipped (e.g. invalid or duplicate email)</li>
            </ul>

            <p className="text-body-medium text-zinc-700">
              An optional <strong>agent activity panel</strong> on the right side shows a live feed of what each enrichment agent is doing, including which URLs were crawled and what data was extracted.
              Click any row to expand it and see a full detail view.
            </p>
          </section>

          {/* Results */}
          <section id="results">
            <h2 className="text-title-h2 text-zinc-900 mb-12">Results &amp; Export</h2>
            <p className="text-body-large text-zinc-700 mb-12">
              Once enrichment is complete (or in progress), you can explore and export the results.
            </p>

            <div className="flex flex-col gap-16">
              <div>
                <h3 className="text-title-h3 text-zinc-900 mb-8">Row detail modal</h3>
                <p className="text-body-medium text-zinc-700">
                  Click any row to open a detail modal showing the enriched company information, the sources Firecrawl crawled, and the evidence used for each extracted field.
                  You can also copy the row data from this modal.
                </p>
              </div>

              <div>
                <h3 className="text-title-h3 text-zinc-900 mb-8">Export options</h3>
                <ul className="list-disc list-inside flex flex-col gap-4 text-body-medium text-zinc-700">
                  <li><strong>Download CSV</strong> — exports all completed rows with enriched columns appended.</li>
                  <li><strong>Download JSON</strong> — exports the full enriched dataset as a JSON array.</li>
                  <li><strong>Download skipped emails</strong> — exports a separate CSV of all skipped rows so you can review or reprocess them.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limits & Self-Hosting */}
          <section id="limits-self-hosting">
            <h2 className="text-title-h2 text-zinc-900 mb-12">Limits &amp; Self-Hosting</h2>
            <p className="text-body-large text-zinc-700 mb-12">
              The hosted demo is intentionally limited to keep costs manageable. Clone the repo to remove all limits.
            </p>

            <div className="overflow-x-auto mb-16">
              <table className="w-full text-body-medium text-zinc-700 border-collapse">
                <thead>
                  <tr className="border-b border-black-alpha-8">
                    <th className="text-left py-8 pr-16 text-label-medium text-zinc-500">Setting</th>
                    <th className="text-left py-8 pr-16 text-label-medium text-zinc-500">Demo (hosted)</th>
                    <th className="text-left py-8 text-label-medium text-zinc-500">Unlimited (self-hosted)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Max CSV rows", "15", "Unlimited"],
                    ["Max CSV columns", "5", "Unlimited"],
                    ["Max fields per enrichment", "10", "50"],
                    ["Max request body size", "5 MB", "50 MB"],
                  ].map(([setting, demo, unlimited]) => (
                    <tr key={setting} className="border-b border-black-alpha-4">
                      <td className="py-8 pr-16">{setting}</td>
                      <td className="py-8 pr-16 text-zinc-500">{demo}</td>
                      <td className="py-8 text-zinc-900 font-medium">{unlimited}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-body-medium text-zinc-700 mb-8">
              To enable unlimited mode, set one of the following environment variables before starting the server:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-4 text-body-medium text-zinc-700 mb-16">
              <li>
                <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">FIRE_ENRICH_UNLIMITED=true</code> — explicitly enable unlimited mode in production.
              </li>
              <li>
                <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">NODE_ENV=development</code> — automatically enabled when running locally with <code className="bg-black-alpha-4 px-4 py-1 rounded-4 text-label-small">npm run dev</code>.
              </li>
            </ul>

            <p className="text-body-medium text-zinc-700">
              To self-host, clone the repository and follow the setup instructions in the{" "}
              <a
                href="https://github.com/firecrawl/fire-enrich"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                README
              </a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-64 pt-24 border-t border-black-alpha-4 flex justify-between items-center">
          <p className="text-body-small text-zinc-400">
            Built with{" "}
            <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">
              Firecrawl
            </a>
          </p>
          <Link href="/">
            <ButtonUI variant="tertiary">← Back to app</ButtonUI>
          </Link>
        </div>
      </main>
    </div>
    </HeaderProvider>
  );
}
