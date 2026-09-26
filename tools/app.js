(function () {
  "use strict";

  const TOOLS = [
    { id: "resit", emoji: "🧾", name: "Resit Generator" },
    { id: "invoice", emoji: "📑", name: "Invoice Generator" },
    { id: "minit", emoji: "📝", name: "Minit Mesyuarat" },
    { id: "surat", emoji: "📋", name: "Surat Rasmi" },
    { id: "kad", emoji: "🪪", name: "Kad Ahli Digital" },
    { id: "qr", emoji: "🔳", name: "QR Generator" },
    { id: "electrical", emoji: "⚡", name: "Electrical Calculator" },
    { id: "sawah", emoji: "🌾", name: "Smart Sawah" },
    { id: "affiliate", emoji: "💰", name: "Affiliate Tools" },
    { id: "ai", emoji: "🤖", name: "AI Tools" }
  ];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  let deferredPrompt = null;
  let toastTimer = null;
  let refreshing = false;

  function isStandalone() {
    const mq = window.matchMedia("(display-mode: standalone)").matches;
    const ios = "standalone" in navigator && navigator.standalone === true;
    return mq || ios;
  }

  function isIosSafari() {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua);
    return isIOS && (isSafari || isIOS);
  }

  function showToast(text, type) {
    const el = $("#toast");
    el.hidden = false;
    el.textContent = text;
    el.className = "toast" + (type ? " " + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2800);
  }

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("mx_favorites") || "[]");
    } catch {
      return [];
    }
  }

  function setFavorites(list) {
    localStorage.setItem("mx_favorites", JSON.stringify(list));
  }

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    let fav = getFavorites();
    if (fav.includes(id)) fav = fav.filter((x) => x !== id);
    else fav.push(id);
    setFavorites(fav);
    renderAll();
  }

  function openTool(id) {
    // Hook untuk fungsi sebenar kemudian
    showToast(TOOLS.find((t) => t.id === id)?.name + " — coming soon");
    // location.hash = "#tool/" + id;
  }

  function cardHTML(tool) {
    const fav = getFavorites().includes(tool.id);
    return `
      <button type="button" class="tool-card" data-tool="${tool.id}" aria-label="${tool.name}">
        <button type="button" class="fav-btn${fav ? " active" : ""}" data-fav="${tool.id}" aria-label="Favorite ${tool.name}">${fav ? "⭐" : "☆"}</button>
        <span class="tool-emoji" aria-hidden="true">${tool.emoji}</span>
        <span class="tool-name">${tool.name}</span>
      </button>
    `;
  }

  function renderGrid(el, list) {
    if (!el) return;
    el.innerHTML = list.map(cardHTML).join("");
  }

  function renderAll() {
    renderGrid($("#toolsGrid"), TOOLS);
    renderGrid($("#toolsGrid2"), TOOLS);
    const favIds = getFavorites();
    const favTools = TOOLS.filter((t) => favIds.includes(t.id));
    renderGrid($("#favGrid"), favTools);
    const empty = $("#favEmpty");
    if (empty) empty.hidden = favTools.length > 0;
  }

  function bindToolClicks(root) {
    root.addEventListener("click", (e) => {
      const favBtn = e.target.closest("[data-fav]");
      if (favBtn) {
        toggleFavorite(favBtn.getAttribute("data-fav"), e);
        return;
      }
      const card = e.target.closest("[data-tool]");
      if (card) openTool(card.getAttribute("data-tool"));
    });
  }

  function showPage(name) {
    $$(".page").forEach((p) => {
      const on = p.dataset.page === name;
      p.hidden = !on;
      p.classList.toggle("active", on);
    });
    $$(".nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.nav === name);
    });
  }

  function setupNav() {
    $$(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => showPage(btn.dataset.nav));
    });
  }

  function setupInstall() {
    const btn = $("#btnInstall");
    const badge = $("#appBadge");

    if (isStandalone()) {
      btn.hidden = true;
      badge.hidden = false;
      return;
    }

    badge.hidden = true;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      btn.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      btn.hidden = true;
      badge.hidden = false;
      showToast("✓ MastaXul dipasang");
    });

    // iOS / browser tanpa beforeinstallprompt: tunjuk butang juga
    if (isIosSafari()) {
      btn.hidden = false;
    }

    btn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (choice.outcome === "accepted") {
          btn.hidden = true;
        }
        return;
      }
      if (isIosSafari()) {
        openIosModal();
        return;
      }
      // Browser lain tanpa prompt
      showToast("Guna menu browser → Install / Add to Home Screen");
    });
  }

  function openIosModal() {
    const modal = $("#iosModal");
    modal.hidden = false;
    $("#btnIosOk").focus();
  }

  function closeIosModal() {
    $("#iosModal").hidden = true;
  }

  function setupIosModal() {
    $("#btnIosOk").addEventListener("click", closeIosModal);
    $("#iosModal").addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close-modal")) closeIosModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeIosModal();
    });
  }

  function setupOnlineStatus() {
    function update() {
      if (navigator.onLine) showToast("✓ Online", "online");
      else showToast("⚡ Offline Mode", "offline");
    }
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
  }

  function setupSettings() {
    const toggle = $("#toggleDark");
    const saved = localStorage.getItem("mx_theme");
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      toggle.checked = false;
    } else {
      document.documentElement.removeAttribute("data-theme");
      toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("mx_theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("mx_theme", "light");
      }
    });

    $("#btnClearFav").addEventListener("click", () => {
      setFavorites([]);
      renderAll();
      showToast("Favorites dikosongkan");
    });
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              $("#updateBanner").hidden = false;
            }
          });
        });
      })
      .catch((err) => console.warn("SW gagal:", err));

    $("#btnUpdate").addEventListener("click", () => {
      if (refreshing) return;
      refreshing = true;
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      window.location.reload();
    });
  }

  // Optional: respond to SKIP_WAITING in sw if extended later
  // For now reload on Update button is enough.

  function init() {
    renderAll();
    bindToolClicks(document);
    setupNav();
    setupInstall();
    setupIosModal();
    setupOnlineStatus();
    setupSettings();
    registerSW();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
