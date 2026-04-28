/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source selector: section#hero .hero-content
 * Generated: 2026-04-28
 *
 * Source HTML structure:
 *   p.hero-tag — tagline text
 *   h1.hero-name — main heading with <em> and <br>
 *   p.hero-title — subtitle / skill keywords
 *   div.hero-divider > span.hero-meta — availability meta
 *   p.hero-summary — summary paragraph
 *   div.hero-cta > a.btn — CTA links
 *
 * Target table (from block library):
 *   Row 1: image (optional, omitted when absent)
 *   Row 2: heading
 *   Row 3: description
 *   Row 4: CTA links
 */
export default function parse(element, { document }) {
  // --- Extract from source DOM (validated selectors) ---

  // Optional background/hero image
  const image = element.querySelector('img');

  // Main heading — h1.hero-name in source, fallback to any h1 or h2
  const heading = element.querySelector('h1.hero-name, h1, h2');

  // Description content — gather supporting text elements
  const tag = element.querySelector('p.hero-tag, .hero-tag');
  const subtitle = element.querySelector('p.hero-title, .hero-title');
  const meta = element.querySelector('span.hero-meta, .hero-meta');
  const summary = element.querySelector('p.hero-summary, .hero-summary');

  // CTA links
  const ctaLinks = Array.from(
    element.querySelectorAll('.hero-cta a, a.btn, a.button, a.cta')
  );

  // --- Build cells array to match block library table structure ---
  const cells = [];

  // Row 1: image (optional — only add if present in source)
  if (image) {
    cells.push([image]);
  }

  // Row 2: heading
  if (heading) {
    cells.push([heading]);
  }

  // Row 3: description — combine all supporting text into one cell
  const descriptionContent = [];
  if (tag) descriptionContent.push(tag);
  if (subtitle) descriptionContent.push(subtitle);
  if (meta) descriptionContent.push(meta);
  if (summary) descriptionContent.push(summary);
  if (descriptionContent.length > 0) {
    cells.push(descriptionContent);
  }

  // Row 4: CTA links
  if (ctaLinks.length > 0) {
    cells.push(ctaLinks);
  }

  // --- Create block and replace element ---
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
