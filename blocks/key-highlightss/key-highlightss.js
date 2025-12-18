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

  // Extract content from AEM editable fields
  const title = titleEl ? titleEl.innerHTML.trim() : '';
  const description = descEl ? descEl.innerHTML.trim() : '';

  // Create header HTML using template literal
  if (title || description) {
    header.innerHTML = `
      ${title ? `<h2 class="title">${title}</h2>` : ''}
      ${description ? `<div class="sec-desc">${description}</div>` : ''}
    `;
  }

  wrapper.append(header);

  /* ---------- Grid ---------- */
  const grid = document.createElement('div');
  grid.className = 'key-highlights-grid';

  items.forEach((item) => {
    if (!item?.children?.length) return;

    const [imgEl, titleEl, descEl] = [...item.children];
    
    // Extract content for card
    const imgContent = imgEl ? imgEl.innerHTML.trim() : '';
    const cardTitle = titleEl ? titleEl.innerHTML.trim() : '';
    const cardDesc = descEl ? descEl.innerHTML.trim() : '';

    // Create card HTML using template literal
    const cardHTML = `
      ${imgContent ? `
        <div class="key-highlight-media">
          ${imgContent}
        </div>
      ` : ''}
      
      ${cardTitle ? `<h3>${cardTitle}</h3>` : ''}
      
      ${cardDesc ? `
        <p class="key-highlight-desc">
          ${cardDesc}
        </p>
      ` : ''}
    `;

    // Create card container
    const card = document.createElement('div');
    card.className = 'key-highlight-card';
    card.innerHTML = cardHTML.trim();

    // Keep original wrapper, replace content
    item.innerHTML = '';
    item.append(card);
    grid.append(item);
  });

  wrapper.append(grid);

  /* ---------- Replace block content ---------- */
  block.innerHTML = '';
  block.append(wrapper);
}