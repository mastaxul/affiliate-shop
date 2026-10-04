/* Masta Xul — script.js (laman utama) */

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const btn = document.getElementById("backToTop");
  if (btn) {
    if (window.scrollY > 300) btn.classList.add("show");
    else btn.classList.remove("show");
  }
});
