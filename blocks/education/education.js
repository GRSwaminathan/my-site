export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('education-entry');
    const cols = [...row.children];
    if (cols.length >= 2) {
      cols[0].classList.add('education-header');
      cols[1].classList.add('education-details');
    }
  });
}
