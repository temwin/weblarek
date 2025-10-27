import { Component } from "./base/Component";
import { IEvents } from "../events/Events";

interface SuccessData {
    total: number;
}

export class Success extends Component<SuccessData> {
    titleElement: HTMLElement;
    descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.titleElement = container.querySelector('.order-success__title')!;
        this.descriptionElement = container.querySelector('.order-success__description')!;
        this.closeButton = container.querySelector('.order-success__close')!;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        })
    }

    render(data: SuccessData) {
        this.titleElement.textContent = "Заказ оформлен";
        this.descriptionElement.textContent = `Списано ${data.total} синапсов`
        return this.container;
    }
}