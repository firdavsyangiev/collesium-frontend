import api from "./api";
import { Order, OrderItemRequest } from "../../lib/types/order";

class OrderService {
  public async createOrder(items: OrderItemRequest[]): Promise<Order> {
    const { data } = await api.post<{ order: Order }>("/orders", items);
    return data.order;
  }
}

const orderService = new OrderService();

export default orderService;
