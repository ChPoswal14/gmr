export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
     =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Title → h2
  const titleP = children[0]?.querySelector('p');
  if (titleP) {
    const h2 = document.createElement('h2');
    h2.innerHTML = titleP.innerHTML;
    entryContainer.appendChild(h2);
  }

  // Description
  const descP = children[1]?.querySelector('p');
  if (descP) {
    const p = document.createElement('p');
    p.innerHTML = descP.innerHTML;
    entryContainer.appendChild(p);
  }

  header.appendChild(entryContainer);

  // CTA button (label + link)
  const ctaText = children[2]?.querySelector('p')?.textContent;
  const ctaLink = children[3]?.querySelector('a');

  if (ctaLink) {
    ctaLink.textContent = ctaText || ctaLink.textContent;
    ctaLink.classList.add('btn', 'btn-orange');
    header.appendChild(ctaLink);
  }

  /* ===============================
     COMPANIES
     =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  // Each company is ONE child starting from index 4
  for (let i = 4; i < children.length; i++) {
    const company = children[i];
    const fields = [...company.children];

    if (fields.length < 7) continue;

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    /* ---- Name → h3 ---- */
    const name = fields[0].querySelector('p');
    if (name) {
      const h3 = document.createElement('h3');
      h3.innerHTML = name.innerHTML;
      companiesGrid.appendChild(h3);
    }

    /* ---- Description ---- */
    const desc = fields[1].querySelector('p');
    if (desc) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      companiesGrid.appendChild(p);
    }

    /* ---- Links ---- */
    const linksWrap = document.createElement('div');
    linksWrap.className = 'companies-links mt-5 mb-4';

    const visitLink = fields[4].querySelector('a');
    if (visitLink) {
      visitLink.classList.add('btn', 'btn-link');
      linksWrap.appendChild(visitLink);
    }

    const exploreLink = fields[6].querySelector('a');
    if (exploreLink) {
      exploreLink.classList.add('btn', 'btn-link');
      linksWrap.appendChild(exploreLink);
    }

    companiesGrid.appendChild(linksWrap);

    /* ---- Stock ---- */
    const stockP = fields[2].querySelector('p');
    if (stockP) {
      const stock = document.createElement('div');
      stock.className = 'companiesStock';
      stock.textContent = stockP.textContent;
      col.appendChild(companiesGrid);
      col.appendChild(stock);
    } else {
      col.appendChild(companiesGrid);
    }

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
     =============================== */

  block.innerHTML = '';
  block.append(header, companiesCol);
}
