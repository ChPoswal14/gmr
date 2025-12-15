export default function decorate(block) {
  block.classList.add('innovation-cards');

  const rows = [...block.children];

  // ---- Section Title ----
  const titleRow = rows[0];
  const titleText = titleRow?.querySelector(':scope > div')?.textContent || '';
  const titleEl = document.createElement('h2');
  titleEl.className = 'section-title';
  titleEl.textContent = titleText;

  // ---- Section Description ----
  const descRow = rows[1];
  const descText = descRow?.querySelector(':scope > div')?.innerHTML || '';
  const descEl = document.createElement('div');
  descEl.className = 'section-description';
  descEl.innerHTML = descText;

  // ---- Card Grid ----
  const grid = document.createElement('div');
  grid.className = 'innovation-card-grid';

  // Remaining rows = card items
  rows.slice(2).forEach((cardRow) => {
    const cols = [...cardRow.children];
    const img = cols[0]?.querySelector('img');
    const title = cols[1]?.textContent || '';
    const desc = cols[2]?.innerHTML || '';
    const cta = cols[3]?.textContent || '';

    const card = document.createElement('div');
    card.className = 'innovation-card';

    // Image
    if (img) {
      const picture = document.createElement('picture');
      picture.append(img.cloneNode(true));
      card.append(picture);
    }

    // Text section
    const content = document.createElement('div');
    content.className = 'innovation-card-content';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    content.append(h3);

    const p = document.createElement('p');
    p.innerHTML = desc;
    content.append(p);

    // CTA
    if (cta) {
      const ctaEl = document.createElement('div');
      ctaEl.className = 'innovation-card-cta';
      ctaEl.textContent = cta;
      content.append(ctaEl);
    }

    card.append(content);
    grid.append(card);
  });

  // ---- Assemble final structure ----
  block.innerHTML = '';
  block.append(titleEl, descEl, grid);
}
