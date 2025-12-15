export default function decorate(block) {
  // Outer container
  const container = document.createElement("div");
  container.className = "commitment-cards__container";

  // Section title (parent model field)
  const sectionRow = block.querySelector(":scope > div");
  let sectionTitle = "";

  if (sectionRow) {
    sectionTitle = sectionRow.textContent.trim();
    sectionRow.remove();
  }

  // Title
  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "commitment-cards__title";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  // Row wrapper
  const row = document.createElement("div");
  row.className = "row";

  // Card processing
  [...block.children].forEach((card) => {
    // col wrapper
    card.classList.add("col-md-6", "commitment-card");

    const cols = [...card.children];

    // First div → media
    const media = cols.shift();
    if (media) {
      media.classList.add("comm-card-img");
    }

    // Remaining elements → content wrapper
    const content = document.createElement("div");
    content.className = "comm-card-body";

    cols.forEach((el) => content.appendChild(el));

    if (media) {
      card.appendChild(media);
    }
    card.appendChild(content);

    row.appendChild(card);
  });

  container.appendChild(row);
  block.appendChild(container);
}
