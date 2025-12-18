export default function decorate(block) {
  const original = [...block.children];

  const sectionTitle = original[0]?.textContent || "";
  const sectionDesc  = original[1]?.innerHTML || "";

  // key-highlight-item blocks (dropdown items)
  const items = original.slice(2);

  block.classList.add('key-highlights');

  /* ---------- Header ---------- */
  const headerHTML = `
    <div class="entry-container text-center">
      <div>
        <h2>${sectionTitle}</h2>
        <p>${sectionDesc}</p>
      </div>
    </div>
  `;

  /* ---------- Grid: loop through key-highlight-item ---------- */
  let gridHTML = `<div class="key-highlights-grid">`;

  items.forEach((item, index) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const imgHTML = fields[0]?.outerHTML || "";
    const titleHTML = fields[1] ? `<h3 class="key-highlight-toggle">${fields[1].innerHTML}</h3>` : "";
    const descHTML = fields[2] ? `<div class="key-highlight-content"><p class="key-highlight-desc">${fields[2].innerHTML}</p></div>` : "";

    // Keep key-highlight-item wrapper for dropdown
    gridHTML += `
      <div class="key-highlight-item" id="key-highlight-item-${index}">
        <div class="key-highlight-card">
          ${imgHTML ? `<div class="key-highlight-media">${imgHTML}</div>` : ""}
          ${titleHTML}
          ${descHTML}
        </div>
      </div>
    `;
  });

  gridHTML += `</div>`;

  /* ---------- Final runtime.innerHTML ---------- */
  block.innerHTML = `
    <div class="key-highlights-wrapper">
      ${headerHTML}
      ${gridHTML}
    </div>
  `;

  /* ---------- Dropdown JS ---------- */
  block.querySelectorAll('.key-highlight-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parentItem = toggle.closest('.key-highlight-item');
      const content = parentItem.querySelector('.key-highlight-content');
      if (!content) return;

      // Toggle active class for styling
      parentItem.classList.toggle('active');

      // Smooth toggle
      if (parentItem.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });
};
