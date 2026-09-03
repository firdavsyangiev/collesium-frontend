import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/OrderService";
import { getAssetUrl } from "../../../lib/config";
import { Order, OrderItem, OrderStatus } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import "../../../css/orders.css";

const tabs = [
  { label: "ACTIVE ORDERS", status: OrderStatus.PAUSE },
  { label: "PROCESSING", status: OrderStatus.PROCESS },
  { label: "FINISHED ORDERS", status: OrderStatus.FINISH },
];

const statusText: Record<OrderStatus, string> = {
  [OrderStatus.PAUSE]: "WAITING FOR VERIFICATION",
  [OrderStatus.PROCESS]: "IN PREPARATION",
  [OrderStatus.FINISH]: "COMPLETED",
  [OrderStatus.DELETE]: "CANCELLED",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getOrderNumber(orderId: string): string {
  return `CA-${orderId.slice(-8).toUpperCase()}`;
}

function findProduct(item: OrderItem, products: Product[]): Product | undefined {
  return products.find((product) => product._id === String(item.productId));
}

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState(OrderStatus.PAUSE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setOrders(await OrderService.getMyOrders(activeStatus));
    } catch (requestError: any) {
      setOrders([]);
      setError(
        requestError.response?.status === 401
          ? "Please sign up or log in to view your orders."
          : requestError.response?.data?.message ||
              "Orders could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const cancelOrder = async (order: Order) => {
    const confirmed = window.confirm(
      `Cancel order ${getOrderNumber(order._id)}? Product stock will be restored.`,
    );
    if (!confirmed) return;

    setCancellingId(order._id);
    setError("");

    try {
      await OrderService.cancelOrder(order._id);
      setOrders((currentOrders) =>
        currentOrders.filter((currentOrder) => currentOrder._id !== order._id),
      );
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "This order could not be cancelled.",
      );
    } finally {
      setCancellingId("");
    }
  };

  return (
    <main className="orders-page">
      <header className="orders-heading">
        <span className="eyebrow">YOUR PERFORMANCE JOURNEY</span>
        <h1>MY ORDERS</h1>
        <p>Track every order from payment verification to completion.</p>
      </header>

      <nav className="order-tabs" aria-label="Order status">
        {tabs.map((tab) => (
          <button
            className={activeStatus === tab.status ? "active" : ""}
            key={tab.status}
            type="button"
            onClick={() => setActiveStatus(tab.status)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="orders-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={loadOrders}>TRY AGAIN</button>
        </div>
      )}

      {isLoading && (
        <div className="orders-list" aria-label="Loading orders">
          {[0, 1].map((item) => <div className="order-skeleton" key={item} />)}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <section className="orders-empty">
          <span>{activeStatus === OrderStatus.PAUSE ? "READY WHEN YOU ARE" : statusText[activeStatus]}</span>
          <h2>NO {tabs.find((tab) => tab.status === activeStatus)?.label}</h2>
          <p>
            {activeStatus === OrderStatus.PAUSE
              ? "Your newly created orders will appear here."
              : "Orders will appear here when their status changes."}
          </p>
          <Link className="button button-dark" to="/shop">EXPLORE THE SHOP</Link>
        </section>
      )}

      {!isLoading && orders.length > 0 && (
        <section className="orders-list">
          {orders.map((order) => {
            const products = order.productData ?? [];
            const items = order.orderItems ?? [];

            return (
              <article className="order-card" key={order._id}>
                <header className="order-card-header">
                  <div>
                    <span>ORDER</span>
                    <h2>#{getOrderNumber(order._id)}</h2>
                    <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                  </div>
                  <div className={`order-status status-${order.orderStatus.toLowerCase()}`}>
                    <span>{order.orderStatus}</span>
                    <strong>{statusText[order.orderStatus]}</strong>
                  </div>
                </header>

                <div className="order-products">
                  {items.map((item) => {
                    const product = findProduct(item, products);
                    const image = getAssetUrl(product?.productImages?.[0]);

                    return (
                      <div className="order-product" key={item._id}>
                        <div className="order-product-image">
                          {image ? (
                            <img src={image} alt={product?.productName ?? "Product"} />
                          ) : (
                            <span>COLLESIUM</span>
                          )}
                        </div>
                        <div className="order-product-copy">
                          <small>{product?.productCollection ?? "PRODUCT"}</small>
                          <h3>{product?.productName ?? "Product unavailable"}</h3>
                          <p>{product?.productDesc ?? "Product details are no longer available."}</p>
                          <div>
                            <span>QTY: {item.itemQuantity}</span>
                            <strong>{formatPrice(item.itemPrice * item.itemQuantity)}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <footer className="order-card-footer">
                  <div>
                    <span>DELIVERY</span>
                    <strong>{order.orderDelivery === 0 ? "FREE" : formatPrice(order.orderDelivery)}</strong>
                  </div>
                  <div>
                    <span>ORDER TOTAL</span>
                    <strong>{formatPrice(order.orderTotal)}</strong>
                  </div>
                  {order.orderStatus === OrderStatus.PAUSE && (
                    <button
                      type="button"
                      disabled={cancellingId === order._id}
                      onClick={() => cancelOrder(order)}
                    >
                      {cancellingId === order._id ? "CANCELLING..." : "CANCEL ORDER"}
                    </button>
                  )}
                </footer>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
