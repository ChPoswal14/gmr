export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  /* ===============================
     1️⃣ SECTION FIELDS
     =============================== */
  const sectionTitleRow = rows.shift();
  const sectionDescRow = rows.shift();

  const sectionTitle = sectionTitleRow?.textContent?.trim() || "";
  const sectionDesc = sectionDescRow?.innerHTML || "";

  /* ===============================
     2️⃣ WRAPPERS
     =============================== */
  const section = document.createElement("section");
  section.className = "gmr-buisness-expertise-section spacer";

  const container = document.createElement("div");
  container.className = "container";

  /* ===============================
     3️⃣ HEADER
     =============================== */
  const header = document.createElement("div");
  header.className = "text-center mb-5";

  if (sectionTitle) {
    const h2 = document.createElement("h2");
    h2.className = "sec-title";
    h2.textContent = sectionTitle;
    header.append(h2);
  }

  if (sectionDesc) {
    const desc = document.createElement("div");
    desc.className = "sec-desc";
    desc.innerHTML = sectionDesc;
    header.append(desc);
  }

  /* ===============================
     4️⃣ GRID
     =============================== */
  const row = document.createElement("div");
  row.className = "row g-4 justify-content-center";

  /* ===============================
     5️⃣ CARDS LOOP (UE SAFE)
     =============================== */
  rows.forEach((itemRow) => {
    const cells = [...itemRow.children];

    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const ctaTextCell = cells[3];
    const ctaLinkCell = cells[4];

    const picture = imageCell?.querySelector("picture");
    const title = titleCell?.textContent?.trim() || "";
    const description = descCell?.innerHTML || "";
    const ctaText = ctaTextCell?.textContent?.trim() || "";
    const ctaLink = ctaLinkCell?.querySelector("a")?.getAttribute("href") || "";

    /* Column */
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";

    /* Card */
    const card = document.createElement("div");
    card.className = "expertise-card h-100";

    /* Image */
    if (picture) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "expertise-card-img";
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    /* Body */
    const body = document.createElement("div");
    body.className = "expertise-card-body";

    if (title) {
      const h3 = document.createElement("h3");
      h3.className = "card-title";
      h3.textContent = title;
      body.append(h3);
    }

    if (description) {
      const p = document.createElement("div");
      p.className = "card-desc";
      p.innerHTML = description;
      body.append(p);
    }

    if (ctaText && ctaLink) {
      const cta = document.createElement("a");
      cta.className = "card-cta";
      cta.href = ctaLink;
      cta.innerHTML = `${ctaText} <span>›</span>`;
      body.append(cta);
    }

    card.append(body);
    col.append(card);
    row.append(col);
  });

  /* ===============================
     6️⃣ ASSEMBLE
     =============================== */
  container.append(header, row);
  section.append(container);

  block.innerHTML = "";
  block.append(section);
}
