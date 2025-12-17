export default function decorate(block) {
  // The block structure from AEM Universal Editor:
  // - First div contains Section Title (h2, h3, or p)
  // - Second div contains Section Description (p or div)
  // - Remaining divs are Innovation Card Items (each with 4 cells: image, title, desc, cta)
  
  const children = [...block.children];
  
  // Extract section title (first child)
  const titleDiv = children[0];
  const titleElement = titleDiv.querySelector('h1, h2, h3, h4, h5, h6, p');
  const titleText = titleElement ? titleElement.textContent.trim() : titleDiv.textContent.trim();
  
  // Extract section description (second child)
  const descDiv = children[1];
  const descElement = descDiv.querySelector('p');
  const descHTML = descElement ? descElement.innerHTML : descDiv.innerHTML;
  
  // Get card items (remaining children from index 2 onwards)
  const cardItems = children.slice(2);
  
  // Create section header
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.textContent = titleText;
  
  const sectionDescription = document.createElement('p');
  sectionDescription.className = 'section-description';
  sectionDescription.innerHTML = descHTML;
  
  // Create grid container
  const cardGrid = document.createElement('div');
  cardGrid.className = 'innovation-card-grid';
  
  // Process each card item
  cardItems.forEach((item) => {
    const cells = [...item.children];
    
    // Each card item has 4 cells: [image, title, description, cta]
    if (cells.length < 4) return; // Skip if incomplete
    
    const [imageCell, titleCell, descCell, ctaCell] = cells;
    
    // Create card container
    const card = document.createElement('div');
    card.className = 'innovation-card';
    
    // Add image - preserve picture element
    const picture = imageCell.querySelector('picture');
    const img = imageCell.querySelector('img');
    
    if (picture) {
      card.appendChild(picture.cloneNode(true));
    } else if (img) {
      card.appendChild(img.cloneNode(true));
    }
    
    // Create content overlay
    const content = document.createElement('div');
    content.className = 'innovation-card-content';
    
    // Add card title
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = titleCell.textContent.trim();
    content.appendChild(cardTitle);
    
    // Add card description
    const cardDesc = document.createElement('p');
    cardDesc.textContent = descCell.textContent.trim();
    content.appendChild(cardDesc);
    
    // Add CTA
    const ctaText = ctaCell.textContent.trim();
    if (ctaText) {
      const cta = document.createElement('a');
      cta.className = 'innovation-card-cta';
      cta.href = '#';
      cta.textContent = ctaText;
      content.appendChild(cta);
    }
    
    card.appendChild(content);
    cardGrid.appendChild(card);
  });
  
  // Clear and rebuild block
  block.textContent = '';
  block.appendChild(sectionTitle);
  block.appendChild(sectionDescription);
  block.appendChild(cardGrid);
}