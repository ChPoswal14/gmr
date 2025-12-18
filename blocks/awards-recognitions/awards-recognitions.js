export default function decorate(block) {
  /* ================================
     1️⃣ Read authored content
     ================================ */
  const original = [...block.children];
  const sectionTitle = original[0];
  const items = original.slice(1);

  block.classList.add("awards-recognitions");

  /* ================================
     2️⃣ Runtime wrapper (DO NOT clear block)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "awards-wrapper";
  block.append(runtime);

  /* ================================
     3️⃣ Runtime skeleton
     ================================ */
  runtime.innerHTML = `
    <div class="awards-header"></div>
    <div class="awards-grid"></div>
  `;

  const header = runtime.querySelector(".awards-header");
  const grid = runtime.querySelector(".awards-grid");

  /* ================================
     4️⃣ Inject header content
     ================================ */
  if (sectionTitle) {
    header.append(sectionTitle);
    sectionTitle.style.display = "none";
  }

  /* ================================
     5️⃣ Loop award-item blocks
     ================================ */
  items.forEach((item) => {
    if (!item || !item.children) return;

    const fields = [...item.children]; // image, title, description

    const card = document.createElement("div");
    card.className = "award-card";

    // Image
    if (fields[0]) {
      const media = document.createElement("div");
      media.className = "award-media";
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
      desc.className = "award-desc";
      desc.innerHTML = fields[2].innerHTML;
      card.append(desc);
    }

    // Preserve award-item wrapper (dropdown safe)
    item.innerHTML = "";
    item.append(card);

    grid.append(item);
  });
}
