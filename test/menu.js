// ========== MENU HAMBURGER (Pusat) ==========
function loadMenu() {
  // Cari tempat untuk letak butang (dalam .header-top)
  const headerTop = document.querySelector(".header-top");
  if (headerTop) {
    // Buang butang lama jika ada
    const oldToggle = headerTop.querySelector(".menu-toggle");
    if (oldToggle) oldToggle.remove();

    // Tambah butang baru
    headerTop.insertAdjacentHTML("beforeend", `
      <button class="menu-toggle" onclick="toggleMenu()" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `);
  }

  // Tambah side menu & overlay ke body
  if (!document.getElementById("sideMenu")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="side-menu" id="sideMenu">
        <a href="/">🏠 Laman Utama</a>
        <a href="/shop/">🛍️ Shop</a>
        <a href="/tentang/">📖 Tentang Kami</a>
        <a href="/hubungi/">📞 Hubungi Kami</a>
        <a href="https://whatsapp.com/channel/0029VaHHLhNIt5rvXDSZl03Y" target="_blank">📢 WhatsApp Channel</a>
      </div>
      <div class="menu-overlay" id="menuOverlay" onclick="toggleMenu()"></div>
    `);
  }
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  if (menu && overlay) {
    menu.classList.toggle("open");
    overlay.classList.toggle("open");
  }
}

// Auto load bila page siap
document.addEventListener("DOMContentLoaded", loadMenu);
