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
    h2.appendChild(children[0]); // MOVE node, do not read text
    entryContainer.appendChild(h2);
  }

  // Description
  if (children[1]) {
    entryContainer.appendChild(children[1]);
  }

  header.appendChild(entryContainer);

  /* ===============================
     HEADER CTA (UE SAFE)
     <a href="ctaUrl">ctaText</a>
  =============================== */

  if (children[2] && children[3]) {
    const labelNode = children[2]; // Top Button Label
    const linkNode = children[3];  // Top Button Link

    const labelP = labelNode.querySelector('p');
    const linkP = linkNode.querySelector('p');

    if (labelP && linkP) {
      const a = document.createElement('a');
      a.className = 'btn btn-orange';

      // Preserve UE bindings
      a.setAttribute('data-aue-prop', 'ctaText');
      a.href = linkP.textContent.trim() || '#';
      a.setAttribute('data-aue-prop-url', 'ctaUrl');

      // Move text content into anchor, remove <p>
      a.textContent = labelP.textContent.trim();

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
    if (!companyItem) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    /* ---------- Company Name ---------- */
    const firstChild = companyItem.children[0];
    if (firstChild && firstChild.tagName !== 'H3') {
      const h3 = document.createElement('h3');
      h3.appendChild(firstChild); // MOVE node
      companyItem.insertBefore(h3, companyItem.firstChild);
    }

    /* ---------- Stock Symbol ---------- */
    const stockNode = companyItem.children[2];
    let companiesStock = null;

    if (stockNode) {
      companiesStock = document.createElement('div');
      companiesStock.className = 'companiesStock';
      companiesStock.appendChild(stockNode); // MOVE node
    }

    /* ---------- Buttons ---------- */
    const btnContainer = document.createElement('div');
    btnContainer.className = 'companies-links mt-5 mb-4';

    const buttonPairs = [
      [companyItem.children[2], companyItem.children[3]],
      [companyItem.children[4], companyItem.children[5]],
    ];

    buttonPairs.forEach(([labelEl, hrefEl]) => {
      if (!labelEl || !hrefEl) return;

      const labelP = labelEl.querySelector('p');
      const linkP = hrefEl.querySelector('p');

      if (!labelP || !linkP) return;

      const a = document.createElement('a');
      a.className = 'btn btn-link';
      a.href = linkP.textContent.trim() || '#';

      // Preserve UE bindings
      a.setAttribute('data-aue-prop', 'ctaText');
      a.setAttribute('data-aue-prop-url', 'ctaUrl');

      // Move text content into anchor, remove <p>
      a.textContent = labelP.textContent.trim();

      btnContainer.appendChild(a);
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
