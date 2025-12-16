import { getApiHost } from '../../scripts/api.js';

/* --------------------------------------------------
   DAM URL helper (MUST be at top)
-------------------------------------------------- */
const DAM_HOST = 'https://publish-p168597-e1803019.adobeaemcloud.com';

function getDamUrl(path) {
  if (!path) return '';
  return `${DAM_HOST}${path}`;
}

/* --------------------------------------------------
   Block decorate
-------------------------------------------------- */
export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'success-stories-cards';
  block.appendChild(wrapper);

  try {
    const apiUrl = `${getApiHost()}/api/v1/web/gmr/success-story`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const json = await res.json();
    const items = json?.data?.data?.successStoryList?.items || [];

    if (!items.length) {
      wrapper.innerHTML = '<p>No success stories found.</p>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'story-card';

      const imageUrl = getDamUrl(item.storyImage?._path);
      const title = item.title || '';
      const description = item.description?.html || '';
      const ctaText = item.ctaText?.html || '';
      const ctaLink = item.ctaLink || '#';

      card.innerHTML = `
        <div class="story-image">
          <img src="${imageUrl}" alt="${title}" loading="lazy">
        </div>
        <div class="story-content">
          <h3>${title}</h3>
          <div class="description">${description}</div>
          <a class="read-more" href="${ctaLink}">
            ${stripHtml(ctaText)} →
          </a>
        </div>
      `;

      wrapper.appendChild(card);
    });
  } catch (err) {
    console.error('Success stories error:', err);
    wrapper.innerHTML = `<p>Error loading success stories</p>`;
  }
}

/* --------------------------------------------------
   Utility
-------------------------------------------------- */
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || '';
}
