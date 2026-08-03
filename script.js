// ==========================================
// MASTA XUL AFFILIATE SHOP
// script.js Version 2.0
// BAHAGIAN 1
// ==========================================


// URL API GOOGLE SHEET
const API_URL = "https://script.google.com/macros/s/AKfycbyMG70IM6KD4cmzbNLPZX6mxB4es-qZHwe9NjTa6UV99XdIM6R1DnXgdQKqnA4zV-43Ew/exec";


let semuaProduk = [];


// ==========================================
// AMBIL DATA PRODUK DARI GOOGLE SHEET
// ==========================================

async function ambilProduk() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Gagal mengambil data");
        }


        const data = await response.json();


        semuaProduk = data;


        console.log("Produk berjaya dimuatkan:");
        console.log(semuaProduk);



        // Paparkan semua produk bila siap
        paparProduk(semuaProduk);


    } catch(error) {

        console.error("Ralat API:", error);

        document.getElementById("produk-container").innerHTML =
        `
        <p>
        Produk tidak dapat dimuatkan.
        Sila cuba lagi.
        </p>
        `;

    }

}



// ==========================================
// PAPAR PRODUK
// ==========================================

function paparProduk(senaraiProduk) {


    const container = document.getElementById("produk-container");


    container.innerHTML = "";


    senaraiProduk.forEach(produk => {


        const kad = document.createElement("div");


        kad.className = "produk-card";


        kad.innerHTML = `

        <img src="${produk.gambar}" 
        alt="${produk.nama}">


        <h3>
        ${produk.nama}
        </h3>


        <p>
        RM ${produk.harga}
        </p>


        <button onclick="bukaProduk('${produk.link}')">
        Beli Sekarang
        </button>


        `;


        container.appendChild(kad);


    });


}




// ==========================================
// BUKA LINK AFFILIATE
// ==========================================

function bukaProduk(link){

    window.open(link, "_blank");

}



// ==========================================
// FILTER KATEGORI
// ==========================================

function tapisKategori(kategori){


    if(kategori === "Semua"){

        paparProduk(semuaProduk);

        return;

    }


    const hasil = semuaProduk.filter(produk => 
        produk.kategori === kategori
    );


    paparProduk(hasil);


}



// ==========================================
// SEARCH PRODUK
// ==========================================

function cariProduk(){

    const input = document
    .getElementById("search")
    .value
    .toLowerCase();


    const hasil = semuaProduk.filter(produk =>

        produk.nama
        .toLowerCase()
        .includes(input)

    );


    paparProduk(hasil);

}



// Jalankan bila website dibuka

window.onload = function(){

    ambilProduk();

};

// ==========================================
// MASTA XUL AFFILIATE SHOP
// script.js Version 2.0
// BAHAGIAN 2
// ==========================================


// ==========================================
// LOADING PRODUK
// ==========================================

function loadingProduk(){

    const container = document.getElementById("produk-container");


    container.innerHTML = `

    <div class="loading">

        <p>
        ⏳ Sedang memuatkan produk...
        </p>

    </div>

    `;

}




// ==========================================
// PAPAR JIKA PRODUK KOSONG
// ==========================================

function produkKosong(){

    const container = document.getElementById("produk-container");


    container.innerHTML = `

    <div class="kosong">

        <h3>
        Tiada produk ditemui
        </h3>

        <p>
        Cuba kategori atau carian lain.
        </p>

    </div>

    `;

}





// ==========================================
// UPDATE FUNGSI PAPAR PRODUK
// ==========================================

const paparProdukAsal = paparProduk;


paparProduk = function(senaraiProduk){


    if(!senaraiProduk || senaraiProduk.length === 0){

        produkKosong();

        return;

    }


    paparProdukAsal(senaraiProduk);


};





// ==========================================
// LINK AFFILIATE SELAMAT
// ==========================================

function bukaProduk(link){


    if(!link){

        alert("Link produk tiada.");

        return;

    }



    let url;


    try {

        url = new URL(link);


    } catch(error){

        alert("Link tidak sah.");

        return;

    }




    window.open(

        url.href,

        "_blank",

        "noopener,noreferrer"

    );


}







// ==========================================
// FILTER PLATFORM
// ==========================================

function tapisPlatform(platform){


    const hasil = semuaProduk.filter(produk =>

        produk.platform === platform

    );


    paparProduk(hasil);


}






// ==========================================
// REFRESH PRODUK
// ==========================================

function refreshProduk(){

    loadingProduk();

    ambilProduk();

}







// ==========================================
// AUTO CHECK API
// ==========================================

async function checkAPI(){


    try {


        const response = await fetch(API_URL);


        if(response.ok){

            console.log(
            "✅ API Google Sheet Online"
            );

        }


    }

    catch(error){


        console.log(
        "❌ API gagal disambungkan"
        );


    }


}






// ==========================================
// START WEBSITE
// ==========================================


window.addEventListener(
"DOMContentLoaded",
()=>{


    loadingProduk();


    checkAPI();


});

// ==========================================
// MASTA XUL AFFILIATE SHOP
// script.js Version 2.0
// BAHAGIAN 3
// ==========================================


// ==========================================
// CACHE SYSTEM
// ==========================================

const CACHE_KEY = "masta_produk_cache";

const CACHE_TIME = 30 * 60 * 1000; 
// 30 minit




// ==========================================
// SIMPAN DATA PRODUK DALAM CACHE
// ==========================================

function simpanCache(data){


    const cacheData = {

        masa: Date.now(),

        produk: data

    };


    localStorage.setItem(

        CACHE_KEY,

        JSON.stringify(cacheData)

    );


}





// ==========================================
// AMBIL CACHE
// ==========================================

function ambilCache(){


    const data = localStorage.getItem(CACHE_KEY);



    if(!data){

        return null;

    }



    const cache = JSON.parse(data);



    const tamat =

    Date.now() - cache.masa;



    if(tamat > CACHE_TIME){


        localStorage.removeItem(CACHE_KEY);


        return null;


    }



    return cache.produk;


}






// ==========================================
// FETCH API DENGAN BACKUP CACHE
// ==========================================

async function ambilProdukSmart(){



    loadingProduk();



    const cache = ambilCache();



    if(cache){


        console.log(
        "⚡ Guna cache tempatan"
        );


        semuaProduk = cache;


        paparProduk(
        semuaProduk
        );


    }





    try {



        const response = await fetch(

            API_URL,

            {

            method:"GET",

            cache:"no-store"

            }

        );



        const data = await response.json();



        semuaProduk = data;



        simpanCache(data);



        console.log(
        "✅ Data terbaru berjaya"
        );



        paparProduk(
        semuaProduk
        );




    }



    catch(error){



        console.log(
        "⚠️ API gagal, guna cache lama"
        );



        if(!cache){


            produkKosong();


        }


    }



}






// ==========================================
// SECURITY LINK CHECK
// ==========================================

function semakLink(link){


    const domainSelamat = [

        "shopee",

        "lazada",

        "tiktok",

        "amazon",

        "affiliate"

    ];



    return domainSelamat.some(

        d => link.includes(d)

    );


}







// ==========================================
// UPDATE BUTANG PRODUK LEBIH SELAMAT
// ==========================================

function bukaProduk(link){



    if(!semakLink(link)){



        const teruskan = confirm(

        "Link luar dikesan. Teruskan?"

        );



        if(!teruskan){

            return;

        }


    }




    window.open(

        link,

        "_blank",

        "noopener,noreferrer"

    );


}






// ==========================================
// PRELOAD WEBSITE
// ==========================================

function preloadWebsite(){



    console.log(

    "🚀 Masta Xul Affiliate Shop Ready"

    );



    ambilProdukSmart();



}






// ==========================================
// START VERSION 2.0
// ==========================================


window.addEventListener(

"load",

()=>{


    preloadWebsite();


});
