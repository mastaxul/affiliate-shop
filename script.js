const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTqHl_HhHs-1adzwb4klckZvKfDQDLV5_Kn1evEm3ZT9S2eIHuxg8VSg_361XJYcCFS47qrxrBm85RN7pIWpupLI237mudnOEw__h4MJQyg3RAh2lgFWCZKkbeGupZZfiqf6eOnl7wpB-hpOgaaO1C256co6YPlh1RjtmuEvvAiw2BmKrnlgOE5qMSdnT4rjM3AOl1pADkQRPBGzZ7LLjmNhn7lfTZaqf-fjJ7gvDGY-jjkCN4rFJPYwQRajjxUPVGFwMHjtZzndfyz5DhWZWuNPkYCLA&lib=MLqwvRUxxDrPXMN_fa_cBjjv3k8czDl4_";

let semuaProduk = [];

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    semuaProduk = data;
    paparProduk("Semua");
  })
  .catch(error => {
    console.error("Ralat:", error);
    document.getElementById("produk").innerHTML =
      "<p>❌ Gagal memuatkan produk.</p>";
  });

function pilihKategori(kategori) {
  paparProduk(kategori);
}

function paparProduk(kategori) {

  let html = "";

  semuaProduk.forEach(item => {

    if (kategori === "Semua" || item.kategori === kategori) {

      html += `
      <div class="produk">

        <img src="${item.gambar}" alt="${item.nama}">

        <h2>${item.nama}</h2>

        <h3>${item.harga}</h3>

        <a href="${item.tiktok}" target="_blank">
          <button>TikTok</button>
        </a>

        <a href="${item.shopee}" target="_blank">
          <button>Shopee</button>
        </a>

        <a href="${item.lazada}" target="_blank">
          <button>Lazada</button>
        </a>

      </div>
      `;
    }

  });

  document.getElementById("produk").innerHTML = html;

}
