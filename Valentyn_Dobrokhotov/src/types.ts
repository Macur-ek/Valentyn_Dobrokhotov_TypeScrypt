/**
 * Model pojedynczego produktu magazynowego.
 * Interfejs określa, jakie pola musi posiadać każdy produkt.
 */
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  minQuantity: number;
}

/**
 * Dane formularza.
 * Omit usuwa pole ID, ponieważ identyfikator
 * jest automatycznie nadawany przez aplikację.
 */
export type ProductInput = Omit<Product, "id">;