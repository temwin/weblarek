import { Form } from "./base/Form";
import { IEvents } from "../events/Events";

export interface ContactsFormData {
    [key: string]: string;
    email: string;
    phone: string;
}

export class ContactsForm extends Form<ContactsFormData> {
    emailInput: HTMLInputElement;
    phoneInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    private events: IEvents;


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this.emailInput = container.querySelector('input[name="email"]')!;
        this.phoneInput = container.querySelector('input[name="phone"]')!;
        this.submitButton = container.querySelector('button[type="submit"]')!;

        [this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('input', () => this.validate());
        });

        this.validate();

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validate();
            if (!this.submitButton.disabled) {
                this.events.emit('contacts:submit', this.getData());
            }
        });
    }

    private validate() {
        const emailFilled = this.emailInput.value.trim() !== '';
        const phoneFilled = this.phoneInput.value.trim() !== '';

        if (!emailFilled || !phoneFilled) {
            this.setError('Заполните все поля');
        } else {
            this.setError('');
        }
        this.setSubmitEnabled(emailFilled && phoneFilled && this.errorElement.textContent === '');
    }

    setEmail(value: string) {
        this.emailInput.value = value;
    }

    setPhone(value: string) {
        this.phoneInput.value = value;
    }

    getData(): ContactsFormData {
        return {
            ...super.getData(),
            email: this.emailInput.value,
            phone: this.phoneInput.value,
        }
    }
}