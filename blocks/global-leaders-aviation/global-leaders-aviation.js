export default function decorate(block) {
  // Preserve AEM editable fields
  const original = [...block.children];

  const sectionTitle = original[0];
  const content = original[1];

  block.classList.add('global-leaders-aviation');

  // Layout wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'gla-wrapper';

  // Left column (title)
  const left = document.createElement('div');
  left.className = 'gla-left';
  left.append(sectionTitle);

  // Right column (content)
  const right = document.createElement('div');
  right.className = 'gla-right';
  right.append(content);

  wrapper.append(left, right);

  // Replace block content safely
  block.innerHTML = '';
  block.append(wrapper);
}
