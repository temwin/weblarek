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
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:emailChange', { value: this.emailInput.value });
    });
     
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:phoneChange', { value: this.phoneInput.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit', {
        email: this.emailInput.value,
        phone: this.phoneInput.value
      });
    });
  }

  setErrors(errors: { email?: string; phone?: string }) {
    const errorMessage = errors.email || errors.phone || '';
    this.setError(errorMessage);
    this.setSubmitEnabled(!errorMessage);
  }

  render(data: ContactsFormData) {
    this.emailInput.value = data.email ?? '';
    this.phoneInput.value = data.phone ?? '';
    this.setError('');
    this.setSubmitEnabled(false);
  }
}