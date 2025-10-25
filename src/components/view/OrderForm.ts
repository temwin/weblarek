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
  step1NextButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.paymentButtons = Array.from(
      container.querySelectorAll('button[name="card"], button[name="cash"]')
    );
    this.addressInput = container.querySelector('input[name="address"]')!;
    this.step1NextButton = container.querySelector(".order__button")!;

    this.setupStep1();
  }

  // === выбор способа оплаты ===
  setPayment(payment: "card" | "cash") {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === payment);
    });
    this.updateStep1Button();
  }

  getPayment(): "card" | "cash" | "" {
    const activeButton = this.paymentButtons.find((button) =>
      button.classList.contains("button_alt-active")
    );
    return activeButton ? (activeButton.name as "card" | "cash") : "";
  }

  // === заполнение адреса ===
  setAddress(value: string) {
    this.addressInput.value = value;
    this.updateStep1Button();
  }

  // === собрать данные ===
  getData(): OrderFormData {
    return {
      payment: this.getPayment(),
      address: this.addressInput.value.trim(),
    };
  }

  // === логика шага 1 ===
  private setupStep1() {
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.setPayment(button.name as "card" | "cash")
      );
    });

    this.addressInput.addEventListener("input", () =>
      this.updateStep1Button()
    );
    this.updateStep1Button();
  }

  private updateStep1Button() {
    const paymentSelected = this.getPayment() !== "";
    const addressFilled = this.addressInput.value.trim() !== "";

    if (paymentSelected && !addressFilled) {
      this.setError("Необходимо указать адрес");
    } else {
      this.setError("");
    }

    this.step1NextButton.disabled = !(paymentSelected && addressFilled);
  }
}
