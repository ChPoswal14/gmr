export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const sectionTitle = original[0];
  const items = original.slice(1); // award-item blocks

  block.classList.add('awards-recognitions');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'awards-wrapper';

  /* ---------- Header ---------- */
  const header = document.createElement('div');
  header.className = 'awards-header';

  if (sectionTitle) header.append(sectionTitle);
  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'awards-grid';

  /* ---------- LOOP award-item (dropdown stays) ---------- */
  items.forEach((item) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const card = document.createElement('div');
    card.className = 'award-card';

    /* Image */
    if (fields[0]) {
      const media = document.createElement('div');
      media.className = 'award-media';
      media.append(fields[0]); // move node to keep UE reference
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

    // IMPORTANT: keep award-item wrapper
    item.innerHTML = '';
    item.append(card);

    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace content (same as working code) ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}
