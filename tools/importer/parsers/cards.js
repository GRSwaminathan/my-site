/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards variant.
 * Base block: cards
 * Source: file:///workspace/portfolio.html
 * Instances:
 *   - section#skills .skills-grid (skill groups with title + tags)
 *   - section#certifications .certs-grid (cert cards with year, name, issuer)
 *   - section#independent .projects-grid (project cards with icon, title, description)
 * Generated: 2026-04-28
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which card variant we are dealing with based on child structure
  const skillGroups = element.querySelectorAll(':scope > .skill-group');
  const certCards = element.querySelectorAll(':scope > .cert-card');
  const projectCards = element.querySelectorAll(':scope > .project-card');

  if (skillGroups.length > 0) {
    // Skills grid: each .skill-group becomes a card row
    // No image; title is .skill-group-title, body is comma-joined skill tags
    skillGroups.forEach((group) => {
      const title = group.querySelector('.skill-group-title');
      const tags = Array.from(group.querySelectorAll('.skill-tag'));
      const contentCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        contentCell.push(strong);
      }
      if (tags.length > 0) {
        const tagText = document.createElement('p');
        tagText.textContent = tags.map((t) => t.textContent.trim()).join(', ');
        contentCell.push(tagText);
      }
      cells.push(contentCell);
    });
  } else if (certCards.length > 0) {
    // Certifications grid: each .cert-card becomes a card row
    // No image; title is .cert-name, body is year + issuer
    certCards.forEach((card) => {
      const year = card.querySelector('.cert-year');
      const name = card.querySelector('.cert-name');
      const issuer = card.querySelector('.cert-issuer');
      const contentCell = [];
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        contentCell.push(strong);
      }
      if (year) {
        const yearP = document.createElement('p');
        yearP.textContent = year.textContent.trim();
        contentCell.push(yearP);
      }
      if (issuer) {
        const issuerP = document.createElement('p');
        issuerP.textContent = issuer.textContent.trim();
        contentCell.push(issuerP);
      }
      cells.push(contentCell);
    });
  } else if (projectCards.length > 0) {
    // Projects grid: each .project-card becomes a card row
    // No image; title is .project-title, body is .project-desc
    projectCards.forEach((card) => {
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      const contentCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        contentCell.push(strong);
      }
      if (desc) {
        contentCell.push(desc);
      }
      cells.push(contentCell);
    });
  } else {
    // Generic fallback: treat direct children as card items
    const children = element.querySelectorAll(':scope > div, :scope > article, :scope > li');
    children.forEach((child) => {
      const heading = child.querySelector('h1, h2, h3, h4, h5, h6, strong, [class*="title"]');
      const desc = child.querySelector('p, [class*="desc"], [class*="text"]');
      const contentCell = [];
      if (heading) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        contentCell.push(strong);
      }
      if (desc) {
        contentCell.push(desc);
      }
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
