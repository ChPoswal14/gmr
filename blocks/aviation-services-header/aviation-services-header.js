export default function decorate(block) {
  const rows = [...block.children];

  // Remove admin-only fields
  rows.shift(); // headerTitle
  rows.shift(); // dropdownButtonText

  const container = document.createElement('div');
  container.className = 'aviation-tabs container';

  const ul = document.createElement('ul');
  ul.className = 'aviation-tabs-list';

  rows.forEach((row) => {
    const [titleEl, linkEl, activeEl] = row.children;

    const title = titleEl?.textContent.trim();
    const link = linkEl?.textContent.trim();
    const isActive = activeEl?.textContent.trim() === 'true';

    if (!title || !link) return;

    const li = document.createElement('li');
    if (isActive) li.classList.add('active');

    const a = document.createElement('a');
    a.href = link;
    a.textContent = title;

    li.appendChild(a);
    ul.appendChild(li);
  });

  container.appendChild(ul);

  block.innerHTML = '';
  block.appendChild(container);
}
