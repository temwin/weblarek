import { Component } from "./base/Component";
import { IEvents } from "../events/Events";

interface SuccessData {
    title: string;
    description: string;
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

    setTitle(value: string) {
        this.titleElement.textContent = value;
    }

    setDescription(value: string) {
        this.descriptionElement.textContent = value;
    }

    render(data: SuccessData) {
        this.setTitle(data.title);
        this.setDescription(data.description);
        return this.container;
    }
}