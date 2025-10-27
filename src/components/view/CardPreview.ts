import { Card, CardData } from "./base/Card";
import { IEvents } from "../events/Events";
import { categoryMap } from "../../utils/constants";

export interface CardPreviewData extends CardData {
  image: string;
  category: string;
  description: string;
}

export class CardPreview extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected addButton: HTMLButtonElement;
  private events: IEvents;
  private currentData: CardPreviewData | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.descriptionElement = container.querySelector(".card__text")!;
    this.addButton = container.querySelector(".card__button")!;
  
    // Клик по кнопке "Добавить в корзину"
    this.addButton.addEventListener("click", (e) => {
      e.stopPropagation(); // чтобы клик не срабатывал на контейнер карточки
      if (this.currentData) {
        this.events.emit("basket:add", {
          title: this.currentData.title,
          price: this.currentData.price,
          image: this.currentData.image,
        });
      }
    });
  
    // Клик по всей карточке: выбор товара
    this.container.addEventListener("click", () => {
      if (this.currentData) {
        this.events.emit("product:selected", this.currentData);
      }
    });
  }

  setCategory(value: string) {
    this.categoryElement.textContent = value;
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.className = `card__category ${categoryClass}`;
    }
  }

  setDescription(value: string) {
    this.descriptionElement.textContent = value;
  }

  setAddButtonEnabled(enabled: boolean) {
    this.addButton.disabled = !enabled;
  }

  render(data: CardPreviewData): HTMLElement {
    super.render(data);
    this.setCategory(data.category);
    this.setDescription(data.description);
    this.currentData = data;
    return this.container;
  }
}
