import PropTypes from 'prop-types';
import './DeploymentGuide.css';

export default function DeploymentGuide({ steps }) {
  return (
    <section className="deployment" id="deployment-guide">
      <div className="deployment__header">
        <h2>Netlify deployment in five minutes.</h2>
        <p>
          Everything is pre-configured: a netlify.toml file, build commands, and route handling. Follow these steps to deliver a
          production-ready ERP without managing infrastructure.
        </p>
      </div>
      <ol className="deployment__list">
        {steps.map((step, index) => (
          <li key={step.title} className="deployment__item">
            <span className="deployment__badge">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

DeploymentGuide.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
    })
  ).isRequired,
};
