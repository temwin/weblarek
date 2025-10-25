import { Card, CardData } from './base/Card';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface CardCatalogData extends CardData {
    image: string;
    category: string;
}

export class CardCatalog extends Card {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.imageElement = container.querySelector('.card__image')!;
        this.categoryElement = container.querySelector('.card__category')!;
    }

    setCategory(value: string) {
        this.categoryElement.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.categoryElement.className = `card__category ${categoryClass}`;
        }
    };

    render(data: CardCatalogData): HTMLElement {
        super.render(data);
        this.setCategory(data.category);

        let fullPath = `${CDN_URL}${data.image}`;
        if (fullPath.endsWith(".svg")) fullPath = fullPath.replace(".svg", ".png");

        this.imageElement.src = fullPath;
        this.imageElement.alt = data.title;
        return this.container;
    }
}