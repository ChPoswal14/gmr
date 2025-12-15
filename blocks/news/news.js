export default async function decorate(block) {
  block.innerHTML = '<p>Loading news...</p>';

  try {
    const response = await fetch('/api/news');
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      block.innerHTML = '<p>No news available</p>';
      return;
    }

    const container = document.createElement('div');
    container.className = 'news-container';

    data.items.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'news-card';

      article.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="news-content">
          <h3>${item.title}</h3>
          <p>${item.description || ''}</p>
          <span>${item.publishDate || ''}</span>
        </div>
      `;

      container.appendChild(article);
    });

    block.innerHTML = '';
    block.appendChild(container);
  } catch (e) {
    block.innerHTML = '<p>Error loading news</p>';
  }
}
