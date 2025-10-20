import PropTypes from 'prop-types';
import './ModuleGrid.css';

export default function ModuleGrid({ modules }) {
  return (
    <section className="modules" id="modules">
      <div className="modules__header">
        <h2>Purpose-built modules for ambitious salons.</h2>
        <p>
          Each workspace is optimized for stylists, managers, and owners with guardrails that keep your data clean and workflows
          consistent.
        </p>
      </div>
      <div className="modules__grid">
        {modules.map((module) => (
          <article key={module.name} className="modules__card">
            <h3>{module.name}</h3>
            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

ModuleGrid.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};
