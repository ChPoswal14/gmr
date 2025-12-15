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

    // Store the original content before we modify the structure
    const itemChildren = [...item.children];
    
    // --- Accordion Header ---
    const accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    if (index === 0) accordionHeader.classList.add("active");
    accordionHeader.id = `heading${index}`;

    const button = document.createElement("button");
    button.className = "accordion-button";
    if (index !== 0) button.classList.add("collapsed");
    if (index === 0) button.classList.add("active");
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", `collapse${index}`);

    // Title - extract from the correct position in original content
    // Assuming title is in the second child (index 1) based on your HTML
    const titleElement = itemChildren[1]?.querySelector("p") || itemChildren[1];
    const titleSpan = document.createElement("span");
    titleSpan.className = "business-title";
    if (titleElement) {
      titleSpan.textContent = titleElement.textContent || titleElement.innerHTML || "";
    }
    button.appendChild(titleSpan);

    // Accordion icons
    const iconSpan = document.createElement("span");
    iconSpan.className = "accordion-icon";
    iconSpan.setAttribute("aria-hidden", "true");

    const iconWrapper = document.createElement("span");
    iconWrapper.className = "icon-wrapper";

    const plusIcon = document.createElement("span");
    plusIcon.className = "plus-icon";
    if (index === 0) plusIcon.classList.add("d-none");
    plusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"></path>
    </svg>`;

    const minusIcon = document.createElement("span");
    minusIcon.className = "minus-icon";
    if (index !== 0) minusIcon.classList.add("d-none");
    minusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path>
    </svg>`;

    iconWrapper.appendChild(plusIcon);
    iconWrapper.appendChild(minusIcon);
    iconSpan.appendChild(iconWrapper);
    button.appendChild(iconSpan);

    accordionHeader.appendChild(button);
    
    // Clear the item and add only the header first
    item.innerHTML = "";
    item.appendChild(accordionHeader);

    // --- Collapse Body ---
    const collapseDiv = document.createElement("div");
    collapseDiv.className = "accordion-collapse collapse";
    if (index === 0) collapseDiv.classList.add("show");
    collapseDiv.id = `collapse${index}`;
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-bs-parent", "#businessAccordion");

    const accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";

    // --- Business Description ---
    const descDiv = document.createElement("div");
    descDiv.className = "business-description";
    // Assuming description is in the third child (index 2) based on your HTML
    const desc = itemChildren[2]?.querySelector("p") || itemChildren[2];
    if (desc) {
      descDiv.innerHTML = desc.innerHTML || desc.textContent || "";
    }
    accordionBody.appendChild(descDiv);

    // --- CTA ---
    const ctaDiv = document.createElement("div");
    ctaDiv.className = "business-cta";
    // Assuming CTA is in the fifth child (index 4) based on your HTML
    const cta = itemChildren[4];
    if (cta) {
      const ctaContent = itemChildren[4]?.querySelector("p") || itemChildren[4];
      const a = document.createElement("a");
      a.href = "#";
      a.className = "btn btn-transparent";
      a.textContent = ctaContent?.textContent?.trim() || "READ MORE";
      ctaDiv.appendChild(a);
    }
    accordionBody.appendChild(ctaDiv);

    // --- Mobile Image ---
    const mobileImageDiv = document.createElement("div");
    mobileImageDiv.className = "mobile-business-image";
    mobileImageDiv.setAttribute("data-index", index);
    mobileImageDiv.style.display = "none";
    
    // Assuming image is the first child (index 0) based on your HTML
    const picture = itemChildren[0]?.querySelector("picture");
    if (picture) {
      mobileImageDiv.appendChild(picture.cloneNode(true));
    }
    accordionBody.appendChild(mobileImageDiv);

    collapseDiv.appendChild(accordionBody);
    item.appendChild(collapseDiv);

    accordion.appendChild(item);
  });

  wrapper.appendChild(accordion);
  block.innerHTML = "";
  block.appendChild(wrapper);
}