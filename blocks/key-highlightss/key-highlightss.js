export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  // Header fields
  const sectionTitle = original[0];
  const sectionDesc  = original[1];

  // All highlight items (everything after title + desc)
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

  /* ---------- LOOP key-highlight-item ---------- */
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'key-highlight-card';

    const picture = item.querySelector('picture, img');
    const textDivs = [...item.children];

    if (picture) {
      const media = document.createElement('div');
      media.className = 'key-highlight-media';
      media.append(picture);
      card.append(media);
    }

    if (textDivs[1]) {
      const title = document.createElement('h3');
      title.innerHTML = textDivs[1].innerHTML;
      card.append(title);
    }

    if (textDivs[2]) {
      const desc = document.createElement('p');
      desc.innerHTML = textDivs[2].innerHTML;
      card.append(desc);
    }

    grid.append(card);
  });

  wrapper.append(grid);

  /* ---------- Replace content (same as your working code) ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}
