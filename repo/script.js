// --- 1. SIMULASI LOADING SCREEN (0% -> 100%) ---
const loaderOverlay = document.getElementById('loader-overlay');
const loadingPercent = document.getElementById('loading-percent');
const progressBar = document.getElementById('progress-bar');
const mainContent = document.getElementById('main-content');

let progress = 0;
const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 6) + 2;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      loaderOverlay.style.opacity = '0';
      loaderOverlay.style.visibility = 'hidden';
      mainContent.classList.add('visible');
      kemaskiniKedudukanAlien(); // Inisialisasi kedudukan alien pointer selepas load
    }, 400);
  }
  loadingPercent.innerText = progress + '%';
  progressBar.style.width = progress + '%';
}, 50);

// --- 2. CANVAS GALAKSI & ANIMASI KILAT (LIGHTNING EFFECT) ---
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initStars();
  kemaskiniKedudukanAlien();
});

// Bintang Galaksi
const stars = [];
class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.2 + 0.3;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.color = ['#38bdf8', '#818cf8', '#ffffff', '#c084fc'][Math.floor(Math.random() * 4)];
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
  for (let i = 0; i < 500; i++) stars.push(new Star());
}

// Logik Penjanaan Kilatan (Lightning Bolt)
class Lightning {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.segments = [];
    this.life = 1.0;
    this.generateSegments();
  }

  generateSegments() {
    let x = this.startX;
    let y = this.startY;
    this.segments.push({ x, y });

    const steps = 25;
    const dx = (this.endX - this.startX) / steps;
    const dy = (this.endY - this.startY) / steps;

    for (let i = 0; i < steps; i++) {
      x += dx + (Math.random() - 0.5) * 35;
      y += dy + (Math.random() - 0.5) * 20;
      this.segments.push({ x, y });
    }
    this.segments.push({ x: this.endX, y: this.endY });
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

    ctx.strokeStyle = `rgba(186, 230, 253, ${this.life})`;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 25;
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

let currentLightning = null;

function triggerLightning() {
  const startX = width * 0.5 + (Math.random() - 0.5) * 200;
  const startY = 0;
  const endX = width * 0.5 + (Math.random() - 0.5) * 300;
  const endY = height;

  currentLightning = new Lightning(startX, startY, endX, endY);
}

setInterval(() => {
  if (Math.random() < 0.7) {
    triggerLightning();
  }
}, 1500);

triggerLightning();

function animate() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => star.draw());

  if (currentLightning) {
    currentLightning.draw();
    currentLightning.update();
    if (currentLightning.life <= 0) currentLightning = null;
  }

  requestAnimationFrame(animate);
}

initStars();
animate();

// --- 3. 👾 LOGIK ALIEN MENU POINTER (NAVIGASI AKTIF SAAT SCROLL) ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');
const alienPointer = document.getElementById('alienPointer');
const alienSpeech = document.getElementById('alienSpeech');
const mainNavbar = document.getElementById('mainNavbar');

function kemaskiniKedudukanAlien() {
  const activeLink = document.querySelector('.nav-item.active');
  if (activeLink && alienPointer && mainNavbar) {
    const navRect = mainNavbar.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Kira offset posisi X supaya alien sentiasa terbang di atas menu pilihan
    const offsetLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (alienPointer.offsetWidth / 2);
    alienPointer.style.transform = `translateX(${offsetLeft}px)`;
    
    // Kemaskini teks pada belon ucapan alien
    if (alienSpeech) {
      alienSpeech.textContent = activeLink.textContent;
    }
  }
}

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  if (currentSection) {
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === currentSection) {
        item.classList.add('active');
      }
    });
    kemaskiniKedudukanAlien();
  }
});

// --- 4. LOGIK BORANG HUBUNGI & GOOGLE APPS SCRIPT ---
const API_URL = "https://script.google.com/macros/s/AKfycbxsWSCyKSOiEx-Syg1dGuNT21U0Qqv_4GPBiFhJgvU-t014SXvbOwKAWL4TZiQk8NJE/exec";

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
  if (captchaSoalan) {
    captchaSoalan.textContent = captchaA + " + " + captchaB + " = ?";
  }
  if (captchaJawapan) {
    captchaJawapan.value = "";
  }
}

if (btnRefreshCaptcha) {
  btnRefreshCaptcha.addEventListener("click", buatCaptcha);
}

buatCaptcha();

if (formHubungi) {
  formHubungi.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgContainer.className = "msg";
    msgContainer.textContent = "";

    const honeypotVal = document.getElementById("website").value.trim();
    if (honeypotVal !== "") {
      msgContainer.className = "msg ok";
      msgContainer.textContent = "Mesej berjaya dihantar. Terima kasih!";
      formHubungi.reset();
      buatCaptcha();
      return;
    }

    const jawapanUser = parseInt(captchaJawapan.value, 10);
    if (jawapanUser !== captchaA + captchaB) {
      msgContainer.className = "msg err";
      msgContainer.textContent = "Jawapan CAPTCHA salah. Sila cuba lagi.";
      buatCaptcha();
      return;
    }

    btnHantar.disabled = true;
    btnHantar.textContent = "Menghantar...";

    const payload = {
      nama: document.getElementById("nama").value.trim(),
      emel: document.getElementById("emel").value.trim(),
      telefon: document.getElementById("telefon").value.trim(),
      mesej: document.getElementById("mesej").value.trim(),
      captchaOk: true
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.ok) {
        msgContainer.className = "msg ok";
        msgContainer.textContent = data.message || "Mesej berjaya dihantar. Terima kasih!";
        formHubungi.reset();
        buatCaptcha();
      } else {
        msgContainer.className = "msg err";
        msgContainer.textContent = data.message || "Gagal menghantar mesej. Sila cuba lagi.";
        buatCaptcha();
      }
    } catch (err) {
      msgContainer.className = "msg ok";
      msgContainer.textContent = "Mesej dihantar. Saya akan maklum balas secepat mungkin.";
      formHubungi.reset();
      buatCaptcha();
    }

    btnHantar.disabled = false;
    btnHantar.textContent = "Hantar Mesej";
  });
}

// --- 5. LOGIK MUZIK PLAYER (AUTOPLAY & FALLBACK) ---
const bgMusic = document.getElementById('bgMusic');
const btnMusicToggle = document.getElementById('btnMusicToggle');
const musicIcon = document.getElementById('musicIcon');

if (bgMusic && btnMusicToggle) {
  bgMusic.volume = 0.3;

  function kemaskiniUIMuzik(isPlaying) {
    if (isPlaying) {
      btnMusicToggle.classList.add('playing');
      musicIcon.className = 'fas fa-pause';
    } else {
      btnMusicToggle.classList.remove('playing');
      musicIcon.className = 'fas fa-music';
    }
  }

  function mulaMuzikAtasInteraksi() {
    bgMusic.play().then(() => {
      kemaskiniUIMuzik(true);
      bersihkanListener();
    }).catch(() => {});
  }

  function bersihkanListener() {
    window.removeEventListener('click', mulaMuzikAtasInteraksi);
    window.removeEventListener('touchstart', mulaMuzikAtasInteraksi);
    window.removeEventListener('scroll', mulaMuzikAtasInteraksi);
    window.removeEventListener('keydown', mulaMuzikAtasInteraksi);
  }

  bgMusic.play().then(() => {
    kemaskiniUIMuzik(true);
  }).catch(() => {
    kemaskiniUIMuzik(false);
    window.addEventListener('click', mulaMuzikAtasInteraksi);
    window.addEventListener('touchstart', mulaMuzikAtasInteraksi);
    window.addEventListener('scroll', mulaMuzikAtasInteraksi, { once: true });
    window.addEventListener('keydown', mulaMuzikAtasInteraksi);
  });

  btnMusicToggle.addEventListener('click', (e) => {
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
