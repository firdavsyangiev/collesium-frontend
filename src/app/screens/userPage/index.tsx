import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAssetUrl } from "../../../lib/config";
import { getApiErrorMessage } from "../../../lib/errors";
import LoginModal from "../authPage/LoginModal";
import SignupModal from "../authPage/SignupModal";
import "../../../css/user-page.css";

export default function UserPage() {
  const { member, isAuthLoading, updateMember, logout } = useAuth();
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberAddress, setMemberAddress] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!member) return;
    setMemberNick(member.memberNick);
    setMemberPhone(member.memberPhone);
    setMemberAddress(member.memberAddress ?? "");
    setMemberDesc(member.memberDesc ?? "");
    if (!memberImage) setImagePreview(getAssetUrl(member.memberImage));
  }, [member, memberImage]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (isAuthLoading) {
    return <main className="profile-state">LOADING PROFILE...</main>;
  }

  if (!member) {
    return (
      <main className="profile-auth-required">
        <span className="eyebrow">MEMBER AREA</span>
        <h1>ENTER THE ARENA</h1>
        <p>Log in to manage your profile, points and orders.</p>
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

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setMemberImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const input = new FormData();
    input.append("memberNick", memberNick.trim());
    input.append("memberPhone", memberPhone.trim());
    input.append("memberAddress", memberAddress.trim());
    input.append("memberDesc", memberDesc.trim());
    if (memberPassword) input.append("memberPassword", memberPassword);
    if (memberImage) input.append("memberImage", memberImage);

    try {
      await updateMember(input);
      setMemberPassword("");
      setMemberImage(null);
      setSuccess("Profile updated successfully.");
    } catch (requestError: any) {
      setError(getApiErrorMessage(requestError, "Profile could not be updated."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="profile-page">
      <header className="profile-heading">
        <div>
          <span className="eyebrow">MEMBER PROFILE</span>
          <h1>MY PAGE</h1>
        </div>
        <button type="button" onClick={() => logout()}>LOGOUT</button>
      </header>

      <div className="profile-layout">
        <aside className="profile-card">
          <div className="profile-avatar">
            {imagePreview ? (
              <img src={imagePreview} alt={`${member.memberNick} profile`} />
            ) : (
              <span>{member.memberNick.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h2>{member.memberNick}</h2>
          <p>{member.memberType} MEMBER</p>
          <div className="profile-points">
            <strong>{member.memberPoints}</strong>
            <span>ATHLETE POINTS</span>
          </div>
          <Link to="/orders">VIEW MY ORDERS →</Link>
        </aside>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-title">
            <div>
              <span>ACCOUNT SETTINGS</span>
              <h2>PERSONAL INFORMATION</h2>
            </div>
            <label className="image-upload">
              CHANGE PHOTO
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="profile-fields">
            <label>
              NICKNAME
              <input value={memberNick} onChange={(event) => setMemberNick(event.target.value)} minLength={2} required />
            </label>
            <label>
              PHONE NUMBER
              <input type="tel" value={memberPhone} onChange={(event) => setMemberPhone(event.target.value)} required />
            </label>
            <label className="wide-field">
              ADDRESS
              <input value={memberAddress} onChange={(event) => setMemberAddress(event.target.value)} placeholder="Your delivery address" />
            </label>
            <label className="wide-field">
              ABOUT YOU
              <textarea value={memberDesc} onChange={(event) => setMemberDesc(event.target.value)} rows={4} placeholder="Tell the community about your training journey" />
            </label>
            <label className="wide-field">
              NEW PASSWORD <small>LEAVE EMPTY TO KEEP CURRENT PASSWORD</small>
              <input type="password" value={memberPassword} onChange={(event) => setMemberPassword(event.target.value)} minLength={6} />
            </label>
          </div>

          {error && <p className="profile-error" role="alert">{error}</p>}
          {success && <p className="profile-success" role="status">{success}</p>}
          <button className="button button-accent profile-save" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </main>
  );
}
