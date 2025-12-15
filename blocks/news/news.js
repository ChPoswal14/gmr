export default async function decorate(block) {
  block.innerHTML = '<p>Loading news...</p>';


    const response = await fetch('functions/news');
    const data = await response.json();
    console.log(data);

}