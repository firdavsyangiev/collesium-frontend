import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAssetUrl } from "../../../lib/config";
import { Product, ProductCollection } from "../../../lib/types/product";
import { formatProductSize, requiresProductSize } from "../../../lib/product-utils";
import "../../../css/product-detail.css";
import useCart from "../../hooks/useCart";
import ProductService from "../../services/ProductService";

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
  const [variants, setVariants] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
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
      setSelectedVariant(null);
      setVariants([]);

      try {
        const result = await ProductService.getProduct(productId);
        let productVariants: Product[] = [];

        if (requiresProductSize(result)) {
          const candidates = await ProductService.getProducts({
            limit: 100,
            productCollection: result.productCollection,
            search: result.productName,
          });
          productVariants = candidates
            .filter((candidate) => candidate.productName.toLowerCase() === result.productName.toLowerCase())
            .sort((first, second) =>
              formatProductSize(first).localeCompare(formatProductSize(second), undefined, { numeric: true }),
            );
        }

        if (isCurrent) {
          setProduct(result);
          setVariants(productVariants);
          setSelectedVariant(requiresProductSize(result) ? null : result);
        }
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

  if (isLoading) return <main className="detail-state">LOADING PRODUCT...</main>;

  if (error || !product) {
    return (
      <main className="detail-state">
        <h1>PRODUCT NOT FOUND</h1>
        <p>{error}</p>
        <Link className="button button-dark" to="/shop">BACK TO SHOP</Link>
      </main>
    );
  }

  const needsSize = requiresProductSize(product);
  const activeProduct = selectedVariant || product;
  const hasSelectedSize = !needsSize || Boolean(selectedVariant);
  const images = activeProduct.productImages.map(getAssetUrl).filter(Boolean) as string[];
  const inStock = hasSelectedSize && activeProduct.productLeftCount > 0;

  const selectVariant = (variant: Product) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
    setQuantity(1);
    setAddedMessage("");
  };

  const addToCart = () => {
    if (!hasSelectedSize || !inStock) return;
    addItem(activeProduct, quantity);
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
              <img src={images[Math.min(selectedImage, images.length - 1)]} alt={activeProduct.productName} />
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
                  <img src={image} alt={`${activeProduct.productName} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="eyebrow">{activeProduct.productCollection}</span>
          <h1>{activeProduct.productName}</h1>
          <strong className="detail-price">{formatPrice(activeProduct.productPrice)}</strong>
          <p className="detail-description">{activeProduct.productDesc}</p>

          {needsSize && (
            <div className="size-selector">
              <div><strong>SELECT SIZE</strong><span>{selectedVariant ? formatProductSize(selectedVariant) : "Required"}</span></div>
              <div className="size-options">
                {variants.map((variant) => (
                  <button
                    className={selectedVariant?._id === variant._id ? "active" : ""}
                    disabled={variant.productLeftCount < 1}
                    key={variant._id}
                    type="button"
                    onClick={() => selectVariant(variant)}
                  >
                    {formatProductSize(variant)}
                  </button>
                ))}
              </div>
              {variants.length === 0 && <p>No available sizes were found for this product.</p>}
            </div>
          )}

          <div className="detail-specs">
            {needsSize && (
              <div><span>SIZE</span><strong>{selectedVariant ? formatProductSize(selectedVariant) : "SELECT A SIZE"}</strong></div>
            )}
            {!needsSize && activeProduct.productSize && (
              <div><span>SIZE</span><strong>{formatProductSize(activeProduct)}</strong></div>
            )}
            {activeProduct.productCollection === ProductCollection.NUTRITION && activeProduct.productVolume && (
              <div><span>VOLUME</span><strong>{activeProduct.productVolume} KG</strong></div>
            )}
            <div>
              <span>AVAILABILITY</span>
              <strong>{!hasSelectedSize ? "SELECT SIZE" : activeProduct.productLeftCount > 0 ? `${activeProduct.productLeftCount} IN STOCK` : "SOLD OUT"}</strong>
            </div>
          </div>

          <div className="detail-purchase">
            <div className="quantity-picker" aria-label="Product quantity">
              <button type="button" disabled={!hasSelectedSize} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(activeProduct.productLeftCount, value + 1))}
                disabled={!inStock || quantity >= activeProduct.productLeftCount}
              >+</button>
            </div>
            <button className="button button-accent detail-add" type="button" onClick={addToCart} disabled={!inStock}>
              {!hasSelectedSize ? "SELECT SIZE" : inStock ? "ADD TO CART" : "SOLD OUT"}
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
