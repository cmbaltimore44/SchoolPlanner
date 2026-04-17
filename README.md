# School Planner

Modern React + Tailwind school planner app (Dashboard, Calendar, Task Kanban, Courses, AI Study Planner).

## Local Development

This project uses Vite, so **VS Code Live Preview/Live Server will not render source JSX directly**.

Use:

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

For production preview:

```bash
npm run build
npm run preview
```

## GitHub Pages (Automatic)

This repo includes `.github/workflows/deploy-gh-pages.yml`, which:

- builds on every push to `main`
- deploys `dist/` to GitHub Pages automatically

No ongoing terminal maintenance is needed after pushing changes.

### One-time GitHub setup

In your GitHub repo settings:

1. Go to **Settings > Pages**
2. Set **Source** to **GitHub Actions**

After that, each push to `main` redeploys the site.
