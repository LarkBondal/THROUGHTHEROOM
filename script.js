const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
  sideMenu.classList.add("is-open");
  menuOverlay.hidden = false;
  requestAnimationFrame(() => menuOverlay.classList.add("is-visible"));
  sideMenu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  closeButton.focus();
}

function closeMenu() {
  sideMenu.classList.remove("is-open");
  menuOverlay.classList.remove("is-visible");
  sideMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  window.setTimeout(() => {
    menuOverlay.hidden = true;
  }, 220);
}

menuButton.addEventListener("click", openMenu);
closeButton.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sideMenu.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});
