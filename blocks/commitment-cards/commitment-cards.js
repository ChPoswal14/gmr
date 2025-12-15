export default function decorate(block) {
  // Container
  const container = document.createElement("div");
  container.className = "container";

  // Section title (first row)
  const sectionRow = block.querySelector(":scope > div");
  let sectionTitle = "";

  if (sectionRow) {
    sectionTitle = sectionRow.textContent.trim();
    sectionRow.remove();
  }

  // H2 title
  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title text-center fw-normal mb-5";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  // Row wrapper (before loop)
  const row = document.createElement("div");
  row.className = "row";

  // Remaining cards
  [...block.children].forEach((card) => {
    card.classList.add("col-md-6");
    row.appendChild(card);
  });

  // Append row after loop
  container.appendChild(row);

  // Attach container to block
  block.appendChild(container);
}
