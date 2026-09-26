/* ========================================
   MASTA XUL AFFILIATE SHOP - /shop/
   Produk boleh diklik → produk.html?id=
   Carian nama + ID | Pagination nombor
======================================== */

const API_URL = "/api/produk";
const WEBSITE_URL = "https://mastaxul.my/shop/";

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
      navigator.share({ title: nama, text: teks, url: WEBSITE_URL }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(teks);
      alert("Teks telah disalin!");
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
    if (window.scrollY > 300) btn.classList.add("show");
    else btn.classList.remove("show");
  }
});

// ========== FORMAT HARGA ==========
function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === "") return "0.00";
  let clean = harga.toString().replace(/rm/gi, "").replace(/\s/g, "").replace(/,/g, ".");
  const num = parseFloat(clean);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

// Escape untuk teks/attribute HTML (elak XSS dari data Sheet/Form)
function esc(str) {
  return (str || "").toString().replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Escape untuk letak dalam JS string literal ('...') sebelum di-esc() untuk attribute
function escJs(str) {
  return (str || "").toString()
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

// ========== LOAD PRODUK ==========
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

    const params = new URLSearchParams(window.location.search);
    const kategoriURL = params.get("kategori");
    const cariURL = params.get("q");

    if (kategoriURL) {
      filterProduk(kategoriURL);
      return;
    }
    if (cariURL) {
      document.getElementById("search").value = cariURL;
      cariProduk();
      return;
    }

    paparProduk(produkDipapar);

  } catch (error) {
    console.error("Percubaan " + cuba + " gagal:", error);
    if (cuba < 3) {
      setTimeout(() => muatProduk(cuba + 1), 1500);
    } else {
      container.innerHTML = `<div class="empty-state">Gagal memuatkan produk.<br>Sila refresh halaman.</div>`;
    }
  }
}

// ========== PAPAR PRODUK ==========
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
    const badge = p.badge ? `<span class="label-hot">${esc(p.badge)}</span>` : "";
    const terjual = p.terjual ? `<div class="produk-terjual">${esc(p.terjual)} terjual</div>` : "";

    let butangHTML = "";
    if (p.tiktok && p.tiktok.toString().trim() !== "") {
      butangHTML += `<a href="${esc(p.tiktok)}" class="btn-platform btn-tiktok" target="_blank" rel="noopener" onclick="event.stopPropagation()">Beli di TikTok</a>`;
    }
    if (p.shopee && p.shopee.toString().trim() !== "") {
      butangHTML += `<a href="${esc(p.shopee)}" class="btn-platform btn-shopee" target="_blank" rel="noopener" onclick="event.stopPropagation()">Beli di Shopee</a>`;
    }
    if (p.lazada && p.lazada.toString().trim() !== "") {
      butangHTML += `<a href="${esc(p.lazada)}" class="btn-platform btn-lazada" target="_blank" rel="noopener" onclick="event.stopPropagation()">Beli di Lazada</a>`;
    }

    const gambar = esc(
      (p.gambar && p.gambar.toString().trim() !== "")
        ? p.gambar
        : "https://via.placeholder.com/400x300/f5f5f5/6B4423?text=Tiada+Gambar"
    );

    // Dua lapis escape: escJs elak JS string pecah, esc elak HTML attribute pecah
    const namaOnclick = esc(escJs(p.nama || ""));
    const hargaOnclick = esc(escJs(formatHarga(p.harga)));
    const idLink = encodeURIComponent(p.id || "");

    return `
      <div class="produk-card" onclick="window.location.href='produk.html?id=${idLink}'" style="cursor:pointer;">
        <div class="produk-img-wrapper">
          <img src="${gambar}" alt="${esc(p.nama)}" class="produk-img" loading="lazy"
               onerror="this.src='https://via.placeholder.com/400x300/f5f5f5/6B4423?text=Tiada+Gambar'">
        </div>
        
        <div class="produk-info">
          ${badge}
          <h3 class="produk-nama">${esc(p.nama)}</h3>
          <div class="produk-harga">RM ${formatHarga(p.harga)}</div>
          ${terjual}

          <div class="platform-buttons" onclick="event.stopPropagation()">
            ${butangHTML}
          </div>

          <div class="share-buttons" onclick="event.stopPropagation()">
            <button class="btn-share btn-share-wa" onclick="shareProduk('${namaOnclick}', '${hargaOnclick}', 'whatsapp')">WhatsApp</button>
            <button class="btn-share btn-share-telegram" onclick="shareProduk('${namaOnclick}', '${hargaOnclick}', 'telegram')">Telegram</button>
            <button class="btn-share btn-share-other" onclick="shareProduk('${namaOnclick}', '${hargaOnclick}', 'other')">Lain</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Pagination + nombor halaman
  if (pagination) {
    let nomborHTML = "";
    for (let i = 1; i <= totalPage; i++) {
      if (i === currentPage) {
        nomborHTML += `<button class="page-num active" disabled>${i}</button>`;
      } else {
        nomborHTML += `<button class="page-num" onclick="pergiKePage(${i})">${i}</button>`;
      }
    }

    pagination.innerHTML = `
      <button onclick="tukarPage(-1)" id="btnPrev" ${currentPage === 1 ? "disabled" : ""}>← Previous</button>
      <div class="page-numbers">${nomborHTML}</div>
      <button onclick="tukarPage(1)" id="btnNext" ${currentPage === totalPage ? "disabled" : ""}>Next →</button>
    `;
    pagination.style.display = totalPage > 1 ? "flex" : "none";
  }
}

// ========== TUKAR PAGE ==========
function tukarPage(arah) {
  currentPage += arah;
  paparProduk(produkDipapar);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pergiKePage(nombor) {
  currentPage = nombor;
  paparProduk(produkDipapar);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========== FILTER ==========
function filterProduk(kategori) {
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));

  const butangAktif = Array.from(document.querySelectorAll(".menu button"))
    .find(btn => btn.textContent.trim().toLowerCase() === kategori.toLowerCase());
  if (butangAktif) butangAktif.classList.add("active");

  if (kategori === "Semua") {
    produkDipapar = [...semuaProduk];
  } else {
    produkDipapar = semuaProduk.filter(p => {
      if (!p.kategori) return false;
      const senaraiKategori = p.kategori.toString().toLowerCase().split(",").map(k => k.trim());
      return senaraiKategori.includes(kategori.toLowerCase());
    });
  }

  const keyword = document.getElementById("search").value.trim();
  if (keyword) {
    const kw = keyword.toLowerCase();
    produkDipapar = produkDipapar.filter(p => {
      const nama = (p.nama || "").toString().toLowerCase();
      const id = (p.id || "").toString().toLowerCase();
      return nama.includes(kw) || id.includes(kw);
    });
  }

  currentPage = 1;
  paparProduk(produkDipapar);
}

// ========== CARIAN (nama + ID) ==========
function cariProduk() {
  const keyword = document.getElementById("search").value.trim().toLowerCase();
  const butangAktif = document.querySelector(".menu button.active");
  const kategoriAktif = butangAktif ? butangAktif.textContent.trim() : "Semua";

  let hasil = [...semuaProduk];

  if (kategoriAktif !== "Semua") {
    hasil = hasil.filter(p => {
      if (!p.kategori) return false;
      const senaraiKategori = p.kategori.toString().toLowerCase().split(",").map(k => k.trim());
      return senaraiKategori.includes(kategoriAktif.toLowerCase());
    });
  }

  if (keyword) {
    hasil = hasil.filter(p => {
      const nama = (p.nama || "").toString().toLowerCase();
      const id = (p.id || "").toString().toLowerCase();
      return nama.includes(keyword) || id.includes(keyword);
    });
  }

  produkDipapar = hasil;
  currentPage = 1;
  paparProduk(produkDipapar);
}

// ========== MULAKAN ==========
document.addEventListener("DOMContentLoaded", () => {
  muatProduk();
});
