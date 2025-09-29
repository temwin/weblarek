import { IApi, IProduct, IApiOrderRequest } from "../../../types";

export class Communication {
  api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>("/product/");
    return response.items;
  }

  async sendOrder(order: IApiOrderRequest): Promise<object> {
    return this.api.post("/order", order, "POST");
  }
}
