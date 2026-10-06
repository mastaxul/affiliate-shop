// =========================================================
// MASTA XUL PORTAL — script.js (upgrade)
// =========================================================

// ----- 1. LOADING SCREEN -----
const loaderOverlay = document.getElementById("loader-overlay");
const loadingPercent = document.getElementById("loading-percent");
const progressBar = document.getElementById("progress-bar");
const mainContent = document.getElementById("main-content");

let progress = 0;

if (loaderOverlay) {
  setTimeout(() => {
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 6) + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loaderOverlay.style.opacity = "0";
          loaderOverlay.style.visibility = "hidden";
          if (mainContent) mainContent.classList.add("visible");
          kemaskiniKedudukanAlien();
        }, 500);
      }
      if (loadingPercent) loadingPercent.innerText = progress + "%";
      if (progressBar) progressBar.style.width = progress + "%";
    }, 45);
  }, 1800);
}

// ----- 2. CANVAS GALAKSI & KILAT -----
const canvas = document.getElementById("galaxyCanvas");
const preferReduced =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !preferReduced) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const STAR_COUNT = Math.min(
    180,
    Math.floor((window.innerWidth * window.innerHeight) / 14000) + 80
  );

  const stars = [];
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.2 + 0.3;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.color = ["#38bdf8", "#818cf8", "#ffffff", "#c084fc"][
        Math.floor(Math.random() * 4)
      ];
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  }

  class Lightning {
    constructor(startX, startY, endX, endY) {
      this.segments = [];
      this.life = 1.0;
      let x = startX;
      let y = startY;
      this.segments.push({ x, y });
      const steps = 25;
      const dx = (endX - startX) / steps;
      const dy = (endY - startY) / steps;
      for (let i = 0; i < steps; i++) {
        x += dx + (Math.random() - 0.5) * 35;
        y += dy + (Math.random() - 0.5) * 20;
        this.segments.push({ x, y });
      }
      this.segments.push({ x: endX, y: endY });
    }
    update() {
      this.life -= 0.08;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);
      for (let i = 1; i < this.segments.length; i++) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }
      ctx.strokeStyle = "rgba(186, 230, 253," + this.life + ")";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255," + this.life + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  let currentLightning = null;
  let lightningTimer = null;

  function triggerLightning() {
    const startX = width * 0.5 + (Math.random() - 0.5) * 200;
    const endX = width * 0.5 + (Math.random() - 0.5) * 300;
    currentLightning = new Lightning(startX, 0, endX, height);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    stars.forEach((s) => s.draw());
    if (currentLightning) {
      currentLightning.draw();
      currentLightning.update();
      if (currentLightning.life <= 0) currentLightning = null;
    }
    requestAnimationFrame(animate);
  }

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
    kemaskiniKedudukanAlien();
  }

  window.addEventListener("resize", onResize);
  initStars();
  animate();

  lightningTimer = setInterval(() => {
    if (document.hidden) return;
    if (Math.random() < 0.55) triggerLightning();
  }, 2000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && lightningTimer) {
      clearInterval(lightningTimer);
      lightningTimer = null;
    } else if (!document.hidden && !lightningTimer) {
      lightningTimer = setInterval(() => {
        if (Math.random() < 0.55) triggerLightning();
      }, 2000);
    }
  });
}

// ----- 3. ALIEN POINTER + NAV -----
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll("section");
const alienPointer = document.getElementById("alienPointer");
const alienSpeech = document.getElementById("alienSpeech");
const navLinksList = document.getElementById("navLinksList");

function kemaskiniKedudukanAlien() {
  const activeLink = document.querySelector(".nav-item.active");
  if (!activeLink || !alienPointer || !navLinksList) return;

  const parentRect = navLinksList.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const offsetLeft =
    linkRect.left - parentRect.left + linkRect.width / 2 - alienPointer.offsetWidth / 2;

  alienPointer.style.transform = "translateX(" + offsetLeft + "px)";
  if (alienSpeech) {
    alienSpeech.textContent = (activeLink.textContent || "").trim() || "Menu";
  }
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navItems.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("data-section") === id) {
            item.classList.add("active");
          }
        });
        kemaskiniKedudukanAlien();
      });
    },
    { root: null, rootMargin: "-30% 0px -40% 0px", threshold: 0 }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));
} else {
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
        current = section.id;
      }
    });
    if (!current) return;
    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-section") === current) item.classList.add("active");
    });
    kemaskiniKedudukanAlien();
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", function () {
    // Jangan set active untuk pautan luar (Shop)
    if (this.getAttribute("data-section")) {
      navItems.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
      kemaskiniKedudukanAlien();
    }
  });
});

// ----- 4. BORANG + CAPTCHA -----
const API_URL =
  "https://script.google.com/macros/s/AKfycbxsWSCyKSOiEx-Syg1dGuNT21U0Qqv_4GPBiFhJgvU-t014SXvbOwKAWL4TZiQk8NJE/exec";

const formHubungi = document.getElementById("formHubungi");
const btnHantar = document.getElementById("btnHantar");
const msgContainer = document.getElementById("msg");
const captchaSoalan = document.getElementById("captchaSoalan");
const captchaJawapan = document.getElementById("captchaJawapan");
const btnRefreshCaptcha = document.getElementById("btnRefreshCaptcha");

let captchaA = 0;
let captchaB = 0;

function buatCaptcha() {
  captchaA = Math.floor(Math.random() * 8) + 2;
  captchaB = Math.floor(Math.random() * 8) + 2;
  if (captchaSoalan) captchaSoalan.textContent = captchaA + " + " + captchaB + " = ?";
  if (captchaJawapan) captchaJawapan.value = "";
}

if (btnRefreshCaptcha) btnRefreshCaptcha.addEventListener("click", buatCaptcha);
buatCaptcha();

if (formHubungi) {
  formHubungi.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgContainer) {
      msgContainer.className = "msg";
      msgContainer.textContent = "";
    }

    const hp = document.getElementById("website");
    if (hp && hp.value.trim() !== "") {
      if (msgContainer) {
        msgContainer.className = "msg ok";
        msgContainer.textContent = "Mesej berjaya dihantar. Terima kasih!";
      }
      formHubungi.reset();
      buatCaptcha();
      return;
    }

    const jawapanUser = parseInt(captchaJawapan ? captchaJawapan.value : "", 10);
    if (jawapanUser !== captchaA + captchaB) {
      if (msgContainer) {
        msgContainer.className = "msg err";
        msgContainer.textContent = "Jawapan CAPTCHA salah. Sila cuba lagi.";
      }
      buatCaptcha();
      return;
    }

    if (btnHantar) {
      btnHantar.disabled = true;
      btnHantar.textContent = "Menghantar...";
    }

    const payload = {
      nama: (document.getElementById("nama") || {}).value?.trim() || "",
      emel: (document.getElementById("emel") || {}).value?.trim() || "",
      telefon: (document.getElementById("telefon") || {}).value?.trim() || "",
      mesej: (document.getElementById("mesej") || {}).value?.trim() || "",
      captchaOk: true
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        // Apps Script kadang redirect / body kosong — anggap berjaya jika status ok
        data = { ok: res.ok || res.type === "opaque" };
      }

      if (data && data.ok !== false) {
        if (msgContainer) {
          msgContainer.className = "msg ok";
          msgContainer.textContent = data.message || "Mesej berjaya dihantar!";
        }
        formHubungi.reset();
        buatCaptcha();
      } else {
        if (msgContainer) {
          msgContainer.className = "msg err";
          msgContainer.textContent = (data && data.message) || "Gagal menghantar mesej.";
        }
        buatCaptcha();
      }
    } catch (err) {
      if (msgContainer) {
        msgContainer.className = "msg err";
        msgContainer.textContent =
          "Gagal berhubung dengan pelayan. Sila cuba lagi atau e-mel terus.";
      }
      buatCaptcha();
    }

    if (btnHantar) {
      btnHantar.disabled = false;
      btnHantar.textContent = "Hantar Mesej";
    }
  });
}

// ----- 5. MUZIK -----
const bgMusic = document.getElementById("bgMusic");
const btnMusicToggle = document.getElementById("btnMusicToggle");
const musicIcon = document.getElementById("musicIcon");

if (bgMusic && btnMusicToggle) {
  bgMusic.volume = 0.3;

  function kemaskiniUIMuzik(isPlaying) {
    if (isPlaying) {
      btnMusicToggle.classList.add("playing");
      if (musicIcon) musicIcon.className = "fas fa-pause";
    } else {
      btnMusicToggle.classList.remove("playing");
      if (musicIcon) musicIcon.className = "fas fa-music";
    }
  }

  function bersihkanListener() {
    window.removeEventListener("click", mulaMuzikAtasInteraksi);
    window.removeEventListener("touchstart", mulaMuzikAtasInteraksi);
    window.removeEventListener("scroll", mulaMuzikAtasInteraksi);
  }

  function mulaMuzikAtasInteraksi() {
    bgMusic
      .play()
      .then(() => {
        kemaskiniUIMuzik(true);
        bersihkanListener();
      })
      .catch(() => {});
  }

  bgMusic
    .play()
    .then(() => kemaskiniUIMuzik(true))
    .catch(() => {
      kemaskiniUIMuzik(false);
      window.addEventListener("click", mulaMuzikAtasInteraksi);
      window.addEventListener("touchstart", mulaMuzikAtasInteraksi);
      window.addEventListener("scroll", mulaMuzikAtasInteraksi, { once: true });
    });

  btnMusicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    bersihkanListener();
    if (bgMusic.paused) {
      bgMusic.play();
      kemaskiniUIMuzik(true);
    } else {
      bgMusic.pause();
      kemaskiniUIMuzik(false);
    }
  });
}
