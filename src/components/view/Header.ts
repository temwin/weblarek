import { IEvents } from "../events/Events";
import { Component } from "./base/Component";

interface HeaderData {
    counter: number
}

export class Header extends Component<HeaderData> {
    basketButton: HTMLButtonElement;
    counterElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.basketButton = container.querySelector('.header__basket')!;
        this.counterElement = container.querySelector('.header__basket-counter')!;
        this.basketButton.addEventListener('click', () => {
            events.emit('basket:toggle');
        });
    }
    set counter(value: number) {
        this.counterElement.textContent = value.toString();
    }
}