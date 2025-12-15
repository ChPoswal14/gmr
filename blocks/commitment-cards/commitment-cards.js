export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) return;

  // -------- Section setup (decorate block, don't replace it) --------
  block.classList.add("sec-commitment", "spacer");

  const container = document.createElement("div");
  container.className = "container";

  // -------- Section Title --------
  const titleRow = rows.shift();
  const sectionTitle = titleRow?.textContent?.trim();

  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title text-center fw-normal mb-5";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  // -------- Cards Row --------
  const row = document.createElement("div");
  row.className = "row";

  rows.forEach((cardRow) => {
    const cols = [...cardRow.children];
    if (cols.length < 5) return;

    const imageCol = cols[0];
    const titleCol = cols[1];
    const descCol = cols[2];
    const btnTextCol = cols[3];
    const btnLinkCol = cols[4];

    const col = document.createElement("div");
    col.className = "col-md-6";

    const card = document.createElement("div");
    card.className = "comm-card";

    // -------- Image --------
    const imgWrap = document.createElement("div");
    imgWrap.className = "comm-card-img";
    if (imageCol.firstElementChild) {
      imgWrap.append(imageCol.firstElementChild); // move node
    }

    // -------- Body --------
    const body = document.createElement("div");
    body.className = "comm-card-body";

    const h3 = document.createElement("h3");
    h3.append(...titleCol.childNodes); // preserve UE binding

    const p = document.createElement("p");
    p.append(...descCol.childNodes); // preserve richtext binding

    body.append(h3, p);

    const link = btnLinkCol.querySelector("a");
    if (link) {
      link.classList.add("btn", "btn-primary");
      link.textContent = btnTextCol.textContent.trim();
      body.append(link);
    }

    card.append(imgWrap, body);
    col.append(card);
    row.append(col);

    // Clean original row
    cardRow.remove();
  });

  // -------- Final DOM --------
  container.append(row);
  block.innerHTML = "";
  block.append(container);
}
