async function fetchPageMeta(url) {
  const res = await fetch(`${url}.plain.html`);
  if (!res.ok) return null;

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const meta = (name) =>
    doc.querySelector(`meta[name="${name}"]`)?.content || '';

  return {
    title: meta('cardTitle'),
    teaser: meta('cardTeaser'),
    url,
  };
}

export default async function decorate(block) {
  const firstRow = block.firstElementChild;
  const limit = firstRow?.textContent.includes('limit=')
    ? parseInt(firstRow.textContent.split('limit=')[1], 10)
    : 999;

  firstRow?.remove();

  const links = [...block.querySelectorAll('a')]
    .map(a => a.href)
    .slice(0, limit);

  const items = (await Promise.all(links.map(fetchPageMeta)))
    .filter(Boolean);

  block.innerHTML = `
    <div class="content-list">
      ${items.map(item => `
        <article class="content-card">
          <h3><a href="${item.url}">${item.title}</a></h3>
          <p>${item.teaser}</p>
        </article>
      `).join('')}
    </div>
  `;
}
