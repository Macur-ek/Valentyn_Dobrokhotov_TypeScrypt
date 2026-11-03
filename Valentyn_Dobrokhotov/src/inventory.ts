import type { Product, ProductInput } from "./types";

/**
 * Klasa Inventory zawiera główną logikę magazynu.
 * Odpowiada za dodawanie, edycję, usuwanie i wyszukiwanie.
 */
export class Inventory {

  constructor(private products: Product[]) {}

  // Zwraca kopię wszystkich produktów.
  getAll(): Product[] {
    return [...this.products];
  }

  // Dodaje produkt i automatycznie nadaje mu ID.
  add(data: ProductInput): Product {
    const nextId = this.products.length
      ? Math.max(...this.products.map(p => p.id)) + 1
      : 1;

    const product: Product = {
      id: nextId,
      ...data
    };

    this.products.push(product);

    return product;
  }

  // Edytuje produkt na podstawie jego ID.
  update(id: number, data: ProductInput): boolean {
    const index = this.products.findIndex(
      product => product.id === id
    );

    if (index === -1) {
      return false;
    }

    this.products[index] = {
      id,
      ...data
    };

    return true;
  }

  // Usuwa produkt z magazynu.
  remove(id: number): boolean {
    const before = this.products.length;

    this.products = this.products.filter(
      product => product.id !== id
    );

    return this.products.length !== before;
  }

  // Wyszukuje produkty po nazwie, SKU i kategorii.
  search(query: string, category = "Wszystkie"): Product[] {
    const normalized = query.trim().toLocaleLowerCase("pl");

    return this.products.filter(product => {
      const matchesText = [
        product.name,
        product.sku,
        product.category
      ].some(value =>
        value.toLocaleLowerCase("pl").includes(normalized)
      );

      const matchesCategory =
        category === "Wszystkie" ||
        product.category === category;

      return matchesText && matchesCategory;
    });
  }

  // Oblicza statystyki magazynu.
  getStats() {
    return {
      products: this.products.length,

      units: this.products.reduce(
        (sum, product) => sum + product.quantity,
        0
      ),

      value: this.products.reduce(
        (sum, product) =>
          sum + product.quantity * product.price,
        0
      ),

      lowStock: this.products.filter(
        product => product.quantity <= product.minQuantity
      ).length
    };
  }
}