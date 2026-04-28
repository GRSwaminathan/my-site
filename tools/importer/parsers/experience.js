/* eslint-disable */
/* global WebImporter */

/**
 * Parser for experience variant.
 * Base block: experience (custom project block).
 * Source selector: section#experience .timeline
 * Generated: 2026-04-28
 *
 * Extracts work history timeline entries from .job elements.
 * Each job becomes a row with two cells:
 *   Cell 1: Company name + period (from .job-header)
 *   Cell 2: Job title + location + achievement bullets (from .job-title, .job-location, .job-bullets)
 */
export default function parse(element, { document }) {
  const jobs = element.querySelectorAll(':scope > .job');
  const cells = [];

  jobs.forEach((job) => {
    // Cell 1: Company and period
    const headerCell = [];
    const company = job.querySelector('.job-company');
    const period = job.querySelector('.job-period');
    if (company) headerCell.push(company);
    if (period) headerCell.push(period);

    // Cell 2: Role details (title, location, bullets)
    const detailsCell = [];
    const title = job.querySelector('.job-title');
    const location = job.querySelector('.job-location');
    const bullets = job.querySelector('.job-bullets');
    if (title) detailsCell.push(title);
    if (location) detailsCell.push(location);
    if (bullets) detailsCell.push(bullets);

    cells.push([headerCell, detailsCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'experience', cells });
  element.replaceWith(block);
}
