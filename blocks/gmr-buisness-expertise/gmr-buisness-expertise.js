export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  /* ===============================
     1️⃣ READ EXISTING UE ROWS
     =============================== */
  const sectionTitleRow = rows[0];
  const sectionDescRow = rows[1];
  const cardRows = rows.slice(2);

  /* ===============================
     2️⃣ CREATE WRAPPERS (NO DELETE)
     =============================== */
  const section = document.createElement("section");
  section.className = "gmr-buisness-expertise-section spacer";

  const container = document.createElement("div");
  container.className = "container";

  const header = document.createElement("div");
  header.className = "text-center mb-5";

  const grid = document.createElement("div");
  grid.className = "row g-4 justify-content-center";

  /* ===============================
     3️⃣ MOVE HEADER ROWS (KEEP NODES)
     =============================== */
  sectionTitleRow.classList.add("sec-title");
  sectionDescRow.classList.add("sec-desc");

  header.append(sectionTitleRow, sectionDescRow);

  /* ===============================
     4️⃣ CARD LOOP (MOVE ROWS, NOT CLONE)
     =============================== */
  cardRows.forEach((row) => {
    row.classList.add("col-lg-4", "col-md-6", "expertise-col");

    const cells = [...row.children];
    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const ctaTextCell = cells[3];
    const ctaLinkCell = cells[4];

    const card = document.createElement("div");
    card.className = "expertise-card h-100";

    if (imageCell) {
      imageCell.classList.add("expertise-card-img");
      card.append(imageCell);
    }

    const body = document.createElement("div");
    body.className = "expertise-card-body";

    if (titleCell) body.append(titleCell);
    if (descCell) body.append(descCell);

    if (ctaTextCell && ctaLinkCell) {
      ctaTextCell.classList.add("cta-text");
      ctaLinkCell.classList.add("cta-link");

      const link = ctaLinkCell.querySelector("a");

      if (link) {
        const text = ctaTextCell.textContent.trim();

        if (text) {
          // Put text INSIDE <a>
          link.textContent = text;
        }

        link.classList.add("btn-link");
      }

      const ctaWrapper = document.createElement("div");
      ctaWrapper.className = "expertise-cta";

      // IMPORTANT: keep BOTH fields in DOM
      ctaWrapper.append(ctaLinkCell);
      body.append(ctaWrapper);
    }

    card.append(body);
    row.append(card);
    grid.append(row);
  });

  /* ===============================
     5️⃣ ASSEMBLE (SAFE)
     =============================== */
  container.append(header, grid);
  section.append(container);

  block.prepend(section);
}
