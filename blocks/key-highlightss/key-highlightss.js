export default function decorate(block) {
  const children = [...block.children];
  const titleEl = children.shift();
  const descEl = children.shift();
  const items = children;

  block.classList.add('key-highlights');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'key-highlights-wrapper container';

  /* ---------- Header ---------- */
  const header = document.createElement('header');
  header.className = 'entry-container text-center mb-5';

  // ✅ Ensure H2 without breaking UE
  if (titleEl) {
    if (titleEl.tagName !== 'H2') {
      const h2 = document.createElement('h2');
      h2.className = 'title';
      h2.append(titleEl); // move original node
      header.append(h2);
    } else {
      header.append(titleEl);
    }
  }

  if (descEl) {
    descEl.classList.add('sec-desc');
    header.append(descEl);
  }

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'key-highlights-grid';

  items.forEach((item) => {
    if (!item?.children?.length) return;

    const [imgEl, itemTitleEl, itemDescEl] = [...item.children];

    const card = document.createElement('div');
    card.className = 'key-highlight-card mt-4';

    // Image
    if (imgEl) {
      const media = document.createElement('div');
      media.className = 'key-highlight-media';
      media.append(imgEl);
      card.append(media);
    }

    // ✅ Ensure H3 for item title
    if (itemTitleEl) {
      if (itemTitleEl.tagName !== 'H3') {
        const h3 = document.createElement('h3');
        h3.append(itemTitleEl); // move original node
        card.append(h3);
      } else {
        card.append(itemTitleEl);
      }
    }

    // Description
    if (itemDescEl) {
      card.append(itemDescEl);
    }

    item.innerHTML = '';
    item.append(card);
    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Attach without destroying UE bindings ---------- */
  block.append(wrapper);
}
