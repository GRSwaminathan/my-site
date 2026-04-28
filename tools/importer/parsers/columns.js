/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns variant.
 * Base block: columns
 * Source selector: div.stats-bar
 * Generated: 2026-04-28
 *
 * Source HTML: div.stats-bar contains N .stat children, each with
 * .stat-number and .stat-label spans.
 *
 * Target structure (from library example):
 *   | Columns |  |  |
 *   |---------|--|--|
 *   | col1    | col2 | col3 |
 *
 * Each .stat becomes one column cell containing its number and label.
 * All stats are placed in a single row so the block renders as one
 * multi-column row (columns-N-cols).
 */
export default function parse(element, { document }) {
  // Extract all stat items from source — each becomes a column
  // Select direct .stat children; fallback to direct child divs if class varies
  let statItems = Array.from(element.querySelectorAll(':scope > .stat'));
  if (statItems.length === 0) {
    statItems = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Build one row where each cell holds a stat's number + label
  const row = statItems.map((stat) => {
    const cell = [];

    // Extract stat number (primary metric)
    const number = stat.querySelector('.stat-number');
    if (number) {
      cell.push(number);
    }

    // Extract stat label (description)
    const label = stat.querySelector('.stat-label');
    if (label) {
      cell.push(label);
    }

    // Fallback: if no structured children found, use the stat element itself
    if (cell.length === 0) {
      cell.push(stat);
    }

    return cell;
  });

  // cells is an array of rows; one row with N columns
  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
