/**
 * Aranabilir il / ilçe seçimi: native <select> değerini korur, görünür alan combobox.
 */
(function (global) {
  "use strict";

  var registry = new WeakMap();

  function norm(s) {
    return String(s || "")
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function ensureWrap(selectEl, wrapClass) {
    var p = selectEl.parentNode;
    if (p && p.classList && p.classList.contains("jetle-tr-combo")) {
      if (wrapClass) p.classList.add(wrapClass);
      return p;
    }
    var wrap = document.createElement("div");
    wrap.className = "jetle-tr-combo" + (wrapClass ? " " + wrapClass : "");
    p.insertBefore(wrap, selectEl);
    wrap.appendChild(selectEl);
    return wrap;
  }

  function enhanceSelect(selectEl, opts) {
    opts = opts || {};
    if (!selectEl || selectEl.tagName !== "SELECT") return null;

    if (registry.has(selectEl)) {
      registry.get(selectEl).syncFromSelect();
      return registry.get(selectEl);
    }

    var wrap = ensureWrap(selectEl, opts.wrapClass);
    selectEl.classList.add("jetle-tr-combo__select");
    selectEl.setAttribute("tabindex", "-1");
    selectEl.setAttribute("aria-hidden", "true");

    var row = document.createElement("div");
    row.className = "jetle-tr-combo__row";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "jetle-tr-combo__input";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jetle-tr-combo__btn";
    btn.setAttribute("aria-label", "Listeyi aç / kapat");
    btn.textContent = "▾";

    var list = document.createElement("div");
    list.className = "jetle-tr-combo__list";
    list.setAttribute("role", "listbox");
    list.hidden = true;
    var listId = "jetle-tr-list-" + String(Math.random()).slice(2, 10);
    list.id = listId;
    input.setAttribute("aria-controls", listId);

    row.appendChild(input);
    row.appendChild(btn);
    wrap.appendChild(row);
    wrap.appendChild(list);

    var open = false;
    var activeIdx = -1;

    function close() {
      open = false;
      list.hidden = true;
      list.innerHTML = "";
      activeIdx = -1;
      input.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
    }

    function syncFromSelect() {
      var dis = !!selectEl.disabled;
      input.disabled = dis;
      btn.disabled = dis;
      var v = selectEl.value;
      var opt = selectEl.selectedOptions && selectEl.selectedOptions[0];
      if (!opt) opt = selectEl.options[selectEl.selectedIndex];
      if (!v || !opt) {
        input.value = "";
        var o0 = selectEl.options[0];
        input.placeholder = o0 && !o0.value ? String(o0.textContent || "").trim() || "Seçin…" : "Seçin…";
      } else {
        input.value = String(opt.textContent || opt.value || "").trim();
        input.placeholder = "";
      }
    }

    function getOptions() {
      var out = [];
      for (var i = 0; i < selectEl.options.length; i++) {
        var o = selectEl.options[i];
        out.push({ value: o.value, label: String(o.textContent || o.value || "").trim() });
      }
      return out;
    }

    function pick(value) {
      selectEl.value = value;
      selectEl.dispatchEvent(new Event("input", { bubbles: true }));
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      syncFromSelect();
      close();
      try {
        input.focus();
      } catch (e2) {}
    }

    function renderItems(filterText) {
      list.innerHTML = "";
      var nq = norm(filterText);
      var opts = getOptions();
      var frag = document.createDocumentFragment();
      var shown = 0;
      for (var i = 0; i < opts.length; i++) {
        var it = opts[i];
        if (!it.label && !it.value) continue;
        if (nq) {
          if (!it.value) continue;
          if (norm(it.label).indexOf(nq) === -1 && norm(it.value).indexOf(nq) === -1) continue;
        }
        var b = document.createElement("button");
        b.type = "button";
        b.className = "jetle-tr-combo__item";
        b.setAttribute("role", "option");
        b.setAttribute("data-value", it.value);
        b.textContent = it.label || it.value || "—";
        if (selectEl.value === it.value) b.classList.add("is-selected");
        b.addEventListener("mousedown", function (ev) {
          ev.preventDefault();
        });
        b.addEventListener("click", function () {
          pick(it.value);
        });
        frag.appendChild(b);
      }
      list.appendChild(frag);
    }

    function openList() {
      open = true;
      wrap.classList.add("is-open");
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      renderItems(input.value);
      activeIdx = -1;
    }

    function toggleList() {
      if (open) close();
      else openList();
    }

    function moveActive(delta) {
      var items = list.querySelectorAll(".jetle-tr-combo__item");
      if (!items.length) return;
      activeIdx += delta;
      if (activeIdx < 0) activeIdx = items.length - 1;
      if (activeIdx >= items.length) activeIdx = 0;
      items.forEach(function (node, j) {
        node.classList.toggle("is-active", j === activeIdx);
      });
      if (items[activeIdx]) {
        try {
          items[activeIdx].scrollIntoView({ block: "nearest" });
        } catch (e) {}
      }
    }

    function activateCurrent() {
      var items = list.querySelectorAll(".jetle-tr-combo__item");
      if (activeIdx >= 0 && items[activeIdx]) {
        pick(items[activeIdx].getAttribute("data-value") || "");
        return;
      }
      if (items.length === 1) pick(items[0].getAttribute("data-value") || "");
    }

    input.addEventListener("focus", function () {
      syncFromSelect();
    });

    input.addEventListener("input", function () {
      if (!open) openList();
      else renderItems(input.value);
      activeIdx = -1;
    });

    input.addEventListener("keydown", function (ev) {
      var k = ev.key;
      if (k === "Escape") {
        ev.preventDefault();
        close();
        syncFromSelect();
        return;
      }
      if (k === "ArrowDown") {
        ev.preventDefault();
        if (!open) openList();
        moveActive(1);
        return;
      }
      if (k === "ArrowUp") {
        ev.preventDefault();
        if (!open) openList();
        moveActive(-1);
        return;
      }
      if (k === "Enter") {
        if (open) {
          ev.preventDefault();
          activateCurrent();
        }
        return;
      }
      if (k === "Tab") {
        close();
      }
    });

    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      toggleList();
      if (open) input.focus();
    });

    function onDocDown(ev) {
      if (!open) return;
      if (wrap.contains(ev.target)) return;
      close();
      syncFromSelect();
    }

    document.addEventListener("mousedown", onDocDown, true);

    var api = {
      syncFromSelect: syncFromSelect,
      destroy: function () {
        document.removeEventListener("mousedown", onDocDown, true);
        registry.delete(selectEl);
      }
    };
    registry.set(selectEl, api);
    syncFromSelect();
    return api;
  }

  function refresh(selectEl) {
    if (!selectEl) return;
    var api = registry.get(selectEl);
    if (api && typeof api.syncFromSelect === "function") api.syncFromSelect();
  }

  global.JetleTrCitiesUI = {
    enhanceSelect: enhanceSelect,
    refresh: refresh
  };
})(typeof window !== "undefined" ? window : this);
