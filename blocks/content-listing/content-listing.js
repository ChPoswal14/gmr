export default function decorate(block) {
  const configRow = block.firstElementChild;
  const limit = configRow?.textContent.includes('limit=')
    ? parseInt(configRow.textContent.split('limit=')[1], 10)
    : 999;

  configRow?.remove();

  const links = [...block.querySelectorAll('a')].slice(0, limit);

  block.innerHTML = `
    <ul>
      ${links.map(a => `<li><a href="${a.href}">${a.textContent}</a></li>`).join('')}
    </ul>
  `;
}
