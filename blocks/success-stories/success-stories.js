import { getApiHost } from '../../scripts/api.js';

export default async function decorate(block) {

  /* 1️⃣ Read section category from Universal Editor
     (index MUST match model order) */
  const sectionCategoryEl = block.children[4];
  const sectionCategory =
    sectionCategoryEl?.textContent?.trim().toLowerCase() || '';

  /* 2️⃣ Clear author HTML */
  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'success-stories-cards';
  block.appendChild(wrapper);

  try {
    /* 3️⃣ Call serverless API with category */
    const apiUrl =
      `${getApiHost()}/api/v1/web/gmr/success-story?category=${sectionCategory}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    const items =
      json?.data?.data?.successStoryList?.items || [];

    if (!items.length) {
      wrapper.innerHTML = '<p>No success stories found.</p>';
      return;
    }

    /* 4️⃣ Render cards */
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'story-card';

      card.innerHTML = `
        <div class="story-image">
          <img src="${item.storyImage?._publishUrl}" alt="${item.title}">
        </div>
        <div class="story-content">
          <h3>${item.title}</h3>
          <div class="description">
            ${item.description?.plaintext || ''}
          </div>
          <a class="read-more" href="${item.ctaLink || '#'}">
            ${item.ctaText?.plaintext || ''} →
          </a>
        </div>
      `;

      wrapper.appendChild(card);
    });

  } catch (err) {
    wrapper.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}
