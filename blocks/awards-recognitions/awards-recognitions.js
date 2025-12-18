export default function decorate(block) {
  // Destructure first two children
  const [titleEl, descEl, ...items] = [...block.children];

  block.classList.add('key-highlights');

  /* ---------- Wrapper ---------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'key-highlights-wrapper';

  /* ---------- Header ---------- */
  const header = document.createElement('div');
  header.className = 'entry-container text-center';

  // Extract text content for h2 (no inner tags)
  const titleText = titleEl ? titleEl.textContent.trim() : '';
  const descHTML = descEl ? descEl.innerHTML.trim() : '';

  // Use innerHTML for header
  header.innerHTML = `
    ${titleText ? `<h2 class="text-primary sec-title">${titleText}</h2>` : ''}
    ${descHTML ? `<p class="sec-desc">${descHTML}</p>` : ''}
  `;

  // Keep original editable title for AEM, hide visually
  if (titleEl) titleEl.style.display = 'none';

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'key-highlights-grid';

  items.forEach((item) => {
    if (!item?.children?.length) return;

    const [imgEl, cardTitleEl, cardDescEl] = [...item.children];

    const imgContent = imgEl ? imgEl.innerHTML.trim() : '';
    const cardTitle = cardTitleEl ? cardTitleEl.innerHTML.trim() : '';
    const cardDesc = cardDescEl ? cardDescEl.innerHTML.trim() : '';

    // Build card innerHTML
    const cardHTML = `
      ${imgContent ? `<div class="key-highlight-media">${imgContent}</div>` : ''}
      ${cardTitle ? `<h3>${cardTitle}</h3>` : ''}
      ${cardDesc ? `<p class="key-highlight-desc">${cardDesc}</p>` : ''}
    `;

    const card = document.createElement('div');
    card.className = 'key-highlight-card';
    card.innerHTML = cardHTML.trim();

    // Keep original wrapper
    item.innerHTML = '';
    item.append(card);

    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace block content ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}
