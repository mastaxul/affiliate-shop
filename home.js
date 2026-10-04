/* Masta Xul — home.js */

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav-pill a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const clean = href.replace(/\/$/, "") || "/";
    if (clean === path || (path === "" && clean === "/")) {
      a.classList.add("active");
    } else if (href !== "/") {
      a.classList.remove("active");
    }
  });

  const cards = document.querySelectorAll(".feature-card, .cta");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });
  }
});
