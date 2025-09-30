import { IBuyer } from "../../../types";

export class Customer {
  payment?: "card" | "cash";
  email?: string;
  phone?: string;
  address?: string;

  constructor() {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
  }

  saveField(field: keyof IBuyer, value: string | "card" | "cash"): void {
    (this as any)[field] = value;
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
  }

  validate(): { [K in keyof IBuyer]?: string } {
    const errors: { [K in keyof IBuyer]?: string } = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.email) errors.email = "Укажите email";
    if (!this.phone) errors.phone = "Укажите телефон";
    if (!this.address) errors.address = "Укажите адрес";

    return errors;
  }
}
