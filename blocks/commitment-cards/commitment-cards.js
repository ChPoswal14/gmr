export default function decorate(block) {
  // Create section
  const section = document.createElement("section");
  section.className = "sec-commitment spacer";

  // Create container
  const container = document.createElement("div");
  container.className = "container";

  // Read section title (first row, first cell)
  const sectionRow = block.querySelector(":scope > div");
  let sectionTitle = "";

  if (sectionRow) {
    sectionTitle = sectionRow.textContent.trim();
    sectionRow.remove();
  }

  // Create H2 if title exists
  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title text-center fw-normal mb-5";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  // Move remaining cards into container
  container.append(...block.children);

  // Append container back to block
  section.appendChild(container);
  block.appendChild(section);
}
