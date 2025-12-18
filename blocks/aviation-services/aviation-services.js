export default async function decorate(block) {
  // 1. Read authored dataSource from Universal Editor
  const dataSourceEl = block.querySelector('[data-aue-prop="dataSource"]');
  const dataSource = dataSourceEl?.textContent?.trim();

  if (!dataSource) {
    // eslint-disable-next-line no-console
    console.warn('aviation-services: no dataSource authored on block');
    return;
  }

  // Hide the raw field from the rendered UI
  dataSourceEl.style.display = 'none';

  // 2. Fetch JSON from the spreadsheet URL
  let rows;
  try {
    const resp = await fetch(dataSource, { cache: 'no-store' });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} for ${dataSource}`);
    }
    const json = await resp.json();

    // Franklin spreadsheet JSON usually: { data: [ ...rows ] }
    rows = Array.isArray(json.data) ? json.data : (
      Array.isArray(json) ? json : []
    );
    if (!rows.length) {
      // eslint-disable-next-line no-console
      console.warn('aviation-services: no rows found in JSON', json);
      return;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('aviation-services: data load error', e);
    return;
  }

  // 3. Clear block and build 3‑card grid
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'aviation-services-grid';

  rows.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'aviation-card';

    // IMAGE
    const imgWrap = document.createElement('div');
    imgWrap.className = 'aviation-card-image';
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      img.loading = 'lazy';
      imgWrap.appendChild(img);
    }

    // BODY
    const body = document.createElement('div');
    body.className = 'aviation-card-body';

    const h3 = document.createElement('h3');
    h3.className = 'aviation-card-title';
    h3.textContent = item.title || '';
    body.appendChild(h3);

    const p = document.createElement('p');
    p.className = 'aviation-card-description';
    p.textContent = item.description || '';
    body.appendChild(p);

    if (item.ctaLink) {
      const a = document.createElement('a');
      a.href = item.ctaLink;
      a.className = 'aviation-card-cta';
      a.textContent = item.ctaLabel || 'READ MORE';
      body.appendChild(a);
    }

    card.appendChild(imgWrap);
    card.appendChild(body);
    grid.appendChild(card);
  });

  block.appendChild(grid);
}
