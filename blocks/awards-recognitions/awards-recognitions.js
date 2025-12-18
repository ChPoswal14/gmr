export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const sectionTitle = original[0]; // keep editable node
  const items = original.slice(1); // award-item blocks

  block.classList.add('awards-recognitions');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'awards-wrapper';

  /* ---------- Header ---------- */
  const header = document.createElement('div');
  header.className = 'awards-header';

  // Replace <p> with <h2> while keeping AEM editable reference
  if (sectionTitle) {
    const h2 = document.createElement('h2');
    // Move all children of sectionTitle into h2
    while (sectionTitle.firstChild) {
      h2.appendChild(sectionTitle.firstChild);
    }
    sectionTitle.replaceWith(h2);
    header.append(h2);
  }

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'awards-grid';

  /* ---------- LOOP award-item (keep wrapper for dropdown) ---------- */
  items.forEach((item) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const card = document.createElement('div');
    card.className = 'award-card';

    /* Image */
    if (fields[0]) {
      const media = document.createElement('div');
      media.className = 'award-media';
      media.append(fields[0]); // keep editable node
      card.append(media);
    }

    /* Title */
    if (fields[1]) {
      const title = document.createElement('h3');
      title.innerHTML = fields[1].innerHTML;
      card.append(title);
    }

    /* Description */
    if (fields[2]) {
      const desc = document.createElement('p');
      desc.className = 'award-desc';
      desc.innerHTML = fields[2].innerHTML;
      card.append(desc);
    }

    // Keep award-item wrapper
    item.innerHTML = '';
    item.append(card);

    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace block content ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}
