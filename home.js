/* Masta Xul — home.js | Galaxy bergerak */

(function () {
  function setupNav() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".nav-pill a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const clean = href.replace(/\/$/, "") || "/";
      if (clean === path || (path === "" && clean === "/")) {
        a.classList.add("active");
      } else if (href !== "/") {
        a.classList.remove("active");
      }
    });
  }

  function setupFade() {
    const cards = document.querySelectorAll(".feature-card, .cta");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });
  }

  function setupGalaxy() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.getElementById("galaxy");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, stars = [], planets = [], raf = 0, last = 0;

    const STAR_COUNT = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 12000) + 60);

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const layer = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: layer > 0.85 ? 1.6 + Math.random() * 1.2 : 0.4 + Math.random() * 1.1,
          speed: 0.08 + (1 - layer) * 0.35,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          alpha: 0.3 + Math.random() * 0.7,
          color: layer > 0.9 ? "200,220,255" : layer > 0.7 ? "180,200,255" : "255,255,255"
        });
      }
    }

    function makePlanets() {
      const m = Math.min(w, h);
      planets = [
        { x: w * 0.15, y: h * 0.25, r: m * 0.22, vx: 0.03, vy: 0.015, color: "40,80,160" },
        { x: w * 0.75, y: h * 0.7, r: m * 0.28, vx: -0.02, vy: -0.012, color: "90,50,40" },
        { x: w * 0.55, y: h * 0.2, r: m * 0.12, vx: 0.015, vy: 0.025, color: "50,40,100" }
      ];
    }

    function draw(t) {
      const dt = Math.min(32, t - last || 16);
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const p of planets) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, "rgba(" + p.color + ",0.22)");
        g.addColorStop(0.45, "rgba(" + p.color + ",0.08)");
        g.addColorStop(1, "rgba(" + p.color + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of stars) {
        s.y += s.speed * (dt / 16);
        if (s.y > h + 4) {
          s.y = -4;
          s.x = Math.random() * w;
        }
        s.twinkle += s.twinkleSpeed * (dt / 16);
        const a = s.alpha * (0.55 + 0.45 * Math.sin(s.twinkle));

        ctx.beginPath();
        ctx.fillStyle = "rgba(" + s.color + "," + a + ")";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.4) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + s.color + "," + a * 0.25 + ")";
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      makeStars();
      makePlanets();
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });

    start();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNav();
    setupFade();
    setupGalaxy();
  });
})();
