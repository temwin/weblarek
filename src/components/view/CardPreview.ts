import { Card, CardData } from "./base/Card";
import { IEvents } from "../events/Events";
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
    private events: IEvents;
    private currentData: CardPreviewData | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.imageElement = container.querySelector('.card__image')!;
        this.categoryElement = container.querySelector('.card__category')!;
        this.descriptionElement = container.querySelector('.card__text')!;
        this.addButton = container.querySelector('.card__button')!;

        this.addButton.addEventListener('click', () => {
            if (this.currentData) {
                this.events.emit('basket:add', this.currentData);
            }
        })
    }

    setCategory(value: string) {
        this.categoryElement.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.categoryElement.className = `card__category ${categoryClass}`;
        }
    };

    setDescription(value: string) {
        this.descriptionElement.textContent = value;
    };

    render(data: CardPreviewData): HTMLElement {
        super.render(data);
        this.setCategory(data.category);
        this.setDescription(data.description);
        this.currentData = data;
        return this.container;
    }
}