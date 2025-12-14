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
  // Move the first child inside h2
  while (children[0].childNodes.length > 0) {
    h2.appendChild(children[0].childNodes[0]);
  }
  entryContainer.appendChild(h2);
}

// Append second child (description) as-is
if (children[1]) entryContainer.appendChild(children[1]);

header.appendChild(entryContainer);

// CTA button (KEEP WHOLE BUTTON CONTAINER)
if (children[2] && children[3]) {
  const btnLabel = children[2].textContent.trim(); // button label
  const btnHref  = children[3].textContent.trim() || '#'; // href from children[3]

  const btnAnchor = document.createElement('a');
  btnAnchor.href = btnHref;
  btnAnchor.title = btnLabel;
  btnAnchor.className = 'btn btn-orange';
  btnAnchor.textContent = btnLabel;

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
  for (let i = 4; i < children.length; i++) {
    const companyItem = children[i];

    // SAFETY: only wrap real company items
    if (!companyItem || companyItem.children.length < 3) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    // Wrap the first child of companyItem in <h3>
    const firstChild = companyItem.children[0];
if (firstChild) {
  const h3 = document.createElement('h3');

  // If firstChild contains a <p>, take its text content only
  const p = firstChild.querySelector('p');
  if (p) {
    h3.textContent = p.textContent.trim();
  } else {
    h3.textContent = firstChild.textContent.trim();
  }

  companyItem.replaceChild(h3, firstChild);
}

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
