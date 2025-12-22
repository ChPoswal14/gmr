let cachedIndex = null;

async function loadIndex() {
  if (cachedIndex) return cachedIndex;

  const res = await fetch('/query-index.json');
  const json = await res.json();
  cachedIndex = json.data || [];
  return cachedIndex;
}

function filterResults(data, term) {
  const q = term.toLowerCase();
  return data.filter((item) =>
    item.title?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q) ||
    item.industry?.toLowerCase().includes(q)
  );
}

function renderResults(results, container) {
  container.innerHTML = '';

  if (!results.length) {
    container.innerHTML = '<p>No results found</p>';
    return;
  }

  results.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'search-result';
    el.innerHTML = `
      <a href="${item.path}">
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        <small>${item.category || ''}</small>
      </a>
    `;
    container.appendChild(el);
  });
}

export default async function decorate(block) {
  const input = block.querySelector('.search-input');
  const resultsContainer = block.querySelector('.search-results');
  const index = await loadIndex();

  let timeout;
  input.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const term = e.target.value.trim();
      if (term.length < 2) {
        resultsContainer.innerHTML = '';
        return;
      }
      const results = filterResults(index, term);
      renderResults(results, resultsContainer);
    }, 300);
  });
}
