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
    h2.appendChild(children[0]); // MOVE node, don’t read text
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

      // UE bindings stay on original nodes
      labelP.setAttribute('data-aue-prop', 'ctaText');
      linkP.setAttribute('data-aue-prop', 'ctaUrl');

      a.href = linkP.textContent.trim() || '#';

      // Move label content into anchor
      while (labelP.firstChild) {
        a.appendChild(labelP.firstChild);
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

  // IMPORTANT: each listed-company-item stays untouched
  for (let i = 4; i < children.length; i++) {
    const companyItem = children[i];
    if (!companyItem) continue;

    companyItem.classList.add('listed-company-item');

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    // Wrap visually only — DO NOT remove children
    companiesGrid.appendChild(companyItem);
    col.appendChild(companiesGrid);
    row.appendChild(col);
  }

  companiesCol.appendChild(row);

  /* ===============================
     FINAL
  =============================== */

  block.replaceChildren(header, companiesCol);
}
