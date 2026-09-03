import { FormEvent, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/errors";

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignupModal({
  onClose,
  onSwitchToLogin,
}: SignupModalProps) {
  const { signup } = useAuth();
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
      await signup({ memberNick, memberPhone, memberPassword });
      onClose();
    } catch (requestError: any) {
      setError(getApiErrorMessage(requestError, "Sign up failed. Please try again."));
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
              maxLength={40}
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
              maxLength={24}
              minLength={7}
              pattern="[+0-9()\\s-]{7,24}"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={memberPassword}
              onChange={(event) => setMemberPassword(event.target.value)}
              maxLength={72}
              minLength={8}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-accent button-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "CREATING..." : "SIGN UP"}
          </button>
        </form>
        {onSwitchToLogin && (
          <button className="auth-switch" type="button" onClick={onSwitchToLogin}>
            Already a member? <strong>Log in</strong>
          </button>
        )}
      </section>
    </div>
  );
}
