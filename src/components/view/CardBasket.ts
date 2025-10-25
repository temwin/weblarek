import { Card, CardData } from './base/Card';
import { IEvents } from '../events/Events';

export interface CardBasketData extends CardData {
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
            this.events.emit('basket:remove', { element: this.container });
        });
    }

    setIndex(value: number) {
        this.indexElement.textContent = value.toString();
    }

    render(data: CardBasketData): HTMLElement {
        super.render(data);
        this.setIndex(data.index);
        return this.container;
    }

}