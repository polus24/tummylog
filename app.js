(function () {
  "use strict";

  const CACHE_KEY = "tummylog:cache:v1";
  const API_URL = typeof TUMMYLOG_API_URL !== "undefined" ? TUMMYLOG_API_URL : null;
  const API_CONFIGURED = !!(API_URL && !API_URL.includes("YOUR-SUBDOMAIN"));

  // ---- Local fallback / instant-paint cache --------------------------------

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveCache(foods) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(foods));
    } catch (e) {
      // Non-fatal — just means no offline fallback next time.
    }
  }

  function seedFromBundledDefaults() {
    return (typeof DEFAULT_FOODS !== "undefined" ? DEFAULT_FOODS : []).map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      status: f.status,
      notes: f.tip || "",
    }));
  }

  // ---- State ----------------------------------------------------------------

  let foods = loadCache() || seedFromBundledDefaults();
  let query = "";
  let activeFilter = "all";

  // ---- DOM refs ---------------------------------------------------------------

  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  const filterRow = document.getElementById("filter-row");
  const resultsList = document.getElementById("results-list");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const emptyAddBtn = document.getElementById("empty-add-btn");
  const addFoodBtn = document.getElementById("add-food-btn");
  const syncBanner = document.getElementById("sync-banner");

  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");
  const deleteFoodBtn = document.getElementById("delete-food-btn");

  const nameInput = document.getElementById("food-name-input");
  const categoryInput = document.getElementById("food-category-input");
  const noteInput = document.getElementById("food-note-input");
  const statusRadios = document.querySelectorAll('input[name="status"]');

  const toastEl = document.getElementById("toast");

  let editingFoodId = null;

  // ---- Sync banner ------------------------------------------------------------

  function setBanner(message) {
    if (!message) {
      syncBanner.hidden = true;
      return;
    }
    syncBanner.textContent = message;
    syncBanner.hidden = false;
  }

  // ---- Rendering ------------------------------------------------------------

  const STATUS_LABEL = { ok: "Fine", moderate: "Moderation", avoid: "Avoid" };

  function statusBadge(status) {
    const label = STATUS_LABEL[status] || status;
    return `<span class="status-badge status-${status}"><span class="dot"></span>${label}</span>`;
  }

  function render() {
    const q = query.trim().toLowerCase();

    const filtered = foods.filter((f) => {
      const matchesQuery = !q || f.name.toLowerCase().includes(q);
      const matchesFilter = activeFilter === "all" || f.status === activeFilter;
      return matchesQuery && matchesFilter;
    });

    resultsList.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.hidden = false;
      resultsCount.textContent = "";
    } else {
      emptyState.hidden = true;
      const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      resultsCount.textContent = `${sorted.length} food${sorted.length === 1 ? "" : "s"}`;
      for (const food of sorted) {
        resultsList.appendChild(renderCard(food));
      }
    }
  }

  function renderCard(food) {
    const li = document.createElement("li");
    li.className = "food-card";
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", `${food.name}, ${STATUS_LABEL[food.status]}. Open to edit.`);

    const noteHtml = food.notes
      ? `<p class="food-note-preview">${escapeHtml(food.notes)}</p>`
      : "";

    li.innerHTML = `
      <div class="food-card-top">
        <div>
          <p class="food-name">${escapeHtml(food.name)}</p>
          <span class="food-category">${escapeHtml(food.category)}</span>
        </div>
        ${statusBadge(food.status)}
      </div>
      ${noteHtml}
    `;

    li.addEventListener("click", () => openModal(food));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(food);
      }
    });

    return li;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Search & filters -------------------------------------------------

  searchInput.addEventListener("input", () => {
    query = searchInput.value;
    clearBtn.hidden = query.length === 0;
    render();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    clearBtn.hidden = true;
    searchInput.focus();
    render();
  });

  filterRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    filterRow.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === btn));
    render();
  });

  // ---- Modal --------------------------------------------------------------

  function openModal(food) {
    editingFoodId = food ? food.id : null;

    modalTitle.textContent = food ? "Edit food" : "Add a food";
    nameInput.value = food ? food.name : "";
    categoryInput.value = food ? food.category : "Other";
    noteInput.value = food ? food.notes || "" : "";

    const status = food ? food.status : "avoid";
    statusRadios.forEach((r) => (r.checked = r.value === status));

    deleteFoodBtn.hidden = !food;

    modalBackdrop.hidden = false;
    nameInput.focus();
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    editingFoodId = null;
  }

  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
  });

  addFoodBtn.addEventListener("click", () => openModal(null));
  emptyAddBtn.addEventListener("click", () => {
    const prefill = query.trim();
    openModal(null);
    if (prefill) nameInput.value = prefill;
  });

  modalSave.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const notes = noteInput.value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    const category = categoryInput.value;

    if (!name) {
      nameInput.focus();
      showToast("Give it a name first");
      return;
    }

    if (!API_CONFIGURED) {
      showToast("Shared list isn't connected yet — see config.js");
      return;
    }

    modalSave.disabled = true;
    modalSave.textContent = "Saving…";

    try {
      const payload = { id: editingFoodId || undefined, name, category, status, notes };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed: " + res.status);
      const data = await res.json();
      foods = data.foods;
      saveCache(foods);
      closeModal();
      render();
      showToast("Saved for everyone");
    } catch (err) {
      console.error("TummyLog: save failed", err);
      showToast("Couldn't save — check your connection");
    } finally {
      modalSave.disabled = false;
      modalSave.textContent = "Save";
    }
  });

  deleteFoodBtn.addEventListener("click", async () => {
    if (!editingFoodId) return;
    if (!API_CONFIGURED) {
      showToast("Shared list isn't connected yet — see config.js");
      return;
    }

    deleteFoodBtn.disabled = true;
    try {
      const res = await fetch(API_URL + "/" + encodeURIComponent(editingFoodId), { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed: " + res.status);
      const data = await res.json();
      foods = data.foods;
      saveCache(foods);
      closeModal();
      render();
      showToast("Removed for everyone");
    } catch (err) {
      console.error("TummyLog: delete failed", err);
      showToast("Couldn't remove — check your connection");
    } finally {
      deleteFoodBtn.disabled = false;
    }
  });

  // ---- Toast --------------------------------------------------------------

  let toastTimer = null;
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2200);
  }

  // ---- Load shared data from the cloud ---------------------------------------

  async function loadFromCloud() {
    if (!API_CONFIGURED) {
      setBanner("Shared list isn't connected yet — open config.js and add your Worker URL.");
      return;
    }
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const data = await res.json();
      foods = data;
      saveCache(foods);
      setBanner(null);
      render();
    } catch (err) {
      console.warn("TummyLog: couldn't reach shared list, showing cached copy", err);
      setBanner("Showing a saved copy — couldn't reach the shared list. Adding and editing is paused until you're back online.");
      render();
    }
  }

  // ---- Init ---------------------------------------------------------------

  render(); // instant paint from cache/bundled defaults
  loadFromCloud(); // then sync with the shared list

  // ---- Service worker registration ----------------------------------------

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("TummyLog: service worker registration failed", err);
      });
    });
  }
})();
