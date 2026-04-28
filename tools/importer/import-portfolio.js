/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import experienceParser from './parsers/experience.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/portfolio-cleanup.js';
import sectionsTransformer from './transformers/portfolio-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'experience': experienceParser,
  'cards': cardsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'portfolio',
  urls: [
    'file:///workspace/portfolio.html'
  ],
  description: 'Single-page portfolio for a Technical Architect featuring hero, stats bar, work experience timeline, technical skills grid, certifications cards, independent projects, and contact section',
  blocks: [
    {
      name: 'hero',
      instances: ['section#hero .hero-content']
    },
    {
      name: 'columns',
      instances: ['div.stats-bar']
    },
    {
      name: 'experience',
      instances: ['section#experience .timeline']
    },
    {
      name: 'cards',
      instances: ['section#skills .skills-grid', 'section#certifications .certs-grid', 'section#independent .projects-grid']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: 'section#hero',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-stats',
      name: 'Stats Bar',
      selector: 'div.stats-bar',
      style: 'dark-surface',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-experience',
      name: 'Work Experience',
      selector: 'section#experience',
      style: 'dark-alt',
      blocks: ['experience'],
      defaultContent: ['section#experience .section-header h2']
    },
    {
      id: 'section-skills',
      name: 'Technical Skills',
      selector: 'section#skills',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: ['section#skills .section-header h2']
    },
    {
      id: 'section-certifications',
      name: 'Certifications',
      selector: 'section#certifications',
      style: 'dark-alt',
      blocks: ['cards'],
      defaultContent: ['section#certifications .section-header h2']
    },
    {
      id: 'section-projects',
      name: 'Independent Projects',
      selector: 'section#independent',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: ['section#independent .section-header h2']
    },
    {
      id: 'section-contact',
      name: 'Contact',
      selector: 'section#contact',
      style: 'dark-alt',
      blocks: [],
      defaultContent: ['section#contact .contact-badge', 'section#contact .contact-headline', 'section#contact .contact-links', 'section#contact .hero-cta']
    },
    {
      id: 'section-footer',
      name: 'Footer',
      selector: 'footer',
      style: null,
      blocks: [],
      defaultContent: ['footer .footer-text']
    }
  ]
};

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Run section transformer after cleanup (needs clean DOM)
    if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        sectionsTransformer.call(null, 'afterTransform', main, {
          ...payload,
          template: PAGE_TEMPLATE,
        });
      } catch (e) {
        console.error('Section transformer failed:', e);
      }
    }

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/portfolio',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
