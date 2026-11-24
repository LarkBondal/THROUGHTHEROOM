const stage = document.querySelector(".gallery-stage");
const comic = stage.querySelector(".gallery-comic");
const book = comic.querySelector(".comic-book");
const turnButton = comic.querySelector(".comic-turn");
const exitButton = stage.querySelector(".comic-exit");
const cover = document.querySelector("#comicCover");
const firstPage = document.querySelector("#comicPage");
const pageControls = document.querySelectorAll(".top-controls, .instagram-button, .side-menu, .menu-overlay");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let zoomAnimation;

function setGallery(open) {
  const before = book.getBoundingClientRect();
  zoomAnimation?.cancel();

  stage.classList.toggle("is-expanded", open);
  comic.classList.toggle("is-open", open);
  turnButton.setAttribute("aria-expanded", String(open));
  cover.setAttribute("aria-hidden", String(open));
  firstPage.setAttribute("aria-hidden", String(!open));
  exitButton.hidden = !open;

  if (open) {
    stage.setAttribute("role", "dialog");
    stage.setAttribute("aria-modal", "true");
  } else {
    stage.removeAttribute("role");
    stage.removeAttribute("aria-modal");
  }

  for (const control of pageControls) {
    control.inert = open;
    control.toggleAttribute("data-gallery-hidden", open);
  }
  (open ? exitButton : turnButton).focus({ preventScroll: true });

  if (!reducedMotion.matches) {
    const after = book.getBoundingClientRect();
    zoomAnimation = book.animate([
      {
        transformOrigin: "top left",
        transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)
          scale(${before.width / after.width}, ${before.height / after.height})`,
      },
      { transformOrigin: "top left", transform: "none" },
    ], { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }
}

turnButton.addEventListener("click", () => setGallery(true));
exitButton.addEventListener("click", () => setGallery(false));
stage.addEventListener("keydown", (event) => {
  if (!stage.classList.contains("is-expanded")) return;

  if (event.key === "Escape") setGallery(false);
  if (event.key === "Tab") event.preventDefault();
});
