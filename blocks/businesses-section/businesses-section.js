export default function decorate(block) {
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

  // --- ACCORDION ---
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  accordion.id = "businessAccordion";

  const businessItems = children.slice(3); // skip header & intro

  businessItems.forEach((item, index) => {
    item.classList.add("accordion-item");

    // --- ACCORDION HEADER ---
    const accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    accordionHeader.id = `heading${index}`;

    const button = document.createElement("button");
    button.className = "accordion-button collapsed";
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${index}`);

    // Title from UE editable content
    const titleElement = item.children[1];
    const titleSpan = document.createElement("span");
    titleSpan.className = "business-title";
    if (titleElement) titleSpan.textContent = titleElement.textContent;
    button.appendChild(titleSpan);

    accordionHeader.appendChild(button);
    item.prepend(accordionHeader);

    // --- ACCORDION COLLAPSE ---
    const collapseDiv = document.createElement("div");
    collapseDiv.className = "accordion-collapse collapse";
    collapseDiv.id = `collapse${index}`;
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-bs-parent", "#businessAccordion");

    const accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";

    // Keep existing description and CTA for UE
    const description = item.querySelector(".business-description") || item.children[2];
    if (description) accordionBody.appendChild(description);

    const cta = item.querySelector(".business-cta") || item.children[4];
    if (cta) accordionBody.appendChild(cta);

    // Mobile image
    const mobileImageDiv = document.createElement("div");
    mobileImageDiv.className = "mobile-business-image";
    const picture = item.children[0]?.querySelector("picture");
    if (picture) mobileImageDiv.appendChild(picture.cloneNode(true));
    accordionBody.appendChild(mobileImageDiv);

    collapseDiv.appendChild(accordionBody);
    item.appendChild(collapseDiv);

    accordion.appendChild(item);
  });

  // Insert accordion wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "business-accordion-wrapper";
  wrapper.appendChild(accordion);

  // Replace block children with wrapper
  while (block.firstChild) block.removeChild(block.firstChild);
  block.appendChild(wrapper);

  // --- Responsive CSS ---
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
