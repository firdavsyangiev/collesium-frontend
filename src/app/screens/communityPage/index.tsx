import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import communityHeroImage from "../../../assets/community-hero.png";
import "../../../css/community.css";
import CommunityService from "../../services/CommunityService";

type CommunityTab = "terms" | "faq" | "contact";

function getCommunityTab(search: string): CommunityTab {
  const tab = new URLSearchParams(search).get("tab");
  return tab === "faq" || tab === "contact" ? tab : "terms";
}

const guidelines = [
  "Respect the grind. Support other members and protect the athletic integrity of the community.",
  "Training and nutrition advice shared by members is peer-to-peer and does not replace professional consultation.",
  "Unauthorized promotion of third-party supplements or apparel is not allowed in Collesium channels.",
  "Orders and returns follow the Collesium store policy. Products must be returned in their original condition.",
  "By joining Collesium activities, you agree to uphold our standards of discipline, respect and fair play.",
];

const questions = [
  {
    question: "How do I choose the right fit for compression gear?",
    answer: "Compression gear is designed for a close, locked-in fit. Choose your usual size for maximum support, or size up when you prefer more room during training.",
  },
  {
    question: "What is the standard delivery time?",
    answer: "Delivery time depends on the destination and the option selected during checkout. Your current order status is always available on the Orders page.",
  },
  {
    question: "Are my payment details secure?",
    answer: "Collesium currently uses manual payment verification. The store does not ask you to save card details in your Collesium profile.",
  },
  {
    question: "How can I cancel an order?",
    answer: "Open the Orders page and cancel the order while it is still in PAUSE status. Orders already being processed cannot be cancelled from the website.",
  },
];

const heroImage = communityHeroImage;

export default function CommunityPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<CommunityTab>(() => getCommunityTab(location.search));
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [isSending, setIsSending] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(getCommunityTab(location.search));
  }, [location.search]);

  const handleContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contactForm = event.currentTarget;
    setContactError("");
    setContactSuccess(false);
    const form = new FormData(contactForm);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    setIsSending(true);

    try {
      await CommunityService.sendContactMessage({ name, email, message });
      contactForm.reset();
      setContactSuccess(true);
    } catch (requestError: any) {
      setContactError(
        requestError.response?.data?.error?.message ||
          "Your message could not be sent. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="community-page">
      <section className="community-hero">
        <img src={heroImage} alt="Athlete training in a Collesium gym" />
        <div>
          <h1>THE COLLESIUM</h1>
          <p>Resources, support and a community for athletes dedicated to going beyond.</p>
        </div>
      </section>

      <section className="community-content">
        <div className="community-tabs" role="tablist" aria-label="Community information">
          {(["terms", "faq", "contact"] as CommunityTab[]).map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "active" : ""}
              key={tab}
              role="tab"
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === "terms" && (
          <article className="community-panel" role="tabpanel">
            <span className="eyebrow">OUR STANDARD</span>
            <h2>COMMUNITY GUIDELINES</h2>
            <ol className="community-guidelines">
              {guidelines.map((guideline) => <li key={guideline}>{guideline}</li>)}
            </ol>
          </article>
        )}

        {activeTab === "faq" && (
          <div className="community-faq" role="tabpanel">
            {questions.map((item, index) => {
              const isOpen = openQuestion === index;
              return (
                <article className={isOpen ? "open" : ""} key={item.question}>
                  <button
                    aria-expanded={isOpen}
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <b aria-hidden="true">{isOpen ? "−" : "+"}</b>
                  </button>
                  {isOpen && <p>{item.answer}</p>}
                </article>
              );
            })}
          </div>
        )}

        {activeTab === "contact" && (
          <article className="community-panel contact-panel" role="tabpanel">
            <span className="eyebrow">WE ARE HERE TO HELP</span>
            <h2>CONTACT US</h2>
            <p>Send your question to the Collesium support team.</p>
            <form onSubmit={handleContact}>
              <label>
                YOUR NAME
                <input name="name" placeholder="Type your name here" required />
              </label>
              <label>
                YOUR EMAIL
                <input name="email" type="email" placeholder="Type your email here" required />
              </label>
              <label>
                MESSAGE
                <textarea maxLength={2000} minLength={10} name="message" rows={6} placeholder="Your message" required />
              </label>
              {contactError && <p className="contact-message error" role="alert">{contactError}</p>}
              {contactSuccess && <p className="contact-message success" role="status">Your message has been received. Our team will contact you soon.</p>}
              <button className="button button-dark" disabled={isSending} type="submit">{isSending ? "SENDING..." : "SEND MESSAGE"}</button>
            </form>
          </article>
        )}
      </section>
    </main>
  );
}
