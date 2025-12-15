export default function decorate(block) {
  const rows = [...block.children];

  // ---- Extract authored content ----
  const sectionTitle = rows[0]?.querySelector("p");

  const imageOffice = rows[1]?.querySelector("picture");
  const imageTeamSmall = rows[2]?.querySelector("picture");
  const imageTeamLarge = rows[3]?.querySelector("picture");

  const cardContent = rows[4]?.querySelector("div");
  const ctaText = rows[5]?.querySelector("p")?.textContent?.trim();
  const ctaLink = rows[6]?.querySelector("a")?.getAttribute("href");

  // ---- Clear block ----
  block.innerHTML = "";

  /* ===============================
     Section Title
  =============================== */
  if (sectionTitle) {
    const title = document.createElement("h2");
    title.className = "careers-highlight-title";
    title.textContent = sectionTitle.textContent;
    block.append(title);
  }

  /* ===============================
     Main Layout Container
  =============================== */
  const container = document.createElement("div");
  container.className = "careers-highlight-grid";

  /* ===============================
     Left Images
  =============================== */
  const leftCol = document.createElement("div");
  leftCol.className = "left-images";

  if (imageOffice) {
    const topImg = document.createElement("div");
    topImg.className = "image-large";
    topImg.append(imageOffice);
    leftCol.append(topImg);
  }

  if (imageTeamSmall) {
    const bottomImg = document.createElement("div");
    bottomImg.className = "image-small";
    bottomImg.append(imageTeamSmall);
    leftCol.append(bottomImg);
  }

  /* ===============================
     Center Blue Card
  =============================== */
  const centerCol = document.createElement("div");
  centerCol.className = "center-card";

  if (cardContent) {
    centerCol.append(cardContent);
  }

  /* ===============================
     Right Image + CTA
  =============================== */
  const rightCol = document.createElement("div");
  rightCol.className = "right-content";

  if (imageTeamLarge) {
    const rightImg = document.createElement("div");
    rightImg.className = "image-vertical";
    rightImg.append(imageTeamLarge);
    rightCol.append(rightImg);
  }

  if (ctaText && ctaLink) {
    const cta = document.createElement("a");
    cta.href = ctaLink;
    cta.className = "cta-button";
    cta.textContent = ctaText;
    rightCol.append(cta);
  }

  // ---- Assemble layout ----
  container.append(leftCol, centerCol, rightCol);
  block.append(container);
}
