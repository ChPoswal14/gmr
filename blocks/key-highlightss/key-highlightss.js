export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const sectionTitle = original[0];
  const sectionDesc  = original[1];

  // Everything after title + description = key-highlight-item
  const items = original.slice(2);

  block.classList.add('key-highlights');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'key-highlights-wrapper';

  /* ---------- Header ---------- */
  const header = document.createElement('div');
  header.className = 'key-highlights-header';

  if (sectionTitle) header.append(sectionTitle);
  if (sectionDesc) header.append(sectionDesc);

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'key-highlights-grid';

  /* ---------- LOOP: key-highlight-item ---------- */
  items.forEach((item) => {
    const children = [...item.children];

    const card = document.createElement('div');
    card.className = 'key-highlight-card';

    /* Image (1st field) */
    const imageWrap = children[0];
    if (imageWrap) {
      const media = document.createElement('div');
      media.className = 'key-highlight-media';
      media.append(imageWrap); // move node, keep srcset
      card.append(media);
    }

    /* Title (2nd field) */
    if (children[1]) {
      const title = document.createElement('h3');
      title.innerHTML = children[1].innerHTML;
      card.append(title);
    }

    /* Description (3rd field) */
    if (children[2]) {
      const desc = document.createElement('p');
      desc.className = 'key-highlight-desc';
      desc.innerHTML = children[2].innerHTML;
      card.append(desc);
    }

    grid.append(card);
  });

  wrapper.append(grid);

  /* ---------- Replace content (same as your working code) ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}
