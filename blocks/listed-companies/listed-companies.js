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
  const pElement = children[0];
  const h2Element = document.createElement('h2');
  
  // Copy the text content
  h2Element.textContent = pElement.textContent || 'Default Section Title';
  
  // Copy all data attributes with fallbacks
  const labelValue = pElement.getAttribute('data-aue-label');
  h2Element.setAttribute('data-aue-prop', pElement.getAttribute('data-aue-prop') || '');
  h2Element.setAttribute('data-aue-label', labelValue !== null ? labelValue : 'Section Title'); // Key fix here
  h2Element.setAttribute('data-aue-type', pElement.getAttribute('data-aue-type') || 'text');
  
  entryContainer.appendChild(h2Element);
}

  // Append second child (description) as-is
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  // CTA button (children[2] = label, children[3] = href)
  if (children[2] && children[3]) {
    const btnLabel = children[2].textContent.trim();
    const btnHref  = children[3].textContent.trim() || '#';

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

  for (let i = 4; i < children.length; i++) {
    const companyItem = children[i];

    if (!companyItem || companyItem.children.length < 3) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    // Wrap the first child in <h3>
    const firstChild = companyItem.children[0];
    if (firstChild) {
      const h3 = document.createElement('h3');
      const p = firstChild.querySelector('p');
      h3.textContent = p ? p.textContent.trim() : firstChild.textContent.trim();
      companyItem.replaceChild(h3, firstChild);
    }

    // Move third child out to companiesStock div
    const thirdChild = companyItem.children[2];
    let companiesStock = null;
    if (thirdChild) {
      companiesStock = document.createElement('div');
      companiesStock.className = 'companiesStock';
      companiesStock.textContent = thirdChild.textContent.trim();
      companyItem.removeChild(thirdChild);
    }

    // Process buttons (child 3+4, 5+6) into single companies-links div
    const btnContainer = document.createElement('div');
    btnContainer.className = 'companies-links mt-5 mb-4';

    const buttonPairs = [
      [companyItem.children[2], companyItem.children[3]], // Visit Website
      [companyItem.children[4], companyItem.children[5]]  // Explore Highlights
    ];

    buttonPairs.forEach(pair => {
      const [labelEl, hrefEl] = pair;
      if (labelEl && hrefEl) {
        const btnAnchor = document.createElement('a');
        btnAnchor.href = hrefEl.textContent.trim() || '#';
        btnAnchor.title = labelEl.textContent.trim();
        btnAnchor.className = 'btn btn-link';
        btnAnchor.textContent = labelEl.textContent.trim();
        btnContainer.appendChild(btnAnchor);

        // Remove original nodes
        labelEl.remove();
        hrefEl.remove();
      }
    });

    // Append companyItem into companiesGrid
    companiesGrid.appendChild(companyItem);
    // Append button container after content
    companiesGrid.appendChild(btnContainer);

    col.appendChild(companiesGrid);

    // Append companiesStock outside of companiesGrid
    if (companiesStock) col.appendChild(companiesStock);

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
  =============================== */

  block.replaceChildren(header, companiesCol);
}
