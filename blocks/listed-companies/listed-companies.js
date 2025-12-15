export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     HEADER
  =============================== */

  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  // Title (children[0])
  if (children[0]) {
    const h2 = document.createElement('h2');
    while (children[0].childNodes.length > 0) {
      h2.appendChild(children[0].childNodes[0]);
    }
    entryContainer.appendChild(h2);
  }

  // Description (children[1])
  if (children[1]) entryContainer.appendChild(children[1]);

  header.appendChild(entryContainer);

  /* ===============================
     HEADER CTA – UE SAFE
     <a href="ctaUrl">ctaText</a>
  =============================== */

  if (children[2] && children[3]) {
    const labelNode = children[2]; // ctaText
    const linkNode = children[3];  // ctaUrl

    const labelP = labelNode.querySelector('p');
    const linkP = linkNode.querySelector('p');

    if (labelP && linkP) {
      // UE bindings
      labelP.setAttribute('data-aue-prop', 'ctaText');
      labelP.setAttribute('data-aue-label', 'Top Button Label');

      linkP.setAttribute('data-aue-prop', 'ctaUrl');
      linkP.setAttribute('data-aue-label', 'Top Button Link');

      const a = document.createElement('a');
      a.className = 'btn btn-orange';
      a.href = linkP.textContent.trim() || '#';

      // Move editable label text INTO anchor
      while (labelP.childNodes.length > 0) {
        a.appendChild(labelP.childNodes[0]);
      }

      header.appendChild(a);
    }
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

    // Company name → <h3>
    const firstChild = companyItem.children[0];
    if (firstChild) {
      const h3 = document.createElement('h3');
      const p = firstChild.querySelector('p');
      h3.textContent = p ? p.textContent.trim() : firstChild.textContent.trim();
      companyItem.replaceChild(h3, firstChild);
    }

    // Stock info
    const thirdChild = companyItem.children[2];
    let companiesStock = null;
    if (thirdChild) {
      companiesStock = document.createElement('div');
      companiesStock.className = 'companiesStock';
      companiesStock.textContent = thirdChild.textContent.trim();
      companyItem.removeChild(thirdChild);
    }

    // Buttons
    const btnContainer = document.createElement('div');
    btnContainer.className = 'companies-links mt-5 mb-4';

    const buttonPairs = [
      [companyItem.children[2], companyItem.children[3]],
      [companyItem.children[4], companyItem.children[5]]
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
        labelEl.remove();
        hrefEl.remove();
      }
    });

    companiesGrid.appendChild(companyItem);
    companiesGrid.appendChild(btnContainer);

    col.appendChild(companiesGrid);
    if (companiesStock) col.appendChild(companiesStock);

    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
  =============================== */

  block.replaceChildren(header, companiesCol);
}
