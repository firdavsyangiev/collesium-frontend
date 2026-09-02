import { Route, Switch } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import HomePage from "./screens/homePage";
import PlaceholderPage from "./screens/placeholderPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/shop" render={() => <PlaceholderPage title="Shop" />} />
        <Route path="/orders" render={() => <PlaceholderPage title="Orders" />} />
        <Route path="/my-page" render={() => <PlaceholderPage title="My Page" />} />
        <Route path="/community" render={() => <PlaceholderPage title="Community" />} />
        <Route path="/cart" render={() => <PlaceholderPage title="Cart" />} />
        <Route render={() => <PlaceholderPage title="Page not found" />} />
      </Switch>
      <Footer />
    </div>
  );
}
