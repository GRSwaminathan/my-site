export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('experience-entry');
    const cols = [...row.children];
    if (cols.length >= 2) {
      cols[0].classList.add('experience-header');
      cols[1].classList.add('experience-details');
    }
  });
}
