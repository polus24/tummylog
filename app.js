(function () {
  "use strict";

  const STORAGE_KEY = "tummylog:userdata:v1";

  // ---- Persistence -------------------------------------------------------

  function loadUserData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { overrides: {}, custom: {} };
      const parsed = JSON.parse(raw);
      return {
        overrides: parsed.overrides || {},
        custom: parsed.custom || {},
      };
    } catch (e) {
      console.error("TummyLog: failed to load saved data", e);
      return { overrides: {}, custom: {} };
    }
  }

  function saveUserData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("TummyLog: failed to save data", e);
      return false;
    }
  }

  let userData = loadUserData();

  // ---- Build merged food list --------------------------------------------

  function getAllFoods() {
    const base = DEFAULT_FOODS.map((f) => {
      const override = userData.overrides[f.id];
      return {
        ...f,
        status: override && override.status ? override.status : f.status,
        note: override && override.note ? override.note : "",
        isCustom: false,
      };
    });
    const custom = Object.values(userData.custom).map((f) => ({
      ...f,
      isCustom: true,
    }));
    return [...base, ...custom].sort((a, b) => a.name.localeCompare(b.name));
  }

  // ---- State --------------------------------------------------------------

  let query = "";
  let activeFilter = "all";

  // ---- DOM refs -------------------------------------------------------------

  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  const filterRow = document.getElementById("filter-row");
  const resultsList = document.getElementById("results-list");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const emptyAddBtn = document.getElementById("empty-add-btn");
  const addFoodBtn = document.getElementById("add-food-btn");

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

  let editingFoodId = null; // id of food currently open in modal (default or custom)
  let editingIsCustom = false;

  // ---- Rendering ------------------------------------------------------------

  const STATUS_LABEL = { ok: "Fine", moderate: "Moderation", avoid: "Avoid" };

  function statusBadge(status) {
    const label = STATUS_LABEL[status] || status;
    return `<span class="status-badge status-${status}"><span class="dot"></span>${label}</span>`;
  }

  function render() {
    const all = getAllFoods();
    const q = query.trim().toLowerCase();

    let filtered = all.filter((f) => {
      const matchesQuery = !q || f.name.toLowerCase().includes(q);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "mine" && (f.isCustom || f.note)) ||
        f.status === activeFilter;
      return matchesQuery && matchesFilter;
    });

    resultsList.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.hidden = false;
      resultsCount.textContent = "";
    } else {
      emptyState.hidden = true;
      resultsCount.textContent = `${filtered.length} food${filtered.length === 1 ? "" : "s"}`;
      for (const food of filtered) {
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

    const tipHtml = food.tip
      ? `<p class="food-tip">${escapeHtml(food.tip)}</p>`
      : "";
    const noteHtml = food.note
      ? `<p class="food-note-preview"><span class="note-label">Your note:</span>${escapeHtml(food.note)}</p>`
      : "";
    const customTag = food.isCustom ? `<span class="custom-tag">Added by you</span>` : "";

    li.innerHTML = `
      <div class="food-card-top">
        <div>
          <p class="food-name">${escapeHtml(food.name)}${customTag}</p>
          <span class="food-category">${escapeHtml(food.category)}</span>
        </div>
        ${statusBadge(food.status)}
      </div>
      ${tipHtml}
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
    editingIsCustom = food ? food.isCustom : true; // new foods are always "custom"

    modalTitle.textContent = food ? (food.isCustom ? "Edit your food" : "Edit notes") : "Add a food";
    nameInput.value = food ? food.name : "";
    categoryInput.value = food ? food.category : "Other";
    noteInput.value = food ? food.note || "" : "";

    const status = food ? food.status : "avoid";
    statusRadios.forEach((r) => (r.checked = r.value === status));

    // Existing default (non-custom) foods: name/category/status are reference
    // data, not user-editable — only the note is theirs to change.
    const lockFields = !!(food && !food.isCustom);
    nameInput.disabled = lockFields;
    categoryInput.disabled = lockFields;
    statusRadios.forEach((r) => (r.disabled = lockFields));
    document.getElementById("status-radio-row").style.opacity = lockFields ? "0.6" : "1";

    deleteFoodBtn.hidden = !(food && food.isCustom);

    modalBackdrop.hidden = false;
    (lockFields ? noteInput : nameInput).focus();
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

  modalSave.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const note = noteInput.value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    const category = categoryInput.value;

    if (editingIsCustom) {
      if (!name) {
        nameInput.focus();
        showToast("Give it a name first");
        return;
      }
      const id = editingFoodId && userData.custom[editingFoodId]
        ? editingFoodId
        : "custom-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);

      userData.custom[id] = { id, name, category, status, note };
    } else {
      // Editing a default food: only the note (and optional status override) is stored.
      userData.overrides[editingFoodId] = {
        note,
        status: status, // allow personal status override too
      };
    }

    saveUserData(userData);
    closeModal();
    render();
    showToast("Saved");
  });

  deleteFoodBtn.addEventListener("click", () => {
    if (editingFoodId && userData.custom[editingFoodId]) {
      delete userData.custom[editingFoodId];
      saveUserData(userData);
      closeModal();
      render();
      showToast("Removed");
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
    }, 1800);
  }

  // ---- Init ---------------------------------------------------------------

  render();

  // ---- Service worker registration ----------------------------------------

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("TummyLog: service worker registration failed", err);
      });
    });
  }
})();
