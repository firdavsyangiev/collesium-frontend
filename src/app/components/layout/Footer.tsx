import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-column">
          <Link className="footer-brand" to="/" aria-label="Collesium Athletics home">
            <strong>COLLESIUM</strong>
            <span>ATHLETICS</span>
          </Link>
          <p>
            Premium fitness gear and elite nutrition built for athletes who
            demand raw power and technical precision.
          </p>
        </div>

        <nav className="footer-column" aria-label="Explore Collesium">
          <strong>EXPLORE</strong>
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/my-page">My Page</Link>
          <Link to="/community">Community</Link>
        </nav>

        <nav className="footer-column" aria-label="Customer support">
          <strong>SUPPORT</strong>
          <Link to="/community?tab=terms">Community Guidelines</Link>
          <Link to="/community?tab=faq">Frequently Asked Questions</Link>
          <Link to="/community?tab=contact">Contact Us</Link>
        </nav>

        <div className="footer-contact-column">
          <strong>CONNECT</strong>
          <a href="mailto:support@collesium.com">support@collesium.com</a>
          <p>Built for athletes worldwide.</p>
          <small>© {new Date().getFullYear()} Collesium Athletics.<br />All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
