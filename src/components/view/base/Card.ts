import { Component } from "./Component";

export interface CardData {
  title: string;
  price: number | null;
}

export class Card extends Component<CardData> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = this.container.querySelector(".card__title")!;
    this.priceElement = this.container.querySelector(".card__price")!;
  }

  setTitle(value: string) {
    this.titleElement.textContent = value;
  }

  setPrice(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} ₽` : "Бесценно";
  }

  render(data?: Partial<CardData>): HTMLElement {
    if (data?.title) this.setTitle(data.title);
    if (data?.price !== undefined) this.setPrice(data.price);
    return this.container;
  }
}
