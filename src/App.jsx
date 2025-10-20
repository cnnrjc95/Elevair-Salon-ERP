import Hero from './components/Hero.jsx';
import ModuleGrid from './components/ModuleGrid.jsx';
import DeploymentGuide from './components/DeploymentGuide.jsx';
import CallToAction from './components/CallToAction.jsx';
import Footer from './components/Footer.jsx';
import { coreModules, deploymentSteps } from './data/modules.js';

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <ModuleGrid modules={coreModules} />
        <DeploymentGuide steps={deploymentSteps} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
