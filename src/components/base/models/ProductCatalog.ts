import { IProduct } from "../../../types";

export class ProductCatalog {
  products: IProduct[];
  selectedProduct: IProduct | null;

  constructor(
    products: IProduct[] = [],
    selectedProduct: IProduct | null = null
  ) {
    this.products = products;
    this.selectedProduct = selectedProduct;
  }

  saveProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
