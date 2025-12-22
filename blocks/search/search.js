export default async function decorate(block) {
  block.innerHTML = `
    <div class="search-box">
      <input type="text" placeholder="Search..." />
      <div class="search-results"></div>
    </div>
  `;

  const input = block.querySelector('input');
  const resultsEl = block.querySelector('.search-results');

  let indexData = [];

  // Load index once
  async function loadIndex() {
    const resp = await fetch('/query-index.json');
    const json = await resp.json();
    indexData = json.data || [];
  }

  await loadIndex();

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    resultsEl.innerHTML = '';

    if (!q || q.length < 2) return;

    const matches = indexData.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.content?.toLowerCase().includes(q)
    );

    matches.slice(0, 10).forEach((item) => {
      const div = document.createElement('div');
      div.className = 'search-result';
      div.innerHTML = `
        <a href="${item.path}">
          <strong>${item.title || ''}</strong>
          <p>${item.description || ''}</p>
        </a>
      `;
      resultsEl.appendChild(div);
    });
  });
}
