export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  block.classList.add("sec-commitment", "spacer");

  const container = document.createElement("div");
  container.className = "container";

  /* ---------------- Section Title ---------------- */
  const titleRow = rows.shift();
  const sectionTitle = titleRow?.textContent?.trim();

  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "title text-center fw-normal mb-5";
    h2.textContent = sectionTitle;
    container.appendChild(h2);
  }

  /* ---------------- Cards Wrapper ---------------- */
  const row = document.createElement("div");
  row.className = "row commitment-cards-wrapper";

  rows.forEach((cardRow, index) => {
    cardRow.style.display = "none"; // keep UE binding but hide

    const cols = [...cardRow.children];
    if (cols.length < 5) return;

    const col = document.createElement("div");
    col.className = "col-md-6 commitment-card-item";
    col.draggable = true;
    col.dataset.index = index;

    /* ---------- Build Card UI ---------- */
    const card = document.createElement("div");
    card.className = "comm-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "comm-card-img";
    if (cols[0].firstElementChild) {
      imgWrap.append(cols[0].firstElementChild);
    }

    const body = document.createElement("div");
    body.className = "comm-card-body";

    const h3 = document.createElement("h3");
    h3.append(...cols[1].childNodes);

    const p = document.createElement("p");
    p.append(...cols[2].childNodes);

    body.append(h3, p);

    const link = cols[4].querySelector("a");
    if (link) {
      link.classList.add("btn", "btn-primary");
      link.textContent = cols[3].textContent.trim();
      body.append(link);
    }

    card.append(imgWrap, body);
    col.append(card);
    row.append(col);

    /* ---------- Drag Events ---------- */
    col.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", col.dataset.index);
      col.classList.add("dragging");
    });

    col.addEventListener("dragend", () => {
      col.classList.remove("dragging");
    });

    col.addEventListener("dragover", (e) => e.preventDefault());

    col.addEventListener("drop", (e) => {
      e.preventDefault();

      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      const toIndex = Number(col.dataset.index);

      if (fromIndex === toIndex) return;

      const draggedRow = rows[fromIndex];
      const targetRow = rows[toIndex];

      block.insertBefore(
        draggedRow,
        fromIndex < toIndex ? targetRow.nextSibling : targetRow
      );

      // Force UE refresh
      window.requestAnimationFrame(() => decorate(block));
    });
  });

  container.append(row);

  block.innerHTML = "";
  block.append(container);
}
