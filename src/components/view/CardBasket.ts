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
    protected fullData!: CardBasketData;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.indexElement = container.querySelector('.basket__item-index')!;
        this.deleteButton = container.querySelector('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', () => {
            if (!this.fullData) return;
            this.events.emit('cart:remove', this.fullData.product);
        });
    }

    setIndex(value: number) {
        this.indexElement.textContent = value.toString();
    }

    render(data: CardBasketData): HTMLElement {
        super.render(data);
        this.fullData = data;
        this.setIndex(data.index);

        const titleEl = this.container.querySelector('.card__title')!;
        titleEl.textContent = data.product.title;

        const priceEl = this.container.querySelector('.card__price')!;
        priceEl.textContent = data.product.price ? `${data.product.price} синапсов` : 'Бесценно';
        
        return this.container;
    }

}