import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../../../lib/config";
import { Product, ProductCollection } from "../../../lib/types/product";
import "../../../css/home.css";
import useCart from "../../hooks/useCart";
import ProductService from "../../services/ProductService";
import SignupModal from "../authPage/SignupModal";

const stats = [
  { value: "50+", label: "Global Stores" },
  { value: "100K+", label: "Athletes Served" },
  { value: "15", label: "Years of Excellence" },
];

const categories = [
  {
    name: "Gym Apparel",
    collection: ProductCollection.APPAREL,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHncn-4Xyx3bDv_cMZIMeqS9jGQqa_rQZb6B8EmLJmShEspqHWi5EPZ1IVSk6Iv8K2OFUYGo6MY-P_LtC9xFCX9rgD9JyUCdata74P-RlrXpexHQW7RRTp3YYq_udCXRgsSsCqFkemCGR297nGReJRJTtto3iy2AuBnU22UNutPE7E5_rkSg-qMCJfOSEMeyAV4nRs02QKZEBpdcg3M2DgVAiJpgJXeOEehltrCl88yBg4_0NB8c0",
    wide: true,
  },
  {
    name: "Running Shoes",
    collection: ProductCollection.FOOTWEAR,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPm-QcBNVzVQNv8PaWVxYLS1Yz-jIBByzMI1R2wRdTeSHQAibj_02fCxbhsPejLhDmYzDRcJe5pCFsEYXgnCDPk7Y5R31TfMPT_GjFn_xAEdTf-oOioP9W1XYoNJosxpQst5daloh4JUqVvq9IFFAsAgga0ma7Bv7Y-i3RS6mU9e_BDVhpZtDq1KWE-OHpkxasV9byDvxTvtrtvr5bHq9XTY-0sUz-5uJSoyI48E_pyZdOsGwf380",
  },
  {
    name: "Sports Nutrition",
    collection: ProductCollection.NUTRITION,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuButihjnAOI9xDizbnxJp61jo4D2PAjJG_pl2gONdXG_CsJoBiOrKOFrKRUCBFivpeOyg_qnXs_kEobExgYKGdF5RgsUjrAJT44PjQGbGasxpFuD_iHRgMDQbGTINCyC1SADLPbJDMxhpZ3rRBRBLIoST0RRJ_8vYl8FgOPOXHHAvGcuCRQqbrBS1Wo7jAwnkGZQulVlxH3VI42FhQAtorPTIcxQO8dKw5U0ADpTwL1ULXzO1zv6b4",
  },
  {
    name: "Training Equipment",
    collection: ProductCollection.EQUIPMENT,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT4IUHL-fS1SZliRmgUhAvUNaIX3WBEjuRa04eo9nv06Ak6zWR7UuYav6OsarO7fsdWHbbIkv_Rjv_23sVdNveMHCDPh34rSriCd28YZRJXyoRhWa5mNnxAlpU47dvK6jWih67VQYgl290jnL6fgPP34wPmgFO3GhDp4KjDP6SFa4d-7ANEE65ImCpukaGDpKxyDbC6G82Y8YskBVnFw4iIoJUckedWVILjAJLRjuEVPDIUL9MCTw",
    wide: true,
  },
];

const athletes = [
  {
    name: "Marcus Vance",
    discipline: "Powerlifting",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAbmqHGdsPcgErMkJoRnHQEmrGkFIzla1VPdz27gyl5lDCHmBO5k5CpW0fN8NwzHNHzc_qm5h11wT6D7SpgCEWyeDBv6ya9-0BfAslkmW3IHnIHxpMMyP7rsvxA8jkM4_WDLqiFwqDEz2pkoM4EOatSAu_HHkrIWlgk65J0c4yolrFli5NGyL-oBqJDGIBpwxPwpGUogc1GZKSO70-ENB3Hd6v9cCc5WQzfG1zDjgAUrjfRlBq050",
  },
  {
    name: "Sarah Jenkins",
    discipline: "CrossFit",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE6FWkW1H3I8t9cI3D_eoVqbuj-0xnceKQOHt2hxU7Db0noyy6P1qeFORNnGj-T1kuh2wZdnGUyCb9M0StZIC5objK5WtAenLU4iLK3OTG2xegiPByomz86432quRw1DMnTNek3XLyiG-m6sqIwcVUov0UsiX0r0Xid9IjvMkLF0udGR5kVI6KQI-cKDY25jZusKr7mXq_N4InA4i88R93qaAbFIi96xWRlokHe6BcvdVmhxlPNB8",
  },
  {
    name: "David Chen",
    discipline: "Endurance Running",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8kDc1jYXf1PB8F4FyKipOIx4sXI8UdIXxOgs-NQMZAslR4HXly3uGmyL9i4ZLKfJxRm99YNx2n2y8yJo7I2iM_AvkBegkPlU_TjSSE2Pp7iKEoPoKxv-TzT5CMwJ9NBavjYzqpa-aCeALEa63jlmusOQ287BcGA96i1fYBMFJjcex9J8-6sReHnZ7hL8Agac6D2SpBHOzY1gCiO8TMTqk6ImGRRleg4scmnVIytilBwXNgawjG04",
  },
];

const enduranceImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGFbyBHrJNOc2osnkenjjarrMg2Edolbo_0PeQeKiwBclFVI4WR-8u9Do7ezLxZByski-Bjf_0T7U6rNAcClmVLR-pqL3hFN-Ht-Kpbhaa8U3Jo_xVh-xHIILSlyvZscMLgys5oJaLGZRJ4kYeAJlqr7_sUUJl_OyCZvMaDb8EIsdCKvc9wXmuHTVcQnX5fpUwPv_2in1cnO3dqjZQY2zO6SEADdeIwkat4qJAWKa-XGvwyl3z-CU";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default function HomePage() {
  const { addItem } = useCart();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [addedProductId, setAddedProductId] = useState("");

  useEffect(() => {
    let isCurrent = true;

    ProductService.getProducts({ limit: 4, order: "productView", direction: "desc" })
      .then((result) => {
        if (isCurrent) setProducts(result);
      })
      .catch((error: any) => {
        if (isCurrent) {
          setProductsError(error.response?.data?.message || "Featured products could not be loaded.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProductId(product._id);
    window.setTimeout(() => setAddedProductId(""), 1500);
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow">THE COLLESIUM STANDARD</span>
          <h1>UNLEASH YOUR INNER TITAN</h1>
          <p>Premium Gym Apparel &amp; Elite Nutrition</p>
          <button className="button button-accent" type="button" onClick={() => setIsSignupOpen(true)}>
            SIGN UP
          </button>
        </div>
      </section>

      <section className="stats" aria-label="Collesium statistics">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="home-section home-products" aria-live="polite">
        <div className="home-section-heading">
          <h2>ELITE GEAR</h2>
          <Link to="/shop">VIEW ALL</Link>
        </div>

        {isLoading && (
          <div className="home-product-grid" aria-label="Loading featured products">
            {[0, 1, 2, 3].map((item) => <div className="home-product-skeleton" key={item} />)}
          </div>
        )}

        {!isLoading && productsError && (
          <div className="home-products-message">
            <p>{productsError}</p>
            <Link className="button button-dark" to="/shop">OPEN SHOP</Link>
          </div>
        )}

        {!isLoading && !productsError && products.length === 0 && (
          <div className="home-products-message">
            <p>Products will appear here after they are added by the administrator.</p>
            <Link className="button button-dark" to="/shop">OPEN SHOP</Link>
          </div>
        )}

        {!isLoading && !productsError && products.length > 0 && (
          <div className="home-product-grid">
            {products.map((product) => {
              const image = getAssetUrl(product.productImages?.[0]);

              return (
                <article className="home-product-card" key={product._id}>
                  <Link className="home-product-image" to={`/shop/${product._id}`}>
                    {image ? <img src={image} alt={product.productName} /> : <span>COLLESIUM</span>}
                    <small>{product.productCollection}</small>
                  </Link>
                  <div className="home-product-copy">
                    <Link to={`/shop/${product._id}`}><h3>{product.productName}</h3></Link>
                    <p>{formatPrice(product.productPrice)}</p>
                    <button
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

      <section className="home-section home-categories">
        <div className="home-section-heading"><h2>FEATURED CATEGORIES</h2></div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className={`category-card${category.wide ? " category-card-wide" : ""}`}
              key={category.name}
              to={`/shop?collection=${category.collection}`}
            >
              <img src={category.image} alt="" />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section endurance-section">
        <div className="home-section-heading"><h2>TITAN ENDURANCE</h2></div>
        <div className="endurance-visual">
          <img src={enduranceImage} alt="Athlete training with Collesium performance gear" />
          <div>
            <span className="endurance-play" aria-hidden="true">▶</span>
            <p>BUILT TO GO BEYOND</p>
          </div>
        </div>
      </section>

      <section className="athletes-section">
        <div className="home-section">
          <div className="home-section-heading"><h2>ELITE ATHLETES</h2></div>
          <div className="athlete-grid">
            {athletes.map((athlete) => (
              <article className="athlete-card" key={athlete.name}>
                <div><img src={athlete.image} alt={athlete.name} /></div>
                <h3>{athlete.name}</h3>
                <p>{athlete.discipline}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
    </main>
  );
}
