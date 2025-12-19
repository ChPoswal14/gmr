export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 3) return;

  /* ================================
     1️⃣ Read section fields
     ================================ */
  const sectionTitleRow = rows[0];
  const sectionDescRow = rows[1];
  const cardRows = rows.slice(2);

  const sectionTitle = sectionTitleRow.textContent.trim();
  const sectionDesc = sectionDescRow.innerHTML;

  /* ================================
     2️⃣ Hide authored content (DO NOT REMOVE)
     ================================ */
  rows.forEach((row) => {
    row.style.display = "none";
  });

  /* ================================
     3️⃣ Build runtime section
     ================================ */
  const section = document.createElement("section");
  section.className = "innovation-cards-section spacer";

  const container = document.createElement("div");
  container.className = "container";

  container.innerHTML = `
    <div class="text-center mb-5">
      <h2 class="sec-title">${sectionTitle}</h2>
      <div class="sec-desc">${sectionDesc}</div>
    </div>
    <div class="innovation-cards-row"></div>
  `;

  section.append(container);
  block.append(section);

  const cardsRow = container.querySelector(".innovation-cards-row");

  /* ================================
     4️⃣ Build cards (reuse authored rows)
     ================================ */
  cardRows.forEach((row, index) => {
    const cells = [...row.children];

    const image = cells[0]?.querySelector("picture");
    const title = cells[1]?.textContent || "";
    const desc = cells[2]?.textContent || "";
    const cta = cells[3]?.textContent || "READ MORE";

    const col = document.createElement("div");
    col.className = "innovation-col";

    const card = document.createElement("div");
    card.className =
      index === 0 ? "innovation-card featured" : "innovation-card";

    if (image) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "innovation-card-img";
      imgWrap.append(image.cloneNode(true)); // clone for safety
      card.append(imgWrap);
    }

    const content = document.createElement("div");
    content.className = "innovation-card-content";

    content.innerHTML = `
      <h3 class="card-title">${title}</h3>
      <p class="card-desc">${desc}</p>
      <span class="card-cta">${cta} &rsaquo;</span>
    `;

    card.append(content);
    col.append(card);
    cardsRow.append(col);
  });
}
