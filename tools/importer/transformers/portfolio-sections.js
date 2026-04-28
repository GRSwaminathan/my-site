/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: portfolio sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * payload.template.sections from page-templates.json.
 * Only runs in afterTransform. All selectors verified against migration-work/cleaned.html.
 *
 * Section selectors (from cleaned.html):
 *   section#hero        — line 15
 *   div.stats-bar       — line 41
 *   section#experience  — line 65
 *   section#skills      — line 130
 *   section#certifications — line 214
 *   section#independent — line 245
 *   section#contact     — line 276
 *   footer              — line 291
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Insert Section Metadata block after the section element when style is defined
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
