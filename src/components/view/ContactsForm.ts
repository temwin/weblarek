import { Form } from "./base/Form";
import { IEvents } from "../events/Events";
import { Customer } from "../models/Customer";

export interface ContactsFormData {
  [key: string]: string;
  email: string;
  phone: string;
}

export class ContactsForm extends Form<ContactsFormData> {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  private events: IEvents;
  private customer: Customer;
  private errorMessage: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents, customer: Customer) {
    super(container);
    this.events = events;
    this.customer = customer;

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;
    this.errorMessage = container.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => {
      this.customer.saveField('email', this.emailInput.value);
      this.updateFormState();
    });
    
    this.phoneInput.addEventListener('input', () => {
      this.customer.saveField('phone', this.phoneInput.value);
      this.updateFormState();
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.updateFormState()) {
        this.events.emit('contacts:submit', {
          email: this.emailInput.value.trim(),
          phone: this.phoneInput.value.trim(),
        });
      }
    });
  }

  private updateFormState(): boolean {
    const emailFilled = !!this.emailInput.value.trim();
    const phoneFilled = !!this.phoneInput.value.trim();
    let message = "";
  
    if (emailFilled && !phoneFilled) {
      message = "Укажите телефон";
    } else if (!emailFilled && phoneFilled) {
      message = "Укажите email";
    }
  
    this.errorMessage.textContent = message;
  
    const isValid = emailFilled && phoneFilled;
    this.setSubmitEnabled(isValid);
    return isValid;
  }

  render(data: ContactsFormData) {
    this.emailInput.value = data.email ?? '';
    this.phoneInput.value = data.phone ?? '';
    this.errorMessage.textContent = '';
    this.setSubmitEnabled(false);
  }
}