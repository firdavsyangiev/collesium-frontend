import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { getAssetUrl } from "../../../lib/config";
import "../../../css/cart.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartPage() {
  const { items, cartCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const delivery = subtotal > 0 && subtotal < 100 ? 5 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <main className="empty-cart">
        <span className="eyebrow">YOUR ARENA AWAITS</span>
        <h1>YOUR CART IS EMPTY</h1>
        <p>Explore elite gear and nutrition built for your next challenge.</p>
        <Link className="button button-accent" to="/shop">SHOP THE COLLECTION</Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">READY FOR THE NEXT ROUND</span>
          <h1>YOUR CART</h1>
        </div>
        <span>{cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}</span>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          <div className="cart-list-heading">
            <span>PRODUCT</span><span>QUANTITY</span><span>TOTAL</span>
          </div>
          {items.map(({ product, quantity }) => {
            const image = getAssetUrl(product.productImages?.[0]);

            return (
              <article className="cart-item" key={product._id}>
                <Link className="cart-product" to={`/shop/${product._id}`}>
                  <div className="cart-image">
                    {image ? <img src={image} alt={product.productName} /> : <span>COLLESIUM</span>}
                  </div>
                  <div>
                    <small>{product.productCollection}</small>
                    <h2>{product.productName}</h2>
                    <p>{formatPrice(product.productPrice)}</p>
                  </div>
                </Link>

                <div className="cart-quantity">
                  <button type="button" onClick={() => updateQuantity(product._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    disabled={quantity >= product.productLeftCount}
                  >+</button>
                </div>

                <strong className="cart-line-total">{formatPrice(product.productPrice * quantity)}</strong>
                <button className="remove-item" type="button" onClick={() => removeItem(product._id)} aria-label={`Remove ${product.productName}`}>
                  REMOVE
                </button>
              </article>
            );
          })}

          <div className="cart-list-actions">
            <Link to="/shop">← CONTINUE SHOPPING</Link>
            <button type="button" onClick={clearCart}>CLEAR CART</button>
          </div>
        </section>

        <aside className="order-summary">
          <h2>ORDER SUMMARY</h2>
          <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div><span>Delivery</span><strong>{delivery === 0 ? "FREE" : formatPrice(delivery)}</strong></div>
          {subtotal < 100 && (
            <p>Add {formatPrice(100 - subtotal)} more for free delivery.</p>
          )}
          <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button className="checkout-next" type="button" disabled>CHECKOUT COMING NEXT</button>
          <small>Taxes are calculated during checkout.</small>
        </aside>
      </div>
    </main>
  );
}
