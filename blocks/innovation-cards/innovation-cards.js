export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 3) return;

  /* ================================
     1️⃣ Read section fields
     ================================ */
  const sectionTitle = rows[0]?.textContent?.trim() || "";
  const sectionDesc = rows[1]?.innerHTML || "";

  const cardRows = rows.slice(2);

  /* ================================
     2️⃣ Clear author HTML
     ================================ */
  block.innerHTML = "";

  /* ================================
     3️⃣ Section wrapper
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
    <div class="row g-4 innovation-cards-row"></div>
  `;

  section.append(container);
  block.append(section);

  const cardsRow = container.querySelector(".innovation-cards-row");

  /* ================================
     4️⃣ Build cards
     ================================ */
  cardRows.forEach((row, index) => {
    const cells = [...row.children];

    const image = cells[0]?.querySelector("picture");
    const title = cells[1]?.textContent?.trim() || "";
    const desc = cells[2]?.textContent?.trim() || "";
    const cta = cells[3]?.textContent?.trim() || "READ MORE";

    /* Column size */
    const col = document.createElement("div");
    col.className = index === 0 ? "col" : "col";

    /* Card */
    const card = document.createElement("div");
    card.className =
      index === 0 ? "innovation-card featured" : "innovation-card";

    /* Image */
    if (image) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "innovation-card-img";
      imgWrap.append(image);
      card.append(imgWrap);
    }

    /* Content overlay */
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
