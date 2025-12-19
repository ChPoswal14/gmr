export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  /* ================================
     1️⃣ Read authored content
     ================================ */
  const sectionTitleRow = rows[0];
  const sectionDescRow = rows[1];
  const cardRows = rows.slice(2);

  const sectionTitle = sectionTitleRow.textContent.trim();
  const sectionDesc = sectionDescRow.innerHTML;

  /* ================================
     2️⃣ Hide authored rows (DO NOT REMOVE)
     ================================ */
  rows.forEach((row) => {
    row.style.display = "none";
  });

  /* ================================
     3️⃣ Runtime wrapper (OUTSIDE UE structure)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "innovation-runtime";

  runtime.innerHTML = `
    <section class="innovation-cards-section spacer">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="sec-title">${sectionTitle}</h2>
          <div class="sec-desc">${sectionDesc}</div>
        </div>
        <div class="innovation-cards-row"></div>
      </div>
    </section>
  `;

  block.after(runtime);

  const cardsRow = runtime.querySelector(".innovation-cards-row");

  /* ================================
     4️⃣ Build cards (TEXT ONLY)
     ================================ */
  cardRows.forEach((row, index) => {
    const cells = [...row.children];

    const picture = cells[0]?.querySelector("img");
    const title = cells[1]?.textContent?.trim() || "";
    const desc = cells[2]?.textContent?.trim() || "";
    const cta = cells[3]?.textContent?.trim() || "READ MORE";

    const col = document.createElement("div");
    col.className = "innovation-col";

    const card = document.createElement("div");
    card.className =
      index === 0 ? "innovation-card featured" : "innovation-card";

    /* Image recreated safely */
    if (picture?.src) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "innovation-card-img";

      const img = document.createElement("img");
      img.src = picture.src;
      img.alt = picture.alt || "";

      imgWrap.append(img);
      card.append(imgWrap);
    }

    /* Content */
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
