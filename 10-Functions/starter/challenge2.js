let reverse = false;

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  header.addEventListener('click', () => {
    reverse && (header.style.color = 'blue');
    !reverse && (header.style.color = 'red');
    reverse = !reverse;
  });
})();