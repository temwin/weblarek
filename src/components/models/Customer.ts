import { IBuyer } from "../../../types";
import { IEvents } from "../events/Events";

export class Customer {
  private payment?: "card" | "cash";
  private email?: string;
  private phone?: string;
  private address?: string;
  private events: IEvents;

  constructor(events: IEvents) {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
    this.events = events;
  }

  saveField(field: keyof IBuyer, value: string | "card" | "cash"): void {
    (this as any)[field] = value;
    this.events.emit("customer:fieldChanged",  { field, value });
  }

  getData(): IBuyer {
    return {
      payment: this.payment as "card" | "cash",
      email: this.email ?? "",
      phone: this.phone ?? "",
      address: this.address ?? "",
    };
  }

  clear(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
    this.events.emit("customer:cleared");
  }

  validate(): { [K in keyof IBuyer]?: string } {
    const errors: { [K in keyof IBuyer]?: string } = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.email) errors.email = "Укажите email";
    if (!this.phone) errors.phone = "Укажите телефон";
    if (!this.address) errors.address = "Необходимо указать адрес";

    return errors;
  }
}
