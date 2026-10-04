/**
 * Moving Galaxy Animation using HTML5 Canvas
 */
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initStars();
});

// Tetapan Galaksi
const stars = [];
const numStars = 800;
const galaxyCenterX = () => width / 2;
const galaxyCenterY = () => height / 2;

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    // Sudut rawak dan jarak dari pusat galaksi
    this.angle = Math.random() * Math.PI * 2;
    this.distance = Math.random() * (Math.max(width, height) * 0.6);
    this.speed = (0.0005 + Math.random() * 0.001) * (1 - this.distance / (Math.max(width, height) * 0.7));
    this.radius = Math.random() * 1.5 + 0.3;
    
    // Warna galaksi (Cyan, Purple, Pink, White)
    const colors = [
      '#00f2fe', '#4facfe', '#9b51e0', '#ff007f', '#ffffff', '#a18cd1'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.8 + 0.2;
  }

  update() {
    // Rotasi mengelilingi pusat
    this.angle += this.speed;
  }

  draw() {
    // Kira posisi berputar (spiral galaxy effect)
    const x = galaxyCenterX() + Math.cos(this.angle) * this.distance;
    const y = galaxyCenterY() + Math.sin(this.angle) * (this.distance * 0.5); // 3D tilt

    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = this.radius > 1 ? 8 : 0;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset
  }
}

function initStars() {
  stars.length = 0;
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}

// Melukis Cahaya Nebula Pusat Galaksi
function drawNebula() {
  const cx = galaxyCenterX();
  const cy = galaxyCenterY();

  const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.4);
  gradient.addColorStop(0, 'rgba(155, 81, 224, 0.25)');
  gradient.addColorStop(0.4, 'rgba(0, 242, 254, 0.12)');
  gradient.addColorStop(0.8, 'rgba(10, 14, 30, 0.05)');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// Loop Animasi 60FPS
function animate() {
  ctx.clearRect(0, 0, width, height);
  
  // Nebula Latar
  drawNebula();

  // Bintang Galaksi
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

// Jalankan
initStars();
animate();
