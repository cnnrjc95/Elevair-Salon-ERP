import './CallToAction.css';

export default function CallToAction() {
  return (
    <section className="cta">
      <div className="cta__content">
        <h2>Ship new salon experiences faster.</h2>
        <p>
          Connect Netlify forms, payments, or serverless functions to trigger automations across your ERP stack—without touching
          infrastructure.
        </p>
      </div>
      <div className="cta__actions">
        <a className="cta__link" href="https://docs.netlify.com/" target="_blank" rel="noreferrer">
          Explore Netlify docs
        </a>
        <a className="cta__link cta__link--secondary" href="mailto:success@elevair.co">
          Talk to our onboarding team
        </a>
      </div>
    </section>
  );
}
