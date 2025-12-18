export default function decorate(block) {
  /* ================================
     1️⃣ Read authored content (SAFE)
     ================================ */
  const [titleEl, contentEl] = [...block.children];

  const titleText = titleEl?.textContent?.trim() || "";
  const contentHTML = contentEl?.innerHTML || "";

  block.classList.add("global-leaders-aviation");

  /* ================================
     2️⃣ Runtime wrapper (DO NOT clear block)
     ================================ */
  const runtime = document.createElement("div");
  runtime.className = "gla-wrapper";

  block.append(runtime);

  /* ================================
     3️⃣ Runtime layout using innerHTML
     ================================ */
  runtime.innerHTML = `
    <div class="gla-left">
      <h2>${titleText}</h2>
    </div>
    <div class="gla-right">
      ${contentHTML}
    </div>
  `;

  /* ================================
     4️⃣ Hide original authored nodes
     ================================ */
  titleEl.style.display = "none";
  contentEl.style.display = "none";
}
