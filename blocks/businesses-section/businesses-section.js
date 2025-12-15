export default function decorate(block) {
  block.classList.add("business-accordion-wrapper");

  const children = [...block.children];

  // --- BUILD HEADER ---
  const header = document.createElement("header");
  header.className = "business-accordion-header";

  const h2 = document.createElement("h2");
  const title = children[0]?.textContent || "";
  const subtitle = children[1]?.textContent || "";
  h2.innerHTML = `<span class="title">${title}</span> <span class="subtitle">${subtitle}</span>`;
  header.appendChild(h2);

  const intro = document.createElement("div");
  intro.className = "intro-text";
  intro.innerHTML = children[2]?.innerHTML || "";
  header.appendChild(intro);

  block.prepend(header);

  // --- CREATE ACCORDION CONTAINER ---
  const accordionContainer = document.createElement("div");
  accordionContainer.className = "business-accordion-container";

  // Keep original business items for AEM UE
  const businessItems = children.slice(3);
  businessItems.forEach((item, index) => {
    item.classList.add("accordion-item", index === 0 ? "active" : "");

    const headerEl = document.createElement("h2");
    headerEl.className = `accordion-header ${index === 0 ? "active" : ""}`;
    headerEl.id = `heading${index}`;

    const button = document.createElement("button");
    button.className = `accordion-button ${index === 0 ? "active" : ""}`;
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", `collapse${index}`);

    const titleEl = item.querySelector(".business-title") || item.children[1];
    if (titleEl) button.textContent = titleEl.textContent;

    headerEl.appendChild(button);
    item.prepend(headerEl);

    // Wrap content in collapse div
    const collapseDiv = document.createElement("div");
    collapseDiv.className = `accordion-collapse collapse ${index === 0 ? "show" : ""}`;
    collapseDiv.id = `collapse${index}`;
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-bs-parent", "#businessAccordion");

    const body = document.createElement("div");
    body.className = "accordion-body";

    // Move description and CTA into body
    const description = item.querySelector(".business-description") || item.children[2];
    if (description) body.appendChild(description);
    const cta = item.querySelector(".business-cta") || item.children[4];
    if (cta) body.appendChild(cta);

    collapseDiv.appendChild(body);
    item.appendChild(collapseDiv);

    accordionContainer.appendChild(item);
  });

  block.appendChild(accordionContainer);

  // Responsive CSS
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 767px) {
      .business-image-preview { display: none !important; }
      .mobile-business-image { display: block !important; margin-top: 20px; width:100%; }
    }
    @media (min-width: 768px) {
      .mobile-business-image { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}
