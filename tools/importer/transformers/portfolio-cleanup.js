/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: portfolio cleanup.
 * Removes non-authorable and decorative elements from the portfolio page.
 * All selectors verified against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove decorative elements that could interfere with block parsing
    // .hero-grid-lines — decorative background grid (line 16 of cleaned.html)
    // .hero-glow — decorative glow effect (line 17 of cleaned.html)
    // .hero-divider-line — decorative line inside hero divider (line 26 of cleaned.html)
    // .section-number — decorative section numbering "01", "02", etc. (lines 67, 131, 219, 247)
    // .section-line — decorative horizontal lines in section headers (lines 69, 133, 221, 249)
    WebImporter.DOMUtils.remove(element, [
      '.hero-grid-lines',
      '.hero-glow',
      '.hero-divider-line',
      '.section-number',
      '.section-line',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable site shell elements
    // nav — site navigation with logo and links (lines 3-11 of cleaned.html)
    // footer — site footer with copyright text (lines 291-294 of cleaned.html)
    WebImporter.DOMUtils.remove(element, [
      'nav',
      'footer',
    ]);
  }
}
