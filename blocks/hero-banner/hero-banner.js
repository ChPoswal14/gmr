import { loadCSS, loadScript } from "../../scripts/aem.js";

const SWIPER_JS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
const SWIPER_CSS =
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";

export default async function decorate(block) {
  await loadCSS(SWIPER_CSS);
  await loadScript(SWIPER_JS);

  const rows = [...block.children];

  const swiper = document.createElement("div");
  swiper.className = "swiper hero-swiper";

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row) => {
    const cells = [...row.children];

    if (!cells.length) return;

    const [
      title,
      description,
      bgImage,
      bgVideo,
      knowMoreLabel,
      knowMoreLink,
      watchLabel,
      watchLink,
    ] = cells;

    const slide = document.createElement("div");
    slide.className = "swiper-slide hero-slide";

    /* ---------- Background ---------- */
    const bg = document.createElement("div");
    bg.className = "hero-bg";

    const picture = bgImage?.querySelector("picture");
    if (picture) bg.append(picture);

    const videoLink = bgVideo?.querySelector("a");
    if (videoLink) {
      const video = document.createElement("video");
      video.src = videoLink.href;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      bg.append(video);
    }

    /* ---------- Content ---------- */
    const content = document.createElement("div");
    content.className = "hero-content";

    if (title?.textContent) {
      const h1 = document.createElement("h1");
      h1.innerHTML = title.textContent;
      content.append(h1);
    }

    if (description?.textContent) {
      const p = document.createElement("p");
      p.innerHTML = description.innerHTML;
      content.append(p);
    }

    const cta = document.createElement("div");
    cta.className = "hero-cta";

    if (knowMoreLabel?.textContent && knowMoreLink?.querySelector("a")) {
      const a = knowMoreLink.querySelector("a");
      a.textContent = knowMoreLabel.textContent;
      a.className = "btn primary";
      cta.append(a);
    }

    if (watchLabel?.textContent && watchLink?.querySelector("a")) {
      const a = watchLink.querySelector("a");
      a.textContent = watchLabel.textContent;
      a.className = "btn secondary";
      cta.append(a);
    }

    content.append(cta);

    slide.append(bg, content);
    wrapper.append(slide);
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

  block.replaceChildren(swiper);

  /* ---------- Swiper Init ---------- */
  new Swiper(".hero-swiper", {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
