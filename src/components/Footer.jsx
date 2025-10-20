import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Elevair Salon ERP. Built for salons embracing automation and omnichannel experiences.
      </p>
      <div className="footer__links">
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://status.netlify.com/" target="_blank" rel="noreferrer">
          Netlify Status
        </a>
        <a href="mailto:security@elevair.co">Security</a>
      </div>
    </footer>
  );
}
