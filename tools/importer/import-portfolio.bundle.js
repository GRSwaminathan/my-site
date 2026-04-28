var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-portfolio.js
  var import_portfolio_exports = {};
  __export(import_portfolio_exports, {
    default: () => import_portfolio_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const image = element.querySelector("img");
    const heading = element.querySelector("h1.hero-name, h1, h2");
    const tag = element.querySelector("p.hero-tag, .hero-tag");
    const subtitle = element.querySelector("p.hero-title, .hero-title");
    const meta = element.querySelector("span.hero-meta, .hero-meta");
    const summary = element.querySelector("p.hero-summary, .hero-summary");
    const ctaLinks = Array.from(
      element.querySelectorAll(".hero-cta a, a.btn, a.button, a.cta")
    );
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    if (heading) {
      cells.push([heading]);
    }
    const descriptionContent = [];
    if (tag) descriptionContent.push(tag);
    if (subtitle) descriptionContent.push(subtitle);
    if (meta) descriptionContent.push(meta);
    if (summary) descriptionContent.push(summary);
    if (descriptionContent.length > 0) {
      cells.push(descriptionContent);
    }
    if (ctaLinks.length > 0) {
      cells.push(ctaLinks);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    let statItems = Array.from(element.querySelectorAll(":scope > .stat"));
    if (statItems.length === 0) {
      statItems = Array.from(element.querySelectorAll(":scope > div"));
    }
    const row = statItems.map((stat) => {
      const cell = [];
      const number = stat.querySelector(".stat-number");
      if (number) {
        cell.push(number);
      }
      const label = stat.querySelector(".stat-label");
      if (label) {
        cell.push(label);
      }
      if (cell.length === 0) {
        cell.push(stat);
      }
      return cell;
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/experience.js
  function parse3(element, { document }) {
    const jobs = element.querySelectorAll(":scope > .job");
    const cells = [];
    jobs.forEach((job) => {
      const headerCell = [];
      const company = job.querySelector(".job-company");
      const period = job.querySelector(".job-period");
      if (company) headerCell.push(company);
      if (period) headerCell.push(period);
      const detailsCell = [];
      const title = job.querySelector(".job-title");
      const location = job.querySelector(".job-location");
      const bullets = job.querySelector(".job-bullets");
      if (title) detailsCell.push(title);
      if (location) detailsCell.push(location);
      if (bullets) detailsCell.push(bullets);
      cells.push([headerCell, detailsCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "experience", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse4(element, { document }) {
    const cells = [];
    const skillGroups = element.querySelectorAll(":scope > .skill-group");
    const certCards = element.querySelectorAll(":scope > .cert-card");
    const projectCards = element.querySelectorAll(":scope > .project-card");
    if (skillGroups.length > 0) {
      skillGroups.forEach((group) => {
        const title = group.querySelector(".skill-group-title");
        const tags = Array.from(group.querySelectorAll(".skill-tag"));
        const contentCell = [];
        if (title) {
          const strong = document.createElement("strong");
          strong.textContent = title.textContent.trim();
          contentCell.push(strong);
        }
        if (tags.length > 0) {
          const tagText = document.createElement("p");
          tagText.textContent = tags.map((t) => t.textContent.trim()).join(", ");
          contentCell.push(tagText);
        }
        cells.push(contentCell);
      });
    } else if (certCards.length > 0) {
      certCards.forEach((card) => {
        const year = card.querySelector(".cert-year");
        const name = card.querySelector(".cert-name");
        const issuer = card.querySelector(".cert-issuer");
        const contentCell = [];
        if (name) {
          const strong = document.createElement("strong");
          strong.textContent = name.textContent.trim();
          contentCell.push(strong);
        }
        if (year) {
          const yearP = document.createElement("p");
          yearP.textContent = year.textContent.trim();
          contentCell.push(yearP);
        }
        if (issuer) {
          const issuerP = document.createElement("p");
          issuerP.textContent = issuer.textContent.trim();
          contentCell.push(issuerP);
        }
        cells.push(contentCell);
      });
    } else if (projectCards.length > 0) {
      projectCards.forEach((card) => {
        const title = card.querySelector(".project-title");
        const desc = card.querySelector(".project-desc");
        const contentCell = [];
        if (title) {
          const strong = document.createElement("strong");
          strong.textContent = title.textContent.trim();
          contentCell.push(strong);
        }
        if (desc) {
          contentCell.push(desc);
        }
        cells.push(contentCell);
      });
    } else {
      const children = element.querySelectorAll(":scope > div, :scope > article, :scope > li");
      children.forEach((child) => {
        const heading = child.querySelector('h1, h2, h3, h4, h5, h6, strong, [class*="title"]');
        const desc = child.querySelector('p, [class*="desc"], [class*="text"]');
        const contentCell = [];
        if (heading) {
          const strong = document.createElement("strong");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/portfolio-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".hero-grid-lines",
        ".hero-glow",
        ".hero-divider-line",
        ".section-number",
        ".section-line"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "nav",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/portfolio-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-portfolio.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "experience": parse3,
    "cards": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "portfolio",
    urls: [
      "file:///workspace/portfolio.html"
    ],
    description: "Single-page portfolio for a Technical Architect featuring hero, stats bar, work experience timeline, technical skills grid, certifications cards, independent projects, and contact section",
    blocks: [
      {
        name: "hero",
        instances: ["section#hero .hero-content"]
      },
      {
        name: "columns",
        instances: ["div.stats-bar"]
      },
      {
        name: "experience",
        instances: ["section#experience .timeline"]
      },
      {
        name: "cards",
        instances: ["section#skills .skills-grid", "section#certifications .certs-grid", "section#independent .projects-grid"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: "section#hero",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-stats",
        name: "Stats Bar",
        selector: "div.stats-bar",
        style: "dark-surface",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-experience",
        name: "Work Experience",
        selector: "section#experience",
        style: "dark-alt",
        blocks: ["experience"],
        defaultContent: ["section#experience .section-header h2"]
      },
      {
        id: "section-skills",
        name: "Technical Skills",
        selector: "section#skills",
        style: "dark",
        blocks: ["cards"],
        defaultContent: ["section#skills .section-header h2"]
      },
      {
        id: "section-certifications",
        name: "Certifications",
        selector: "section#certifications",
        style: "dark-alt",
        blocks: ["cards"],
        defaultContent: ["section#certifications .section-header h2"]
      },
      {
        id: "section-projects",
        name: "Independent Projects",
        selector: "section#independent",
        style: "dark",
        blocks: ["cards"],
        defaultContent: ["section#independent .section-header h2"]
      },
      {
        id: "section-contact",
        name: "Contact",
        selector: "section#contact",
        style: "dark-alt",
        blocks: [],
        defaultContent: ["section#contact .contact-badge", "section#contact .contact-headline", "section#contact .contact-links", "section#contact .hero-cta"]
      },
      {
        id: "section-footer",
        name: "Footer",
        selector: "footer",
        style: null,
        blocks: [],
        defaultContent: ["footer .footer-text"]
      }
    ]
  };
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_portfolio_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
        try {
          transform2.call(null, "afterTransform", main, __spreadProps(__spreadValues({}, payload), {
            template: PAGE_TEMPLATE
          }));
        } catch (e) {
          console.error("Section transformer failed:", e);
        }
      }
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/portfolio",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_portfolio_exports);
})();
