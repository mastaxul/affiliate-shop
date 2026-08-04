/* ========================================
   MASTA XUL AFFILIATE SHOP
   script.js - Hanya Papar Butang Yang Ada Link
======================================== */

let semuaProduk = [];
let produkDipapar = [];

// ========== LOAD PRODUK ==========
async function muatProduk() {
  const container = document.getElementById("produk-list");
  container.innerHTML = `<div class="empty-state">Memuatkan produk...</div>`;

  try {
    const response = await fetch("products.json?t=" + new Date().getTime());
    if (!response.ok) throw new Error("Gagal memuatkan products.json");

    semuaProduk = await response.json();
    produkDipapar = [...semuaProduk];
    paparProduk(produkDipapar);

  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="empty-state">
        Gagal memuatkan produk.<br>
        Sila pastikan fail <strong>products.json</strong> wujud.
      </div>`;
  }
}

// ========== PAPAR PRODUK ==========
function paparProduk(senarai) {
  const container = document.getElementById("produk-list");

  if (!senarai || senarai.length === 0) {
    container.innerHTML = `<div class="empty-state">Tiada produk dijumpai.</div>`;
    return;
  }

  container.innerHTML = senarai.map(p => {
    // Badge
    const badge = p.badge 
      ? `<span class="label-hot">${p.badge}</span>` 
      : "";

    // Terjual
    const terjual = p.terjual 
      ? `<div class="produk-terjual">${p.terjual} terjual</div>` 
      : "";

    // ===== BUTANG (hanya keluar kalau ada link) =====
    let butangHTML = "";

    if (p.tiktok && p.tiktok.trim() !== "") {
      butangHTML += `<a href="${p.tiktok}" class="btn-platform btn-tiktok" target="_blank" rel="noopener">Beli di TikTok</a>`;
    }

    if (p.shopee && p.shopee.trim() !== "") {
      butangHTML += `<a href="${p.shopee}" class="btn-platform btn-shopee" target="_blank" rel="noopener">Beli di Shopee</a>`;
    }

    if (p.lazada && p.lazada.trim() !== "") {
      butangHTML += `<a href="${p.lazada}" class="btn-platform btn-lazada" target="_blank" rel="noopener">Beli di Lazada</a>`;
    }

    // Gambar
    const gambar = (p.gambar && p.gambar.trim() !== "") 
      ? p.gambar 
      : "https://via.placeholder.com/400x300/f5f5f5/6B4423?text=Tiada+Gambar";

    return `
      <div class="produk-card">
        <div class="produk-img-wrapper">
          <img 
            src="${gambar}" 
            alt="${p.nama}" 
            class="produk-img"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/400x300/f5f5f5/6B4423?text=Tiada+Gambar'">
        </div>
        
        <div class="produk-info">
          ${badge}
          <h3 class="produk-nama">${p.nama}</h3>
          <div class="produk-harga">RM ${parseFloat(p.harga || 0).toFixed(2)}</div>
          ${terjual}

          <div class="platform-buttons">
            ${butangHTML}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ========== FILTER KATEGORI ==========
function filterProduk(kategori) {
  document.querySelectorAll(".menu button").forEach(btn => {
    btn.classList.remove("active");
  });

  const butangAktif = Array.from(document.querySelectorAll(".menu button"))
    .find(btn => btn.textContent.trim() === kategori);
  
  if (butangAktif) {
    butangAktif.classList.add("active");
  }

  if (kategori === "Semua") {
    produkDipapar = [...semuaProduk];
  } else {
    produkDipapar = semuaProduk.filter(p => 
      p.kategori && p.kategori.toLowerCase() === kategori.toLowerCase()
    );
  }

  const keyword = document.getElementById("search").value.trim();
  if (keyword) {
    produkDipapar = produkDipapar.filter(p =>
      p.nama.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  paparProduk(produkDipapar);
}

// ========== CARIAN ==========
function cariProduk() {
  const keyword = document.getElementById("search").value.trim().toLowerCase();
  const butangAktif = document.querySelector(".menu button.active");
  const kategoriAktif = butangAktif ? butangAktif.textContent.trim() : "Semua";

  let hasil = [...semuaProduk];

  if (kategoriAktif !== "Semua") {
    hasil = hasil.filter(p => 
      p.kategori && p.kategori.toLowerCase() === kategoriAktif.toLowerCase()
    );
  }

  if (keyword) {
    hasil = hasil.filter(p => p.nama.toLowerCase().includes(keyword));
  }

  produkDipapar = hasil;
  paparProduk(produkDipapar);
}

// ========== MULAKAN ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
