import { Card, CardData } from "./base/Card";
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

  constructor(container: HTMLElement) {
    super(container);
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.descriptionElement = container.querySelector(".card__text")!;
    this.addButton = container.querySelector(".card__button")!;
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

  render(
    data: CardPreviewData,
    actions?: {
      onAddToCart?: () => void;
      onSelect?: () => void;
    }
  ): HTMLElement {
    super.render(data);
    this.setCategory(data.category);
    this.setDescription(data.description);

    this.addButton.onclick = (e) => {
      e.stopPropagation();
      actions?.onAddToCart?.();
    };

    this.container.onclick = () => {
      actions?.onSelect?.();
    };

    return this.container;
  }
}