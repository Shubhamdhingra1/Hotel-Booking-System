import { useState } from "react";
import "./maillist.css";

const MailList = () => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      window.alert("Please enter a valid email address.");
      return;
    }
    setShowSuccess(true);
    setEmail("");
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <>
      <div className="mail" id="newsletter">
        <h1 className="mailTitle">Save time, save money!</h1>
        <span className="mailDesc">Sign up and we&apos;ll send the best deals to you</span>
        <form className="mailInputContainer" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
      {showSuccess && (
        <div className="newsletter-overlay" role="dialog" aria-labelledby="newsletter-success-title">
          <div className="newsletter-modal">
            <div className="newsletter-success-icon">✓</div>
            <h2 id="newsletter-success-title">You&apos;re subscribed!</h2>
            <p>Thanks for joining. We&apos;ll email you our best hotel and travel deals.</p>
            <button type="button" className="newsletter-dismiss" onClick={() => setShowSuccess(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MailList;
