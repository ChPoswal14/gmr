export default function decorate(block) {
  const rows = [...block.children];

  // Outer section container (inside .section)
  const outerContainer = document.createElement("div");
  outerContainer.className = "sec-commitment spacer";

  // Bootstrap container
  const container = document.createElement("div");
  container.className = "container";

  // ---- Header ----
  const headerRow = rows.shift();
  headerRow.classList.add("commitment-cards-header");

  // ---- Grid ----
  const grid = document.createElement("div");
  grid.className = "row";

  rows.forEach((row) => {
    row.classList.add("col-md-6", "comm-card");

    const cells = [...row.children];

    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const ctaCell = cells[4];

    // Image
    imageCell?.classList.add("comm-card-img");

    // ---- Body wrapper (title + desc + CTA) ----
    const body = document.createElement("div");
    body.className = "comm-card-body";

    titleCell?.classList.add("comm-card-title");
    descCell?.classList.add("comm-card-desc");
    ctaCell?.classList.add("commitment-card-cta");

    // remove plain CTA text row safely
    cells[3]?.remove();

    // Move existing nodes into body (UE-safe)
    if (titleCell) body.append(titleCell);
    if (descCell) body.append(descCell);
    if (ctaCell) body.append(ctaCell);

    // Append body after image
    row.append(body);

    grid.append(row);
  });

  // ---- Assemble ----
  container.append(headerRow, grid);
  outerContainer.append(container);
  block.append(outerContainer);
}
