/* ========================================
   MASTA XUL AFFILIATE SHOP - common.js
   Pemalar & fungsi yang DIKONGSI oleh:
     - index.html  (melalui script.js)
     - produk.html
   Letak dalam folder /shop/ (sebelah script.js).
   MESTI dimuatkan SEBELUM script.js / script inline produk.html.
======================================== */

// Endpoint senarai produk (dibaca dari Cloudflare KV melalui Worker)
const API_URL = "/api/produk";

// Pautan asas untuk kongsi produk
const WEBSITE_URL = "https://mastaxul.my/shop/";

// ========== PADAN KATEGORI ==========
// True kalau produk masuk kategori yang dipilih pada menu.
// Khas "Viral": padan kategori ATAU badge, sebab kebanyakan produk viral
// ditanda melalui badge (bukan kategori).
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

// ========== FORMAT HARGA ==========
function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === "") return "0.00";
  let clean = harga.toString().replace(/rm/gi, "").replace(/\s/g, "").replace(/,/g, ".");
  const num = parseFloat(clean);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

// Alt text lebih kukuh untuk SEO/accessibility — sertakan jenama + ID produk.
// Nota: hasil ni teks MENTAH — wrap dengan esc() di tempat ia disisip ke HTML.
function altGambarProduk(p) {
  const nama = (p && p.nama ? p.nama : "Produk").toString().trim();
  const id = p && p.id !== undefined && p.id !== null ? p.id : "";
  return `MastaXul_${id} - ${nama} | Masta Xul`;
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
