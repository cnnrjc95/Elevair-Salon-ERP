import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <span className="hero__eyebrow">NETLIFY-READY SALON PLATFORM</span>
        <h1>Launch Elevair ERP with zero server maintenance.</h1>
        <p>
          Elevair centralizes scheduling, POS, inventory, and client engagement in a single cloud-native workspace. Deploy the
          portal to Netlify for instant global availability, automatic HTTPS, and preview builds for every change.
        </p>
        <div className="hero__actions">
          <a className="hero__button hero__button--primary" href="https://app.netlify.com/start" target="_blank" rel="noreferrer">
            Deploy to Netlify
          </a>
          <a className="hero__button hero__button--ghost" href="#deployment-guide">
            Review deployment guide
          </a>
        </div>
      </div>
      <div className="hero__glow" aria-hidden="true" />
    </section>
  );
}
