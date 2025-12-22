export default function decorate(block) {
  const originalItems = [...block.children];

  // Skip admin-only fields (if present)
  originalItems.shift(); // headerTitle
  originalItems.shift(); // dropdownButtonText

  const container = document.createElement('div');
  container.className = 'aviation-tabs container';

  const ul = document.createElement('ul');
  ul.className = 'aviation-tabs-list';

  originalItems.forEach((item) => {
    const fields = [...item.children];

    const label = fields[0]?.textContent.trim(); // Airport Name
    const link = fields[1]?.textContent.trim();  // URL
    const isActive = fields[2]?.textContent.trim() === 'true';

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

  /**
   * CRITICAL PART:
   * Remove ALL original UE-rendered content
   * This hides:
   *  - aviation-service-item
   *  - Airport Name
   */
  block.innerHTML = '';
  block.appendChild(container);
}
