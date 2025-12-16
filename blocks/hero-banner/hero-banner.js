import { loadCSS, loadScript } from "../../scripts/aem.js";

export default async function decorate(block) {
  await loadCSS("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css");
  await loadScript(
    "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
  );

  const rows = [...block.children];

  // Create Swiper elements
  const swiperEl = document.createElement("div");
  swiperEl.className = "swiper";

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    // move authored content into slide
    [...row.children].forEach((col) => {
      slide.append(col);
    });

    wrapper.append(slide);
  });

  swiperEl.append(wrapper);

  // Optional navigation
  const next = document.createElement("div");
  next.className = "swiper-button-next";

  const prev = document.createElement("div");
  prev.className = "swiper-button-prev";

  const pagination = document.createElement("div");
  pagination.className = "swiper-pagination";

  swiperEl.append(prev, next, pagination);

  block.innerHTML = "";
  block.append(swiperEl);

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: pagination,
      clickable: true,
    },
    navigation: {
      nextEl: next,
      prevEl: prev,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}
