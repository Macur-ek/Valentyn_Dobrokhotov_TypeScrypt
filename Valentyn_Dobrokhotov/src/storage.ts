import type { Product } from "./types";

// Klucz wykorzystywany do zapisywania danych.
const STORAGE_KEY = "elektro-bud-products-v1";

// Przykładowe produkty wyświetlane przy pierwszym uruchomieniu.
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Przewód YDYp 3×2,5 mm²",
    sku: "KAB-325",
    category: "Przewody",
    quantity: 120,
    price: 4.8,
    minQuantity: 30
  },
  {
    id: 2,
    name: "Gniazdo podwójne białe",
    sku: "OSPR-102",
    category: "Osprzęt",
    quantity: 48,
    price: 18.9,
    minQuantity: 15
  },
  {
    id: 3,
    name: "Wyłącznik nadprądowy B16",
    sku: "ZAB-B16",
    category: "Zabezpieczenia",
    quantity: 9,
    price: 22.5,
    minQuantity: 12
  },
  {
    id: 4,
    name: "Puszka instalacyjna",
    sku: "MON-044",
    category: "Montaż",
    quantity: 86,
    price: 2.4,
    minQuantity: 20
  },
  {
    id: 5,
    name: "Taśma izolacyjna 19 mm",
    sku: "MON-019",
    category: "Montaż",
    quantity: 6,
    price: 5.2,
    minQuantity: 10
  },
  {
    id: 6,
    name: "Oprawa LED 18 W",
    sku: "OSW-018",
    category: "Oświetlenie",
    quantity: 32,
    price: 39.99,
    minQuantity: 8
  }
];

// Pobiera produkty z pamięci przeglądarki.
export function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [...initialProducts];
    }

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed as Product[]
      : [...initialProducts];

  } catch {
    return [...initialProducts];
  }
}

// Zapisuje aktualną listę produktów.
export function saveProducts(products: Product[]): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  );
}