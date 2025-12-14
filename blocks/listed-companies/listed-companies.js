export default function decorate(block) {
  const children = [...block.children];

  /* ===============================
     Header structure
     =============================== */

  const header = document.createElement('div');
  header.className = 'd-md-flex align-items-center gap-3';

  const entryContainer = document.createElement('div');
  entryContainer.className = 'entry-container';

  /* ===============================
     Companies structure
     =============================== */

  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  children.forEach((child) => {
    /* -------------------------------
       Listed Company Item
       ------------------------------- */
    if (child.classList.contains('listed-company-item')) {
      const col = document.createElement('div');
      col.className = 'col-md-6 mb-4';

      const companiesGrid = document.createElement('div');
      companiesGrid.className = 'companiesGrid';

      const itemChildren = [...child.children];

      // Company Name
      if (itemChildren[0]) companiesGrid.appendChild(itemChildren[0]);

      // Company Description
      if (itemChildren[1]) companiesGrid.appendChild(itemChildren[1]);

      // Links wrapper
      const linksWrap = document.createElement('div');
      linksWrap.className = 'companies-links mt-5 mb-4';

      // Visit Website
      if (itemChildren[3]) linksWrap.appendChild(itemChildren[3]);

      // Explore Highlights
      if (itemChildren[5]) linksWrap.appendChild(itemChildren[5]);

      companiesGrid.appendChild(linksWrap);
      col.appendChild(companiesGrid);

      // Stock Symbol (outside grid)
      if (itemChildren[2]) {
        const stock = document.createElement('div');
        stock.className = 'companiesStock';
        stock.appendChild(itemChildren[2]);
        col.appendChild(stock);
      }

      col.appendChild(child); // keeps item editable
      row.appendChild(col);
    }

    /* -------------------------------
       Header fields
       ------------------------------- */
    else {
      entryContainer.appendChild(child);
    }
  });

  header.appendChild(entryContainer);
  companiesCol.appendChild(row);

  /* ===============================
     Rebuild block (safe)
     =============================== */
  block.innerHTML = '';
  block.append(header, companiesCol);
}
