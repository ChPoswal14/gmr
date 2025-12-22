export default function decorate(block) {
  const items = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'aviation-tabs container';

  const ul = document.createElement('ul');
  ul.className = 'aviation-tabs-list';

  items.forEach((item) => {
    const [nameEl, linkEl, activeEl] = item.children;

    const label = nameEl?.textContent.trim();
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

  wrapper.appendChild(ul);

  // 🔥 Remove ALL UE authoring markup
  block.innerHTML = '';
  block.appendChild(wrapper);
}
