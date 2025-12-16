import { loadCSS, loadScript } from "../../scripts/aem.js";

const SWIPER_JS = "../../scripts/swiper-bundle.min.js";
const SWIPER_CSS = "../../styles/swiper-bundle.min.css";

function isValidRow(row) {
  return (
    row.textContent.trim().length > 0 ||
    row.querySelector("picture") ||
    row.querySelector("a")
  );
}

/* ---------- Custom Nav: Arrows + Numbers ---------- */
function buildHeroNav(swiper, total) {
  const nav = document.createElement("div");
  nav.className = "hero-nav";

  /* Prev */
  const prev = document.createElement("button");
  prev.className = "hero-arrow hero-prev";
  prev.setAttribute("aria-label", "Previous slide");
  prev.innerHTML = "&#8592;";

  /* Next */
  const next = document.createElement("button");
  next.className = "hero-arrow hero-next";
  next.setAttribute("aria-label", "Next slide");
  next.innerHTML = "&#8594;";

  /* Numbers */
  const numbers = document.createElement("div");
  numbers.className = "hero-numbers";

  const nums = [];

  for (let i = 0; i < total; i += 1) {
    const num = document.createElement("span");
    num.className = "hero-num";
    num.textContent = String(i + 1).padStart(2, "0");

    num.addEventListener("click", () => swiper.slideToLoop(i));

    nums.push(num);
    numbers.append(num);
  }

  nav.append(prev, numbers, next);
  swiper.el.append(nav);

  prev.onclick = () => swiper.slidePrev();
  next.onclick = () => swiper.slideNext();

  function updateActive() {
    nums.forEach((n) => n.classList.remove("active"));
    nums[swiper.realIndex]?.classList.add("active");
  }

  swiper.on("slideChange", updateActive);
  updateActive();
}

export default async function decorate(block) {
  await loadCSS(SWIPER_CSS);
  await loadScript(SWIPER_JS);

  const rows = [...block.children].filter(isValidRow);
  if (!rows.length) return;

  const swiper = document.createElement("div");
  swiper.className = "swiper hero-swiper";

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row) => {
    const cells = [...row.children];

    const [
      title,
      description,
      bgImage,
      bgVideo,
      knowLabel,
      knowLink,
      watchLabel,
      watchLink,
    ] = cells;

    /* ---------- Slide ---------- */
    const slide = document.createElement("div");
    slide.className = "swiper-slide hero-slide";

    /* ---------- Media ---------- */
    const media = document.createElement("div");
    media.className = "hero-media";

    const picture = bgImage?.querySelector("picture");
    if (picture) media.append(picture);

    const videoAnchor = bgVideo?.querySelector("a");
    if (videoAnchor) {
      const video = document.createElement("video");
      video.src = videoAnchor.href;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      media.append(video);
    }

    /* ---------- Content ---------- */
    const content = document.createElement("div");
    content.className = "hero-content";

    if (title?.textContent.trim()) {
      const h3 = document.createElement("h3");
      h3.innerHTML = title.innerHTML;
      content.append(h3);
    }

    if (description?.innerHTML.trim()) {
      const div = document.createElement("div");
      div.innerHTML = description.innerHTML;
      content.append(div);
    }

    const actions = document.createElement("div");
    actions.className = "hero-actions";

    if (knowLabel?.textContent && knowLink?.querySelector("a")) {
      const a = knowLink.querySelector("a");
      a.textContent = knowLabel.textContent;
      a.className = "btn btn-primary";
      actions.append(a);
    }

    if (watchLabel?.textContent && watchLink?.querySelector("a")) {
      const a = watchLink.querySelector("a");
      a.textContent = watchLabel.textContent;
      a.className = "btn btn-outline-primary";
      actions.append(a);
    }

    content.append(actions);

    slide.append(media, content);
    wrapper.append(slide);
  });

  swiper.append(wrapper);
  block.append(swiper);
  block.classList.add("hero-banner-initialized");

  const swiperInstance = new Swiper(swiper, {
    loop: rows.length > 1,
    speed: 800,
  });

  buildHeroNav(swiperInstance, rows.length);
}
