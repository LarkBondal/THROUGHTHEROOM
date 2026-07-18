const menuButton = document.querySelector("#menuButton");
const closeButton = document.querySelector("#closeButton");
const sideMenu = document.querySelector("#sideMenu");
const menuOverlay = document.querySelector("#menuOverlay");

function setMenu(open) {
  sideMenu.classList.toggle("is-open", open);
  sideMenu.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  menuOverlay.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

menuButton.addEventListener("click", () => setMenu(true));
closeButton.addEventListener("click", () => setMenu(false));
menuOverlay.addEventListener("click", () => setMenu(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});
