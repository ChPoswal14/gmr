export default async function decorate(block) {
  // 1. Read authored dataSource from UE
  const dataSourceEl = block.querySelector('[data-aue-prop="dataSource"]');
  const dataSource = dataSourceEl?.textContent?.trim();
  if (!dataSource) return;

  // Hide the raw field in the rendered page
  dataSourceEl.style.display = 'none';

  // 2. Load JSON from the spreadsheet
  let rows;
  try {
    const resp = await fetch(dataSource);
    if (!resp.ok) throw new Error(`Failed to load ${dataSource}`);
    const json = await resp.json();
    rows = Array.isArray(json.data) ? json.data : json;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('aviation-services: data load error', e);
    return;
  }

  // 3. Clear block and build grid
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'aviation-services-grid';

  rows.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'aviation-card';

    // Image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'aviation-card-image';
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      imgWrap.appendChild(img);
    }

    // Body
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
