import { IProduct } from "../../../types";
import { IEvents } from "../events/Events";

export class ProductCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
    this.events = events;
  }

  saveProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("products:changed", this.products);
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:selected", this.selectedProduct);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
