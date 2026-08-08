/* ========================================
   MASTA XUL AFFILIATE SHOP
   script.js - Full Version
   (Pagination + Share + Retry + Multiple Category)
======================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbyMG70IM6KD4cmzbNLPZX6mxB4es-qZHwe9NjTa6UV99XdIM6R1DnXgdQKqnA4zV-43Ew/exec";

// ========== TUKAR DOMAIN DI SINI SAHAJA ==========
const WEBSITE_URL = "https://www.mastaxul.my";
// ================================================

let semuaProduk = [];
let produkDipapar = [];
let currentPage = 1;
const produkPerPage = 20;

// ========== SHARE PRODUK ==========
function shareProduk(nama, harga, platform = "other") {
  const teks = `🔥 ${nama}\nHarga: RM ${harga}\n\nLihat produk ni di Masta Xul Affiliate Shop:\n${WEBSITE_URL}`;
  const encoded = encodeURIComponent(teks);

  if (platform === "whatsapp") {
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  } else if (platform === "telegram") {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(WEBSITE_URL)}&text=${encoded}`,
      "_blank"
    );
  } else {
    if (navigator.share) {
      navigator.share({
        title: nama,
        text: teks,
        url: WEBSITE_URL
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(teks);
      alert("Teks telah disalin! Anda boleh paste di media sosial.");
    }
  }
}

// ========== BACK TO TOP ==========
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const btn = document.getElementById("backToTop");
  if (btn) {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }
});



// ========== FORMAT HARGA ==========
function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === "") {
    return "0.00";
  }

  let clean = harga.toString()
    .replace(/rm/gi, "")
    .replace(/\s/g, "")
    .replace(/,/g, ".");

  const num = parseFloat(clean);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

// ========== LOAD PRODUK (dengan Retry) ==========
async function muatProduk(cuba = 1) {
  const container = document.getElementById("produk-list");

  if (cuba === 1) {
    container.innerHTML = `<div class="empty-state">Memuatkan produk...</div>`;
  } else {
    container.innerHTML = `<div class="empty-state">Mencuba semula... (${cuba}/3)</div>`;
  }

  try {
    const response = await fetch(API_URL + "?t=" + new Date().getTime(), {
      method: "GET",
      redirect: "follow"
    });

    if (!response.ok) throw new Error("Network response not ok");

    const data = await response.json();

    semuaProduk = data.filter(p => p.nama && p.nama.toString().trim() !== "");
    produkDipapar = [...semuaProduk];
    currentPage = 1;
    paparProduk(produkDipapar);

  } catch (error) {
    console.error("Percubaan " + cuba + " gagal:", error);

    if (cuba < 3) {
      setTimeout(() => {
        muatProduk(cuba + 1);
      }, 1500);
    } else {
      container.innerHTML = `
        <div class="empty-state">
          Gagal memuatkan produk.<br>
          Sila refresh halaman atau cuba lagi sebentar.
        </div>`;
    }
  }
}

// ========== PAPAR PRODUK (dengan Pagination) ==========
function paparProduk(senarai) {
  const container = document.getElementById("produk-list");
  const pagination = document.getElementById("pagination");

  if (!senarai || senarai.length === 0) {
    container.innerHTML = `<div class="empty-state">Tiada produk dijumpai.</div>`;
    if (pagination) pagination.style.display = "none";
    return;
  }

  const totalPage = Math.ceil(senarai.length / produkPerPage);

  if (currentPage > totalPage) currentPage = totalPage;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * produkPerPage;
  const endIndex = startIndex + produkPerPage;
  const produkSekarang = senarai.slice(startIndex, endIndex);

  container.innerHTML = produkSekarang.map(p => {
    const badge = p.badge ? `<span class="label-hot">${p.badge}</span>` : "";
    const terjual = p.terjual ? `<div class="produk-terjual">${p.terjual} terjual</div>` : "";

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

          <div class="share-buttons">
            <button class="btn-share btn-share-wa" onclick="shareProduk('${p.nama.replace(/'/g, "\\'")}', '${formatHarga(p.harga)}', 'whatsapp')">WhatsApp</button>
            <button class="btn-share btn-share-telegram" onclick="shareProduk('${p.nama.replace(/'/g, "\\'")}', '${formatHarga(p.harga)}', 'telegram')">Telegram</button>
            <button class="btn-share btn-share-other" onclick="shareProduk('${p.nama.replace(/'/g, "\\'")}', '${formatHarga(p.harga)}', 'other')">Lain</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Update pagination UI
  if (pagination) {
    document.getElementById("pageInfo").textContent = `Halaman ${currentPage} dari ${totalPage}`;
    document.getElementById("btnPrev").disabled = currentPage === 1;
    document.getElementById("btnNext").disabled = currentPage === totalPage;
    pagination.style.display = totalPage > 1 ? "flex" : "none";
  }
}

// ========== TUKAR PAGE ==========
function tukarPage(arah) {
  currentPage += arah;
  paparProduk(produkDipapar);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========== FILTER KATEGORI (Sokong Multiple) ==========
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
    produkDipapar = semuaProduk.filter(p => {
      if (!p.kategori) return false;

      // Sokong multiple kategori (pisah dengan koma)
      const senaraiKategori = p.kategori
        .toString()
        .toLowerCase()
        .split(",")
        .map(k => k.trim());

      return senaraiKategori.includes(kategori.toLowerCase());
    });
  }

  // Kalau ada carian aktif
  const keyword = document.getElementById("search").value.trim();
  if (keyword) {
    produkDipapar = produkDipapar.filter(p =>
      p.nama.toString().toLowerCase().includes(keyword.toLowerCase())
    );
  }

  currentPage = 1;
  paparProduk(produkDipapar);
}

// ========== CARIAN ==========
function cariProduk() {
  const keyword = document.getElementById("search").value.trim().toLowerCase();
  const butangAktif = document.querySelector(".menu button.active");
  const kategoriAktif = butangAktif ? butangAktif.textContent.trim() : "Semua";

  let hasil = [...semuaProduk];

  if (kategoriAktif !== "Semua") {
    hasil = hasil.filter(p => {
      if (!p.kategori) return false;

      const senaraiKategori = p.kategori
        .toString()
        .toLowerCase()
        .split(",")
        .map(k => k.trim());

      return senaraiKategori.includes(kategoriAktif.toLowerCase());
    });
  }

  if (keyword) {
    hasil = hasil.filter(p =>
      p.nama.toString().toLowerCase().includes(keyword)
    );
  }

  produkDipapar = hasil;
  currentPage = 1;
  paparProduk(produkDipapar);
}

// ========== TOGGLE MENU ==========
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  
  menu.classList.toggle("open");
  overlay.classList.toggle("open");
}

// ========== MULAKAN ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
