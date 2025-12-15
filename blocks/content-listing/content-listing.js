/**
 * Content Listing Block – EDS / Franklin
 * -------------------------------------
 * Section name must be: content-listing
 *
 * Text inside section (config example):
 *
 * limit=3
 * type=news
 * audience=aero
 *
 * /en/news/page-1
 * /en/news/page-2
 */

const TYPE_LABELS = {
  news: 'Press Release',
  blog: 'Blog',
  story: 'Story',
  'case-study': 'Case Study',
};

/**
 * Read config from first text block and remove it
 */
function readConfig(block) {
  const config = {};
  const first = block.firstElementChild;

  if (!first) return config;

  first.textContent
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    });

  // Remove config text from DOM
  first.remove();

  return config;
}

/**
 * Fetch page metadata via .plain.json
 */
async function fetchPage(url) {
  try {
    const res = await fetch(`${url}.plain.json`);
    if (!res.ok) return null;

    const json = await res.json();
    const meta = json.metadata || {};

    return {
      url,
      title:
        meta.cardTitle ||
        meta['jcr:title'] ||
        json.title ||
        'Untitled',

      image: meta.cardImage || null,
      images: json.images || [],

      type: meta.contentType || '',
      audience: meta.contentAudience
        ? meta.contentAudience.split(',').map((a) => a.trim())
        : [],

      date: meta.publishDate || '',
      featured: meta.featured === 'true',
      show: meta.showInListing !== 'false',
      priority: parseInt(meta.cardPriority || '100', 10),

      ctaLabel: meta.ctaLabel || 'Read More',
      ctaLink: meta.ctaLink || url,
    };
  } catch (e) {
    console.error('Content listing fetch failed:', url, e);
    return null;
  }
}

/**
 * Resolve card image
 */
function resolveImage(item) {
  if (item.image) return item.image;
  if (item.images.length) return item.images[0];
  return '/content/dam/gmr/defaults/card-fallback.jpg';
}

/**
 * MAIN DECORATE FUNCTION
 */
export default async function decorate(block) {
  const config = readConfig(block);

  const limit = parseInt(config.limit || '999', 10);
  const types = config.type
    ? config.type.split(',').map((t) => t.trim())
    : [];
  const audiences = config.audience
    ? config.audience.split(',').map((a) => a.trim())
    : [];

  // Remaining links after config removal
  const links = [...block.querySelectorAll('a')].map((a) => a.href);

  if (!links.length) {
    block.innerHTML = '<p>No content configured.</p>';
    return;
  }

  let items = (await Promise.all(links.map(fetchPage)))
    .filter(Boolean)
    .filter((item) => item.show);

  // Filter by content type
  if (types.length) {
    items = items.filter(
      (item) => item.type && types.includes(item.type)
    );
  }

  // Filter by audience
  if (audiences.length) {
    items = items.filter(
      (item) =>
        item.audience.length &&
        item.audience.some((a) => audiences.includes(a))
    );
  }

  // Sort: featured first, then priority
  items.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      a.priority - b.priority
  );

  // Apply limit
  items = items.slice(0, limit);

  // Render cards
  block.innerHTML = `
    <div class="content-list">
      ${items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-card__image">
            <img
              src="${resolveImage(item)}"
              alt="${item.title}"
              loading="lazy"
            />
          </div>

          <div class="content-card__body">
            ${
        item.type
          ? `<span class="content-card__badge">
                    ${TYPE_LABELS[item.type] || item.type}
                   </span>`
          : ''
      }

            ${
        item.date
          ? `<time class="content-card__date">${item.date}</time>`
          : ''
      }

            <h3 class="content-card__title">
              <a href="${item.url}">${item.title}</a>
            </h3>

            <a class="content-card__cta" href="${item.ctaLink}">
              ${item.ctaLabel} →
            </a>
          </div>
        </article>
      `
    )
    .join('')}
    </div>
  `;
}
