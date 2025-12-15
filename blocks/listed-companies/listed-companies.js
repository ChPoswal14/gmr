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
    h2.textContent = children[0].textContent.trim();
    entryContainer.appendChild(h2);
  }

  // Description
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  // Top CTA (Label + URL)
  if (children[2] && children[3]) {
    const a = document.createElement('a');
    a.className = 'btn btn-orange';
    a.href = children[3].textContent.trim() || '#';
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

  for (let i = 4; i < children.length; i++) {
    const companyItem = children[i];
    if (!companyItem) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    /* -------- Company Name -------- */
    const nameEl = companyItem.children[0];
    if (nameEl) {
      const h3 = document.createElement('h3');
      h3.textContent = nameEl.textContent.trim();
      nameEl.replaceWith(h3);
    }

    /* -------- Company Description -------- */
    // keep as-is (child[1])

    /* -------- Stock -------- */
    const stockEl = companyItem.children[4];
    let stockDiv = null;
    if (stockEl) {
      stockDiv = document.createElement('div');
      stockDiv.className = 'companiesStock';
      stockDiv.textContent = stockEl.textContent.trim();
      stockEl.remove();
    }

    /* -------- Buttons -------- */
    const btnContainer = document.createElement('div');
    btnContainer.className = 'companies-links mt-5 mb-4';

    const buttons = [
      { labelIndex: 2, urlIndex: 3 }, // Visit Website
      { labelIndex: 4, urlIndex: 5 }  // Explore Highlights
    ];

    buttons.forEach(({ labelIndex, urlIndex }) => {
      const labelEl = companyItem.children[labelIndex];
      const urlEl = companyItem.children[urlIndex];

      if (!labelEl || !urlEl) return;

      const a = document.createElement('a');
      a.className = 'btn btn-link';
      a.href = urlEl.textContent.trim() || '#';
      a.textContent = labelEl.textContent.trim();

      btnContainer.appendChild(a);

      // ❌ REMOVE <p> nodes completely
      labelEl.remove();
      urlEl.remove();
    });

    companiesGrid.appendChild(companyItem);
    companiesGrid.appendChild(btnContainer);

    col.appendChild(companiesGrid);
    if (stockDiv) col.appendChild(stockDiv);

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
  =============================== */

  block.replaceChildren(header, companiesCol);
}
