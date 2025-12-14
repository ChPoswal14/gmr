export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
     =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // 0 = title, 1 = description
  if (children[0]) entryContainer.appendChild(children[0]);
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  // 2 = CTA text, 3 = CTA link
  if (children[3]) {
    const ctaLink = children[3].querySelector('a');
    if (ctaLink) {
      ctaLink.classList.add('btn', 'btn-orange');
      header.appendChild(ctaLink);
    }
  }

  /* ===============================
     COMPANIES SECTION
     =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  // Start after header fields
  let i = 4;

  while (i < children.length) {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    // Name
    if (children[i]) companiesGrid.appendChild(children[i++]);

    // Description
    if (children[i]) companiesGrid.appendChild(children[i++]);

    // Stock
    let stockNode = null;
    if (children[i]) {
      stockNode = document.createElement('div');
      stockNode.className = 'companiesStock';
      stockNode.appendChild(children[i++]);
    }

    // Visit Website (text + link)
    const linksWrap = document.createElement('div');
    linksWrap.className = 'companies-links mt-5 mb-4';

    if (children[i]) i++; // text label
    if (children[i]) {
      const link = children[i++].querySelector('a');
      if (link) {
        link.classList.add('btn', 'btn-link');
        linksWrap.appendChild(link);
      }
    }

    // Explore Highlights (text + link)
    if (children[i]) i++; // text label
    if (children[i]) {
      const link = children[i++].querySelector('a');
      if (link) {
        link.classList.add('btn', 'btn-link');
        linksWrap.appendChild(link);
      }
    }

    companiesGrid.appendChild(linksWrap);
    col.appendChild(companiesGrid);

    if (stockNode) col.appendChild(stockNode);

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL ASSEMBLY
     =============================== */

  block.innerHTML = '';
  block.append(header, companiesCol);
}
