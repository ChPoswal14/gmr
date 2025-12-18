export default function decorate(block) {
  /* ================================
     1️⃣ Read authored content (SAFE)
     ================================ */
  const [titleEl, contentEl] = [...block.children];

  const titleText = titleEl?.textContent?.trim() || "";
  const contentHTML = contentEl?.innerHTML || "";

  block.classList.add("global-leaders-aviation");

  /* ================================
     2️⃣ Split first two words
     ================================ */
  const words = titleText.split(/\s+/);
  const highlighted =
    words.length >= 2
      ? `<span class="gla-highlight">${words.slice(0, 2).join(" ")}</span> ${words.slice(2).join(" ")}`
      : `<span class="gla-highlight">${titleText}</span>`;

  /* ================================
     3️⃣ Runtime wrapper (DO NOT clear block)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "gla-wrapper container";
  block.append(runtime);

  /* ================================
     4️⃣ Runtime layout
     ================================ */
  runtime.innerHTML = `
    <div class="gla-left">
      <h2>${highlighted}</h2>
    </div>
    <div class="gla-right">
      ${contentHTML}
    </div>
  `;

  /* ================================
     5️⃣ Hide original authored nodes
     ================================ */
  titleEl.style.display = "none";
  contentEl.style.display = "none";
}
