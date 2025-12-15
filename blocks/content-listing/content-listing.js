/**
 * Content Listing – FINAL (EDS-safe, metadata-optional)
 * Configuration via TEXT inside section
 */

function readConfig(block) {
  const config = {};
  const first = block.firstElementChild;

  if (!first) return config;

  const lines = first.textContent
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      config[key] = value;
    }
  });

  // Remove config text from DOM
  first.remove();
  return config;
}

async function fetchPageMeta(url) {
  try {
    const res = await fetch(`${url}.plain.html`);
    if (!res.ok) return null;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const meta = (name) =>
      doc.querySelector(`meta[name="${name}"]`)?.content || '';

    const pageTitle =
      meta('listingTitle') ||
      doc.querySelector('title')?.textContent ||
      'Untitled';

    return {
      url,
      title: pageTitle,
      description: meta('listingDescription'),
      image: meta('listingImage'),
      type: meta('listingType') || null,
      audience: meta('listingAudience')
        ? meta('listingAudience').split(',').map(a => a.trim())
        : [],
      featured: meta('listingFeatured') === 'true',
      priority: parseInt(meta('listingPriority') || '100', 10),
      show: meta('showInListing') !== 'false'
    };
  } catch (e) {
    console.error('Content Listing: metadata fetch failed for', url, e);
    return null;
  }
}

export default async function decorate(block) {
  // 1️⃣ Read config from text
  const config = readConfig(block);

  const limit = parseInt(config.limit || '999', 10);
  const types = config.type
    ? config.type.split(',').map(t => t.trim())
    : [];
  const audiences = config.audience
    ? config.audience.split(',').map(a => a.trim())
    : [];

  // 2️⃣ Read links
  const links = [...block.querySelectorAll('a')].map(a => a.href);

  if (!links.length) {
    block.innerHTML = '<p>No content configured.</p>';
    return;
  }

  // 3️⃣ Fetch metadata
  let items = (await Promise.all(links.map(fetchPageMeta)))
    .filter(Boolean)
    .filter(item => item.show);

  // 4️⃣ Filter by type (ONLY if filter is present)
  if (types.length) {
    items = items.filter(item =>
      item.type && types.includes(item.type)
    );
  }

  // 5️⃣ Filter by audience (ONLY if filter is present)
  if (audiences.length) {
    items = items.filter(item =>
      item.audience.length &&
      item.audience.some(a => audiences.includes(a))
    );
  }

  // 6️⃣ Sort: featured → priority
  items.sort((a, b) =>
    b.featured - a.featured ||
    a.priority - b.priority
  );

  // 7️⃣ Limit
  items = items.slice(0, limit);

  // 8️⃣ Render
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
            ${item.description ? `<p>${item.description}</p>` : ''}
          </div>
        </article>
      `).join('')}
    </div>
  `;
}
