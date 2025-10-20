export const coreModules = [
  {
    name: 'Appointment Scheduling',
    description:
      'Centralized booking calendar with automated reminders, resource allocation, and stylist availability management.',
  },
  {
    name: 'Point of Sale',
    description:
      'Unified checkout that supports retail, services, memberships, and gift cards with real-time inventory sync.',
  },
  {
    name: 'Inventory Control',
    description:
      'Track consumables and retail stock with smart reorder points, supplier integration, and usage analytics.',
  },
  {
    name: 'Team Management',
    description:
      'Manage rosters, commissions, certifications, and KPI dashboards for stylists and support staff.',
  },
  {
    name: 'Customer CRM',
    description:
      'Consolidated guest profiles, visit history, personalized marketing campaigns, and loyalty tiers.',
  },
  {
    name: 'Financials & Reporting',
    description:
      'Daily cash reconciliation, P&L snapshots, and export-ready compliance reports tailored for salons.',
  },
];

export const deploymentSteps = [
  {
    title: 'Connect GitHub Repository',
    detail:
      'Push this project to GitHub and select the repository inside the Netlify dashboard. Netlify automatically detects Vite and React.',
  },
  {
    title: 'Configure Build Settings',
    detail:
      'Netlify reads netlify.toml to run `npm run build` and publish the generated dist/ directory.',
  },
  {
    title: 'Set Environment Variables',
    detail:
      'If you integrate third-party services (booking, payments), define them under Site settings → Build & deploy → Environment.',
  },
  {
    title: 'Enable Netlify Forms & Functions',
    detail:
      'Add form endpoints or serverless functions under the /netlify directory to extend ERP workflows without separate hosting.',
  },
  {
    title: 'Automate Preview Deployments',
    detail:
      'Each pull request generates a preview URL so salon managers can validate changes before they go live.',
  },
];
