import { FormEvent, useState } from "react";
import MemberService from "../../services/MemberService";

interface SignupModalProps {
  onClose: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await MemberService.signup({ memberNick, memberPhone, memberPassword });
      onClose();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="signup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <span className="eyebrow">JOIN THE MOVEMENT</span>
        <h2 id="signup-title">Create your account</h2>
        <p>Track orders, connect with athletes and earn member points.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Nickname
            <input
              value={memberNick}
              onChange={(event) => setMemberNick(event.target.value)}
              minLength={2}
              required
            />
          </label>
          <label>
            Phone number
            <input
              type="tel"
              value={memberPhone}
              onChange={(event) => setMemberPhone(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={memberPassword}
              onChange={(event) => setMemberPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-accent button-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "CREATING..." : "SIGN UP"}
          </button>
        </form>
      </section>
    </div>
  );
}
