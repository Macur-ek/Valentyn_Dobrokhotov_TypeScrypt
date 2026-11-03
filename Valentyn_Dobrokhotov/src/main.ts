import "./style.css";
import { Inventory } from "./inventory";
import { loadProducts, saveProducts } from "./storage";
import type { Product, ProductInput } from "./types";

/*
 * ZAKRES FUNKCJONALNY PROJEKTU ELEKTRO-BUD:
 * - wyświetlanie listy produktów,
 * - dodawanie nowych produktów,
 * - edycja istniejących produktów,
 * - usuwanie produktów,
 * - wyszukiwanie i filtrowanie,
 * - kontrola niskiego stanu magazynowego,
 * - obliczanie wartości magazynu.
 *
 * Dane przechowywane są lokalnie w localStorage.
 * Projekt nie obejmuje logowania ani bazy serwerowej.
 */

// Pobranie głównego elementu strony.
const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Nie znaleziono elementu #app");
}

// Utworzenie magazynu na podstawie zapisanych danych.
const inventory = new Inventory(loadProducts());

let editingId: number | null = null;
let searchText = "";
let selectedCategory = "Wszystkie";

// Główna struktura interfejsu aplikacji.
root.innerHTML = `
  <div class="layout">

    <aside class="sidebar">
      <a class="brand" href="#">
        <span class="brand-mark">E</span>
        <span>
          ELEKTRO<span class="brand-light">-BUD</span>
          <small>CONTROL CENTER</small>
        </span>
      </a>

      <div class="side-label">WORKSPACE</div>

      <a class="side-link active" href="#">
        <span>▦</span> Magazyn
      </a>

      <div class="side-label">SYSTEM</div>

      <div class="side-note">
        <span class="online-dot"></span>
        System lokalny
        <br>
        <small>Dane zapisują się w tej przeglądarce</small>
      </div>

      <div class="sidebar-bottom">
        ELEKTRO-BUD © 2026
        <br>
        <span>Panel ewidencji produktów</span>
      </div>
    </aside>

    <main class="main">

      <header class="topbar">
        <div>
          <div class="eyebrow">ZARZĄDZANIE ZASOBAMI</div>
          <h1>Magazyn</h1>
        </div>

        <div class="top-status">
          <span class="online-dot"></span>
          Wszystko działa
          <span class="avatar">EB</span>
        </div>
      </header>

      <section class="welcome">
        <div>
          <span class="welcome-tag">PANEL OPERACYJNY</span>

          <h2>
            Kontrola magazynu,
            <br>
            <em>bez zbędnych komplikacji.</em>
          </h2>

          <p>
            Monitoruj stany, zarządzaj produktami
            i szybko reaguj na braki.
          </p>
        </div>

        <div class="welcome-art">
          EB
          <span>INVENTORY<br>MANAGEMENT</span>
        </div>
      </section>

      <section id="stats" class="stats-grid"></section>

      <section class="inventory-panel">

        <div class="panel-heading">
          <div>
            <div class="eyebrow">BAZA PRODUKTÓW</div>
            <h2>Lista produktów</h2>
            <p>
              Wszystkie pozycje znajdujące się
              w ewidencji magazynowej.
            </p>
          </div>

          <button class="primary-btn" id="add-button">
            <span>＋</span> Dodaj produkt
          </button>
        </div>

        <div class="toolbar">

          <label class="search-box">
            <span>⌕</span>
            <input
              id="search"
              type="search"
              placeholder="Szukaj nazwy, SKU lub kategorii..."
            />
          </label>

          <select id="category-filter" aria-label="Filtr kategorii">
            <option>Wszystkie</option>
          </select>

          <span id="result-count" class="result-count"></span>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUKT</th>
                <th>SKU</th>
                <th>KATEGORIA</th>
                <th>ILOŚĆ</th>
                <th>CENA / SZT.</th>
                <th>WARTOŚĆ</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>

            <tbody id="product-rows"></tbody>
          </table>
        </div>

        <div id="empty-state" class="empty-state" hidden>
          <span>⌕</span>
          <strong>Nie znaleziono produktów</strong>
          <p>
            Zmień kryteria wyszukiwania lub dodaj nową pozycję.
          </p>
        </div>

      </section>

      <footer>
        ELEKTRO-BUD
        <span>•</span>
        Aplikacja demonstracyjna TypeScript
        <span>•</span>
        Dane przechowywane lokalnie
      </footer>

    </main>
  </div>

  <!-- Okno dodawania i edycji produktu -->
  <div id="modal" class="modal" hidden>

    <div class="modal-backdrop" data-close="true"></div>

    <section
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >

      <div class="modal-head">
        <div>
          <div class="eyebrow">KARTA PRODUKTU</div>
          <h2 id="modal-title">Dodaj produkt</h2>
        </div>

        <button class="close-btn" id="close-modal">×</button>
      </div>

      <form id="product-form">

        <label>
          Nazwa produktu
          <input
            name="name"
            required
            maxlength="80"
            placeholder="np. Przewód instalacyjny"
          />
        </label>

        <div class="form-grid">

          <label>
            SKU / kod
            <input
              name="sku"
              required
              maxlength="24"
              placeholder="np. KAB-001"
            />
          </label>

          <label>
            Kategoria
            <select name="category" required>
              <option value="Przewody">Przewody</option>
              <option value="Osprzęt">Osprzęt</option>
              <option value="Zabezpieczenia">Zabezpieczenia</option>
              <option value="Oświetlenie">Oświetlenie</option>
              <option value="Montaż">Montaż</option>
              <option value="Inne">Inne</option>
            </select>
          </label>

          <label>
            Ilość (szt.)
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              required
            />
          </label>

          <label>
            Cena za szt. (zł)
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label class="full-field">
            Minimalny stan magazynowy
            <input
              name="minQuantity"
              type="number"
              min="0"
              step="1"
              required
            />
          </label>

        </div>

        <p class="form-hint">
          Pola ilości i ceny nie mogą przyjmować wartości ujemnych.
        </p>

        <div class="form-actions">
          <button
            type="button"
            class="secondary-btn"
            id="cancel-modal"
          >
            Anuluj
          </button>

          <button class="primary-btn" type="submit">
            Zapisz produkt
          </button>
        </div>

      </form>
    </section>
  </div>

  <div id="toast" class="toast" role="status"></div>
`;

// Funkcja pomocnicza pobierająca element HTML po ID.
function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Brak elementu o ID: ${id}`);
  }

  return element as T;
}

// Pobranie elementów interfejsu.
const statsElement = byId<HTMLDivElement>("stats");
const rowsElement = byId<HTMLTableSectionElement>("product-rows");
const modal = byId<HTMLDivElement>("modal");
const form = byId<HTMLFormElement>("product-form");
const searchInput = byId<HTMLInputElement>("search");
const categoryFilter = byId<HTMLSelectElement>("category-filter");
const toastElement = byId<HTMLDivElement>("toast");

// Formatowanie ceny w polskich złotych.
function money(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(value);
}

// Wyświetlanie komunikatów.
function showToast(message: string): void {
  toastElement.textContent = message;
  toastElement.classList.add("visible");

  window.setTimeout(() => {
    toastElement.classList.remove("visible");
  }, 2600);
}

// Zapisywanie aktualnych danych magazynu.
function persist(): void {
  saveProducts(inventory.getAll());
}

// Wyświetlanie statystyk magazynu.
function renderStats(): void {
  const stats = inventory.getStats();

  const cards = [
    {
      label: "Wszystkie produkty",
      value: String(stats.products),
      note: "Pozycji w ewidencji",
      icon: "▦"
    },
    {
      label: "Łączna ilość",
      value: `${stats.units} szt.`,
      note: "Jednostek na stanie",
      icon: "▤"
    },
    {
      label: "Wartość magazynu",
      value: money(stats.value),
      note: "Ilość × cena jednostkowa",
      icon: "zł"
    },
    {
      label: "Niski stan",
      value: String(stats.lowStock),
      note: "Wymaga uzupełnienia",
      icon: "!"
    }
  ];

  statsElement.innerHTML = cards.map((card, index) => `
    <article class="stat-card">
      <div class="stat-top">
        <span>${card.label}</span>
        <span class="stat-icon icon-${index}">
          ${card.icon}
        </span>
      </div>

      <strong>${card.value}</strong>
      <small>${card.note}</small>
    </article>
  `).join("");
}

// Tworzenie opcji filtra kategorii.
function renderCategoryOptions(): void {
  const current = selectedCategory;

  const categories = [
    ...new Set(
      inventory.getAll().map(product => product.category)
    )
  ].sort();

  categoryFilter.innerHTML = `
    <option value="Wszystkie">Wszystkie kategorie</option>
  ` + categories.map(category => `
    <option value="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </option>
  `).join("");

  categoryFilter.value = categories.includes(current)
    ? current
    : "Wszystkie";

  selectedCategory = categoryFilter.value;
}

// Wyświetlanie tabeli produktów.
function renderProducts(): void {
  const products = inventory.search(
    searchText,
    selectedCategory
  );

  byId<HTMLSpanElement>("result-count").textContent =
    `${products.length} wyników`;

  byId<HTMLDivElement>("empty-state").hidden =
    products.length !== 0;

  rowsElement.innerHTML = products.map(product => {
    const low = product.quantity <= product.minQuantity;

    return `
      <tr>

        <td>
          <div class="product-name">
            <span class="product-symbol">
              ${product.category === "Przewody"
                ? "⌁"
                : product.category === "Oświetlenie"
                  ? "☼"
                  : "▧"}
            </span>

            <strong>${escapeHtml(product.name)}</strong>
          </div>
        </td>

        <td>
          <span class="sku">${escapeHtml(product.sku)}</span>
        </td>

        <td>${escapeHtml(product.category)}</td>

        <td>
          <strong>${product.quantity}</strong>
          <small class="muted">szt.</small>
        </td>

        <td>${money(product.price)}</td>

        <td>
          <strong>
            ${money(product.quantity * product.price)}
          </strong>
        </td>

        <td>
          <span class="status ${low ? "status-low" : "status-ok"}">
            <i></i>
            ${low ? "Niski stan" : "Dostępny"}
          </span>
        </td>

        <td>
          <div class="actions">
            <button
              class="action-btn"
              data-edit="${product.id}"
              title="Edytuj"
              aria-label="Edytuj produkt"
            >✎</button>

            <button
              class="action-btn delete-btn"
              data-delete="${product.id}"
              title="Usuń"
              aria-label="Usuń produkt"
            >×</button>
          </div>
        </td>

      </tr>
    `;
  }).join("");
}

// Zabezpieczenie tekstu przed interpretacją jako HTML.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? character);
}

// Odświeżenie całego interfejsu.
function render(): void {
  renderStats();
  renderCategoryOptions();
  renderProducts();
}

// Otwieranie formularza dodawania lub edycji.
function openModal(product?: Product): void {
  editingId = product?.id ?? null;

  form.reset();

  byId<HTMLHeadingElement>("modal-title").textContent =
    product ? "Edytuj produkt" : "Dodaj produkt";

  const fields = form.elements as typeof form.elements & {
    name: HTMLInputElement;
    sku: HTMLInputElement;
    category: HTMLSelectElement;
    quantity: HTMLInputElement;
    price: HTMLInputElement;
    minQuantity: HTMLInputElement;
  };

  if (product) {
    fields.name.value = product.name;
    fields.sku.value = product.sku;
    fields.category.value = product.category;
    fields.quantity.value = String(product.quantity);
    fields.price.value = String(product.price);
    fields.minQuantity.value = String(product.minQuantity);
  } else {
    fields.quantity.value = "0";
    fields.price.value = "0";
    fields.minQuantity.value = "5";
  }

  modal.hidden = false;
  fields.name.focus();
}

// Zamykanie formularza.
function closeModal(): void {
  modal.hidden = true;
  editingId = null;
}

// Obsługa przycisków formularza.
byId<HTMLButtonElement>("add-button")
  .addEventListener("click", () => openModal());

byId<HTMLButtonElement>("close-modal")
  .addEventListener("click", closeModal);

byId<HTMLButtonElement>("cancel-modal")
  .addEventListener("click", closeModal);

// Zamykanie po kliknięciu tła.
modal.addEventListener("click", event => {
  if ((event.target as HTMLElement).dataset.close === "true") {
    closeModal();
  }
});

// Obsługa zapisywania formularza.
form.addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(form);

  const productData: ProductInput = {
    name: String(data.get("name")).trim(),

    sku: String(data.get("sku"))
      .trim()
      .toUpperCase(),

    category: String(data.get("category")),

    quantity: Number(data.get("quantity")),

    price: Number(data.get("price")),

    minQuantity: Number(data.get("minQuantity"))
  };

  // Sprawdzenie, czy kod SKU nie jest już używany.
  const duplicate = inventory.getAll().some(product =>
    product.sku.toLowerCase() ===
      productData.sku.toLowerCase() &&
    product.id !== editingId
  );

  if (duplicate) {
    showToast("Produkt o takim kodzie SKU już istnieje.");
    return;
  }

  // Walidacja wymaganych danych.
  if (
    !productData.name ||
    !productData.sku ||
    Object.values(productData).some(
      value =>
        typeof value === "number" &&
        (!Number.isFinite(value) || value < 0)
    ) ||
    !Number.isInteger(productData.quantity) ||
    !Number.isInteger(productData.minQuantity)
  ) {
    showToast("Uzupełnij poprawnie wszystkie pola.");
    return;
  }

  // Aktualizacja albo dodanie produktu.
  if (editingId !== null) {
    inventory.update(editingId, productData);

    showToast("Dane produktu zostały zaktualizowane.");
  } else {
    inventory.add(productData);

    showToast("Produkt został dodany do magazynu.");
  }

  persist();
  closeModal();
  render();
});

// Obsługa przycisków edycji i usuwania.
rowsElement.addEventListener("click", event => {
  const target = event.target as HTMLElement;

  const editButton = target.closest<HTMLElement>("[data-edit]");
  const deleteButton = target.closest<HTMLElement>("[data-delete]");

  // Edycja produktu.
  if (editButton) {
    const product = inventory.getAll().find(
      item => item.id === Number(editButton.dataset.edit)
    );

    if (product) {
      openModal(product);
    }
  }

  // Usuwanie produktu.
  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    const product = inventory.getAll().find(
      item => item.id === id
    );

    if (
      product &&
      window.confirm(
        `Czy na pewno usunąć produkt „${product.name}”?`
      )
    ) {
      inventory.remove(id);

      persist();
      render();

      showToast("Produkt został usunięty.");
    }
  }
});

// Wyszukiwanie produktów.
searchInput.addEventListener("input", () => {
  searchText = searchInput.value;
  renderProducts();
});

// Filtrowanie po kategorii.
categoryFilter.addEventListener("change", () => {
  selectedCategory = categoryFilter.value;
  renderProducts();
});

// Pierwsze uruchomienie widoku.
render();