import assert from "node:assert/strict";
import test from "node:test";
import { buildIndexUrl, buildPrimaryDocUrl } from "../src/edgar.js";
import { normalizeHtmlToText } from "../src/normalizer.js";
import { normalizeCik } from "../src/utils.js";

test("normalizeCik pads to 10 digits", () => {
  assert.equal(normalizeCik("320193"), "0000320193");
  assert.equal(normalizeCik("0000320193"), "0000320193");
});

test("EDGAR URL construction", () => {
  const primary = buildPrimaryDocUrl("0000320193", "0000320193-23-000106", "aapl-20230930x10k.htm");
  const index = buildIndexUrl("0000320193", "0000320193-23-000106");
  assert.equal(
    primary,
    "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930x10k.htm"
  );
  assert.equal(
    index,
    "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/0000320193-23-000106-index.html"
  );
});

test("normalizeHtmlToText strips scripts and preserves headings", () => {
  const html = `
    <html>
      <head><style>body{}</style><script>console.log('x')</script></head>
      <body>
        <h1>Item 1. Business</h1>
        <p>We build phones.</p>
        <br />
        <div>Item 2. Risks</div>
      </body>
    </html>
  `;
  const text = normalizeHtmlToText(html);
  assert.ok(text.includes("Item 1. Business"));
  assert.ok(text.includes("We build phones."));
  assert.ok(text.includes("Item 2. Risks"));
  assert.ok(!text.includes("console.log"));
});
