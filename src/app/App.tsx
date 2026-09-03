import { Route, Switch } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import HomePage from "./screens/homePage";
import PlaceholderPage from "./screens/placeholderPage";
import ProductsPage from "./screens/productsPage";
import ProductDetailPage from "./screens/productDetailPage";
import CartPage from "./screens/cartPage";
import CheckoutPage from "./screens/checkoutPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/shop" component={ProductsPage} />
        <Route exact path="/shop/:productId" component={ProductDetailPage} />
        <Route path="/orders" render={() => <PlaceholderPage title="Orders" />} />
        <Route path="/my-page" render={() => <PlaceholderPage title="My Page" />} />
        <Route path="/community" render={() => <PlaceholderPage title="Community" />} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route render={() => <PlaceholderPage title="Page not found" />} />
      </Switch>
      <Footer />
    </div>
  );
}
