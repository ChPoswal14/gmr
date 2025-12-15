export default async function decorate(block) {
  // Create container for results
  const wrapper = document.createElement('div');
  wrapper.classList.add('news-results');
  block.appendChild(wrapper);

  try {
    // Call YOUR serverless backend via EDS proxy
    const res = await fetch('/tools/hello');

    if (!res.ok) {
      wrapper.innerHTML = `<p>Error loading news: ${res.status}</p>`;
      return;
    }

    const json = await res.json();

    console.log("CF Data from serverless:", json);

    // Your AEM CF GraphQL response will be inside:
    const items = json?.data?.data?.newsListApi || [];

    if (items.length === 0) {
      wrapper.innerHTML = `<p>No news found.</p>`;
      return;
    }

    // Render news items
    items.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('news-card');

      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.summary || ''}</p>
      `;

      wrapper.appendChild(card);
    });
  } catch (error) {
    wrapper.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
