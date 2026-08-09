const POST_API = "https://script.google.com/macros/s/AKfycbz2JwBHAzKOsVqXmJb98XUJc1lHWjo2Adse7JlIxI-7VDicu_jlZFr7fZcMvcIvZBCsdg/exec";

// Ambil data engagement dari localStorage
function getEngagement(id) {
  const data = JSON.parse(localStorage.getItem("post_eng") || "{}");
  return data[id] || { like: 0, repost: 0, komen: 0, liked: false, reposted: false, commented: false };
}

function saveEngagement(id, eng) {
  const data = JSON.parse(localStorage.getItem("post_eng") || "{}");
  data[id] = eng;
  localStorage.setItem("post_eng", JSON.stringify(data));
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num;
}

async function muatPost() {
  const feed = document.getElementById("postFeed");

  try {
    const res = await fetch(POST_API + "?t=" + Date.now());
    const data = await res.json();

    if (!data || data.length === 0) {
      feed.innerHTML = `<div class="empty-post">Tiada post lagi.</div>`;
      return;
    }

    feed.innerHTML = data.map(p => {
      const eng = getEngagement(p.id);
      const totalLike = (parseInt(p.like) || 0) + eng.like;
      const totalRepost = (parseInt(p.repost) || 0) + eng.repost;
      const totalKomen = (parseInt(p.komen) || 0) + eng.komen;

      // Media
      let mediaHTML = "";
      if (p.jenis === "video" && p.media) {
        mediaHTML = `
          <video class="post-media" controls playsinline preload="metadata">
            <source src="${p.media}" type="video/mp4">
            Browser anda tidak sokong video.
          </video>`;
      } else if (p.media) {
        mediaHTML = `<img src="${p.media}" alt="${p.tajuk}" class="post-media" loading="lazy"
          onerror="this.src='https://via.placeholder.com/500x300/f5f5f5/6B4423?text=Tiada+Media'">`;
      }

      // Butang platform
      let buttons = "";
      if (p.tiktok) buttons += `<a href="${p.tiktok}" class="btn-tiktok" target="_blank" rel="noopener">Beli di TikTok</a>`;
      if (p.shopee) buttons += `<a href="${p.shopee}" class="btn-shopee" target="_blank" rel="noopener">Beli di Shopee</a>`;
      if (p.lazada) buttons += `<a href="${p.lazada}" class="btn-lazada" target="_blank" rel="noopener">Beli di Lazada</a>`;

      return `
        <div class="post-card" data-id="${p.id}">
          <div class="post-header">
            <img src="https://i.ibb.co/SwpWGqrs/IMG-0606.png" alt="Logo">
            <div class="info">
              <div class="name">Masta Xul Affiliate Shop</div>
              <div class="time">Post</div>
            </div>
          </div>

          ${mediaHTML}

          <div class="post-body">
            <div class="post-tajuk">${p.tajuk || ""}</div>
            <div class="post-caption">${p.caption || ""}</div>

            <div class="post-engagement">
              <button class="eng-btn ${eng.liked ? "active" : ""}" onclick="toggleEng(this, '${p.id}', 'like')">
                ❤️ <span>${formatNumber(totalLike)}</span>
              </button>
              <button class="eng-btn ${eng.reposted ? "active" : ""}" onclick="toggleEng(this, '${p.id}', 'repost')">
                🔁 <span>${formatNumber(totalRepost)}</span>
              </button>
              <button class="eng-btn ${eng.commented ? "active" : ""}" onclick="toggleEng(this, '${p.id}', 'komen')">
                💬 <span>${formatNumber(totalKomen)}</span>
              </button>
            </div>

            ${buttons ? `<div class="post-buttons">${buttons}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    feed.innerHTML = `<div class="empty-post">Gagal memuatkan post. Sila cuba lagi.</div>`;
  }
}

function toggleEng(btn, id, type) {
  const eng = getEngagement(id);
  const span = btn.querySelector("span");
  let current = parseInt(span.textContent.replace("K", "000")) || 0;

  if (type === "like") {
    if (eng.liked) {
      eng.like = Math.max(0, eng.like - 1);
      eng.liked = false;
      btn.classList.remove("active");
    } else {
      eng.like += 1;
      eng.liked = true;
      btn.classList.add("active");
    }
  }

  if (type === "repost") {
    if (eng.reposted) {
      eng.repost = Math.max(0, eng.repost - 1);
      eng.reposted = false;
      btn.classList.remove("active");
    } else {
      eng.repost += 1;
      eng.reposted = true;
      btn.classList.add("active");
    }
  }

  if (type === "komen") {
    if (eng.commented) {
      eng.komen = Math.max(0, eng.komen - 1);
      eng.commented = false;
      btn.classList.remove("active");
    } else {
      eng.komen += 1;
      eng.commented = true;
      btn.classList.add("active");
    }
  }

  saveEngagement(id, eng);

  // Update nombor paparan
  const base = {
    like: 0,
    repost: 0,
    komen: 0
  };

  // Kita kira semula dari data asal + local
  // Untuk ringkas, kita terus update dari current + perubahan
  const newVal = type === "like" ? (parseInt(btn.closest(".post-card").dataset.baseLike || 0) + eng.like) :
                 type === "repost" ? (parseInt(btn.closest(".post-card").dataset.baseRepost || 0) + eng.repost) :
                 (parseInt(btn.closest(".post-card").dataset.baseKomen || 0) + eng.komen);

  // Cara lebih mudah: baca semula dari local + original
  location.reload(); // paling stabil untuk sekarang
}

// Versi lebih baik tanpa reload
function toggleEng(btn, id, type) {
  let eng = getEngagement(id);
  const span = btn.querySelector("span");

  // Dapatkan nombor semasa dari teks
  let currentText = span.textContent;
  let currentNum = currentText.includes("K") 
    ? parseFloat(currentText) * 1000 
    : parseInt(currentText) || 0;

  if (type === "like") {
    if (eng.liked) {
      eng.like = Math.max(0, eng.like - 1);
      eng.liked = false;
      btn.classList.remove("active");
      currentNum = Math.max(0, currentNum - 1);
    } else {
      eng.like += 1;
      eng.liked = true;
      btn.classList.add("active");
      currentNum += 1;
    }
  }

  if (type === "repost") {
    if (eng.reposted) {
      eng.repost = Math.max(0, eng.repost - 1);
      eng.reposted = false;
      btn.classList.remove("active");
      currentNum = Math.max(0, currentNum - 1);
    } else {
      eng.repost += 1;
      eng.reposted = true;
      btn.classList.add("active");
      currentNum += 1;
    }
  }

  if (type === "komen") {
    if (eng.commented) {
      eng.komen = Math.max(0, eng.komen - 1);
      eng.commented = false;
      btn.classList.remove("active");
      currentNum = Math.max(0, currentNum - 1);
    } else {
      eng.komen += 1;
      eng.commented = true;
      btn.classList.add("active");
      currentNum += 1;
    }
  }

  saveEngagement(id, eng);
  span.textContent = formatNumber(currentNum);
}

document.addEventListener("DOMContentLoaded", muatPost);
