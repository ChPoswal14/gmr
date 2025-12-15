export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  block.classList.add("commitment-cards");

  /* ---------------- Section Title ---------------- */
  const sectionTitleRow = rows.shift();
  const sectionTitleWrapper = document.createElement("div");
  sectionTitleWrapper.className = "section-title";

  if (sectionTitleRow) {
    sectionTitleWrapper.append(...sectionTitleRow.childNodes);
  }

  /* ---------------- Cards Wrapper ---------------- */
  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "cards-wrapper";

  rows.forEach((cardRow) => {
    const cols = [...cardRow.children];
    if (cols.length < 5) return;

    // Hide original row but keep it for UE
    cardRow.style.display = "none";

    const card = document.createElement("div");
    card.className = "commitment-card";

    /* -------- Image -------- */
    const imageDiv = document.createElement("div");
    imageDiv.className = "card-image";
    if (cols[0].firstElementChild) {
      imageDiv.append(cols[0].firstElementChild);
    }

    /* -------- Title -------- */
    const titleDiv = document.createElement("div");
    titleDiv.className = "card-title";
    titleDiv.append(...cols[1].childNodes);

    /* -------- Description -------- */
    const descDiv = document.createElement("div");
    descDiv.className = "card-description";
    descDiv.append(...cols[2].childNodes);

    /* -------- CTA -------- */
    const ctaDiv = document.createElement("div");
    ctaDiv.className = "card-cta";

    const link = cols[4].querySelector("a");
    if (link) {
      link.textContent = cols[3].textContent.trim();
      ctaDiv.append(link);
    }

    card.append(imageDiv, titleDiv, descDiv, ctaDiv);
    cardsWrapper.append(card);
  });

  /* ---------------- Final DOM ---------------- */
  block.innerHTML = "";
  block.append(sectionTitleWrapper, cardsWrapper);
}
