export default function decorate(block) {
  /* ================================
     1️⃣ Read authored content
     ================================ */
  const original = [...block.children];

  const sectionTitle = original[0];
  const sectionDesc = original[1];
  const items = original.slice(2); // key-highlight-item blocks

  block.classList.add("key-highlights");

  /* ================================
     2️⃣ Runtime wrapper
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "key-highlights-wrapper";
  block.append(runtime);

  /* ================================
     3️⃣ Runtime skeleton
     ================================ */
  runtime.innerHTML = `
    <div class="key-highlights-header"></div>
    <div class="key-highlights-grid"></div>
  `;

  const header = runtime.querySelector(".key-highlights-header");
  const grid = runtime.querySelector(".key-highlights-grid");

  /* ================================
     4️⃣ Header content
     ================================ */
  if (sectionTitle) {
    header.append(sectionTitle);
    sectionTitle.style.display = "none";
  }

  if (sectionDesc) {
    header.append(sectionDesc);
    sectionDesc.style.display = "none";
  }

  /* ================================
     5️⃣ Loop key-highlight-item blocks
     ================================ */
  items.forEach((item) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const card = document.createElement("div");
    card.className = "key-highlight-card";

    // Image
    if (fields[0]) {
      const media = document.createElement("div");
      media.className = "key-highlight-media";
      media.append(fields[0]);
      card.append(media);
    }

    // Title
    if (fields[1]) {
      const title = document.createElement("h3");
      title.innerHTML = fields[1].innerHTML;
      card.append(title);
    }

    // Description
    if (fields[2]) {
      const desc = document.createElement("p");
      desc.className = "key-highlight-desc";
      desc.innerHTML = fields[2].innerHTML;
      card.append(desc);
    }

    // Preserve key-highlight-item wrapper (dropdown safe)
    item.innerHTML = "";
    item.append(card);

    grid.append(item);
  });
}
