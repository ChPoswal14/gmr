export default function decorate(block) {
  const rows = [...block.children];

  // Instrumentation for Universal Editor
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-model', 'awards-recognition');

  // Process Heading (First row)
  if (rows[0]) {
    const heading = rows[0].querySelector('div');
    heading.classList.add('awards-main-heading');
    heading.setAttribute('data-aue-prop', 'heading');
    heading.setAttribute('data-aue-type', 'text');
  }

  // Process precisely 3 Award Cards
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'awards-cards-container';

  rows.slice(1, 4).forEach((row, i) => {
    const cardIndex = i + 1;
    row.className = 'award-card';

    const [imgCell, titleCell, descCell] = row.children;

    if (imgCell) {
      imgCell.className = 'award-card-image';
      imgCell.setAttribute('data-aue-prop', `award${cardIndex}Image`);
      imgCell.setAttribute('data-aue-type', 'media');
    }

    if (titleCell) {
      titleCell.className = 'award-card-title';
      titleCell.setAttribute('data-aue-prop', `award${cardIndex}Title`);
      titleCell.setAttribute('data-aue-type', 'text');
    }

    if (descCell) {
      descCell.className = 'award-card-description';
      descCell.setAttribute('data-aue-prop', `award${cardIndex}Desc`);
      descCell.setAttribute('data-aue-type', 'richtext');
    }

    cardsContainer.append(row);
  });

  block.append(cardsContainer);
}