import { getApiHost } from '../../scripts/api.js';

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'news-results';
  block.appendChild(wrapper);

  try {
    const apiUrl = `${getApiHost()}/api/v1/web/gmr/hello`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const json = await res.json();
    const items = json?.data?.data?.newsList_2?.items || [];

    if (!items.length) {
      wrapper.innerHTML = '<p>No news found.</p>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description?.plaintext || ''}</p>
      `;
      wrapper.appendChild(card);
    });
  } catch (err) {
    wrapper.innerHTML = `<p>${err.message}</p>`;
  }
}
