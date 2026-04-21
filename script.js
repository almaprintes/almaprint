(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mainNav) mainNav.classList.remove('is-open');
    });
  });
})();
