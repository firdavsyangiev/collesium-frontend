import { ReactNode, useState } from "react";
import useAuth from "../../hooks/useAuth";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { member, isAuthLoading } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  if (isAuthLoading) {
    return <main className="auth-guard-state">CHECKING YOUR ACCOUNT...</main>;
  }

  if (member) return <>{children}</>;

  return (
    <main className="auth-guard">
      <span className="eyebrow">MEMBERS ONLY</span>
      <h1>ENTER THE ARENA</h1>
      <p>Log in to continue with your orders and checkout.</p>
      <div>
        <button className="button button-accent" type="button" onClick={() => setAuthModal("login")}>LOG IN</button>
        <button className="button button-dark" type="button" onClick={() => setAuthModal("signup")}>SIGN UP</button>
      </div>
      {authModal === "login" && (
        <LoginModal onClose={() => setAuthModal(null)} onSwitchToSignup={() => setAuthModal("signup")} />
      )}
      {authModal === "signup" && (
        <SignupModal onClose={() => setAuthModal(null)} onSwitchToLogin={() => setAuthModal("login")} />
      )}
    </main>
  );
}
