// ===============================
// MASTA XUL AFFILIATE SHOP
// ===============================

// GANTIKAN URL INI DENGAN URL APPS SCRIPT NANTI
const API_URL = "";

// Semua produk
let semuaProduk = [];

// ===============================
// LOAD WEBSITE
// ===============================

window.onload = function () {

    if(API_URL===""){

        demoProduk();

    }else{

        loadProduk();

    }

};

// ===============================
// DATA DEMO
// ===============================

function demoProduk(){

semuaProduk=[

{

nama:"Power Bank 20000mAh",

harga:"RM59",

kategori:"Gadget",

gambar:"https://picsum.photos/400?1",

link:"#"

},

{

nama:"Vitamin C",

harga:"RM35",

kategori:"Kesihatan",

gambar:"https://picsum.photos/400?2",

link:"#"

},

{

nama:"Rak Dapur",

harga:"RM48",

kategori:"Rumah",

gambar:"https://picsum.photos/400?3",

link:"#"

},

{

nama:"Mini Fan",

harga:"RM22",

kategori:"Viral",

gambar:"https://picsum.photos/400?4",

link:"#"

},

{

nama:"Bluetooth Speaker",

harga:"RM79",

kategori:"Gadget",

gambar:"https://picsum.photos/400?5",

link:"#"

}

];

paparProduk(semuaProduk);

}

// ===============================
// LOAD API
// ===============================

function loadProduk(){

fetch(API_URL)

.then(res=>res.json())

.then(data=>{

semuaProduk=data;

paparProduk(semuaProduk);

})

.catch(()=>{

demoProduk();

});

}

// ===============================
// PAPAR PRODUK
// ===============================

function paparProduk(data){

const container=document.getElementById("produk-list");

container.innerHTML="";

document.getElementById("jumlahProduk").innerHTML=

"Jumlah Produk : "+data.length;

if(data.length===0){

container.innerHTML=`

<h2 style="text-align:center;width:100%;">

Tiada Produk Dijumpai

</h2>

`;

return;

}

data.forEach(item=>{

container.innerHTML+=`

<div class="card">

<img src="${item.gambar}" alt="">

<div class="card-body">

<h3>${item.nama}</h3>

<div class="harga">

${item.harga}

</div>

<div class="kategori">

${item.kategori}

</div>

<a

href="${item.link}"

target="_blank">

🛒 Beli Sekarang

</a>

</div>

</div>

`;

});

}

// ===============================
// SEARCH
// ===============================

function cariProduk(){

const keyword=document
.getElementById("search")
.value
.toLowerCase();

const hasil=semuaProduk.filter(item=>

item.nama
.toLowerCase()
.includes(keyword)

);

paparProduk(hasil);

}

// ===============================
// FILTER
// ===============================

function filterProduk(kategori){

document
.querySelectorAll(".menu button")
.forEach(btn=>btn.classList.remove("active"));

event.target.classList.add("active");

if(kategori==="Semua"){

paparProduk(semuaProduk);

return;

}

const hasil=semuaProduk.filter(item=>

item.kategori===kategori

);

paparProduk(hasil);

}
