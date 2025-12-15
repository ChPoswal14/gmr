export default function decorate(block) {
  const rows = [...block.children];
  
  const outerContainer = document.createElement("div");
  outerContainer.className = "career-section";
  
  const container = document.createElement("div");
  container.className = "container";
  
  // ---- Header ----
  const headerRow = rows.shift();
  if (headerRow) {
    headerRow.classList.add("section-title", "h2", "mb-5", "fw-normal", "text-center");
    
    // Convert p to h2 for better semantics
    const p = headerRow.querySelector("p");
    if (p) {
      const h2 = document.createElement("h2");
      h2.innerHTML = p.innerHTML;
      p.replaceWith(h2);
    }
  }
  
  // ---- Main content grid ----
  const grid = document.createElement("div");
  grid.className = "row align-items-stretch";
  
  // Process each row (each row represents one column in the final layout)
  rows.forEach((row, index) => {
    const cells = [...row.children];
    
    // Column 1: Two images
    if (index === 0) {
      const col = document.createElement("div");
      col.className = "col-md-4";
      
      // Image 1 (top)
      if (cells[0]) {
        const imgWrap1 = document.createElement("div");
        imgWrap1.className = "career-img career-img-top";
        imgWrap1.appendChild(cells[0]);
        
        const img = imgWrap1.querySelector("img");
        if (img) {
          img.setAttribute("data-aue-prop", "imageOffice");
          img.setAttribute("data-aue-label", "Image 1 (Top Left)");
          img.setAttribute("data-aue-type", "media");
        }
        
        col.appendChild(imgWrap1);
      }
      
      // Image 2 (bottom)
      if (cells[1]) {
        const imgWrap2 = document.createElement("div");
        imgWrap2.className = "career-img career-img-bottom";
        imgWrap2.appendChild(cells[1]);
        
        const img = imgWrap2.querySelector("img");
        if (img) {
          img.setAttribute("data-aue-prop", "imageTeamSmall");
          img.setAttribute("data-aue-label", "Image 2 (Bottom Left)");
          img.setAttribute("data-aue-type", "media");
        }
        
        col.appendChild(imgWrap2);
      }
      
      grid.appendChild(col);
    }
    
    // Column 2: Blue card content
    else if (index === 1) {
      const col = document.createElement("div");
      col.className = "col-md-4";
      
      if (cells[0]) {
        const card = document.createElement("div");
        card.className = "career-card";
        
        // Process any heading tags for proper styling
        const h2 = cells[0].querySelector("h2");
        const h3 = cells[0].querySelector("h3");
        if (h2) h2.classList.add("career-card-title");
        if (h3) h3.classList.add("career-card-title");
        
        card.appendChild(cells[0]);
        col.appendChild(card);
      }
      
      grid.appendChild(col);
    }
    
    // Column 3: Large image + CTA
    else if (index === 2) {
      const col = document.createElement("div");
      col.className = "col-md-4 d-flex flex-column";
      
      // Large image
      if (cells[0]) {
        const imgWrap3 = document.createElement("div");
        imgWrap3.className = "career-img career-img-large";
        imgWrap3.appendChild(cells[0]);
        
        const img = imgWrap3.querySelector("img");
        if (img) {
          img.setAttribute("data-aue-prop", "imageTeamLarge");
          img.setAttribute("data-aue-label", "Image 3 (Right Side)");
          img.setAttribute("data-aue-type", "media");
        }
        
        col.appendChild(imgWrap3);
      }
      
      // CTA section - combine text and link cells
      let ctaText = "";
      let ctaHref = "";
      
      // Find CTA text (cell with "Explore Life" or similar)
      const ctaTextCell = cells.find(cell => {
        const p = cell.querySelector("p");
        return p && p.textContent.includes("Explore Life");
      });
      
      if (ctaTextCell) {
        const p = ctaTextCell.querySelector("p");
        if (p) ctaText = p.textContent.trim();
        ctaTextCell.remove();
      }
      
      // Find CTA link (cell with button)
      const ctaLinkCell = cells.find(cell => cell.querySelector("a.button"));
      
      if (ctaLinkCell) {
        const a = ctaLinkCell.querySelector("a");
        if (a) {
          ctaHref = a.getAttribute("href") || "";
          const title = a.getAttribute("title") || "";
          
          // Create CTA wrapper
          const ctaWrap = document.createElement("div");
          ctaWrap.className = "career-cta mt-auto pt-4";
          
          const finalBtn = document.createElement("a");
          finalBtn.className = "btn btn-orange w-100";
          finalBtn.href = ctaHref;
          if (title) finalBtn.title = title;
          finalBtn.textContent = ctaText || a.textContent.trim();
          
          ctaWrap.appendChild(finalBtn);
          col.appendChild(ctaWrap);
        }
        ctaLinkCell.remove();
      }
      
      // Remove any remaining unprocessed cells
      cells.forEach(cell => {
        if (cell.parentNode) cell.remove();
      });
      
      grid.appendChild(col);
    }
  });
  
  // Assemble final structure
  if (headerRow) container.append(headerRow);
  container.append(grid);
  outerContainer.append(container);
  
  // Clear and rebuild block
  //block.innerHTML = "";
  block.append(outerContainer);
}