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
