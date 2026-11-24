const stage = document.querySelector(".gallery-stage");
const comic = stage.querySelector(".gallery-comic");
const book = comic.querySelector(".comic-book");
const turnButton = comic.querySelector(".comic-turn");
const exitButton = stage.querySelector(".comic-exit");
const backButton = stage.querySelector(".comic-back");
const comicHint = stage.querySelector(".comic-hint");
const cover = document.querySelector("#comicCover");
const firstPage = document.querySelector("#comicPage");
const panelControls = firstPage.querySelector(".comic-panels");
const pageControls = document.querySelectorAll(".top-controls, .instagram-button, .side-menu, .menu-overlay");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let zoomAnimation;
let activePanel;

function setPanel(panel) {
  const previousPanel = activePanel;
  activePanel = panel;
  // Crop coordinates and size are percentages of the original collage.
  const size = panel ? Number(panel.dataset.size) : 100;
  const x = panel ? Number(panel.dataset.x) : 0;
  const y = panel ? Number(panel.dataset.y) : 0;
  const scale = 100 / size;

  firstPage.style.setProperty("--panel-scale", scale);
  firstPage.style.setProperty("--panel-x", `${(50 - x - size / 2) * scale}%`);
  firstPage.style.setProperty("--panel-y", `${(50 - y - size / 2) * scale}%`);
  panelControls.hidden = Boolean(panel);
  backButton.hidden = !panel;
  comicHint.hidden = Boolean(panel) || !stage.classList.contains("is-expanded");

  if (stage.classList.contains("is-expanded")) {
    (panel ? backButton : previousPanel)?.focus({ preventScroll: true });
  }
}

function setGallery(open) {
  const before = book.getBoundingClientRect();
  zoomAnimation?.cancel();

  stage.classList.toggle("is-expanded", open);
  comic.classList.toggle("is-open", open);
  turnButton.setAttribute("aria-expanded", String(open));
  cover.setAttribute("aria-hidden", String(open));
  firstPage.setAttribute("aria-hidden", String(!open));
  firstPage.inert = !open;
  if (!open && activePanel) setPanel(null);
  exitButton.hidden = !open;
  comicHint.hidden = !open;

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
backButton.addEventListener("click", () => setPanel(null));
panelControls.addEventListener("click", (event) => {
  const panel = event.target.closest(".comic-panel");
  if (panel) setPanel(panel);
});
stage.addEventListener("keydown", (event) => {
  if (!stage.classList.contains("is-expanded")) return;

  if (event.key === "Escape") {
    if (activePanel) setPanel(null);
    else setGallery(false);
  }

  if (event.key === "Tab") {
    const controls = activePanel
      ? [backButton, exitButton]
      : [exitButton, ...panelControls.querySelectorAll("button")];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
