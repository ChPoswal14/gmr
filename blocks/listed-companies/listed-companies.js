export default function decorate(block) {
  // children are in authored order:
  // 0: Section Title
  // 1: Description
  // 2: Top Button (optional)
  // 3+: listed-company-item(s)

  const children = [...block.children];

  // ---- Header (top content) ----
  const header = document.createElement('header');
  header.className = 'listed-companies__header';

  // Move first 3 fields into header (if present)
  children.slice(0, 3).forEach((el) => {
    header.appendChild(el);
  });

  // ---- Companies wrapper ----
  const companiesWrap = document.createElement('div');
  companiesWrap.className = 'listed-companies__items';

  // Each listed-company-item stays untouched, only add a class
  children.slice(3).forEach((item) => {
    if (item.classList.contains('listed-company-item')) {
      item.classList.add('listed-companies__item');
      companiesWrap.appendChild(item);
    }
  });

  // ---- Rebuild block without breaking AEM structure ----
  block.innerHTML = '';
  block.append(header, companiesWrap);
}
