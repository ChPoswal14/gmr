export default function decorate(block) {
  const rows = [...block.children];

  // -------- Section Title --------
  const titleRow = rows.shift();
  const sectionTitle = titleRow?.querySelector("p")?.textContent || "";

  const sectionHeader = document.createElement("h2");
  sectionHeader.className = "commitment-cards-title";
  sectionHeader.textContent = sectionTitle;

  // -------- Cards Wrapper --------
  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "commitment-cards-grid";

  rows.forEach((row) => {
    const cells = [...row.children];

    const image = cells[0]?.querySelector("picture");
    const title = cells[1]?.textContent || "";
    const description = cells[2]?.innerHTML || "";
    const buttonText = cells[3]?.textContent || "";
    const link = cells[4]?.querySelector("a")?.getAttribute("href");

    const card = document.createElement("div");
    card.className = "commitment-card";

    // image
    if (image) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "commitment-card-image";
      imgWrap.append(image);
      card.append(imgWrap);
    }

    // body
    const body = document.createElement("div");
    body.className = "commitment-card-body";

    body.innerHTML = `
      <h3>${title}</h3>
      <p>${description}</p>
      ${
        buttonText && link
          ? `<a href="${link}" class="commitment-btn">${buttonText}</a>`
          : ""
      }
    `;

    card.append(body);
    cardsWrapper.append(card);
  });

  // -------- Replace Block --------
  block.innerHTML = "";
  block.append(sectionHeader, cardsWrapper);
}
