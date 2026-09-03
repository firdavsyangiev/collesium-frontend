import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCart from "../../hooks/useCart";
import ProductService from "../../services/ProductService";
import { getAssetUrl } from "../../../lib/config";
import { Product, ProductCollection } from "../../../lib/types/product";
import "../../../css/product-detail.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await ProductService.getProduct(productId);
        if (isCurrent) setProduct(result);
      } catch (requestError: any) {
        if (isCurrent) {
          setError(requestError.response?.data?.message || "Product could not be loaded.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadProduct();
    return () => {
      isCurrent = false;
    };
  }, [productId]);

  if (isLoading) {
    return <main className="detail-state">LOADING PRODUCT...</main>;
  }

  if (error || !product) {
    return (
      <main className="detail-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error}</p>
        <Link className="button button-dark" to="/shop">BACK TO SHOP</Link>
      </main>
    );
  }

  const images = product.productImages.map(getAssetUrl).filter(Boolean) as string[];
  const inStock = product.productLeftCount > 0;

  const addToCart = () => {
    addItem(product, quantity);
    setAddedMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to your cart.`);
    window.setTimeout(() => setAddedMessage(""), 2200);
  };

  return (
    <main className="product-detail-page">
      <Link className="back-to-shop" to="/shop">← BACK TO SHOP</Link>

      <section className="product-detail-layout">
        <div className="product-gallery">
          <div className="detail-main-image">
            {images.length > 0 ? (
              <img src={images[selectedImage]} alt={product.productName} />
            ) : (
              <div>COLLESIUM</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((image, index) => (
                <button
                  className={selectedImage === index ? "active" : ""}
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.productName} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="eyebrow">{product.productCollection}</span>
          <h1>{product.productName}</h1>
          <strong className="detail-price">{formatPrice(product.productPrice)}</strong>
          <p className="detail-description">{product.productDesc}</p>

          <div className="detail-specs">
            {product.productSize && (
              <div><span>SIZE</span><strong>{product.productSize.replace("ONE_SIZE", "ONE SIZE")}</strong></div>
            )}
            {product.productCollection === ProductCollection.NUTRITION && product.productVolume && (
              <div><span>VOLUME</span><strong>{product.productVolume} KG</strong></div>
            )}
            <div><span>AVAILABILITY</span><strong>{inStock ? `${product.productLeftCount} IN STOCK` : "SOLD OUT"}</strong></div>
          </div>

          <div className="detail-purchase">
            <div className="quantity-picker" aria-label="Product quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(product.productLeftCount, value + 1))}
                disabled={!inStock || quantity >= product.productLeftCount}
              >+</button>
            </div>
            <button className="button button-accent detail-add" type="button" onClick={addToCart} disabled={!inStock}>
              {inStock ? "ADD TO CART" : "SOLD OUT"}
            </button>
          </div>

          {addedMessage && (
            <div className="added-message" role="status">
              {addedMessage} <Link to="/cart">VIEW CART</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
