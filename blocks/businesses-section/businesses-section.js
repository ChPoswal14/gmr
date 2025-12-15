export default function decorate(block) {
  const children = [...block.children];

  // --- HEADER ---
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

  // --- WRAPPER ---
  const wrapper = document.createElement("div");
  wrapper.className = "business-accordion-wrapper";
  wrapper.appendChild(header);

  // --- ACCORDION ---
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  accordion.id = "businessAccordion";

  const businessItems = children.slice(3); // skip header & intro

  businessItems.forEach((item, index) => {
    item.classList.add("accordion-item");
    if (index === 0) item.classList.add("active");

    const itemChildren = [...item.children];

    // --- Accordion Header ---
    const accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    accordionHeader.id = `heading${index}`;

    const button = document.createElement("button");
    button.className = `accordion-button ${index !== 0 ? "collapsed" : ""}`;
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", `collapse${index}`);

    // --- Title from item ---
    const titleEl = item.querySelector('[name="title"]') || itemChildren[1] || itemChildren[0];
    const titleSpan = document.createElement("span");
    titleSpan.className = "business-title";
    titleSpan.textContent = titleEl?.textContent?.trim() || `Business ${index + 1}`;
    button.appendChild(titleSpan);

    accordionHeader.appendChild(button);
    item.innerHTML = "";
    item.appendChild(accordionHeader);

    // Accordion icon
    const iconSpan = document.createElement("span");
    iconSpan.className = "accordion-icon";
    iconSpan.setAttribute("aria-hidden", "true");

    const iconWrapper = document.createElement("span");
    iconWrapper.className = "icon-wrapper";

    // Plus icon SVG
    const plusIcon = document.createElement("span");
    plusIcon.className = `plus-icon ${index === 0 ? "d-none" : ""}`;
    plusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
</svg>`;

    // Minus icon SVG
    const minusIcon = document.createElement("span");
    minusIcon.className = `minus-icon ${index === 0 ? "" : "d-none"}`;
    minusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
</svg>`;

    iconWrapper.appendChild(plusIcon);
    iconWrapper.appendChild(minusIcon);
    iconSpan.appendChild(iconWrapper);
    button.appendChild(iconSpan);

    // --- Collapse Body ---
    const collapseDiv = document.createElement("div");
    collapseDiv.className = `accordion-collapse collapse ${index === 0 ? "show" : ""}`;
    collapseDiv.id = `collapse${index}`;
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-bs-parent", "#businessAccordion");

    const accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";

    // --- Image ---
    const imgDiv = document.createElement("div");
    imgDiv.className = "business-image";
    const imgEl = item.querySelector('[name="image"]') || itemChildren[0];
    if (imgEl) {
      imgDiv.appendChild(imgEl.cloneNode(true));
    }
    accordionBody.appendChild(imgDiv);

    // --- Description ---
    const descDiv = document.createElement("div");
    descDiv.className = "business-description";
    const descEl = item.querySelector('[name="description"]') || itemChildren[2];
    if (descEl) descDiv.innerHTML = descEl.innerHTML || descEl.textContent || "";
    accordionBody.appendChild(descDiv);

    // --- CTA ---
    const ctaDiv = document.createElement("div");
    ctaDiv.className = "business-cta";

    // Fallback to children[3] for ctaLabel
    const ctaLabelEl = itemChildren[3];
    const ctaLinkEl = itemChildren[4]; // optional link
    if (ctaLabelEl) {
      const a = document.createElement("a");
      a.href = (ctaLinkEl?.textContent || "#").trim();
      a.className = "btn btn-transparent";
      a.textContent = (ctaLabelEl?.textContent || "READ MORE").trim();
      ctaDiv.appendChild(a);
    }
    accordionBody.appendChild(ctaDiv);


    collapseDiv.appendChild(accordionBody);
    item.appendChild(collapseDiv);

    accordion.appendChild(item);

    // --- Event listeners for active class ---
    if (window.bootstrap) {
      const bsCollapse = new bootstrap.Collapse(collapseDiv, { toggle: false });

      collapseDiv.addEventListener("show.bs.collapse", () => {
        item.classList.add("active");
        button.classList.remove("collapsed");
      });

      collapseDiv.addEventListener("hide.bs.collapse", () => {
        item.classList.remove("active");
        button.classList.add("collapsed");
      });
    }
  });

  wrapper.appendChild(accordion);
  block.innerHTML = "";
  block.appendChild(wrapper);

  // --- Initialize Bootstrap collapse manually ---
  const collapseElements = wrapper.querySelectorAll('.collapse');
  collapseElements.forEach((el) => {
    if (window.bootstrap) {
      new bootstrap.Collapse(el, { toggle: false });
    }
  });
}
