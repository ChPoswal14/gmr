export default function decorate(block) {
  const rows = [...block.children];

  // ---- Section title (keep node) ----
  const titleRow = rows.shift();
  titleRow.classList.add("commitment-cards-header");

  // ---- Cards grid ----
  const grid = document.createElement("div");
  grid.className = "commitment-cards-grid";

  rows.forEach((row) => {
    row.classList.add("commitment-card");

    const cells = [...row.children];

    cells[0]?.classList.add("commitment-card-image");
    cells[1]?.classList.add("commitment-card-title");
    cells[2]?.classList.add("commitment-card-desc");
    cells[3]?.remove(); // plain text CTA row not needed
    cells[4]?.classList.add("commitment-card-cta");

    grid.append(row); // MOVE node (do not recreate)
  });

  // ---- Insert grid without clearing block ----
  block.append(grid);
}
