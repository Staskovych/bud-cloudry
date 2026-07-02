(function () {
 const header = document.querySelector(".header");
 const burger = document.querySelector(".header__burger");
 const nav = document.getElementById("header-nav");

 if (!header || !burger || !nav) return;

 function setMenuOpen(isOpen) {
  header.classList.toggle("header--menu-open", isOpen);
  document.body.classList.toggle("header-menu-open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
 }

 function closeMenu() {
  setMenuOpen(false);
 }

 burger.addEventListener("click", function () {
  const isOpen = header.classList.contains("header--menu-open");
  setMenuOpen(!isOpen);
 });

 nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
 });

 document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeMenu();
 });
})();
