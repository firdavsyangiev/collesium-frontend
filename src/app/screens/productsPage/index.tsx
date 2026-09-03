import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCart from "../../hooks/useCart";
import ProductService from "../../services/ProductService";
import { getAssetUrl } from "../../../lib/config";
import {
  Product,
  ProductCollection,
  ProductInquiry,
  ProductSize,
} from "../../../lib/types/product";
import "../../../css/products.css";

const collections = [
  { label: "All Categories", value: "" },
  { label: "Gym Apparel", value: ProductCollection.APPAREL },
  { label: "Shoes", value: ProductCollection.FOOTWEAR },
  { label: "Nutrition", value: ProductCollection.NUTRITION },
  { label: "Equipment", value: ProductCollection.EQUIPMENT },
  { label: "Accessories", value: ProductCollection.ACCESSORIES },
];

const sizes = [
  { label: "All Sizes", value: "" },
  { label: "XS", value: ProductSize.XS },
  { label: "S", value: ProductSize.SMALL },
  { label: "M", value: ProductSize.MEDIUM },
  { label: "L", value: ProductSize.LARGE },
  { label: "XL", value: ProductSize.XL },
  { label: "XXL", value: ProductSize.XXL },
  { label: "One Size", value: ProductSize.ONE_SIZE },
  { label: "EU 36", value: ProductSize.SHOE_36 },
  { label: "EU 37", value: ProductSize.SHOE_37 },
  { label: "EU 38", value: ProductSize.SHOE_38 },
  { label: "EU 39", value: ProductSize.SHOE_39 },
  { label: "EU 40", value: ProductSize.SHOE_40 },
  { label: "EU 41", value: ProductSize.SHOE_41 },
  { label: "EU 42", value: ProductSize.SHOE_42 },
  { label: "EU 43", value: ProductSize.SHOE_43 },
  { label: "EU 44", value: ProductSize.SHOE_44 },
  { label: "EU 45", value: ProductSize.SHOE_45 },
  { label: "EU 46", value: ProductSize.SHOE_46 },
];

const sorts: Array<{ label: string; order: ProductInquiry["order"]; direction: ProductInquiry["direction"] }> = [
  { label: "Newest", order: "createdAt", direction: "desc" },
  { label: "Popular", order: "productView", direction: "desc" },
  { label: "Price: Low to High", order: "productPrice", direction: "asc" },
  { label: "Price: High to Low", order: "productPrice", direction: "desc" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductsPage() {
  const location = useLocation();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<ProductCollection | "">(() => {
    const requestedCollection = new URLSearchParams(location.search).get("collection");
    return Object.values(ProductCollection).includes(requestedCollection as ProductCollection)
      ? requestedCollection as ProductCollection
      : "";
  });
  const [size, setSize] = useState<ProductSize | "">("");
  const [sortIndex, setSortIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const [addedProductId, setAddedProductId] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const selectedSort = sorts[sortIndex];

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await ProductService.getProducts({
          limit: 100,
          order: selectedSort.order,
          direction: selectedSort.direction,
          ...(collection && { productCollection: collection }),
          ...(size && { productSize: size }),
          ...(search && { search }),
        });

        if (isCurrent) setProducts(result);
      } catch (requestError: any) {
        if (isCurrent) {
          setProducts([]);
          setError(requestError.response?.data?.message || "Products could not be loaded.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      isCurrent = false;
    };
  }, [collection, size, sortIndex, search, requestKey]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setCollection("");
    setSize("");
    setSortIndex(0);
    setSearchInput("");
    setSearch("");
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProductId(product._id);
    window.setTimeout(() => setAddedProductId(""), 1500);
  };

  return (
    <main className="shop-page">
      <section className="shop-heading">
        <div>
          <span className="eyebrow">PREMIUM PERFORMANCE GEAR</span>
          <h1>COLLESIUM ATHLETICS</h1>
        </div>
        <form className="shop-search" onSubmit={handleSearch}>
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit">SEARCH</button>
        </form>
      </section>

      <div className="shop-layout">
        <aside className="shop-filters">
          <div className="filter-title">
            <h2>FILTERS</h2>
            <button type="button" onClick={resetFilters}>RESET</button>
          </div>

          <fieldset>
            <legend>CATEGORIES</legend>
            {collections.map((item) => (
              <label key={item.label}>
                <input
                  checked={collection === item.value}
                  name="collection"
                  type="radio"
                  value={item.value}
                  onChange={() => setCollection(item.value as ProductCollection | "")}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>

          <label className="select-filter">
            SIZE
            <select value={size} onChange={(event) => setSize(event.target.value as ProductSize | "")}>
              {sizes.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </aside>

        <section className="products-section" aria-live="polite">
          <div className="products-toolbar">
            <p>{isLoading ? "Loading products..." : `${products.length} PRODUCTS`}</p>
            <label>
              SORT BY
              <select value={sortIndex} onChange={(event) => setSortIndex(Number(event.target.value))}>
                {sorts.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>
          </div>

          {isLoading && (
            <div className="product-grid" aria-label="Loading products">
              {[0, 1, 2, 3].map((item) => <div className="product-skeleton" key={item} />)}
            </div>
          )}

          {!isLoading && error && (
            <div className="shop-message">
              <h2>WE COULDN'T LOAD THE SHOP</h2>
              <p>{error}</p>
              <button className="button button-dark" type="button" onClick={() => setRequestKey((value) => value + 1)}>
                TRY AGAIN
              </button>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="shop-message">
              <h2>NO PRODUCTS FOUND</h2>
              <p>Try changing the category, size or search term.</p>
              <button className="button button-dark" type="button" onClick={resetFilters}>CLEAR FILTERS</button>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => {
                const image = getAssetUrl(product.productImages?.[0]);

                return (
                  <article className="product-card" key={product._id}>
                    <Link className="product-image-wrap" to={`/shop/${product._id}`}>
                      {image ? (
                        <img src={image} alt={product.productName} />
                      ) : (
                        <div className="product-image-fallback">COLLESIUM</div>
                      )}
                      <span className="product-category">{product.productCollection}</span>
                    </Link>
                    <div className="product-info">
                      <div>
                        <Link to={`/shop/${product._id}`}><h2>{product.productName}</h2></Link>
                        <p>{formatPrice(product.productPrice)}</p>
                      </div>
                      <div className="product-meta">
                        {product.productSize && <span>{product.productSize.replace("ONE_SIZE", "ONE SIZE")}</span>}
                        <span>{product.productLeftCount > 0 ? `${product.productLeftCount} IN STOCK` : "SOLD OUT"}</span>
                      </div>
                      <button
                        className="product-action"
                        type="button"
                        disabled={product.productLeftCount < 1}
                        onClick={() => handleAddToCart(product)}
                      >
                        {product.productLeftCount < 1
                          ? "SOLD OUT"
                          : addedProductId === product._id
                            ? "ADDED TO CART"
                            : "ADD TO CART"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
