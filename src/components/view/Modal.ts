import { Component } from "./base/Component";
import { IEvents } from "../events/Events";

interface ModalData {
    content: HTMLElement | null;
}

export class Modal extends Component<ModalData> {
    closeButton: HTMLButtonElement;
    contentElement: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close')!;
        this.contentElement = container.querySelector('.modal__content')!;

        this.closeButton.addEventListener('click', () => this.close());

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    set content(element: HTMLElement | null) {
        this.contentElement.innerHTML = '';
        if (element) {
            this.contentElement.append(element);
            this.open();
        } else {
            this.close();
        }
    }

    private open() {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    private close() {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
    }
}