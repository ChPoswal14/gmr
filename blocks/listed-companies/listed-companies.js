export default function decorate(block) {
  const children = [...block.children];

  /* ---------------- HEADER ---------------- */
  const header = document.createElement('header');
  header.className = 'd-md-flex align-items-center gap-3';

  const headerCol = document.createElement('div');
  headerCol.className = 'entry-container';

  const sectionTitle = children[0];
  const description = children[1];
  const topBtn = children[2];

  if (sectionTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = sectionTitle.textContent.trim();
    headerCol.appendChild(h2);
  }

  if (description?.querySelector('p')) {
    const p = document.createElement('p');
    p.innerHTML = description.querySelector('p').innerHTML;
    headerCol.appendChild(p);
  }

  header.appendChild(headerCol);

  if (topBtn) {
    const btn = document.createElement('a');
    btn.className = 'btn btn-orange';
    btn.href = '#';
    btn.textContent = topBtn.textContent.trim();
    header.appendChild(btn);
  }

  /* ---------------- COMPANY LIST ---------------- */
  const companiesCol = document.createElement('div');
  companiesCol.className = 'companiesCol';

  const row = document.createElement('div');
  row.className = 'row';

  /* ONLY loop listed-company-item blocks */
  const companyItems = children.filter((child, i) => i > 2);

  companyItems.forEach((item) => {
    const fields = [...item.children];
    if (fields.length < 5) return;

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';

    const companiesGrid = document.createElement('div');
    companiesGrid.className = 'companiesGrid';

    /* Company Name */
    const h3 = document.createElement('h3');
    h3.textContent = fields[0].textContent.trim();
    companiesGrid.appendChild(h3);

    /* Company Description */
    if (fields[1]?.querySelector('p')) {
      const p = document.createElement('p');
      p.innerHTML = fields[1].querySelector('p').innerHTML;
      companiesGrid.appendChild(p);
    }

    /* Links */
    const links = document.createElement('div');
    links.className = 'companies-links mt-5 mb-4';

    if (fields[3]?.textContent.trim()) {
      const website = document.createElement('a');
      website.className = 'btn btn-link';
      website.href = '#';
      website.textContent = fields[3].textContent.trim();
      links.appendChild(website);
    }

    if (fields[4]?.textContent.trim()) {
      const highlights = document.createElement('a');
      highlights.className = 'btn btn-link';
      highlights.href = '#';
      highlights.textContent = fields[4].textContent.trim();
      links.appendChild(highlights);
    }

    companiesGrid.appendChild(links);
    col.appendChild(companiesGrid);

    /* Stock ID (outside grid – AEM correct) */
    if (fields[2]?.textContent.trim()) {
      const stock = document.createElement('div');
      stock.className = 'companiesStock';
      stock.textContent = fields[2].textContent.trim();
      col.appendChild(stock);
    }

    row.appendChild(col);
  });

  companiesCol.appendChild(row);

  /* ---------------- FINAL RENDER ---------------- */
  block.replaceChildren(header, companiesCol);
}
