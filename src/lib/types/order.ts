export enum OrderStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  FINISH = "FINISH",
  DELETE = "DELETE",
}

export interface OrderItemRequest {
  productId: string;
  itemQuantity: number;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  createdAt: string;
  updatedAt: string;
}
