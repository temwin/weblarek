import { Component } from "./base/Component";
import { IEvents } from "../events/Events";

interface BasketData {
  items: HTMLElement[];
  totalPrice: number;
}

export class Basket extends Component<BasketData> {
  listElement: HTMLElement;
  totalPriceElement: HTMLElement;
  checkoutButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.listElement = container.querySelector(".basket__list")!;
    this.totalPriceElement = container.querySelector(".basket__price")!;
    this.checkoutButton = container.querySelector(".basket__button")!;

    this.showEmpty();
    this.setCheckoutEnabled(false);
    this.setTotalPrice(0);

    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });
  }

  setItems(items: HTMLElement[]) {
    this.listElement.innerHTML = "";

    if (items.length === 0) {
      this.showEmpty();
      this.setCheckoutEnabled(false);
    } else {
      this.listElement.append(...items);
      this.setCheckoutEnabled(true);
    }
  }

  private showEmpty() {
    const emptyElement = document.createElement("p");
    emptyElement.className = "basket__empty";
    emptyElement.textContent = "Корзина пуста";
    this.listElement.appendChild(emptyElement);
  }

  setTotalPrice(value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }

  setCheckoutEnabled(enabled: boolean) {
    this.checkoutButton.disabled = !enabled;
  }

  render(data: BasketData): HTMLElement {
    this.setItems(data.items);
    this.setTotalPrice(data.totalPrice);
    return this.container;
  }
}