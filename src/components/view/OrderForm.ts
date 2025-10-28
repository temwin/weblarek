import { Form } from "./base/Form";
import { IEvents } from "../events/Events";

export interface OrderFormData {
  [key: string]: string;
  payment: "card" | "cash" | "";
  address: string;
}

export class OrderForm extends Form<OrderFormData> {
  paymentButtons: HTMLButtonElement[];
  addressInput: HTMLInputElement;
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.paymentButtons = Array.from(
      container.querySelectorAll('button[name="card"], button[name="cash"]')
    );
    this.addressInput = container.querySelector('input[name="address"]')!;

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.paymentButtons.forEach(b => b.classList.remove("button_alt-active"));
        button.classList.add("button_alt-active");
        this.events.emit("order:paymentChange", { payment: button.name as "card" | "cash" });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:addressChange", { address: this.addressInput.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  setErrors(errors: { payment?: string; address?: string }) {
    const errorMessage = errors.payment || errors.address || '';
    this.setError(errorMessage);
    this.setSubmitEnabled(!errorMessage);
  }

  render(data: OrderFormData) {
    this.paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
    });

    if (data.payment) {
      const activeButton = this.paymentButtons.find(button => button.name === data.payment);
      if (activeButton) {
        activeButton.classList.add("button_alt-active");
      }
    }

    this.addressInput.value = data.address;
    this.setError('');
    
    const hasPayment = !!data.payment;
    const hasAddress = !!data.address.trim();
    this.setSubmitEnabled(hasPayment && hasAddress);
  }
}