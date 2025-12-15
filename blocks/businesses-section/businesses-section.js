export default function decorate(block) {
  const wrapper = document.createElement("div");
  wrapper.className = "business-accordion-wrapper";

  const children = [...block.children];

  // --- BUILD HEADER ---
  const header = document.createElement("header");
  header.className = "business-accordion-header";

  // H2 + span (from first two divs)
  const h2 = document.createElement("h2");
  const title = children[0]?.textContent || "";
  const subtitle = children[1]?.textContent || "";
  h2.innerHTML = `<span class="title">${title}</span> <span class="subtitle">${subtitle}</span>`;
  header.appendChild(h2);

  // Intro text wrapper (from third div)
  const intro = document.createElement("div");
  intro.className = "intro-text";
  const introText = children[2]?.innerHTML || "";
  if (introText) intro.innerHTML = introText;
  header.appendChild(intro);

  wrapper.appendChild(header);

  // --- CREATE ACCORDION CONTAINER ---
  const accordionContainer = document.createElement("div");
  accordionContainer.className = "business-accordion-container";

  // Extract business items (remaining children starting from index 3)
  const businessItems = children.slice(3);

  // --- CREATE DESKTOP IMAGE PREVIEW SECTION ---
  const imagePreview = document.createElement("div");
  imagePreview.className = "business-image-preview";

  const imageContainer = document.createElement("div");
  imageContainer.className = "business-image-container";

  businessItems.forEach((item, index) => {
    const desktopImageDiv = document.createElement("div");
    desktopImageDiv.className = `desktop-business-image ${index === 0 ? "active" : ""}`;
    desktopImageDiv.setAttribute("data-index", index);

    const pictureElement = item.children[0]?.querySelector("picture");
    if (pictureElement) {
      const img = document.createElement("img");
      const imgElement = pictureElement.querySelector("img");
      if (imgElement) {
        let src = imgElement.src;
        const sources = pictureElement.querySelectorAll("source");
        sources.forEach(source => {
          if (source.media && source.media.includes("min-width: 600")) {
            const srcset = source.srcset.split(",")[0].split(" ")[0];
            if (srcset) src = srcset;
          }
        });
        img.src = src;
        img.alt = imgElement.alt || "";
        img.setAttribute("data-aue-prop", "image");
        img.setAttribute("data-aue-label", "Business Image");
        img.setAttribute("data-aue-type", "media");
        desktopImageDiv.appendChild(img);
      }
    }

    imageContainer.appendChild(desktopImageDiv);
  });

  imagePreview.appendChild(imageContainer);
  accordionContainer.appendChild(imagePreview);

  // --- CREATE ACCORDION ---
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  accordion.id = "businessAccordion";

  businessItems.forEach((item, index) => {
    const accordionItem = document.createElement("div");
    accordionItem.className = `accordion-item ${index === 0 ? "active" : ""}`;

    // --- ACCORDION HEADER ---
    const accordionHeader = document.createElement("h2");
    accordionHeader.className = `accordion-header ${index === 0 ? "active" : ""}`;
    accordionHeader.id = `heading${index}`;

    const button = document.createElement("button");
    button.className = `accordion-button ${index === 0 ? "active" : ""}`;
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", `collapse${index}`);

    const titleSpan = document.createElement("span");
    titleSpan.className = "business-title";
    titleSpan.textContent = item.children[1]?.textContent || "";
    button.appendChild(titleSpan);

    // Accordion icon
    const iconSpan = document.createElement("span");
    iconSpan.className = "accordion-icon";
    iconSpan.setAttribute("aria-hidden", "true");

    const iconWrapper = document.createElement("span");
    iconWrapper.className = "icon-wrapper";

    const plusIcon = document.createElement("span");
    plusIcon.className = `plus-icon ${index === 0 ? "d-none" : ""}`;
    plusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/></svg>`;

    const minusIcon = document.createElement("span");
    minusIcon.className = `minus-icon ${index === 0 ? "" : "d-none"}`;
    minusIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>`;

    iconWrapper.appendChild(plusIcon);
    iconWrapper.appendChild(minusIcon);
    iconSpan.appendChild(iconWrapper);
    button.appendChild(iconSpan);

    accordionHeader.appendChild(button);
    accordionItem.appendChild(accordionHeader);

    // --- ACCORDION COLLAPSE ---
    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse${index}`;
    collapseDiv.className = `accordion-collapse collapse ${index === 0 ? "show" : ""}`;
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-bs-parent", "#businessAccordion");

    const accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";

    // Business description
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "business-description";
    if (item.children[2]?.textContent) {
      const p = document.createElement("p");
      p.textContent = item.children[2].textContent;
      descriptionDiv.appendChild(p);
    }
    accordionBody.appendChild(descriptionDiv);

    // CTA
    const ctaDiv = document.createElement("div");
    ctaDiv.className = "business-cta";

    let linkUrl = "#";
    let linkTitle = "#";
    const buttonContainer = item.children[4];
    if (buttonContainer) {
      const buttonLink = buttonContainer.querySelector("a");
      if (buttonLink) {
        linkUrl = buttonLink.href || "#";
        linkTitle = buttonLink.title || buttonLink.textContent || "#";
      }
    }
    const ctaLink = document.createElement("a");
    ctaLink.href = linkUrl;
    ctaLink.title = linkTitle;
    ctaLink.className = "btn btn-transparent";
    ctaLink.textContent = item.children[3]?.textContent || "READ MORE";
    ctaDiv.appendChild(ctaLink);
    accordionBody.appendChild(ctaDiv);

    // Mobile image
    const mobileImageDiv = document.createElement("div");
    mobileImageDiv.className = "mobile-business-image";
    mobileImageDiv.setAttribute("data-index", index);
    const mobilePicture = item.children[0]?.querySelector("picture")?.cloneNode(true);
    if (mobilePicture) mobileImageDiv.appendChild(mobilePicture);
    accordionBody.appendChild(mobileImageDiv);

    collapseDiv.appendChild(accordionBody);
    accordionItem.appendChild(collapseDiv);
    accordion.appendChild(accordionItem);
  });

  accordionContainer.appendChild(accordion);
  wrapper.appendChild(accordionContainer);

  // Replace original block
  block.innerHTML = "";
  block.appendChild(wrapper);

  // --- RESPONSIVE CSS ---
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 767px) {
      .business-image-preview { display: none !important; }
      .mobile-business-image { display: block !important; margin-top: 20px; }
      .mobile-business-image picture, .mobile-business-image img { width: 100%; height: auto; }
    }
    @media (min-width: 768px) {
      .mobile-business-image { display: none !important; }
      .business-image-preview { display: block !important; }
    }
  `;
  document.head.appendChild(style);

  // --- ACCORDION LOGIC ---
  setTimeout(() => {
    const collapseElements = wrapper.querySelectorAll('.accordion-collapse');
    const desktopImages = wrapper.querySelectorAll('.desktop-business-image');
    const accordionItems = wrapper.querySelectorAll('.accordion-item');
    const accordionHeaders = wrapper.querySelectorAll('.accordion-header');
    const accordionButtons = wrapper.querySelectorAll('.accordion-button');

    collapseElements.forEach((collapseEl, index) => {
      collapseEl.addEventListener('show.bs.collapse', () => {
        accordionItems.forEach(item => item.classList.remove('active'));
        accordionHeaders.forEach(header => header.classList.remove('active'));
        accordionButtons.forEach(button => button.classList.remove('active'));
        desktopImages.forEach(img => img.classList.remove('active'));

        accordionItems[index].classList.add('active');
        accordionHeaders[index].classList.add('active');
        accordionButtons[index].classList.add('active');
        desktopImages[index].classList.add('active');

        wrapper.querySelectorAll('.plus-icon').forEach(icon => icon.classList.remove('d-none'));
        wrapper.querySelectorAll('.minus-icon').forEach(icon => icon.classList.add('d-none'));
        accordionButtons[index].querySelector('.plus-icon')?.classList.add('d-none');
        accordionButtons[index].querySelector('.minus-icon')?.classList.remove('d-none');
      });

      collapseEl.addEventListener('hide.bs.collapse', () => {
        const openItems = wrapper.querySelectorAll('.accordion-collapse.show');
        if (openItems.length === 1 && openItems[0] === collapseEl) {
          accordionItems[index].classList.remove('active');
          accordionHeaders[index].classList.remove('active');
          accordionButtons[index].classList.remove('active');
          accordionButtons[index].querySelector('.plus-icon')?.classList.remove('d-none');
          accordionButtons[index].querySelector('.minus-icon')?.classList.add('d-none');
        }
      });
    });

    // Manual toggle for non-Bootstrap
    accordionButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
        if (typeof bootstrap !== 'undefined') return;

        const target = wrapper.querySelector(this.getAttribute('data-bs-target'));
        const isOpen = target.classList.contains('show');

        // Close all
        wrapper.querySelectorAll('.accordion-collapse.show').forEach(el => el.classList.remove('show'));
        accordionItems.forEach(item => item.classList.remove('active'));
        accordionHeaders.forEach(header => header.classList.remove('active'));
        accordionButtons.forEach(btn => btn.classList.remove('active'));
        desktopImages.forEach(img => img.classList.remove('active'));
        wrapper.querySelectorAll('.plus-icon').forEach(icon => icon.classList.remove('d-none'));
        wrapper.querySelectorAll('.minus-icon').forEach(icon => icon.classList.add('d-none'));

        if (!isOpen) {
          target.classList.add('show');
          accordionItems[index].classList.add('active');
          accordionHeaders[index].classList.add('active');
          this.classList.add('active');
          desktopImages[index].classList.add('active');
          this.querySelector('.plus-icon')?.classList.add('d-none');
          this.querySelector('.minus-icon')?.classList.remove('d-none');
        }
      });
    });

    // Handle responsive layout
    function handleResponsiveLayout() {
      const isMobile = window.innerWidth <= 767;
      wrapper.querySelectorAll('.mobile-business-image').forEach(imgDiv => {
        imgDiv.style.display = isMobile ? 'block' : 'none';
      });
    }

    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);

  }, 100);
}
