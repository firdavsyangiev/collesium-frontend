import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import OrderService from "../../services/OrderService";
import "../../../css/checkout.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { member } = useAuth();
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<{
    id: string;
    total: number;
  } | null>(null);

  const delivery = subtotal > 0 && subtotal < 100 ? 5 : 0;
  const total = subtotal + delivery;

  if (createdOrder) {
    return (
      <main className="checkout-success">
        <span className="checkout-success-mark">✓</span>
        <span className="eyebrow">ORDER CREATED</span>
        <h1>YOU'RE IN THE GAME</h1>
        <p>
          Your order is waiting for manual payment verification. Once verified,
          the admin will move it into processing.
        </p>
        <div className="created-order-details">
          <span>ORDER ID</span>
          <code>{createdOrder.id}</code>
          <span>TOTAL</span>
          <strong>{formatPrice(createdOrder.total)}</strong>
          <span>STATUS</span>
          <b>PAUSE · WAITING FOR VERIFICATION</b>
        </div>
        <Link className="button button-dark" to="/shop">
          CONTINUE SHOPPING
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-empty">
        <span className="eyebrow">CHECKOUT</span>
        <h1>YOUR CART IS EMPTY</h1>
        <Link className="button button-dark" to="/shop">
          BACK TO SHOP
        </Link>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    if (!paymentConfirmed) {
      setError("Please confirm the manual payment verification terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await OrderService.createOrder(
        {
          items: items.map(({ product, quantity }) => ({
            productId: product._id,
            itemQuantity: quantity,
          })),
          recipientName: String(form.get("recipientName") ?? "").trim(),
          recipientPhone: String(form.get("recipientPhone") ?? "").trim(),
          deliveryAddress: String(form.get("deliveryAddress") ?? "").trim(),
        },
      );

      setCreatedOrder({ id: order._id, total: order.orderTotal });
      clearCart();
    } catch (requestError: any) {
      const status = requestError.response?.status;
      setError(
        status === 401
          ? "Please sign up or log in before placing an order."
          : requestError.response?.data?.message ||
              "Order could not be created. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-heading">
        <Link className="back-to-shop" to="/cart">
          ← BACK TO CART
        </Link>
        <span className="eyebrow">FINAL ROUND</span>
        <h1>CHECKOUT</h1>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-panel">
            <span className="checkout-step">01</span>
            <div>
              <h2>DELIVERY DETAILS</h2>
              <p>Enter the details of the person who will receive this order.</p>
              <div className="delivery-fields">
                <label>
                  RECIPIENT NAME
                  <input
                    defaultValue={member?.memberNick ?? ""}
                    maxLength={80}
                    minLength={2}
                    name="recipientName"
                    placeholder="Full name"
                    required
                  />
                </label>
                <label>
                  PHONE NUMBER
                  <input
                    defaultValue={member?.memberPhone ?? ""}
                    maxLength={24}
                    minLength={7}
                    name="recipientPhone"
                    pattern="[+0-9()\\s-]{7,24}"
                    placeholder="+82 10 1234 5678"
                    required
                    type="tel"
                  />
                </label>
                <label className="delivery-address-field">
                  DELIVERY ADDRESS
                  <textarea
                    defaultValue={member?.memberAddress ?? ""}
                    maxLength={300}
                    minLength={10}
                    name="deliveryAddress"
                    placeholder="Street, building, apartment, city and postal code"
                    required
                    rows={4}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="checkout-panel">
            <span className="checkout-step">02</span>
            <div>
              <h2>REVIEW YOUR ORDER</h2>
              <p>
                Product prices and stock are checked again securely by the
                backend when you place the order.
              </p>
            </div>
          </section>

          <section className="checkout-panel">
            <span className="checkout-step">03</span>
            <div className="payment-copy">
              <h2>MANUAL PAYMENT VERIFICATION</h2>
              <p>
                No real card payment is charged in this version. Your order is
                created with <strong>PAUSE</strong> status and the admin verifies
                payment before fulfillment.
              </p>
              <label className="payment-confirmation">
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(event) =>
                    setPaymentConfirmed(event.target.checked)
                  }
                />
                <span>
                  I reviewed the order and understand that payment will be
                  verified manually.
                </span>
              </label>
              <small>
                Card number and CVC are never requested, sent, or stored.
              </small>
            </div>
          </section>

          {error && (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="button button-accent checkout-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "CREATING ORDER..." : "PLACE ORDER"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>YOUR ORDER</h2>
          <div className="checkout-products">
            {items.map(({ product, quantity }) => (
              <div className="checkout-line" key={product._id}>
                <span>
                  {product.productName}
                  <small>× {quantity}</small>
                </span>
                <strong>
                  {formatPrice(product.productPrice * quantity)}
                </strong>
              </div>
            ))}
          </div>
          <div className="checkout-line checkout-subtotal">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="checkout-line">
            <span>Delivery</span>
            <strong>{delivery === 0 ? "FREE" : formatPrice(delivery)}</strong>
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
