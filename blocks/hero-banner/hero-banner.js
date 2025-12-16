import { loadCSS, loadScript } from "../../scripts/aem.js";

const SWIPER_JS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
const SWIPER_CSS =
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";

export default async function decorate(block) {
  await loadCSS(SWIPER_CSS);
  await loadScript(SWIPER_JS);

  const rows = [...block.children];

  /* ---------- Create Swiper Structure ---------- */
  const swiper = document.createElement("div");
  swiper.className = "swiper hero-swiper";

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row) => {
    row.classList.add("swiper-slide", "hero-slide");
    wrapper.append(row); // 🔥 MOVE original node, don't recreate
  });

  swiper.append(wrapper);

  /* ---------- Add Controls ---------- */
  swiper.insertAdjacentHTML(
    "beforeend",
    `
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  `
  );

  /* ---------- Wrap without destroying ---------- */
  block.append(swiper);

  /* ---------- Hide original table look ---------- */
  block.classList.add("hero-banner-initialized");

  /* ---------- Init Swiper ---------- */
  new Swiper(swiper, {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
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
