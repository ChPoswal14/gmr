export default function decorate(block) {
  const rows = [...block.children];

  // Remove admin-only rows if present
  rows.shift(); // headerTitle
  rows.shift(); // dropdownButtonText

  const container = document.createElement('div');
  container.className = 'aviation-tabs container';

  const ul = document.createElement('ul');
  ul.className = 'aviation-tabs-list';

  rows.forEach((row) => {
    const [airportNameEl, linkEl, activeEl] = row.children;

    const label = airportNameEl?.textContent.trim();
    const link = linkEl?.textContent.trim();
    const isActive = activeEl?.textContent.trim() === 'true';

    if (!label || !link) return;

    const li = document.createElement('li');
    if (isActive) li.classList.add('active');

    const a = document.createElement('a');
    a.href = link;
    a.textContent = label;

    li.appendChild(a);
    ul.appendChild(li);
  });

  container.appendChild(ul);

  // Clear original UE content
  block.innerHTML = '';
  block.appendChild(container);
}
