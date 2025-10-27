import { IApi, IProduct, IApiOrderRequest } from "../../../types";

export interface IApiOrderResponse {
  id: string;
  total: number;
}

export class Communication {
  api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>("/product/");
    return response.items;
  }

  async sendOrder(order: IApiOrderRequest): Promise<IApiOrderResponse> {
    return this.api.post<IApiOrderResponse>("/order", order, "POST");
  }
}
