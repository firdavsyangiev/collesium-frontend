import { useState } from "react";
import { NavLink } from "react-router-dom";
import { getAssetUrl } from "../../../lib/config";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import LoginModal from "../../screens/authPage/LoginModal";
import SignupModal from "../../screens/authPage/SignupModal";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Order", path: "/orders" },
  { label: "My Page", path: "/my-page" },
  { label: "Community", path: "/community" },
];

export default function Header() {
  const { cartCount } = useCart();
  const { member, isAuthLoading, logout } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const memberImage = getAssetUrl(member?.memberImage);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await logout();
  };

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
          <NavLink className="cart-link" to="/cart" aria-label={`Shopping cart with ${cartCount} items`}>
            Cart
            {cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>
          {isAuthLoading ? (
            <span className="auth-loading">ACCOUNT...</span>
          ) : member ? (
            <div className="member-actions">
              <NavLink className="member-link" to="/my-page" aria-label="My profile">
                {memberImage ? (
                  <img src={memberImage} alt="" />
                ) : (
                  <span>{member.memberNick.charAt(0).toUpperCase()}</span>
                )}
                <b>{member.memberNick}</b>
              </NavLink>
              <button type="button" onClick={handleLogout}>LOGOUT</button>
            </div>
          ) : (
            <div className="guest-actions">
              <button type="button" onClick={() => setAuthModal("login")}>LOGIN</button>
              <button className="signup-link" type="button" onClick={() => setAuthModal("signup")}>SIGN UP</button>
            </div>
          )}
        </div>
      </div>

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitchToSignup={() => setAuthModal("signup")}
        />
      )}
      {authModal === "signup" && (
        <SignupModal
          onClose={() => setAuthModal(null)}
          onSwitchToLogin={() => setAuthModal("login")}
        />
      )}
    </header>
  );
}
