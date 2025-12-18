export default function decorate(block) {
  // Destructure first two children
  const [titleEl, descEl, ...items] = [...block.children];

  block.classList.add("key-highlights");

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement("div");
  wrapper.className = "key-highlights-wrapper container";

  /* ---------- Header ---------- */
  const header = document.createElement("div");
  header.className = "entry-container text-center mb-5";

  // ---- Title: <p> → <h2> ----
    if (titleCell) {
      titleCell.classList.add("title");
      const p = titleCell.querySelector("p");
      if (p) {
        const h3 = document.createElement("h2");
        h3.innerHTML = p.innerHTML;
        p.replaceWith(h2);
      }
    }

  /* ---- Description (keep as-is) ---- */
  if (descEl) {
    const descWrapper = document.createElement("div");
    descWrapper.className = "sec-desc";
    descWrapper.innerHTML = descEl.innerHTML;
    header.append(descWrapper);
  }

  if (header.children.length) {
    wrapper.append(header);
  }

  /* ---------- Grid ---------- */
  const grid = document.createElement("div");
  grid.className = "key-highlights-grid";

  items.forEach((item) => {
    if (!item?.children?.length) return;

    const [imgEl, titleCell, descCell] = [...item.children];

    const card = document.createElement("div");
    card.className = "key-highlight-card";

    /* ---- Image ---- */
    if (imgEl) {
      const media = document.createElement("div");
      media.className = "key-highlight-media";
      media.innerHTML = imgEl.innerHTML;
      card.append(media);
    }

    /* ---- Card title: <p> → <h3> ---- */
    if (titleCell) {
      titleCell.classList.add("comm-card-title");
      const p = titleCell.querySelector("p");
      if (p) {
        const h3 = document.createElement("h3");
        h3.innerHTML = p.innerHTML;
        p.replaceWith(h3);
        card.append(h3);
      }
    }

    /* ---- Description ---- */
    if (descCell) {
      const p = document.createElement("p");
      p.className = "key-highlight-desc";
      p.innerHTML = descCell.innerHTML;
      card.append(p);
    }

    item.innerHTML = "";
    item.append(card);
    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace block content ---------- */
  block.innerHTML = "";
  block.append(wrapper);
}
