export default function decorate(block) {
  // Get all rows
  const rows = [...block.children];

  // First row → Section Title
  const sectionTitle = rows.shift()?.textContent?.trim();

  // Create section wrapper
  const section = document.createElement("section");
  section.className = "sec-commitment spacer";

  const container = document.createElement("div");
  container.className = "container";

  // Section title
  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title text-center fw-normal mb-5";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  const row = document.createElement("div");
  row.className = "row";

  // Remaining rows → Cards
  rows.forEach((card) => {
    const cols = [...card.children];

    const image = cols[0]?.querySelector("img");
    const title = cols[1]?.textContent?.trim();
    const description = cols[2]?.innerHTML;
    const buttonText = cols[3]?.textContent?.trim();
    const buttonLink = cols[4]?.querySelector("a")?.href;

    const col = document.createElement("div");
    col.className = "col-md-6";

    col.innerHTML = `
      <div class="comm-card">
        <div class="comm-card-img">
          ${image ? image.outerHTML : ""}
        </div>
        <div class="comm-card-body">
          <h3>${title || ""}</h3>
          <p>${description || ""}</p>
          ${
            buttonText && buttonLink
              ? `<a href="${buttonLink}" class="btn btn-primary">${buttonText}</a>`
              : ""
          }
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  container.appendChild(row);
  section.appendChild(container);

  // Replace authored content
  block.replaceWith(section);
}
