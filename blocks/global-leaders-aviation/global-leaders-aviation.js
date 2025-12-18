export default function decorate(block) {
  const original = [...block.children];

  const titleWrapper = original[0]; // UE-tracked element
  const content = original[1];

  block.classList.add('global-leaders-aviation');

  /* ===============================
     FIX TITLE FOR UNIVERSAL EDITOR
  =============================== */

  const text = titleWrapper.textContent.trim();

  // Clean inner HTML but KEEP the wrapper div
  titleWrapper.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = text;

  titleWrapper.append(h2);

  /* ===============================
     LAYOUT
  =============================== */

  const wrapper = document.createElement('div');
  wrapper.className = 'gla-wrapper';

  const left = document.createElement('div');
  left.className = 'gla-left';
  left.append(titleWrapper);

  const right = document.createElement('div');
  right.className = 'gla-right';
  right.append(content);

  wrapper.append(left, right);

  block.innerHTML = '';
  block.append(wrapper);
}
