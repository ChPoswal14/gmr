export default function decorate(block) {
  const container = document.createElement("div");
  container.className = "container";

  // move existing block content into container
  while (block.firstChild) {
    container.appendChild(block.firstChild);
  }

  block.appendChild(container);
}
