export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
  =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Title + description (wrap first child in <h2>)
  if (children[0]) {
    const h2 = document.createElement('h2');
    while (children[0].childNodes.length > 0) {
      h2.appendChild(children[0].childNodes[0]);
    }
    entryContainer.appendChild(h2);
  }

  // Append second child (description) as-is
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  // CTA button (children[3] = label, children[4] = anchor)
  if (children[3] && children[4]) {
    const btnAnchor = children[4];
    // Move label (children[3]) inside anchor
    while (children[3].childNodes.length > 0) {
      btnAnchor.appendChild(children[3].childNodes[0]);
    }
    btnAnchor.classList.add('btn', 'btn-orange');
    header.appendChild(btnAnchor);
  }

  /* ===============================
     COMPANIES
  =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  // Each company is ONE authored group
  for (let i = 5; i < children.length; i++) { // start from 5 now
    const companyItem = children[i];

    // SAFETY: only wrap real company items
    if (!companyItem || companyItem.children.length < 3) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    // IMPORTANT: keep full AEM structure
    companiesGrid.appendChild(companyItem);

    col.appendChild(companiesGrid);
    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL (DO NOT DESTROY AEM)
  =============================== */

  block.replaceChildren(header, companiesCol);
}
