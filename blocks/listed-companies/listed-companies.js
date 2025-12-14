export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('header');
  header.className = 'listed-companies__header';

  const companiesWrap = document.createElement('div');
  companiesWrap.className = 'listed-companies__items';

  children.forEach((child) => {
    // listed-company-item (repeatable cards)
    if (child.classList.contains('listed-company-item')) {
      child.classList.add('listed-companies__item');
      companiesWrap.appendChild(child);
    } 
    // all other authored fields go into header
    else {
      header.appendChild(child);
    }
  });

  // rebuild safely
  block.innerHTML = '';
  block.append(header, companiesWrap);
}
