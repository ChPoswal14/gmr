export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const sectionTitle = original[0]; // editable node
  const sectionDesc  = original[1];

  // key-highlight-item blocks (dropdown items)
  const items = original.slice(2);

  block.classList.add('key-highlights');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'key-highlights-wrapper';

  /* ---------- Header ---------- */
  const header = document.createElement('div');
  header.className = 'entry-container text-center';

  // Preserve AEM editable title - just wrap it, don't create new h2
  if (sectionTitle) {
    // Move the sectionTitle content into the header
    // This keeps AEM editable structure intact
    header.append(sectionTitle);
    
    // Ensure the first text element in sectionTitle is wrapped in h2
    // without creating additional wrapper divs
    const firstChild = sectionTitle.firstElementChild;
    if (firstChild && firstChild.tagName !== 'H2') {
      // If the content isn't already in an h2, wrap it
      const h2 = document.createElement('h2');
      // Move all children from sectionTitle into h2
      while (sectionTitle.firstChild) {
        h2.appendChild(sectionTitle.firstChild);
      }
      sectionTitle.appendChild(h2);
    }
  }

  // Append section description as sibling
  if (sectionDesc) header.append(sectionDesc);

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'key-highlights-grid';

  items.forEach((item) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const card = document.createElement('div');
    card.className = 'key-highlight-card';

    /* Image */
    if (fields[0]) {
      const media = document.createElement('div');
      media.className = 'key-highlight-media';
      media.append(fields[0]);
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
      desc.className = 'key-highlight-desc';
      desc.innerHTML = fields[2].innerHTML;
      card.append(desc);
    }

    // Keep key-highlight-item wrapper
    item.innerHTML = '';
    item.append(card);

    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace block content ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}