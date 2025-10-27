import { Form } from "./base/Form";
import { IEvents } from "../events/Events";
import { Customer } from "../models/Customer";

export interface OrderFormData {
  [key: string]: string;
  payment: "card" | "cash" | "";
  address: string;
}

export class OrderForm extends Form<OrderFormData> {
  paymentButtons: HTMLButtonElement[];
  addressInput: HTMLInputElement;
  private events: IEvents;
  private customer: Customer;
  private errorMessage: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents, customer: Customer) {
    super(container);
    this.events = events;
    this.customer = customer;

    this.paymentButtons = Array.from(
      container.querySelectorAll('button[name="card"], button[name="cash"]')
    );
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.errorMessage = container.querySelector('.form__errors')!;

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.customer.saveField("payment", button.name as "card" | "cash");
        this.render(this.customer.getData());
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.customer.saveField("address", this.addressInput.value);
      this.render(this.customer.getData());
    });

    // Сабмит формы
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.checkForm()) {
        this.events.emit("order:submit", this.customer.getData());
      }
    });

    // Инициализация состояния кнопки
    this.render(this.customer.getData());
  }

  checkForm(): boolean {
    const errors = this.customer.validate();

    if (errors.payment) {
      this.errorMessage.textContent = errors.payment;
    } else if (errors.address) {
      this.errorMessage.textContent = errors.address;
    } else {
      this.errorMessage.textContent = "";
    }

    const isValid = !errors.payment && !errors.address;
    this.setSubmitEnabled(isValid);
    return isValid;
  }

  render(data: OrderFormData) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        "button_alt-active",
        button.name === data.payment
      );
    });

    this.addressInput.value = data.address;

    this.checkForm();
  }
}