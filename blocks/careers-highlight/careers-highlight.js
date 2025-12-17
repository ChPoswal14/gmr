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

  /* -------------------------
     COLUMN 2 – BLUE CARD
  ------------------------- */

  if (blueCardNode) {
    const cardContent = document.createElement("div");
    cardContent.className = "cardContent";
    cardContent.appendChild(blueCardNode);
    col2.appendChild(cardContent);
  }

  /* -------------------------
     COLUMN 3 – LARGE IMAGE + CTA
  ------------------------- */

  // Image 3 (right side)
  if (pictureNodes[2]) {
    const wrap3 = document.createElement("div");
    wrap3.className = "careerImg picthree";
    wrap3.appendChild(pictureNodes[2]);

    const img = wrap3.querySelector("img");
    if (img) {
      img.setAttribute("data-aue-prop", "imageTeamLarge");
      img.setAttribute("data-aue-label", "Image 3 (Right Side)");
      img.setAttribute("data-aue-type", "media");
    }

    col3.appendChild(wrap3);
  }

  /* -------------------------
   CTA – UE SAFE
   <a data-aue-prop="ctaLabel" href="ctaLink">Label</a>
------------------------- */

  const ctaWrap = document.createElement("div");
  ctaWrap.className = "cta careerBtn";

  let ctaHref = "";
  let ctaText = "";

  /* Get CTA LABEL (TEXT FIELD) */
  if (ctaLabelNode) {
    const p = ctaLabelNode.querySelector("p");
    if (p) {
      ctaText = p.textContent.trim();
    }
  }

  /* Get CTA LINK (VALUE ONLY, NOT UE FIELD) */
  if (ctaLinkNode) {
    const a = ctaLinkNode.querySelector("a");
    if (a) {
      ctaHref = a.href;
    }
  }

  /* Final UE-editable anchor */
  if (ctaText) {
    const a = document.createElement("a");
    a.href = ctaHref || "#";
    a.textContent = ctaText;

    // 🔑 THIS is what makes UE show the field
    a.setAttribute("data-aue-prop", "ctaLabel");
    a.setAttribute("data-aue-label", "CTA Button Label");

    a.className = "btn btn-orange w-100";

    ctaWrap.appendChild(a);
  }

  col3.appendChild(ctaWrap);

  /* -------------------------
     ASSEMBLE FINAL STRUCTURE
  ------------------------- */

  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  container.appendChild(row);

  // Clear AEM block first
  block.innerHTML = "";

  // Add header wrapper
  if (sectionTitleNode) {
    const header = document.createElement("header");
    header.className = "entry-container text-center";

    const p = sectionTitleNode.querySelector("p");
    if (p) p.classList.add("title");
    else sectionTitleNode.classList.add("title");

    header.appendChild(sectionTitleNode);
    block.appendChild(header);
  }

  block.appendChild(container);
}
