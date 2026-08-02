const API_URL = "https://script.google.com/macros/s/AKfycbw4nklBXEOUJM0grVQW_Ud9Z9RJnkA7yw8zBz8GvAPRhDh_mPCaX5cJ0LwXm8MRkwjm/exec";

let semuaProduk = [];

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    semuaProduk = data;
    paparProduk("Semua");
  })
  .catch(error => {
    console.error(error);
    document.getElementById("produk").innerHTML =
      "<p>❌ Gagal memuatkan produk.</p>";
  });

function pilihKategori(kategori) {
  paparProduk(kategori);
}

function paparProduk(kategori) {

  let html = "";

  semuaProduk.forEach(item => {

    if (kategori === "Semua" || item.Kategeri === kategori) {

      html += `
      <div class="produk">

        <img src="${item.Gambar}" alt="${item.Nama}">

        <h2>${item.Nama}</h2>

        <p><strong>${item.Badge}</strong></p>

        <p>🛒 ${item.Terjual}</p>

        <h3>${item.Harga}</h3>

        <a href="${item.Tiktok}" target="_blank">
          <button>TikTok</button>
        </a>

        <a href="${item.Shopee}" target="_blank">
          <button>Shopee</button>
        </a>

        <a href="${item.Lazada}" target="_blank">
          <button>Lazada</button>
        </a>

      </div>
      `;

    }

  });

  document.getElementById("produk").innerHTML = html;

}
