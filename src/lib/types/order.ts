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

export interface OrderCreateInput {
  items: OrderItemRequest[];
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
}

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  orderItems?: OrderItem[];
  productData?: import("./product").Product[];
  createdAt: string;
  updatedAt: string;
}
