export default function decorate(block) {
  const children = [...block.children];
  const titleEl = children.shift();
  const descEl = children.shift();

  block.classList.add("key-highlights");

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement("div");
  wrapper.className = "key-highlights-wrapper container";

  /* ---------- Header ---------- */
  const header = document.createElement("div");
  header.className = "entry-container text-center mb-5";

  /* ---- Title (KEEP authored node) ---- */
  if (titleEl) {
    titleEl.classList.add("title");
    header.append(titleEl); // move, don’t recreate
  }

  /* ---- Description (KEEP authored node) ---- */
  if (descEl) {
    descEl.classList.add("sec-desc");
    header.append(descEl);
  }

  if (header.children.length) {
    wrapper.append(header);
  }

  /* ---------- Grid ---------- */
  const grid = document.createElement("div");
  grid.className = "key-highlights-grid";

  children.forEach((item) => {
    const [imgEl, titleCell, descCell] = [...item.children];

    const card = document.createElement("div");
    card.className = "key-highlight-card";

    // Image
    if (imgEl) {
      imgEl.classList.add("key-highlight-media");
      card.append(imgEl);
    }

    // ---- Card title: <p> → <h3> (UE-safe) ----
    if (titleCell) {
      const p = titleCell.querySelector("p");
      if (p) {
        const h3 = document.createElement("h3");
        h3.innerHTML = p.innerHTML;
        p.replaceWith(h3);
      }
      card.append(titleCell);
    }

    // Description
    if (descCell) {
      descCell.classList.add("key-highlight-desc");
      card.append(descCell);
    }

    item.innerHTML = "";
    item.append(card);
    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Final attach (NO clearing block) ---------- */
  block.append(wrapper);
}
