export default async function decorate(block) {
  // ---------- HTML ----------
  block.innerHTML = `
    <div class="search-box" role="combobox" aria-expanded="false">
      <input
        type="text"
        placeholder="Search..."
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant=""
      />
      <div
        class="search-results"
        id="search-results"
        role="listbox"
      ></div>
    </div>
  `;

  const input = block.querySelector('input');
  const resultsEl = block.querySelector('.search-results');

  // ---------- State ----------
  let indexData = [];
  let results = [];
  let activeIndex = -1;
  let debounceTimer;

  // ---------- Load Index ----------
  async function loadIndex() {
    try {
      const resp = await fetch('/search-index.json');
      const json = await resp.json();
      indexData = json.data || [];
    } catch (e) {
      console.error('Search index load failed', e);
    }
  }

  await loadIndex();

  // ---------- Helpers ----------
  function clearResults() {
    resultsEl.innerHTML = '';
    results = [];
    activeIndex = -1;
    input.setAttribute('aria-activedescendant', '');
    block.querySelector('.search-box')
      .setAttribute('aria-expanded', 'false');
  }

  function updateActiveResult() {
    results.forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
    });

    if (results[activeIndex]) {
      input.setAttribute(
        'aria-activedescendant',
        results[activeIndex].id
      );
      results[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function renderResults(matches, query) {
    resultsEl.innerHTML = '';

    matches.slice(0, 10).forEach((item, i) => {
      const a = document.createElement('a');
      a.href = item.path;
      a.id = `search-option-${i}`;
      a.role = 'option';

      const title = (item.title || '').replace(
        new RegExp(`(${query})`, 'ig'),
        '<mark>$1</mark>'
      );

      a.innerHTML = `
        <div class="search-result">
          <strong>${title}</strong>
          <p>${item.description || ''}</p>
        </div>
      `;

      resultsEl.appendChild(a);
    });

    results = Array.from(resultsEl.querySelectorAll('a'));
    activeIndex = -1;

    block.querySelector('.search-box')
      .setAttribute('aria-expanded', 'true');
  }

  // ---------- Search Logic ----------
  function runSearch() {
    const q = input.value.trim().toLowerCase();
    clearResults();

    if (q.length < 2) return;

    const matches = indexData.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );

    if (matches.length) {
      renderResults(matches, q);
    }
  }

  // ---------- Events ----------
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 250);
  });

  input.addEventListener('keydown', (e) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex =
          activeIndex < results.length - 1 ? activeIndex + 1 : 0;
        updateActiveResult();
        break;

      case 'ArrowUp':
        e.preventDefault();
        activeIndex =
          activeIndex > 0 ? activeIndex - 1 : results.length - 1;
        updateActiveResult();
        break;

      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          results[activeIndex].click();
        }
        break;

      case 'Escape':
        clearResults();
        input.blur();
        break;
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      clearResults();
    }
  });
}
