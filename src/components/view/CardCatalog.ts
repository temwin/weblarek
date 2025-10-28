import { Card, CardData } from "./base/Card";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { EventEmitter } from "../events/Events";

export interface CardCatalogData extends CardData {
  id: string;
  image: string;
  category: string;
}

export class CardCatalog extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected addButton: HTMLButtonElement | null;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.addButton = container.querySelector(".card__button");

    if (this.addButton) {
      this.addButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = this.container.dataset.productId;
        const inCart = this.container.dataset.inCart === "true";
        if (productId) {
          this.events.emit(inCart ? "cart:remove" : "cart:add", {
            id: productId,
          });
        }
      });
    }

    this.container.addEventListener("click", () => {
      const productId = this.container.dataset.productId;
      if (productId) {
        this.events.emit("product:selected", { id: productId });
      }
    });
  }

  setInCart(value: boolean) {
    if (!this.addButton) return;
    this.container.dataset.inCart = value.toString();

    const hasPrice = this.container.dataset.hasPrice === "true";

    if (!hasPrice) {
      this.addButton.disabled = true;
      this.addButton.textContent = "Недоступно";
      return;
    }

    this.addButton.disabled = false;
    this.addButton.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  setCategory(value: string) {
    this.categoryElement.textContent = value;
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.className = `card__category ${categoryClass}`;
    }
  }

  render(data: CardCatalogData): HTMLElement {
    super.render(data);
    this.container.dataset.productId = data.id;
    this.container.dataset.hasPrice = (data.price !== null).toString();

    this.setCategory(data.category);

    let fullPath = `${CDN_URL}${data.image}`;
    if (fullPath.endsWith(".svg")) fullPath = fullPath.replace(".svg", ".png");

    this.imageElement.src = fullPath;
    this.imageElement.alt = data.title;

    return this.container;
  }
}
