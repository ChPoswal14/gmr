import { getApiHost } from "../../scripts/api.js";
import { loadCSS, loadScript } from "../../scripts/aem.js";

const SWIPER_JS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
const SWIPER_CSS =
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";

export default async function decorate(block) {
  await loadCSS(SWIPER_CSS);
  await loadScript(SWIPER_JS);

  /* ================================
     1️⃣ Read authored fields (UE SAFE)
     ================================ */
  const [titleEl, descEl, ctaTextEl, ctaLinkEl, categoryEl] = [
    ...block.children,
  ];

  const title = titleEl?.textContent?.trim() || "";
  const description = descEl?.innerHTML || "";
  const ctaText = ctaTextEl?.textContent?.trim() || "";
  const ctaLink = ctaLinkEl?.textContent?.trim() || "#";
  const category = categoryEl?.textContent?.trim().toLowerCase() || "";

  /* ================================
     2️⃣ Runtime wrapper (DO NOT clear)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "success-stories-runtime container";

  block.append(runtime);
  block.classList.add("success-stories-initialized");

  /* ================================
     3️⃣ Bootstrap layout
     ================================ */
  runtime.innerHTML = `
    <div class="row align-items-end">
      <div class="col-lg-4">
        <h2 class="section-title">${title}</h2>
        <div class="section-description">${description}</div>
        <a href="${ctaLink}" class="btn btn-warning mt-3">
          ${ctaText}
        </a>

        <div class="stories-nav mt-4">
          <button class="stories-prev btn btn-outline-warning me-2">
            ←
          </button>
          <button class="stories-next btn btn-warning">
            →
          </button>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="swiper stories-swiper">
          <div class="swiper-wrapper"></div>
        </div>
      </div>
    </div>
  `;

  const wrapper = runtime.querySelector(".swiper-wrapper");

  /* ================================
     4️⃣ Fetch API data
     ================================ */
  try {
    const apiUrl = `${getApiHost()}/api/v1/web/gmr/success-story?category=${encodeURIComponent(
      category
    )}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(res.status);

    const json = await res.json();
    const items = json?.data?.data?.successStoryList?.items || [];

    if (!items.length) {
      wrapper.innerHTML = "<p>No stories found</p>";
      return;
    }

    /* ================================
       5️⃣ Build Swiper slides
       ================================ */
    items.forEach((item) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img
            src="${item.storyImage?._publishUrl || ""}"
            class="card-img-top"
            alt="${item.title || ""}"
          />
          <div class="card-body">
            <h5 class="card-title">${item.title || ""}</h5>
            <p class="card-text">
              ${item.description?.plaintext || ""}
            </p>
            <a href="${item.ctaLink || "#"}"
               class="text-warning fw-semibold">
              ${item.ctaText?.plaintext || "READ MORE"} →
            </a>
          </div>
        </div>
      `;

      wrapper.append(slide);
    });

    /* ================================
       6️⃣ Init Swiper
       ================================ */
    const swiper = new Swiper(".stories-swiper", {
      slidesPerView: 1.2,
      spaceBetween: 24,
      speed: 600,
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 2.5 },
      },
      navigation: {
        nextEl: runtime.querySelector(".stories-next"),
        prevEl: runtime.querySelector(".stories-prev"),
      },
    });
  } catch (e) {
    console.error("Success Stories error", e);
    wrapper.innerHTML = "<p>Error loading stories</p>";
  }
}
