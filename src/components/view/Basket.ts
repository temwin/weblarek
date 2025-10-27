import { IProduct } from "../../types";
import { Component } from "./base/Component";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../events/Events";
import { CardBasket, CardBasketData } from "./CardBasket";

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
  }

  setItemsData(items: IProduct[]) {
    this.listElement.innerHTML = "";

    if (items.length === 0) {
      this.showEmpty();
      this.setCheckoutEnabled(false);
      this.setTotalPrice(0);
      return;
    }

    items.forEach((product, index) => {
      const itemElement = cloneTemplate("#card-basket");
      const card = new CardBasket(itemElement, this.events);

      const renderedElement = card.render({
        title: product.title,
        price: product.price ?? null,
        index: index + 1,
        product: product,
      });

      this.listElement.appendChild(renderedElement);
    });

    const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    this.setTotalPrice(total);
    this.setCheckoutEnabled(true);
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
}
