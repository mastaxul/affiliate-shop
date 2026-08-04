/* ========================================
   MASTA XUL AFFILIATE SHOP
   script.js - Full Version
======================================== */

let semuaProduk = [];
let produkDipapar = [];

// ========== LOAD PRODUK DARI products.json ==========
async function muatProduk() {
  const container = document.getElementById("produk-list");
  container.innerHTML = `<div class="empty-state">Memuatkan produk...</div>`;

  try {
    // Tambah timestamp supaya cache tak stuck
    const response = await fetch("products.json?t=" + new Date().getTime());
    
    if (!response.ok) {
      throw new Error("Gagal memuatkan products.json");
    }

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
    // Label HOT (optional - kalau ada field "hot": true)
    const labelHot = p.hot === true || p.hot === "true" 
      ? `<span class="label-hot">HOT</span>` 
      : "";

    // Harga asal (optional)
    const hargaAsal = p.harga_asal 
      ? `<div class="produk-harga-asal">RM ${parseFloat(p.harga_asal).toFixed(2)}</div>` 
      : "";

    // Butang WhatsApp (optional - kalau ada field "whatsapp")
    const btnWhatsapp = p.whatsapp 
      ? `<a href="https://wa.me/${p.whatsapp}" class="btn-whatsapp" target="_blank" rel="noopener">WhatsApp</a>` 
      : "";

    return `
      <div class="produk-card">
        <img 
          src="${p.imej || 'https://via.placeholder.com/300x200?text=Tiada+Imej'}" 
          alt="${p.nama}" 
          class="produk-img"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/300x200?text=Tiada+Imej'">
        
        <div class="produk-info">
          ${labelHot}
          <h3 class="produk-nama">${p.nama}</h3>
          <div class="produk-harga">RM ${parseFloat(p.harga).toFixed(2)}</div>
          ${hargaAsal}
          <a href="${p.link}" class="btn-beli" target="_blank" rel="noopener noreferrer">
            Beli Sekarang
          </a>
          ${btnWhatsapp}
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

  // Cari butang yang diklik dan buat aktif
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

  // Kalau ada carian aktif, tapis sekali lagi
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

  // Dapatkan kategori aktif sekarang
  const butangAktif = document.querySelector(".menu button.active");
  const kategoriAktif = butangAktif ? butangAktif.textContent.trim() : "Semua";

  let hasil = [...semuaProduk];

  // Filter ikut kategori dulu
  if (kategoriAktif !== "Semua") {
    hasil = hasil.filter(p => 
      p.kategori && p.kategori.toLowerCase() === kategoriAktif.toLowerCase()
    );
  }

  // Lepas tu filter ikut keyword
  if (keyword) {
    hasil = hasil.filter(p =>
      p.nama.toLowerCase().includes(keyword)
    );
  }

  produkDipapar = hasil;
  paparProduk(produkDipapar);
}

// ========== MULAKAN SEMASA PAGE LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
