/* ========================================
   MASTA XUL AFFILIATE SHOP
   script.js - Versi Betul Harga (No more NaN)
======================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbyMG70IM6KD4cmzbNLPZX6mxB4es-qZHwe9NjTa6UV99XdIM6R1DnXgdQKqnA4zV-43Ew/exec";

let semuaProduk = [];
let produkDipapar = [];

// ========== FORMAT HARGA (elak NaN) ==========
function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === "") {
    return "0.00";
  }

  // Buang "RM", ruang, dan tukar koma kepada titik
  let clean = harga.toString()
    .replace(/rm/gi, "")
    .replace(/\s/g, "")
    .replace(/,/g, ".");

  const num = parseFloat(clean);

  if (isNaN(num)) {
    return "0.00";
  }

  return num.toFixed(2);
}

// ========== LOAD PRODUK DARI APPS SCRIPT ==========
async function muatProduk() {
  const container = document.getElementById("produk-list");
  container.innerHTML = `<div class="empty-state">Memuatkan produk...</div>`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Gagal memuatkan data");

    const data = await response.json();

    // Filter baris kosong
    semuaProduk = data.filter(p => p.nama && p.nama.toString().trim() !== "");

    produkDipapar = [...semuaProduk];
    paparProduk(produkDipapar);

  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="empty-state">
        Gagal memuatkan produk.<br>
        Sila semak sambungan atau Apps Script.
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

    // Butang (hanya keluar kalau ada link)
    let butangHTML = "";

    if (p.tiktok && p.tiktok.toString().trim() !== "") {
      butangHTML += `<a href="${p.tiktok}" class="btn-platform btn-tiktok" target="_blank" rel="noopener">Beli di TikTok</a>`;
    }

    if (p.shopee && p.shopee.toString().trim() !== "") {
      butangHTML += `<a href="${p.shopee}" class="btn-platform btn-shopee" target="_blank" rel="noopener">Beli di Shopee</a>`;
    }

    if (p.lazada && p.lazada.toString().trim() !== "") {
      butangHTML += `<a href="${p.lazada}" class="btn-platform btn-lazada" target="_blank" rel="noopener">Beli di Lazada</a>`;
    }

    // Gambar
    const gambar = (p.gambar && p.gambar.toString().trim() !== "") 
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
          <div class="produk-harga">RM ${formatHarga(p.harga)}</div>
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
      p.kategori && p.kategori.toString().toLowerCase() === kategori.toLowerCase()
    );
  }

  const keyword = document.getElementById("search").value.trim();
  if (keyword) {
    produkDipapar = produkDipapar.filter(p =>
      p.nama.toString().toLowerCase().includes(keyword.toLowerCase())
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
      p.kategori && p.kategori.toString().toLowerCase() === kategoriAktif.toLowerCase()
    );
  }

  if (keyword) {
    hasil = hasil.filter(p => 
      p.nama.toString().toLowerCase().includes(keyword)
    );
  }

  produkDipapar = hasil;
  paparProduk(produkDipapar);
}

// ========== MULAKAN ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
