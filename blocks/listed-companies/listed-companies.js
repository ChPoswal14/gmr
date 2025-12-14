export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER (keep original nodes)
     =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Move original AEM nodes (DO NOT unwrap)
  entryContainer.append(children[0], children[1]);
  header.appendChild(entryContainer);

  // CTA button (keep original AEM anchor)
  if (children[3]) {
    const btn = children[3].querySelector('a');
    if (btn) {
      btn.classList.add('btn', 'btn-orange');
      header.appendChild(btn);
    }
  }

  /* ===============================
     COMPANIES
     =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  // Each company is ONE AEM-authored node
  for (let i = 4; i < children.length; i++) {
    const company = children[i];

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    const fields = [...company.children];

    // Name + description (keep original)
    companiesGrid.append(fields[0], fields[1]);

    // Links wrapper
    const linksWrap = document.createElement('div');
    linksWrap.className = 'companies-links mt-5 mb-4';

    const visitLink = fields[4]?.querySelector('a');
    if (visitLink) {
      visitLink.classList.add('btn', 'btn-link');
      linksWrap.appendChild(visitLink);
    }

    const exploreLink = fields[6]?.querySelector('a');
    if (exploreLink) {
      exploreLink.classList.add('btn', 'btn-link');
      linksWrap.appendChild(exploreLink);
    }

    companiesGrid.appendChild(linksWrap);

    // Stock (outside grid)
    if (fields[2]) {
      const stock = document.createElement('div');
      stock.className = 'companiesStock';
      stock.appendChild(fields[2]);
      col.append(companiesGrid, stock);
    } else {
      col.appendChild(companiesGrid);
    }

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL (AEM SAFE)
     =============================== */

  // Do NOT clear innerHTML
  block.replaceChildren(header, companiesCol);
}
