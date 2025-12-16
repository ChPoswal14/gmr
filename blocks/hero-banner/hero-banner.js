import { loadCSS, loadScript } from "../../scripts/aem.js";

const SWIPER_JS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
const SWIPER_CSS =
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";

/* ---------- Helper ---------- */
function isValidSlide(row) {
  // must contain text, picture, or link
  return (
    row.textContent.trim().length > 0 ||
    row.querySelector("picture") ||
    row.querySelector("a")
  );
}

export default async function decorate(block) {
  await loadCSS(SWIPER_CSS);
  await loadScript(SWIPER_JS);

  const allRows = [...block.children];

  /* ---------- Filter Real Slides ---------- */
  const rows = allRows.filter(isValidSlide);

  if (!rows.length) return;

  /* ---------- Swiper Wrapper ---------- */
  const swiper = document.createElement("div");
  swiper.className = "swiper hero-swiper";

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row) => {
    row.classList.add("swiper-slide", "hero-slide");
    wrapper.append(row); // keep original node
  });

  swiper.append(wrapper);

  swiper.insertAdjacentHTML(
    "beforeend",
    `
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  `
  );

  block.append(swiper);
  block.classList.add("hero-banner-initialized");

  /* ---------- Init Swiper ---------- */
  new Swiper(swiper, {
    loop: rows.length > 1,
    speed: 800,
    autoplay:
      rows.length > 1 ? { delay: 5000, disableOnInteraction: false } : false,
    pagination: {
      el: swiper.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: swiper.querySelector(".swiper-button-next"),
      prevEl: swiper.querySelector(".swiper-button-prev"),
    },
  });
}
