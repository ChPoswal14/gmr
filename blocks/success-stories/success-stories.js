import { getApiHost } from "../../scripts/api.js";

export default async function decorate(block) {
  /* ================================
     1️⃣ Read section fields (SAFE)
     ================================ */
  const children = [...block.children];

  const [
    sectionTitleEl,
    sectionDescEl,
    sectionCTATextEl,
    sectionCTALinkEl,
    sectionCategoryEl,
  ] = children;

  const sectionTitle = sectionTitleEl?.textContent?.trim() || "";
  const sectionDescription = sectionDescEl?.innerHTML || "";
  const sectionCTAText = sectionCTATextEl?.textContent?.trim() || "";
  const sectionCTALink = sectionCTALinkEl?.textContent?.trim() || "#";
  const sectionCategory =
    sectionCategoryEl?.textContent?.trim().toLowerCase() || "";

  /* ================================
     2️⃣ Create runtime wrapper
     (DO NOT clear block)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "success-stories-runtime";

  block.append(runtime);

  /* ================================
     3️⃣ Build section header
     ================================ */
  const sectionWrapper = document.createElement("div");
  sectionWrapper.className = "success-stories-section";

  sectionWrapper.innerHTML = `
    <div class="success-stories-header">
      <h2>${sectionTitle}</h2>
      <div class="section-description">
        ${sectionDescription}
      </div>
      <a class="section-cta" href="${sectionCTALink}">
        ${sectionCTAText}
      </a>
    </div>
  `;

  runtime.append(sectionWrapper);

  /* ================================
     4️⃣ Cards wrapper
     ================================ */
  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "success-stories-cards";
  runtime.append(cardsWrapper);

  try {
    /* ================================
       5️⃣ Fetch API
       ================================ */
    const apiUrl = `${getApiHost()}/api/v1/web/gmr/success-story?category=${encodeURIComponent(
      sectionCategory
    )}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    const items = json?.data?.data?.successStoryList?.items || [];

    if (!items.length) {
      cardsWrapper.innerHTML = "<p>No success stories found.</p>";
      return;
    }

    /* ================================
       6️⃣ Render cards (runtime only)
       ================================ */
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "story-card";

      card.innerHTML = `
        <div class="story-image">
          <img src="${item.storyImage?._publishUrl || ""}" alt="${
        item.title || ""
      }">
        </div>
        <div class="story-content">
          <h3>${item.title || ""}</h3>
          <div class="description">
            ${item.description?.plaintext || ""}
          </div>
          <a class="read-more" href="${item.ctaLink || "#"}">
            ${item.ctaText?.plaintext || ""} →
          </a>
        </div>
      `;

      cardsWrapper.append(card);
    });
  } catch (err) {
    console.error("Success Stories error:", err);
    cardsWrapper.innerHTML = `<p>Error loading success stories</p>`;
  }

  /* ================================
     7️⃣ Hide authoring DOM safely
     ================================ */
  block.classList.add("success-stories-initialized");
}
