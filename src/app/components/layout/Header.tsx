import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Order", path: "/orders" },
  { label: "My Page", path: "/my-page" },
  { label: "Community", path: "/community" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" exact to="/">
          <strong>COLLESIUM</strong>
          <span>ATHLETICS</span>
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.path} exact={item.path === "/"} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions" aria-label="Account actions">
          <NavLink to="/cart" aria-label="Shopping cart">Cart</NavLink>
          <NavLink to="/my-page" aria-label="My profile">Profile</NavLink>
        </div>
      </div>
    </header>
  );
}
