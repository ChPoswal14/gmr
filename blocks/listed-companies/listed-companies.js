export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
     =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Title + description (KEEP AS IS)
  if (children[0]) entryContainer.appendChild(children[0]);
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  // CTA button (KEEP WHOLE BUTTON CONTAINER)
  if (children[3]) {
    const btnWrapper = children[3];
    const btn = btnWrapper.querySelector('a');
    if (btn) btn.classList.add('btn', 'btn-orange');
    header.appendChild(btnWrapper);
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
