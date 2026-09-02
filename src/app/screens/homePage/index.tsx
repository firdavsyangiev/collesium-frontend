import { useState } from "react";
import { Link } from "react-router-dom";
import SignupModal from "../authPage/SignupModal";

const stats = [
  { value: "50+", label: "Global Stores" },
  { value: "100K+", label: "Athletes Served" },
  { value: "15", label: "Years of Excellence" },
];

export default function HomePage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

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

      <section className="home-intro">
        <span className="eyebrow">ENGINEERED FOR PERFORMANCE</span>
        <h2>Elite gear for every arena</h2>
        <p>
          Performance apparel, training equipment and nutrition selected for athletes who demand more.
        </p>
        <Link className="button button-dark" to="/shop">EXPLORE THE SHOP</Link>
      </section>

      {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
    </main>
  );
}
