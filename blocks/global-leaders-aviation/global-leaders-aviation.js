export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const titleWrapper = original[0];
  const content = original[1];

  block.classList.add('global-leaders-aviation');

  // ---- Extract text safely ----
  const titleText = titleWrapper?.textContent?.trim() || '';

  // Create clean H2
  const heading = document.createElement('h2');
  heading.textContent = titleText;

  // Layout wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'gla-wrapper';

  // Left column (title)
  const left = document.createElement('div');
  left.className = 'gla-left';
  left.append(heading);

  // Right column (content)
  const right = document.createElement('div');
  right.className = 'gla-right';
  right.append(content);

  wrapper.append(left, right);

  // Replace block content safely
  block.innerHTML = '';
  block.append(wrapper);
}
