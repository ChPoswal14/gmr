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
const text = (el) => (el && el.textContent ? el.textContent.trim() : '');

// Extract title text from children[0] <p>
const titleText = (children[0] && children[0].querySelector && children[0].querySelector('p')) 
  ? text(children[0].querySelector('p')) 
  : '';

// Create <h2> for title
if (titleText) {
  const h2 = document.createElement('h2');
  h2.textContent = titleText;
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
