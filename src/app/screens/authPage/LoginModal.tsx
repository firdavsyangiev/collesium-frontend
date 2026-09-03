import { FormEvent, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/errors";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

export default function LoginModal({
  onClose,
  onSwitchToSignup,
}: LoginModalProps) {
  const { login } = useAuth();
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ memberPhone, memberPassword });
      onClose();
    } catch (requestError: any) {
      setError(getApiErrorMessage(requestError, "Login failed. Please try again."));
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
        aria-labelledby="login-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="eyebrow">WELCOME BACK</span>
        <h2 id="login-title">Enter the arena</h2>
        <p>Log in with the phone number used during registration.</p>

        <form onSubmit={handleSubmit}>
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
              autoFocus
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={memberPassword}
              onChange={(event) => setMemberPassword(event.target.value)}
              maxLength={72}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-accent button-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
        {onSwitchToSignup && (
          <button className="auth-switch" type="button" onClick={onSwitchToSignup}>
            New to Collesium? <strong>Sign up</strong>
          </button>
        )}
      </section>
    </div>
  );
}
