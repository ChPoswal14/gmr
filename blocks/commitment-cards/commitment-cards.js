export default function decorate(block) {
  /** -----------------------------
   * Section wrapper
   * ----------------------------- */
  const section = document.createElement("section");
  section.className = "bg-primary";

  const container = document.createElement("div");
  container.className = "container";

  /** -----------------------------
   * Section title (parent model)
   * ----------------------------- */
  const sectionRow = block.querySelector(":scope > div");
  let sectionTitle = "";

  if (sectionRow) {
    sectionTitle = sectionRow.textContent.trim();
    sectionRow.remove();
  }

  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  /** -----------------------------
   * Cards row
   * ----------------------------- */
  const row = document.createElement("div");
  row.className = "row";

  [...block.children].forEach((card) => {
    const [imgEl, titleEl, descEl, btnTextEl, btnLinkEl] = card.children;

    /* column */
    const col = document.createElement("div");
    col.className = "col-md-6";

    /* card */
    const blockCard = document.createElement("div");
    blockCard.className = "block-card";

    /* image */
    const imgWrap = document.createElement("div");
    imgWrap.className = "block-card-img";

    if (imgEl?.querySelector("img")) {
      imgWrap.appendChild(imgEl.querySelector("img"));
    }

    /* body */
    const body = document.createElement("div");
    body.className = "block-card-body";

    if (titleEl) {
      const h3 = document.createElement("h3");
      h3.textContent = titleEl.textContent;
      body.appendChild(h3);
    }

    if (descEl) body.appendChild(descEl);

    if (btnTextEl && btnLinkEl) {
      const a = document.createElement("a");
      a.href = btnLinkEl.textContent;
      a.className = "btn btn-primary";
      a.textContent = btnTextEl.textContent;
      body.appendChild(a);
    }

    blockCard.append(imgWrap, body);
    col.appendChild(blockCard);
    row.appendChild(col);
  });

  container.appendChild(row);
  section.appendChild(container);

  /** -----------------------------
   * Replace block
   * ----------------------------- */
  block.replaceWith(section);
}
