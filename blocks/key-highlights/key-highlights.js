export default function decorate(block) {
  // Identify the block for Universal Editor
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-model', 'key-highlights');
  block.setAttribute('data-aue-label', 'Key Highlights');

  const rows = [...block.children];

  // Process Main Heading and Intro (Rows 0 and 1)
  if (rows[0]) {
    const heading = rows[0].querySelector('div');
    heading.classList.add('highlights-main-heading');
    heading.setAttribute('data-aue-prop', 'mainHeading');
    heading.setAttribute('data-aue-type', 'text');
  }

  if (rows[1]) {
    const intro = rows[1].querySelector('div');
    intro.classList.add('highlights-intro-text');
    intro.setAttribute('data-aue-prop', 'introText');
    intro.setAttribute('data-aue-type', 'richtext');
  }

  // Process Cards (Rows 2 through 6)
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'highlights-cards-container';

  rows.slice(2, 7).forEach((row, i) => {
    const cardIndex = i + 1;
    row.className = 'highlight-card';

    const [imgCell, titleCell, descCell] = row.children;

    if (imgCell) {
      imgCell.className = 'highlight-card-image';
      imgCell.setAttribute('data-aue-prop', `card${cardIndex}Image`);
      imgCell.setAttribute('data-aue-type', 'media');
    }

    if (titleCell) {
      titleCell.className = 'highlight-card-title';
      titleCell.setAttribute('data-aue-prop', `card${cardIndex}Title`);
      titleCell.setAttribute('data-aue-type', 'text');
    }

    if (descCell) {
      descCell.className = 'highlight-card-description';
      descCell.setAttribute('data-aue-prop', `card${cardIndex}Desc`);
      descCell.setAttribute('data-aue-type', 'text');
    }

    cardsContainer.append(row);
  });

  block.append(cardsContainer);
}