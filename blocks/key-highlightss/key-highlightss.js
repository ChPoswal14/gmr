export default function decorate(block) {
  const original = [...block.children];

  const sectionTitle = original[0]?.textContent || "";
  const sectionDesc  = original[1]?.innerHTML || "";

  // key-highlight-item blocks (dropdown items)
  const items = original.slice(2);

  block.classList.add('key-highlights');

  /* ---------- Header + wrapper using runtime.innerHTML ---------- */
  let headerHTML = `
    <div class="entry-container text-center">
      <div>
        <h2>${sectionTitle}</h2>
        <p>${sectionDesc}</p>
      </div>
    </div>
  `;

  /* ---------- Grid ---------- */
  let gridHTML = `<div class="key-highlights-grid">`;

  items.forEach((item) => {
    if (!item || !item.children) return;
    const fields = [...item.children]; // image, title, description

    let imgHTML = fields[0]?.outerHTML || "";
    let titleHTML = fields[1] ? `<h3>${fields[1].innerHTML}</h3>` : "";
    let descHTML = fields[2] ? `<p class="key-highlight-desc">${fields[2].innerHTML}</p>` : "";

    gridHTML += `
      <div class="key-highlight-card">
        ${imgHTML ? `<div class="key-highlight-media">${imgHTML}</div>` : ""}
        ${titleHTML}
        ${descHTML}
      </div>
    `;
  });

  gridHTML += `</div>`;

  /* ---------- Set runtime.innerHTML ---------- */
  block.innerHTML = `
    <div class="key-highlights-wrapper">
      ${headerHTML}
      ${gridHTML}
    </div>
  `;
}
