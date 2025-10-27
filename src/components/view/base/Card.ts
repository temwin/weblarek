export interface CardData {
  title: string;
  price: number | null;
}

export class Card {
  protected container: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.titleElement = this.container.querySelector(".card__title")!;
    this.priceElement = this.container.querySelector(".card__price")!;
  }

  set data(value: CardData) {
    this.titleElement.textContent = value.title;
    this.priceElement.textContent = value.price !== null ? `${value.price} cинапсов` : "Бесценно";
  }

  render(data?: Partial<CardData>): HTMLElement {
    if (data?.title || data?.price !== undefined) {
      this.data = {
        title: data.title ?? "",
        price: data.price ?? null ,
      };
    }
    return this.container;
  }
}
