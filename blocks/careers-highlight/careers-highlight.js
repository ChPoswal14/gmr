export default function decorate(block) {
  const rows = [...block.children];

  const sectionTitleRow = rows[0];
  const imageOfficeRow = rows[1];
  const imageTeamSmallRow = rows[2];
  const imageTeamLargeRow = rows[3];
  const cardContentRow = rows[4];
  const ctaTextRow = rows[5];
  const ctaLinkRow = rows[6];

  /* ===============================
     Section Title
  =============================== */
  const titleP = sectionTitleRow?.querySelector("p");
  if (titleP) {
    const h2 = document.createElement("h2");
    h2.className = "careers-highlight-title";
    h2.textContent = titleP.textContent;
    titleP.replaceWith(h2);
  }

  /* ===============================
     Main Grid
  =============================== */
  const grid = document.createElement("div");
  grid.className = "careers-highlight-grid";

  /* ===============================
     Left Images
  =============================== */
  const leftCol = document.createElement("div");
  leftCol.className = "left-images";

  imageOfficeRow && leftCol.append(imageOfficeRow);
  imageTeamSmallRow && leftCol.append(imageTeamSmallRow);

  /* ===============================
     Center Card
  =============================== */
  const centerCol = document.createElement("div");
  centerCol.className = "center-card";

  cardContentRow && centerCol.append(cardContentRow);

  /* ===============================
     Right Content
  =============================== */
  const rightCol = document.createElement("div");
  rightCol.className = "right-content";

  imageTeamLargeRow && rightCol.append(imageTeamLargeRow);

  /* ===============================
     CTA (MOVE — DO NOT RECREATE)
  =============================== */
  const ctaAnchor = ctaLinkRow?.querySelector("a");
  const ctaText = ctaTextRow?.querySelector("p");

  if (ctaAnchor && ctaText) {
    ctaAnchor.textContent = ctaText.textContent;
    ctaAnchor.classList.add("cta-button");

    rightCol.append(ctaAnchor);
  }

  /* ===============================
     Assemble
  =============================== */
  grid.append(leftCol, centerCol, rightCol);

  // block.innerHTML = "";
  block.append(sectionTitleRow, grid);
}
