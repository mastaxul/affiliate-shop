/* ========================================
   MASTA XUL AFFILIATE SHOP
   script.js - Versi 3 Butang Platform
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
    // Badge (HOT / Viral / dll)
    const badge = p.badge 
      ? `<span class="label-hot">${p.badge}</span>` 
      : "";

    // Butang TikTok
    const btnTiktok = p.tiktok 
      ? `<a href="${p.tiktok}" class="btn-platform btn-tiktok" target="_blank" rel="noopener">Beli di TikTok</a>` 
      : "";

    // Butang Shopee
    const btnShopee = p.shopee 
      ? `<a href="${p.shopee}" class="btn-platform btn-shopee" target="_blank" rel="noopener">Beli di Shopee</a>` 
      : "";

    // Butang Lazada
    const btnLazada = p.lazada 
      ? `<a href="${p.lazada}" class="btn-platform btn-lazada" target="_blank" rel="noopener">Beli di Lazada</a>` 
      : "";

    // Terjual (optional)
    const terjual = p.terjual 
      ? `<div class="produk-terjual">${p.terjual} terjual</div>` 
      : "";

    return `
      <div class="produk-card">
        <img 
          src="${p.gambar || 'https://via.placeholder.com/300x200?text=Tiada+Imej'}" 
          alt="${p.nama}" 
          class="produk-img"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/300x200?text=Tiada+Imej'">
        
        <div class="produk-info">
          ${badge}
          <h3 class="produk-nama">${p.nama}</h3>
          <div class="produk-harga">RM ${parseFloat(p.harga).toFixed(2)}</div>
          ${terjual}

          <div class="platform-buttons">
            ${btnTiktok}
            ${btnShopee}
            ${btnLazada}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ========== FILTER KATEGORI ==========
function filterProduk(kategori) {
  // Update butang aktif
  document.querySelectorAll(".menu button").forEach(btn => {
    btn.classList.remove("active");
  });

  const butangAktif = Array.from(document.querySelectorAll(".menu button"))
    .find(btn => btn.textContent.trim() === kategori);
  
  if (butangAktif) {
    butangAktif.classList.add("active");
  }

  // Filter produk
  if (kategori === "Semua") {
    produkDipapar = [...semuaProduk];
  } else {
    produkDipapar = semuaProduk.filter(p => 
      p.kategori && p.kategori.toLowerCase() === kategori.toLowerCase()
    );
  }

  // Kalau ada carian aktif
  const keyword = document.getElementById("search").value.trim();
  if (keyword) {
    produkDipapar = produkDipapar.filter(p =>
      p.nama.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  paparProduk(produkDipapar);
}

// ========== CARIAN PRODUK ==========
function cariProduk() {
  const keyword = document.getElementById("search").value.trim().toLowerCase();

  const butangAktif = document.querySelector(".menu button.active");
  const kategoriAktif = butangAktif ? butangAktif.textContent.trim() : "Semua";

  let hasil = [...semuaProduk];

  // Filter kategori
  if (kategoriAktif !== "Semua") {
    hasil = hasil.filter(p => 
      p.kategori && p.kategori.toLowerCase() === kategoriAktif.toLowerCase()
    );
  }

  // Filter keyword
  if (keyword) {
    hasil = hasil.filter(p =>
      p.nama.toLowerCase().includes(keyword)
    );
  }

  produkDipapar = hasil;
  paparProduk(produkDipapar);
}

// ========== MULAKAN ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
