import { Card, CardData } from './base/Card';
import { IEvents } from '../events/Events';
import { IProduct } from '../../types';

export interface CardBasketData extends CardData {
  product: IProduct;
  index: number;
}

export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      const productId = this.container.dataset.productId;
      if (productId) {
        this.events.emit('cart:remove', { id: productId });
      }
    });
  }

  setIndex(value: number) {
    this.indexElement.textContent = value.toString();
  }

  render(data: CardBasketData): HTMLElement {
    super.render(data);
    this.setIndex(data.index);
    this.container.dataset.productId = data.product.id;
    return this.container;
  }
}