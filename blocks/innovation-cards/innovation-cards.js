export default function decorate(block) {
  const rows = [...block.children];
  
  // First row contains section title and description
  const headerRow = rows.shift();
  const [titleCell, descCell] = headerRow.children;
  
  // Create section header
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.textContent = titleCell.textContent.trim();
  
  const sectionDescription = document.createElement('p');
  sectionDescription.className = 'section-description';
  sectionDescription.innerHTML = descCell.innerHTML;
  
  // Create grid container for cards
  const cardGrid = document.createElement('div');
  cardGrid.className = 'innovation-card-grid';
  
  // Process each card row
  rows.forEach((row) => {
    const [imageCell, titleCell, descCell, ctaCell] = row.children;
    
    // Create card container
    const card = document.createElement('div');
    card.className = 'innovation-card';
    
    // Add image (preserve picture element if exists)
    const picture = imageCell.querySelector('picture');
    if (picture) {
      card.appendChild(picture);
    } else {
      const img = imageCell.querySelector('img');
      if (img) {
        card.appendChild(img);
      }
    }
    
    // Create content overlay
    const content = document.createElement('div');
    content.className = 'innovation-card-content';
    
    // Add title
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = titleCell.textContent.trim();
    content.appendChild(cardTitle);
    
    // Add description
    const cardDesc = document.createElement('p');
    cardDesc.textContent = descCell.textContent.trim();
    content.appendChild(cardDesc);
    
    // Add CTA
    const cta = document.createElement('a');
    cta.className = 'innovation-card-cta';
    cta.href = '#'; // You can extract link from ctaCell if needed
    cta.textContent = ctaCell.textContent.trim();
    content.appendChild(cta);
    
    card.appendChild(content);
    cardGrid.appendChild(card);
  });
  
  // Clear block and rebuild with proper structure
  block.textContent = '';
  block.appendChild(sectionTitle);
  block.appendChild(sectionDescription);
  block.appendChild(cardGrid);
}