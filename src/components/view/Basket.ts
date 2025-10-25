import { Component } from "./base/Component";

interface BasketData {
    items: HTMLElement[];
    totalPrice: number;
}

export class Basket extends Component<BasketData> {
    listElement: HTMLElement;
    totalPriceElement: HTMLElement;
    checkoutButton: HTMLButtonElement;
    private totalPrice = 0;

    constructor(container: HTMLElement) {
        super(container);
        this.listElement = container.querySelector('.basket__list')!;
        this.totalPriceElement = container.querySelector('.basket__price')!;
        this.checkoutButton = container.querySelector('.basket__button')!;
    }

    setItems(items: HTMLElement[]) {
        this.listElement.innerHTML = '';
        items.forEach(item => this.listElement.append(item));
    }

    setTotalPrice(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }

    getTotal(): number {
        return this.totalPrice;
    }

    clear() {
        this.listElement.innerHTML = '';
        this.setTotalPrice(0);
    }
}