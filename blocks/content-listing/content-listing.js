function parseConfigFromText(block) {
  const config = {};
  const firstChild = block.firstElementChild;

  if (!firstChild) return config;

  const lines = firstChild.textContent
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (!key || !value) return;
    config[key] = value;
  });

  firstChild.remove();
  return config;
}

async function fetchPageMeta(url) {
  const res = await fetch(`${url}.plain.html`);
  if (!res.ok) return null;

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const meta = (name) =>
    doc.querySelector(`meta[name="${name}"]`)?.content || '';

  return {
    url,
    title: meta('listingTitle'),
    description: meta('listingDescription'),
    image: meta('listingImage'),
    type: meta('listingType'),
    audience: meta('listingAudience')
      ? meta('listingAudience').split(',')
      : [],
    featured: meta('listingFeatured') === 'true',
    priority: parseInt(meta('listingPriority') || '100', 10),
    show: meta('showInListing') !== 'false',
  };
}

export default async function decorate(block) {
  // 1. Read config (from text for now)
  const config = parseConfigFromText(block);

  const limit = parseInt(config.limit || '999', 10);
  const types = config.type ? config.type.split(',') : [];
  const audiences = config.audience ? config.audience.split(',') : [];

  // 2. Collect links (temporary/manual discovery)
  const links = [...block.querySelectorAll('a')].map(a => a.href);

  // 3. Fetch metadata
  let items = (await Promise.all(links.map(fetchPageMeta)))
    .filter(Boolean)
    .filter(item => item.show);

  // 4. Filter by type
  if (types.length) {
    items = items.filter(item => types.includes(item.type));
  }

  // 5. Filter by audience
  if (audiences.length) {
    items = items.filter(item =>
      item.audience.some(a => audiences.includes(a))
    );
  }

  // 6. Sort: featured → priority
  items.sort((a, b) =>
    b.featured - a.featured ||
    a.priority - b.priority
  );

  // 7. Limit
  items = items.slice(0, limit);

  // 8. Render
  block.innerHTML = `
    <div class="content-list">
      ${items.map(item => `
        <article class="content-card">
          ${item.image ? `
            <div class="content-card__image">
              <img src="${item.image}" alt="${item.title}">
            </div>
          ` : ''}
          <div class="content-card__body">
            <h3>
              <a href="${item.url}">${item.title}</a>
            </h3>
            <p>${item.description}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}
