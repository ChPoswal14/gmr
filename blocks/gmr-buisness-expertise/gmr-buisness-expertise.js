export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  /* =========================
     Header
  ========================== */
  const headerRow = rows.shift();
  const headerCells = [...headerRow.children];

  const sectionTitle = headerCells[0]?.innerHTML || "";
  const sectionDescription = headerCells[1]?.innerHTML || "";

  /* =========================
     Wrapper
  ========================== */
  block.innerHTML = `
    <div class="container py-5">
      <div class="row mb-4 text-center">
        <div class="col-12">
          <h2 class="mb-3">${sectionTitle}</h2>
          <div class="text-muted">${sectionDescription}</div>
        </div>
      </div>
      <div class="row g-4 gmr-buisness-items"></div>
    </div>
  `;

  const itemsContainer = block.querySelector(".gmr-buisness-items");

  /* =========================
     Cards (each remaining row)
  ========================== */
  rows.forEach((row) => {
    const cols = [...row.children];

    const image = cols[0]?.querySelector("picture")?.outerHTML || "";
    const title = cols[1]?.innerHTML || "";
    const description = cols[2]?.innerHTML || "";
    const ctaText = cols[3]?.textContent?.trim() || "";
    const ctaLink = cols[4]?.textContent?.trim() || "#";

    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6 col-lg-4";

    cardCol.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${image}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${title}</h5>
          <div class="card-text mb-3">${description}</div>
          ${
            ctaText
              ? `<a href="${ctaLink}" class="btn btn-primary mt-auto">${ctaText}</a>`
              : ""
          }
        </div>
      </div>
    `;

    itemsContainer.appendChild(cardCol);
  });
}
