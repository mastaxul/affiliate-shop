// ========== MENU HAMBURGER (Pusat) ==========
// Digunakan oleh: /shop/ (dan halaman lain yang ada .header-top)
// Portal root ada nav sendiri — tidak wajib load fail ini.

function loadMenu() {
  const headerTop = document.querySelector(".header-top");
  if (headerTop) {
    const oldToggle = headerTop.querySelector(".menu-toggle");
    if (oldToggle) oldToggle.remove();

    headerTop.insertAdjacentHTML(
      "beforeend",
      `
      <button class="menu-toggle" onclick="toggleMenu()" aria-label="Buka menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `
    );
  }

  if (!document.getElementById("sideMenu")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="side-menu" id="sideMenu" role="navigation" aria-label="Menu utama">
        <a href="/">🏠 Laman Utama</a>
        <a href="/shop/">🛍️ Shop</a>
        <a href="/#about">👤 Tentang</a>
        <a href="/#projects">📁 Projek</a>
        <a href="/#recommended-gallery">🖼️ Galeri</a>
        <a href="/#contact">📞 Hubungi</a>
        <a href="https://whatsapp.com/channel/0029VaHHLhNIt5rvXDSZl03Y" target="_blank" rel="noopener">📢 WhatsApp Channel</a>
      </div>
      <div class="menu-overlay" id="menuOverlay" onclick="toggleMenu()" aria-hidden="true"></div>
    `
    );

    document.getElementById("sideMenu").addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
  }
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  if (!menu || !overlay) return;

  const buka = !menu.classList.contains("open");
  menu.classList.toggle("open", buka);
  overlay.classList.toggle("open", buka);
  overlay.setAttribute("aria-hidden", buka ? "false" : "true");
  document.body.style.overflow = buka ? "hidden" : "";
}

function closeMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  if (!menu || !overlay) return;

  menu.classList.remove("open");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeMenu();
});

document.addEventListener("DOMContentLoaded", loadMenu);
