# Elevair Salon ERP

A Netlify-ready single page application that showcases the Elevair Salon ERP platform. The project ships with a Vite + React
stack, responsive UI components, and preconfigured Netlify build settings so the experience can be deployed in minutes.

## Getting started

```bash
npm install
npm run dev
```

- Local development runs on <http://localhost:5173> by default.
- Edit any component in `src/` and Vite will hot reload the preview.

## Production build

```bash
npm run build
```

The optimized bundle is emitted to `dist/`. You can preview the output with `npm run preview`.

## Deploying to Netlify

1. Push the repository to GitHub (or another Git provider supported by Netlify).
2. In the Netlify dashboard choose **Add new site → Import an existing project** and select the repository.
3. Netlify reads `netlify.toml` and automatically applies:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Dev server proxy:** forwards Netlify CLI traffic to Vite on port 5173
   - **SPA routing:** rewrites all requests to `index.html`
4. Set any required environment variables under **Site configuration → Environment variables**.
5. Trigger a deploy. Netlify will provision HTTPS, CDN distribution, and preview deploys for pull requests automatically.

## Project structure

```
.
├── index.html
├── netlify.toml
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── App.jsx
    ├── components/
    │   ├── CallToAction.css
    │   ├── CallToAction.jsx
    │   ├── DeploymentGuide.css
    │   ├── DeploymentGuide.jsx
    │   ├── Footer.css
    │   ├── Footer.jsx
    │   ├── Hero.css
    │   ├── Hero.jsx
    │   ├── ModuleGrid.css
    │   └── ModuleGrid.jsx
    ├── data/
    │   └── modules.js
    ├── index.css
    └── main.jsx
```

## Customizing for production teams

- Replace the placeholder sections with live ERP data sources or CMS-driven content.
- Add API integrations or serverless functions under a `/netlify/functions` folder to extend workflow automation without a
  backend server.
- Configure role-based authentication using Netlify Identity or connect to your existing OAuth provider.
- Use Netlify Forms or Edge Functions to capture lead data, customer inquiries, or synchronous booking requests.

## License

MIT
