import { IProduct } from "../../../types";
import { IEvents } from "../events/Events";

export class Cart {
  private items: IProduct[];
  private events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed', this.items);
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit('basket:changed', this.items);
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', this.items);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
