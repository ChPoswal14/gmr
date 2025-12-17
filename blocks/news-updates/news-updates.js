import { getApiHost } from '../../scripts/api.js';

export default async function decorate(block) {

  /* ================================
     1️⃣ Read dialog fields (UE)
     ================================ */
  const [
    titleEl,
    descEl,
    ctaTextEl,
    ctaLinkEl,
    categoryEl,
    limitEl,
  ] = [...block.children];

  const sectionTitle = titleEl?.textContent?.trim() || '';
  const sectionDescription = descEl?.innerHTML || '';
  const ctaText = ctaTextEl?.textContent?.trim() || '';
  const ctaLink = ctaLinkEl?.textContent?.trim() || '#';
  const category = categoryEl?.textContent?.trim() || '';
  const limit = limitEl?.textContent?.trim() || '3';

  

  /* ================================
     2️⃣ Clear author HTML
     ================================ */
  block.innerHTML = '';

  /* ================================
     3️⃣ Build section header
     ================================ */
  const wrapper = document.createElement('div');
  wrapper.className = 'news-updates-wrapper';

  wrapper.innerHTML = `
    <div class="news-header">
      <div class="news-header-left">
        <h2>${sectionTitle}</h2>
        <div class="news-desc">${sectionDescription}</div>
      </div>
      ${
        ctaText
          ? `<a class="news-cta" href="${ctaLink}">${ctaText}</a>`
          : ''
      }
    </div>

    <div class="news-cards"></div>
  `;

  block.appendChild(wrapper);

  const cardsWrapper = wrapper.querySelector('.news-cards');

  /* ================================
     4️⃣ Fetch news from serverless
     ================================ */
  try {
    const apiUrl =
      `${getApiHost()}/api/v1/web/gmr/news-update` +
      `?category=${encodeURIComponent(category)}` +
      `&limit=${encodeURIComponent(limit)}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    const items = json?.data?.data?.newsList?.items || [];
    

    if (!items.length) {
      cardsWrapper.innerHTML = '<p>No news found.</p>';
      return;
    }

    /* ================================
       5️⃣ Render news cards
       ================================ */
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'news-card';
        

      
      card.innerHTML = `
        <div class="news-image">
          <img src="${item.cardImage?._publishUrl}" alt="${item.title}">
        </div>

        <div class="news-content">
          <div class="news-meta">
            <span class="news-category ${item.category}">
              ${item.category}
            </span>
          </div>

          <h3>${item.title}</h3>

          <p class="news-desc-text">
            ${item.description?.plaintext || ''}
          </p>

          <a class="read-more" href="${item.ctaLink || '#'}">
            ${item.ctaLabel || 'READ MORE'} →
          </a>
        </div>
      `;

      cardsWrapper.appendChild(card);
    });

  } catch (err) {
    console.error('News Updates error:', err);
    cardsWrapper.innerHTML = '<p>Error loading news.</p>';
  }
}

<<<<<<< HEAD
=======
/* ================================
   Helper
   ================================ */
function formatCategory(cat = '') {
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
>>>>>>> 349c180b83e595cfc329f718755f48314b7543de
