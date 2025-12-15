export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
  =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Section Title
  if (children[0]) {
    const h2 = document.createElement('h2');
    h2.appendChild(children[0]); // keep AEM wrapper
    entryContainer.appendChild(h2);
  }

  // Description
  if (children[1]) {
    const descWrap = document.createElement('div');
    descWrap.appendChild(children[1]);
    entryContainer.appendChild(descWrap);
  }

  header.appendChild(entryContainer);

  // Top CTA
  if (children[2] && children[3]) {
    const a = document.createElement('a');
    a.className = 'btn btn-orange';
    a.href = children[3].textContent.trim() || '#';
    a.title = children[2].textContent.trim();
    a.textContent = children[2].textContent.trim();
    header.appendChild(a);
  }

  /* ===============================
     COMPANIES
  =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  // IMPORTANT: start from index 4, DO NOT check class
  for (let i = 4; i < children.length; i++) {
    const item = children[i];
    if (!item || !item.children.length) continue;

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const grid = document.createElement('div');
    grid.className = 'companiesGrid';

    /* -------- Company Card -------- */

    const card = document.createElement('div');
    card.className = 'listed-company-item';

    // Company Name
    if (item.children[0]) {
      const h3 = document.createElement('h3');
      h3.textContent = item.children[0].textContent.trim();
      card.appendChild(h3);
    }

    // Company Description
    if (item.children[1]) {
      card.appendChild(item.children[1].cloneNode(true));
    }

    grid.appendChild(card);

    /* -------- Buttons -------- */

    const btnWrap = document.createElement('div');
    btnWrap.className = 'companies-links mt-5 mb-4';

    // Visit Website
    if (item.children[2] && item.children[3]) {
      const a = document.createElement('a');
      a.className = 'btn btn-link';
      a.href = item.children[3].textContent.trim() || '#';
      a.title = item.children[2].textContent.trim();
      a.textContent = item.children[2].textContent.trim();
      btnWrap.appendChild(a);
    }

    // Explore Highlights
    if (item.children[4] && item.children[5]) {
      const a = document.createElement('a');
      a.className = 'btn btn-link';
      a.href = item.children[5].textContent.trim() || '#';
      a.title = item.children[4].textContent.trim();
      a.textContent = item.children[4].textContent.trim();
      btnWrap.appendChild(a);
    }

    grid.appendChild(btnWrap);
    col.appendChild(grid);

    /* -------- Stock -------- */

    if (item.children[6]) {
      const stock = document.createElement('div');
      stock.className = 'companiesStock';
      stock.textContent = item.children[6].textContent.trim();
      col.appendChild(stock);
    }

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
  =============================== */

  block.replaceChildren(header, companiesCol);
}
