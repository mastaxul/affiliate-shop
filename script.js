const API_URL = "https://script.google.com/macros/s/AKfycbw4nklBXEOUJM0grVQW_Ud9Z9RJnkA7yw8zBz8GvAPRhDh_mPCaX5cJ0LwXm8MRkwjm/exec";

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
