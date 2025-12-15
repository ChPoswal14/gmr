export default function decorate(block) {
  const rows = [...block.children];

  // Create container
  const outerContainer = document.createElement("div");
  outerContainer.className = "sec-commitment spacer";

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

    cells[0]?.classList.add("commitment-card-image");
    cells[1]?.classList.add("commitment-card-title");
    cells[2]?.classList.add("commitment-card-desc");

    // remove plain CTA text row safely
    cells[3]?.remove();

    cells[4]?.classList.add("commitment-card-cta");

    grid.append(row); // MOVE node
  });

  // ---- Assemble container ----
  container.append(headerRow, grid);

  // ---- Append container (do NOT clear block) ----
  outerContainer.append(container);
  block.append(outerContainer);
}
