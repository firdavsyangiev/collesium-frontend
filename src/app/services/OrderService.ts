import api from "./api";
import {
  Order,
  OrderItemRequest,
  OrderStatus,
} from "../../lib/types/order";

class OrderService {
  public async createOrder(items: OrderItemRequest[]): Promise<Order> {
    const { data } = await api.post<{ order: Order }>("/orders", items);
    return data.order;
  }

  public async getMyOrders(orderStatus: OrderStatus): Promise<Order[]> {
    const { data } = await api.get<Order[]>("/orders", {
      params: { page: 1, limit: 100, orderStatus },
    });
    return data;
  }

  public async cancelOrder(orderId: string): Promise<Order> {
    const { data } = await api.patch<{ order: Order }>(
      `/orders/${orderId}/cancel`,
    );
    return data.order;
  }
}

const orderService = new OrderService();

export default orderService;
