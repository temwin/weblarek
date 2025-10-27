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
  private inCart = false;
  protected fullData!: CardCatalogData;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.addButton = container.querySelector(".card__button");

    if (this.addButton) {
      this.addButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this.fullData) return;
    
        // Передаем прямо fullData
        this.events.emit(this.inCart ? "cart:remove" : "cart:add", this.fullData);
    
        this.inCart = !this.inCart;
        this.updateButton();
      });
    }

    // === Открытие модалки товара ===
    this.container.addEventListener("click", () => {
      if (this.fullData) this.events.emit("product:selected", this.fullData);
    });

    // === Подписка на обновление каталога ===
    this.events.on("catalog:update", (cartIds: string[]) => {
      if (!this.fullData) return;
      const isInCart = cartIds.includes(this.fullData.id);
      this.setInCart(isInCart);
    });
  }

  public setInCart(value: boolean) {
    this.inCart = value;
    this.updateButton();
  }

  private updateButton() {
    if (!this.addButton || !this.fullData) return;

    if (!this.fullData.price) {
      this.addButton.disabled = true;
      this.addButton.textContent = "Недоступно";
      return;
    }

    this.addButton.disabled = false;
    this.addButton.textContent = this.inCart ? "Удалить из корзины" : "В корзину";
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
    this.fullData = data;
    this.setCategory(data.category);

    let fullPath = `${CDN_URL}${data.image}`;
    if (fullPath.endsWith(".svg")) fullPath = fullPath.replace(".svg", ".png");

    this.imageElement.src = fullPath;
    this.imageElement.alt = data.title;

    this.updateButton();
    return this.container;
  }
}