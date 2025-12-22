export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  /* =========================
     Create wrappers
  ========================== */
  const outer = document.createElement("div");
  outer.className = "sec-commitment spacer";

  const container = document.createElement("div");
  container.className = "container";

  /* =========================
     HEADER (row 0)
  ========================== */
  const headerRow = rows.shift();
  const headerCells = [...headerRow.children];

  const headerWrapper = document.createElement("div");
  headerWrapper.className = "sec-head text-center mb-5";

  const secTitle = headerCells[0];
  const secDesc = headerCells[1];

  // Title
  if (secTitle) {
    const p = secTitle.querySelector("p");
    if (p) {
      const h2 = document.createElement("h2");
      h2.innerHTML = p.innerHTML;
      h2.className = "mb-3";
      p.replaceWith(h2);
    }
    headerWrapper.append(secTitle);
  }

  // Description
  if (secDesc) {
    const p = secDesc.querySelector("p");
    if (p) {
      const h2 = document.createElement("h2");
      h2.innerHTML = p.innerHTML;
      h2.className = "mb-3";
      p.replaceWith(h2);
    }
    headerWrapper.append(secDesc);
  }

  /* =========================
     GRID
  ========================== */
  const grid = document.createElement("div");
  grid.className = "row g-4";

  rows.forEach((row) => {
    row.classList.add("col-12", "col-md-6", "col-lg-4");

    const cells = [...row.children];

    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const ctaTextCell = cells[3];
    const ctaLinkCell = cells[4];

    imageCell?.classList.add("mb-3");

    // Card title
    if (titleCell) {
      const p = titleCell.querySelector("p");
      if (p) {
        const h3 = document.createElement("h3");
        h3.innerHTML = p.innerHTML;
        p.replaceWith(h3);
      }
    }

    // CTA
    if (ctaLinkCell) {
      const link =
        ctaLinkCell.querySelector("a") || document.createElement("a");
      const href = ctaLinkCell.querySelector("a")?.getAttribute("href") || "";
      const text = ctaTextCell?.textContent?.trim() || "";

      if (!link.parentNode) ctaLinkCell.append(link);
      if (href) link.href = href;
      if (text) link.textContent = text;

      link.classList.add("btn-link");
      ctaTextCell?.remove();
    }

    // Body wrapper
    const body = document.createElement("div");
    body.className = "card h-100 p-3";

    [imageCell, titleCell, descCell, ctaLinkCell].forEach((el) => {
      if (el) body.append(el);
    });

    row.innerHTML = "";
    row.append(body);
    grid.append(row);
  });

  /* =========================
     Assemble
  ========================== */
  container.append(headerWrapper, grid);
  outer.append(container);

  block.innerHTML = "";
  block.append(outer);
}
