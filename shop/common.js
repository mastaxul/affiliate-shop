/* ========================================
   MASTA XUL AFFILIATE SHOP - common.js
   Pemalar & fungsi yang DIKONGSI oleh:
     - index.html  (melalui script.js)
     - produk.html
   Letak dalam folder /shop/ (sebelah script.js).
   MESTI dimuatkan SEBELUM script.js / script inline produk.html.
======================================== */

const API_URL = "/api/produk";
const WEBSITE_URL = "https://mastaxul.my/shop/";

function padanKategori(p, kategori) {
  const k = (kategori || "").toString().trim().toLowerCase();
  if (!k || k === "semua") return true;

  const senarai = (p.kategori || "").toString().toLowerCase().split(",").map(x => x.trim());
  if (senarai.includes(k)) return true;

  if (k === "viral") {
    return (p.badge || "").toString().trim().toLowerCase() === "viral";
  }
  return false;
}

function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === "") return "0.00";
  let clean = harga.toString().replace(/rm/gi, "").replace(/\s/g, "").replace(/,/g, ".");
  const num = parseFloat(clean);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

function esc(str) {
  return (str || "").toString().replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function escJs(str) {
  return (str || "").toString()
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

// Cara 2: proxy melalui Worker /shop/img?id= → Save As = MastaXul_ID.jpg
function mediaUrl(id, fallback) {
  const fid = (id || "").toString().trim();
  const placeholder = (fallback && fallback.toString().trim())
    ? fallback.toString().trim()
    : "https://via.placeholder.com/400x300/f5f5f5/6B4423?text=Tiada+Gambar";
  if (!fid) return placeholder;
  return "/shop/img?id=" + encodeURIComponent(fid);
}

// Cara 1: alt text berbrand + ID
function altProduk(id, nama) {
  const n = (nama || "Produk").toString().trim();
  const fid = (id || "").toString().trim();
  return fid
    ? ("MastaXul_" + fid + " - " + n + " | Masta Xul Affiliate Shop")
    : (n + " | Masta Xul Affiliate Shop");
}
